'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const view = require('./view.js');
const request = require('./requests.js');
const parser = require('./utils.js')
const commands = require('./commands');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rest-api-tester" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(vscode.commands.registerCommand('extension.helloWorld', function () {
		vscode.window.showInformationMessage('Hello GodDamn World!');
		commands.performRequest('http://httpbin.org/post', {method:'POST', headers:{'Access-Control-Allow-Origin': '*',}, body:'12412515'});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.sendGET', function () {
		vscode.window.showInformationMessage('GET sent!');
		commands.sendGET();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.sendPOST', function () {
		vscode.window.showInformationMessage('POST sent!');
		commands.sendPOST();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.sendSelRequest', function () {
		vscode.window.showInformationMessage('Request sent!');
		commands.sendToSelected();
	}));
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}