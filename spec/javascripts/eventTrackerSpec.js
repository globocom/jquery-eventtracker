describe("eventTracker", function() {
  var $element, pluginName;

  beforeEach(function() {
    pluginName = "eventTracker";

    $element = $('<a href="#">Element</a>');

    $("body").append($element);
    window._gaq = [];
  });

  afterEach(function() {
    $element.remove();
  });

  describe("when integrates with jquery", function() {
    it("should configure plugin", function() {
      spyOn($, "data");
      $element.eventTracker();

      expect($.data).toHaveBeenCalledWith($element[0], 'eventTracker', jasmine.any(Object));
    });

    describe("when the plugin is configured", function() {
      it("should be set once", function() {
        spyOn($, "data").and.returnValue(jasmine.any(Object));
        $element.eventTracker();

        expect($.data.calls.count()).toEqual(1);
        expect($.data).not.toHaveBeenCalledWith($element[0], 'eventTracker', jasmine.any(Object));
      });
    });
  });

  describe("Plugin setup", function() {
    it("should expose the 'eventTracker'", function() {
      $element.eventTracker();
      expect($.fn.eventTracker).toBeDefined();
    });

    it("should configure the element data", function() {
      $element.eventTracker();
      expect($element.data("eventTracker").element).toEqual($element[0]);
    });
  });

  describe("Initializing the plugin", function() {
    beforeEach(function() {
      spyOn(localforage, "removeItem");

      $element.eventTracker();
    });

    it("should clear eventTracker events on local storage", function() {
      expect(localforage.removeItem).toHaveBeenCalledWith("eventTracker");
    });
  });

  describe("when tracking events on local storage", function() {
    beforeEach(function() {
      spyOn(localforage, "getItem").and.callFake(function(pluginName, callback) {
        callback(null, [{category: "Button", action: "Click"}]);
      });

      spyOn(window._gaq, "push");

      $element.eventTracker();
    });

    it("should get itens to tracking", function() {
      expect(localforage.getItem).toHaveBeenCalledWith("eventTracker", jasmine.any(Function));
    });

    it("should send a Google Analytics event", function() {
      expect(window._gaq.push).toHaveBeenCalledWith(['_trackEvent', {category: 'Button', action: 'Click'}]);
    });
  });

  describe("when tracking link events", function() {
    beforeEach(function() {
      var eventContainer = $("<div>", {id: "event-container"});

      eventContainer.append(
        $('<a href="#" class="trackable" data-track-event-button-action-click="nav-buttons">Link1</a>')
      );

      eventContainer.append(
        $('<a href="#" class="trackable" data-track-event-header-action-click="header buttons">Link2</a>')
      );

      eventContainer.append(
        $('<a href="#" class="trackable" data-track-event-menu-action-click="menu itens" data-other-event="no event">Link3</a>')
      );

      eventContainer.append(
        $('<a href="#" class="trackable" data-other-event="no event">Link3</a>')
      );

      $("body").append(eventContainer);

      spyOn(localforage, "setItem");
      $(".trackable").eventTracker();
    });

    afterEach(function() {
      $("#event-container").remove();
    });

    it("should save data to local storage", function() {
      $(".trackable").first().click();

      expect(localforage.setItem).toHaveBeenCalled();
    });

    it("should set event with category and action", function() {
      $(".trackable").first().click();

      expect(localforage.setItem).toHaveBeenCalledWith(pluginName, [{category: 'Button', action: 'Click'}], jasmine.any(Function));
    });

    it("should not tracking another event", function() {
      $($(".trackable")[3]).click();

      expect(localforage.setItem).not.toHaveBeenCalled();
    });
  });
});