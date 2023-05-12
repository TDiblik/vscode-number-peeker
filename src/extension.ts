import * as vscode from "vscode";
import NumberHoverProvider from "./NumberHoverProvider";

export function activate(context: vscode.ExtensionContext) {
  const number_hover_provider = new NumberHoverProvider();
  const disposable_hover_provider = vscode.languages.registerHoverProvider(
    "*",
    number_hover_provider
  );
  context.subscriptions.push(disposable_hover_provider);

  const disposable_reload_config_command = vscode.commands.registerCommand(
    "number-peeker.reload-config",
    () => {
      number_hover_provider.reload_config();
    }
  );

  context.subscriptions.push(disposable_hover_provider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
