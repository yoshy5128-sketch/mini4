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
