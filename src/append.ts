
import parseQuery from './_parse';
import stringifyQuery from './_stringify';
import { forOwn } from 'celia';
import { AppendOptions } from './declaring';

function concat(url: string, query: string, hasQM: boolean): string {
  return url + (hasQM ? '&' : '?') + query;
}

function appendQuery(url: string, qs: string): string {
  let questionMark = -1;
  let hashMark = -1;
  const len = url.length;

  // eslint-disable-next-line no-labels
  loop: for (let i = 0; i < len; i++) {
    switch (url[i]) {
      case '?':
        questionMark = i;
        break;
      case '#':
        hashMark = i;
        // eslint-disable-next-line no-labels
        break loop;
    }
  }

  return hashMark === -1
    ? concat(url, qs, questionMark !== -1)
    : concat(url.slice(0, hashMark), qs, questionMark !== -1) + url.slice(hashMark);
}


/**
 * 在 URL 地址后追加 query 参数
 *
 * @example
 * ```js
 * append('http://demo.com', 'a=1&b=1&c=1');
 * // 'http://demo.com?a=1&b=1&c=1'
 *
 * append('http://demo.com?test=1#hash', 'a=1&b=1&c=1');
 * // 'http://demo.com?test=1&a=1&b=1&c=1#hash'
 *
 * append('http://demo.com', { a: 1, b: 1, c: 1 });
 * // 'http://demo.com?a=1&b=1&c=1'
 *
 * append('http://demo.com?test=1#hash', { a: 1, b: 1, c: 1 });
 * // 'http://demo.com?test=1&a=1&b=1&c=1#hash'
 *
 * append('http://demo.com', 'a=1&b=1&c=1&hideTopbar=1&hideSidebar=1', {
 *   filter(key) {
 *     return key !== 'hideTopbar' && key !== 'hideSidebar';
 *   },
 * })
 * // 'http://demo.com?a=1&b=1&c=1'
 *
 * append('http://demo.com', { a: 1, b: 1, c: 1, hideTopbar: 1, hideSidebar: 1 }, {
 *   filter(key) {
 *     return key !== 'hideTopbar' && key !== 'hideSidebar';
 *   },
 * })
 * // 'http://demo.com?a=1&b=1&c=1'
 * ```
 *
 * @param url URL 地址
 * @param query 以字符串或者对象形式的 query 参数
 * @param opts 可选参数
 * @returns 追加 query 参数后的 URL 地址
 */
export default function append(
  url: string,
  query: string | object,
  opts?: AppendOptions
): string {
  if (!url) {
    return '';
  }

  if (!query) {
    return url;
  }

  if (!opts) {
    opts = {};
  }

  let {
    sep,
    eq
  } = opts;

  if (!sep) {
    sep = '&';
  }
  if (!eq) {
    eq = '=';
  }

  const {
    decodeURIComponent,
    encodeURIComponent,
    filter
  } = opts;

  let qs = '';

  switch (typeof query) {
    case 'object': {
      qs = stringifyQuery(query, sep, eq, encodeURIComponent, filter);
      break;
    }
    case 'string':
      if (filter) {
        const ret: string[] = [];
        forOwn(
          parseQuery(query, 0, sep, eq, decodeURIComponent, filter),
          (val: string | string[], key: string) => {
            if (Array.isArray(val)) {
              val.forEach((v: string) => {
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                ret[ret.length] = key + eq + v;
              });
            }
            else {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              ret[ret.length] = key + eq + val;
            }
          });
        qs = ret.join(sep);
      }
      else {
        qs = query;
      }
      break;
    default:
      return url;
  }

  return appendQuery(url, qs);
}
