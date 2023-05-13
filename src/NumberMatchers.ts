import * as vscode from "vscode";
import bigDecimal = require("js-big-decimal");
import { Config } from "./Config";

// Used classes to keep things separated and intialize regex only once (in the construtor).
export class NumberMatcher {
  public readonly regex: RegExp;
  protected value: bigint | null = null;
  protected decimal_multiplier: bigint | null = null;
  protected decimal_multiplier_len: number | null = null;
  protected decimal_mulitplier_val: bigint | null = null;

  constructor(_regex: RegExp) {
    this.regex = _regex;
  }

  public match(
    document: vscode.TextDocument,
    position: vscode.Position
  ): boolean {
    this.value = null;
    this.decimal_multiplier = null;
    this.decimal_multiplier_len = null;
    this.decimal_mulitplier_val = null;

    const matched_value = document.getWordRangeAtPosition(position, this.regex);
    if (matched_value === undefined) {
      return false;
    }

    let matched_text = document.getText(matched_value).trim();
    while (
      matched_text.endsWith("L") ||
      matched_text.endsWith("l") ||
      matched_text.endsWith("u") ||
      matched_text.endsWith("U") ||
      matched_text.endsWith("n")
    ) {
      matched_text = matched_text.slice(0, -1);
    }
    if (matched_text.endsWith("u8")) {
      matched_text = matched_text.replace("u8", "");
    }
    if (matched_text.endsWith("u16")) {
      matched_text = matched_text.replace("u16", "");
    }
    if (matched_text.endsWith("u32")) {
      matched_text = matched_text.replace("u32", "");
    }
    if (matched_text.endsWith("u64")) {
      matched_text = matched_text.replace("u64", "");
    }
    if (matched_text.endsWith("u128")) {
      matched_text = matched_text.replace("u128", "");
    }
    if (matched_text.endsWith("usize")) {
      matched_text = matched_text.replace("usize", "");
    }
    if (matched_text.endsWith("i8")) {
      matched_text = matched_text.replace("i8", "");
    }
    if (matched_text.endsWith("i16")) {
      matched_text = matched_text.replace("i16", "");
    }
    if (matched_text.endsWith("i32")) {
      matched_text = matched_text.replace("i32", "");
    }
    if (matched_text.endsWith("i64")) {
      matched_text = matched_text.replace("i64", "");
    }
    if (matched_text.endsWith("i128")) {
      matched_text = matched_text.replace("i128", "");
    }
    if (matched_text.endsWith("isize")) {
      matched_text = matched_text.replace("isize", "");
    }

    if (
      matched_text.includes(".") &&
      (matched_text.endsWith("f") || matched_text.endsWith("F"))
    ) {
      matched_text = matched_text.slice(0, -1);
    }
    matched_text = matched_text.replace(/\_/gim, "");

    if (matched_text.includes("e") || matched_text.includes("E")) {
      this.value = BigInt(
        parseFloat(matched_text)
          .toString()
          .replace(".", "")
          .replace("e+", "0".repeat(10))
      );
      return true;
    }
    if (matched_text.includes(".")) {
      const splitted = matched_text.split(".");
      const l_part = !matched_text.startsWith("-")
        ? BigInt(splitted[0])
        : BigInt(splitted[0].substring(1)) * -1n;
      const r_part = !matched_text.startsWith("-")
        ? BigInt(splitted[1])
        : BigInt(splitted[1]) * -1n;
      const multiplier_len = splitted[1].length;
      const multiplier = BigInt(Math.pow(10, multiplier_len));

      this.value = l_part * multiplier;
      this.decimal_multiplier = multiplier;
      this.decimal_multiplier_len = multiplier_len;
      this.decimal_mulitplier_val = r_part;
      return true;
    }
    if (matched_text.startsWith("-")) {
      this.value = BigInt(matched_text.substring(1)) * -1n;
      return true;
    }

    this.value = BigInt(matched_text);
    return true;
  }

  protected build_decimal() {
    if (this.decimal_multiplier === null) {
      return this.value!.toString();
    }
    const divider = new bigDecimal(this.decimal_multiplier!);
    const val = new bigDecimal(this.value!)
      .divide(divider, this.decimal_multiplier_len!)
      .add(
        new bigDecimal(this.decimal_mulitplier_val!).divide(
          divider,
          this.decimal_multiplier_len!
        )
      );
    return val.getValue();
  }

