// Generated by CoffeeScript 1.12.7
(function() {
  var SimpleEvent, __bind_asterisk, __init, __trigger_asterisk, __unbind_asterisk;

  __init = function() {
    if (!this._events) {
      this._events = {};
    }
    if (!this.__events_asterisk) {
      return this.__events_asterisk = {};
    }
  };

  __bind_asterisk = function(event, fct) {
    this.__events_asterisk[event] = this.__events_asterisk[event] || [];
    this.__events_asterisk[event].push(fct);
    return this;
  };

  __unbind_asterisk = function(event, fct) {
    if (!fct) {
      return delete this.__events_asterisk[event];
    }
    if (!this.__events_asterisk[event]) {
      return;
    }
    this.__events_asterisk[event].splice(this.__events_asterisk[event].indexOf(fct), 1);
    return this;
  };

  __trigger_asterisk = function(event) {
    var args;
    args = Array.prototype.slice.call(arguments, 1);
    Object.keys(this.__events_asterisk).forEach((function(_this) {
      return function(ev) {
        if (event.indexOf(ev) !== 0) {
          return;
        }
        return _this.__events_asterisk[ev].forEach(function(fn) {
          return fn.apply(_this, [event.split(ev)[1]].concat(args));
        });
      };
    })(this));
    return this;
  };

  (typeof exports !== "undefined" && exports !== null ? exports : this).SimpleEvent = SimpleEvent = (function() {
    function SimpleEvent() {}

    SimpleEvent.prototype.bind = function(event, fct) {
      __init.bind(this)();
      if (event.indexOf('*') >= 0) {
        return __bind_asterisk.bind(this)(event.split('*')[0], fct);
      }
      this._events[event] = this._events[event] || [];
      this._events[event].push(fct);
      return this;
    };

    SimpleEvent.prototype.unbind = function(event, fct) {
      __init.bind(this)();
      if (event && event.indexOf('*') >= 0) {
        return __unbind_asterisk.bind(this)(event.split('*')[0], fct);
      }
      if (!event) {
        this.__events_asterisk = {};
        this._events = {};
        return;
      }
      if (!fct) {
        return delete this._events[event];
      }
      if (!this._events[event]) {
        return;
      }
      this._events[event].splice(this._events[event].indexOf(fct), 1);
      return this;
    };

    SimpleEvent.prototype.bind_to = function(object, event, fn) {
      var fn_c;
      if (!this.__events_to) {
        this.__events_to = [];
      }
      fn_c = (function(_this) {
        return function() {
          return fn.apply(_this, arguments);
        };
      })(this);
      object[object.bind ? 'bind' : 'on'](event, fn_c);
      this.__events_to.push((function(_this) {
        return function() {
          return object[object.unbind ? 'unbind' : 'off'](event, fn_c);
        };
      })(this));
      return this;
    };

    SimpleEvent.prototype.unbind_to = function() {
      var fn;
      if (this.__events_to) {
        while (fn = this.__events_to.shift()) {
          fn();
        }
      }
      return this;
    };

    SimpleEvent.prototype.trigger = function(event) {
      var args;
      __init.bind(this)();
      __trigger_asterisk.bind(this).apply(this, Array.prototype.slice.call(arguments, 0));
      args = Array.prototype.slice.call(arguments, 1);
      ['all', event].filter((function(_this) {
        return function(ev) {
          return !!_this._events[ev];
        };
      })(this)).forEach((function(_this) {
        return function(ev) {
          return _this._events[ev].forEach(function(fn) {
            return fn.apply(_this, ev === 'all' ? [event].concat(args) : args);
          });
        };
      })(this));
      return this;
    };

    SimpleEvent.prototype.remove = function() {
      this.trigger('remove');
      this.unbind_to();
      this.unbind();
      return this;
    };

    return SimpleEvent;

  })();

  SimpleEvent.prototype.__mixin = function(cl) {
    return ['bind', 'unbind', 'bind_to', 'unbind_to', 'trigger', 'remove', 'on', 'off', 'on_to', 'off_to', 'emit'].forEach(function(fn) {
      return cl.prototype[fn] = SimpleEvent.prototype[fn];
    });
  };

  SimpleEvent.prototype.on = SimpleEvent.prototype.bind;

  SimpleEvent.prototype.off = SimpleEvent.prototype.unbind;

  SimpleEvent.prototype.on_to = SimpleEvent.prototype.bind_to;

  SimpleEvent.prototype.off_to = SimpleEvent.prototype.unbind_to;

  SimpleEvent.prototype.emit = SimpleEvent.prototype.trigger;

}).call(this);
