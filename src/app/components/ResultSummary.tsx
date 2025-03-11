import React, { memo } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { SimulationResult } from '../utils/investmentCalculator';
import { formatYenValue } from '../utils/formatters';

interface ResultSummaryProps {
  result: SimulationResult;
}

/**
 * 結果サマリーのコンポーネント
 * @param props コンポーネントのプロパティ
 * @returns 結果サマリーのコンポーネント
 */
const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  const summaryItems = [
    { label: '総投資額', value: result.totalInvestment, color: '#8884d8' },
    { label: '最終評価額', value: Math.round(result.totalReturn), color: '#82ca9d' },
    { label: '運用益', value: Math.round(result.totalReturn - result.totalInvestment), color: '#ffc658' }
  ];

  return (
    <Grid container spacing={3}>
      {summaryItems.map((item, index) => (
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
};

export default memo(ResultSummary); 