"use strict";
/**
 * Quadcopter simulation in JavaScript
 * Mimoun Cadosch Delmar 
 * mpc2160 - December 2014
 */

// NOTE: Use numeric.mul for scalar * matrix or scalar * vector
// And numeric.dot for matrix * matrix, matrix * vector, or vector * matrix
/**
 * Perform a simulation of a quadcopter
 *
 * Inputs: 
 * 
 * 		t_max	: Duration of the simulation
 * 		dt 		: timestep
 * Outputs:
 * Data structure with the following values, recorded at each time step during the simulation
 * N - corresponds to number of timesteps
 * 		x 		: Position in inertial frame [3 x N] float
 * 		theta	: Position in body frame [3 x N] float
 * 		vel		: Time derivative of x [3 x N] float
 * 		angVel	: Time derivative of values in theta [3 x N] float
 */

function simulate (t_max, dt) {
	var g = 9.81;
	var m = 0.5;	// Mass of the vehicle
	var L = 0.25; 	// Distance from center of quad to any of the propellers
	var k = 3e-6; 	// Constant
	var b = 1e-7;	// Constant	
	var I = numeric.diag([5e-3, 5e-3, 10e-3]);
	var k_d = 0.25;


	// Simulation times, in seconds.
	if (arguments.length < 4) {
		var dt = 1;
		var t_max = 40;	
	}

	var N = t_max / dt;

	// Initialize program outputs
	// Values will be recorded during program
	var x_out = zeros(3, N);
	var xdot_out = zeros(3, N);
	var theta_out = zeros(3, N);
	var thetadot_out = zeros(3, N);
	var input_out = zeros(4, N);

	// Set controller parameters
	// TBD - matlab l. 48
	var controller_params = { dt: dt, I: I, k: k, L: L, b: b, m: m, g: g };

	// Initial state of the system
	var x = [0, 0, 10];
	var xdot = zeros(3, 1);
	var theta = zeros(3,1);

	// Set controller deviations 
	// If running without a controller, do not disturb the system
	if (arguments.length == 0) {
		var thetadot = zeros(3,1);
	}
	else {
		// With a control, give a random deviation in the angular velocity.
		// Deviation is in degrees / sec
		var deviation = 300;
		// var thetadot = deg2rad(2 * deviation)
	}
	
	var t_s;
	for (var ind = 0; ind < N; ind++) {
		t_s = ind * dt;	// Iterating through timesteps

		/** 
		 * My t_s is equivalent to matlab t 
		 * My t_max is equivalent to matlab ts
		**/
		
		// Get input from built-in input or controller
		if (arguments.length == 0) {
			var i = input(t_s);
		}
		else {
			/**
			 * simulate() is going to be called with parameters
			 * These parameters will be the angular velocities omega
			 */
			var res = pd_controller(controller_params, thetadot);
			var i = res.input;
			var controller_params = res.controller_params;
		}

		// Compute forces, torques and accelerations
		var omega = thetadot2omega(thetadot, theta);
		var a = acceleration(i, theta, xdot, m, g, k, k_d);
		var omegadot = angular_acceleration(i, omega, I, L, b, k);

		// Advance system state
		if (typeof omegadot[0].length === 'undefined') {
			omegadot = makeIntoArray(omegadot);	
		}
		
		if (typeof omega[0].length === 'undefined') {
			omega = makeIntoArray(omega);	
		}
		omega = numeric.add(omega, numeric.mul(omegadot, dt));
		if (typeof theta[0].length === 'undefined') {
				theta = makeIntoArray(theta);	
		}
		thetadot = omega2thetadot(omega, theta);
		theta = numeric.add(theta, numeric.mul(thetadot, dt));

		if (typeof xdot[0].length === 'undefined') {
				xdot = makeIntoArray(xdot);	
		}
		xdot = numeric.add(xdot, numeric.mul(a, dt));
		
		if (typeof x[0].length === 'undefined') {
				x = makeIntoArray(x);	
		}

		x = numeric.add(x, numeric.mul(xdot, dt));

		if (typeof x[0].length === 'undefined') {
					x = makeIntoArray(x);	
		}
		// Store simulation state for output
		x_out = setCol(x_out, ind, x);
		xdot_out = setCol(xdot_out, ind, xdot);
		theta_out = setCol(theta_out, ind, theta);
		thetadot_out = setCol(thetadot_out, ind, thetadot);
		input_out = setCol(input_out, ind, i);
	}

	var result = {	"x": x_out, "theta": theta_out, "vel": xdot_out,
					"angvel" : thetadot_out, "t": t_max, 
					"dt": dt, "input": input_out
				};
}

