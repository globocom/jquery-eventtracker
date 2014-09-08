describe("eventTracker", function() {

  describe("Initial plugin setup", function() {
    it("should expose the 'eventTracker'", function() {
      expect($.fn.eventTracker).toBeDefined();
    });

    it("should permits extra params", function() {
      $("body").eventTracker({extra: "test"});

      expect($("body").data("eventTracker").options.extra).toEqual("test");
    });

    it("should configure the element data", function() {
      expect($("body").data("eventTracker").element).toEqual($("body")[0]);
    });
  });
});