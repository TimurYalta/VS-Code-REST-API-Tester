'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const commands = require('./commands');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	context.subscriptions.push(vscode.commands.registerCommand('extension.sendGET', function () {
		commands.sendGET();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.sendPOST', function () {
		commands.sendPOST();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.sendSelRequest', function () {
		commands.sendToSelected();
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.openRequestFile', function () {
		commands.openRequestFile();
		
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.startRequestFile', function () {
		commands.startRequestFile();
	}));
	context.subscriptions.push(vscode.commands.registerCommand('extension.createRequestFile', function () {
		commands.createRequestFile();
	}));
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}



	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	// context.subscriptions.push(vscode.commands.registerCommand('extension.helloWorld', function () {
	// 	vscode.window.showInformationMessage('Hello GodDamn World!');
	// 	commands.performRequest('http://httpbin.org/post', {method:'POST', headers:{'Access-Control-Allow-Origin': '*',}, body:'12412515'});
	// }));
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "rest-api-tester" is now active!');
