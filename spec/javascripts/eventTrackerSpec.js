describe("EventTracker", function() {

  var link1 = null;
  var event =   {
    key: "eventSortingActionByDate",
    category: "Sorting",
    action: "By Date",
    content: "Sort By Date"
  };

  var event2 =   {
    key: "eventClickActionSort",
    category: "Click",
    action: "Sort",
    content: "value"
  };

  beforeEach(function() {
    $("#jasmine_content").append(
      $("<a id='link1' class='trackable' href='#' data-event-sorting-action-by-date='Sort By Date'>Link1</a>")
    );
    $("#jasmine_content").append(
      $("<a id='link2' class='trackable' href='#' data-event-sorting-action-by-date='Sort By Date' data-event-click-action-sort='value'>Link1</a>")
    );

    link1 = $("#link1");
  });


  describe("when integrates with jquery", function() {

    it("should expose the 'trackEvents' method", function() {
      expect($.fn.trackEvents).toBeDefined();
    });

    it("should disable if has not '_gaq'", function() {
      $(".trackable").trackEvents();
      expect($.fn.trackEvents.disabled).toBeDefined();
    });

    describe("and using the 'trackEvents' method", function() {

      it("should be able to retrieve the events of an array of data elements", function() {
        expect($.fn.trackEvents.getDataEvents).toBeDefined();
        var events = $.fn.trackEvents.getDataEvents(link1.data());
        expect(events.length).toEqual(1);
        expect(events[0]).toEqual(event);
      });

    });

    describe("and using the 'whitespace' method", function() {

      it("should transform 'SomeWord' into 'Some Word'", function() {
        expect($.fn.trackEvents.whitespace).toBeDefined();
        expect($.fn.trackEvents.whitespace("SomeWord")).toEqual("Some Word");
      });

    });

    describe("and using the 'notifyAnalytics' method", function() {

      beforeEach(function() {
        window._gaq = [];
      });

      it("should add an array with '_trackEvent' on window._gaq", function() {
        $.fn.trackEvents.notifyAnalytics(event);
        expect(window._gaq.length).toEqual(1);
        expect(window._gaq[0]).toEqual(['_trackEvent', event.category, event.action, event.content]);
      });

    });

  });

  describe("when tracking click events", function() {

    it("should notify analytics", function() {
      spyOn($.fn.trackEvents, "notifyAnalytics");
      $(".trackable").trackEvents();
      $("#link1").click();
      expect($.fn.trackEvents.notifyAnalytics).toHaveBeenCalledWith(event);
    });

    it("should notify multiple events", function() {
      var spy = spyOn($.fn.trackEvents, "notifyAnalytics");
      $(".trackable").trackEvents();
      $("#link2").click();
      $("#link2").trigger("click");

      expect($.fn.trackEvents.notifyAnalytics).toHaveBeenCalled();
      expect(spy.callCount).toEqual(2);
      expect(spy.argsForCall[0][0].key).toEqual(event.key);
      expect(spy.argsForCall[1][0].key).toEqual(event2.key);
    });

  });

});






































