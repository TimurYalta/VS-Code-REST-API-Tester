const vscode = require('vscode');
const request = require('./requests.js');
const view = require('./view.js');
const utils = require('./utils.js');


const performRequest = (url, options) => {
    request.sendRequest(url,options)
    .then(body => {
        return utils.parseResponse(body);
    })
    .then((string)=>{
        view.renderContent(string);
    })
    .catch(err => view.renderError(`${err.name}: ${err.message}`));
};

const sendGET = () => {
    vscode.window.showInputBox({prompt:"Enter the URI to send GET request to (with parameters included)", ignoreFocusOut:true})
    .then((uri)=>{
        if(!uri){
            view.renderError("Incorrect URI!!")
            return;
        }
        vscode.window.showInputBox({prompt:"Enter the headers in JSON format(optionally)", ignoreFocusOut:true})
        .then((headers)=>{
            const options = {method: 'GET'};
            if(headers){
                try{
                    options.headers = JSON.parse(headers);
                }
                catch(e){
                    view.renderError("Incorrect JSON format!");
                    return;
                }
            }
            performRequest(uri, options);
        });
    });
};

const sendPOST = () => {
    vscode.window.showInputBox({prompt:"Enter the URI to send GET request to (with parameters included)", ignoreFocusOut:true})
    .then((uri)=>{
        if(!uri){
            view.renderError("Incorrect URI!!")
            return;
        }
        vscode.window.showInputBox({prompt:"Enter the headers in JSON format(optionally)", ignoreFocusOut:true})
        .then((headers)=>{
            const options = {method: 'POST'};
            if(headers){
                try{
                    options.headers = JSON.parse(headers);
                }
                catch(e){
                    view.renderError("Incorrect JSON format!");
                    return;
                }
            }
            vscode.window.showInputBox({prompt:"Enter the body of POST request(optionally)", ignoreFocusOut:true})
            .then((body)=>{
                if(body){
                    options.body = body;
                }
                performRequest(uri, options);
            })
        });
    });
};

module.exports = {
    performRequest,
    sendGET,
    sendPOST
};
