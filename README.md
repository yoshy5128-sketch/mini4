# MINI 4WD LAB Ver.0.5.1 PWA

Ver.0.5.0のゲームプレイ機能は維持したPWA対応版です。

## 公開方法
ZIP展開後、フォルダ内の全ファイルを同じ階層でGitHub/Vercelへアップしてください。HTTPSで起動してからAndroid Chrome等の「ホーム画面に追加」または「アプリをインストール」で導入できます。

## PWA仕様
- standalone起動。192px/512pxアイコン、マスク対応512pxアイコン。
- Service Workerでローカルゲームファイルをキャッシュし、新バージョン配信時には旧版キャッシュを削除。
- CDN提供のThree.jsは初回オンライン読み込み後にキャッシュ。**初回の完全オフライン起動は保証しません**。
- セッティング・ベスト記録などのlocalStorageはSW更新時に削除しません。
- Ver.を上げるたび **sw.jsのAPP_VERSIONを変更** し、index.htmlのVer表記・app.js?vの数字も更新してください。
- 新しい版を検知した場合、進行中のゲームを強制再起動しないよう、次回の起動で反映させます。

## 確認
node --check app.js / node --check sw.js。実機でのインストール・オフライン確認は別途必要です。
