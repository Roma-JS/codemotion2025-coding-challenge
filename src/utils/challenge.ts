export const defaultCode = `
const romanNumerals = {
  'I': 1,
  'V': 5,
  'X': 10,
  'L': 50,
  'C': 100,
  'D': 500,
  'M': 1000
};

function convertRomanToDecimal(roman: string): number {
  // your code here
}
`;

export const tests = `
describe('Convert Roman Numeral to Number', function () {
  it('should convert empty string to 0', function () {
    assert.equal(convertRomanToDecimal(''), 0);
  });

  it('should handle null input', function () {
    assert.equal(convertRomanToDecimal(null), 0);
  });

  it('should handle undefined input', function () {
    assert.equal(convertRomanToDecimal(undefined), 0);
  });

  it('should convert III to 3', function () {
    assert.equal(convertRomanToDecimal('III'), 3);
  });

  // it('should convert IV to 4', function () {
  //   assert.equal(convertRomanToDecimal('IV'), 4);
  // });

  // it('should convert IX to 9', function () {
  //   assert.equal(convertRomanToDecimal('IX'), 9);
  // });

  // it('should convert XIII to 13', function () {
  //   assert.equal(convertRomanToDecimal('XIII'), 13);
  // });

  // it('should convert XIV to 14', function () {
  //   assert.equal(convertRomanToDecimal('XIV'), 14);
  // });

  // it('should convert XCIV to 94', function () {
  //   assert.equal(convertRomanToDecimal('XCIV'), 94);
  // });

  // it('should handle lowercase roman numerals', function () {
  //   assert.equal(convertRomanToDecimal('xiv'), 14);
  // });

  // it('should handle mixed case roman numerals', function () {
  //   assert.equal(convertRomanToDecimal('XiV'), 14);
  // });

  // it('should convert MCMXCVI to 1996', function () {
  //   assert.equal(convertRomanToDecimal('MCMXCVI'), 1996);
  // });

  // it('should convert MMXIV to 2014', function () {
  //   assert.equal(convertRomanToDecimal('MMXIV'), 2014);
  // });

  // it('this is a secret test', function () {
  //     try {
  //     assert.equal(convertRomanToDecimal('MMXXV'), 2025);
  //   } catch (e) {
  //     assert.fail('');
  //   }
  // });

  // it('this is a secret test', function () {
  //   try {
  //     assert.equal(convertRomanToDecimal('MMMCMXCIX'), 3999);
  //   } catch (e) {
  //     assert.fail('');
  //   }
  // });

  // it('should handle invalid characters in roman numerals', function () {
  //   assert.throws(() => convertRomanToDecimal('XYZ'), Error);
  // });

  // it('should handle invalid roman numeral patterns', function () {
  //   assert.throws(() => convertRomanToDecimal('IIII'), Error);
  // });
});
`