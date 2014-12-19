function createTrackballControls (rotation_speed, zoom_speed, pan_speed) {
	var controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = rotation_speed;
	controls.zoomSpeed = zoom_speed;
	controls.panSpeed = pan_speed;

	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	return controls;
}