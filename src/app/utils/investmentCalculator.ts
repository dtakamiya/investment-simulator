// 型定義
export interface YearlyResult {
  year: number;
  investment: number;
  totalValue: number;
  interest: number;
}

export interface SimulationResult {
  totalInvestment: number;
  totalReturn: number;
  yearlyResults: YearlyResult[];
}

export interface InvestmentParams {
  initialInvestment: number;
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
}

/**
 * 投資シミュレーションの計算を行う関数
 * @param params 投資パラメータ
 * @returns シミュレーション結果
 */
export function calculateInvestment(params: InvestmentParams): SimulationResult {
  const { initialInvestment, monthlyInvestment, annualReturn, years } = params;
  
  const yearlyResults: YearlyResult[] = [];
  let totalValue = initialInvestment;
  let cumulativeInvestment = initialInvestment;

  // 積立期間が0年の場合は初期投資額のみを返す
  if (years <= 0) {
    return {
      totalInvestment: initialInvestment,
      totalReturn: initialInvestment,
      yearlyResults: []
    };
  }

  for (let year = 1; year <= years; year++) {
    const yearlyInvestment = monthlyInvestment * 12;
    const startValue = totalValue;
    cumulativeInvestment += yearlyInvestment;
    totalValue = (startValue + yearlyInvestment) * (1 + annualReturn);
    
    yearlyResults.push({
      year,
      investment: cumulativeInvestment,
      totalValue,
      interest: totalValue - cumulativeInvestment,
    });
  }

  return {
    totalInvestment: initialInvestment + (monthlyInvestment * 12 * years),
    totalReturn: totalValue,
    yearlyResults,
  };
} 