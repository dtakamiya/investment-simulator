import { useState, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  Grid,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { calculateInvestment, SimulationResult } from '../utils/investmentCalculator';
import { convertToYen, convertToDecimal } from '../utils/formatters';
import { isValidNumber, isValidInteger, isValidDecimal } from '../utils/validators';
import InputFields, { InputFieldProps } from './InputFields';
import ResultSummary from './ResultSummary';
import InvestmentChart from './InvestmentChart';
import YearlyDetails from './YearlyDetails';
import ThemeToggle from './ThemeToggle';

/**
 * エラーバウンダリーコンポーネント
 */
class ErrorBoundary extends Component<
  { children: ReactNode, fallback?: ReactNode },
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: ReactNode, fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('投資シミュレーターでエラーが発生しました:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            エラーが発生しました
          </Typography>
          <Typography variant="body1" gutterBottom>
            申し訳ありませんが、シミュレーターの実行中に問題が発生しました。
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ hasError: false, error: null })}
            sx={{ mt: 2 }}
          >
            再試行
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

/**
 * 資産運用シミュレーターのメインコンポーネント
 * @returns 資産運用シミュレーターのコンポーネント
 */
export default function InvestmentSimulator() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // 状態管理
  const [initialInvestment, setInitialInvestment] = useState<string>('0');
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>('');
  const [annualReturn, setAnnualReturn] = useState<string>('');
  const [years, setYears] = useState<string>('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [chartKey, setChartKey] = useState<number>(0);
  
  // 入力エラー状態
  const [errors, setErrors] = useState({
    initialInvestment: false,
    monthlyInvestment: false,
    annualReturn: false,
    years: false
  });

  // 入力値の検証
  const validateInputs = useCallback(() => {
    const newErrors = {
      initialInvestment: !isValidNumber(initialInvestment),
      monthlyInvestment: !isValidNumber(monthlyInvestment),
      annualReturn: !isValidDecimal(annualReturn, 0, 100, 1),
      years: !isValidInteger(years, 1, 100)
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  }, [initialInvestment, monthlyInvestment, annualReturn, years]);

  // 初期投資額の変更ハンドラー
  const handleInitialInvestmentChange = useCallback((value: string) => {
    setInitialInvestment(value);
    setErrors(prev => ({ ...prev, initialInvestment: false }));
  }, []);

  // 毎月の積立金額の変更ハンドラー
  const handleMonthlyInvestmentChange = useCallback((value: string) => {
    setMonthlyInvestment(value);
    setErrors(prev => ({ ...prev, monthlyInvestment: false }));
  }, []);

  // 年利の変更ハンドラー
  const handleAnnualReturnChange = useCallback((value: string) => {
    setAnnualReturn(value);
    setErrors(prev => ({ ...prev, annualReturn: false }));
  }, []);

  // 積立期間の変更ハンドラー
  const handleYearsChange = useCallback((value: string) => {
    if (value === '') {
      setYears('');
      return;
    }
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue <= 100) {
      setYears(value);
      setErrors(prev => ({ ...prev, years: false }));
    }
  }, []);

  // 入力フィールドの設定
  const inputFields: InputFieldProps[] = [
    {
      label: '初期投資額（万円）',
      value: initialInvestment,
      onChange: handleInitialInvestmentChange,
      helperText: errors.initialInvestment ? '有効な数値を入力してください' : '1万円単位で入力してください',
      inputProps: { min: 0, step: 1 },
      error: errors.initialInvestment
    },
    {
      label: '毎月の積立金額（万円）',
      value: monthlyInvestment,
      onChange: handleMonthlyInvestmentChange,
      helperText: errors.monthlyInvestment ? '有効な数値を入力してください' : '1万円単位で入力してください',
      inputProps: { min: 0, step: 1 },
      error: errors.monthlyInvestment
    },
    {
      label: '年利（%）',
      value: annualReturn,
      onChange: handleAnnualReturnChange,
      helperText: errors.annualReturn ? '0〜100の範囲で入力してください' : '小数点1桁まで入力可能',
      inputProps: { min: 0, max: 100, step: 0.1 },
      error: errors.annualReturn
    },
    {
      label: '積立期間（年）',
      value: years,
      onChange: handleYearsChange,
      helperText: errors.years ? '1〜100の範囲で入力してください' : '1年から100年まで設定可能',
      inputProps: { min: 1, max: 100, step: 1 },
      error: errors.years
    }
  ];

  // シミュレーション計算ハンドラー
  const calculateInvestmentHandler = useCallback(() => {
    // 入力値の検証
    if (!validateInputs()) {
      return;
    }
    
    // グラフを強制的に再レンダリング
    setChartKey(prev => prev + 1);
    
    // 入力値の変換
    const initial = convertToYen(initialInvestment);
    const monthly = convertToYen(monthlyInvestment);
    const annual = convertToDecimal(annualReturn);
    const period = parseInt(years);

    // シミュレーション計算
    const result = calculateInvestment({
      initialInvestment: initial,
      monthlyInvestment: monthly,
      annualReturn: annual,
      years: period
    });

    // 結果の設定
    setResult(result);
  }, [initialInvestment, monthlyInvestment, annualReturn, years, validateInputs]);

  return (
    <ErrorBoundary>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ThemeToggle />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              background: isDarkMode 
                ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`
                : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDarkMode ? alpha(theme.palette.divider, 0.3) : 'rgba(255,255,255,0.3)'}`,
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(0,0,0,0.2)' 
                : '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Typography 
              variant="h3" 
              align="center"
              gutterBottom
              sx={{ 
                mb: 4,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${alpha(theme.palette.primary.main, 0.8)} 90%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 900,
                letterSpacing: '-0.5px',
                textShadow: isDarkMode 
                  ? '2px 2px 4px rgba(0,0,0,0.3)' 
                  : '2px 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              資産運用シミュレーター
            </Typography>

            <Card 
              elevation={0}
              sx={{ 
                mb: 4, 
                background: isDarkMode 
                  ? alpha(theme.palette.background.paper, 0.8)
                  : 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? alpha(theme.palette.divider, 0.3) : 'rgba(255,255,255,0.3)'}`,
                borderRadius: 3,
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(0,0,0,0.2)' 
                  : '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box role="form" aria-label="投資シミュレーション入力フォーム">
                  <InputFields fields={inputFields} />
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={calculateInvestmentHandler}
                      fullWidth
                      aria-label="シミュレーション開始"
                      sx={{
                        py: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${alpha(theme.palette.primary.main, 0.8)} 90%)`,
                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02) translateY(-2px)',
                          boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                      }}
                    >
                      シミュレーション開始
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        background: isDarkMode 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isDarkMode ? alpha(theme.palette.divider, 0.3) : 'rgba(255,255,255,0.3)'}`,
                        borderRadius: 3,
                        boxShadow: isDarkMode 
                          ? '0 8px 32px rgba(0,0,0,0.2)' 
                          : '0 8px 32px rgba(0,0,0,0.08)',
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Typography 
                          variant="h5" 
                          gutterBottom 
                          id="results-heading"
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            mb: 3
                          }}
                        >
                          シミュレーション結果
                        </Typography>
                        <Box role="region" aria-labelledby="results-heading">
                          <ResultSummary result={result} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        background: isDarkMode 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isDarkMode ? alpha(theme.palette.divider, 0.3) : 'rgba(255,255,255,0.3)'}`,
                        borderRadius: 3,
                        boxShadow: isDarkMode 
                          ? '0 8px 32px rgba(0,0,0,0.2)' 
                          : '0 8px 32px rgba(0,0,0,0.08)',
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Typography 
                          variant="h5" 
                          gutterBottom 
                          id="chart-heading"
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            mb: 3
                          }}
                        >
                          資産推移グラフ
                        </Typography>
                        <Box role="region" aria-labelledby="chart-heading">
                          <motion.div
                            key={chartKey}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <InvestmentChart data={result.yearlyResults} />
                          </motion.div>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        background: isDarkMode 
                          ? alpha(theme.palette.background.paper, 0.8)
                          : 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isDarkMode ? alpha(theme.palette.divider, 0.3) : 'rgba(255,255,255,0.3)'}`,
                        borderRadius: 3,
                        boxShadow: isDarkMode 
                          ? '0 8px 32px rgba(0,0,0,0.2)' 
                          : '0 8px 32px rgba(0,0,0,0.08)',
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Typography 
                          variant="h5" 
                          gutterBottom 
                          id="yearly-details-heading"
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            mb: 3
                          }}
                        >
                          年次詳細
                        </Typography>
                        <Box role="region" aria-labelledby="yearly-details-heading">
                          <YearlyDetails results={result.yearlyResults} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </motion.div>
            )}
          </Paper>
        </motion.div>
      </Container>
    </ErrorBoundary>
  );
} 