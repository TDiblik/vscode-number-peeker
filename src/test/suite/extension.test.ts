import * as assert from "assert";

import NumberHoverProvider from "../../NumberHoverProvider";
import { MockMatcher, NumberMatcher } from "../../NumberMatchers";

const global_failing_cases = [
  "Infinity",
  "-Infinity",
  "NaN",
  'const example_string_number = "abc";',
  "-0b102030",
  "0b2",
  "0b102",
  "0b1.0",
  "0b10e2",
  "0xg",
  "0x1.2",
  "0x_1",
  "0x1p",
  "0x1p+",
  "0x1p+1.2",
  "0x1p+2",
  "0x1p-2",
  "0x1p-2.3",
  "0xffzz",
];

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
    "const example_arr = [1];",
    "const example_obj = {a: 1};",
    "1_2_3",
    "-1_2_3",
    "123L",
    "123l",
    "123ul",
    "123UL",
    "123LL",
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

  const local_failing_cases = ["_1234_", "1234_", "_1234"];
  for (const failing_case of global_failing_cases.concat(local_failing_cases)) {
    const matching_provider = new NumberHoverProvider();
    test(`${failing_case} should fail to match`, () => {
      assert.strictEqual(
        matching_provider.whole_number_matcher.regex.test(failing_case),
        false
      );
    });
  }
});

suite("Decimal number matching", () => {
  const success_cases = [
    "0.0",
    "123.456",
    ".456",
    "-123.456",
    "-.456",
    "1_000.001_001",
    "123.",
    ".123",
    "0.0f",
  ];
  for (const success_case of success_cases) {
    const matching_provider = new NumberHoverProvider();
    test(`${success_case} should pass`, () => {
      assert.strictEqual(
        matching_provider.decimal_number_matcher.regex.test(success_case),
        true
      );
    });
  }

  const local_failing_cases = ["1__2_3", "1000.0_"];
  for (const failing_case of global_failing_cases.concat(local_failing_cases)) {
    const matching_provider = new NumberHoverProvider();
    test(`${failing_case} should fail to match`, () => {
      assert.strictEqual(
        matching_provider.decimal_number_matcher.regex.test(failing_case),
        false
      );
    });
  }
});

suite("Binary number matching", () => {
  const success_cases = [
    "0b101010",
    "0B11011",
    "-0b101010",
    "0b101010101010",
    " 0b101010101010",
    " 0b101010101010 ",
    "0b101010101010 ",
    "-0b101010101010",
    " -0b101010101010",
    " -0b101010101010 ",
    "-0b101010101010 ",
    "const example_binary_number = 0b1010;",
    'const example_string_binary_number = "0b1010";',
    "const example_string_binary_number = `0b1010`;",
    "const example_arr = [0b101010101010];",
    "const example_arr = [-0b101010101010];",
    "0b0",
    "0B1",
    "-0b1101",
    "0b1111_0000_1111_0000",
    "const example_binary_number = 0b10000000000000000000000000000000;",
    "const example_string_binary_number = '0b101101';",
    "const example_template_literal = `The binary number is: 0b1100`;",
    "const example_function = (num = 0b101010) => num;",
    "const abc = {a: 0b1111111};",
  ];
  for (const success_case of success_cases) {
    const matching_provider = new NumberHoverProvider();
    test(`${success_case} should pass`, () => {
      assert.strictEqual(
        matching_provider.binary_number_matcher.regex.test(success_case),
        true
      );
    });
  }

  const local_failing_cases = [
    "10102030",
    "0b",
    "0b ",
    "0b2 ",
    "0b 101010",
    "0b1010a",
    "0b1.01",
    "0b1e10",
    "10101010",
    "0B1010102",
    "const example_binary_number = 0b1010a;",
    "const example_string_binary_number = `0b1010a`;",
    "0b1111_0000_1111_0000_",
  ];
  for (const failing_case of global_failing_cases.concat(local_failing_cases)) {
    const matching_provider = new NumberHoverProvider();
    test(`${failing_case} should fail to match`, () => {
      assert.strictEqual(
        matching_provider.binary_number_matcher.regex.test(failing_case),
        false
      );
    });
  }
});

suite("Hexadecimal number matching", () => {
  const success_cases = [
    "0x0",
    "0x1",
    "0xa",
    "0xF",
    "0x10",
    "0x123",
    "0xABCDEF",
    "0xabcdef",
    "0x1A2B3C4D",
    " 0x1A2B3C4D",
    " 0x1A2B3C4D ",
    "0x1A2B3C4D ",
    "-0x1A2B3C4D",
    " -0x1A2B3C4D",
    " -0x1A2B3C4D ",
    "-0x1A2B3C4D ",
    "const example_hex_number = 0x1234;",
    'const example_string_hex_number = "0x1234";',
    "const example_string_hex_number = `0x1234`;",
    "0X00",
    "0x123_456",
    "0xABC_DEF",
    "0x0Ff",
    "0x1fffffffffffff",
    "0x8000000000000000",
    " 0x7fffffffffffffff ",
    "-0x7fffffffffffffff",
    " -0x7fffffffffffffff ",
    "-0x1",
    "-0x01",
    "-0x001",
    "-0x123456789abcdef",
    "-0x8000000000000000",
    "const example_hex_number = 0x0;",
    'const example_string_hex_number = "0x0";',
    "const example_string_hex_number = `0x0`;",
    "const abc = 0x1_2_3_4_5_6_7_8_9_a_b_c_d_e_f;",
    "const abc = {a: 0x99};",
  ];
  for (const success_case of success_cases) {
    const matching_provider = new NumberHoverProvider();
    test(`${success_case} should pass`, () => {
      assert.strictEqual(
        matching_provider.hex_number_matcher.regex.test(success_case),
        true
      );
    });
  }

  const local_failing_cases = [
    "0xG",
    "0x.1",
    "0x1.2",
    "0x1.23",
    "0x1p+2.3",
    "0x123456789abcdefg",
    "0x_1",
    "0x1_",
    "0x1__2",
    "0x__12",
    "0x+1",
    "0x-1",
    "0x1p-",
    "0x1p+",
    "0x1p1.2",
    "0x1p1p",
    "0x1pp",
    "0x",
    "0x_",
    "0x_1_",
    "0x1_2_3_4_5_6_7_8_9_A_B_C_D_E_F_",
    "0x1p1_2",
    "0x1p+1_2",
    "0x1p-1_2",
  ];
  for (const failing_case of global_failing_cases.concat(local_failing_cases)) {
    const matching_provider = new NumberHoverProvider();
    test(`${failing_case} should fail to match`, () => {
      assert.strictEqual(
        matching_provider.hex_number_matcher.regex.test(failing_case),
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
