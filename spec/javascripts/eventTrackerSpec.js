describe("eventTracker", function() {
  var element, plugin, pluginName;

  beforeEach(function() {
    pluginName = "eventTracker";
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
    it("should expose the 'eventTracker'", function() {
      element.eventTracker();
      expect($.fn.eventTracker).toBeDefined();
    });

    it("should configure the element data", function() {
      element.eventTracker();
      expect(element.data("eventTracker").element).toEqual(element[0]);
    });
  });

  describe("Initializing the plugin", function() {
    beforeEach(function() {
      spyOn(localforage, "removeItem");

      element.eventTracker();
    });

    it("should clear eventTracker events on local storage", function() {
      expect(localforage.removeItem).toHaveBeenCalledWith("eventTracker");
    });
  });

  describe("when tracking link events", function() {
    beforeEach(function() {
      spyOn(localforage, "setItem");

      $("#sandbox").append(
        $('<a href="#" class="trackable" data-track-event-button-action-click="nav-buttons">Link1</a>')
      );

      $("#sandbox").append(
        $('<a href="#" class="trackable" data-track-event-header-action-click="header buttons">Link2</a>')
      );

      $("#sandbox").append(
        $('<a href="#" class="trackable" data-track-event-menu-action-click="menu itens">Link3</a>')
      );

      $(".trackable").eventTracker();
    });

    it("should saves data to local storage", function() {
      $(".trackable").first().click();

      expect(localforage.setItem).toHaveBeenCalled();
    });

    it("should set event with category and action", function() {
      $(".trackable").first().click();

      expect(localforage.setItem).toHaveBeenCalledWith(pluginName, [{category: 'Button', action: 'Click'}], jasmine.any(Function));
    });
  });
});