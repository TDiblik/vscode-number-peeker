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

  const failing_cases = [
    "Infinity",
    "-Infinity",
    "NaN",
    'const example_string_number = "abc";',
  ];
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

// Does not work
suite("Value translations", () => {
  /*
  const success_cases = [
    {
      value: 0,
      expected_binary_representation: "00000000",
      expected_hex_representation: "0x00",
    },
    {
      value: 1,
      expected_binary_representation: "00000001",
      expected_hex_representation: "0x01",
    },
    {
      value: 10,
      expected_binary_representation: "00001010",
      expected_hex_representation: "0x0A",
    },
    {
      value: 1234,
      expected_binary_representation: "00000100 11010010",
      expected_hex_representation: "0x04 0xD2",
    },

    {
      value: -32769,
      expected_binary_representation: "10000000 00000000 00000000 00000000",
      expected_hex_representation: "0x80 0x00 0x00 0x00",
    },
    // {
    //   value: -2147483648,
    //   expected_binary_representation: "10000000 00000000 00000000 00000000",
    //   expected_hex_representation: "0x80 0x00 0x00 0x00",
    // },
  ];

  for (const success_case of success_cases) {
    const number_matcher = new MockMatcher(
      success_case.value.toString(),
      success_case.expected_binary_representation,
      success_case.expected_hex_representation
    );
    number_matcher.force_set_value(success_case.value);
    test(`${success_case.value} should output expected representations (${success_case.value} ; ${success_case.expected_binary_representation} ; ${success_case.expected_hex_representation})`, () => {
      assert.strictEqual(
        number_matcher.build_dialog_text(),
        number_matcher.build_expected_output()
      );
    });
  }
  */
});
