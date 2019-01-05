'use strict'
const fetch = require("node-fetch");

const sendRequest = (url, options ) => {
    console.log("Request sent");
    return fetch(url, options);
}
module.exports={
    sendRequest
}