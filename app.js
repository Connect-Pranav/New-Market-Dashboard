/* =====================================================================
   MARKETO AI V4 — App Logic
   All data is local/mock. No external calls. No buy/sell signals.
===================================================================== */

let screenerResults=[...SCREENER_UNIVERSE];
let sortKey=null, sortDir=1;
let watchlist=new Set();
let activeRschTab=0;

/* ---------------------------------------------------------------
   MASCOT — MARKETO RUPEE™
--------------------------------------------------------------- */
const MASCOT_STATES={
  idle:{msg:"How can I help you research today?"},
  thinking:{msg:"Thinking through that for you…"},
  researching:{msg:"Pulling together research notes…"},
  analyzing:{msg:"Analyzing financials and scores…"},
  speaking:{msg:"Here's what I found."},
  success:{msg:"Research summary ready."},
  celebration:{msg:"Nice! That's a strong score."},
  sleep:{msg:"Zzz… click me to wake up."}
};
let mascotState='idle';
function mascotSVG(state){
  const eyeY = state==='sleep' ? 38 : 30;
  const bodyBob = (state==='thinking'||state==='researching'||state==='analyzing') ? 'mascot-bob' : '';
  return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="rg" cx="50%" cy="35%" r="65%"><stop offset="0%" stop-color="#FFE9A8"/><stop offset="55%" stop-color="#F5B700"/><stop offset="100%" stop-color="#B88200"/></radialGradient></defs>
    <ellipse cx="32" cy="32" rx="28" ry="28" fill="none" stroke="#00C2FF" stroke-width="1" stroke-dasharray="3 4" opacity="0.5"><animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="8s" repeatCount="indefinite"/></ellipse>
    <g class="${bodyBob}">
      <circle cx="32" cy="30" r="19" fill="url(#rg)"/>
      ${state==='sleep' ?
        `<line x1="24" y1="${eyeY}" x2="29" y2="${eyeY}" stroke="#08111F" stroke-width="2" stroke-linecap="round"/><line x1="35" y1="${eyeY}" x2="40" y2="${eyeY}" stroke="#08111F" stroke-width="2" stroke-linecap="round"/>`
        :
        `<circle cx="26" cy="${eyeY}" r="3" fill="#08111F"/><circle cx="38" cy="${eyeY}" r="3" fill="#08111F"/><circle cx="27" cy="${eyeY-1}" r="1" fill="#00E5FF"/><circle cx="39" cy="${eyeY-1}" r="1" fill="#00E5FF"/>`
      }
      <path d="M27 38 q5 4 10 0" stroke="#08111F" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
    <path d="M10 36 q-6 -2 -8 -10 q6 0 9 6z" fill="#00C2FF" opacity="0.55"/>
    <path d="M54 36 q6 -2 8 -10 q-6 0 -9 6z" fill="#00C2FF" opacity="0.55"/>
  </svg>`;
}
function renderMascot(){ const el=document.getElementById('sbMascot'); if(el) el.innerHTML=mascotSVG(mascotState); }
function setMascotState(state,customMsg){
  mascotState=state; renderMascot();
  const bubble=document.getElementById('mascotBubble');
  bubble.textContent = customMsg || MASCOT_STATES[state].msg;
  bubble.classList.add('show');
  clearTimeout(window._mascotTimer);
  window._mascotTimer=setTimeout(()=>bubble.classList.remove('show'), 3400);
}
let idleTimer;
function resetIdleTimer(){ clearTimeout(idleTimer); idleTimer=setTimeout(()=>setMascotState('sleep'), 60000); }
['click','keydown'].forEach(ev=>document.addEventListener(ev,resetIdleTimer));

/* ---------------------------------------------------------------
   UTILITIES
--------------------------------------------------------------- */
function scoreColor(v){ return v>=75?'#00D084':v>=50?'#FFB020':'#FF4D5E'; }
function ringSVG(val,color,size=64,stroke=6,bg='rgba(255,255,255,.08)'){
  const r=(size-stroke)/2, c=2*Math.PI*r, off=c*(1-val/100);
  return `<svg width="${size}" height="${size}" style="position:absolute;top:0;left:0;transform:rotate(-90deg)"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${bg}" stroke-width="${stroke}"/><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-dasharray="${c}" stroke-dashoffset="${off}" stroke-linecap="round"/></svg>`;
}
function ringWithLabel(val,color,size,label){
  return `${ringSVG(val,color,size)}<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><div class="score-ring-val" style="color:${color}">${val}</div>${label?`<div style="font-size:8px;color:var(--muted)">${label}</div>`:''}</div>`;
}
function toast(msg){ setMascotState('idle',msg); }

/* ---------------------------------------------------------------
   SIDEBAR SCROLL SYNC
--------------------------------------------------------------- */
function scrollToSection(id){
  const el=document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}
