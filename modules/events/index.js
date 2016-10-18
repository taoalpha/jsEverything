/**
 * Similar with backbone-event-standalone.
 */
"use strict";


(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], function () {
			return (root.returnExportsGlobal = factory());
		});
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals
		root.returnExportsGlobal = factory();
	}
}(this, function () {
  let eventHanlder = (name, obj, action, callback, context) {
    if (!name) return false;

    if (name.constructor === Object) {
      obj[action].apply(obj, [name.name, name.callback, name.context]);
    }
  };
	return {
    on(name, callback, context) {
      // no name or no callback, return
      if(!name || !callback) return this;

      // push to _events: the events container
      this._events = this._events || {};
      this._events[name] = this._events[name] || [];
      this._events[name].push({callback, context});
      return this;
    },

    off(name, callback, context) {
      // no _events, return
      if (!this._events) return this;

      // no name, remove all
      if (!name) {
        this._events = {};
        return this;
      }

      let names = name ? [name] : Object.keys(this._events);
      names.forEach(name => {
        let events = this._events[name];
        this._events[name] = [];
        events.forEach(event => {
          // remove a specific listen, keep others
          if ((callback && callback !== event.callback) || (context && context !== event.context)) {
            this._events[name].push(event);
          }
        })

        // remove it if no listener left
        if (!this._events[name]) delete this._events[name];
      })
      return this;
    },

    once(name, callback, context) {
      // no name or no callback, return
      if(!name || !callback) return this;

      // push to _events: the events container
      this._events = this._events || {};
      this._events[name] = this._events[name] || [];
      let cb = (...args) => {
        this.off(name, callback, context);
        callback.apply(this, args);
      };
      this._events[name].push({callback, context});
      return this;
    },

    trigger(name){
      if(!this._events) return this;
      if(!this._events[name]) return this;

      this._events[name].forEach(event => {
        event.callback.apply(this, Array.prototype.slice.call(arguments, 1));
      });
    },

    mixin(obj) {
      if (!obj) return this;

      ["on", "off", "once", "trigger"].forEach(action => {
        obj[action] = this[action];
      })

      return this;
    }
  };
}));
