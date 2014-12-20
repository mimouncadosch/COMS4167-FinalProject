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
 * 		x			: Quad position in inertial frame
 * 		xdot 		: Quad velocity in inertial frame
 * 		theta 		: Pitch, roll, yaw in body frame
 * 		thetadot 	: Angular velocities in body frame
 * 		omegas 		: Angular velocities of the motors
 
 * Outputs:
 * 
 */

// Global vars
var thrusts;

function newSimulate (x, xdot, theta, thetadot, omegas) {
	var g = 9.81;
	var m = 0.5;	// Mass of the vehicle
	var L = 0.25; 	// Distance from center of quad to any of the propellers
	var k = 3e-6; 	// Constant
	var b = 1e-7;	// Constant	
	var I = numeric.diag([5e-3, 5e-3, 10e-3]);
	var k_d = 0.25;
	

	// Compute i = omega^2 {4 x 1 matrix}
	var twos = zeros(4,1);
	setMatrix(twos, 2);
	var i = numeric.pow(omegas, twos);							// Square of angular speeds of the motor
		
	// Compute forces, torques and accelerations
	var omega = thetadot2omega(thetadot, theta); 				// Angular velocity vector
	var a = acceleration(i, theta, xdot, m, g, k, k_d);
	var omegadot = angular_acceleration(i, omega, I, L, b, k);

	// Advance system state
	verifyFormat(omegadot);
	verifyFormat(omega);
	omega = numeric.add(omega, omegadot);

	verifyFormat(theta);
	thetadot = omega2thetadot(omega, theta);
	theta = numeric.add(theta, thetadot);

	verifyFormat(xdot);
	xdot = numeric.add(xdot, a);
	
	verifyFormat(x);		
	x = numeric.add(x, xdot);
	verifyFormat(x);

	omegadot = undoArray(omegadot);
	// Returns the state of the system
	return state = {	"x": x, "theta": theta, "xdot": xdot,
						"thetadot" : thetadot, "thrusts": thrusts, "omegadot" : omegadot
					};
}

/**
 * Compute thrust
 */
function thrust (inputs, k) {
	var rotor_thrusts = numeric.mul(k,inputs);
	thrusts = undoArray(rotor_thrusts);
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

	var phi 	= angles[0][0];
	var theta 	= angles[1][0];
	var psi 	= angles[2][0];

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
	var myThrust = thrust(inputs, k);				// Thrust in the body frame: function of angular velocities of all rotors
	var T = numeric.dot(R, myThrust);				// Corresponds to thrust in the inertial frame
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
	var phi 	= angles[0][0];
	var theta 	= angles[1][0];
	var psi 	= angles[2][0];
	
	var W = [	[1, 0, -sin(theta)],
				[0, cos(phi), cos(theta)*sin(phi)],
				[0, -sin(phi), cos(theta)*cos(phi)]	];

	var thetadot = numeric.dot(numeric.inv(W), omega);
	return thetadot;
}