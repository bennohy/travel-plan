(() => {
  const key = 'comic-expo-2026-itinerary';
  const steps = [
    {id:'train', icon:'🚄', title:'搭乘高鐵 0612 前往台北', text:'09:25 新竹發車，09:59 抵達台北。建議 09:10 前完成進站。'},
    {id:'metro', icon:'🚇', title:'轉乘捷運前往台北101／世貿站', text:'從高鐵台北站走到紅線 R10，搭往象山方向 7 站至 R03。'},
    {id:'expo', icon:'🎫', title:'領取 FF14 周邊販售入場號碼牌', text:'前往世貿一館 19 號入口，掃 QR Code；領完再逛展。'},
    {id:'lunch', icon:'🍕', title:'12:00 前往 Banco Pizza 報到', text:'已訂 2 人。請預留從世貿一館步行約 6–8 分鐘的時間。'},
    {id:'shop', icon:'🛍️', title:'回 FF14 攤位等待叫號與購買', text:'購買完成後，於 14:30 前決定是否前往史博館。'},
    {id:'museum', icon:'🏺', title:'前往國立歷史博物館看木乃伊特展', text:'R03 至 R08 中正紀念堂，再步行約 15–18 分鐘。'},
    {id:'nangang', icon:'🍽️', title:'前往南港享用晚餐', text:'依今天是否前往特展，選擇世貿或史博館出發的南港路線。'},
    {id:'return', icon:'🚄', title:'高鐵南港站搭車回新竹', text:'回程車次尚未填寫；抵達 BL22 南港後依高鐵指標進站。'}
  ];
  let state = {checks:{}, notes:'', returnTrain:'', dinnerPlace:'', museumRoute:'undecided'};
  const storage = { get(){ try { return localStorage.getItem(key); } catch (_) { return null; } }, set(value){ try { localStorage.setItem(key,value); return true; } catch (_) { return false; } } };
  try { state = {...state, ...JSON.parse(storage.get() || '{}')}; } catch (_) {}
  const save = () => storage.set(JSON.stringify(state));
  const title = document.getElementById('nextTitle'), text = document.getElementById('nextText'), icon = document.getElementById('nextIcon');
  function updateNext(){
    if(state.checks.shop && state.museumRoute==='undecided') { title.textContent='決定：看特展，或直接前往南港'; text.textContent='行程已保留兩條南港路線；選擇後可依出發地開啟導航。'; icon.textContent='🧭'; return; }
    const active = steps.filter(s => s.id !== 'museum' || state.museumRoute === 'visit');
    const next = active.find(s => !state.checks[s.id]) || {icon:'✨',title:'今天的行程都完成了',text:'辛苦了，祝你帶著滿滿戰利品平安回新竹。'};
    title.textContent=next.title; text.textContent=next.text; icon.textContent=next.icon;
  }
  document.querySelectorAll('[data-check]').forEach(input => { input.checked=Boolean(state.checks[input.dataset.check]); input.addEventListener('change',()=>{state.checks[input.dataset.check]=input.checked;save();updateNext();}); });
  const notes=document.getElementById('notesInput'); notes.value=state.notes || ''; notes.addEventListener('input',()=>{state.notes=notes.value;document.getElementById('saveStatus').textContent=save()?'已儲存於此裝置':'此檢視器不允許儲存；本次開啟期間仍可使用';});
  const returnTrain=document.getElementById('returnTrain'); returnTrain.value=state.returnTrain || ''; returnTrain.addEventListener('input',()=>{state.returnTrain=returnTrain.value;save();});
  const dinnerPlace=document.getElementById('dinnerPlace'); dinnerPlace.value=state.dinnerPlace || ''; dinnerPlace.addEventListener('input',()=>{state.dinnerPlace=dinnerPlace.value;save();});
  document.querySelectorAll('input[name="museum-route"]').forEach(input=>{input.checked=input.value===(state.museumRoute||'undecided');input.addEventListener('change',()=>{state.museumRoute=input.value;save();updateNext();});});
  document.getElementById('clearData').addEventListener('click',()=>{if(!confirm('要清除這台裝置上的行程勾選、回程資訊與備忘嗎？'))return;state={checks:{},notes:'',returnTrain:'',dinnerPlace:'',museumRoute:'undecided'};save();document.querySelectorAll('[data-check]').forEach(x=>x.checked=false);document.querySelector('[name="museum-route"][value="undecided"]').checked=true;notes.value='';returnTrain.value='';dinnerPlace.value='';updateNext();});
  updateNext();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('service-worker.js').catch(()=>{});
})();
