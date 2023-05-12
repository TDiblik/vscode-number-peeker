import * as vscode from "vscode";

export interface Config {
  enabled: boolean;

  match_against_whole_numbers: boolean;
  match_against_binary_numbers: boolean;
  match_against_hex_numbers: boolean;

  decimal_show: boolean;

  binary_show: boolean;
  binary_showUnsignedWhenPossible: boolean;
  binary_showI8WhenPossible: boolean;
  binary_showI16WhenPossible: boolean;
  binary_showI32WhenPossible: boolean;
  binary_showWarningWhenNumberOutsideOfRange: boolean;
  binary_splitEveryN: number;
  binary_padding: boolean;

  hex_show: boolean;
  hex_showUpercased: boolean;
  hex_trimTrailingFs: boolean;
  hex_prependZeroWhenPossible: boolean;
  hex_show0xBeforeHex: boolean;

  exponential_show: boolean;
  exponential_numberOfFractionDigits: number;
}

export function get_config(): Config {
  let workspace_config = vscode.workspace.getConfiguration();
  let current_config: Config = {
    enabled: get_bool(workspace_config, "number-peeker.enabled", true),

    match_against_whole_numbers: get_bool(
      workspace_config,
      "number-peeker.match-against.whole-numbers",
      true
    ),
    match_against_binary_numbers: get_bool(
      workspace_config,
      "number-peeker.match-against.binary-numbers",
      true
    ),
    match_against_hex_numbers: get_bool(
      workspace_config,
      "number-peeker.match-against.hex-numbers",
      true
    ),

    decimal_show: get_bool(
      workspace_config,
      "number-peeker.decimal.show",
      true
    ),

    binary_show: get_bool(workspace_config, "number-peeker.binary.show", true),
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

    hex_show: get_bool(workspace_config, "number-peeker.hex.show", true),
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

    exponential_show: get_bool(
      workspace_config,
      "number-peeker.exponential.show",
      false
    ),
    exponential_numberOfFractionDigits: get_positive_int(
      workspace_config,
      "number-peeker.exponential.numberOfFractionDigits",
      5
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
