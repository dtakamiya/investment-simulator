import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  useTheme,
  TextFieldProps,
  Grid,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

// モーションコンポーネント
const MotionCard = motion(Card);

// 型定義
interface YearlyResult {
  year: number;
  investment: number;
  totalValue: number;
  interest: number;
}

interface SimulationResult {
  totalInvestment: number;
  totalReturn: number;
  yearlyResults: YearlyResult[];
}

interface InputField {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText: string;
  inputProps: TextFieldProps['inputProps'];
}

// ユーティリティ関数
const formatYenValue = (value: number): string => {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}億円`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}万円`;
  }
  return `${value.toLocaleString()}円`;
};

const calculateYAxisDomain = (data: YearlyResult[]): [number, number] => {
  const maxValue = Math.max(...data.map(d => Math.max(d.totalValue, d.investment, d.interest)));
  const minValue = 0;
  const step = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const roundedMax = Math.ceil(maxValue / step) * step;
  return [minValue, roundedMax];
};

// サブコンポーネント
const InputFields = ({ fields }: { fields: InputField[] }) => {
  const theme = useTheme();
  
  return (
    <Grid container spacing={3}>
      {fields.map((field, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <TextField
            fullWidth
            label={field.label}
            type="number"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            variant="outlined"
            inputProps={field.inputProps}
            helperText={field.helperText}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const ResultSummary = ({ result }: { result: SimulationResult }) => (
  <Grid container spacing={3}>
    {[
      { label: '総投資額', value: result.totalInvestment, color: '#8884d8' },
      { label: '最終評価額', value: Math.round(result.totalReturn), color: '#82ca9d' },
      { label: '運用益', value: Math.round(result.totalReturn - result.totalInvestment), color: '#ffc658' }
    ].map((item, index) => (
      <Grid item xs={12} md={4} key={index}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Box 
            sx={{ 
              textAlign: 'center', 
              p: 3,
              background: `linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
              }
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '1.1rem',
                fontWeight: 500,
                mb: 1
              }}
            >
              {item.label}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                background: `linear-gradient(45deg, ${item.color} 30%, ${item.color}88 90%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                fontSize: '2.2rem'
              }}
            >
              {formatYenValue(item.value)}
            </Typography>
          </Box>
        </motion.div>
      </Grid>
    ))}
  </Grid>
);

const InvestmentChart = ({ data }: { data: YearlyResult[] }) => (
  <Box sx={{ width: '100%', height: 400, overflow: 'hidden' }}>
    <ResponsiveContainer>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis 
          dataKey="year" 
          label={{ 
            value: '経過年数', 
            position: 'insideBottom', 
            offset: -10
          }}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={formatYenValue}
          width={80}
          tick={{ fontSize: 12 }}
          label={{ 
            value: '金額', 
            angle: -90, 
            position: 'insideLeft',
            offset: -5,
            style: { textAnchor: 'middle', fontSize: 12 }
          }}
        />
        <Tooltip 
          formatter={(value: number) => [formatYenValue(value)]}
          labelFormatter={(year) => `${year}年目`}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 8,
            border: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '10px 14px',
          }}
        />
        <Legend 
          verticalAlign="top" 
          height={36}
          wrapperStyle={{
            paddingBottom: '20px',
            fontSize: '12px'
          }}
        />
        <Line
          type="monotone"
          dataKey="totalValue"
          name="評価額"
          stroke="#82ca9d"
          strokeWidth={3}
          dot={false}
          activeDot={{ 
            r: 6,
            stroke: '#82ca9d',
            strokeWidth: 2,
            fill: '#fff'
          }}
          isAnimationActive={true}
          animationDuration={2000}
          animationEasing="ease-in-out"
          animationBegin={0}
        />
        <Line
          type="monotone"
          dataKey="investment"
          name="投資額"
          stroke="#8884d8"
          strokeWidth={3}
          dot={false}
          activeDot={{ 
            r: 6,
            stroke: '#8884d8',
            strokeWidth: 2,
            fill: '#fff'
          }}
          isAnimationActive={true}
          animationDuration={2000}
          animationEasing="ease-in-out"
          animationBegin={300}
        />
        <Line
          type="monotone"
          dataKey="interest"
          name="運用益"
          stroke="#ffc658"
          strokeWidth={3}
          dot={false}
          activeDot={{ 
            r: 6,
            stroke: '#ffc658',
            strokeWidth: 2,
            fill: '#fff'
          }}
          isAnimationActive={true}
          animationDuration={2000}
          animationEasing="ease-in-out"
          animationBegin={600}
        />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

const YearlyDetails = ({ results }: { results: YearlyResult[] }) => (
  <Grid container spacing={2}>
    {results.map((yearResult) => (
      <Grid item xs={12} sm={6} md={4} key={yearResult.year}>
        <MotionCard
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <Typography variant="h6" gutterBottom color="primary">
            {yearResult.year}年目
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="textSecondary">
            投資額: {formatYenValue(Math.round(yearResult.investment))}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            評価額: {formatYenValue(Math.round(yearResult.totalValue))}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            運用益: {formatYenValue(Math.round(yearResult.interest))}
          </Typography>
        </MotionCard>
      </Grid>
    ))}
  </Grid>
);

// メインコンポーネント
export default function InvestmentSimulator() {
  const theme = useTheme();
  const [initialInvestment, setInitialInvestment] = useState<string>('0');
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>('');
  const [annualReturn, setAnnualReturn] = useState<string>('');
  const [years, setYears] = useState<string>('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [chartKey, setChartKey] = useState<number>(0);

  const inputFields: InputField[] = [
    {
      label: '初期投資額（万円）',
      value: initialInvestment,
      onChange: setInitialInvestment,
      helperText: '1万円単位で入力してください',
      inputProps: { min: 0, step: 1 }
    },
    {
      label: '毎月の積立金額（万円）',
      value: monthlyInvestment,
      onChange: setMonthlyInvestment,
      helperText: '1万円単位で入力してください',
      inputProps: { min: 0, step: 1 }
    },
    {
      label: '年利（%）',
      value: annualReturn,
      onChange: setAnnualReturn,
      helperText: '小数点1桁まで入力可能',
      inputProps: { min: 0, step: 0.1 }
    },
    {
      label: '積立期間（年）',
      value: years,
      onChange: (value) => {
        if (value === '') {
          setYears('');
          return;
        }
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue <= 100) {
          setYears(value);
        }
      },
      helperText: '1年から100年まで設定可能',
      inputProps: { min: 1, max: 100, step: 1 }
    }
  ];

  const calculateInvestment = () => {
    setChartKey(prev => prev + 1); // グラフを強制的に再レンダリング
    const initial = parseFloat(initialInvestment) * 10000;
    const monthly = parseFloat(monthlyInvestment) * 10000;
    const annual = parseFloat(annualReturn) / 100;
    const period = parseInt(years);

    if (isNaN(initial) || isNaN(monthly) || isNaN(annual) || isNaN(period)) {
      return;
    }

    const yearlyResults: YearlyResult[] = [];
    let totalValue = initial;
    let cumulativeInvestment = initial;

    for (let year = 1; year <= period; year++) {
      const yearlyInvestment = monthly * 12;
      const startValue = totalValue;
      cumulativeInvestment += yearlyInvestment;
      totalValue = (startValue + yearlyInvestment) * (1 + annual);
      
      yearlyResults.push({
        year,
        investment: cumulativeInvestment,
        totalValue,
        interest: totalValue - cumulativeInvestment,
      });
    }

    setResult({
      totalInvestment: initial + (monthly * 12 * period),
      totalReturn: totalValue,
      yearlyResults,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <Typography 
            variant="h3" 
            align="center"
            gutterBottom
            sx={{ 
              mb: 4,
              background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            資産運用シミュレーター
          </Typography>

          <Card 
            elevation={0}
            sx={{ 
              mb: 4, 
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <InputFields fields={inputFields} />
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calculateInvestment}
                  fullWidth
                  sx={{
                    py: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 8px 16px rgba(33, 203, 243, .3)',
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02) translateY(-2px)',
                      boxShadow: '0 12px 20px rgba(33, 203, 243, .4)',
                    },
                  }}
                >
                  シミュレーション開始
                </Button>
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
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          mb: 3
                        }}
                      >
                        シミュレーション結果
                      </Typography>
                      <ResultSummary result={result} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          mb: 3
                        }}
                      >
                        資産推移グラフ
                      </Typography>
                      <motion.div
                        key={chartKey}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <InvestmentChart data={result.yearlyResults} />
                      </motion.div>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                          mb: 3
                        }}
                      >
                        年次詳細
                      </Typography>
                      <YearlyDetails results={result.yearlyResults} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
} 