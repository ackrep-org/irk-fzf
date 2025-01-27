// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FuzzySearch from './fuzzy-search';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  //console.log('Congratulations, your extension "irk-fzf" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('irk-fzf.main', async () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    vscode.window.showInformationMessage(`line: {line}`);


    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("Editor does not exist!");
      return;
    }

    const position = editor.selection.active;
    const snippet = new vscode.SnippetString(`Hello, World:...`);
    editor.insertSnippet(snippet, position);

  });

  // *********************************************************************************
  // Next function
  // *********************************************************************************

  context.subscriptions.push(disposable);

  let disposable2 = vscode.commands.registerCommand('irk-fzf.search', () => {

    const fuzzySearch = new FuzzySearch(context);

  });


  context.subscriptions.push(disposable2);


}

// This method is called when your extension is deactivated
export function deactivate() {}
