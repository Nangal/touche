(function() {
	'use strict';

	var T = window.Touche,
		abs = Math.abs;

	/**
	 * Bind a swipe gesture. Supports a radius threshold that is used to measure when the gesture starts.
	 * Triggers `start`, `update` and `end` events.
	 * @name G#swipe
	 * @param {DOMElement} elem
	 * @param {Object} Data to set up the gesture
	 */
	T.swipe = function(elem, gesture) {
		gesture = T.utils.extend({
			options: {
				radiusThreshold: 12,
				preventDefault: true
			},
			start: function() {},
			update: function() {},
			end: function() {}
		}, gesture);

		var inst = T.cache.get(elem),
			radiusThreshold = gesture.options.radiusThreshold,
			preventDefault = gesture.options.preventDefault,
			countTouches, touches = 1;

		inst.context.addGesture(T.gesture(elem, 'swipe', {
			options: gesture.options,
			getSwipe: function(point) {
				this.swipe.currentPoint = point;
				this.swipe.currentTime = +new Date();
				this.swipe.deltaX = this.swipe.currentPoint.x - this.swipe.startPoint.x;
				this.swipe.deltaY = this.swipe.currentPoint.y - this.swipe.startPoint.y;
				this.swipe.velocity = T.utils.getVelocity(this.swipe.startPoint, this.swipe.currentPoint, this.swipe.startTime, this.swipe.currentTime);
				this.swipe.angle = T.utils.getAngle(this.swipe.startPoint, this.swipe.currentPoint);
				this.swipe.direction = T.utils.getDirection(this.swipe.angle);
				this.swipe.elementDistance = this.swipe.direction === 'left' || this.swipe.direction === 'right' ? this.rect.width : this.rect.height;
				this.swipe.distance = this.swipe.direction === 'left' || this.swipe.direction === 'right' ? abs(this.swipe.deltaX) : abs(this.swipe.deltaY);
				this.swipe.percentage = this.swipe.distance / this.swipe.elementDistance * 100;
				return this.swipe;
			},
			start: function(event, data) {
				this.swipe = {};
				this.swipestartFired = false;

				countTouches = 0;
				countTouches = event.touches && event.touches.length > countTouches ? event.touches.length : 1;
				if(countTouches !== touches) {
					inst.context.cancelGestures('swipe');
					return;
				}

				this.swipe.startPoint = data.points[0];
				this.swipe.startTime = +new Date();

				if(preventDefault) {
					event.preventDefault();
				}
			},
			update: function(event, data) {
				countTouches = event.touches && event.touches.length > countTouches ? event.touches.length : 1;
				if(countTouches !== touches) {
					inst.context.cancelGestures('swipe');
					return;
				}

				data.swipe = this.getSwipe(data.points[0]);

				if(!this.swipestartFired && this.swipe.startPoint.distanceTo(this.swipe.currentPoint) >= radiusThreshold) {
					inst.context.cancelGestures('tap').cancelGestures('rotate');
					this.swipestartFired = true;
					gesture.start.call(this, event, data);
				} else if(this.swipestartFired) {
					gesture.update.call(this, event, data);
				}

				this.swipe.startTime = this.swipe.currentTime; //to calculate correct velocity
				if(preventDefault) {
					event.preventDefault();
				}
			},
			end: function(event, data) {
				if(this.swipestartFired) {
					gesture.end.call(this, event, data);
				}

				if(preventDefault) {
					event.preventDefault();
				}
			},
			cancel: function() {
				gesture.cancel.call(gesture);
			}
		}));
		return T;
	};
})();