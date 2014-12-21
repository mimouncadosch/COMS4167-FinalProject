"use strict";

var x, xdot, theta, thetadot, omegas;
var camera, scene, renderer, origin, quad, view_controls, control;
var state, vertices, lines, g;
var n, n_s, n_s1, n_s2, n_s3, n_s4;
var dir;
var autopilot;

$(window).load(function(){
    $('#myModal').modal('show');
    $('#launch-btn-easy').click(function() {
    	$('#myModal').modal('hide');
		init();
		render();
    });
});

function init () {

	autopilot = false;
	// Scene Settings
	camera = new Camera(100);
	scene = new THREE.Scene();
	renderer = new Renderer();
	document.body.appendChild( renderer.domElement );

	// Set reference axes
	origin = new THREE.Vector3( 0, 0, 0 );
	var axes = buildAxes( 1000 );
	scene.add( axes );
	var arrows = buildArrows(origin);
	for (var i = 0; i < arrows.length; i++) { scene.add(arrows[i]); }

	// Set Controllers
	view_controls = createTrackballControls(1.0, 0.2, 0.8);
	
	// Ground plane & normal
	var d = 0;										// d, or z coordinate of plane
	var plane = new Plane(2500, 2500, 0, 0, d);
	scene.add( plane.plane );
	var planeNormal = plane.getNormal();
	scene.add(drawLine(origin, planeNormal, 0x000000));

	/** Quadcopter object */
	quad = new Quadcopter(10);					// Parameters {wing length}
	scene.add(quad.quad);

	// Initial state of the quadcopter
	x = [0, 0, 3];								// Initialize as an array, faster for transferring across files
	xdot = zeros(3, 1);
	theta = zeros(3,1);							// Pitch, roll, yaw
	thetadot = zeros(3,1);						// Angular velocities (pitch, roll, yaw)
	omegas = zeros(4, 1);						// Angular velocities of left, right, front and rear rotors, respectively
	setMatrix(omegas, 640);

	// Simple Gravity
	g = 9.8;
	var dt = 1;

	// Add scene lines
	lines = createLines(5);
	for (var i = 0; i < 5; i++) {
		scene.add(lines[i].line);
	}
	control = new Control(omegas);
	
}

// Render function
var render = function () {
	state = newSimulate(x, xdot, theta, thetadot, omegas, autopilot);

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
	n_s1 = n.clone();
	n_s2 = n.clone();
	n_s3 = n.clone();
	n_s4 = n.clone();
	
	// console.log(state.thrusts);	
	n_s.multiplyScalar((state.thrusts[0] - 1.2288000000000000) * 10e5 * dir);
	n_s1.multiplyScalar((state.thrusts[1] - 1.2288000000000000) * 10e5 * dir);
	n_s2.multiplyScalar((state.thrusts[2] - 1.2288000000000000) * 10e5 * dir);
	n_s3.multiplyScalar((state.thrusts[3] - 1.2288000000000000) * 10e5 * dir);

	
	// var omegadot_magnitude = numeric(state.omegadot;
	// n_s4.multiplyScalar((state.omegadot.length()));
	// console.log(n_s4);
	
	var src = vertices[5].clone();			// √ D
	var dst = vertices[5].clone().add(n_s);

	var src1 = vertices[4].clone();			// √ A 
	var dst1 = vertices[4].clone().add(n_s1);

	var src2 = vertices[6].clone();			// √ B
	var dst2 = vertices[6].clone().add(n_s2);
	
	var src3 = vertices[2].clone(); 		// √ C
	var dst3 = vertices[2].clone().add(n_s3);

	// var src4 = quad.quad.position.clone();
	// var dst4 = src4.clone().add(n_s4);
	// console.log(dst4);

	lines[0].updateLine(src, dst);			// √ D
	lines[1].updateLine(src1, dst1);		// √ A
	lines[2].updateLine(src2, dst2);		// √ B
	lines[3].updateLine(src3, dst3);		// √ C

	// lines[4].updateLine(src4, dst4);
	
	// Update system values
	x = state.x;
	theta = state.theta;
	
	requestAnimationFrame( render );
	view_controls.update();
	renderer.render(scene, camera);
};
