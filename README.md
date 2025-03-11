# Investment Simulator

資産運用シミュレーターアプリケーション

## 概要

このアプリケーションは、投資シミュレーションを行うためのツールです。初期投資額、毎月の積立金額、年利、投資期間を入力することで、将来の資産価値をシミュレーションすることができます。

## 機能

- 初期投資額の設定
- 毎月の積立金額の設定
- 年利の設定
- 投資期間の設定
- シミュレーション結果の表示
  - 総投資額
  - 最終評価額
  - 運用益
- グラフ表示（積み上げグラフ/折れ線グラフ）
- 年次詳細の表示

## 技術スタック

- [Next.js](https://nextjs.org)
- [Material-UI](https://mui.com)
- [Recharts](https://recharts.org)
- [Framer Motion](https://www.framer.com/motion)

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーを起動後、[http://localhost:3000](http://localhost:3000)にアクセスしてアプリケーションを確認できます。

## デプロイ

このアプリケーションはGitHub Pagesにデプロイされています。以下のコマンドでデプロイを実行できます：

```bash
npm run deploy
```

## ライセンス

MITライセンス
