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
          .slice(0, 30)
          .map((filePath) =>
            createQuickPickItem(filePath, true)
          );

        this.quickPick.items = quickPickItems;
      } finally {
        this.quickPick.busy = false;
      }
    });

    let lineObj = getCurrentLineText();
    this.quickPick.value = getRelevantLinePart(lineObj.leftOfCursor);
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

    const selectedItem = this.quickPick.selectedItems[0].resultLine;
    if (selectedItem) {

      console.log("123");
      replaceEndInCurrentLine(selectedItem);
    }


    this.quickPick.hide();
  }
} // end off class


function createQuickPickItem(
  resultLine: string,
  isRecent: boolean
): QuickPickItem {

  return {
    label: resultLine,
    //description: "test description",
    alwaysShow: true,
    resultLine: resultLine,
  };
}


// from perplexityAI:
function getCurrentLineText(): {fullText: string, leftOfCursor: string, rightOfCursor: string, pos: number} {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return {"fullText": "", "leftOfCursor": "", "rightOfCursor": "", "pos": 0};
  }

  const selection = editor.selection;
  const line = selection.active.line;
  const lineText = editor.document.lineAt(line).text;
  const txtLOC = lineText.substring(0, selection.active.character);

  // this means: from the given index until the end
  const txtROC = lineText.substring(selection.active.character);

  // console.log(selection.active.character);
  // vscode.window.showInformationMessage(`line ${line}, char ${selection.active.character}`);

  return {"fullText": lineText, "leftOfCursor": txtLOC, rightOfCursor: txtROC, "pos": selection.active.character};
}


/**
 * assume to get a complete line,
 * return only the part which should be autocompleted
*/
function getRelevantLinePart(line: string): string {
  // regex-split at one of those chars: " ", ",", "=", ";"
  let parts = line.trim().split(/[\s,\.\(\)\{\}=;]+/);
  return parts[parts.length -1];

}


// TODO: test regex
// TODO: prevent bad code in fzf command (escape " etc)


/**
 * take the result from the pick dialogue and insert it in the current line
 * at the correct place. The line is segmented in partLeftOfCursor and partRightOfCursor
 */
function replaceEndInCurrentLine(newEnd: string): void{
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("Editor does not exist!");
    return;
  }

  const line = editor.document.lineAt(editor.selection.active.line);

  const lineObj = getCurrentLineText();
  const oldEnd = getRelevantLinePart(lineObj.leftOfCursor);

  let newPartLeftOfCursor: string;

  if (oldEnd === "") {
    newPartLeftOfCursor = `${lineObj.leftOfCursor}${newEnd}`;

  } else {

    // we want to replace only the last occurrence of oldEnd
    let s = lineObj.leftOfCursor;
    let index = s.lastIndexOf(oldEnd);
    if (index !== -1) {
      newPartLeftOfCursor = s.substring(0, index) + newEnd + s.substring(index + oldEnd.length);

    } else {
      // old end could not be found. change nothing
      newPartLeftOfCursor = lineObj.leftOfCursor;
    }
  }

  const newLineText = newPartLeftOfCursor + lineObj.rightOfCursor;

  editor.edit((editBuilder) => {
    editBuilder.replace(line.range, newLineText);
  });


  // now move the cursor at the end of the inserted text
  const currentPosition = editor.selection.active;

  // `undefined` → same line; second arg: specific column
  const newPosition = currentPosition.with(undefined, newPartLeftOfCursor.length);
  editor.selection = new vscode.Selection(newPosition, newPosition);


}
