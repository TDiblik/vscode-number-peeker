import * as vscode from "vscode";

export interface Config {
  enabled: boolean;

  match_against_whole_numbers: boolean;
  match_against_binary_numbers: boolean;
  match_against_hex_numbers: boolean;
  match_against_decimal_numbers: boolean;
  match_against_exponential_numbers: boolean;

  decimal_show: boolean;

  binary_show: boolean;
  binary_showUnsignedWhenPossible: boolean;
  binary_showI8WhenPossible: boolean;
  binary_showI16WhenPossible: boolean;
  binary_showI32WhenPossible: boolean;
  binary_showI64WhenPossible: boolean;
  binary_showI128WhenPossible: boolean;
  binary_showSmallestPossibleRepresentation: boolean;
  binary_showWarningWhenNumberOutsideOfRange: boolean;
  binary_splitEveryN: number;
  binary_padding: boolean;

  hex_show: boolean;
  hex_showUnsignedWhenPossible: boolean;
  hex_showI8WhenPossible: boolean;
  hex_showI16WhenPossible: boolean;
  hex_showI32WhenPossible: boolean;
  hex_showI64WhenPossible: boolean;
  hex_showI128WhenPossible: boolean;
  hex_showSmallestPossibleRepresentation: boolean;
  hex_showWarningWhenNumberOutsideOfRange: boolean;
  hex_showUpercased: boolean;
  hex_trimTrailingFs: boolean;
  hex_prependZeroWhenPossible: boolean;
  hex_show0xBeforeHex: boolean;

  exponential_show: boolean;
  exponential_maximumNumberOfFractionDigits: number;
  exponential_showNotationLowercased: boolean;
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
    match_against_decimal_numbers: get_bool(
      workspace_config,
      "number-peeker.match-against.decimal-numbers",
      true
    ),
    match_against_exponential_numbers: get_bool(
      workspace_config,
      "number-peeker.match-against.exponential-numbers",
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
      "number-peeker.binary.showI8WhenPossible",
      false
    ),
    binary_showI16WhenPossible: get_bool(
      workspace_config,
      "number-peeker.binary.showI16WhenPossible",
      false
    ),
    binary_showI32WhenPossible: get_bool(
      workspace_config,
      "number-peeker.binary.showI32WhenPossible",
      false
    ),
    binary_showI64WhenPossible: get_bool(
      workspace_config,
      "number-peeker.binary.showI64WhenPossible",
      false
    ),
    binary_showI128WhenPossible: get_bool(
      workspace_config,
      "number-peeker.binary.showI128WhenPossible",
      false
    ),
    binary_showSmallestPossibleRepresentation: get_bool(
      workspace_config,
      "number-peeker.binary.showSmallestPossibleRepresentation",
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
      "number-peeker.binary.padding",
      true
    ),

    hex_show: get_bool(workspace_config, "number-peeker.hex.show", true),
    hex_showUnsignedWhenPossible: get_bool(
      workspace_config,
      "number-peeker.hex.showUnsignedWhenPossible",
      true
    ),
    hex_showI8WhenPossible: get_bool(
      workspace_config,
      "number-peeker.hex.showI8WhenPossible",
      false
    ),
    hex_showI16WhenPossible: get_bool(
      workspace_config,
      "number-peeker.hex.showI16WhenPossible",
      false
    ),
    hex_showI32WhenPossible: get_bool(
      workspace_config,
      "number-peeker.hex.showI32WhenPossible",
      false
    ),
    hex_showI64WhenPossible: get_bool(
      workspace_config,
      "number-peeker.hex.showI64WhenPossible",
      false
    ),
    hex_showI128WhenPossible: get_bool(
      workspace_config,
      "number-peeker.hex.showI128WhenPossible",
      false
    ),
    hex_showSmallestPossibleRepresentation: get_bool(
      workspace_config,
      "number-peeker.hex.showSmallestPossibleRepresentation",
      true
    ),
    hex_showWarningWhenNumberOutsideOfRange: get_bool(
      workspace_config,
      "number-peeker.hex.showWarningWhenNumberOutsideOfRange",
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
      false
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
    exponential_maximumNumberOfFractionDigits: get_positive_int(
      workspace_config,
      "number-peeker.exponential.maximumNumberOfFractionDigits",
      10
    ),
    exponential_showNotationLowercased: get_bool(
      workspace_config,
      "number-peeker.exponential.showNotationLowercased",
      false
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
