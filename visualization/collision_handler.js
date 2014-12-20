// Returns true if the two objects overlap and are approaching.
function detectParticleHalfplane (sphere, plane) {
	var dist = plane.math_plane.distanceToSphere(sphere.math_sphere);
	
	if (dist - sphere.getRadius() <= 0) {
		// console.log('in thresh');
		var n = plane.getNormal();
		var relativeVel = v.dot(n);
		console.log(relativeVel);
		if (relativeVel < 0) {
			return true;
		}
	}
	return false;
}

function respondParticleHalfPlane (v, plane) {
	var COR = 1;
	var cfactor = (1.0 + COR) /2.0;

	var n = plane.getNormal();
	var v_dot_n = v.dot(n) * cfactor;
	
	// Velocity to add to create impulse
	var v_add = n.multiplyScalar(v_dot_n);
	v_add.multiplyScalar(-2000);


	return v_add;
}