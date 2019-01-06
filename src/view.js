'use strict'
const vscode = require('vscode');

function renderContent( content, options ) {
    options = options || {
        language: 'text'
    };

    return vscode.workspace.openTextDocument( {
            language: options.language
        } )
        .then( doc => vscode.window.showTextDocument( doc,vscode.ViewColumn.Beside ) )
        .then( editor => {
            let editBuilder = textEdit => {
                textEdit.insert( new vscode.Position( 0, 0 ), String( content ) );
            };

            return editor.edit( editBuilder, {
                    undoStopBefore: true,
                    undoStopAfter: false
                } )
                .then( () => editor );
        } );
}

function renderError(message){
    return vscode.window.showErrorMessage(message);
}

function askForAdditionalInfo(){
    return vscode.window.showQuickPick(
        ["Yes", "No"],
        { canPickMany: false,
            placeHolder: "Would you like to add additional info to request?",
            ignoreFocusOut: true 
        });
}

function askForRequestMethod(){
    return vscode.window.showQuickPick(
        ["POST", "GET"],
        { canPickMany: false,
            placeHolder: "Choose request method",
            ignoreFocusOut: true 
        });
}

function askForHeaders(){
    return vscode.window.showInputBox({ prompt: "Enter the headers in JSON format(optionally)", ignoreFocusOut: true });
}
function askForBody(){
    return vscode.window.showInputBox({ prompt: "Enter the body of POST request(optionally)", ignoreFocusOut: true });
}

module.exports={
    renderContent,
    renderError,
    askForAdditionalInfo,
    askForRequestMethod,
    askForHeaders,
    askForBody
};