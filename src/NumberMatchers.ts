import * as vscode from "vscode";

// Used classes to keep things separated and intialize regex only once (in the construtor).
export abstract class NumberMatcherBase {
  protected regex: RegExp;
  protected value: number | null = null;

  // TODO: Take config as parameter
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

    const possible_value = Number(document.getText(matched_value));
    if (Number.isNaN(possible_value) || !Number.isFinite(possible_value)) {
      return false;
    }

    this.value = possible_value;
    console.log(this.value);
    return true;
  }

  protected build_decimal() {
    return `**Decimal:** ${this.value}`;
  }

  protected build_binary() {
    // TODO: Ability to set how many binary numbers you want to show before space
    const split_every_n = 8;

    // TODO: Currently only works for unsigned. Add signed int support.
    const binary_representation = this.value!.toString(2);
    let splitted_representation = split_into_reversed_arr(
      binary_representation,
      split_every_n
    );

    // TODO: Ability to set whether you want padding on binary numbers
    splitted_representation.push(
      splitted_representation.pop()!.padStart(split_every_n, "0")
    );

    // TODO: Ability to set whether you want binary numbers to be separated by space
    const formatted_representation =
      piece_back_together_splitted_representation(splitted_representation, " ");

    return `**Binary:** ${formatted_representation}`;
  }

  protected build_hex() {
    // TODO: Ability to set how many hex numbers/chars you want to show before space
    const split_every_n = 2;

    // TODO: Currently only works for unsigned. Add signed int support.
    const hex_representation = this.value!.toString(16);
    let splitted_representation = split_into_reversed_arr(
      hex_representation,
      split_every_n
    );

    splitted_representation = splitted_representation.map((s) => {
      // TODO: Ability to set whether you want to show hex characters upercased
      s = s.toUpperCase();

      // TODO: Ability to set whether you want to prepand zero on hex numbers
      if (s.length < 2) {
        s = "0" + s;
      }

      return s;
    });

    // TODO: Ability to set whether you want to show 0x
    const formatted_representation =
      piece_back_together_splitted_representation(
        splitted_representation,
        " 0x"
      );

    return `**Hex:** ${formatted_representation}`;
  }

  public build_dialog_text() {
    return `
${this.build_decimal()}\n
${this.build_binary()}\n
${this.build_hex()}\n
    `;
  }
}

function split_into_reversed_arr(
  value: string,
  number_of_places: number
): string[] {
  let splitted_representation = [];
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

export class WholeNumberMatcher extends NumberMatcherBase {}
export class BinaryNumberMatcher extends NumberMatcherBase {}
