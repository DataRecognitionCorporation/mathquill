suite('math tree', function() {

  function fromLatex(latex) {
    var block = latexMathParser.parse(latex);
    block.jQize();

    return block;
  }

  test('Counts number of nested MathBlocks', function() {
    var block = fromLatex('\\frac{d}{dx}\\sqrt{\\sqrt{\\sqrt{x}}}=');
    assert.equal(block.getMaxNesting(), 4);
  });
});
