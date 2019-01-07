const vscode = require('vscode');
const regExp = require('./urlRegEx.js').regExp;
const request = require('./requests.js');
const view = require('./view.js');
const utils = require('./utils.js');


const performRequest = (url, options) => {
    request.sendRequest(url, options)
        .then(body => {
            return utils.parseResponse(body, {url, options});
        })
        .then((string) => {
            view.renderContent(string);
        })
        .catch(err => view.renderError(`${err.name}: ${err.message}`));
};

const sendGET = () => {
    vscode.window.showInputBox({ prompt: "Enter the URI to send GET request to (with parameters included)", ignoreFocusOut: true })
        .then((uri) => {
            if (!uri || !uri.match(regExp)) {
                view.renderError("Incorrect URI!!")
                return;
            }

            view.askForHeaders()
                .then((headers) => {
                    const options = { method: 'GET' };
                    if (headers) {
                        try {
                            options.headers = JSON.parse(headers);
                        }
                        catch (e) {
                            view.renderError("Incorrect JSON format!");
                            return;
                        }
                    }
                    performRequest(uri, options);
                });
        });
};

const sendPOST = () => {
    vscode.window.showInputBox({ prompt: "Enter the URI to send POST request to (with parameters included)", ignoreFocusOut: true })
        .then((uri) => {
            if (!uri || !uri.match(regExp)) {
                view.renderError("Incorrect URI!!")
                return;
            }
            view.askForHeaders()
                .then((headers) => {
                    const options = { method: 'POST' };
                    if (headers) {
                        try {
                            options.headers = JSON.parse(headers);
                        }
                        catch (e) {
                            view.renderError("Incorrect JSON format!");
                            return;
                        }
                    }

                    view.askForBody()
                        .then((body) => {
                            if (body) {
                                options.body = body;
                            }
                            performRequest(uri, options);
                        })
                });
        });
};

const sendToSelected = () => {

    const uri = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection);

    if (!uri || !uri.match(regExp)) {
        view.renderError("Invalid URI!");
        return;
    }
    view.askForAdditionalInfo()
        .then(
            (res) => {
                if (res == "Yes") {
                    view.askForRequestMethod()
                        .then((res) => {
                            const options = {method:res};
                            view.askForHeaders()
                            .then((headers) => {
                                if (headers) {
                                    try {
                                        options.headers = JSON.parse(headers);
                                    }
                                    catch (e) {
                                        view.renderError("Incorrect JSON format!");
                                        return;
                                    }
                                }
                                if(res == "POST"){
                                    view.askForBody()
                                    .then((body) => {
                                        if (body) {
                                            options.body = body;
                                        }
                                        performRequest(uri, options);
                                    })
                                }
                                else{
                                    performRequest(uri, options);
                                }
                            });
                        });
                }
                else {
                    performRequest(uri);
                }
            })
        .catch((e) => { view.renderError(e) });
}

const openRequestFile = () =>{
    vscode.window.showOpenDialog({canSelectFiles:true, canSelectFolders: false, canSelectMany:false})
    .then((file)=>{
        const uri= file[0].fsPath;
        vscode.workspace.openTextDocument(file[0])
        .then( doc => vscode.window.showTextDocument( doc,vscode.ViewColumn.Beside ) )
        .then(
            ()=>{
                const requests = utils.requestParser(uri);
                for(let req of requests){
                    performRequest(req.URI,req.options);
                }
            }
        );

    })
    .catch((e)=>{view.renderError(e)});
}

const startRequestFile = () => {
    const filename = vscode.window.activeTextEditor.document.fileName;
    const isReqFile = filename.match(/(.req)$/);
    if(!isReqFile){
        view.renderError("Invalid file extension");
    }
    else{
        const requests = utils.requestParser(filename);
        for(let req of requests){
            performRequest(req.URI,req.options);
        }
    }
}

const createRequestFile = () => {
    // const filename = vscode.window.activeTextEditor.document.fileName;
    // const isReqFile = filename.match(/(.req)$/);
    // if(!isReqFile){
    //     view.renderError("Invalid file extension");
    // }
    // else{
    //     const requests = utils.requestParser(filename);
    //     for(let req of requests){
    //         performRequest(req.URI,req.options);
    //     }
    // }
    view.renderContent(utils.getReqSnippet());
}


module.exports = {
    performRequest,
    sendGET,
    sendPOST,
    sendToSelected,
    openRequestFile,
    startRequestFile,
    createRequestFile
};
