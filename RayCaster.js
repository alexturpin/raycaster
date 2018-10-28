//http://www.permadi.com/tutorial/raycast/

function RayCasterEngine() {
	this.world = new RayCasterWorld(100, 100);
	this.camera = new RayCasterCamera(0, 0);
	this.width = 128;
	this.height = 256;

	this.render = function(canvas) {
		var ctx = canvas.getContext("2d");

		//Clear
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//Draw walls
		var viewDist = (this.width/ 2) / Math.tan(this.camera.fov / 2);

		castRays(function(ray) {
			if (ray.hit) {
				var height = 1 / ray.dist * viewDist;

				ctx.fillStyle = ray.hit.texture;
				ctx.fillRect(ray.idx, (canvas.height / 2) - (height / 2), 1, height);
			}
		});
	};

	this.renderTopView = function(canvas, size) {
		size = size || 16;

		var ctx = canvas.getContext("2d");

		//Clear
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//Save state and translate to center of camera
		ctx.save();
		ctx.translate((-this.camera.x * size) + (canvas.width / 2), (-this.camera.y * size) + (canvas.width / 2));

		//Draw world
		for(var x = 0; x < this.world.width; x++) {
			for(var y = 0; y < this.world.height; y++) {
				var wall = this.world[x][y];
				if (!wall)
					continue;

				ctx.fillStyle = wall.texture;
				ctx.fillRect(x * size, y * size, size, size);
			}
		}

		//Draw camera
		ctx.beginPath();
		ctx.arc(this.camera.x * size, this.camera.y * size, size / 2, 0, Math.PI * 2);
		ctx.fillStyle = "blue";
		ctx.fill();

		//Draw rays
		castRays(function(ray) {
			ctx.beginPath();
			ctx.moveTo(this.camera.x * size, this.camera.y * size);
			ctx.lineTo(ray.x * size, ray.y * size);
			ctx.strokeStyle = "yellow";
			ctx.stroke();
		});

		//Restore state
		ctx.restore();
	};

	var castRays = (function(callback) {
		if (typeof callback != "function")
			throw new Error("Argument callback must be a function!");

		for(var i = 0, angle = this.camera.angle + (this.camera.fov / 2); i < this.width; i++, angle -= this.camera.fov / this.width)
			callback.call(this, castSingleRay(angle, i));
	}).bind(this);

	var castSingleRay = (function(angle, idx) {
		if (isNaN(angle))
			throw new Error("Argument angle must be a number");

		var x = this.camera.x;
		var y = this.camera.y;

		var wall = null;

		while(true) {
			if (x < 0 || x >= this.world.width || y < 0 || y >= this.world.height)
				break;

			wall = this.world[x | 0][y | 0];
			if (wall)
				break;

			x += Math.cos(angle);
			y -= Math.sin(angle);
		}

		var dist = Math.sqrt(Math.pow(x - this.camera.x, 2) + Math.pow(y - this.camera.y, 2)) * Math.cos(this.camera.angle - angle);

		return {angle: angle, idx: idx, x: x, y: y, hit: wall, dist: dist};
	}).bind(this);
}

function RayCasterWorld(width, height) {
	var world = [];
	world.width = width;
	world.height = height;
	for(var x = 0; x < width; x++) {
		world[x] = [];
		for(var y = 0; y < height; y++)
			world[x][y] = null;
	}
	return world;
}

function RayCasterWall(texture) {
	this.texture = texture;
}

function RayCasterCamera(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	this.angle = 0;
	this.fov = 60 * (Math.PI / 180);
}