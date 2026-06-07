# Discord 星座占いBot

Discord のスラッシュコマンド `/uranai` と、パネル形式の `/uranai-panel` で今日の星座占いを返す Bot です。

## できること

- 12 星座から選んで今日の占いを表示
- パネルから星座を選んで本人だけに占い結果を表示
- 総合運 / 恋愛運 / 仕事運 / 健康運を星 5 段階で表示
- ラッキーカラー、ラッキーアイテム、ひとことアドバイスを表示
- 同じ日・同じ星座なら同じ結果になる日替わりロジック

## セットアップ

1. Node.js 20 以上を用意
2. 依存関係をインストール

```bash
npm install
```

3. `.env.example` をコピーして `.env` を作成
4. Discord Developer Portal で取得した値を設定

```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_application_client_id
DISCORD_GUILD_ID=your_test_guild_id
```

## Discord Developer Portal 側の準備

1. [Discord Developer Portal](https://discord.com/developers/applications) で New Application を作成
2. Bot ページで Bot を作成し、Token を `.env` の `DISCORD_TOKEN` に設定
3. General Information の Application ID を `.env` の `DISCORD_CLIENT_ID` に設定
4. Discord の対象サーバーを右クリックして ID をコピーし、`.env` の `DISCORD_GUILD_ID` に設定
5. OAuth2 URL Generator で `bot` と `applications.commands` を選択
6. Bot Permissions は `Send Messages`, `Use Slash Commands`, `Embed Links` を選択
7. 生成された URL から Bot をサーバーに招待

サーバー ID をコピーするには、Discord のユーザー設定で Developer Mode を有効にしておく必要があります。

## コマンド登録

テスト用サーバーにスラッシュコマンドを登録します。

```bash
npm run register
```

## 起動

```bash
npm start
```

## Railway で動かす

この Bot は HTTP サーバーではなく Discord に接続し続ける Worker です。Railway では Web サービスのポート設定は不要で、`npm start` を常駐プロセスとして動かします。

1. Railway で New Project を作成
2. GitHub リポジトリを接続
3. Variables に次の 3 つを追加

```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_application_client_id
DISCORD_GUILD_ID=your_test_guild_id
```

4. Deploy を実行
5. デプロイ時に `npm run register` が自動実行されます
6. もし登録に失敗した場合は、Railway の Deploy Logs で `preDeployCommand` の結果を確認

リポジトリには `railway.json` を入れているので、Railway はデプロイ前に `npm run register` を実行し、その後 `npm start` で Bot を起動します。

## 使い方

- `/uranai`
  星座を直接指定して占いを表示します。
- `/uranai-panel`
  星座選択パネルをチャンネルに投稿します。選んだ結果は選択した本人だけに見えます。

## 次に広げやすい案

- `/omikuji` を追加して星座以外の占いも増やす
- 1 日 1 回、自動で今日のランキングを投稿する
- ユーザーごとに前回の星座を記憶して入力を省略する
