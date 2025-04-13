// use this for complete logging

const isDebug='false'
const logger={

    log:(...args)=>isDebug=='true' && console.log(...args),
    warn: (...args)=>isDebug=='true' && console.log(...args),
    error: (...args)=>isDebug=='true' && console.log(...args)
    
   
};

export default logger