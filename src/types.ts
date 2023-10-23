import * as vscode from 'vscode';

export interface QuickPickItem extends vscode.QuickPickItem {
  resultLine: string;
  // shortcut?: string;
  // symbol?: string;
  // range?: vscode.Range;
}
