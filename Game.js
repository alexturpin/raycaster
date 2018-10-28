function Game() {
	//Render
	this.render = null;

	var _render = (function() {
		if (typeof this.render == "function")
			this.render.call(this);

		window.requestAnimationFrame(_render);
	}).bind(this);
	_render();

	//Update
	this.update = null;
	this.ticks = 30;
	this.prevTime = Date.now();

	var _update = (function() {
		var time = Date.now();
		var dt = 0.001 * (time - this.prevTime);
		this.prevTime = time;

		if (typeof this.update == "function")
			this.update.call(this, dt);

		window.setTimeout(_update, 1000 / this.ticks);
	}).bind(this);
	_update();

	//Keys
	this.keys = {};

	window.onkeydown = (function(event) {
		this.keys[event.which] = true;
	}).bind(this);
	
	window.onkeyup = (function(event) {
		this.keys[event.which] = false;
	}).bind(this);
}