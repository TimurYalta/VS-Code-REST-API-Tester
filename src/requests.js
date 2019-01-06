'use strict'
const fetch = require("node-fetch");

const sendRequest = (url, options ) => {
    return fetch(url, options)
                .catch(e=>{throw e;});
}
module.exports={
    sendRequest
}