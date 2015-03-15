(function() {
	'use strict';
	
	angular.module('Basket')
		.factory('stateManager',stateManager);
	
	stateManager.$inject = ['$timeout'];
	
	function stateManager($timeout) {
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
			model: model,
			isActive: isActive
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
			// try to make this cleaner
			var stateNames = Array.prototype.slice.call(arguments);			
			//['addingComments','editingDescription']
			angular.forEach(stateNames, function(name) {
				var current = this.states.filter(function(state) {
					return state.$name === name;
				});
				
				var exclusiveOf = stateNames.filter(function(stateName) {
					return stateName !== current[0].$name;
				});
				
				angular.forEach(exclusiveOf, function(stateName) {
					current[0].$exclusiveOf.push(this.states.filter(function(state) {
						return state.$name === stateName;
					})[0]);
				}.bind(this));
				
			}.bind(this));
		}
		
		function stateGet(prop) {
			if(prop in this) return this[prop];
		}
		
		function start(subject,model) {
			this.$active = true;
			// almost no point in setting the subject if we can't use it...
			this.$subject = subject || null;
			this.$model = model || null;
						
			angular.forEach(this.$exclusiveOf,function(state) {
				state.stop();
			}.bind(this));
			
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
		
		function done(subject,model,aux,keepCurrentSubject) {
			this.stop(keepCurrentSubject);
			
			if(this.$done !== null) {
				return this.$done(subject,model,aux);
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
		
		function isActive() {
			return this.$active;	
		}
	}
})();