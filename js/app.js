const MAP = {
  SINGLE: {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine'
  },
  TEEN: {
    '0': 'ten',
    '1': 'eleven',
    '2': 'twelve',
    '3': 'thirteen',
    '4': 'fourteen',
    '5': 'fifteen',
    '6': 'sixteen',
    '7': 'seventeen',
    '8': 'eighteen',
    '9': 'nineteen'
  },
  TEN: {
    '2': 'twenty',
    '3': 'thirty',
    '4': 'forty',
    '5': 'fifty',
    '6': 'sixty',
    '7': 'seventy',
    '8': 'eighty',
    '9': 'ninety'
  }
};

const AMOUNT = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];

const WORD = {
  HUNDRED: 'hundred',
  AND: 'and',
  ZERO: 'Zero'
};

const NUMS = {
  ZERO: '0',
  ONE: '1'
};

var Converter = {
  getEnglish: function(str) {
    if (str.length == 0) {
      return '';
    }

    if (str.length > AMOUNT.length * 3) {
      throw new Error('Maximum number possible passed!')
    }

    let result = [];
    const numList = this._getFormattedNumberList(str);

    if (numList.length == 3 && this._isAllZeroes(numList)) {
      return WORD.ZERO;
    }

    let amountIndex = 0;
    for (let i=numList.length - 1; i>0; i-=3) {
      const hundredsList = numList.slice(i - 2, i + 1);

      if (!this._isAllZeroes(hundredsList)) {
        if (amountIndex > 0) {
          result.unshift(AMOUNT[amountIndex]);
        }
        result.unshift(this._getConvertedNumber(hundredsList));
      }

      amountIndex += 1;
    }

    result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
    return result.join(' ');
  },

  _isAllZeroes: function(list) {
    return list.every(x => x == 0);
  },

  // converts ['0', '1', '5'] to 'fifteen'
  _getConvertedNumber: function(arr) {
    const result = [];

    if (arr[0] != NUMS.ZERO) {
      result.push(MAP.SINGLE[arr[0]]);
      result.push(WORD.HUNDRED);
      if (arr[1] != NUMS.ZERO || arr[2] != NUMS.ZERO) {
        result.push(WORD.AND);
      }
    }

    if (arr[1] == NUMS.ONE) {
      result.push(MAP.TEEN[arr[2]]);
      return result.join(' ');
    }

    if (arr[1] != NUMS.ZERO) {
      result.push(MAP.TEN[arr[1]]);
    }

    if (arr[2] != NUMS.ZERO) {
      result.push(MAP.SINGLE[arr[2]]);
    }

    return result.join(' ');
  },
  // returns '0015' formatted as ['0', '1', '5']
  _getFormattedNumberList: function (str) {
    const numbersRegex = /^[0-9]+$/;
    if (!str.match(numbersRegex)) {
      throw new Error("Invalid input, must be all numbers.");
    }

    const strList = str.replace(/^[0|\D]*/,'').split('');
    // if string is all zeroes
    if (strList.length == 0) {
      strList.push(NUMS.ZERO);
    }

    let padSize = 0;
    const remainder = strList.length % 3;
    if (remainder != 0) {
      padSize = 3 - remainder;
    }

    for(let i=0; i<padSize; i++) {
      strList.unshift(NUMS.ZERO);
    }

    return strList;
  }
};

var app = {
  init: function (inputBox, textBox) {
    inputBox.on('input', function () {
      try {
        textBox.text(Converter.getEnglish(inputBox.val()));
      } catch (e) {
        textBox.text(e.message);
      }
    });
  }
};

module.exports = Converter;

