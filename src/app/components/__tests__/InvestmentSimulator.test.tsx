/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import InvestmentSimulator from '../InvestmentSimulator';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// ThemeToggleコンポーネントをモック
jest.mock('../../components/ThemeToggle', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="theme-toggle-mock">テーマ切替</div>
  };
});

// 完全なテーマモック
const mockTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2196f3' },
    text: { secondary: '#666666' }
  },
  typography: {
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
    fontWeightLight: 300
  }
});

// ThemeProviderのモック
jest.mock('@mui/material', () => {
  const originalModule = jest.requireActual('@mui/material');
  return {
    ...originalModule,
    useTheme: () => mockTheme,
  };
});

// useThemeModeのモック
jest.mock('../../theme', () => ({
  useThemeMode: () => ({
    theme: mockTheme,
    mode: 'light',
    toggleThemeMode: jest.fn()
  })
}));

// Rechartsのモック
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
    AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    Area: () => <div data-testid="area" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

// framer-motionのモック
jest.mock('framer-motion', () => {
  return {
    motion: {
      div: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => <div {...props}>{children}</div>,
      create: (Component: React.ComponentType<any>) => Component,
    },
  };
});

// テスト用のラッパーコンポーネント
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={mockTheme}>
      {children}
    </ThemeProvider>
  );
};

describe('InvestmentSimulator', () => {
  beforeEach(() => {
    // IntersectionObserverのモック
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  test('初期レンダリング時に入力フィールドが表示される', () => {
    render(<InvestmentSimulator />, { wrapper: TestWrapper });
    
    expect(screen.getByLabelText('初期投資額（万円）')).toBeInTheDocument();
    expect(screen.getByLabelText('毎月の積立金額（万円）')).toBeInTheDocument();
    expect(screen.getByLabelText('年利（%）')).toBeInTheDocument();
    expect(screen.getByLabelText('積立期間（年）')).toBeInTheDocument();
    expect(screen.getByText('シミュレーション開始')).toBeInTheDocument();
  });

  test('入力フィールドに値を入力できる', async () => {
    render(<InvestmentSimulator />, { wrapper: TestWrapper });
    
    const initialInvestmentInput = screen.getByLabelText('初期投資額（万円）');
    const monthlyInvestmentInput = screen.getByLabelText('毎月の積立金額（万円）');
    const annualReturnInput = screen.getByLabelText('年利（%）');
    const yearsInput = screen.getByLabelText('積立期間（年）');
    
    await userEvent.clear(initialInvestmentInput);
    await userEvent.type(initialInvestmentInput, '100');
    expect(initialInvestmentInput).toHaveValue(100);
    
    await userEvent.type(monthlyInvestmentInput, '5');
    expect(monthlyInvestmentInput).toHaveValue(5);
    
    await userEvent.type(annualReturnInput, '5');
    expect(annualReturnInput).toHaveValue(5);
    
    await userEvent.type(yearsInput, '20');
    expect(yearsInput).toHaveValue(20);
  });

  test('シミュレーション実行後に結果が表示される', async () => {
    render(<InvestmentSimulator />, { wrapper: TestWrapper });
    
    // 入力値を設定
    const initialInvestmentInput = screen.getByLabelText('初期投資額（万円）');
    const monthlyInvestmentInput = screen.getByLabelText('毎月の積立金額（万円）');
    const annualReturnInput = screen.getByLabelText('年利（%）');
    const yearsInput = screen.getByLabelText('積立期間（年）');
    
    await userEvent.clear(initialInvestmentInput);
    await userEvent.type(initialInvestmentInput, '100');
    await userEvent.type(monthlyInvestmentInput, '5');
    await userEvent.type(annualReturnInput, '5');
    await userEvent.type(yearsInput, '20');
    
    // シミュレーション実行
    const simulateButton = screen.getByText('シミュレーション開始');
    fireEvent.click(simulateButton);
    
    // 結果が表示されることを確認
    await waitFor(() => {
      expect(screen.getByText('シミュレーション結果')).toBeInTheDocument();
      expect(screen.getByText('資産推移グラフ')).toBeInTheDocument();
      expect(screen.getByText('年次詳細')).toBeInTheDocument();
    });
    
    // 結果の内容を確認
    expect(screen.getByText('総投資額')).toBeInTheDocument();
    expect(screen.getByText('最終評価額')).toBeInTheDocument();
    expect(screen.getByText('運用益')).toBeInTheDocument();
  });

  test('年利に不正な値を入力するとシミュレーション結果が表示されない', async () => {
    render(<InvestmentSimulator />, { wrapper: TestWrapper });
    
    // 入力値を設定（年利に不正な値）
    const initialInvestmentInput = screen.getByLabelText('初期投資額（万円）');
    const monthlyInvestmentInput = screen.getByLabelText('毎月の積立金額（万円）');
    const annualReturnInput = screen.getByLabelText('年利（%）');
    const yearsInput = screen.getByLabelText('積立期間（年）');
    
    await userEvent.clear(initialInvestmentInput);
    await userEvent.type(initialInvestmentInput, '100');
    await userEvent.type(monthlyInvestmentInput, '5');
    await userEvent.type(annualReturnInput, 'abc'); // 不正な値
    await userEvent.type(yearsInput, '20');
    
    // シミュレーション実行
    const simulateButton = screen.getByText('シミュレーション開始');
    fireEvent.click(simulateButton);
    
    // 結果が表示されないことを確認
    expect(screen.queryByText('シミュレーション結果')).not.toBeInTheDocument();
  });

  test('積立期間に100を超える値を入力できない', async () => {
    render(<InvestmentSimulator />, { wrapper: TestWrapper });
    
    const yearsInput = screen.getByLabelText('積立期間（年）');
    
    await userEvent.type(yearsInput, '101');
    
    // 入力値が100に制限されることを確認
    expect(yearsInput).not.toHaveValue(101);
  });

  test('グラフタイプを切り替えることができる', async () => {
    render(<InvestmentSimulator />, { wrapper: TestWrapper });
    
    // 入力値を設定
    const initialInvestmentInput = screen.getByLabelText('初期投資額（万円）');
    const monthlyInvestmentInput = screen.getByLabelText('毎月の積立金額（万円）');
    const annualReturnInput = screen.getByLabelText('年利（%）');
    const yearsInput = screen.getByLabelText('積立期間（年）');
    
    await userEvent.clear(initialInvestmentInput);
    await userEvent.type(initialInvestmentInput, '100');
    await userEvent.type(monthlyInvestmentInput, '5');
    await userEvent.type(annualReturnInput, '5');
    await userEvent.type(yearsInput, '20');
    
    // シミュレーション実行
    const simulateButton = screen.getByText('シミュレーション開始');
    fireEvent.click(simulateButton);
    
    // グラフが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText('資産推移グラフ')).toBeInTheDocument();
    });
    
    // デフォルトでは積み上げグラフが選択されている
    expect(screen.getByText('積み上げグラフ')).toHaveAttribute('aria-pressed', 'true');
    
    // 折れ線グラフに切り替え
    const lineGraphButton = screen.getByText('折れ線グラフ');
    fireEvent.click(lineGraphButton);
    
    // 折れ線グラフが選択されていることを確認
    await waitFor(() => {
      expect(screen.getByText('折れ線グラフ')).toHaveAttribute('aria-pressed', 'true');
    });
  });
}); 