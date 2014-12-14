/**
 * Create a controller, either PD or PID
 */
function controller (type, Kd, Kp, Ki) {
	console.log('calling controller');
	if (arguments.length == 1) {
		Kd = 4;
		Kp = 3;
		Ki = 5.5;
	}
	else if (arguments.length == 2 || arguments.length > 4) {
		new Error("Incorrect number of arguments");
	}

	if (type == 'pd') {
		var c = pd_controller(state, thetadot, Kd, Kp);
	}
	else if (type == 'pid') {
		console.log('PID - Coming Soon');
	}
	else {
		console.log('Sorry, unable to recognize controller type');
	}
}

/**
 * PD controler
 */
function pd_controller (state, thetadot, Kd, Kp) {
	// Initialize integral to zero, nonexistent
	if (state.integral == 0) {
		state.integral = zeros(3,1);
	}

	// Compute total thrust
	var total = state.m * state.g / state.k / (cos(state.integral[0]) * cos(state.integral[1]));

	// Compute PD error and inputs
	var err = Kd * thetadot + Kp * state.integral;
	var input = err2inputs(state, err, total);

	// Update the controller state
	// TBD - Vector additions and multiplications
	var dt_thetadot = numeric.mul(state.dt, thetadot);
	state.integral = numeric.sum(state.integral, dt_thetadot);
	return res = {input : input, state : state };
}


/**
 * Given the desired torques, total thrust, and physical parameters, 
 * We solve for required system inputs
 */

function err2inputs (state, err, total) {
	var e1 = err[0];
	var e2 = err[1];
	var e3 = err[2];

	var Ix = state.I[0][0];
	var Iy = state.I[1][1];
	var Iz = state.I[2][2];

	var k = state.k;
	var L = state.L;
	var b = state.b;

	var inputs = zeros(4,1);
	var val1 = total/4 -(2 * b * e1 * Ix + e3 * Iz * k * L)/(4 * b * k * L);
	var val2 = total/4 + e3 * Iz/(4 * b) - (e2 * Iy)/(2 * k * L);
	var val3 = total/4 -(-2 * b * e1 * Ix + e3 * Iz * k * L)/(4 * b * k * L);
	var val4 = total/4 + e3 * Iz/(4 * b) + (e2 * Iy)/(2 * k * L);

	inputs = setVal(inputs, 0, 0, val1);
	inputs = setVal(inputs, 1, 0, val2);
	inputs = setVal(inputs, 2, 0, val3);
	inputs = setVal(inputs, 3, 0, val4);
	
	return inputs;	

}