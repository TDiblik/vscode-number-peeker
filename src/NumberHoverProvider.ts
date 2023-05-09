import * as vscode from "vscode";

export default class NumberHoverProvider implements vscode.HoverProvider {
  private regex_number = "\\d+";
  private regex_ignore_surroundings = "\\\"?\\'?\\,?\\;?\\.?\\(?\\)?";

  public regex_match_whole_number = `^(${this.regex_ignore_surroundings}${this.regex_number}${this.regex_ignore_surroundings})$`;
  public regex_match_decimal = `TODO`;
  public regex_match_binary = `TODO`;
  public regex_match_hex = `TODO`;
  public regex_match_fraction = `TODO`;
  public regex_match_exponent = `TODO`;

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const match = document.getWordRangeAtPosition(
      position,
      new RegExp(this.regex_match_whole_number)
    );
    const text = document.getText(match);
    console.log(text);

    return new vscode.Hover("sljea");
  }
}
