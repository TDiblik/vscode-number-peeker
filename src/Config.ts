import * as vscode from "vscode";

export interface Config {
  binary_showUnsignedWhenPossible: boolean;
  binary_showI8WhenPossible: boolean;
  binary_showI16WhenPossible: boolean;
  binary_showI32WhenPossible: boolean;
  binary_showWarningWhenNumberOutsideOfRange: boolean;
  binary_splitEveryN: number;
  binary_padding: boolean;

  hex_showUpercased: boolean;
  hex_trimTrailingFs: boolean;
  hex_prependZeroWhenPossible: boolean;
  hex_show0xBeforeHex: boolean;
}

export function get_config(): Config {
  let workspace_config = vscode.workspace.getConfiguration();
  let current_config: Config = {
    binary_showUnsignedWhenPossible: get_bool(
      workspace_config,
      "number-peeker.binary.showUnsignedWhenPossible",
      true
    ),
    binary_showI8WhenPossible: get_bool(
      workspace_config,
      "number-peekeer.binary.showI8WhenPossible",
      false
    ),
    binary_showI16WhenPossible: get_bool(
      workspace_config,
      "number-peekeer.binary.showI16WhenPossible",
      false
    ),
    binary_showI32WhenPossible: get_bool(
      workspace_config,
      "number-peekeer.binary.showI32WhenPossible",
      true
    ),
    binary_showWarningWhenNumberOutsideOfRange: get_bool(
      workspace_config,
      "number-peeker.binary.showWarningWhenNumberOutsideOfRange",
      true
    ),
    binary_splitEveryN: get_positive_int(
      workspace_config,
      "number-peeker.binary.splitNumbersEveryN",
      8
    ),
    binary_padding: get_bool(
      workspace_config,
      "number-peekeer.binary.padding",
      true
    ),

    hex_showUpercased: get_bool(
      workspace_config,
      "number-peeker.hex.showUpercased",
      false
    ),
    hex_trimTrailingFs: get_bool(
      workspace_config,
      "number-peeker.hex.trimTrailingFs",
      true
    ),
    hex_prependZeroWhenPossible: get_bool(
      workspace_config,
      "number-peeker.hex.prependZeroWhenPossible",
      true
    ),
    hex_show0xBeforeHex: get_bool(
      workspace_config,
      "number-peeker.hex.show0xBeforeHex",
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

function get_positive_int(
  workspace_config: vscode.WorkspaceConfiguration,
  name: string,
  default_value: number
) {
  let value = workspace_config.get<number>(name) ?? default_value;
  return value >= 0 ? value : default_value;
}
