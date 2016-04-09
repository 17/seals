import request from './srequest'

function blobToDataURI (content, mimetype) {
  const base64 = new Buffer(content).toString('base64')
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs
  // return ['data:', mimetype, ';base64,', base64].join('')
  return `data:${mimetype};base64,${base64}`
}

function fromURLToDataURI (url, session = request) {
  return new Promise((resolve, reject) => {
    session.get(url, { encoding: null })
      .then(response => {
        if (response.statusCode === 200) {
          const datauri = blobToDataURI(response.body, response.headers['content-type'])
          resolve(datauri)
        } else reject()
      })
      .catch(reject)
  })
}

export default {
  blobToDataURI
  , fromURL: fromURLToDataURI
}
