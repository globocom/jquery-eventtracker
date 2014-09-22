describe("eventTracker", function() {

  describe("Plugin setup", function() {
    it("should expose the 'eventTracker'", function() {
      expect($.fn.eventTracker).toBeDefined();
    });

    it("should configure the element data", function() {
      $("body").eventTracker();

      expect($("body").data("eventTracker").element).toEqual($("body")[0]);
    });
  });
});