/* =====================================================================
   MARKETO AI V5 — App Logic
   All data is local/mock. No external calls. No buy/sell signals.
===================================================================== */

let screenerResults=[...SCREENER_UNIVERSE];
let sortKey=null, sortDir=1;
let watchlist=new Set();
let activeScannerTab='breakout';

/* ---------------------------------------------------------------
   MASCOT — wiring (SVG drawing lives in mascot.js)
--------------------------------------------------------------- */
const MASCOT_STATES={
  idle:{msg:"How can I help you research today?",label:'Idle'},
  thinking:{msg:"Thinking through that for you…",label:'Thinking'},
  researching:{msg:"Pulling together research notes…",label:'Researching'},
  analyzing:{msg:"Analyzing financials and scores…",label:'Analyzing'},
  alert:{msg:"Heads up — new market update available.",label:'Alert'},
  success:{msg:"Research summary ready.",label:'Success'}
};
let mascotState='idle';
function renderMascot(){
  const el=document.getElementById('sbMascot');
  if(!el) return;
  if(typeof rupeeMascotSVG !== 'function'){
    el.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:28px;font-family:var(--fd);font-weight:800">₹</div>';
    console.error('[MARKETO AI] mascot.js did not load — rupeeMascotSVG is unavailable. Showing fallback glyph.');
    return;
  }
  el.innerHTML=rupeeMascotSVG(mascotState);
}
function setMascotState(state,customMsg){
  mascotState=state; renderMascot();
  const badge=document.getElementById('mascotStateBadge');
  if(badge) badge.textContent = MASCOT_STATES[state].label;
  const bubble=document.getElementById('mascotBubble');
  bubble.textContent = customMsg || MASCOT_STATES[state].msg;
  bubble.classList.add('show');
  clearTimeout(window._mascotTimer);
  window._mascotTimer=setTimeout(()=>{ bubble.classList.remove('show'); if(mascotState===state) setMascotState('idle'); }, 3200);
}
let mascotClickCount=0;
function mascotClick(){
  mascotClickCount++;
  const cycle=['thinking','researching','analyzing','alert','success'];
  setMascotState(cycle[mascotClickCount%cycle.length]);
}
function toast(msg){ setMascotState('idle',msg); }

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

/* ---------------------------------------------------------------
   TOP TICKER STRIP
--------------------------------------------------------------- */
function renderTicker(){
  const items=[
    {l:'NIFTY 50',v:'24,853',c:'+0.76%',up:true},{l:'SENSEX',v:'81,502',c:'+0.71%',up:true},
    {l:'BANK NIFTY',v:'52,741',c:'+0.27%',up:true},{l:'INDIA VIX',v:'14.82',c:'-2.8%',up:false},
    {l:'GOLD',v:'₹72,145',c:'+0.35%',up:true},{l:'USD/INR',v:'83.24',c:'+0.12%',up:true},
    {l:'CRUDE',v:'$78.91',c:'+1.25%',up:true},{l:'FII FLOW',v:'+₹2,340 Cr',c:'Net Buy',up:true}
  ];
  const row = items.map(i=>`<div class="ticker-item">${i.l} <b>${i.v}</b> <span style="color:${i.up?'var(--ok)':'var(--bad)'}">${i.up?'▲':'▼'} ${i.c}</span></div>`).join('');
  document.getElementById('tickerTrack').innerHTML = row + row; // doubled for seamless scroll loop
}

