'use client';

import React, { memo } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeModeContext } from '../ThemeModeContext';

/**
 * テーマ切り替えボタンコンポーネント
 * ライトモードとダークモードを切り替えるためのボタンを提供します
 */
const ThemeToggle: React.FC = () => {
  const { mode, toggleThemeMode } = useThemeModeContext();
  
  return (
    <Tooltip title={mode === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}>
      <IconButton
        onClick={toggleThemeMode}
        color="inherit"
        aria-label="テーマ切り替え"
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1100,
          bgcolor: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
          '&:hover': {
            bgcolor: mode === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)',
          },
        }}
      >
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default memo(ThemeToggle); 