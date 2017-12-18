const MAP = {
  SINGLE: {
    '0': 'zero',
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
  AND: 'and'
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

    let result = [];
    const numList = this._getFormattedNumberList(str);
    let amountIndex = 0;

    for (let i=numList.length - 1; i>0; i-=3) {
      if (amountIndex > 0) {
        result.unshift(AMOUNT[amountIndex]);
      }
      result.unshift(this._getConvertedNumber(numList.slice(i - 2, i + 1)));
      amountIndex += 1;
    }

    result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);

    return result.join(' ');
  },
  // converts ['0', '1', '5'] to 'fifteen'
  _getConvertedNumber: function(arr) {
    const result = [];

    if (arr[0] == NUMS.ZERO && arr[1] == NUMS.ZERO && arr[2] == NUMS.ZERO) {
      result.push(MAP.SINGLE[arr[2]]);
      return result.join(' ');
    }

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

// unit tests
console.assert(Converter._getConvertedNumber(['0', '0', '0']) == 'zero', 'Conversion error');
console.assert(Converter._getConvertedNumber(['0', '0', '5']) == 'five', 'Conversion error');
console.assert(Converter._getConvertedNumber(['0', '1', '1']) == 'eleven', 'Conversion error');
console.assert(Converter._getConvertedNumber(['0', '8', '5']) == 'eighty five', 'Conversion error');
console.assert(Converter._getConvertedNumber(['0', '8', '0']) == 'eighty', 'Conversion error');
console.assert(Converter._getConvertedNumber(['1', '0', '0']) == 'one hundred', 'Conversion error');
console.assert(Converter._getConvertedNumber(['1', '1', '2']) == 'one hundred and twelve', 'Conversion error');
console.assert(Converter._getConvertedNumber(['1', '4', '9']) == 'one hundred and forty nine', 'Conversion error');
console.assert(Converter._getConvertedNumber(['1', '0', '3']) == 'one hundred and three', 'Conversion error');

console.assert(Converter._getFormattedNumberList('0').toString() == ['0', '0', '0'].toString());
console.assert(Converter._getFormattedNumberList('15').toString() == ['0', '1', '5'].toString());
console.assert(Converter._getFormattedNumberList('000001').toString() == ['0', '0', '1'].toString());
console.assert(Converter._getFormattedNumberList('112').toString() == ['1', '1', '2'].toString());
console.assert(Converter._getFormattedNumberList('20').toString() == ['0', '2', '0'].toString());
console.assert(Converter._getFormattedNumberList('1234').toString() == ['0', '0', '1', '2', '3', '4'].toString());
let isOnlyNumbersChecked = false;
try {
  Converter._getFormattedNumberList('11d11');
} catch (e) {
  isOnlyNumbersChecked = true;
}
console.assert(isOnlyNumbersChecked);

console.assert(Converter.getEnglish('1234') == 'One thousand two hundred and thirty four');

