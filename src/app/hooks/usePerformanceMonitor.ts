import { useEffect, useRef } from 'react';

/**
 * コンポーネントのレンダリング時間を測定するカスタムフック
 * @param componentName 測定対象のコンポーネント名
 * @param enabled 測定を有効にするかどうか
 */
export const usePerformanceMonitor = (componentName: string, enabled: boolean = true) => {
  const renderTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    // レンダリング開始時間を記録
    renderTimeRef.current = performance.now();

    return () => {
      // レンダリング終了時間を記録し、経過時間を計算
      const endTime = performance.now();
      const renderTime = endTime - renderTimeRef.current;

      // 開発環境でのみログを出力
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName, enabled]);
}; 