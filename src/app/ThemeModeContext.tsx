'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeMode } from './theme';

// テーマモードコンテキストの型定義
type ThemeModeContextType = {
  toggleThemeMode: () => void;
  mode: 'light' | 'dark';
};

// コンテキストの作成
const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

// コンテキストを使用するためのカスタムフック
export const useThemeModeContext = () => {
  const context = useContext(ThemeModeContext);
  if (context === undefined) {
    throw new Error('useThemeModeContext must be used within a ThemeModeProvider');
  }
  return context;
};

// テーマモードプロバイダーコンポーネント
export const ThemeModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, mode, toggleThemeMode } = useThemeMode();

  return (
    <ThemeModeContext.Provider value={{ mode, toggleThemeMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}; 