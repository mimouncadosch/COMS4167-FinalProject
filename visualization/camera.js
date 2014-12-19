function Camera (fov) {
	// Camera properties
	this.camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 0.1, 1000 );
	this.camera.position.set( 20, 10, 20 );
	this.camera.up = new THREE.Vector3(0,0,1);
	this.camera.lookAt(new THREE.Vector3(0,0,0));

	return this.camera;
}

function Renderer() {
	var renderer = new THREE.WebGLRenderer({ alpha: true});
	renderer.setClearColor(0xeeeeee, 1.0);
	renderer.setSize( window.innerWidth, window.innerHeight );

	return renderer;
}