/**
 * Test input for arbitrary test
 */
function input (t_max) {
	var inp = zeros(4,1);
	setMatrix(inp, 700);
	// Even propellers
	inp = setVal(inp,0,0, inp[0][0] + 150);
	inp = setVal(inp,2,0, inp[2][0] + 150);

	var twos = zeros(4,1);
	setMatrix(twos, 2);
	inp = numeric.pow(inp, twos);

	return inp;
}

/**
 * Compute thrust
 */
function thrust (inputs, k) {
	var T = [[0], [0], [k * sumMatrix(inputs)]];
	return T
}

/**
 * Compute torque
 */
function torques (inputs, L, b, k) {
	var tau = [ L * k * (inputs[0][0] - inputs[2][0]),
			L * k * (inputs[1][0] - inputs[3][0]),
			b * (inputs[0][0] - inputs[1][0] + inputs[2][0] - inputs[3][0])
	];

	return tau;
}

/**
 * Converts angular velocity of roll, pitch, yaw (thetadot)
 * into angular velocity of vector in body frame (omega)
 * Equation 1.1 (Gibiansky)
 */
function thetadot2omega(thetadot, angles) {
	if (typeof angles[0].length === 'undefined') {
		var phi 	= angles[0];
		var theta 	= angles[1];
		var psi 	= angles[2];	
	}
	else {
		var phi 	= angles[0][0];
		var theta 	= angles[1][0];
		var psi 	= angles[2][0];
	}

	var W = [	[1, 0, -Math.sin(theta)],
				[0, Math.cos(phi), Math.cos(theta) * Math.sin(phi)],
				[0, -Math.sin(phi), Math.cos(theta) * Math.cos(phi)]	];

	// var omega = numeric.mul(W,thetadot);
	var omega = numeric.dot(W,thetadot);
	return omega;
}

/**
 * Computes acceleration of the quadcopter in the inertial frame
 * Equation 1.2 (Gibiansky)
 */
function acceleration (inputs, angles, velocities, m, g, k, k_d) {
	var gravity = [[0],[0], [-g]];
	var R = rotation(angles);
	var myThrust = thrust(inputs, k);
	var T = numeric.dot(R,myThrust);
	var Fd = numeric.mul(-k_d,velocities);
	if (typeof Fd[0].length === 'undefined') {
		Fd = makeIntoArray(Fd);
	}
	var T_plus_Fd = numeric.add(T, Fd);
	var m_matrix = zeros(3,1);
	setMatrix(m_matrix, m);
	T_plus_Fd = numeric.div(T_plus_Fd, m_matrix);

	var acc = numeric.add(T_plus_Fd, gravity);
	return acc;
}

/**
 * Computes angular acceleration in the body frame
 * Equiation 1.3 (Gibiansky)
 */
function angular_acceleration (inputs, omega, I, L, b, k) {
	var tau = torques(inputs, L, b, k);
	var I_dot_omega = numeric.dot(I, omega);
	var cross = crossProduct(omega, I_dot_omega);
	var tau_min_cross = numeric.sub(tau, cross);

	var I_inv = numeric.inv(I);
	var omegadot = numeric.dot(I_inv, tau_min_cross);

	return omegadot;
}

/**
 * Converts omega to time-derivatives of roll, pitch and yaw
 * Computes thetadot
 */
function omega2thetadot (omega, angles) {
	// if (typeof angles[0].length === 'undefined') {
	// 	var phi 	= angles[0];
	// 	var theta 	= angles[1];
	// 	var psi 	= angles[2];	
	// }
	// else {
		var phi 	= angles[0][0];
		var theta 	= angles[1][0];
		var psi 	= angles[2][0];
	// }
	
	var W = [	[1, 0, -sin(theta)],
				[0, cos(phi), cos(theta)*sin(phi)],
				[0, -sin(phi), cos(theta)*cos(phi)]	];

	var thetadot = numeric.dot(numeric.inv(W), omega);
	return thetadot;
}

// simulate(10, 0.5);

// A = [[1,2,3],
//      [4,5,6],
//      [7,3,9]];