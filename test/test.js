let expect = require('chai').expect;
let converter = require('../js/app');


describe('_getConvertedNumber', function () {
  it('should convert a number up to the hundreds', function () {
    expect(converter._getConvertedNumber(['0', '0', '5'])).to.be.equal('five');
    expect(converter._getConvertedNumber(['0', '1', '1'])).to.be.equal('eleven');
    expect(converter._getConvertedNumber(['0', '8', '5'])).to.be.equal('eighty five');
    expect(converter._getConvertedNumber(['0', '8', '0'])).to.be.equal('eighty');
    expect(converter._getConvertedNumber(['1', '0', '0'])).to.be.equal('one hundred');
    expect(converter._getConvertedNumber(['1', '1', '2'])).to.be.equal('one hundred and twelve');
    expect(converter._getConvertedNumber(['1', '4', '9'])).to.be.equal('one hundred and forty nine');
    expect(converter._getConvertedNumber(['1', '0', '3'])).to.be.equal('one hundred and three');
  })
});

describe('_getFormattedNumberList', function () {
  it('should convert number string to a list', function () {
    expect(converter._getFormattedNumberList('0')).to.be.eql(['0', '0', '0']);
    expect(converter._getFormattedNumberList('15')).to.be.eql(['0', '1', '5']);
    expect(converter._getFormattedNumberList('000001')).to.be.eql(['0', '0', '1']);
    expect(converter._getFormattedNumberList('103')).to.be.eql(['1', '0', '3']);
    expect(converter._getFormattedNumberList('112')).to.be.eql(['1', '1', '2']);
    expect(converter._getFormattedNumberList('20')).to.be.eql(['0', '2', '0']);
    expect(converter._getFormattedNumberList('1234')).to.be.eql(['0', '0', '1', '2', '3', '4']);
  });

  it('should throw error when converting faulty number string', function() {
    let doesThrowError = false;
    try {
      converter.getEnglish('11d11')
    } catch(e) {
      doesThrowError = true;
    }
    expect(doesThrowError).to.be.equal(true);
  });
});

describe('getEnglish', function () {
  it('should convert number string to english word string', function () {
    expect(converter.getEnglish('1')).to.be.equal('One');
    expect(converter.getEnglish('0')).to.be.equal('Zero');
    expect(converter.getEnglish('012')).to.be.equal('Twelve');
    expect(converter.getEnglish('103')).to.be.equal('One hundred and three');
    expect(converter.getEnglish('1000')).to.be.equal('One thousand');
    expect(converter.getEnglish('1231')).to.be.equal('One thousand two hundred and thirty one');
    expect(converter.getEnglish('5600003')).to.be.equal('Five million six hundred thousand three');
    expect(converter.getEnglish('10000')).to.be.equal('Ten thousand');
    expect(converter.getEnglish('3010000006')).to.be.equal('Three billion ten million six');
    expect(converter.getEnglish('3000000000')).to.be.equal('Three billion');
    expect(converter.getEnglish('105502')).to.be.equal('One hundred and five thousand five hundred and two');
    expect(converter.getEnglish('1131102')).to.be.equal('One million one hundred and thirty one thousand one hundred and two');
  });

  it('should throw error when surpassing number limit', function() {
    let doesThrowError = false;
    try {
      converter.getEnglish('1000000000000000000000')
    } catch(e) {
      doesThrowError = true;
    }
    expect(doesThrowError).to.be.equal(true);
  });
});