"use strict";

// Scene Settings
var camera = new Camera(100);
var scene = new THREE.Scene();
var renderer = new Renderer();
document.body.appendChild( renderer.domElement );

// Set reference axes
var origin = new THREE.Vector3( 0, 0, 0 );
var axes = buildAxes( 1000 );
scene.add( axes );
var arrows = buildArrows();
for (var i = 0; i < arrows.length; i++) { scene.add(arrows[i]); }

// Set Controllers
var controls = createTrackballControls(1.0, 0.2, 0.8);

// Ground plane & normal
var d = 0;										// d, or z coordinate of plane
var plane = new Plane(2500, 2500, 0, 0, d);
scene.add( plane.plane );
var planeNormal = plane.getNormal();
scene.add(drawLine(origin, planeNormal, 0x000000));

/** Quadcopter object */
var quad = new Quadcopter(10);					// Parameters {wing length}
scene.add(quad.quad);

// Initial state of the quadcopter
var x = [0, 0, 3];								// Initialize as an array, faster for transferring across files
var xdot = zeros(3, 1);
var theta = zeros(3,1);							// Pitch, roll, yaw
var thetadot = zeros(3,1);						// Angular velocities (pitch, roll, yaw)
var omegas = zeros(4, 1);						// Angular velocities of left, right, front and rear rotors, respectively
setMatrix(omegas, 640);

var state;
var magnitudes = [1,1,1,1];
var thrust_lines = quad.getThrust(magnitudes);

scene.add(thrust_lines[0]);
scene.add(thrust_lines[1]);
scene.add(thrust_lines[2]);
scene.add(thrust_lines[3]);

// Simple Gravity
var g = 9.8;
var dt = 1;

// Listeners
document.addEventListener('keydown', function(event) {
	// if(event.keyCode == 38) {
	// 	console.log('All rotors up');
	// 	for (var i = 0; i < 4; i++) {
	// 		omegas[i][0] += 10;
	// 	}
	// }
	// else if(event.keyCode == 40) {
	// 	console.log('All rotors down');
	// 	for (var i = 0; i < 4; i++) {
	// 		omegas[i][0] -= 10;
	// 	}
	// }
	if (event.keyCode == 38) {
		console.log('pitch forward');
		omegas[0][0] += 0.00001;
		omegas[1][0] += 0.00001;
	}
	else if (event.keyCode == 40) {
		console.log('pitch backward');
		omegas[2][0] += 0.00001;
		omegas[3][0] += 0.00001;
	}
	else if (event.keyCode == 37) {
		console.log('roll left');
		omegas[1][0] += 0.00001;
		omegas[2][0] += 0.00001;
	}
	else if (event.keyCode == 39) {
		console.log('roll right');
		omegas[3][0] += 0.00001;
		omegas[0][0] += 0.00001;
	}
});

var thrust_lines;
// Render function
var render = function () {
	requestAnimationFrame( render );
	controls.update();
	renderer.render(scene, camera);

	state = newSimulate(x, xdot, theta, thetadot, omegas);

	quad.quad.position.x = state.x[0][0];
	quad.quad.position.y = state.x[1][0];
	quad.quad.position.z = state.x[2][0];
	
	

	quad.pitch(state.theta[0][0]);
	quad.roll(state.theta[1][0]);
	quad.yaw(state.theta[2][0]);
	
	// Update system values
	x = state.x;
	theta = state.theta;

};

render();

// quad.quad.position.z += 0.1;
// quad.quad.rotation.x += 0.05;
// quad.quad.rotation.y += 0.05;
// quad.quad.rotation.z += 0.05;
// quad.quad.position.x += 0.1;
// sphere.sphere.rotation.x += 0.1;
// Update velocity
// var collision = detectParticleHalfplane(sphere, plane);

// if (!collision) {
// 	v = v.add(F).multiplyScalar(dt);	
// }
// console.log(collision);
// if (collision) {
	// console.log('collision');
	// v = v.add(respondParticleHalfPlane(v, plane)).multiplyScalar(dt);
	// v = v.add(F).multiplyScalar(dt);
// }

// console.log(v);
// var v2 = v.clone();
// Update position
// sphere.sphere.position.x += v2.multiplyScalar(dt).x;
// sphere.sphere.position.y += v2.multiplyScalar(dt).y;
// sphere.sphere.position.z += v2.multiplyScalar(dt).z;

// console.log(v);
// if (dist - sphere.getRadius() <= 0) {
// 	var n = plane.getNormal();
// 	var v_dot_n = v.dot(n); // = relvel
// 	var n_times_v_dot_n = n.multiplyScalar(v_dot_n);
// 	n_times_v_dot_n.multiplyScalar(-2);
// 	// console.log('min impact');
// 	v = v.add(n_times_v_dot_n);	
// 	// v = v.add(F).multiplyScalar(dt);
// }
// if (sphere. <= 0) {
// 	console.log('planeNormal', planeNormal);
// 	var val = v.dot(planeNormal);
// 	console.log('val', val);
// 	var val2 = planeNormal.multiplyScalar(val);
// 	console.log('val2', val2);
// 	var val3 = val2.multiplyScalar(-2);
// 	console.log('v', v);
// 	console.log('val3', val3);
// 	v = v.add(val3);
// }

// var timer = Date.now() * 0.0005;
// camera.position.x = Math.cos( timer ) * 3;
// camera.position.y = Math.cos( timer ) * -3;
// camera.position.z = Math.sin( timer ) * 3;