/* ---------------------------------------------------------------
   PAGE ROUTING
--------------------------------------------------------------- */
function goPage(p){
  document.querySelectorAll('.sb-item[data-page]').forEach(el=>el.classList.toggle('active',el.dataset.page===p));
  document.querySelectorAll('.page').forEach(el=>el.classList.remove('active'));
  let el=document.getElementById('page-'+p);
  if(!el){ renderPage(p); el=document.getElementById('page-'+p); }
  el.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderPage(p){
  const main=document.getElementById('appMain');
  const div=document.createElement('div');
  div.className='page'; div.id='page-'+p;
  if(p==='exec') div.innerHTML=execPageHTML();
  if(p==='research') div.innerHTML=researchPageHTML();
  if(p==='opportunity') div.innerHTML=opportunityPageHTML();
  if(p==='brain') div.innerHTML=brainPageHTML();
  if(p==='news') div.innerHTML=newsPageHTML();
  main.appendChild(div);
  if(p==='exec'){ initTVWidget(); }
  if(p==='research'){ renderResearch(currentTicker); }
  if(p==='opportunity'){ renderScreener(screenerResults); renderOppFinder(); renderTopOpp(); renderScanner(activeScannerTab); }
  if(p==='brain'){ renderChat(); renderChatSuggest(); }
  if(p==='news'){ renderNewsFeed(); }
}

/* ---------------------------------------------------------------
   PAGE 1 — EXECUTIVE DASHBOARD
--------------------------------------------------------------- */
function execPageHTML(){
  return `
  <div class="pg-head">
    <div><span class="pg-eyebrow">Executive Dashboard</span><div class="pg-title">🏛️ What should I monitor today?</div><div class="pg-sub">Research insights for investors, executives & portfolio owners</div></div>
  </div>
  <div class="disclaimer-strip"><b>Research Only.</b> MARKETO AI provides financial research and intelligence — not buy/sell recommendations, price targets, or trading signals.</div>

  <div class="grid g6" style="margin-bottom:14px" id="indexTiles"></div>

  <div class="grid g4" style="margin-bottom:14px">
    <div class="card"><div class="card-title">Market Sentiment</div><div class="gauge-wrap" id="sentimentGauge"></div></div>
    <div class="card"><div class="card-title">Risk Radar</div><div class="gauge-wrap" id="riskRadar"></div></div>
    <div class="card"><div class="card-title">Sector Heatmap <span class="card-link" onclick="goPage('opportunity')">View All →</span></div><div class="heat-grid" id="sectorHeatmap"></div></div>
    <div class="card"><div class="card-title">Opportunity Radar</div><div class="radar-wrap"><div style="position:relative;width:58px;height:58px;flex-shrink:0" id="radarRing"></div><div><div class="radar-count">12</div><div class="radar-sub">High Potential<br>Opportunities</div></div></div></div>
  </div>

  <div class="grid g3" style="margin-bottom:14px;align-items:start">
    <div class="card">
      <div class="card-title">Portfolio Health</div>
      <div class="ph-layout"><div style="position:relative;width:60px;height:60px;flex-shrink:0" id="phRing"></div>
        <div class="ph-metrics"><div class="ph-row"><span>Allocation</span><b>82/100</b></div><div class="ph-row"><span>Diversification</span><b>74/100</b></div><div class="ph-row"><span>Risk Score</span><b>68/100</b></div><div class="ph-row"><span>Overall Health</span><b style="color:var(--ok)">78/100</b></div></div>
      </div>
      <div style="margin-top:10px"><span class="card-link" onclick="toast('Portfolio Tracker is part of the Phase 2 roadmap.')">Go to Portfolio →</span></div>
    </div>
    <div class="card">
      <div class="card-title">Top Opportunities</div>
      <div id="topOppMini"></div>
      <div style="margin-top:8px"><span class="card-link" onclick="goPage('opportunity')">View All →</span></div>
    </div>
    <div class="card">
      <div class="card-title">FII / DII Flow</div>
      <div style="font-size:17px;font-weight:800;font-family:var(--fd);color:var(--ok)">+₹2,340 Cr / +₹1,125 Cr</div>
      <div style="font-size:11px;color:var(--muted);margin-top:6px">Net institutional buying, today. Five consecutive sessions of net positive flow.</div>
    </div>
  </div>

  <div class="grid g3" style="margin-bottom:14px;align-items:start">
    <div class="card">
      <div class="card-title">Sector Momentum</div>
      <div id="sectorMomentum"></div>
    </div>
    <div class="card">
      <div class="card-title">📺 Market TV <span style="font-size:9px;color:var(--muted);text-transform:none">Demo Feed</span></div>
      <div class="tv-widget">
        <div class="tv-widget-tabs" id="tvTabs"></div>
        <div class="tv-widget-player" id="tvPlayer"></div>
        <div class="tv-widget-ticker">📌 <span id="tvHeadline"></span></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Breaking News <span class="card-link" onclick="goPage('news')">View All →</span></div>
      <div id="breakingNewsList"></div>
    </div>
  </div>
  `;
}
function renderExecDashboard(){
  const indices=[
    {l:'NIFTY 50',v:'24,853',c:'+0.76%',up:true},{l:'SENSEX',v:'81,502',c:'+0.71%',up:true},
    {l:'BANK NIFTY',v:'52,741',c:'+0.27%',up:true},{l:'INDIA VIX',v:'14.82',c:'-2.8%',up:false},
    {l:'GOLD',v:'₹72,145',c:'+0.35%',up:true},{l:'USD/INR',v:'83.24',c:'+0.12%',up:true}
  ];
  document.getElementById('indexTiles').innerHTML = indices.map(i=>
    `<div class="stat-card" style="border-top:2px solid ${i.up?'var(--ok)':'var(--bad)'}"><div class="stat-l">${i.l}</div><div class="stat-v">${i.v}</div><div class="stat-c" style="color:${i.up?'var(--ok)':'var(--bad)'}">${i.up?'▲':'▼'} ${i.c}</div></div>`).join('');

  document.getElementById('sentimentGauge').innerHTML=`<div style="position:relative;width:56px;height:56px">${ringWithLabel(70,'#00D084',56)}</div><div><div style="font-weight:800;color:var(--ok);font-family:var(--fd);font-size:13px">Bullish</div><div class="gauge-label">70/100</div></div>`;
  document.getElementById('riskRadar').innerHTML=`<div style="position:relative;width:56px;height:56px">${ringWithLabel(45,'#FFB020',56)}</div><div><div style="font-weight:800;color:var(--warn);font-family:var(--fd);font-size:13px">Medium</div><div class="gauge-label">Risk Level</div></div>`;

  const sectors=[{n:'IT',v:'+1.32%',up:true},{n:'Banking',v:'+1.21%',up:true},{n:'Auto',v:'-0.15%',up:false},{n:'Pharma',v:'+0.45%',up:true},{n:'FMCG',v:'+0.38%',up:true},{n:'Metal',v:'-0.62%',up:false}];
  document.getElementById('sectorHeatmap').innerHTML = sectors.map(s=>`<div class="heat-cell" style="background:${s.up?'rgba(0,208,132,.12)':'rgba(255,77,94,.12)'}"><div class="hl">${s.n}</div><div class="hv" style="color:${s.up?'var(--ok)':'var(--bad)'}">${s.v}</div></div>`).join('');

  document.getElementById('radarRing').innerHTML = ringWithLabel(60,'#00C2FF',58);
  document.getElementById('phRing').innerHTML = ringWithLabel(78,'#00D084',60);

  document.getElementById('breakingNewsList').innerHTML = NEWS_FEED.slice(0,4).map(n=>`<div class="news-row"><div class="news-row-t">${n.t}</div><div class="news-row-time">${n.time}</div></div>`).join('');

  const topOpp=[...SCREENER_UNIVERSE].sort((a,b)=>b.quality-a.quality).slice(0,3);
  document.getElementById('topOppMini').innerHTML = topOpp.map(s=>`<div class="news-row"><div class="news-row-t" style="cursor:pointer;color:var(--cyan)" onclick="goPage('research');searchTicker('${s.n}')">${s.n} <span style="color:var(--muted)">· ${s.s}</span></div><div class="news-row-time" style="color:${scoreColor(s.quality)}">Q ${s.quality}</div></div>`).join('');

  const sm=[{n:'Auto',v:62,up:true},{n:'Banking',v:74,up:true},{n:'IT Services',v:58,up:true},{n:'Realty',v:38,up:false}];
  document.getElementById('sectorMomentum').innerHTML = sm.map(s=>`<div class="ind-row"><span>${s.n}</span><span style="color:${s.up?'var(--ok)':'var(--bad)'};font-weight:700">${s.v}/100</span></div>`).join('');
}

/* ---------------------------------------------------------------
   COMPACT MARKET TV WIDGET (Executive Dashboard only)
--------------------------------------------------------------- */
function initTVWidget(){
  document.getElementById('tvTabs').innerHTML = TV_CHANNELS.map(c=>`<div class="tv-tab ${c.id===currentChannel?'active':''}" onclick="switchChannel('${c.id}')">${c.name}</div>`).join('');
  renderTVPlayer();
}
function renderTVPlayer(){
  const ch=TV_CHANNELS.find(c=>c.id===currentChannel);
  const player=document.getElementById('tvPlayer');
  if(!player) return;
  player.innerHTML=`<div class="tv-widget-bg"></div><div class="tv-live-badge"><span class="live-dot"></span> LIVE</div>
    <div class="tv-widget-content"><div class="tv-chan-logo" style="background:${ch.color}">${ch.name.split(' ').map(w=>w[0]).join('').slice(0,3)}</div><div class="tv-chan-name">${ch.name}</div><div class="tv-chan-sub">${ch.sub}</div></div>`;
  document.getElementById('tvHeadline').textContent = ch.headline;
}
function switchChannel(id){
  currentChannel=id;
  document.querySelectorAll('#tvTabs .tv-tab').forEach((el,i)=>el.classList.toggle('active',TV_CHANNELS[i].id===id));
  renderTVPlayer();
}

/* ---------------------------------------------------------------
   PAGE 2 — RESEARCH DASHBOARD
--------------------------------------------------------------- */
function researchPageHTML(){
  return `
  <div class="pg-head"><div><span class="pg-eyebrow">Research Dashboard</span><div class="pg-title">🔍 Deep Company Research</div><div class="pg-sub">Search any covered company for a full research workspace</div></div></div>
  <div class="disclaimer-strip"><b>Research Only.</b> Scores reflect business characteristics, not buy/sell recommendations or price targets.</div>
  <div class="card" style="margin-bottom:14px">
    <div class="rsch-search-row">
      <input class="rsch-search-input" id="rschSearchInput" placeholder="Search Company (e.g. INDIAMART)" onkeydown="if(event.key==='Enter')researchSearch()">
      <div id="rschNameBlock"></div>
      <button class="btn-tag" id="watchlistBtn" onclick="toggleWatchlist()" style="margin-left:auto">⭐ Add to Watchlist</button>
    </div>
    <div class="rsch-tabs" id="rschTabs"></div>
    <div id="rschPanes"></div>
  </div>
  `;
}
const RSCH_TAB_NAMES=['Overview','Financials','Management','Growth','Ratios','Risk Analysis','SWOT','BCG Matrix','News','Peers'];
function researchSearch(){
  const q=document.getElementById('rschSearchInput').value.trim().toUpperCase();
  const match=Object.keys(COMPANIES).find(t=>t===q || COMPANIES[t].name.toUpperCase().includes(q));
  if(match){ searchTicker(match); } else { toast(`No covered company matches "${q}". Try INDIAMART, RELIANCE, TCS, HDFCBANK or SBILIFE.`); }
}
function searchTicker(t){
  currentTicker=t;
  if(!document.getElementById('page-research')) renderPage('research');
  goPage('research');
  document.getElementById('rschSearchInput').value='';
  renderResearch(t);
}
function toggleWatchlist(){
  const btn=document.getElementById('watchlistBtn');
  if(watchlist.has(currentTicker)){ watchlist.delete(currentTicker); btn.textContent='⭐ Add to Watchlist'; btn.style.color='var(--gold)'; }
  else { watchlist.add(currentTicker); btn.textContent='✓ In Watchlist'; btn.style.color='var(--ok)'; toast(`${currentTicker} added to your watchlist.`); }
}
function switchRschTabByName(name){
  const i=RSCH_TAB_NAMES.indexOf(name);
  if(i>=0) setTimeout(()=>switchRschTab(i),60);
}
function renderResearch(ticker){
  const d=COMPANIES[ticker];
  if(!d) return;
  setMascotState('researching',`Pulling research on ${d.ticker}…`);
  document.getElementById('rschNameBlock').innerHTML=`<div class="rsch-name-block">${d.name}</div><div class="rsch-name-sub">${d.ticker} · ${d.sector} · CMP ${d.cmp} <span style="color:${d.up?'var(--ok)':'var(--bad)'}">${d.chg}</span></div>`;
  document.getElementById('rschTabs').innerHTML = RSCH_TAB_NAMES.map((t,i)=>`<div class="rsch-tab ${i===0?'active':''}" data-i="${i}" onclick="switchRschTab(${i})">${t}</div>`).join('');
  const panes=[paneOverview(d),paneFinancials(d),paneManagement(d),paneGrowth(d),paneRatios(d),paneRisk(d),paneSWOT(d),paneBCG(d),paneNews(d),panePeers(d)];
  document.getElementById('rschPanes').innerHTML = panes.map((html,i)=>`<div class="rsch-pane ${i===0?'active':''}" id="rsch-${i}">${html}</div>`).join('');
  attachTechTabHandlers();
  const btn=document.getElementById('watchlistBtn');
  if(watchlist.has(ticker)){ btn.textContent='✓ In Watchlist'; btn.style.color='var(--ok)'; } else { btn.textContent='⭐ Add to Watchlist'; btn.style.color='var(--gold)'; }
  setTimeout(()=>setMascotState('success',`Research summary ready for ${d.ticker}.`),550);
}
function switchRschTab(i){
  document.querySelectorAll('#rschTabs .rsch-tab').forEach((el,idx)=>el.classList.toggle('active',idx===i));
  document.querySelectorAll('.rsch-pane').forEach((el,idx)=>el.classList.toggle('active',idx===i));
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
      <div class="ind-row"><span>Sector</span><span>${d.sector}</span></div><div class="ind-row"><span>Market Cap</span><span>${d.mcap}</span></div><div class="ind-row"><span>P/E (TTM)</span><span>${d.pe}</span></div><div class="ind-row"><span>CMP</span><span>${d.cmp}</span></div>
      <div style="margin-top:10px;font-size:11.5px;color:var(--text2);line-height:1.6">${d.overview.business}</div></div>
    <div class="card"><div class="card-title">Price Chart</div>
      <div class="tf-tabs">${['1D','1W','1M','3M','1Y','3Y','MAX'].map((tf,i)=>`<div class="tf-tab ${i===4?'active':''}">${tf}</div>`).join('')}</div>
      <div class="tech-mini-chart">📈 Illustrative price chart — ${d.cmp}</div>
      <div class="ind-row"><span>Support</span><span style="color:var(--ok);font-weight:700">${d.technical.support}</span></div><div class="ind-row"><span>Resistance</span><span style="color:var(--bad);font-weight:700">${d.technical.resistance}</span></div></div>
    <div class="card"><div class="card-title">Marketo Research Scores</div>
      ${scoreBarRow('Business Quality',d.scores.quality)}${scoreBarRow('Growth Score',d.scores.growth)}${scoreBarRow('Financial Health',d.scores.health)}${scoreBarRow('Management',d.scores.management)}${scoreBarRow('Risk Score',d.scores.risk,true)}
      <div class="overall-score-band"><span style="font-size:11px;color:var(--text2)">Overall Research Score</span><b>${Math.round((d.scores.quality+d.scores.growth+d.scores.health+d.scores.management+(100-d.scores.risk))/5)}/100</b></div></div>
    <div class="card"><div class="card-title">Segment Mix & Market Position</div><ul class="bullet-list">${d.overview.segments.map(s=>`<li>${s}</li>`).join('')}</ul><div style="margin-top:10px;font-size:11.5px;color:var(--text2);line-height:1.6">${d.overview.marketShare}</div></div>
  </div>`;
}
function paneFinancials(d){
  return `<div class="grid g2">
    <div class="card"><div class="card-title">Quarterly P&L (₹ Cr)</div><table class="fin-tbl"><thead><tr><th>Quarter</th><th>Revenue</th><th>Net Profit</th><th>Margin</th></tr></thead><tbody>${d.financials.quarters.map(q=>`<tr><td>${q.q}</td><td>${q.rev.toLocaleString('en-IN')}</td><td>${q.profit.toLocaleString('en-IN')}</td><td>${q.margin}%</td></tr>`).join('')}</tbody></table></div>
    <div class="card"><div class="card-title">Annual P&L (₹ Cr)</div><table class="fin-tbl"><thead><tr><th>Year</th><th>Revenue</th><th>Net Profit</th></tr></thead><tbody>${d.financials.annual.map(a=>`<tr><td>${a.y}</td><td>${a.rev.toLocaleString('en-IN')}</td><td>${a.profit.toLocaleString('en-IN')}</td></tr>`).join('')}</tbody></table></div>
    <div class="card span2"><div class="card-title">Balance Sheet Snapshot</div><div class="grid g3"><div class="ind-row"><span>Cash / AUM</span><span>${d.financials.balanceSheet.cash}</span></div><div class="ind-row"><span>Borrowings</span><span>${d.financials.balanceSheet.borrowings}</span></div><div class="ind-row"><span>Net Worth</span><span>${d.financials.balanceSheet.networth}</span></div></div></div>
  </div>`;
}
function paneManagement(d){
  return `<div class="grid g2">
    <div class="card"><div class="card-title">CEO Intelligence</div><div class="ceo-mini"><div class="ceo-mini-avatar" style="width:52px;height:52px;font-size:16px">${d.logo}</div><div><div class="ceo-mini-name" style="font-size:13.5px">${d.management.ceo}</div></div></div><div style="font-size:11.5px;color:var(--text2);line-height:1.6">${d.management.vision}</div></div>
    <div class="card"><div class="card-title">Leadership Team</div><ul class="bullet-list">${d.management.team.map(t=>`<li>${t}</li>`).join('')}</ul><div class="card-title" style="margin-top:14px">Earnings Call Commentary</div><div style="font-size:11.5px;color:var(--text2);line-height:1.6">${d.management.commentary}</div></div>
  </div>`;
}
function paneGrowth(d){
  return `<div class="grid g2"><div class="card"><div class="card-title">Growth Intelligence</div><ul class="bullet-list">${d.growth.items.map(g=>`<li>${g}</li>`).join('')}</ul></div><div class="card"><div class="card-title">Capex Outlook</div><div style="font-size:11.5px;color:var(--text2);line-height:1.6">${d.growth.capex}</div></div></div>`;
}
function paneRatios(d){
  return `<div class="grid g2"><div class="card"><div class="card-title">Key Ratios</div><div class="ind-row"><span>ROE</span><span style="font-weight:700">${d.financials.ratios.roe}</span></div><div class="ind-row"><span>ROCE</span><span style="font-weight:700">${d.financials.ratios.roce}</span></div><div class="ind-row"><span>Debt Position</span><span style="font-weight:700">${d.financials.ratios.debt}</span></div><div class="ind-row"><span>Net Margin</span><span style="font-weight:700">${d.financials.ratios.margin}</span></div></div><div class="card"><div class="card-title">Cash Conversion</div><div style="font-size:11.5px;color:var(--text2);line-height:1.6">${d.financials.ratios.cashConv}</div></div></div>`;
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
    <div class="card"><div class="card-title">BCG Matrix Positioning</div><div class="bcg-matrix-mini"><div class="bcg-quad-mini" style="top:0;left:0">⭐ Stars</div><div class="bcg-quad-mini" style="top:0;left:50%">❓ Question Marks</div><div class="bcg-quad-mini" style="top:50%;left:0">🐄 Cash Cows</div><div class="bcg-quad-mini" style="top:50%;left:50%">🐕 Dogs</div><div class="bcg-dot-mini" style="left:${x}%;top:${y}%" title="${d.ticker}"></div></div><div class="bcg-axis-label"><span>← Low Market Share</span><span>High →</span></div></div>
    <div class="card"><div class="card-title">Positioning: ${d.bcg.quadrant}</div><div style="font-size:11.5px;color:var(--text2);line-height:1.6">${d.bcg.note}</div><div class="ind-row" style="margin-top:10px"><span>Market Growth Indicator</span><span style="font-weight:700">${d.bcg.marketGrowth}/100</span></div><div class="ind-row"><span>Relative Market Share</span><span style="font-weight:700">${d.bcg.relativeShare}/100</span></div></div>
  </div>`;
}
function paneNews(d){
  return `<div class="card">${d.news.map(n=>`<div class="news-row"><div class="news-row-t"><b style="color:var(--cyan);font-weight:700">${n.tag}</b> — ${n.t}</div><div class="news-row-time">${n.time}</div></div>`).join('')}</div>`;
}
function panePeers(d){
  const peers=SCREENER_UNIVERSE.filter(s=>s.n!==d.ticker).slice(0,5);
  return `<div class="card"><div class="card-title">Peer Comparison</div><table class="stbl"><thead><tr><th>Company</th><th>PE</th><th>ROE%</th><th>Quality</th><th>Growth</th></tr></thead><tbody>${peers.map(p=>`<tr><td style="cursor:pointer;color:var(--cyan)" onclick="searchTicker('${p.n}')">${p.n}</td><td>${p.pe}x</td><td>${p.roe}%</td><td><span class="score-chip" style="color:${scoreColor(p.quality)}">${p.quality}</span></td><td><span class="score-chip" style="color:${scoreColor(p.growth)}">${p.growth}</span></td></tr>`).join('')}</tbody></table></div>`;
}
function attachTechTabHandlers(){
  document.querySelectorAll('.tf-tabs').forEach(group=>{
    group.querySelectorAll('.tf-tab').forEach(tab=>{ tab.onclick=()=>{ group.querySelectorAll('.tf-tab').forEach(t=>t.classList.remove('active')); tab.classList.add('active'); }; });
  });
}

/* ---------------------------------------------------------------
   PAGE 3 — OPPORTUNITY DASHBOARD
--------------------------------------------------------------- */
function opportunityPageHTML(){
  return `
  <div class="pg-head"><div><span class="pg-eyebrow">Opportunity Dashboard</span><div class="pg-title">⚡ Find Companies Matching Criteria</div><div class="pg-sub">Screen, scan, and explore the research universe</div></div></div>
  <div class="disclaimer-strip"><b>Research observations only.</b> No trading signals. Filters surface companies by fundamental and technical characteristics for further research.</div>

  <div class="scanner-tabs" id="scannerTabs"></div>
  <div class="card" id="scannerBody" style="margin-bottom:18px"></div>

  <div style="font-family:var(--fd);font-size:15px;font-weight:700;margin-bottom:12px">🧭 Opportunity Finder™</div>
  <div class="grid g4" style="margin-bottom:8px" id="oppFinderGrid"></div>
  <div id="oppGroupBody" style="margin-bottom:22px"></div>

  <div class="grid g4" style="margin-bottom:14px;align-items:start">
    <div class="card span2">
      <div class="card-title">AI Screener — Custom Filters</div>
      <div class="filter-row"><div style="flex:1"><div class="flabel">PE Ratio</div><input class="finput" id="fPE" type="number" placeholder="< 40"></div><div style="flex:1"><div class="flabel">ROE %</div><input class="finput" id="fROE" type="number" placeholder="> 15"></div></div>
      <div class="filter-row"><div style="flex:1"><div class="flabel">Revenue Growth %</div><input class="finput" id="fRevG" type="number" placeholder="> 10"></div><div style="flex:1"><div class="flabel">Profit Growth %</div><input class="finput" id="fProfitG" type="number" placeholder="> 10"></div></div>
      <div class="filter-row"><div style="flex:1"><div class="flabel">Promoter Holding %</div><input class="finput" id="fProm" type="number" placeholder="> 50"></div><div style="flex:1"><div class="flabel">FII Holding %</div><input class="finput" id="fFII" type="number" placeholder="> 10"></div></div>
      <button class="btn-tag" onclick="runScreen()" style="width:100%;text-align:center;margin-top:4px">Run Screener</button>
      <div style="text-align:center;font-size:11px;color:var(--text2);margin-top:8px" id="screenerResultsLabel"></div>
    </div>
    <div class="card span2">
      <div class="card-title">Technical Lab</div>
      <div style="display:flex;gap:8px;margin-bottom:8px"><select class="finput" id="techIndicator" onchange="renderTechChart()"><option>RSI</option><option>MACD</option><option>ADX</option><option>Supertrend</option></select><select class="finput" id="techTimeframe" onchange="renderTechChart()"><option>1D</option><option>1W</option><option>1M</option><option>1Y</option></select></div>
      <div class="tech-mini-chart" id="techChartBox">📈 Illustrative — select an indicator above</div>
      <div style="text-align:center"><span class="card-link" onclick="goPage('research')">Open Research Dashboard →</span></div>
    </div>
  </div>

  <div class="card" id="screenerTable">
    <div class="card-title">Screening Results <span class="card-link" id="rCount"></span></div>
    <div class="tbl-scroll"><table class="stbl"><thead><tr>
      <th onclick="sortTable('n')">Company</th><th onclick="sortTable('pe')">PE</th><th onclick="sortTable('roe')">ROE%</th><th onclick="sortTable('revG')">Rev Gr%</th><th onclick="sortTable('divY')">Div Y%</th>
      <th onclick="sortTable('quality')">Quality</th><th onclick="sortTable('growth')">Growth</th><th onclick="sortTable('health')">Health</th><th onclick="sortTable('risk')">Risk</th>
    </tr></thead><tbody id="screenBody"></tbody></table></div>
  </div>
  `;
}
function renderOppFinder(){
  document.getElementById('oppFinderGrid').innerHTML = Object.keys(THEME_SCANNERS).map(k=>{
    const g=THEME_SCANNERS[k];
    return `<div class="opp-pill" onclick="filterByTheme('${k}')"><div class="opp-pill-name">${g.label}</div><div class="opp-pill-count">${g.tickers.length} Stocks</div></div>`;
  }).join('');
}
function filterByTheme(k){
  const g=THEME_SCANNERS[k];
  screenerResults = SCREENER_UNIVERSE.filter(s=>g.tickers.includes(s.n));
  renderScreener(screenerResults);
  toast(g.note);
  document.getElementById('screenerTable').scrollIntoView({behavior:'smooth'});
}
function renderTopOpp(){ /* reserved for future ranked widget if needed */ }
const SCANNER_TABS=[
  {id:'breakout',label:'Breakout Scanner',data:()=>SCANNER_BREAKOUT,cols:['Company','Price','Change','Note']},
  {id:'volume',label:'Volume Surge',data:()=>SCANNER_VOLUME_SURGE,cols:['Company','Price','Vol Ratio','Note']},
  {id:'52wk',label:'52-Week High',data:()=>SCANNER_52WK_HIGH,cols:['Company','Price','From High','Note']},
  {id:'momentum',label:'Momentum Scanner',data:()=>SCANNER_MOMENTUM,cols:['Company','Price','RSI','Note']}
];
function renderScanner(tabId){
  activeScannerTab=tabId;
  document.getElementById('scannerTabs').innerHTML = SCANNER_TABS.map(t=>`<div class="scanner-tab-btn ${t.id===tabId?'active':''}" onclick="renderScanner('${t.id}')">${t.label}</div>`).join('');
  const tab=SCANNER_TABS.find(t=>t.id===tabId);
  const rows=tab.data();
  const valKey = tabId==='breakout' ? 'chg' : tabId==='volume' ? 'volRatio' : tabId==='52wk' ? 'pctFromHigh' : 'rsi';
  document.getElementById('scannerBody').innerHTML = `<div class="card-title">${tab.label}</div>` + rows.map(r=>`
    <div class="scanner-row">
      <div><div class="scanner-row-name" onclick="searchTicker('${r.n}')">${r.n}</div><div class="scanner-row-note">${r.note}</div></div>
      <div style="text-align:right"><div style="font-weight:700">${r.price}</div><div style="font-size:10.5px;color:var(--ok)">${r[valKey]}</div></div>
    </div>`).join('');
}
function renderScreener(rows){
  document.getElementById('rCount').textContent = `${rows.length} results found`;
  document.getElementById('screenerResultsLabel').textContent = `${rows.length} Results Found`;
  document.getElementById('screenBody').innerHTML = rows.map(s=>`<tr>
    <td style="font-weight:700;cursor:pointer;color:var(--cyan)" onclick="searchTicker('${s.n}')">${s.n}<div style="font-size:9px;color:var(--muted);font-weight:400">${s.s}</div></td>
    <td>${s.pe}x</td><td style="color:${s.roe>=20?'var(--ok)':'var(--text)'}">${s.roe}%</td><td style="color:${s.revG>=15?'var(--ok)':'var(--text)'}">${s.revG}%</td><td>${s.divY}%</td>
    <td><span class="score-chip" style="color:${scoreColor(s.quality)}">${s.quality}</span></td><td><span class="score-chip" style="color:${scoreColor(s.growth)}">${s.growth}</span></td><td><span class="score-chip" style="color:${scoreColor(s.health)}">${s.health}</span></td>
    <td><span class="score-chip" style="color:${s.risk<=30?'#00D084':s.risk<=45?'#FFB020':'#FF4D5E'}">${s.risk}</span></td>
  </tr>`).join('');
}
function runScreen(){
  const v=id=>parseFloat(document.getElementById(id).value);
  const maxPE=v('fPE')||999, minROE=v('fROE')||0, minRevG=v('fRevG')||0, minProfitG=v('fProfitG')||0, minProm=v('fProm')||0, minFII=v('fFII')||0;
  screenerResults = SCREENER_UNIVERSE.filter(s=>s.pe<=maxPE && s.roe>=minROE && s.revG>=minRevG && s.profitG>=minProfitG && (typeof s.promHold==='number'?s.promHold:0)>=minProm && s.fiiHold>=minFII);
  renderScreener(screenerResults);
  setMascotState('analyzing',`${screenerResults.length} companies match your filters.`);
  document.getElementById('screenerTable').scrollIntoView({behavior:'smooth'});
}
function sortTable(key){
  if(sortKey===key) sortDir*=-1; else { sortKey=key; sortDir=1; }
  screenerResults.sort((a,b)=>{ if(typeof a[key]==='string') return a[key].localeCompare(b[key])*sortDir; return ((a[key]||0)-(b[key]||0))*sortDir; });
  renderScreener(screenerResults);
}
function renderTechChart(){
  const ind=document.getElementById('techIndicator').value, tf=document.getElementById('techTimeframe').value;
  document.getElementById('techChartBox').textContent = `📈 ${ind} (${tf}) — illustrative reading for ${currentTicker}`;
}

/* ---------------------------------------------------------------
   MARKETO BRAIN™ CHAT (own page)
--------------------------------------------------------------- */
let chatHistory=[{role:'ai',text:"Hi, I'm <b>MARKETO Brain™</b>. Ask me to research a company — e.g. \"Analyze INDIAMART\" or \"Compare TCS vs HDFCBANK\" — and I'll pull together an overview, financial trend, management notes, SWOT, BCG positioning and risk read. I provide research, not investment advice."}];
function brainPageHTML(){
  return `
  <div class="pg-head"><div><span class="pg-eyebrow">MARKETO Brain™</span><div class="pg-title">🧠 Your Research Assistant</div><div class="pg-sub">Ask about any covered company, sector, or research concept</div></div></div>
  <div class="card chat-window">
    <div class="chat-msgs" id="chatMsgs"></div>
    <div class="chat-suggest" id="chatSuggest"></div>
    <div style="display:flex;gap:8px"><input class="rsch-search-input" id="chatInput" placeholder="Ask Marketo Brain™ to analyze a company…" onkeydown="if(event.key==='Enter')sendChat()"><button class="btn-tag" onclick="sendChat()">Send</button></div>
  </div>`;
}
function renderChatSuggest(){
  const chips=['Analyze INDIAMART','Compare TCS vs HDFCBANK','Explain SBILIFE risk profile','What is a BCG Matrix?'];
  document.getElementById('chatSuggest').innerHTML = chips.map(c=>`<div class="chat-chip" onclick="sendChip('${c}')">${c}</div>`).join('');
}
function renderChat(){
  const el=document.getElementById('chatMsgs');
  if(!el) return;
  el.innerHTML = chatHistory.map(m=>`<div class="chat-msg ${m.role==='user'?'user':'ai'}">${m.text}</div>`).join('');
  el.scrollTop=el.scrollHeight;
}
function sendChip(text){ document.getElementById('chatInput').value=text; sendChat(); }
function sendChat(){
  const input=document.getElementById('chatInput');
  const text=input.value.trim();
  if(!text) return;
  chatHistory.push({role:'user',text});
  renderChat(); input.value='';
  setMascotState('thinking');
  setTimeout(()=>{ chatHistory.push({role:'ai',text:brainRespond(text)}); renderChat(); setMascotState('success'); },600);
}
function brainRespond(q){
  const upper=q.toUpperCase();
  const found=Object.keys(COMPANIES).find(t=>upper.includes(t));
  if(found){
    const d=COMPANIES[found];
    return `<b>${d.name} — Research Summary</b><br><br><b>Overview:</b> ${d.overview.business}<br><br><b>Financial Trend:</b> ROE stands at ${d.financials.ratios.roe} with ${d.financials.ratios.debt.toLowerCase()}.<br><br><b>Management:</b> ${d.management.vision}<br><br><b>Scores:</b> Quality ${d.scores.quality} · Growth ${d.scores.growth} · Health ${d.scores.health} · Management ${d.scores.management} · Risk ${d.scores.risk}<br><br><i>Research summary only, not investment advice.</i> <span style="color:var(--cyan);cursor:pointer" onclick="searchTicker('${found}')">Open ${found} →</span>`;
  }
  if(upper.includes('COMPARE')){
    const tickers=Object.keys(COMPANIES).filter(t=>upper.includes(t));
    if(tickers.length>=2){ const [a,b]=tickers, da=COMPANIES[a], db=COMPANIES[b];
      return `<b>${a} vs ${b}</b><br><br>Quality: ${da.scores.quality} vs ${db.scores.quality}<br>Growth: ${da.scores.growth} vs ${db.scores.growth}<br>Health: ${da.scores.health} vs ${db.scores.health}<br>Risk: ${da.scores.risk} vs ${db.scores.risk}<br><br><i>Comparison reflects research scores only.</i>`; }
  }
  if(upper.includes('BCG')) return `The BCG Matrix classifies a business by relative market share (x-axis) and market growth (y-axis) into four quadrants: <b>Stars</b>, <b>Cash Cows</b>, <b>Question Marks</b>, and <b>Dogs</b>. Each covered company has a BCG tab in its Research Dashboard.`;
  if(upper.includes('RISK')) return `I evaluate risk across five dimensions: promoter, debt, competition, sector, and execution risk. Try "Explain [TICKER] risk profile" for INDIAMART, RELIANCE, TCS, HDFCBANK, or SBILIFE.`;
  return `I can research INDIAMART, RELIANCE, TCS, HDFCBANK, or SBILIFE — try "Analyze [company]", "Compare [A] vs [B]", or ask about SWOT or BCG Matrix.`;
}

/* ---------------------------------------------------------------
   NEWS INTELLIGENCE (own page)
--------------------------------------------------------------- */
function newsPageHTML(){
  return `<div class="pg-head"><div><span class="pg-eyebrow">News Intelligence</span><div class="pg-title">📰 Market News Feed</div><div class="pg-sub">Breaking news, results, corporate actions, and flow data</div></div></div>
  <div class="disclaimer-strip"><b>Research Only.</b> Summaries explain what happened and possible impact — not investment advice.</div>
  <div class="card" id="newsFeedRoot"></div>`;
}
function renderNewsFeed(){
  const root=document.getElementById('newsFeedRoot');
  const catColor={Breaking:'var(--bad)',Results:'var(--ok)','FII/DII':'var(--cyan)','Corporate Actions':'var(--gold)',Sector:'var(--cyan)','Government Policy':'var(--warn)','Bulk Deals':'var(--muted)'};
  root.innerHTML = NEWS_FEED.map(n=>`<div class="news-row"><div class="news-row-t"><b style="color:${catColor[n.cat]}">${n.cat}</b> — ${n.t} <span style="color:var(--muted)">(Impact: ${n.impact}, ${n.sentiment})</span></div><div class="news-row-time">${n.time}</div></div>`).join('');
}

/* ---------------------------------------------------------------
   GLOBAL SEARCH
--------------------------------------------------------------- */
const SEARCHABLE=[
  ...Object.values(COMPANIES).map(c=>({type:'Company',label:c.ticker,meta:c.name,action:()=>{searchTicker(c.ticker);}})),
  {type:'Sector',label:'IT Services',meta:'TCS, WIPRO, ZENTEC',action:()=>goPage('opportunity')},
  {type:'Sector',label:'Insurance',meta:'SBILIFE, HDFCLIFE, ICICIGI',action:()=>goPage('opportunity')},
  {type:'Sector',label:'Banking',meta:'HDFCBANK',action:()=>goPage('opportunity')},
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
  safeInit('renderMascot', renderMascot);
  safeInit('renderTicker', renderTicker);
  safeInit('setupGlobalSearch', setupGlobalSearch);
  safeInit('goPage', ()=>goPage('exec'));
  safeInit('renderExecDashboard', renderExecDashboard);
});
function safeInit(label, fn){
  try{ fn(); }
  catch(e){ console.error('[MARKETO AI init error] '+label+':', e); }
}
