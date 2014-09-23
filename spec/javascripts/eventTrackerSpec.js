describe("eventTracker", function() {
  var element;

  beforeEach(function() {
    element = sandbox();
    $("body").append(element);
  });

  describe("when integrates with jquery", function() {
    it("should configure plugin", function() {
      spyOn($, "data");
      element.eventTracker();
      expect($.data).toHaveBeenCalledWith(element[0], 'eventTracker', jasmine.any(Object));
    });

    describe("when the plugin is configured", function() {
      it("should be set once", function() {
        spyOn($, "data").and.returnValue(jasmine.any(Object));
        element.eventTracker();

        expect($.data.calls.count()).toEqual(1);
        expect($.data).not.toHaveBeenCalledWith(element[0], 'eventTracker', jasmine.any(Object));
      });
    });
  });

  describe("Plugin setup", function() {
    beforeEach(function() {
      element.eventTracker();
    });

    it("should expose the 'eventTracker'", function() {
      expect($.fn.eventTracker).toBeDefined();
    });

    it("should configure the element data", function() {
      expect(element.data("eventTracker").element).toEqual(element[0]);
    });
  });

  describe("Initializing the plugin", function() {
    beforeEach(function() {
      spyOn(localforage, "removeItem");

      element.eventTracker();
    });

    it("should clear eventTracker events on localStorage", function() {
      expect(localforage.removeItem).toHaveBeenCalledWith("eventTracker");
    });
  });
});