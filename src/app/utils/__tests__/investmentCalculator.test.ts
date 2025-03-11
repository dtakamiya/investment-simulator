/// <reference types="jest" />
import { calculateInvestment } from '../investmentCalculator';

describe('calculateInvestment', () => {
  test('初期投資額のみの場合の計算が正しい', () => {
    const result = calculateInvestment({
      initialInvestment: 1000000, // 100万円
      monthlyInvestment: 0,
      annualReturn: 0.05, // 5%
      years: 10
    });

    expect(result.totalInvestment).toBe(1000000);
    expect(Math.round(result.totalReturn)).toBe(1628895); // 約163万円
    expect(result.yearlyResults.length).toBe(10);
    
    // 最終年の結果を確認
    const finalYear = result.yearlyResults[9];
    expect(finalYear.year).toBe(10);
    expect(finalYear.investment).toBe(1000000);
    expect(Math.round(finalYear.totalValue)).toBe(1628895);
    expect(Math.round(finalYear.interest)).toBe(628895);
  });

  test('毎月の積立のみの場合の計算が正しい', () => {
    const result = calculateInvestment({
      initialInvestment: 0,
      monthlyInvestment: 10000, // 月1万円
      annualReturn: 0.05, // 5%
      years: 10
    });

    expect(result.totalInvestment).toBe(1200000); // 120万円
    expect(Math.round(result.totalReturn)).toBe(1584814); // 約158万円
    expect(result.yearlyResults.length).toBe(10);
  });

  test('初期投資と毎月の積立を組み合わせた場合の計算が正しい', () => {
    const result = calculateInvestment({
      initialInvestment: 1000000, // 100万円
      monthlyInvestment: 10000, // 月1万円
      annualReturn: 0.05, // 5%
      years: 10
    });

    expect(result.totalInvestment).toBe(2200000); // 220万円
    expect(Math.round(result.totalReturn)).toBe(3213709); // 約321万円
    expect(result.yearlyResults.length).toBe(10);
  });

  test('年利0%の場合は元本と同じ', () => {
    const result = calculateInvestment({
      initialInvestment: 1000000,
      monthlyInvestment: 10000,
      annualReturn: 0,
      years: 5
    });

    expect(result.totalInvestment).toBe(1600000); // 160万円
    expect(Math.round(result.totalReturn)).toBe(1600000); // 160万円
    expect(result.yearlyResults.length).toBe(5);
    
    // 運用益は0円
    result.yearlyResults.forEach(year => {
      expect(year.interest).toBe(0);
    });
  });

  test('積立期間が0年の場合は初期投資額のみ', () => {
    const result = calculateInvestment({
      initialInvestment: 1000000,
      monthlyInvestment: 10000,
      annualReturn: 0.05,
      years: 0
    });

    expect(result.totalInvestment).toBe(1000000);
    expect(Math.round(result.totalReturn)).toBe(1000000);
    expect(result.yearlyResults.length).toBe(0);
  });

  test('高い年利での長期投資の複利効果', () => {
    const result = calculateInvestment({
      initialInvestment: 1000000, // 100万円
      monthlyInvestment: 10000, // 月1万円
      annualReturn: 0.10, // 10%
      years: 30
    });

    expect(result.totalInvestment).toBe(4600000); // 460万円
    expect(Math.round(result.totalReturn)).toBe(39162613); // 約3916万円
    expect(result.yearlyResults.length).toBe(30);
    
    // 運用益が投資額を大きく上回る
    expect(Math.round(result.totalReturn - result.totalInvestment)).toBe(34562613); // 約3456万円
  });
}); 