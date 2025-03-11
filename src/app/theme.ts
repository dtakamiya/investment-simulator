'use client';

import { createTheme, PaletteMode } from '@mui/material/styles';
import { useMemo, useState, useEffect } from 'react';

// テーマの作成関数
export const createAppTheme = (mode: PaletteMode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#2196f3',
        ...(mode === 'dark' && {
          main: '#90caf9',
        }),
      },
      secondary: {
        main: '#f50057',
        ...(mode === 'dark' && {
          main: '#f48fb1',
        }),
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s, color 0.3s',
          },
        },
      },
    },
  });
};

// デフォルトテーマ
const defaultTheme = createAppTheme('light');

export default defaultTheme;

// テーマモードを管理するカスタムフック
export const useThemeMode = () => {
  const [mode, setMode] = useState<PaletteMode>('light');

  // システムのカラーモード設定を検出
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setMode(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // テーマモードの切り替え
  const toggleThemeMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // テーマの生成
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return { theme, mode, toggleThemeMode };
}; 