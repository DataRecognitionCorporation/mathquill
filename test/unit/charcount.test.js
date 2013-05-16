suite('Character counting', function() {
  var el, rootBlock, cursor;
  setup(function() {
    el = $('<span></span>').appendTo('#mock').mathquill();
    rootBlock = MathElement[el.attr(mqBlockId)];
    cursor = rootBlock.cursor;
  });
  teardown(function() {
    el.remove();
  });
  function renderAndCount(latex, count) {
    rootBlock.renderLatex(latex);
    assert.equal(rootBlock.charCount(), count, latex + ' has ' + count + ' characters');
  }

  test('counts recursive children', function() {
    renderAndCount('x^{nm}', 3);
    renderAndCount('xabc', 4);
  });

  test('count children but count node differently', function() {
    renderAndCount('\\ln{123}', 5);
  });

  test('doesn\'t count excluded nodes', function() {
    renderAndCount('x^{2}', 2);
  });

  test('count nodes that have special rules about children', function() {
    renderAndCount('\\frac{d}{dx}', 2);
  });

  test('counts a cranky combination of math', function() {
    renderAndCount('x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\\frac{d}{dx}\\sin{1}', 18);
  });

});
