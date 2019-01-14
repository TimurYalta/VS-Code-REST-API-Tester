'use strict'
const vscode = require('vscode');
const str = require("./strings.js")

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
        [str.YES, str.NO],
        { canPickMany: false,
            placeHolder: str.QUERY_INFO,
            ignoreFocusOut: true 
        });
}

function askForRequestMethod(){
    return vscode.window.showQuickPick(
        [str.POST, str.GET],
        { canPickMany: false,
            placeHolder: str.QUERY_METHOD,
            ignoreFocusOut: true 
        });
}
function askInput(quest){
    return vscode.window.showInputBox({ prompt: quest, ignoreFocusOut: true });
}

module.exports={
    renderContent,
    renderError,
    askForAdditionalInfo,
    askForRequestMethod,
    askInput
};