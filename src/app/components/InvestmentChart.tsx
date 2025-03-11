import React, { useState, useRef, useEffect, memo } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, useTheme, alpha } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { YearlyResult } from '../utils/investmentCalculator';
import { formatYenValue } from '../utils/formatters';

interface InvestmentChartProps {
  data: YearlyResult[];
}

/**
 * 投資チャートのコンポーネント
 * @param props コンポーネントのプロパティ
 * @returns 投資チャートのコンポーネント
 */
const InvestmentChart: React.FC<InvestmentChartProps> = ({ data }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isVisible, setIsVisible] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'line' | 'area',
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const commonProps = {
    data,
    margin: {
      top: 20,
      right: 30,
      left: 20,
      bottom: 20,
    }
  };

  const commonAxisProps = {
    xAxis: (
      <XAxis 
        dataKey="year" 
        label={{ 
          value: '経過年数', 
          position: 'insideBottom', 
          offset: -10,
          style: { fill: isDarkMode ? theme.palette.text.primary : undefined }
        }}
        tick={{ fontSize: 12, fill: isDarkMode ? theme.palette.text.secondary : undefined }}
        stroke={isDarkMode ? alpha(theme.palette.divider, 0.5) : undefined}
      />
    ),
    yAxis: (
      <YAxis 
        tickFormatter={formatYenValue}
        width={80}
        tick={{ fontSize: 12, fill: isDarkMode ? theme.palette.text.secondary : undefined }}
        stroke={isDarkMode ? alpha(theme.palette.divider, 0.5) : undefined}
        label={{ 
          value: '金額', 
          angle: -90, 
          position: 'insideLeft',
          offset: -5,
          style: { 
            textAnchor: 'middle', 
            fontSize: 12,
            fill: isDarkMode ? theme.palette.text.primary : undefined
          }
        }}
      />
    )
  };

  // ダークモード用のカラーパレット
  const colors = {
    totalValue: isDarkMode ? '#4caf50' : '#82ca9d',
    investment: isDarkMode ? '#7986cb' : '#8884d8',
    interest: isDarkMode ? '#ffb74d' : '#ffc658',
    grid: isDarkMode ? alpha(theme.palette.divider, 0.2) : 'rgba(0, 0, 0, 0.1)',
    tooltip: {
      bg: isDarkMode ? alpha(theme.palette.background.paper, 0.95) : 'rgba(255, 255, 255, 0.95)',
      shadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)',
    }
  };

  return (
    <Box 
      ref={chartRef}
      sx={{ 
        width: '100%',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="グラフ表示形式"
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 3,
              py: 1,
              borderRadius: '4px !important',
              border: `1px solid ${isDarkMode ? alpha(theme.palette.divider, 0.5) : 'rgba(0, 0, 0, 0.12)'}`,
              color: theme.palette.text.primary,
              '&.Mui-selected': {
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${alpha(theme.palette.primary.main, 0.8)} 90%)`,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.9)} 30%, ${alpha(theme.palette.primary.main, 0.7)} 90%)`,
                }
              }
            }
          }}
        >
          <ToggleButton value="area">積み上げグラフ</ToggleButton>
          <ToggleButton value="line">折れ線グラフ</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ height: 400 }}>
        <ResponsiveContainer>
          {chartType === 'line' ? (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              {commonAxisProps.xAxis}
              {commonAxisProps.yAxis}
              <Tooltip 
                formatter={(value: number) => [formatYenValue(value)]}
                labelFormatter={(year) => `${year}年目`}
                contentStyle={{
                  backgroundColor: colors.tooltip.bg,
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: colors.tooltip.shadow,
                  padding: '10px 14px',
                  color: theme.palette.text.primary
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{
                  paddingBottom: '20px',
                  fontSize: '12px',
                  color: theme.palette.text.primary
                }}
              />
              <Line
                type="monotone"
                dataKey="totalValue"
                name="評価額"
                stroke={colors.totalValue}
                strokeWidth={3}
                dot={false}
                activeDot={{ 
                  r: 6,
                  stroke: colors.totalValue,
                  strokeWidth: 2,
                  fill: isDarkMode ? theme.palette.background.default : '#fff'
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
                stroke={colors.investment}
                strokeWidth={3}
                dot={false}
                activeDot={{ 
                  r: 6,
                  stroke: colors.investment,
                  strokeWidth: 2,
                  fill: isDarkMode ? theme.palette.background.default : '#fff'
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
                stroke={colors.interest}
                strokeWidth={3}
                dot={false}
                activeDot={{ 
                  r: 6,
                  stroke: colors.interest,
                  strokeWidth: 2,
                  fill: isDarkMode ? theme.palette.background.default : '#fff'
                }}
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-in-out"
                animationBegin={600}
              />
            </LineChart>
          ) : (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              {commonAxisProps.xAxis}
              {commonAxisProps.yAxis}
              <Tooltip 
                formatter={(value: number) => [formatYenValue(value)]}
                labelFormatter={(year) => `${year}年目`}
                contentStyle={{
                  backgroundColor: colors.tooltip.bg,
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: colors.tooltip.shadow,
                  padding: '10px 14px',
                  color: theme.palette.text.primary
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{
                  paddingBottom: '20px',
                  fontSize: '12px',
                  color: theme.palette.text.primary
                }}
              />
              <Area
                type="monotone"
                dataKey="investment"
                name="投資額"
                stackId="1"
                stroke={colors.investment}
                fill={colors.investment}
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-in-out"
                animationBegin={0}
              />
              <Area
                type="monotone"
                dataKey="interest"
                name="運用益"
                stackId="1"
                stroke={colors.interest}
                fill={colors.interest}
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-in-out"
                animationBegin={300}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default memo(InvestmentChart); 