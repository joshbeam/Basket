(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('stateManager',stateManager);
	
	function stateManager() {
		var exports = {
			StateGroup: StateGroup,
			State: State
		};
		
		StateGroup.prototype = {
			get: stateGroupGet,
			exclusive: exclusive
		};
		
		State.prototype = {
			get: stateGet,
			start: start,
			stop: stop,
			done: done,
			subject: subject,
			model: model
		};
		
		return exports;	
		
		function StateGroup() {
			this.states = [];
			
			angular.forEach(arguments,function(state) {
				this.states.push(new State(state));
			}.bind(this));
		}
		
		function State(config) {
			this.$name = config.name;
			this.$start = config.start || null;
			this.$stop = config.stop || null;
			this.$done = config.done || null;
			this.$subject = config.subject || null;
			this.$active = false;
			this.$model = config.model || null;
			this.$exclusiveOf = [];
		}
		
		function stateGroupGet(stateName) {
			if(!stateName) {
				return this.states;	
			} else {
				return this.states.filter(filter)[0];
				
				function filter(state) {
					return state.$name === stateName;	
				}
			}
		}
		
		function exclusive() {
			var stateNames = arguments;
			
			angular.forEach(stateNames, forEachFn.bind(this));
			
			function forEachFn(stateName) {
				//get the currently looped state
				var state = this.states.filter(stateFilter)[0];
				
				angular.forEach(this.states.filter(notStateFilter),exclusiveOfPush);
				
				function exclusiveOfPush(otherState) {
					state.$exclusiveOf.push(otherState);
				}
				
				function stateFilter(el) {
					return el.$name === stateName;
				}
				
				function notStateFilter(el) {
					return el.$name !== stateName;
				}
			}
		}
		
		function stateGet(prop) {
			if(prop in this) return this[prop];
		}
		
		function start(subject,model) {
			this.$active = true;
			this.$subject = subject || null;
			this.$model = model || null;
			
			if(this.$start !== null) {
				return this.$start(subject,model);
			}
		}
		
		function stop(keepCurrentSubject) {
			this.$active = false;
			this.$subject = !!keepCurrentSubject ? this.$subject : null;
			
			if(this.$stop !== null) {
				return this.$stop();
			}
		}
		
		function done(subject,model,keepCurrentSubject) {
			this.stop(keepCurrentSubject);
			
			if(this.$done !== null) {
				return this.$done(subject,model);
			}
		}
		
		function subject(val) {
			if(!!val) {
				this.$subject = val;	
			} else if (!val) {
				return this.$subject;	
			}
		}
		
		function model(val) {
			if(!!val) {
				this.$model = val;	
			} else if (!val) {
				return this.$model;	
			}			
		}
	}
})();