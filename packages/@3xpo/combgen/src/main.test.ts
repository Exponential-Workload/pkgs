import generateCombinations, { Combinations } from '..';

describe('generateCombinations', () => {
  it('should generate all combinations of values from the input object', () => {
    const inputObj = {
      colors: ['red', 'blue'],
      sizes: ['small', 'large'],
      shapes: ['circle', 'square'],
    };

    const expectedCombinations: Combinations<typeof inputObj> = [
      { colors: 'red', sizes: 'small', shapes: 'circle' },
      { colors: 'red', sizes: 'small', shapes: 'square' },
      { colors: 'red', sizes: 'large', shapes: 'circle' },
      { colors: 'red', sizes: 'large', shapes: 'square' },
      { colors: 'blue', sizes: 'small', shapes: 'circle' },
      { colors: 'blue', sizes: 'small', shapes: 'square' },
      { colors: 'blue', sizes: 'large', shapes: 'circle' },
      { colors: 'blue', sizes: 'large', shapes: 'square' },
    ];

    const result = generateCombinations(inputObj);

    expect(result).toEqual(expectedCombinations);
  });

  it('should handle an empty input object', () => {
    const inputObj = {};

    const result = generateCombinations(inputObj);

    expect(result).toEqual([{}]);
  });

  it('should handle an input object with one key-value pair', () => {
    const inputObj = {
      numbers: [1, 2, 3],
    };

    const expectedCombinations: Combinations<typeof inputObj> = [
      { numbers: 1 },
      { numbers: 2 },
      { numbers: 3 },
    ];

    const result = generateCombinations(inputObj);

    expect(result).toEqual(expectedCombinations);
  });
});
