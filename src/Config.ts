import * as vscode from "vscode";

export interface Config {
  showI8WhenPossible: boolean;
  showI16WhenPossible: boolean;
  showI32WhenPossible: boolean;
}

export function get_config(): Config {
  let workspace_config = vscode.workspace.getConfiguration();
  let current_config: Config = {
    showI8WhenPossible: get_bool(
      workspace_config,
      "number-peekeer.binary.showI8WhenPossible",
      false
    ),
    showI16WhenPossible: get_bool(
      workspace_config,
      "number-peekeer.binary.showI16WhenPossible",
      false
    ),
    showI32WhenPossible: get_bool(
      workspace_config,
      "number-peekeer.binary.showI32WhenPossible",
      true
    ),
  };
  return current_config;
}

function get_bool(
  workspace_config: vscode.WorkspaceConfiguration,
  name: string,
  default_value: boolean
) {
  return workspace_config.get<boolean>(name) ?? default_value;
}
