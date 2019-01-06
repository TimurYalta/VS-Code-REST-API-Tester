const vscode = require('vscode');

const regExp = require('./urlRegEx.js').regExp;
const request = require('./requests.js');
const view = require('./view.js');
const utils = require('./utils.js');


const performRequest = (url, options) => {
    request.sendRequest(url, options)
        .then(body => {
            return utils.parseResponse(body);
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

module.exports = {
    performRequest,
    sendGET,
    sendPOST,
    sendToSelected
};
