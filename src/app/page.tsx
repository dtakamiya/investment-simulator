'use client';

import InvestmentSimulator from './components/InvestmentSimulator';
import { ThemeModeProvider } from './ThemeModeContext';

export default function Home() {
  return (
    <ThemeModeProvider>
      <InvestmentSimulator />
    </ThemeModeProvider>
  );
}
