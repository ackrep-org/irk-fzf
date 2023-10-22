# erk-fzf

This is an experimental vs code extension to enable autocompletion support for [pyerk](https://github.com/ackrep-org/pyerk-core).
It is heavily based on:

- <https://github.com/tatosjb/vscode-fuzzy-search>
- <https://code.visualstudio.com/api/get-started/your-first-extension>.

## Test (development of this extension)

Inside the editor, open `src/extension.ts` and press `F5`. This will compile and run the extension in a new Extension Development Host window.

Run the `erkfzf` command from the Command Palette (`Ctrl+Shift+P`) in the new window:

See also [vsc-extension-quickstart.md](vsc-extension-quickstart.md).

## Usage

- Ensure `pyerk --version` >= `0.9.0`-
- naviate to the directory of your erk package (where `erkpackage.toml` is located)
- create a autocompletion file (`.ac_candidates.txt`) with `pyerk -ac`
- bind action `erkfzf` to a keyboard binding of your choice


## Build package

- `npm install -g @vscode/vsce`
- from the root dir of the extension: `vsce package`
    - this creates a file like `extensionname.vsix`


## Installation

For users, to install a `.vsix` file in VS Code:

- Go to the Extensions view.
- Click **Views and More Actions...**
- Select **Install from VSIX...**

or in your terminal, run the following command:

- `code --install-extension my-extension-0.0.1.vsix`

