# MINI 4WD LAB v0.1

Mini 4WD-inspired original browser game prototype (Three.js).

## Contents
- Three selectable base cars, procedural 3D models
- 6 upgrade categories, 5 options each = 30 tuning components
- Part swaps affect visible model and performance simulation
- Free parts in this development version
- One-lap oval time trial, deterministic local physics, speed and lap timing
- Best time and tuning configuration saved locally in the browser
- Responsive desktop/mobile layout

## Launch
Use a local web server to serve the folder. For example:

```sh
python -m http.server 8000
```

Then visit http://localhost:8000/. You can also upload all files to a GitHub repository and deploy via Vercel as a static site.

**Requires an internet connection** to fetch Three.js v0.170.0 from jsDelivr. No other online services, accounts, or APIs are used.

## Notes
- This is an original creative model-kit racing simulator, not a licensed Tamiya product.
- All part and physics parameters are provisional game-design values, not manufacturer specifications.
- Future steps: calibrated vehicle dynamics, jump/landing physics, additional courses, component geometry improvements, AI opponents, progression/shop.
- Local save keys: `mini4wd_lab_v01_settings`, `mini4wd_lab_v01_records`.


## Ver.0.1.1 修正
- レース中の速度からタイヤ回転角を算出し、四輪のタイヤ・ホイールを回転させます。
- 車体の配置高さを路面・ガレージ台座の高さに合わせ、浮き上がりを解消します。
- コース初期カメラはキャンバスの縦横比に応じて自動で全体を収め、ウィンドウサイズ変更時もフィットします。
- マウス・タッチでの自由な視点操作は維持します。

## Ver.0.1.2 修正
- コース路面の複数メッシュが同じ高さで重なっていたため、Z-fighting（ちらつき）が発生していました。
- 路面を重複しない隣接する帯状メッシュに変更し、色分けを維持したままちらつきを防止しました。
- パーツ性能、セーブデータ、タイヤ回転、車体高さ、カメラ設定は変更していません。

## Ver.0.1.3 修正
- 路面を色帯の重ね合わせ方式から単一の3Dメッシュに変更。
- 路面には照明・影の描画を適用せず、均一な色に固定。
- 路面より低い位置に地面を分離し、奥行き干渉を回避。
- 深度バッファ精度向上のためカメラのnearを0.25に設定。
- JavaScript読込URLにバージョン番号を付けて古いキャッシュを避ける。
- 計算ロジック・パーツとセーブ形式は変更なし。

## Ver.0.2.0 走行チューニング更新
- 最高速・加速度・転がり抵抗を独立して再調整し、実際の模型に近い疾走感へ。表示は換算値です。
- コーナー手前は有限の制動距離を用いて減速し、コーナーではローラー摩擦を追加。瞬間的な速度固定はしません。
- 横加速度と支持性能からコースアウトリスクを連続的に算出します（意図的に再現性を重視）。
- 試走レポートにコーナー走行時間・減速量を追加しました。
- マシンの設定保存キーはv0.1と互換。物理変更による記録の混同を避けるため、ベスト記録はv0.2で別保存します。
- Ver.0.1.3でちらつき解消済みの単一路面メッシュ方式を保持しました。
- まだ物理実測に基づく校正ではありません。ジャンプ／路面起伏／複数台レースは次段階です。


## Ver.0.2.1：ロングオーバル
- Ver.0.2.0から**コース自体の周長を厳密に3倍**へ変更（約36.91m → 約110.74m）。3周カウントではなく、拡大したコースを1周走ります。
- コース幅は従来と同じ、カーブ半径と直線長をそれぞれ3倍に拡張。
- PC・スマホで全体が収まる初期カメラを再計算。自由視点は維持。
- カーブ半径の変化を走行速度制限へ穏やかに反映。
- ベスト記録は新しい距離専用のキー `oval_3x` を使用（旧記録は保持）。
- 以前修正した**単一路面メッシュ／影なし**のちらつき防止策を維持。

## Ver.0.2.2 UI調整
- 「推定性能（相対指標）」を右のスクロール式パーツ選択欄から左の3Dガレージ表示内へ移動しました。
- マシンは初期カメラの視点を少し左へずらすことで画面右寄りに表示します。
- スマホでは性能ゲージをコンパクトに表示します。テスト走行画面ではゲージを非表示にします。
- チューニング計算・レース計算・路面メッシュ・保存形式は変更していません。


## Ver.0.2.4 走行テンポ調整
- Ver.0.2.2 の全体表示・自由視点カメラへ完全に戻しました。追走カメラは搭載しません。
- レース進行に使うシミュレーション時間を、実時間に対して2.2倍で進めることで、**マシンのコース上での移動そのもの**を速く表示します。コースやマシンを拡大するカメラ演出は使っていません。
- タイヤの回転も表示上の走行テンポに同期させます。
- 走行の性能値、セッティング間の比較、コースアウト判定、従来のベスト記録はそのままです。
- **重要**：ゲーム内タイムは「シミュレーション経過時間」で、実際の時計の時間とは異なります。実時間の所要時間は従来のおよそ1/2.2です。実際の最高速の物理量を2.2倍に変更したわけではありません。
- 路面はv0.1.3の単一メッシュを維持。