function setupScrollSpy(){
  const sections=['sec1','sec2','sec3'];
  const items=document.querySelectorAll('.sb-item[data-sec]');
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        items.forEach(el=>el.classList.toggle('active', el.dataset.sec===entry.target.id));
      }
    });
  },{rootMargin:'-100px 0px -60% 0px',threshold:0});
  sections.forEach(id=>{ const el=document.getElementById(id); if(el) observer.observe(el); });
}

/* ---------------------------------------------------------------
   SECTION 1 — EXECUTIVE DASHBOARD
--------------------------------------------------------------- */
function renderExecDashboard(){
  const indices=[
    {l:'NIFTY 50',v:'24,853',c:'+0.76%',up:true},{l:'SENSEX',v:'81,502',c:'+0.71%',up:true},
    {l:'BANK NIFTY',v:'52,741',c:'+0.27%',up:true},{l:'INDIA VIX',v:'14.82',c:'-2.8%',up:false},
    {l:'GOLD',v:'₹72,145',c:'+0.35%',up:true},{l:'USD/INR',v:'83.24',c:'+0.12%',up:true}
  ];
  document.getElementById('indexTiles').innerHTML = indices.map(i=>
    `<div class="stat-card" style="border-top:2px solid ${i.up?'var(--ok)':'var(--bad)'}">
      <div class="stat-l">${i.l}</div><div class="stat-v">${i.v}</div>
      <div class="stat-c" style="color:${i.up?'var(--ok)':'var(--bad)'}">${i.up?'▲':'▼'} ${i.c}</div>
    </div>`).join('');

  document.getElementById('sentimentGauge').innerHTML=`
    <div style="position:relative;width:60px;height:60px">${ringWithLabel(70,'#00D084',60)}</div>
    <div><div style="font-weight:800;color:var(--ok);font-family:var(--fd);font-size:14px">Bullish</div><div class="gauge-label">70/100</div></div>`;

  document.getElementById('riskRadar').innerHTML=`
    <div style="position:relative;width:60px;height:60px">${ringWithLabel(45,'#FFB020',60)}</div>
    <div><div style="font-weight:800;color:var(--warn);font-family:var(--fd);font-size:14px">Medium</div><div class="gauge-label">Risk Level</div></div>`;

  const sectors=[
    {n:'IT',v:'+1.32%',up:true},{n:'Banking',v:'+1.21%',up:true},{n:'Auto',v:'-0.15%',up:false},
    {n:'Pharma',v:'+0.45%',up:true},{n:'FMCG',v:'+0.38%',up:true},{n:'Metal',v:'-0.62%',up:false}
  ];
  document.getElementById('sectorHeatmap').innerHTML = sectors.map(s=>
    `<div class="heat-cell" style="background:${s.up?'rgba(0,208,132,.12)':'rgba(255,77,94,.12)'}">
      <div class="hl">${s.n}</div><div class="hv" style="color:${s.up?'var(--ok)':'var(--bad)'}">${s.v}</div>
    </div>`).join('');

  document.getElementById('radarRing').innerHTML = ringWithLabel(60,'#00C2FF',62);
  document.getElementById('phRing').innerHTML = ringWithLabel(78,'#00D084',64);

  document.getElementById('breakingNewsList').innerHTML = NEWS_FEED.slice(0,4).map(n=>
    `<div class="news-row"><div class="news-row-t">${n.t}</div><div class="news-row-time">${n.time}</div></div>`).join('');
}

/* ---------------------------------------------------------------
   LIVE MARKET TV (single sticky panel)
--------------------------------------------------------------- */
function renderTVTabs(){
  document.getElementById('tvTabs').innerHTML = TV_CHANNELS.map(c=>
    `<div class="tv-tab ${c.id===currentChannel?'active':''}" onclick="switchChannel('${c.id}')">${c.name}</div>`).join('');
}
function renderTVPlayer(){
  const ch=TV_CHANNELS.find(c=>c.id===currentChannel);
  const player=document.getElementById('tvPlayer');
  if(!player) return;
  player.innerHTML=`
    <div class="tv-player-bg"></div>
    <div class="tv-live-badge"><span class="live-dot"></span> LIVE</div>
    <div class="tv-player-content">
      <div class="tv-chan-logo" style="background:${ch.color}">${ch.name.split(' ').map(w=>w[0]).join('').slice(0,3)}</div>
      <div class="tv-chan-name">${ch.name}</div>
      <div class="tv-chan-sub">${ch.sub}</div>
    </div>
    <div class="tv-controls"><div class="tv-ctrl-btn">⏸</div><div class="tv-ctrl-btn">🔊</div><div style="flex:1"></div><div class="tv-ctrl-btn">⛶</div></div>`;
  document.getElementById('tvHeadline').textContent = ch.headline;
}
function switchChannel(id){ currentChannel=id; renderTVTabs(); renderTVPlayer(); }
function renderTVNews(){
  document.getElementById('tvNewsList').innerHTML = NEWS_FEED.slice(0,5).map(n=>
    `<div class="tv-news-item"><div class="tv-news-dot"></div><div><div>${n.t}</div><div class="tv-news-impact">Impact: <b>${n.impact}</b> · ${n.sentiment}</div></div></div>`).join('');
}
function renderCeoIntel(){
  const d=COMPANIES[currentTicker]||COMPANIES.INDIAMART;
  document.getElementById('ceoIntelBox').innerHTML=`
    <div class="ceo-mini"><div class="ceo-mini-avatar">${d.logo}</div><div><div class="ceo-mini-name">${d.management.ceo.split(' (')[0]}</div><div class="ceo-mini-role">${d.management.ceo.match(/\(([^)]+)\)/)?.[1]||'Chief Executive'}</div></div></div>
    <div style="font-size:11px;color:var(--text2);line-height:1.55">${d.management.vision}</div>
    <div style="margin-top:8px"><span class="card-link" onclick="scrollToSection('sec2')">View More →</span></div>`;
}

