function objectPlaneDistance (objCoords, planeNormal) {
	var a = planeNormal.x;
	var b = planeNormal.y;
	var c = planeNormal.z;

	return d = (a * objCoords.x + b * objCoords.y + c * objCoords.z) / Math.sqrt(Math.pow(a,2) + Math.pow(b,2) + Math.pow(c,2));
}

function distance (obj1, obj2) {
	if (obj1.getType() == 'sphere' && obj2.getType() == 'plane') {
		var normal = obj2.getNormal();
		// console.log(obj2);

		// Object coordinates
		var objCoords = obj1.getPosition();
		return d = (normal.dot(objCoords)  / normal.length());
	}
}