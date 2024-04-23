import { stringify } from 'node:querystring';
import stringifyQuery from '../dist/stringify.mjs';
import encodeString from './fast-encode.mjs';

const testData1 = { a: 1, b: null, c: undefined, d: NaN, e: '', f: true, g: false, h: Infinity };
const testData2 = { a: '', b: undefined, c: ['\'1\'', '2', '3', NaN, undefined], f: null, '': 'null' };
const testData3 = { a: { key: 'value', key2: 'value2' }, d: undefined, f: '' };
const testData4 = { a: () => (1), b: Symbol('test') };
const testData5 = { foo: 'bar', bar: 'foo', baz: 'foo' };
const testData6 = {
  frappucino: 'muffin',
  goat: 'scone',
  pond: 'moose',
  foo: ['bar', 'baz', 'bal'],
  bool: true,
  // eslint-disable-next-line no-undef
  bigIntKey: BigInt(100),
  numberKey: 256
};

const opts = { encodeURIComponent: encodeString };

// 测试 stringifyQuery
export default [
  {
    '【node:querystring.stringify】'() {
      stringify(testData1);
    },

    '【fast-qs.stringify】'() {
      stringifyQuery(testData1, opts);
    }
  },

  {
    '【node:querystring.stringify】'() {
      stringify(testData2);
    },

    '【fast-qs.stringify】'() {
      stringifyQuery(testData2, opts);
    }
  },

  {
    '【node:querystring.stringify】'() {
      stringify(testData3);
    },

    '【fast-qs.stringify】'() {
      stringifyQuery(testData3, opts);
    }
  },

  {
    '【node:querystring.stringify】'() {
      stringify(testData4);
    },

    '【fast-qs.stringify】'() {
      stringifyQuery(testData4, opts);
    }
  },

  {
    '【node:querystring.stringify】'() {
      stringify(testData5);
    },

    '【fast-qs.stringify】'() {
      stringifyQuery(testData5, opts);
    }
  },

  {
    '【node:querystring.stringify】'() {
      stringify(testData6);
    },

    '【fast-qs.stringify】'() {
      stringifyQuery(testData6, opts);
    }
  }
];
