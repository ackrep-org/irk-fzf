import * as vscode from 'vscode';
import Search from './search';
import { QuickPickItem } from './types';

export default class FuzzySearch {
  private search = new Search();
  private quickPick = vscode.window.createQuickPick<QuickPickItem>();
  private timeout: any;

  constructor(context: vscode.ExtensionContext) {
    this.onDidChangeValue = this.onDidChangeValue.bind(this);
    this.onAccept = this.onAccept.bind(this);

    this.search.onData(searchItems => {
      try {
        const quickPickItems = [...new Set([...searchItems])]
          .slice(0, 10)
          .map((filePath) =>
            createQuickPickItem(filePath, true)
          );

        this.quickPick.items = quickPickItems;
      } finally {
        this.quickPick.busy = false;
      }
    });

    this.quickPick.placeholder = "Fuzzy search";
    this.quickPick.matchOnDescription = true;
    (this.quickPick as any).sortByLabel = false;

    this.quickPick.onDidChangeValue(this.onDidChangeValue);
    this.quickPick.onDidAccept(this.onAccept);

    this.quickPick.show();

    this.find('');
  }

  private onDidChangeValue(value: string) {
    this.find(value);
  }

  private find(value: string) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.quickPick.busy = true;
      const searchTerm = value.toString();
      this.search.search(searchTerm);
    }, 200);
  }

  onAccept(e: any) {

    console.log(`accept`);

    const selectedItem = this.quickPick.selectedItems[0].result_line;
    if (selectedItem) {

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
      vscode.window.showErrorMessage("Editor does not exist!");
      return;
      }

      const position = editor.selection.active;
      const snippet = new vscode.SnippetString(selectedItem);
      editor.insertSnippet(snippet, position);
    }
    this.quickPick.hide();
  }
}


function createQuickPickItem(
  result_line: string,
  isRecent: boolean
): QuickPickItem {

  return {
    label: result_line,
    description: "test description",
    alwaysShow: true,
    result_line,
  };
}
