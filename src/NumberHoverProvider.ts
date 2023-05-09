import * as vscode from "vscode";
import {
  BinaryNumberMatcher,
  NumberMatcherBase,
  WholeNumberMatcher,
} from "./NumberMatchers";

export default class NumberHoverProvider implements vscode.HoverProvider {
  public regex_match_decimal = `TODO`;
  public regex_match_binary = `TODO`;
  public regex_match_hex = `TODO`;
  public regex_match_fraction = `TODO`;
  public regex_match_exponent = `TODO`;

  public whole_number_matcher = new WholeNumberMatcher(/(\-)?\b\d+\b/gim);
  public binary_number_matcher = new BinaryNumberMatcher(/TODO/gim);

  // Ordered by importance
  public all_matchers: NumberMatcherBase[] = [
    this.binary_number_matcher,
    this.whole_number_matcher,
  ];

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    let hover_text = null;
    for (const matcher of this.all_matchers) {
      if (matcher.match(document, position)) {
        hover_text = matcher.build_dialog_text();
        break;
      }
    }

    if (hover_text === null) {
      return;
    }

    return new vscode.Hover(hover_text);
  }
}
