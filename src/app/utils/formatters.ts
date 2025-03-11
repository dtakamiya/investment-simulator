/**
 * フォーマット関連のユーティリティ関数
 */

/**
 * 金額を日本円表記にフォーマットする
 * @param value フォーマットする金額
 * @returns フォーマットされた金額文字列
 */
export const formatYenValue = (value: number): string => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}億円`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}万円`;
  }
  return `${value.toLocaleString()}円`;
};

/**
 * パーセント値をフォーマットする
 * @param value フォーマットするパーセント値
 * @param decimalPlaces 小数点以下の桁数
 * @returns フォーマットされたパーセント文字列
 */
export const formatPercent = (value: number, decimalPlaces: number = 1): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * 年数をフォーマットする
 * @param value フォーマットする年数
 * @returns フォーマットされた年数文字列
 */
export const formatYears = (value: number): string => {
  return `${value}年`;
};

/**
 * 万円単位の入力値を円単位に変換する
 * @param value 万円単位の入力値
 * @returns 円単位の値
 */
export const convertToYen = (value: string): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num * 10000;
};

/**
 * パーセント入力値を小数に変換する
 * @param value パーセント入力値
 * @returns 小数値
 */
export const convertToDecimal = (value: string): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num / 100;
}; 