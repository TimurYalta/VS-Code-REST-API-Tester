const vscode = require('vscode');
const regExp = require('./urlRegEx.js').regExp;
const request = require('./requests.js');
const view = require('./view.js');
const utils = require('./utils.js');
const str= require('./strings.js')


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
    view.askInput(str.ENTER_GET_URL)
        .then((uri) => {
            if (!uri || !uri.match(regExp)) {
                view.renderError(str.URI_ERROR)
                return;
            }

            view.askInput(str.ENTER_HEADERS)
                .then((headers) => {
                    const options = { method: str.GET};
                    if (headers) {
                        try {
                            options.headers = JSON.parse(headers);
                        }
                        catch (e) {
                            view.renderError(str.JSON_ERROR);
                            return;
                        }
                    }
                    performRequest(uri, options);
                });
        });
};

const sendPOST = () => {
    view.askInput(str.ENTER_POST_URL)
        .then((uri) => {
            if (!uri || !uri.match(regExp)) {
                view.renderError(str.URI_ERROR)
                return;
            }
            view.askInput(str.ENTER_HEADERS)
                .then((headers) => {
                    const options = { method: str.POST };
                    if (headers) {
                        try {
                            options.headers = JSON.parse(headers);
                        }
                        catch (e) {
                            view.renderError(str.JSON_ERROR);
                            return;
                        }
                    }

                    view.askInput(str.ENTER_POST_BODY)
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

    let uri;
    try{
        uri = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection);
    }
    catch(e){
        view.renderError(str.NO_EDITOR_ERROR);
        return;
    }

    if (!uri || !uri.match(regExp)) {
        view.renderError(str.URI_ERROR);
        return;
    }
    let options = {method:str.GET};
    view.askForAdditionalInfo()
        .then(
            (res) => {
                
                if (res == str.YES) {
                    view.askForRequestMethod()
                        .then((res) => {
                            options.method=res;
                            view.askInput(str.ENTER_HEADERS)
                            .then((headers) => {
                                if (headers) {
                                    try {
                                        options.headers = JSON.parse(headers);
                                    }
                                    catch (e) {
                                        view.renderError(str.JSON_ERROR);
                                        return;
                                    }
                                }
                                if(res == str.POST){
                                    view.askInput(str.ENTER_POST_BODY)
                                    .then((body) => {
                                        if (body) {
                                            options.body = body;
                                        }
                                        performRequest(uri, options);
                                    })
                                }
                                else{
                                    performRequest(uri,options);
                                }
                            });
                        });
                }
                else {
                    performRequest(uri,options);
                }
            })
        .catch((e) => { 
            view.renderError(e); 
            return; 
        });
}

const openRequestFile = () =>{
    vscode.window.showOpenDialog({canSelectFiles:true, canSelectFolders: false, canSelectMany:false})
    .then((file)=>{
        const uri= file[0].fsPath;
        if(!uri.match(/(.req)$/)){
            view.renderError(str.EXTENSION_ERROR);
            return;
        }
        vscode.workspace.openTextDocument(file[0])
        .then( doc => vscode.window.showTextDocument( doc,vscode.ViewColumn.Beside ) )
        .then(
            ()=>{
                startRequestFile();
            }
        );

    })
    .catch((e)=>{view.renderError(e)});
}

const startRequestFile = () => {
    let filename;
    try{
        filename = vscode.window.activeTextEditor.document.fileName;
    }
    catch(e){
        view.renderError(str.NO_FILE_ERROR);
        return
    }
    
    const isReqFile = filename.match(/(.req)$/);
    if(!isReqFile){
        view.renderError(str.EXTENSION_ERROR);
    }
    else{
        const requests = utils.requestParser(filename);
        for(let req of requests){
            performRequest(req.URI,req.options);
        }
    }
}

const createRequestFile = () => {
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
