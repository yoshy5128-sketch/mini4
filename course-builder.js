const KEY='mini4wd_lab_custom_course_v1';
const defaults={layout:'balanced',straight:8,curve:8,wave:2,slope:2,bank:1,jump:1};
const ids=['straight','curve','wave','slope','bank','jump'];
const $=id=>document.getElementById(id);
function read(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY))}}catch{return {...defaults}}}
let state=read();
function sync(){
 $('layout').value=state.layout;
 for(const id of ids){$(id).value=state[id];$(`${id}Out`).textContent=`${state[id]}個`;}
 const wide=state.layout==='speed'?118:state.layout==='compact'?76:96;
 const tall=state.layout==='compact'?70:52;
 const lift=Math.min(18,5+state.slope*2.4+state.jump*1.5);
 const waves=Array.from({length:Math.max(1,state.wave)},(_,i)=>`<circle cx="${32+i*9}" cy="${74-i%2*5}" r="2.2" fill="#f0bd62"/>`).join('');
 const bridge=state.slope?`<path d="M ${50-state.slope*3} 29 Q 60 ${29-lift} ${70+state.slope*3} 29" fill="none" stroke="#f26767" stroke-width="5"/>`:'';
 const dividers=[-3,3].map(d=>`<rect x="${12-d/2}" y="${18-d/2}" width="${wide+d}" height="${tall+d}" rx="${tall/2}" fill="none" stroke="#9fdbea" stroke-width="1" stroke-dasharray="2 3"/>`).join('');
 $('preview').innerHTML=`<svg viewBox="0 0 140 100" role="img" aria-label="3レーンカスタムコースの上面図"><rect x="12" y="18" width="${wide}" height="${tall}" rx="${tall/2}" fill="none" stroke="#e8edf0" stroke-width="11"/><rect x="12" y="18" width="${wide}" height="${tall}" rx="${tall/2}" fill="none" stroke="#455866" stroke-width="8"/>${dividers}${bridge}${waves}<text x="70" y="95" fill="#9eb7c5" font-size="4" text-anchor="middle">白線＝3レーン境界 / 赤＝立体セクション / 黄＝ウェーブ</text></svg>`;
 const total=state.straight+state.curve+state.wave+state.slope+state.bank+state.jump;
 $('summary').textContent=`全${total}パーツ構成：ストレート${state.straight}、カーブ${state.curve}、ウェーブ${state.wave}、スロープ${state.slope}、20°バンク${state.bank}、ジャンプ${state.jump}。推定コース長は約${(42+state.straight*4.1+state.curve*2.4+state.wave*1.8).toFixed(1)}mです。`;
}
$('layout').addEventListener('change',e=>{state.layout=e.target.value;sync()});
for(const id of ids)$(id).addEventListener('input',e=>{state[id]=Number(e.target.value);sync()});
$('save').addEventListener('click',()=>{localStorage.setItem(KEY,JSON.stringify(state));$('saved').textContent='保存しました。ゲームの「カスタムコース」で使用できます。'});
$('reset').addEventListener('click',()=>{state={...defaults};sync();$('saved').textContent='標準構成へ戻しました。保存ボタンで確定してください。'});
sync();
