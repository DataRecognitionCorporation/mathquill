suite('up/down', function() {
  var el, rootBlock, cursor;
  setup(function() {
    el = $('<span></span>').appendTo('#mock').mathquill();
    rootBlock = MathElement[el.attr(mqBlockId)];
    cursor = rootBlock.cursor;
  });
  teardown(function() {
    el.remove();
  });

  function move(dirs) {
    // like, move('Left Left Left Up')
    dirs = dirs.split(' ');
    for (var i in dirs) {
      var dir = dirs[i];
      cursor['move'+dir]();
    }
  }

  test('up/down in out of exponent', function() {
    rootBlock.renderLatex('x^{nm}');
    var exp = rootBlock.endChild[R],
      expBlock = exp.endChild[L];
    assert.equal(exp.latex(), '^{nm}', 'right end el is exponent');
    assert.equal(cursor.parent, rootBlock, 'cursor is in root block');
    assert.equal(cursor[L], exp, 'cursor is at the end of root block');

    move('Up');
    assert.equal(cursor.parent, expBlock, 'cursor up goes into exponent');

    move('Down');
    assert.equal(cursor.parent, rootBlock, 'cursor down leaves exponent');
    assert.equal(cursor[L], exp, 'down when cursor at end of exponent puts cursor after exponent');

    move('Up Left Left');
    assert.equal(cursor.parent, expBlock, 'cursor up left stays in exponent');
    assert.equal(cursor[L], 0, 'cursor is at the beginning of exponent');

    move('Down');
    assert.equal(cursor.parent, rootBlock, 'cursor down leaves exponent');
    assert.equal(cursor[R], exp, 'cursor down in beginning of exponent puts cursor before exponent');

    move('Up Right');
    assert.equal(cursor.parent, expBlock, 'cursor up left stays in exponent');
    assert.equal(cursor[L].latex(), 'n', 'cursor is in the middle of exponent');
    assert.equal(cursor[R].latex(), 'm', 'cursor is in the middle of exponent');

    move('Down');
    assert.equal(cursor.parent, rootBlock, 'cursor down leaves exponent');
    assert.equal(cursor[R], exp, 'cursor down in middle of exponent puts cursor before exponent');
  });

  // literally just swapped up and down, exponent with subscript, nm with 12
  test('up/down in out of subscript', function() {
    rootBlock.renderLatex('a_{12}');
    var sub = rootBlock.endChild[R],
      subBlock = sub.endChild[L];
    assert.equal(sub.latex(), '_{12}', 'right end el is subscript');
    assert.equal(cursor.parent, rootBlock, 'cursor is in root block');
    assert.equal(cursor[L], sub, 'cursor is at the end of root block');

    move('Down');
    assert.equal(cursor.parent, subBlock, 'cursor down goes into subscript');

    move('Up');
    assert.equal(cursor.parent, rootBlock, 'cursor up leaves subscript');
    assert.equal(cursor[L], sub, 'up when cursor at end of subscript puts cursor after subscript');

    move('Down Left Left');
    assert.equal(cursor.parent, subBlock, 'cursor down left stays in subscript');
    assert.equal(cursor[L], 0, 'cursor is at the beginning of subscript');

    move('Up');
    assert.equal(cursor.parent, rootBlock, 'cursor up leaves subscript');
    assert.equal(cursor[R], sub, 'cursor up in beginning of subscript puts cursor before subscript');

    move('Down Right');
    assert.equal(cursor.parent, subBlock, 'cursor down left stays in subscript');
    assert.equal(cursor[L].latex(), '1', 'cursor is in the middle of subscript');
    assert.equal(cursor[R].latex(), '2', 'cursor is in the middle of subscript');

    move('Up');
    assert.equal(cursor.parent, rootBlock, 'cursor up leaves subscript');
    assert.equal(cursor[R], sub, 'cursor up in middle of subscript puts cursor before subscript');
  });

  test('up/down into and within fraction', function() {
    rootBlock.renderLatex('\\frac{12}{34}');
    var frac = rootBlock.endChild[L],
      numer = frac.endChild[L],
      denom = frac.endChild[R];
    assert.equal(frac.latex(), '\\frac{12}{34}', 'fraction is in root block');
    assert.equal(frac, rootBlock.endChild[R], 'fraction is sole child of root block');
    assert.equal(numer.latex(), '12', 'numerator is left end child of fraction');
    assert.equal(denom.latex(), '34', 'denominator is right end child of fraction');

    move('Up');
    assert.equal(cursor.parent, numer, 'cursor up goes into numerator');
    assert.equal(cursor[R], 0, 'cursor up from right of fraction inserts at right end of numerator');

    move('Down');
    assert.equal(cursor.parent, denom, 'cursor down goes into denominator');
    assert.equal(cursor[L], 0, 'cursor down from numerator inserts at left end of denominator');

    move('Up');
    assert.equal(cursor.parent, numer, 'cursor up goes into numerator');
    assert.equal(cursor[R], 0, 'cursor up from denominator inserts at right end of numerator');

    move('Left Left Left');
    assert.equal(cursor.parent, rootBlock, 'cursor outside fraction');
    assert.equal(cursor[R], frac, 'cursor before fraction');

    move('Up');
    assert.equal(cursor.parent, numer, 'cursor up goes into numerator');
    assert.equal(cursor[L], 0, 'cursor up from left of fraction inserts at left end of numerator');

    move('Left');
    assert.equal(cursor.parent, rootBlock, 'cursor outside fraction');
    assert.equal(cursor[R], frac, 'cursor before fraction');

    move('Down');
    assert.equal(cursor.parent, denom, 'cursor down goes into denominator');
    assert.equal(cursor[L], 0, 'cursor down from left of fraction inserts at left end of denominator');
  });

  test('up/down into and within mixed fraction', function() {
    rootBlock.renderLatex('\\mfrac{12}{34}{56}');
    var mfrac = rootBlock.endChild[L],
      whole = mfrac.endChild[L],
      numer = mfrac.endChild[L][R],
      denom = mfrac.endChild[R];
    assert.equal(mfrac.latex(), '12\\frac{34}{56}', 'mixed fraction is latex as fraction with whole number');
    assert.equal(mfrac, rootBlock.endChild[R], 'mixed fraction is sole child of root block');
    assert.equal(whole.latex(), '12', 'whole number is left end child of mixed fraction');
    assert.equal(numer.latex(), '34', 'numerator is middle child of mixed fraction');
    assert.equal(denom.latex(), '56', 'denominator is right end child of mixed fraction');

    move('Up');
    assert.equal(cursor.parent, whole, 'cursor up goes into whole number');
    assert.equal(cursor[R], 0, 'cursor up from right of fraction inserts at right end of whole number');

    move('Down');
    assert.equal(cursor.parent, numer, 'cursor up goes into numerator');
    assert.equal(cursor[L], 0, 'cursor down from numerator inserts at left end of numerator');

    move('Down');
    assert.equal(cursor.parent, denom, 'cursor down goes into denominator');
    assert.equal(cursor[L], 0, 'cursor down from numerator inserts at left end of denominator');

    move('Up');
    assert.equal(cursor.parent, numer, 'cursor up goes into numerator');
    assert.equal(cursor[L], 0, 'cursor up from denominator inserts at left end of numerator');

    move('Left Left Left Left');
    assert.equal(cursor.parent, rootBlock, 'cursor outside fraction');
    assert.equal(cursor[R], mfrac, 'cursor before fraction');

    move('Up');
    assert.equal(cursor.parent, whole, 'cursor up goes into whole number');
    assert.equal(cursor[L], 0, 'cursor up from left of fraction inserts at left end of whole number');

    move('Left');
    assert.equal(cursor.parent, rootBlock, 'cursor outside fraction');
    assert.equal(cursor[R], mfrac, 'cursor before fraction');

    move('Down');
    assert.equal(cursor.parent, denom, 'cursor down goes into denominator');
    assert.equal(cursor[L], 0, 'cursor down from left of fraction inserts at left end of denominator');
  });

  test('nested subscripts and fractions', function() {
    rootBlock.renderLatex('\\frac{d}{dx_{\\frac{24}{36}0}}\\sqrt{x}=x^{\\frac{1}{2}}');
    var exp = rootBlock.endChild[R],
      expBlock = exp.endChild[L],
      half = expBlock.endChild[L],
      halfNumer = half.endChild[L],
      halfDenom = half.endChild[R];

    move('Left');
    assert.equal(cursor.parent, expBlock, 'cursor left goes into exponent');

    move('Down');
    assert.equal(cursor.parent, halfDenom, 'cursor down goes into denominator of half');

    move('Down');
    assert.equal(cursor.parent, rootBlock, 'down again puts cursor back in root block');
    assert.equal(cursor[L], exp, 'down from end of half puts cursor after exponent');

    var derivative = rootBlock.endChild[L],
      dBlock = derivative.endChild[L],
      dxBlock = derivative.endChild[R],
      sub = dxBlock.endChild[R],
      subBlock = sub.endChild[L],
      subFrac = subBlock.endChild[L],
      subFracNumer = subFrac.endChild[L],
      subFracDenom = subFrac.endChild[R];

    cursor.insAtLeftEnd(rootBlock);
    move('Down Right Right Down');
    assert.equal(cursor.parent, subBlock, 'cursor in subscript');

    move('Up');
    assert.equal(cursor.parent, subFracNumer, 'cursor up from beginning of subscript goes into subscript fraction numerator');

    move('Up');
    assert.equal(cursor.parent, dxBlock, 'cursor up from subscript fraction numerator goes out of subscript');
    assert.equal(cursor[R], sub, 'cursor up from subscript fraction numerator goes before subscript');

    move('Down Down');
    assert.equal(cursor.parent, subFracDenom, 'cursor in subscript fraction denominator');

    move('Up Up');
    assert.equal(cursor.parent, dxBlock, 'cursor up up from subscript fraction denominator that\s not at right end goes out of subscript');
    assert.equal(cursor[R], sub, 'cursor up up from subscript fraction denominator that\s not at right end goes before subscript');

    cursor.insAtRightEnd(subBlock).backspace();
    assert.equal(subFrac[R], 0, 'subscript fraction is at right end');
    assert.equal(cursor[L], subFrac, 'cursor after subscript fraction');

    move('Down');
    assert.equal(cursor.parent, subFracDenom, 'cursor in subscript fraction denominator');

    move('Up Up');
    assert.equal(cursor.parent, dxBlock, 'cursor up up from subscript fraction denominator that is at right end goes out of subscript');
    assert.equal(cursor[L], sub, 'cursor up up from subscript fraction denominator that is at right end goes after subscript');
  });
});
