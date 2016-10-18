var expect = require("chai").expect;
var Events = require("./index")

describe("BackboneEvents", function() {
  // added by backbone-events-standalone
  describe("basic bindings", function() {
    it("should contain 4 basic methods", function() {
      var expected = "on,once,off,trigger".split(",");
      expect(Events).to.include.keys(expected);
    });

    it("should return augmented object", function(done) {
      Events.on("foo", function(message) {
        expect(message).eql("hello emitter");
        done();
      }).trigger("foo", "hello emitter");
    });

    it("#on, #trigger", function() {
      var obj = { counter: 0  };
      Events.mixin(obj);
      obj.on('event', function() { obj.counter += 1;  });
      obj.trigger('event');
      expect(obj.counter).to.equal(1);
      obj.trigger('event');
      obj.trigger('event');
      obj.trigger('event');
      obj.trigger('event');
      expect(obj.counter).to.equal(5);
    });

		it("binding and triggering multiple events", function() {
			var obj = { counter: 0 };
			Events.mixin(obj);

			obj.on('a b c', function() { obj.counter += 1; });

			obj.trigger('a');
			expect(obj.counter).eql(1);

			obj.trigger('a b');
			expect(obj.counter).eql(3);

			obj.trigger('c');
			expect(obj.counter).eql(4);

			obj.off('a c');
			obj.trigger('a b c');
			expect(obj.counter).eql(5);
		});
	});


	it.skip("binding and triggering with event maps", function() {
		var obj = { counter: 0 };
		Events.mixin(obj);

		var increment = function() {
			this.counter += 1;
		};

		obj.on({
			a: increment,
			b: increment,
			c: increment
		}, obj);

		obj.trigger('a');
		expect(obj.counter).eql(1);

		obj.trigger('a b');
		expect(obj.counter).eql(3);

		obj.trigger('c');
		expect(obj.counter).eql(4);

		obj.off({
			a: increment,
			c: increment
		}, obj);
		obj.trigger('a b c');
		expect(obj.counter).eql(5);
	});
});
