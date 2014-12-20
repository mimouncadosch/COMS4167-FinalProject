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

var n;
var vertices;
var state;
var n_s, n_s2, n_s3, n_s4, n_s5;

/**
 * Test lines
 * Goal: to update line position given normal to quad plane
 */

// Add scene lines
var lines = createLines(5);
for (var i = 0; i < 5; i++) {
	scene.add(lines[i].line);
}

// Render function
var render = function () {
		
	state = newSimulate(x, xdot, theta, thetadot, omegas);

	quad.quad.position.x = state.x[0][0];
	quad.quad.position.y = state.x[1][0];
	quad.quad.position.z = state.x[2][0];

	quad.pitch(state.theta[0][0]);
	quad.roll(state.theta[1][0]);
	quad.yaw(state.theta[2][0]);
	
	quad.updateVertices();				// Update vertex positions (necessary)
	vertices = quad.getVertices();		// Get quadcopter vertices
	n = quad.getNormal();				// Get normal to quadcopter plane

	n_s = n.clone();
	n_s2 = n.clone();
	n_s3 = n.clone();
	n_s4 = n.clone();
	n_s5 = n.clone();
	
	n_s.z  += (state.thrusts[0] - 1.2288000000000000) * 10e6;
	n_s2.z += (state.thrusts[1] - 1.2288000000000000) * 10e6;
	n_s3.z += (state.thrusts[2] - 1.2288000000000000) * 10e6;
	n_s4.z += (state.thrusts[3] - 1.2288000000000000) * 10e6;
	n_s5.z += (state.thrusts[4] - 1.2288000000000000) * 10e6;

	// Adjust thrust magnitudes for visualization
	// var adj_thrst = (state.thrusts[0] - 1.2288000000000000) * 10e6;
	

	var src = quad.quad.position.clone();
	var dst = quad.quad.position.clone().add(n_s);

	var src2 = vertices[2].clone();
	var dst2 = vertices[2].clone().add(n_s2);

	var src3 = vertices[4].clone();
	var dst3 = vertices[4].clone().add(n_s3);

	var src4 = vertices[5].clone();
	var dst4 = vertices[5].clone().add(n_s4);
	
	var src5 = vertices[6].clone();
	var dst5 = vertices[6].clone().add(n_s5);

	lines[0].updateLine(src, dst)
	lines[1].updateLine(src2, dst2);
	lines[2].updateLine(src3, dst3);
	lines[3].updateLine(src4, dst4);
	lines[4].updateLine(src5, dst5);
	
	// Update system values
	x = state.x;
	theta = state.theta;
	
	requestAnimationFrame( render );
	controls.update();
	renderer.render(scene, camera);
};

render();

// console.log(n);
// console.log(p0);
// console.log(p1);
// thrust_lines.axis.position.x += 0.1;
// console.log(thrust_lines.axis.matrix.elements);
// thrust_lines.axis.matrix.elements[12] += 0.1; // doesn't work
// thrust_lines.axis.updateMatrix(); // doesn't work
// console.log(quad.quad);
// for (var i = 0; i < 16; i++) {
	// thrust_lines.axis.matrix.elements[i] += 0.2;
	// quad.quad.matrixWorld.elements[i] += 0.2;
// }
// quad.quad.updateMatrix();
// console.log(thrust_lines.axis.);

// USE -> .applyMatrix ( matrix )

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

// var clock = new THREE.Clock();
// var delta = clock.getDelta(), time = clock.getElapsedTime() * 10;
// var timer = Date.now() * 0.0005;
// camera.position.x = Math.cos( timer ) * 3;
// camera.position.y = Math.cos( timer ) * -3;
// camera.position.z = Math.sin( timer ) * 3;
// var thrust_lines = quad.getThrust(magnitudes);

// scene.add(thrust_lines[0]);
// scene.add(thrust_lines[1]);
// scene.add(thrust_lines[2]);
// scene.add(thrust_lines[3]);