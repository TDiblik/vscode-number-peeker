# VSCode Number Peeker

Hover over number in VSCode and see alternative representations

## Features

- Match when hovering over
  - whole numbers
  - decimal numbers
  - binary numbers
  - hex numbers
  - decimal exponential notaion representation numbers
- Show alternative representations of the number in
  - decimal format
  - hex format
  - binary format
  - decimal exponential notaion representation format (has to be manually enabled in settings)

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
- `number-peeker.binary.showWarningWhenNumberOutsideOfRange`: Whether to show warning that number is outside of the supported range of numbers (currentlly signed 128 bit int / i128)
- `number-peeker.binary.splitNumbersEveryN`: How many numbers to should be in one group, before getting splitted by space. If you don't want to split every N characters, just set this value really high, like 99999.. If you don't want to split every N characters, just set this value really high, like 99999 (and set number-peeker.binary.padding to false!). Defaults to 5
- `number-peeker.binary.padding`: Whether to add padding (zeros -- '0') to splitted binary numbers
- `number-peeker.hex.show`: Whether to show hexadecimal representation on hover
- `number-peeker.hex.showUnsignedWhenPossible`: Whether to show usigned representation whenever user hovers over positive number
- `number-peeker.hex.showI8WhenPossible`: Whether to show signed 8 bit representation whenever user hovers over negative number
- `number-peeker.hex.showI16WhenPossible`: Whether to show signed 16 bit representation whenever user hovers over negative number
- `number-peeker.hex.showI32WhenPossible`: Whether to show signed 32 bit representation whenever user hovers over negative number
- `number-peeker.hex.showI64WhenPossible`: Whether to show signed 64 bit representation whenever user hovers over negative number
- `number-peeker.hex.showI128WhenPossible`: Whether to show signed 128 bit representation whenever user hovers over negative number
- `number-peeker.hex.showSmallestPossibleRepresentation`: Whether to show signed smallest possible representation whenever user hovers over negative number
- `number-peeker.hex.showWarningWhenNumberOutsideOfRange`: Whether to show warning that number is outside of the supported range of numbers (currentlly signed 128 bit int / i128)
- `number-peeker.hex.showUpercased`: Whether to show hexadecimal characters upercased
- `number-peeker.hex.trimTrailingFs`: Whether to trim trailing Fs from hex numbers
- `number-peeker.hex.prependZeroWhenPossible`: When hex number contains only one place, prepend zero, just to make it pretier :D
- `number-peeker.hex.show0xBeforeHex`: Show '0x' before hex numbers, just to make it pretier :D
- `number-peeker.exponential.show`: Show exponential representation of the number.
- `number-peeker.exponential.maximumNumberOfFractionDigits`: Number of fraction digits in inclusive range of 0-20. Defaults to 5
- `number-peeker.exponential.showNotationLowercased`: Whether to show scientific notetion lowercased

## Upcoming Features

None, feel free to open new issue.

## Known issues

None, feel free to open new issue.

# Dev

## Setup

```
npm install -g yo generator-code
```

## Debug

```
1. npm run watch
2. Use VSCode debugger (F5)
```

## Total cleanup (make sure to have VSCode closed)

```
npm cache clean --force && rm -rf node_modules/ .vscode-test/ out/ && npm i && npm run test
```

## Notes

- After changing matching regex, write some test cases to make sure it works in the future and run `npm run test` to make sure your changes did not break existing valid cases
  - It would be cool if you added some cases that could potentionally break your regex and test against them, but it's not that important
