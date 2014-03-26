suite('mouse', function() {
  var el;
  var focusWasCalled = false
  var cache = {byId: Node.byId};
  var cursorMock = {
    blink: null,
    startSelection: function() {},
    selection: false,
    endSelection: function() {},
    show: function() {}
  };

  setup(function() {
    window.navigator = {platform: 'iPad'};
    Node.byId = {"0": {
      controller: {
        textarea: {focus: function () {focusWasCalled = true}},
        editable: true,
        cursor: cursorMock,
        seek: function() { return {cursor: cursorMock}; }
      }
    }};
    el = $('<span class="mathquill-root-block" mathquill-block-id="0"><span><textarea></span></span>').appendTo('#mock');
  });

  teardown(function() {
    el.remove();
    Node.byId = cache.byId;
    window.navigator = cache.navigator;
  });

  test('focuses textarea on event thread', function() {
    mockController = {container: el, root: {}, iOS: function() {return true}};
    Controller.prototype.delegateMouseEvents.apply(mockController);
    el.trigger('mousedown');
    el.trigger('mouseup');
    assert.ok(focusWasCalled, 'focusWasCalled');
  });
});
