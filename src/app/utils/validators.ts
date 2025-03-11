/**
 * 入力値のバリデーションを行うユーティリティ関数
 */

/**
 * 数値が指定された範囲内かどうかを検証する
 * @param value 検証する値
 * @param min 最小値
 * @param max 最大値
 * @returns 範囲内の場合はtrue、それ以外はfalse
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return !isNaN(value) && value >= min && value <= max;
};

/**
 * 入力値が有効な数値かどうかを検証する
 * @param value 検証する値
 * @returns 有効な数値の場合はtrue、それ以外はfalse
 */
export const isValidNumber = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num) && num >= 0;
};

/**
 * 入力値が有効な整数かどうかを検証する
 * @param value 検証する値
 * @param min 最小値
 * @param max 最大値
 * @returns 有効な整数の場合はtrue、それ以外はfalse
 */
export const isValidInteger = (value: string, min: number, max: number): boolean => {
  if (value === '') return false;
  const num = parseInt(value, 10);
  return !isNaN(num) && isFinite(num) && num >= min && num <= max;
};

/**
 * 入力値が有効な小数かどうかを検証する
 * @param value 検証する値
 * @param min 最小値
 * @param max 最大値
 * @param decimalPlaces 小数点以下の桁数
 * @returns 有効な小数の場合はtrue、それ以外はfalse
 */
export const isValidDecimal = (
  value: string, 
  min: number, 
  max: number, 
  decimalPlaces: number
): boolean => {
  if (value === '') return false;
  const num = parseFloat(value);
  if (isNaN(num) || !isFinite(num) || num < min || num > max) return false;
  
  // 小数点以下の桁数をチェック
  const decimalPart = value.includes('.') ? value.split('.')[1] : '';
  return decimalPart.length <= decimalPlaces;
}; 