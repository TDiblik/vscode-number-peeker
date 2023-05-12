import * as vscode from "vscode";
import { NumberMatcher } from "./NumberMatchers";
import { Config, get_config } from "./Config";

export default class NumberHoverProvider implements vscode.HoverProvider {
  public config: Config = get_config();
  public reload_config() {
    this.config = get_config();
  }

  public whole_number_matcher = new NumberMatcher(/(\-)?\b\d+\b/gim);
  public binary_number_matcher = new NumberMatcher(/TODO/gim);

  // Ordered by importance
  public all_matchers: NumberMatcher[] = [
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
