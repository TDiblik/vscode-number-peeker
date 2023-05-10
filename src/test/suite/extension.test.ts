import * as assert from "assert";

import NumberHoverProvider from "../../NumberHoverProvider";
import { MockMatcher, NumberMatcher } from "../../NumberMatchers";

suite("Whole number matching", () => {
  const success_cases = [
    "0",
    "-0",
    "1",
    "-1",
    "1234",
    "-1234",
    '"1324"',
    '"-1324"',
    "`1324`",
    "`-1324`",
    "1000000",
    "-1000000",
    "01",
    "-01",
    " 1234",
    " -1234",
    "1234 ",
    "-1234 ",
    "const example_number = 1234;",
    'const example_string_number = "1234";',
    "const example_string_number = `1234`;",
    "const example_number = -1234;",
    'const example_string_number = "-1234";',
    "const example_string_number = `-1234`;",
  ];
  for (const success_case of success_cases) {
    const matching_provider = new NumberHoverProvider();
    test(`${success_case} should pass`, () => {
      assert.strictEqual(
        matching_provider.whole_number_matcher.regex.test(success_case),
        true
      );
    });
  }

  const failing_cases = ["Infinity", "-Infinity", "NaN"];
  for (const failing_case of failing_cases) {
    const matching_provider = new NumberHoverProvider();
    test(`${failing_case} should fail to match`, () => {
      assert.strictEqual(
        matching_provider.whole_number_matcher.regex.test(failing_case),
        false
      );
    });
  }
});

suite("Value translations", () => {
  const success_cases = [
    {
      value: 0x0,
      desired_dicimal_representation: "0",
      desired_binary_representation: "00000000",
      desired_hex_representation: "0x00",
    },
  ];

  for (const success_case of success_cases) {
    const number_matcher = new MockMatcher();
    number_matcher.force_set_value(success_case.value);
  }
});
