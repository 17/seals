// simple-request
import Event from 'events'
import http from 'http'
import https from 'https'
import urllib from 'url'
import querystring from 'querystring'
import zlib from 'zlib'

// FIXME: 去除 cookiejar 依赖
import { CookieJar, CookieAccessInfo } from 'cookiejar'
import helpers from './helpers'

// method, headers, params, data, gzip, cookies, jar, session, encoding, timeout
function normalizeOptions (url, {
  method
  , headers
  , encoding
  , params
  , data
  , gzip
  , cookies
  , jar
  , session
  , timeout
} = {}) {
  let {
    protocol
    , hostname
    , port
    , path
  } = urllib.parse(url)

  headers = Object.assign({}, headers)

  // TODO: unix
  // if (hostname == 'unix') {
  //
  // }

  if (params) {
    path = helpers.buildURL(path, params)
  }

  if (data) {
    data = helpers.isObject(data)
      ? querystring.stringify(data)
      : data
    const length = helpers.isString(data)
                    ? Buffer.byteLength(data)
                    : data.length
    headers['Content-Length'] = length
  }

  if (gzip) {
    headers['Accept-Encoding'] = 'gzip, deflate'
  }

  if (cookies || jar) {
    // FIXME: 需要重构
    const _jar = jar || CookieJar()

    if (cookies) {
      // 用 :(%3a) 分割 Cookie 不属于 RFC6265, 这里仅用于 Parse
      _jar.setCookies(querystring.stringify(cookies, ':', '='))
    }

    // headers['Cookie'] && console.warn('不允许在 header 设置 cookie')
    headers['Cookie'] = _jar.getCookies(CookieAccessInfo(hostname, path)).toValueString()
    // _jar = null
  }

  return [{
    protocol
    // , host,
    , hostname
    , port
    , method
    , path
    , headers
  }, {
    method
    , headers
    , encoding
    , params
    , data
    , gzip
    , cookies
    , jar
    , session
    , timeout
  }]
}

function requestEventEmitter (params, options) {
  const eventEmitter = new Event()
  const module = params.protocol === 'https:' ? https : http
  const fetch = (params, opts) => {
    console.log(params, opts)
    const req = module.request(params, res => {
      console.log(res)
      // FIXME: 需要重构
      if (opts.jar && helpers.isArray(res.headers['set-cookie'])) {
        opts.jar.setCookies(res.headers['set-cookie'])
      }

      // 3.01 ^ 0 === 3
      if ((res.statusCode / 100 ^ 0) === 3) {
        res.resume()
        const redirectURL = urllib.resolve(urllib.format(params), res.headers.location)
        fetch(...normalizeOptions(redirectURL, opts))
        return
      }

      const content = []
      let length = 0

      // ES7
      // let stream = ['gzip', 'deflate'].includes(res.headers['content-encoding'])
      // ~-1 === 0 == false
      const stream = ~['gzip', 'deflate'].indexOf(res.headers['content-encoding'])
              ? res.pipe(zlib.createUnzip())
              : res

      if (opts.encoding !== null) {
        stream.setEncoding(opts.encoding || 'utf8')
      }

      stream.once('error', error => {
        eventEmitter.emit('error', error)
      })

      stream.on('data', chunk => {
        content.push(chunk)
        length += chunk.length
        eventEmitter.emit('data', chunk)
      })

      stream.on('end', () => {
        res.body = opts.encoding === null
          ? Buffer.concat(content, length)
          : content.join('')

        eventEmitter.emit('end', res)
        eventEmitter.emit('response', res)
      })
    })

    req.once('error', error => {
      eventEmitter.emit('error', error)
      console.error(error)
    })

    if (opts.timeout) {
      req.setTimeout(opts.timeout, () => {
        req.abort()
        // eventEmitter.emit('timeout')
        const error = new Error('timeout')
        eventEmitter.emit('error', error)
      })
    }

    if (opts.data) {
      req.write(opts.data)
    }

    req.end()
  }

  fetch(params, options)
  return eventEmitter
}

function request (url, options) {
  return new Promise((resolve, reject) => {
    requestEventEmitter(...normalizeOptions(url, options))
      .on('response', resolve)
      .on('error', reject)
  })
}

function wrapRequestMethod (method, options) {
  return (url, opts) => {
    const _opts = Object.assign({
      method
    }, options, opts)
    return request(url, _opts)
  }
}

const method = ['get', 'post', 'put', 'patch', 'head', 'delete']

method.forEach(value => {
  request[value] = wrapRequestMethod(value)
})

request.defaults = options => {
  const result = {}

  if (options.session) {
    // FIXME: 需要重构
    result.jar = options.jar = options.jar || CookieJar()
  }

  method.forEach(value => {
    result[value] = wrapRequestMethod(value, options)
  })

  return result
}

export default request
