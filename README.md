# VSCode Number Peeker

Hover over number in VSCode and see alternative representations

![Showcase Video](./showcase.gif)

## Features

- Match when hovering over
  - whole numbers
  - decimal numbers
  - binary numbers
  - hex numbers
  - decimal exponential notation representation numbers
- Show alternative representations of the number in
  - decimal format
  - hex format
  - binary format
  - decimal exponential notation representation format (has to be manually enabled in settings)

## Recommended (biased) steps to do after installing

- Enable: `number-peeker.exponential.show` and `number-peeker.match-against.exponential-numbers`
  - While you're at it, change `number-peeker.exponential.maximumNumberOfFractionDigits` to your liking.
  - Those are disabled by default since not that many people like it, however, I find it useful :D

## Extension settings

- `number-peeker.enabled`: Whether this extension should be enabled (work). This setting is here, whenever you want to temporally disable this extension without removing it.
- `number-peeker.match-against.whole-numbers`: Whether to match whenever user hovers over whole number.
- `number-peeker.match-against.binary-numbers`: Whether to match whenever user hovers over binary number.
- `number-peeker.match-against.hex-numbers`: Whether to match whenever user hovers over hexadecimal number.
- `number-peeker.match-against.decimal-numbers`: Whether to match whenever user hovers over decimal number.
- `number-peeker.match-against.exponential-numbers`: Whether to match whenever user hovers over exponential number (scientific notation).
- `number-peeker.decimal.show`: Whether to show decimal representation on hover
- `number-peeker.binary.show`: Whether to show binary representation on hover
- `number-peeker.binary.showUnsignedWhenPossible`: Whether to show usigned representation whenever user hovers over positive number
- `number-peeker.binary.showI8WhenPossible`: Whether to show signed 8 bit representation whenever user hovers over negative number
- `number-peeker.binary.showI16WhenPossible`: Whether to show signed 16 bit representation whenever user hovers over negative number
- `number-peeker.binary.showI32WhenPossible`: Whether to show signed 32 bit representation whenever user hovers over negative number
- `number-peeker.binary.showI64WhenPossible`: Whether to show signed 64 bit representation whenever user hovers over negative number
- `number-peeker.binary.showI128WhenPossible`: Whether to show signed 128 bit representation whenever user hovers over negative number
- `number-peeker.binary.showSmallestPossibleRepresentation`: Whether to show signed smallest possible representation whenever user hovers over negative number
- `number-peeker.binary.showWarningWhenNumberOutsideOfRange`: Whether to show warning that number is outside of the supported range of numbers (currently signed 128 bit int / i128)
- `number-peeker.binary.splitNumbersEveryN`: How many numbers to should be in one group, before getting split by space. If you don't want to split every N characters, just set this value really high, like 99999.. If you don't want to split every N characters, just set this value really high, like 99999 (and set number-peeker.binary.padding to false!). Defaults to 5
- `number-peeker.binary.padding`: Whether to add padding (zeros -- '0') to splitted binary numbers
- `number-peeker.hex.show`: Whether to show hexadecimal representation on hover
- `number-peeker.hex.showUnsignedWhenPossible`: Whether to show usigned representation whenever user hovers over positive number
- `number-peeker.hex.showI8WhenPossible`: Whether to show signed 8 bit representation whenever user hovers over negative number
- `number-peeker.hex.showI16WhenPossible`: Whether to show signed 16 bit representation whenever user hovers over negative number
- `number-peeker.hex.showI32WhenPossible`: Whether to show signed 32 bit representation whenever user hovers over negative number
- `number-peeker.hex.showI64WhenPossible`: Whether to show signed 64 bit representation whenever user hovers over negative number
- `number-peeker.hex.showI128WhenPossible`: Whether to show signed 128 bit representation whenever user hovers over negative number
- `number-peeker.hex.showSmallestPossibleRepresentation`: Whether to show signed smallest possible representation whenever user hovers over negative number
- `number-peeker.hex.showWarningWhenNumberOutsideOfRange`: Whether to show warning that number is outside of the supported range of numbers (currently signed 128 bit int / i128)
- `number-peeker.hex.showUpercased`: Whether to show hexadecimal characters uppercased
- `number-peeker.hex.trimTrailingFs`: Whether to trim trailing Fs from hex numbers
- `number-peeker.hex.prependZeroWhenPossible`: When hex number contains only one place, prepend zero, just to make it prettier :D
- `number-peeker.hex.show0xBeforeHex`: Show '0x' before hex numbers, just to make it prettier :D
- `number-peeker.exponential.show`: Show exponential representation of the number.
- `number-peeker.exponential.maximumNumberOfFractionDigits`: Number of fraction digits in inclusive range of 0-20. Defaults to 5
- `number-peeker.exponential.showNotationLowercased`: Whether to show scientific notation lowercased

## Upcoming Features

Check the Issues tab, or feel free to open a new Issue/PR.

## Known issues

Check the Issues tab, or feel free to open a new Issue/PR.

# Dev

## Setup

```
npm install -g yo generator-code
```

## Debug

1. `npm run watch`
2. Use VSCode debugger (F5)

## Total cleanup (make sure to have VSCode closed)

```
npm cache clean --force && rm -rf node_modules/ .vscode-test/ out/ *.vsix && npm i && npm run test
```

## Publish

1. Run `./release.sh` from the project root
2. https://marketplace.visualstudio.com/manage/publishers/tdiblik
3. Click on the 3 dots next to the Extension name
4. Select update
5. Select new version from pc
6. `git add .`
7. `git commit -m "[Chore] Bump version to vX.X.X`
8. `git tag vX.X.X`
9. `git push origin master --tag`
10. Create new release and drop the generated .vsix inside of it.

I don't plan on publishing that much, so setting up tokens and stuff just to make the release from a terminal is not worth it. For help, see [official docs](https://code.visualstudio.com/api/working-with-extensions/publishing-extension).

## Notes

- After changing regex matching, write some test cases to make sure it works in the future and run `npm run test` to make sure your changes did not break existing valid cases
  - It would be cool if you added some cases that could potentionally break your regex and test against them, but it's not that important
