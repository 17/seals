import querystring from 'querystring'

function isType (type) {
  return obj => {
    return {}.toString.call(obj) === '[object ' + type + ']'
  }
}

const isObject = isType('Object')
const isString = isType('String')
const isArray = Array.isArray || isType('Array')
const isFunction = isType('Function')
const isUndefined = isType('Undefined')
const isRegExp = isType('RegExp')

//  like jQuery
function each (obj, func) {
  if (isArray(obj)) {
    let length = obj.length
    for (let i = 0; i < length; i++) {
      if (func.call(obj[i], i, obj[i]) === false) {
        break
      }
    }
  } else {
    for (let i in obj) {
      if (func.call(obj[i], i, obj[i]) === false) {
        break
      }
    }
  }
  return obj
}

function buildParams (parts) {
  const param = []
  const add = (key, value) => {
    param.push(
      value
        ? encodeURIComponent(key) + '=' + encodeURIComponent(value)
        : encodeURIComponent(key)
    )
  }

  each(parts, (key, value) => {
    // TODO: object and array
    add(key, value)
  })

  return param.join('&')
}

function buildURL (url, parts) {
  return url + (/\?/.test(url) ? '&' : '?') + querystring.stringify(parts)
}

function toNumber (str) {
  const int = parseInt(str, 10)
  return isNaN(int) ? str : int
}

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// https://gist.github.com/jed/982883
function uuid () {
  return ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (a) {
    return (a ^ 16 * Math.random() >> a / 4).toString(16)
  })
}

function unEscapeHTML (markup) {
  var unescapeMap = {
    '&amp;': '&'
    , '&lt;': '<'
    , '&gt;': '>'
    , '&quot;': '"'
    , '&#x27;': "'"
    , '&#x60;': '`'
  }
  const MATCH_ESCAPE = /(?:&amp;|&lt;|&gt;|&quot;|&#39;)/g
  return markup == null
    ? ''
    : String(markup)
        .replace(MATCH_ESCAPE, c => unescapeMap[c] || c)
}

function chunk (array, count) {
  if (count == null || count < 1) return []

  let result = []
  let i = 0
  let length = array.length
  while (i < length) {
    result.push(Array.prototype.slice.call(array, i, i += count))
  }
  return result
}

export default {
  each
  , uuid
  , timeout
  , isObject
  , isString
  , isArray
  , isFunction
  , isUndefined
  , isRegExp
  , buildParams
  , buildURL
  , toNumber
  , unEscapeHTML
  , chunk
}