  protected build_binary(
    config: Config,
    force_v: bigint | null = null,
    ignore_decimal: boolean = false
  ) {
    const v = force_v ?? this.value!;

    if (this.decimal_multiplier !== null && !ignore_decimal) {
      try {
        let text = this.build_binary(
          config,
          v / this.decimal_multiplier!,
          true
        );

        let r_part = new bigDecimal(this.decimal_mulitplier_val!)
          .divide(
            new bigDecimal(this.decimal_multiplier!),
            this.decimal_multiplier_len
          )
          .getValue();
        if (r_part.startsWith("-")) {
          r_part = r_part.substring(1);
        }
        text +=
          " . " +
          this.build_binary_logic(
            parseFloat(r_part).toString(2).replace(".", "").trim(),
            config
          );
        return text;
      } catch {
        if (!config.binary_showUnsignedWhenPossible) {
          return "";
        }
        return this.build_preview_item(
          "Binary",
          "Error while parsing floating."
        );
      }
    }

    if (v >= 0) {
      if (!config.binary_showUnsignedWhenPossible) {
        return "";
      }
      return this.build_preview_item(
        "Binary (unsigned)",
        this.build_binary_logic(v.toString(2), config).trim()
      );
    }

    if (v < -170_141_183_460_469_231_731_687_303_715_884_105_728n) {
      if (!config.binary_showWarningWhenNumberOutsideOfRange) {
        return "";
      }
      return this.build_preview_item(
        "Binary",
        "Currentlly unable to work with >128 bit signed numbers."
      );
    }

    // MSB will always be flipped, since I'm checking for max number, no need to flip/check
    const v_i32 = Number(v) >>> 0;

    let text = "";
    let already_shown_smallest = false;
    if (
      (config.binary_showI8WhenPossible ||
        (config.binary_showSmallestPossibleRepresentation &&
          !already_shown_smallest)) &&
      v >= -128
    ) {
      text += this.build_preview_item(
        "Binary (signed 8)",
        this.build_binary_logic(v_i32.toString(2).substring(24), config).trim()
      );
      already_shown_smallest = true;
    }
    if (
      (config.binary_showI16WhenPossible ||
        (config.binary_showSmallestPossibleRepresentation &&
          !already_shown_smallest)) &&
      v >= -32_768
    ) {
      text += this.build_preview_item(
        "Binary (signed 16)",
        this.build_binary_logic(v_i32.toString(2).substring(16), config).trim()
      );
      already_shown_smallest = true;
    }
    if (
      (config.binary_showI32WhenPossible ||
        (config.binary_showSmallestPossibleRepresentation &&
          !already_shown_smallest)) &&
      v >= -2_147_483_648
    ) {
      text += this.build_preview_item(
        "Binary (signed 32)",
        this.build_binary_logic(v_i32.toString(2), config).trim()
      );
      already_shown_smallest = true;
    }

    const v_BigInt = BigInt(v);
    if (
      (config.binary_showI64WhenPossible ||
        (config.binary_showSmallestPossibleRepresentation &&
          !already_shown_smallest)) &&
      v >= -9_223_372_036_854_775_808n
    ) {
      let v_64 = BigInt.asUintN(64, v_BigInt);
      text += this.build_preview_item(
        "Binary (signed 64)",
        this.build_binary_logic(v_64.toString(2), config).trim()
      );
      already_shown_smallest = true;
    }

    if (
      (config.binary_showI128WhenPossible ||
        (config.binary_showSmallestPossibleRepresentation &&
          !already_shown_smallest)) &&
      v >= -170_141_183_460_469_231_731_687_303_715_884_105_728n
    ) {
      let v_128 = BigInt.asUintN(128, v_BigInt);
      text += this.build_preview_item(
        "Binary (signed 128)",
        this.build_binary_logic(v_128.toString(2), config).trim()
      );
      already_shown_smallest = true;
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

  protected build_hex(
    config: Config,
    force_v: bigint | null = null,
    ignore_decimal: boolean = false
  ) {
    const v = force_v ?? this.value!;

    if (this.decimal_multiplier !== null && !ignore_decimal) {
      try {
        let text = this.build_hex(config, v / this.decimal_multiplier!, true);

        let r_part = new bigDecimal(this.decimal_mulitplier_val!)
          .divide(
            new bigDecimal(this.decimal_multiplier!),
            this.decimal_multiplier_len
          )
          .getValue();
        if (r_part.startsWith("-")) {
          r_part = r_part.substring(1);
        }
        console.log(parseFloat(r_part).toString(16).trim());
        text +=
          "." +
          this.build_hex_logic(
            parseFloat(r_part).toString(16).replace("0.", "").trim(),
            config
          )
            .replace("0x0", "")
            .replace("0X0", "")
            .replace("0x", "")
            .replace("0X", "");
        return text;
      } catch {
        if (!config.hex_showUnsignedWhenPossible) {
          return "";
        }
        return this.build_preview_item("Hex", "Error while parsing floating.");
      }
    }

    if (v >= 0) {
      if (!config.hex_showUnsignedWhenPossible) {
        return "";
      }
      return this.build_preview_item(
        "Hex (unsigned)",
        this.build_hex_logic(v.toString(16), config).trim()
      );
    }

    if (v < -170_141_183_460_469_231_731_687_303_715_884_105_728n) {
      if (!config.hex_showWarningWhenNumberOutsideOfRange) {
        return "";
      }
      return this.build_preview_item(
        "Hex",
        "Currentlly unable to work with >128 bit signed numbers."
      );
    }

    let text = "";
    let already_shown_smallest = false;
    if (
      (config.hex_showI8WhenPossible ||
        (config.hex_showSmallestPossibleRepresentation &&
          !already_shown_smallest)) &&
      v >= -128
    ) {
      text += this.build_preview_item(
        "Hex (signed 8)",
        this.build_hex_logic(BigInt.asUintN(8, v).toString(16), config).trim()
      );
      already_shown_smallest = true;
    }
    if (
      (config.hex_showI16WhenPossible ||
        (config.hex_showSmallestPossibleRepresentation &&
          !already_shown_smallest)) &&
      v >= -32_768
    ) {
      text += this.build_preview_item(
        "Hex (signed 16)",
        this.build_hex_logic(BigInt.asUintN(16, v).toString(16), config).trim()
      );
      already_shown_smallest = true;
    }
    if (
      (config.hex_showI32WhenPossible ||
        (config.hex_showSmallestPossibleRepresentation &&
          !already_shown_smallest)) &&
      v >= -2_147_483_648
    ) {
      text += this.build_preview_item(
        "Hex (signed 32)",
        this.build_hex_logic(BigInt.asUintN(32, v).toString(16), config).trim()
      );
      already_shown_smallest = true;
    }
    if (
      (config.hex_showI64WhenPossible ||
        (config.hex_showSmallestPossibleRepresentation &&
          !already_shown_smallest)) &&
      v >= -9_223_372_036_854_775_808n
    ) {
      text += this.build_preview_item(
        "Hex (signed 64)",
        this.build_hex_logic(BigInt.asUintN(64, v).toString(16), config).trim()
      );
      already_shown_smallest = true;
    }
    if (
      (config.hex_showI128WhenPossible ||
        (config.hex_showSmallestPossibleRepresentation &&
          !already_shown_smallest)) &&
      v >= -170_141_183_460_469_231_731_687_303_715_884_105_728n
    ) {
      text += this.build_preview_item(
        "Hex (signed 128)",
        this.build_hex_logic(BigInt.asUintN(128, v).toString(16), config).trim()
      );
      already_shown_smallest = true;
    }

    return text;
  }

  private build_hex_logic(hex_representation: string, config: Config) {
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
    let v: bigint | number = this.value!;

    if (this.decimal_multiplier !== null) {
      const divider = new bigDecimal(this.decimal_multiplier!);
      const val = new bigDecimal(this.value!)
        .divide(divider, this.decimal_multiplier_len!)
        .add(
          new bigDecimal(this.decimal_mulitplier_val!).divide(
            divider,
            this.decimal_multiplier_len!
          )
        );
      try {
        v = parseFloat(val.getValue());
      } catch {}
    }

    let value = v.toLocaleString("en-US", {
      notation: "scientific",
      maximumFractionDigits:
        config.exponential_maximumNumberOfFractionDigits as any,
    });
    if (config.exponential_showNotationLowercased) {
      value = value.toLowerCase();
    }

    return value;
  }

  protected build_preview_item(name: string, value: string) {
    return `\n\n**${name}:** ${value}`;
  }

  public build_dialog_text(config: Config) {
    let dialog_text = "";
    if (config.decimal_show) {
      let decimal_value = this.build_decimal().trim();
      if (config.exponential_showNotationLowercased) {
        decimal_value = decimal_value.toLowerCase();
      }
      dialog_text += this.build_preview_item("Decimal", decimal_value);
    }
    if (config.hex_show) {
      dialog_text += this.build_hex(config);
    }
    if (config.binary_show) {
      dialog_text += this.build_binary(config);
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
