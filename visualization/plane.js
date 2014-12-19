function Plane(width, height, x, y, z) {

	// Plane properties
	this.base = new THREE.PlaneBufferGeometry(width, height,  width/5, height/5);
	this.plane = new THREE.Mesh(	
		this.base,
		new THREE.MeshBasicMaterial( { color: 0x999999, side: THREE.DoubleSide, wireframe: true} )
	);

	this.plane.rotation.x = -Math.PI;
	this.plane.position.x = x;
	this.plane.position.y = y;
	this.plane.position.z = z;
	this.plane.material.side = THREE.DoubleSide;
	
	this.getNormal = function () {
		var normalArray = this.base.attributes.normal.array;
		return new THREE.Vector3(normalArray[0], 
								 normalArray[1], 
								 normalArray[2]
								);
	}
	
	this.getType = function () {
		return 'plane';
	}

	this.math_plane = new THREE.Plane(this.getNormal(), 1)

	return this;
}