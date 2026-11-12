const KEY='mini4wd_lab_custom_course_v1';
const defaults={layout:'balanced',straight:8,curve:8,wave:2,slope:2,bank:1,jump:1};
const ids=['straight','curve','wave','slope','bank','jump'];
const $=id=>document.getElementById(id);
function read(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY))}}catch{return {...defaults}}}
let state=read();
function sync(){
 $('layout').value=state.layout;
 for(const id of ids){$(id).value=state[id];$(`${id}Out`).textContent=`${state[id]}個`;}
 const lift=Math.min(18,5+state.slope*2.4+state.jump*1.5);
 const paths={
  balanced:'M12 76 C22 88 42 84 43 70 C44 56 22 59 21 43 C20 27 42 20 55 31 C68 42 48 51 61 62 C74 73 80 52 72 40 C64 28 76 15 94 20 C112 25 104 43 116 48 C131 55 130 78 111 81 C92 84 85 68 72 77 C56 89 29 91 12 76 Z',
  speed:'M9 78 C20 91 43 86 47 72 C52 55 29 50 39 32 C50 13 79 19 83 35 C87 51 65 57 77 72 C89 88 113 87 128 72 C137 61 126 47 111 48 C94 49 95 29 112 23 C129 17 137 31 132 43',
  compact:'M17 79 C8 64 18 48 34 50 C51 52 51 34 38 27 C24 20 31 9 51 14 C69 19 65 39 79 43 C94 47 91 22 108 19 C127 16 134 35 121 47 C108 59 126 72 116 84 C105 96 87 84 76 73 C64 61 53 83 36 86 C27 88 21 85 17 79 Z'
 };
 const path=paths[state.layout]||paths.balanced;
 const waves=Array.from({length:Math.max(1,state.wave)},(_,i)=>`<circle cx="${26+i*8}" cy="${82-i%2*4}" r="1.8" fill="#f0bd62"/>`).join('');
 const bridge=state.slope?`<path d="M 58 57 Q 70 ${44-lift*.35} 82 52" fill="none" stroke="#f26767" stroke-width="5" stroke-linecap="round"/>`:'';
 const layered=[['#edf1f3',18],['#455866',16],['#d7e8ee',9],['#455866',8],['#d7e8ee',1]].map(([color,width])=>`<path d="${path}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
 $('preview').innerHTML=`<svg viewBox="0 0 140 100" role="img" aria-label="4レーンカスタム複合コースの上面図">${layered}${bridge}${waves}<text x="70" y="97" fill="#9eb7c5" font-size="4" text-anchor="middle">白線＝4レーン境界 / 赤＝立体セクション / 黄＝ウェーブ</text></svg>`;
 const total=state.straight+state.curve+state.wave+state.slope+state.bank+state.jump;
 $('summary').textContent=`全${total}パーツ構成：ストレート${state.straight}、カーブ${state.curve}、ウェーブ${state.wave}、スロープ${state.slope}、20°バンク${state.bank}、ジャンプ${state.jump}。推定コース長は約${(95+state.straight*5.2+state.curve*3.3+state.wave*2.4).toFixed(1)}mです。`;
}
$('layout').addEventListener('change',e=>{state.layout=e.target.value;sync()});
for(const id of ids)$(id).addEventListener('input',e=>{state[id]=Number(e.target.value);sync()});
$('save').addEventListener('click',()=>{localStorage.setItem(KEY,JSON.stringify(state));$('saved').textContent='保存しました。ゲームの「カスタムコース」で使用できます。'});
$('reset').addEventListener('click',()=>{state={...defaults};sync();$('saved').textContent='標準構成へ戻しました。保存ボタンで確定してください。'});
sync();
