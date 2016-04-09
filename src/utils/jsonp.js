import vm from 'vm'

function evalJsonp (code, callbackName) {
  const sandbox = {
    _error: null
    , _args: null
  }
  const script = `function ${callbackName}(){_args=arguments}try{${code}}catch(e){_error=e}`
  // let es6_script = `function ${callbackName}(...args){_args=args}try{${code}}catch(e){_error=e}`

  vm.runInNewContext(script, sandbox)

  if (sandbox._error) {
    throw new Error(sandbox._error)
  }

  // return [].slice.call(sandbox.__args).sort()
  return Array.from(sandbox._args)
}

export default {
  evalJsonp
}
