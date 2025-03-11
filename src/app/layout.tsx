import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '資産運用シミュレーター',
  description: '将来の資産をシミュレーションするツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
