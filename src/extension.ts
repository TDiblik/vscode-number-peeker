import * as vscode from "vscode";
import NumberHoverProvider from "./NumberHoverProvider";

export function activate(context: vscode.ExtensionContext) {
  const number_hover_provider = new NumberHoverProvider();
  const disposable = vscode.languages.registerHoverProvider(
    "*",
    number_hover_provider
  );
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
