(function(T) {
	'use strict';

	/**
	 * Tap gesture
	 * @name T.gestures.tap
	 * @function
	 */
	var Tap = T.Gesture.augment(function(Gesture) {

		this.defaults =  {
			areaThreshold: 5,
			precedence: 6,
			preventDefault: true,
			touches: 1,
			which: 1
		};

		this.start = function(event, data) {
			this.rect = T.utils.getRect(event.target);
			if( !this.isValidMouseButton(event, this.options.which) ||
				this.hasMoreTouches(data.points)) {
				this.cancel();
			}

			if(this.options.preventDefault) {
				event.preventDefault();
			}
		};

		this.update = function(event, data) {
			if(this.hasMoreTouches(data.points) ||
				!this.rect.pointInside(data.points[0], this.options.areaThreshold)) {
				this.cancel();
			}

			if(this.options.preventDefault) {
				event.preventDefault();
			}
		};

		this.end = function(event, data) {
			if(this.hasNotEqualTouches(data.points)) {
				return;
			}
			if(this.rect.pointInside(data.points[0], this.options.areaThreshold)) {
				this.binder.end.call(this, event, data);
			}
			if(this.options.preventDefault) {
				event.preventDefault();
			}
		};

		function Tap() {
			Gesture.apply(this, arguments);
		}

		return Tap;
	});

	/*
	* Add the Tap gesture to Touché
	*/
	T.gestures.add('tap', Tap);

})(window.Touche);