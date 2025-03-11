import React, { memo } from 'react';
import { Grid, Typography, Divider, Card } from '@mui/material';
import { motion } from 'framer-motion';
import { YearlyResult } from '../utils/investmentCalculator';
import { formatYenValue } from '../utils/formatters';

// モーションコンポーネント
const MotionCard = motion.create(Card);

interface YearlyDetailsProps {
  results: YearlyResult[];
}

/**
 * 年次詳細のコンポーネント
 * @param props コンポーネントのプロパティ
 * @returns 年次詳細のコンポーネント
 */
const YearlyDetails: React.FC<YearlyDetailsProps> = ({ results }) => {
  return (
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
};

export default memo(YearlyDetails); 