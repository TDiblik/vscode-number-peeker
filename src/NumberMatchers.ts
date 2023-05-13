import * as vscode from "vscode";
import { Config } from "./Config";

// Used classes to keep things separated and intialize regex only once (in the construtor).
export class NumberMatcher {
  public readonly regex: RegExp;
  protected value: number | null = null;

  constructor(_regex: RegExp) {
    this.regex = _regex;
  }

  public match(
    document: vscode.TextDocument,
    position: vscode.Position
  ): boolean {
    this.value = null;

    const matched_value = document.getWordRangeAtPosition(position, this.regex);
    if (matched_value === undefined) {
      return false;
    }

    let matched_text = document.getText(matched_value).trim();
    while (
      matched_text.endsWith("L") ||
      matched_text.endsWith("l") ||
      matched_text.endsWith("u") ||
      matched_text.endsWith("U")
    ) {
      matched_text = matched_text.slice(0, -1);
    }

    const possible_value = Number(matched_text);
    if (Number.isNaN(possible_value) || !Number.isFinite(possible_value)) {
      return false;
    }

    this.value = possible_value;
    return true;
  }

  protected build_decimal() {
    return this.value!.toString();
  }

  protected build_binary(config: Config) {
    const v = this.value!;

    if (v >= 0) {
      if (!config.binary_showUnsignedWhenPossible) {
        return "";
      }
      return this.build_preview_item(
        "Binary (unsigned)",
        this.build_binary_logic(v.toString(2), config).trim()
      );
    }

    if (v > 2147483647 || v < -2147483648) {
      if (!config.binary_showWarningWhenNumberOutsideOfRange) {
        return "";
      }
      return this.build_preview_item(
        "Binary",
        "Currentlly unable to work with >32 bit numbers."
      );
    }

    // MSB will always be flipped, since I'm checking for max number, no need to flip/check
    const v_i32 = v >>> 0;

    // TODO: Do the same thing for i64 and i128
    let text = "";
    if (config.binary_showI8WhenPossible && v >= -128) {
      text += this.build_preview_item(
        "Binary (signed 8)",
        this.build_binary_logic(v_i32.toString(2).substring(24), config).trim()
      );
    }
    if (config.binary_showI16WhenPossible && v >= -32768) {
      text += this.build_preview_item(
        "Binary (signed 16)",
        this.build_binary_logic(v_i32.toString(2).substring(16), config).trim()
      );
    }
    if (config.binary_showI32WhenPossible && v >= -2147483648) {
      text += this.build_preview_item(
        "Binary (signed 32)",
        this.build_binary_logic(v_i32.toString(2), config).trim()
      );
    }

    return text;
  }

  private build_binary_logic(binary_representation: string, config: Config) {
    const split_every_n = config.binary_splitEveryN;

    let splitted_representation = split_into_reversed_arr(
      binary_representation,
      split_every_n
    );

    if (config.binary_padding) {
      splitted_representation.push(
        splitted_representation.pop()!.padStart(split_every_n, "0")
      );
    }

    const formatted_representation =
      piece_back_together_splitted_representation(splitted_representation, " ");

    return formatted_representation;
  }

  protected build_hex(config: Config) {
    let hex_representation =
      this.value! >= 0
        ? this.value!.toString(16)
        : (this.value! >>> 0).toString(16);

    if (config.hex_showUpercased) {
      hex_representation = hex_representation.toUpperCase();
    }

    if (config.hex_trimTrailingFs) {
      while (
        hex_representation.startsWith("F", 1) ||
        hex_representation.startsWith("f", 1)
      ) {
        hex_representation = hex_representation.substring(1);
      }
    }

    if (config.hex_prependZeroWhenPossible && hex_representation.length < 2) {
      hex_representation = "0" + hex_representation;
    }

    if (config.hex_show0xBeforeHex) {
      hex_representation = "0x" + hex_representation;
    }

    return hex_representation;
  }

  protected build_exponential(config: Config) {
    return this.value!.toExponential(config.exponential_numberOfFractionDigits);
  }

  protected build_preview_item(name: string, value: string) {
    return `\n\n**${name}:** ${value}`;
  }

  public build_dialog_text(config: Config) {
    let dialog_text = "";
    if (config.decimal_show) {
      dialog_text += this.build_preview_item(
        "Decimal",
        this.build_decimal().trim()
      );
    }
    if (config.binary_show) {
      dialog_text += this.build_binary(config);
    }
    if (config.hex_show) {
      dialog_text += this.build_preview_item(
        "Hex",
        this.build_hex(config).trim()
      );
    }
    if (config.exponential_show) {
      dialog_text += this.build_preview_item(
        "Exponential",
        this.build_exponential(config).trim()
      );
    }
    return dialog_text;
  }
}

function split_into_reversed_arr(
  value: string,
  number_of_places: number
): string[] {
  let splitted_representation: string[] = [];
  for (let i = value.length; i > 0; i -= number_of_places) {
    let start_split_index = i - number_of_places;
    if (start_split_index < 0) {
      start_split_index = 0;
    }

    splitted_representation.push(value.substring(start_split_index, i));
  }
  return splitted_representation;
}

function piece_back_together_splitted_representation(
  splitted_representation: string[],
  prepend_to_each: string
): string {
  let formatted_representation = "";
  while (true) {
    const value = splitted_representation.pop();
    if (value === undefined) {
      break;
    }
    formatted_representation += `${prepend_to_each}${value}`;
  }
  return formatted_representation;
}

export class MockMatcher extends NumberMatcher {
  protected readonly expected_decimal: string;
  protected readonly expected_binary_usingned: string;
  // protected readonly expected_binary_i8: string;
  // protected readonly expected_binary_i16: string;
  // protected readonly expected_binary_i32: string;
  protected readonly expected_hex: string;

  constructor(
    _expected_decimal: string,
    _expected_binary: string,
    _expected_hex: string
    // _expected_exponential_notation: string
  ) {
    super(/DOES_NOT_MATTER/);
    this.expected_decimal = _expected_decimal;
    this.expected_binary_usingned = _expected_binary;
    this.expected_hex = _expected_hex;
  }

  public force_set_value(value: number) {
    this.value = value;
  }

  public build_expected_output() {
    return `**Decimal:** ${this.expected_decimal.trim()}\n**Binary:** ${this.expected_binary_usingned.trim()}**Hex:** ${this.expected_hex.trim()}\n`;
  }
}