/* ---------------------------------------------------------------
   SECTION 2 — RESEARCH DASHBOARD
--------------------------------------------------------------- */
const RSCH_TAB_NAMES=['Overview','Financials','Management','Growth','Ratios','Risk Analysis','SWOT','BCG Matrix','News','Peers'];
function researchSearch(){
  const q=document.getElementById('rschSearchInput').value.trim().toUpperCase();
  const match=Object.keys(COMPANIES).find(t=>t===q || COMPANIES[t].name.toUpperCase().includes(q));
  if(match){ searchTicker(match); } else { toast(`No covered company matches "${q}". Try INDIAMART, RELIANCE, TCS, HDFCBANK or SBILIFE.`); }
}
function searchTicker(t){
  currentTicker=t;
  document.getElementById('rschSearchInput').value='';
  renderResearch(t);
  renderCeoIntel();
  scrollToSection('sec2');
}
function toggleWatchlist(){
  const btn=document.getElementById('watchlistBtn');
  if(watchlist.has(currentTicker)){ watchlist.delete(currentTicker); btn.textContent='⭐ Add to Watchlist'; btn.style.color='var(--gold)'; }
  else { watchlist.add(currentTicker); btn.textContent='✓ In Watchlist'; btn.style.color='var(--ok)'; toast(`${currentTicker} added to your watchlist.`); }
}
function renderResearch(ticker){
  const d=COMPANIES[ticker];
  if(!d) return;
  setMascotState('researching',`Pulling research on ${d.ticker}…`);

  document.getElementById('rschNameBlock').innerHTML=`<div class="rsch-name-block">${d.name}</div><div class="rsch-name-sub">${d.ticker} · ${d.sector} · CMP ${d.cmp} <span style="color:${d.up?'var(--ok)':'var(--bad)'}">${d.chg}</span></div>`;

  document.getElementById('rschTabs').innerHTML = RSCH_TAB_NAMES.map((t,i)=>
    `<div class="rsch-tab ${i===0?'active':''}" data-i="${i}" onclick="switchRschTab(${i})">${t}</div>`).join('');

  const panes=[
    paneOverview(d), paneFinancials(d), paneManagement(d), paneGrowth(d), paneRatios(d),
    paneRisk(d), paneSWOT(d), paneBCG(d), paneNews(d), panePeers(d)
  ];
  document.getElementById('rschPanes').innerHTML = panes.map((html,i)=>`<div class="rsch-pane ${i===0?'active':''}" id="rsch-${i}">${html}</div>`).join('');
  activeRschTab=0;
  attachTechTabHandlers();

  const btn=document.getElementById('watchlistBtn');
  if(watchlist.has(ticker)){ btn.textContent='✓ In Watchlist'; btn.style.color='var(--ok)'; } else { btn.textContent='⭐ Add to Watchlist'; btn.style.color='var(--gold)'; }

  setTimeout(()=>setMascotState('success',`Research summary ready for ${d.ticker}.`),550);
}
function switchRschTab(i){
  document.querySelectorAll('#rschTabs .rsch-tab').forEach((el,idx)=>el.classList.toggle('active',idx===i));
  document.querySelectorAll('.rsch-pane').forEach((el,idx)=>el.classList.toggle('active',idx===i));
  activeRschTab=i;
  if(i===6) setMascotState('analyzing','Mapping strengths, weaknesses, opportunities & threats…');
  if(i===7) setMascotState('analyzing','Plotting BCG positioning…');
}
function scoreBarRow(label,val,inverse){
  const color=inverse ? (val<=30?'#00D084':val<=55?'#FFB020':'#FF4D5E') : scoreColor(val);
  return `<div class="score-bar-row"><div class="score-bar-label">${label}</div><div class="score-bar-track"><div class="score-bar-fill" style="width:${val}%;background:${color}"></div></div><div class="score-bar-val" style="color:${color}">${val}</div></div>`;
}
function paneOverview(d){
  return `<div class="grid g2">
    <div class="card"><div class="card-title">Company Overview</div>
      <div class="ind-row"><span>Sector</span><span>${d.sector}</span></div>
      <div class="ind-row"><span>Market Cap</span><span>${d.mcap}</span></div>
      <div class="ind-row"><span>P/E (TTM)</span><span>${d.pe}</span></div>
      <div class="ind-row"><span>CMP</span><span>${d.cmp}</span></div>
      <div style="margin-top:10px;font-size:11.5px;color:var(--text2);line-height:1.6">${d.overview.business}</div>
    </div>
    <div class="card"><div class="card-title">Price Chart</div>
      <div class="tf-tabs">${['1D','1W','1M','3M','1Y','3Y','MAX'].map((tf,i)=>`<div class="tf-tab ${i===4?'active':''}">${tf}</div>`).join('')}</div>
      <div class="tech-mini-chart">📈 Illustrative price chart — ${d.cmp}</div>
      <div class="ind-row"><span>Support</span><span style="color:var(--ok);font-weight:700">${d.technical.support}</span></div>
      <div class="ind-row"><span>Resistance</span><span style="color:var(--bad);font-weight:700">${d.technical.resistance}</span></div>
    </div>
    <div class="card"><div class="card-title">Marketo Research Scores</div>
      ${scoreBarRow('Business Quality',d.scores.quality)}
      ${scoreBarRow('Growth Score',d.scores.growth)}
      ${scoreBarRow('Financial Health',d.scores.health)}
      ${scoreBarRow('Management',d.scores.management)}
      ${scoreBarRow('Risk Score',d.scores.risk,true)}
      <div class="overall-score-band"><span style="font-size:11px;color:var(--text2)">Overall Research Score</span><b>${Math.round((d.scores.quality+d.scores.growth+d.scores.health+d.scores.management+(100-d.scores.risk))/5)}/100</b></div>
    </div>
    <div class="card"><div class="card-title">Segment Mix & Market Position</div>
      <ul class="bullet-list">${d.overview.segments.map(s=>`<li>${s}</li>`).join('')}</ul>
      <div style="margin-top:10px;font-size:11.5px;color:var(--text2);line-height:1.6">${d.overview.marketShare}</div>
    </div>
  </div>`;
}
function paneFinancials(d){
  return `<div class="grid g2">
    <div class="card"><div class="card-title">Quarterly P&L (₹ Cr)</div><table class="fin-tbl"><thead><tr><th>Quarter</th><th>Revenue</th><th>Net Profit</th><th>Margin</th></tr></thead><tbody>
      ${d.financials.quarters.map(q=>`<tr><td>${q.q}</td><td>${q.rev.toLocaleString('en-IN')}</td><td>${q.profit.toLocaleString('en-IN')}</td><td>${q.margin}%</td></tr>`).join('')}
    </tbody></table></div>
    <div class="card"><div class="card-title">Annual P&L (₹ Cr)</div><table class="fin-tbl"><thead><tr><th>Year</th><th>Revenue</th><th>Net Profit</th></tr></thead><tbody>
      ${d.financials.annual.map(a=>`<tr><td>${a.y}</td><td>${a.rev.toLocaleString('en-IN')}</td><td>${a.profit.toLocaleString('en-IN')}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="card span2"><div class="card-title">Balance Sheet Snapshot</div>
      <div class="grid g3">
        <div class="ind-row"><span>Cash / AUM</span><span>${d.financials.balanceSheet.cash}</span></div>
        <div class="ind-row"><span>Borrowings</span><span>${d.financials.balanceSheet.borrowings}</span></div>
        <div class="ind-row"><span>Net Worth</span><span>${d.financials.balanceSheet.networth}</span></div>
      </div>
    </div>
  </div>`;
}
function paneManagement(d){
  return `<div class="grid g2">
    <div class="card"><div class="card-title">CEO Intelligence</div>
      <div class="ceo-mini"><div class="ceo-mini-avatar" style="width:52px;height:52px;font-size:16px">${d.logo}</div><div><div class="ceo-mini-name" style="font-size:13.5px">${d.management.ceo}</div></div></div>
      <div style="font-size:11.5px;color:var(--text2);line-height:1.6">${d.management.vision}</div>
    </div>
    <div class="card"><div class="card-title">Leadership Team</div><ul class="bullet-list">${d.management.team.map(t=>`<li>${t}</li>`).join('')}</ul>
      <div class="card-title" style="margin-top:14px">Earnings Call Commentary</div>
      <div style="font-size:11.5px;color:var(--text2);line-height:1.6">${d.management.commentary}</div>
    </div>
  </div>`;
}
function paneGrowth(d){
  return `<div class="grid g2">
    <div class="card"><div class="card-title">Growth Intelligence</div><ul class="bullet-list">${d.growth.items.map(g=>`<li>${g}</li>`).join('')}</ul></div>
    <div class="card"><div class="card-title">Capex Outlook</div><div style="font-size:11.5px;color:var(--text2);line-height:1.6">${d.growth.capex}</div></div>
  </div>`;
}
function paneRatios(d){
  return `<div class="grid g2">
    <div class="card"><div class="card-title">Key Ratios</div>
      <div class="ind-row"><span>ROE</span><span style="font-weight:700">${d.financials.ratios.roe}</span></div>
      <div class="ind-row"><span>ROCE</span><span style="font-weight:700">${d.financials.ratios.roce}</span></div>
      <div class="ind-row"><span>Debt Position</span><span style="font-weight:700">${d.financials.ratios.debt}</span></div>
      <div class="ind-row"><span>Net Margin</span><span style="font-weight:700">${d.financials.ratios.margin}</span></div>
    </div>
    <div class="card"><div class="card-title">Cash Conversion</div><div style="font-size:11.5px;color:var(--text2);line-height:1.6">${d.financials.ratios.cashConv}</div></div>
  </div>`;
}
function paneRisk(d){
  return `<div class="grid g2">
    <div class="card"><div class="card-title">⚠️ Promoter Risk</div><div style="font-size:11.5px;color:var(--text2);line-height:1.55">${d.risk.promoter}</div></div>
    <div class="card"><div class="card-title">⚠️ Debt Risk</div><div style="font-size:11.5px;color:var(--text2);line-height:1.55">${d.risk.debt}</div></div>
    <div class="card"><div class="card-title">⚠️ Competition Risk</div><div style="font-size:11.5px;color:var(--text2);line-height:1.55">${d.risk.competition}</div></div>
    <div class="card"><div class="card-title">⚠️ Sector Risk</div><div style="font-size:11.5px;color:var(--text2);line-height:1.55">${d.risk.sector}</div></div>
    <div class="card span2"><div class="card-title">⚠️ Execution Risk</div><div style="font-size:11.5px;color:var(--text2);line-height:1.55">${d.risk.execution}</div></div>
  </div>`;
}
function paneSWOT(d){
  return `<div class="grid g2">
    <div class="swot-box" style="background:rgba(0,208,132,.04);border-color:rgba(0,208,132,.2)"><div class="swot-head" style="color:var(--ok)">💪 Strengths</div><ul class="bullet-list bl-s">${d.swot.s.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="swot-box" style="background:rgba(255,176,32,.04);border-color:rgba(255,176,32,.2)"><div class="swot-head" style="color:var(--warn)">⚠️ Weaknesses</div><ul class="bullet-list bl-w">${d.swot.w.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="swot-box" style="background:rgba(0,194,255,.04);border-color:rgba(0,194,255,.2)"><div class="swot-head" style="color:var(--cyan)">🚀 Opportunities</div><ul class="bullet-list bl-o">${d.swot.o.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="swot-box" style="background:rgba(255,77,94,.04);border-color:rgba(255,77,94,.2)"><div class="swot-head" style="color:var(--bad)">🔻 Threats</div><ul class="bullet-list bl-t">${d.swot.t.map(x=>`<li>${x}</li>`).join('')}</ul></div>
  </div>`;
}
function paneBCG(d){
  const x = 50+(d.bcg.relativeShare-50)*0.9, y = 100-(d.bcg.marketGrowth);
  return `<div class="grid g2">
    <div class="card"><div class="card-title">BCG Matrix Positioning</div>
      <div class="bcg-matrix-mini">
        <div class="bcg-quad-mini" style="top:0;left:0">⭐ Stars</div>
        <div class="bcg-quad-mini" style="top:0;left:50%">❓ Question Marks</div>
        <div class="bcg-quad-mini" style="top:50%;left:0">🐄 Cash Cows</div>
        <div class="bcg-quad-mini" style="top:50%;left:50%">🐕 Dogs</div>
        <div class="bcg-dot-mini" style="left:${x}%;top:${y}%" title="${d.ticker}"></div>
      </div>
      <div class="bcg-axis-label"><span>← Low Market Share</span><span>High →</span></div>
    </div>
    <div class="card"><div class="card-title">Positioning: ${d.bcg.quadrant}</div><div style="font-size:11.5px;color:var(--text2);line-height:1.6">${d.bcg.note}</div>
      <div class="ind-row" style="margin-top:10px"><span>Market Growth Indicator</span><span style="font-weight:700">${d.bcg.marketGrowth}/100</span></div>
      <div class="ind-row"><span>Relative Market Share</span><span style="font-weight:700">${d.bcg.relativeShare}/100</span></div>
    </div>
  </div>`;
}
function paneNews(d){
  return `<div class="card">${d.news.map(n=>`<div class="news-row"><div class="news-row-t"><b style="color:var(--cyan);font-weight:700">${n.tag}</b> — ${n.t}</div><div class="news-row-time">${n.time}</div></div>`).join('')}</div>`;
}
function panePeers(d){
  const peers=SCREENER_UNIVERSE.filter(s=>s.s===d.sector.split(' ')[0]||s.s.includes(d.sector.split('/')[0].split(' ')[0])).filter(s=>s.n!==d.ticker).slice(0,5);
  const rows = peers.length ? peers : SCREENER_UNIVERSE.filter(s=>s.n!==d.ticker).slice(0,5);
  return `<div class="card"><div class="card-title">Peer Comparison</div>
    <table class="stbl"><thead><tr><th>Company</th><th>PE</th><th>ROE%</th><th>Quality</th><th>Growth</th></tr></thead><tbody>
    ${rows.map(p=>`<tr><td style="cursor:pointer;color:var(--cyan)" onclick="searchTicker('${p.n}')">${p.n}</td><td>${p.pe}x</td><td>${p.roe}%</td><td><span class="score-chip" style="color:${scoreColor(p.quality)}">${p.quality}</span></td><td><span class="score-chip" style="color:${scoreColor(p.growth)}">${p.growth}</span></td></tr>`).join('')}
    </tbody></table></div>`;
}
function attachTechTabHandlers(){
  document.querySelectorAll('.tf-tabs').forEach(group=>{
    group.querySelectorAll('.tf-tab').forEach(tab=>{
      tab.onclick=()=>{ group.querySelectorAll('.tf-tab').forEach(t=>t.classList.remove('active')); tab.classList.add('active'); };
    });
  });
}

/* ---------------------------------------------------------------
   SECTION 3 — OPPORTUNITY DASHBOARD
--------------------------------------------------------------- */
function renderOppFinder(){
  document.getElementById('oppFinderGrid').innerHTML = Object.keys(OPPORTUNITY_GROUPS).map(k=>{
    const g=OPPORTUNITY_GROUPS[k];
    return `<div class="opp-pill" onclick="filterByGroup('${k}')"><div class="opp-pill-name">${g.label}</div><div class="opp-pill-count">${g.tickers.length} Stocks</div></div>`;
  }).join('');
}
function filterByGroup(k){
  const g=OPPORTUNITY_GROUPS[k];
  screenerResults = SCREENER_UNIVERSE.filter(s=>g.tickers.includes(s.n));
  renderScreener(screenerResults);
  toast(g.note);
  document.getElementById('screenerTable').scrollIntoView({behavior:'smooth'});
}
function renderTopOpp(){
  const top=[...SCREENER_UNIVERSE].sort((a,b)=>b.quality-a.quality).slice(0,5);
  document.getElementById('topOppBody').innerHTML = top.map(s=>
    `<tr><td style="cursor:pointer;color:var(--cyan)" onclick="searchTicker('${s.n}')">${s.n}</td><td>${s.s}</td>
      <td><span class="score-chip" style="color:${scoreColor(s.quality)}">${s.quality}</span></td>
      <td><span class="score-chip" style="color:${scoreColor(s.growth)}">${s.growth}</span></td>
      <td><span class="score-chip" style="color:${s.risk<=30?'#00D084':s.risk<=45?'#FFB020':'#FF4D5E'}">${s.risk}</span></td>
    </tr>`).join('');
}
function renderScreener(rows){
  document.getElementById('rCount').textContent = `${rows.length} results found`;
  document.getElementById('screenerResultsLabel').textContent = `${rows.length} Results Found`;
  document.getElementById('screenBody').innerHTML = rows.map(s=>`<tr>
    <td style="font-weight:700;cursor:pointer;color:var(--cyan)" onclick="searchTicker('${s.n}')">${s.n}<div style="font-size:9px;color:var(--muted);font-weight:400">${s.s}</div></td>
    <td>${s.pe}x</td>
    <td style="color:${s.roe>=20?'var(--ok)':'var(--text)'}">${s.roe}%</td>
    <td style="color:${s.revG>=15?'var(--ok)':'var(--text)'}">${s.revG}%</td>
    <td>${s.divY}%</td>
    <td><span class="score-chip" style="color:${scoreColor(s.quality)}">${s.quality}</span></td>
    <td><span class="score-chip" style="color:${scoreColor(s.growth)}">${s.growth}</span></td>
    <td><span class="score-chip" style="color:${scoreColor(s.health)}">${s.health}</span></td>
    <td><span class="score-chip" style="color:${s.risk<=30?'#00D084':s.risk<=45?'#FFB020':'#FF4D5E'}">${s.risk}</span></td>
  </tr>`).join('');
}
function runScreen(){
  const v=id=>parseFloat(document.getElementById(id).value);
  const maxPE=v('fPE')||999, minROE=v('fROE')||0, maxDE=v('fDE')!==v('fDE')?999:(v('fDE')||999);
  const minRevG=v('fRevG')||0, minProfitG=v('fProfitG')||0, minProm=v('fProm')||0, minFII=v('fFII')||0;
  screenerResults = SCREENER_UNIVERSE.filter(s=>
    s.pe<=maxPE && s.roe>=minROE && s.revG>=minRevG && s.profitG>=minProfitG &&
    (typeof s.promHold==='number'?s.promHold:0)>=minProm && s.fiiHold>=minFII
  );
  renderScreener(screenerResults);
  setMascotState('analyzing',`${screenerResults.length} companies match your filters.`);
  document.getElementById('screenerTable').scrollIntoView({behavior:'smooth'});
}
function sortTable(key){
  if(sortKey===key) sortDir*=-1; else { sortKey=key; sortDir=1; }
  screenerResults.sort((a,b)=>{
    if(typeof a[key]==='string') return a[key].localeCompare(b[key])*sortDir;
    return ((a[key]||0)-(b[key]||0))*sortDir;
  });
  renderScreener(screenerResults);
}
function renderTechChart(){
  const ind=document.getElementById('techIndicator').value;
  const tf=document.getElementById('techTimeframe').value;
  document.getElementById('techChartBox').textContent = `📈 ${ind} (${tf}) — illustrative reading for ${currentTicker}`;
}

/* ---------------------------------------------------------------
   MARKETO BRAIN™ CHAT
--------------------------------------------------------------- */
let chatHistory=[{role:'ai',text:"Hi, I'm <b>MARKETO Brain™</b>. Ask me to research a company — e.g. <i>\"Analyze INDIAMART\"</i> or <i>\"Compare TCS vs HDFCBANK\"</i> — and I'll pull together an overview, financial trend, management notes, SWOT, BCG positioning and risk read. I provide research, not investment advice."}];
function goPage(p){
  document.getElementById('secBrain').style.display = p==='brain' ? 'block':'none';
  document.getElementById('secNews').style.display = p==='news' ? 'block':'none';
  if(p==='brain'){ renderChat(); renderChatSuggest(); document.getElementById('secBrain').scrollIntoView({behavior:'smooth'}); }
  if(p==='news'){ renderNewsFeed(); document.getElementById('secNews').scrollIntoView({behavior:'smooth'}); }
}
function renderChatSuggest(){
  const chips=['Analyze INDIAMART','Compare TCS vs HDFCBANK','Explain SBILIFE risk profile','What is a BCG Matrix?'];
  document.getElementById('chatSuggest').innerHTML = chips.map(c=>`<div style="font-size:10.5px;padding:6px 10px;border-radius:7px;background:rgba(0,194,255,.06);border:1px solid var(--bdrcyan);color:var(--cyan);cursor:pointer" onclick="sendChip('${c}')">${c}</div>`).join('');
}
function renderChat(){
  document.getElementById('chatMsgs').innerHTML = chatHistory.map(m=>
    `<div style="max-width:80%;font-size:12.5px;line-height:1.55;padding:10px 13px;border-radius:11px;margin-bottom:10px;${m.role==='user'?'margin-left:auto;background:var(--blue);color:#fff':'background:var(--panel2);border:1px solid var(--bdr);color:var(--text2)'}">${m.text}</div>`).join('');
  const el=document.getElementById('chatMsgs'); el.scrollTop=el.scrollHeight;
}
function sendChip(text){ document.getElementById('chatInput').value=text; sendChat(); }
function sendChat(){
  const input=document.getElementById('chatInput');
  const text=input.value.trim();
  if(!text) return;
  chatHistory.push({role:'user',text});
  renderChat(); input.value='';
  setMascotState('thinking');
  setTimeout(()=>{ chatHistory.push({role:'ai',text:brainRespond(text)}); renderChat(); setMascotState('speaking'); },600);
}
function brainRespond(q){
  const upper=q.toUpperCase();
  const found=Object.keys(COMPANIES).find(t=>upper.includes(t));
  if(found){
    const d=COMPANIES[found];
    return `<b>${d.name} — Research Summary</b><br><br><b>Overview:</b> ${d.overview.business}<br><br><b>Financial Trend:</b> ROE stands at ${d.financials.ratios.roe} with ${d.financials.ratios.debt.toLowerCase()}.<br><br><b>Management:</b> ${d.management.vision}<br><br><b>Scores:</b> Quality ${d.scores.quality} · Growth ${d.scores.growth} · Health ${d.scores.health} · Management ${d.scores.management} · Risk ${d.scores.risk}<br><br><i>Research summary only, not investment advice.</i> <span style="color:var(--cyan);cursor:pointer" onclick="goPage('exec');searchTicker('${found}')">Open ${found} →</span>`;
  }
  if(upper.includes('COMPARE')){
    const tickers=Object.keys(COMPANIES).filter(t=>upper.includes(t));
    if(tickers.length>=2){
      const [a,b]=tickers, da=COMPANIES[a], db=COMPANIES[b];
      return `<b>${a} vs ${b}</b><br><br>Quality: ${da.scores.quality} vs ${db.scores.quality}<br>Growth: ${da.scores.growth} vs ${db.scores.growth}<br>Health: ${da.scores.health} vs ${db.scores.health}<br>Risk: ${da.scores.risk} vs ${db.scores.risk}<br><br><i>Comparison reflects research scores only.</i>`;
    }
  }
  if(upper.includes('BCG')) return `The BCG Matrix classifies a business by relative market share (x-axis) and market growth (y-axis) into four quadrants: <b>Stars</b>, <b>Cash Cows</b>, <b>Question Marks</b>, and <b>Dogs</b>. Each covered company has a BCG tab in its Research Dashboard.`;
  if(upper.includes('RISK')) return `I evaluate risk across five dimensions: promoter, debt, competition, sector, and execution risk. Try "Explain [TICKER] risk profile" for INDIAMART, RELIANCE, TCS, HDFCBANK, or SBILIFE.`;
  return `I can research INDIAMART, RELIANCE, TCS, HDFCBANK, or SBILIFE — try "Analyze [company]", "Compare [A] vs [B]", or ask about SWOT or BCG Matrix.`;
}

/* ---------------------------------------------------------------
   NEWS INTELLIGENCE
--------------------------------------------------------------- */
function renderNewsFeed(){
  const root=document.getElementById('newsFeedRoot');
  const catColor={Breaking:'var(--bad)',Results:'var(--ok)','FII/DII':'var(--cyan)','Corporate Actions':'var(--gold)',Sector:'var(--cyan)','Government Policy':'var(--warn)','Bulk Deals':'var(--muted)'};
  root.innerHTML = NEWS_FEED.map(n=>`<div class="news-row">
    <div class="news-row-t"><b style="color:${catColor[n.cat]}">${n.cat}</b> — ${n.t} <span style="color:var(--muted)">(Impact: ${n.impact}, ${n.sentiment})</span></div>
    <div class="news-row-time">${n.time}</div>
  </div>`).join('');
}

/* ---------------------------------------------------------------
   GLOBAL SEARCH
--------------------------------------------------------------- */
const SEARCHABLE=[
  ...Object.values(COMPANIES).map(c=>({type:'Company',label:c.ticker,meta:c.name,action:()=>{searchTicker(c.ticker);}})),
  {type:'Sector',label:'IT Services',meta:'TCS, WIPRO, ZENTEC',action:()=>scrollToSection('sec3')},
  {type:'Sector',label:'Insurance',meta:'SBILIFE, HDFCLIFE, ICICIGI',action:()=>scrollToSection('sec3')},
  {type:'Sector',label:'Banking',meta:'HDFCBANK',action:()=>scrollToSection('sec3')},
  {type:'CEO',label:'Dinesh Agarwal',meta:'CEO, IndiaMART',action:()=>searchTicker('INDIAMART')},
  {type:'CEO',label:'Mukesh Ambani',meta:'Chairman, Reliance Industries',action:()=>searchTicker('RELIANCE')},
  {type:'CEO',label:'K Krithivasan',meta:'CEO, TCS',action:()=>searchTicker('TCS')}
];
function setupGlobalSearch(){
  const input=document.getElementById('globalSearch');
  const resultsEl=document.getElementById('gsearchResults');
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){ resultsEl.classList.remove('show'); return; }
    const matches=SEARCHABLE.filter(s=>s.label.toLowerCase().includes(q)||s.meta.toLowerCase().includes(q)).slice(0,8);
    if(!matches.length){ resultsEl.innerHTML=`<div class="gsr-item"><span class="gsr-meta">No matches in covered universe</span></div>`; resultsEl.classList.add('show'); return; }
    resultsEl.innerHTML = matches.map(m=>`<div class="gsr-item"><div><div class="gsr-name">${m.label}</div><div class="gsr-meta">${m.meta}</div></div><span class="gsr-tag">${m.type}</span></div>`).join('');
    resultsEl.classList.add('show');
    Array.from(resultsEl.children).forEach((el,i)=>el.addEventListener('click',()=>{ matches[i].action(); resultsEl.classList.remove('show'); input.value=''; }));
  });
  document.addEventListener('click',e=>{ if(!e.target.closest('.gsearch-wrap')) resultsEl.classList.remove('show'); });
  document.addEventListener('keydown',e=>{ if((e.metaKey||e.ctrlKey)&&e.key==='k'){ e.preventDefault(); input.focus(); } });
}

/* ---------------------------------------------------------------
   INIT
--------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded',()=>{
  renderMascot();
  resetIdleTimer();
  renderExecDashboard();
  renderTVTabs();
  renderTVPlayer();
  renderTVNews();
  renderCeoIntel();
  renderResearch(currentTicker);
  renderOppFinder();
  renderTopOpp();
  renderScreener(screenerResults);
  setupGlobalSearch();
  setupScrollSpy();
  document.querySelector('.sb-item[data-sec="sec1"]').classList.add('active');
});
