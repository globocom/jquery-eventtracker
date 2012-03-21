describe("EventTracker", function() {

  var event = event2 = options = link1 = link2 = link3 = form1 = form2 = form3 = null;

  beforeEach(function() {
    event =   {
      key: "eventSortingActionByDate",
      category: "Sorting",
      action: "By Date",
      content: "Sort By Date"
    };

    options = {
      javaScriptOnly: true
    };

    event2 =   {
      key: "eventClickActionSort",
      category: "Click",
      action: "Sort",
      content: "value"
    };

    $("#jasmine_content").append(
      $("<a id='link1' class='trackable' href='#' data-event-sorting-action-by-date='Sort By Date'>Link1</a>")
    );

    $("#jasmine_content").append(
      $("<a id='link2' class='trackable' href='#' data-event-sorting-action-by-date='Sort By Date' data-event-click-action-sort='value'>Link2</a>")
    );

    $("#jasmine_content").append(
      $("<a id='link3' class='trackable' href='#' data-event-sorting-action-by-date='Sort By Date' data-event-javascript-only='true'>Link3</a>")
    );

    $("#jasmine_content").append(
      $("<form id='form1' action='#' class='trackable' data-event-sorting-action-by-date='Sort By Date'></form>")
    );

    $("#jasmine_content").append(
      $("<form id='form2' action='#' class='trackable' data-event-sorting-action-by-date='Sort By Date' data-event-click-action-sort='value'></form>")
    );

    $("#jasmine_content").append(
      $("<form id='form1' action='#' class='trackable' data-event-sorting-action-by-date='Sort By Date' data-event-javascript-only='true'></form>")
    );

    link1 = $("#link1");
    link2 = $("#link2");
    link3 = $("#link3");
    form1 = $("#form1");
    form2 = $("#form2");
    form3 = $("#form3");
  });

  afterEach(function() {
    $("#jasmine_content").html("");
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
      it("should be able to retrieve the tracking options", function() {
        var options = $.fn.trackEvents.popDataOptions(link3);
        expect(options.javaScriptOnly).toBeTruthy();
      });

      it("should retrieve empty tracking options if no tracking options are defined", function() {
        var options = $.fn.trackEvents.popDataOptions(link1);
        expect(options.javaScriptOnly).toBeFalsy();
      });

      it("should be able to retrieve the events of an array of data elements", function() {
        expect($.fn.trackEvents.getDataEvents).toBeDefined();
        var events = $.fn.trackEvents.getDataEvents(link1);
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

    describe("converting event key to tag attr", function() {
      it("should transform 'eventSortingActionByDate' into 'data-event-sorting-action-by-date'", function() {
        expect($.fn.trackEvents.keyToTagAttr("eventSortingActionByDate")).toEqual("data-event-sorting-action-by-date");
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

  describe("when tracking link events", function() {

    it("should notify analytics", function() {
      spyOn($.fn.trackEvents, "notifyAnalytics");
      $(".trackable").trackEvents();
      $("#link1").click();
      expect($.fn.trackEvents.notifyAnalytics).toHaveBeenCalledWith(event);
    });

    it("should use the content specified in the link tag", function() {
      $("#link1").attr("data-event-sorting-action-by-date", "some-other-value");
      event.content = "some-other-value";

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

    describe("and checking the default action", function() {
      it("should return false if it does not has the property 'action' with 'defaultAction'", function() {
        expect($.fn.trackEvents.link.hasDefaultAction(link1)).toBeFalsy();
      });

      it("should return true if the click event has a property 'action' with 'defaultAction'", function() {
        link1.click($.fn.trackEvents.link.defaultAction);
        expect($.fn.trackEvents.link.hasDefaultAction(link1)).toBeTruthy();
      });
    });

    describe("and using the default action", function() {
      beforeEach(function() {
        spyOn($.fn.trackEvents, "locationHref");
      });

      it("should change the document.location.href", function() {
        link1.addClass($.fn.trackEvents.params.cssClassForDefaultEvent);
        $.fn.trackEvents.link.defaultAction.apply(link1);
        expect($.fn.trackEvents.locationHref).toHaveBeenCalledWith(link1.attr("href"));
      });

      it("should works just if 'cssClassForDefaultEvent' is applied", function() {
        link1.removeClass($.fn.trackEvents.params.cssClassForDefaultEvent);
        $.fn.trackEvents.link.defaultAction.apply(link1);
        expect($.fn.trackEvents.locationHref).wasNotCalled();
      });
    });

    describe("and using the callback", function() {
      beforeEach(function() {
        link1.removeClass($.fn.trackEvents.params.cssClassForDefaultEvent);
      });

      it("should add default action", function() {
        $.fn.trackEvents.link.callback(link1);
        expect($.fn.trackEvents.link.hasDefaultAction(link1)).toBeTruthy();
      });

      it("should add default action just once", function() {
        $.fn.trackEvents.link.callback(link1);
        $.fn.trackEvents.link.callback(link1);

        expect(link1.data("events").click.length).toEqual(1);
      });

      it("should trigger 'click' events", function() {
        spyOn($.fn, "trigger");
        $.fn.trackEvents.link.callback(link1);
        expect($.fn.trigger).toHaveBeenCalledWith("click");
      });
    });

    describe("and using generateStrategy", function() {

      var linkStrategy = null;
      var e = null;
      beforeEach(function() {
        e = $.Event("click");
      });

      describe("without options", function() {
        beforeEach(function() {
          linkStrategy = $.fn.trackEvents.link.generateStrategy(link1, event, {});
        });

        describe("and using the generated function", function() {
          it("should notify analytics", function() {
            spyOn($.fn.trackEvents, "notifyAnalytics");
            linkStrategy(e);
            expect($.fn.trackEvents.notifyAnalytics).toHaveBeenCalledWith(event);
          });

          it("should not stop event propagation", function() {
            spyOn(e, "preventDefault");
            spyOn(e, "stopImmediatePropagation");

            linkStrategy(e);

            expect(e.preventDefault).toHaveBeenCalled();
            expect(e.stopImmediatePropagation).toHaveBeenCalled();
          });

          it("should add 'defaultEvent' class", function() {
            linkStrategy(e);
            expect(link1.hasClass($.fn.trackEvents.params.cssClassForDefaultEvent)).toBeTruthy();
          });

          it("should remove the strategy", function() {
            spyOn($.fn, "off");
            linkStrategy(e);
            expect($.fn.off).toHaveBeenCalledWith("click", linkStrategy);
          });

          it("should configure a setTimeout", function() {
            spyOn(window, "setTimeout");
            linkStrategy(e);
            expect(window.setTimeout).toHaveBeenCalled();
          });
        });
      });

      describe("with javascriptOnly option enabled", function() {
        beforeEach(function() {
          linkStrategy = $.fn.trackEvents.link.generateStrategy(link3, event, {javaScriptOnly: true});
        });

        it("should not stop event propagation", function() {
          spyOn(e, "preventDefault");
          spyOn(e, "stopImmediatePropagation");

          linkStrategy(e);

          expect(e.preventDefault).not.toHaveBeenCalled();
          expect(e.stopImmediatePropagation).not.toHaveBeenCalled();
        });

        it("should not 'defaultEvent' class", function() {
          linkStrategy(e);
          expect(link3.hasClass($.fn.trackEvents.params.cssClassForDefaultEvent)).toBeFalsy();
        });

        it("should not remove the strategy function from the event chain", function() {
          spyOn($.fn, "off");
          linkStrategy(e);
          expect($.fn.off).not.toHaveBeenCalled();
        });

        it("should not configure a setTimeout", function() {
          spyOn(window, "setTimeout");
          linkStrategy(e);
          expect(window.setTimeout).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when tracking form events", function() {

    it("should notify analytics", function() {
      spyOn($.fn.trackEvents, "notifyAnalytics");
      $(".trackable").trackEvents();
      $("#form1").submit();
      expect($.fn.trackEvents.notifyAnalytics).toHaveBeenCalledWith(event);
    });

    it("should notify multiple events", function() {
      var spy = spyOn($.fn.trackEvents, "notifyAnalytics");
      $(".trackable").trackEvents();
      $("#form2").submit();
      $("#form2").trigger("submit");

      expect($.fn.trackEvents.notifyAnalytics).toHaveBeenCalled();
      expect(spy.callCount).toEqual(2);
      expect(spy.argsForCall[0][0].key).toEqual(event.key);
      expect(spy.argsForCall[1][0].key).toEqual(event2.key);
    });

  });

});
