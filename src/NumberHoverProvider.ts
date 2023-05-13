import * as vscode from "vscode";
import { NumberMatcher } from "./NumberMatchers";
import { Config, get_config } from "./Config";

export default class NumberHoverProvider implements vscode.HoverProvider {
  public config: Config = get_config();
  public reload_config() {
    this.config = get_config();
  }

  // For easier development (smaller headache): https://regex101.com/
  // I DARE ANYBODY TO OPEN ISSUE ABOUT MATCHING xd
  public whole_number_matcher = new NumberMatcher(
    /(?<=[ ]|\[|^|\"|\'|\`)(\-)?\b(?!\_)(\d|(\_(?!\_)))+(l|L|u|U|n|u8|u16|u32|u64|u128|usize|i8|i16|i32|i64|i128|isize)*?\b(?<!\_)/gim
  );
  public decimal_number_matcher = new NumberMatcher(
    /(?<=[ ]|\[|^|\"|\'|\`)(\-)?(\b(?!\_)(\d|(\_(?!\_)))*\.(?!\_)(\d|(\_(?!\_)))*(f|F)?\b|\.\d+(?!\.)(?!\_)|\d+\.(?!\.)(?!\_))(?<!\_)/gim
  );
  public binary_number_matcher = new NumberMatcher(
    /(\-)?\b0(b|B)(?!\_)(0|1|(\_(?!\_)))+(?<!\_)(l|L|u|U|n|u8|u16|u32|u64|u128|usize|i8|i16|i32|i64|i128|isize)*?\b(?<!\_)(?=\;|$|[ ]|\]|\)|\}|\"|\'|\`)/gim
  );
  public hex_number_matcher = new NumberMatcher(
    /(\-)?\b0(x|X)(?!\_)([0-9]|[A-F]|(\_(?!\_)))+(?<!\_)(l|L|u|U|n|u8|u16|u32|u64|u128|usize|i8|i16|i32|i64|i128|isize)*?\b(?<!\_)(?=\;|$|[ ]|\]|\)|\}|\"|\'|\`)/gim
  );
  public exponentional_number_matcher = new NumberMatcher(
    /(?<=[ ]|\[|^|\"|\'|\`)(\-)?\b(?!\_)(\d|(\_(?!\_)))+\.?(?!\_)(\d|(\_(?!\_)))*(e(\-|\+)?[0-9]{1,2}|e[0-9]{1,2})\b(?<!\_)/gim
  );

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    if (!this.config.enabled) {
      return;
    }

    // Ordered by importance
    let all_matchers: NumberMatcher[] = [];
    if (this.config.match_against_exponential_numbers) {
      all_matchers.push(this.exponentional_number_matcher);
    }
    if (this.config.match_against_decimal_numbers) {
      all_matchers.push(this.decimal_number_matcher);
    }
    if (this.config.match_against_hex_numbers) {
      all_matchers.push(this.hex_number_matcher);
    }
    if (this.config.match_against_binary_numbers) {
      all_matchers.push(this.binary_number_matcher);
    }
    if (this.config.match_against_whole_numbers) {
      all_matchers.push(this.whole_number_matcher);
    }

    let hover_text: string | null = null;
    for (const matcher of all_matchers) {
      if (matcher.match(document, position)) {
        hover_text = matcher.build_dialog_text(this.config);
        break;
      }
    }

    if (hover_text === null) {
      return;
    }

    return new vscode.Hover(hover_text);
  }
}
