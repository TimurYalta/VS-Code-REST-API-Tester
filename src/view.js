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


module.exports={
    renderContent,
    renderError
};