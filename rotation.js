/**
 * Relates the body and inertial frames
 * From "Quadcopters, Simulation and Control" (Gibiansky): 
 * For a given vector v in the body frame, 
 * the corresponding vector is given by R(v) in the inertial frame
 */
function rotation(angles) {

	if (typeof angles[0].length === 'undefined') {
		var phi 	= angles[2];
		var theta 	= angles[1];
		var psi 	= angles[0];	
	}
	else {
		var phi 	= angles[2][0];
		var theta 	= angles[1][0];
		var psi 	= angles[0][0];	
	}
	

	var R = zeros(3,3);
	R[0] = [cos(phi) * cos(theta), cos(phi) * sin(theta) * sin(psi) - cos(psi) * sin(phi), sin(phi) * sin(psi) + cos(phi) * cos(psi) * sin(theta)];
	R[1] = [cos(theta) * sin(phi), cos(phi) * cos(psi) + sin(phi) * sin(theta) * sin(psi), cos(psi) * sin(phi) * sin(theta) - cos(phi) * sin(psi)];
	R[2] = [- sin(theta), cos(theta) * sin(psi), cos(theta) * cos(psi)];

	return R;

}