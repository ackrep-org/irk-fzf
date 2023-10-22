import * as vscode from 'vscode';

export interface QuickPickItem extends vscode.QuickPickItem {
  result_line: string;
  // shortcut?: string;
  // symbol?: string;
  // range?: vscode.Range;
}

