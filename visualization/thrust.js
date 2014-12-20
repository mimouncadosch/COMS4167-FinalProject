function Thrust (magnitudes) {

	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial({ linewidth : 3, color: 0x999999 });

	var src = new THREE.Vector3(0, 0, 0);
	var dst = new THREE.Vector3(0, 3, 0);

	geometry.vertices.push( src.clone() );
	geometry.vertices.push( dst.clone() );

	var axis = new THREE.Line( geometry, material, THREE.LinePieces );
	
	/**
	 * Takes three points and computes normal to plane formed by those three points
	 */
	this.computeNormal = function  (p0, p1, p2) {

		var p0p1 = p1.clone().sub(p0.clone());
		var p1p2 = p2.clone().sub(p1.clone());
		p0p1.cross(p1p2);
		
		return p0p1.clone();

	}

	this.axis = axis;
	return this;
	
}