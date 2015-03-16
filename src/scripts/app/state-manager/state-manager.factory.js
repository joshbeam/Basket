(function() {
	//'use strict';
	
	angular.module('Basket')
		.factory('stateManager',stateManager);
	
	function stateManager() {
		var exports = {
			StateGroup: StateGroup,
			State: State
		},
			utils = {
				getStringModelToModel: getStringModelToModel,
				setStringModelToModel: setStringModelToModel
		};
		
		StateGroup.prototype = {
			getAll: getAll,
			exclusive: exclusive,
			scope: scope,
			models: models
		};
		
		State.prototype = {
			get: stateGet,
			start: start,
			stop: stop,
			done: done,
			subject: subject,
			model: model,
			isActive: isActive,
			and: and
		};
		
		return exports;	
		
		function StateGroup() {
			this.states = [];
			this.$scope = {};
						
			angular.forEach(arguments,function(state) {
				this.states.push(new State(state));
			}.bind(this));
			
			/*
				usage:
				
				vm.states = new stateManager.StateGroup(...);
				// ==> instantiates a new StateGroup
				// ==> returns a function
				
				vm.states()
				// ==> returns the StateGroup object
				// ==> gives access to the prototype e.g. vm.states().getAll(...)
				
				vm.states('stateName');
				// ==> returns the state with the specified name
			*/
			return function(stateName) {
				if(!!stateName) {
					return this.states.filter(function(state) {
						return state.$name === stateName;
					})[0];	
				} else {
					return this;
				}
			}.bind(this);
		}
		
		function State(config) {
			this.$name = config.name;
			this.$start = config.start || null;
			this.$stop = config.stop || null;
			this.$done = config.done || null;
			// pass by reference is magic
			this.$subject = config.subject || {};
			this.$active = false;
			this.$model = {};
			this.$exclusiveOf = [];
			this.$auxillary = config.auxillary || {};
			//this.$scope = config.scope || {};
		}
		
		function getAll() {
			return this.states;	
		}
		
		function exclusive() {
			// try to make this cleaner
			var stateNames = Array.prototype.slice.call(arguments);	
			console.log('state names: ',stateNames);
			
			// e.g. stateNames === ['addingComments','editingDescription','assigning']
			angular.forEach(stateNames, function(name) {
				
				// get the currently looped State
				// e.g. 'addingComments'
				var current = this.states.filter(function(state) {
					return state.$name === name;
				})[0];
				console.log('current: ',current);
				
				// create a new array of names that doesn't contain the currently looped State's name
				// e.g. ['editingDescription','assigning']
				var exclusiveOf = stateNames.filter(function(stateName) {
					return stateName !== current.$name;
				});
				console.log('exclusiveOf: ',exclusiveOf);
				
				// in the currently looped State's $exclusiveOf array,
				// push all the other State objects
				// e.g. $exclusiveOf === [State, State]
				angular.forEach(exclusiveOf, function(stateName) {
					current.$exclusiveOf.push(this.states.filter(function(state) {
						return state.$name === stateName;
					})[0]);
					console.log('current.$exclusiveOf: ',current.$exclusiveOf);
				}.bind(this));
				
			}.bind(this));
		}
		
		function scope(scope) {
			if(!!scope) {
				this.$scope = scope;
				angular.forEach(this.states,function(state) {
					state.$scope = scope;
				});
			} else {
				return this.$scope;	
			}
		}
		
		function models() {
			// useful for debugging to see all of the current models being used in the group
			var models = [];
			
			angular.forEach(this.states,function(state) {
				models.push(state.$model);
			});
			
			return models;
		}
		
		function stateGet(prop) {
			if(prop in this) return this[prop];
		}
		
		function start(subject,model) {
			
			var resolvedModel = null;
			this.$active = true;
			// pass by reference!
			this.$subject = subject || {};
			
			console.log('start called on: ',this);
			
			if(!!model) {
				// initialize the model to contain the string version of the model
				// e.g. vm.models.descriptionOfItemBeingEdited
				this.$model = model;

				resolvedModel = utils.getStringModelToModel(this, this.$scope, model);
			}
									
			angular.forEach(this.$exclusiveOf,function(state) {
				if(state.isActive()) {
					state.stop();
				}
			}.bind(this));
			
			if(this.$start !== null) {
				return this.$start(this.$subject,resolvedModel);
			}
		}
		
		function stop(keepCurrentSubject) {
			console.log('stop called on: ',this);
			
			this.$active = false;
			this.$subject = !!keepCurrentSubject ? this.$subject : {};
			
			// reset the model
			this.model('');
			
			if(this.$stop !== null) {
				return this.$stop();
			}
		}
		
		function done(keepCurrentSubject) {
			// need to re-resolve the model to see the updates from the scope
			var resolvedModel = utils.getStringModelToModel(this, this.$scope, this.$model);
			if(this.$done !== null) {
				this.$done(this.$subject,resolvedModel);
			}
			
			// this *has* to be called second, since it can reset the subject
			// if keepCurrentSubject is not passed in
			this.stop(keepCurrentSubject);
			
			return this;
		}
		
		function subject(val) {
			if(!!val) {
				this.$subject = val;	
			} else if (!val) {
				return this.$subject;	
			}
		}
		
		function model(val) {
			var resolvedModel;

			// we can still pass in an empty string if we want
			if(!!val || val === '') {
				utils.setStringModelToModel(this, this.$scope, this.$model, val);
			} else if (!val) {
				return this.$model;	
			}			
		}
		
		function isActive() {
			return this.$active;	
		}
		
		function and() {
			/*
				usage:
				
				NOTE: must pass in 'true' to .done() if using $subject in
				the declaration of the auxillary function
				
				vm.states.get('editing').done(true).and('remove', 'sayHi');
				... .and({remove: 'param'});
				... .and({remove: ['param1','param2']}, 'sayHi');
				... .and({remove: 'param'}, {sayHi: 'param'});
			*/
			
			angular.forEach(arguments, function(arg) {
				if(arg.constructor !== Object) {
					if(arg in this.$auxillary) {
						this.$auxillary[arg].call(this,this.$subject);	
					}
				} else if (arg.constructor === Object) {
					for(var fn in arg) {
						if(arg[fn].constructor !== Array) {
							// force it to become an array
							arg[fn] = [arg[fn]];
						}
						// add subject as first param
						arg[fn].unshift(this.$subject);
						
						// call the auxillary function with subject and any additional params
						this.$auxillary[fn].apply(this,arg[fn]);	
					}
				}
			}.bind(this));
		}
		
		function getStringModelToModel(thisArg, scope, string) {
			var m, keys;
			
			keys = string.split('.');
			// remove ControllerAs prefix, because we don't need it
			// the user still uses it though in the string declaration, because it creates a namespace
			keys.shift();
			
			angular.forEach(keys,function(key) {
				if(!!m) {
					m = m[key];	
				} else {
					m = scope[key];	
				}
			}.bind(thisArg));
			
			return m;	
		}
		
		function setStringModelToModel(thisArg, scope, string, val) {
			var m, keys, lastKey;
			
			keys = string.split('.');
			// remove ControllerAs prefix, because we don't need it
			// the user still uses it though in the string declaration, because it creates a namespace
			keys.shift();
			
			// get the last key
			lastKey = keys.pop();
			
			angular.forEach(keys,function(key) {
				if(!!m) {
					m = m[key];	
				} else {
					m = scope[key];	
				}
			}.bind(thisArg));
			
			// set the model
			m[lastKey] = val;		
		}
	}
})();