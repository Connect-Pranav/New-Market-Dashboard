const COMPANIES = {
INDIAMART:{
  ticker:'INDIAMART',name:"IndiaMART InterMESH Ltd",sector:'Internet / B2B Marketplace',
  cmp:'₹2,840',chg:'+1.4%',up:true,mcap:'₹34,200 Cr',pe:'34.2x',logo:'IM',color:'#00C2FF',
  overview:{
    business:"India's largest online B2B marketplace connecting buyers and suppliers across industrial, electronics, apparel and services categories.",
    products:['Marketplace Subscriptions (Silver/Gold/Platinum)','Payment & Logistics Add-ons','Pay-per-lead Listings'],
    segments:['Industrial Machinery 28%','Electronics & Electrical 19%','Apparel & Textiles 14%','Building & Construction 12%','Others 27%'],
    geography:'Pan-India, 97% domestic revenue; early-stage exports facilitation pilot.',
    marketShare:'Category leader in B2B online classifieds with an estimated 60%+ share of organized online B2B listings in India.'
  },
  financials:{
    quarters:[{q:'Q1 FY26',rev:611,profit:142,margin:23.2},{q:'Q4 FY25',rev:582,profit:128,margin:22.0},{q:'Q3 FY25',rev:565,profit:119,margin:21.1},{q:'Q2 FY25',rev:548,profit:108,margin:19.7}],
    annual:[{y:'FY25',rev:2206,profit:478},{y:'FY24',rev:1196,profit:236},{y:'FY23',rev:1099,profit:191}],
    ratios:{roe:'24.6%',roce:'29.1%',debt:'Near-zero',margin:'22.1%',cashConv:'High — subscription model, deferred revenue cushion'},
    balanceSheet:{cash:'₹2,150 Cr',borrowings:'₹0 Cr',networth:'₹2,640 Cr'}
  },
  management:{
    ceo:'Dinesh Agarwal (Co-founder, MD & Group CEO)',
    team:['Brijesh Agrawal — Co-founder & Director','Anil Saini — CFO'],
    vision:'Management commentary emphasizes deepening paid supplier penetration, cross-sell of payment/logistics services, and AI-assisted lead matching to improve buyer-supplier conversion.',
    commentary:'Recent earnings calls highlight steady ARPU growth, improving collection efficiency, and continued investment in trust & safety tooling to reduce spam leads.'
  },
  growth:{items:['Expansion of value-added services (payments, logistics) attached to core subscriptions','Pilot programs for export-oriented supplier discovery','Continued investment in AI-based lead scoring and buyer intent matching','Selective tuck-in acquisitions in adjacent B2B tech'],capex:'Asset-light model; capex limited to technology infrastructure and data centers.'},
  risk:{promoter:'Low — professionally managed, founder-led with stable holding pattern.',debt:'Minimal — net cash balance sheet.',competition:'Moderate — competition from vertical-specific marketplaces and direct social-commerce channels.',sector:'Linked to MSME demand cycles and overall industrial activity.',execution:'Dependent on sustaining supplier renewal rates and controlling lead-quality complaints.'},
  swot:{
    s:['Dominant brand recall in Indian B2B search','High operating leverage, asset-light model','Strong net-cash balance sheet','Sticky subscription base with multi-year tenures'],
    w:['Revenue concentration in subscription renewals','Lead-quality complaints from smaller suppliers','Limited international diversification'],
    o:['Cross-sell payments & logistics to existing base','AI-driven matching to raise conversion and ARPU','MSME digitization tailwinds in India'],
    t:['Emergence of low-cost vertical marketplaces','Social commerce platforms disintermediating discovery','Macro slowdown affecting MSME ad spend']
  },
  bcg:{quadrant:'Star',marketGrowth:78,relativeShare:72,note:'High share in a growing online B2B discovery market; reinvestment-heavy but cash generative.'},
  news:[{t:'IndiaMART reports steady subscriber additions in Q1 FY26 update',time:'2h ago',tag:'Results'},{t:'Company highlights AI lead-scoring rollout in investor note',time:'1d ago',tag:'Corporate'},{t:'Analyst note flags ARPU trend as key monitorable for FY26',time:'3d ago',tag:'Coverage'}],
  scores:{quality:82,growth:71,health:88,management:78,risk:24},
  technical:{rsi:58,trend:'Above 50 & 200 DMA',support:'₹2,680',resistance:'₹2,960'}
},
RELIANCE:{
  ticker:'RELIANCE',name:'Reliance Industries Ltd',sector:'Conglomerate — Energy, Retail, Telecom',
  cmp:'₹1,293',chg:'-0.8%',up:false,mcap:'₹17,48,000 Cr',pe:'24.1x',logo:'RI',color:'#00D084',
  overview:{
    business:'Diversified conglomerate spanning hydrocarbons & petrochemicals (O2C), digital services (Jio), and organized retail (Reliance Retail).',
    products:['Refining & Petrochemicals','Jio Telecom & Digital Services','Reliance Retail (grocery, fashion, electronics)','New Energy (solar, hydrogen — early stage)'],
    segments:['O2C 42%','Retail 23%','Digital Services (Jio) 18%','Oil & Gas 5%','Others 12%'],
    geography:'Predominantly India; O2C exports to Asia, Europe, and the Americas.',
    marketShare:'Largest private sector company in India by revenue; market leader in telecom subscriber base and organized retail GMV.'
  },
  financials:{
    quarters:[{q:'Q1 FY26',rev:255000,profit:19200,margin:7.5},{q:'Q4 FY25',rev:248000,profit:18400,margin:7.4},{q:'Q3 FY25',rev:241000,profit:17600,margin:7.3},{q:'Q2 FY25',rev:236000,profit:16900,margin:7.2}],
    annual:[{y:'FY25',rev:964000,profit:73500},{y:'FY24',rev:902000,profit:69600},{y:'FY23',rev:876000,profit:66700}],
    ratios:{roe:'9.8%',roce:'11.2%',debt:'Net debt/EBITDA ~0.6x',margin:'7.4%',cashConv:'Moderate — capex-heavy across segments'},
    balanceSheet:{cash:'₹1,92,000 Cr (consolidated)',borrowings:'₹3,11,000 Cr gross',networth:'₹8,90,000 Cr'}
  },
  management:{
    ceo:'Mukesh Ambani (Chairman & Managing Director)',
    team:['Isha Ambani — Director, Retail','Akash Ambani — Chairman, Jio Platforms','Nikhil Meswani — Executive Director, O2C'],
    vision:'Management commentary continues to emphasize the three-pillar growth strategy: O2C cash generation funding Jio and Retail scale-up, alongside new energy investments.',
    commentary:'Recent earnings calls flag steady ARPU improvement in Jio post tariff revisions, retail footprint rationalization, and continued progress on the Jamnagar new-energy giga complex.'
  },
  growth:{items:['New energy giga-factories (solar, battery, hydrogen) under phased commissioning','Jio 5G monetization and FWA (fixed wireless access) scale-up','Retail format rationalization and quick-commerce push (Reliance Retail)','Potential listing/value-unlocking discussions for Jio and Retail entities'],capex:'Among the highest capex programs in corporate India, concentrated in new energy and digital infrastructure.'},
  risk:{promoter:'Low concentration risk — but high promoter influence on capital allocation decisions.',debt:'Elevated gross debt funding capex cycle; serviceability supported by O2C and Jio cash flows.',competition:'High in telecom (Airtel, Vi) and retail (Amazon, Flipkart, DMart); moderate in O2C given scale advantages.',sector:'Exposed to global refining margins and crude price volatility.',execution:'New energy project timelines and retail format profitability are key monitorables.'},
  swot:{
    s:['Scale and vertical integration across O2C','Largest telecom subscriber base via Jio','Extensive organized retail footprint','Strong access to capital markets'],
    w:['High consolidated debt load','Retail segment margins still maturing','Capital intensity ties up cash for multi-year payback'],
    o:['New energy transition (solar, hydrogen, batteries)','Jio 5G enterprise & FWA monetization','Potential value unlocking via subsidiary listings'],
    t:['Global refining margin volatility','Intensifying telecom tariff competition','Regulatory shifts in retail/e-commerce FDI norms']
  },
  bcg:{quadrant:'Cash Cow (O2C) / Star (Jio, Retail)',marketGrowth:54,relativeShare:81,note:'O2C generates stable cash; Jio and Retail are higher-growth segments still scaling share.'},
  news:[{t:'Reliance updates progress on new energy giga complex commissioning',time:'5h ago',tag:'Corporate'},{t:'Jio ARPU trend watched closely ahead of Q2 update',time:'1d ago',tag:'Coverage'},{t:'Retail segment store rationalization continues per filings',time:'2d ago',tag:'Corporate'}],
  scores:{quality:74,growth:68,health:64,management:79,risk:46},
  technical:{rsi:46,trend:'Consolidating near 50 DMA',support:'₹1,250',resistance:'₹1,350'}
},
TCS:{
  ticker:'TCS',name:'Tata Consultancy Services Ltd',sector:'IT Services',
  cmp:'₹3,541',chg:'+0.8%',up:true,mcap:'₹12,82,000 Cr',pe:'30.1x',logo:'TC',color:'#A855F7',
  overview:{
    business:'Global IT services, consulting and business solutions provider serving BFSI, retail, manufacturing, and technology clients across 50+ countries.',
    products:['IT Application & Maintenance Services','Consulting & Enterprise Solutions','BPO Services','TCS BaNCS, ignio, and other proprietary platforms'],
    segments:['BFSI 30%','Retail & CPG 15%','Manufacturing 9%','Technology & Services 9%','Communications & Media 7%','Others 30%'],
    geography:'North America 50%, Europe 28%, India & Rest of World 22%.',
    marketShare:'Largest India-based IT services exporter by revenue; among the top global IT services players by market capitalization.'
  },
  financials:{
    quarters:[{q:'Q1 FY26',rev:62500,profit:12700,margin:20.3},{q:'Q4 FY25',rev:61200,profit:12300,margin:20.1},{q:'Q3 FY25',rev:60100,profit:12100,margin:20.1},{q:'Q2 FY25',rev:59400,profit:11900,margin:20.0}],
    annual:[{y:'FY25',rev:240900,profit:48100},{y:'FY24',rev:225500,profit:46100},{y:'FY23',rev:225500,profit:42100}],
    ratios:{roe:'48.2%',roce:'52.4%',debt:'Net cash position',margin:'20.1%',cashConv:'Very High — asset-light services model'},
    balanceSheet:{cash:'₹52,800 Cr',borrowings:'₹3,200 Cr (lease liabilities)',networth:'₹99,400 Cr'}
  },
  management:{
    ceo:'K Krithivasan (CEO & Managing Director)',
    team:['N Ganapathy Subramaniam — COO','Samir Seksaria — CFO'],
    vision:'Management commentary centers on AI-led transformation deals, deal pipeline strength, and disciplined margin management amid discretionary spending softness.',
    commentary:'Recent earnings calls flag steady deal TCV, cautious commentary on discretionary tech spend in BFSI, and continued investment in GenAI tooling for clients.'
  },
  growth:{items:['Scaling GenAI-led service offerings and proprietary AI platforms','Expansion in continental Europe and Middle East geographies','Deepening BFSI and Retail vertical platforms (BaNCS, Optumera)','Selective tuck-in acquisitions in niche digital engineering'],capex:'Low capex intensity; primary investment is in talent, campuses, and platform IP.'},
  risk:{promoter:'Low — Tata Sons promoter group with long-term stable holding.',debt:'Negligible — net cash balance sheet.',competition:'High — competes with Infosys, Accenture, Cognizant and emerging GenAI-native firms.',sector:'Exposed to discretionary IT spending cycles in US/Europe and currency movements.',execution:'Talent attrition management and large-deal ramp-up timelines are key monitorables.'},
  swot:{
    s:['Largest and most diversified client base among Indian IT majors','Strong balance sheet with net cash','High employee retention relative to peers','Deep vertical domain platforms (BaNCS, ignio)'],
    w:['Revenue growth more muted versus mid-cap IT peers','High dependency on BFSI vertical','Wage inflation pressure on margins'],
    o:['GenAI-led transformation deal pipeline','Vendor consolidation favoring scaled players','Expansion in continental Europe enterprise accounts'],
    t:['Discretionary spend slowdown in key geographies','Currency volatility (USD/INR, GBP/INR)','Visa & immigration policy shifts in US/UK']
  },
  bcg:{quadrant:'Cash Cow',marketGrowth:38,relativeShare:86,note:'Market leader in a maturing IT services market; high cash generation, moderate growth.'},
  news:[{t:'TCS wins large multi-year European banking technology deal',time:'4h ago',tag:'Corporate'},{t:'Management commentary flags cautious BFSI discretionary spend',time:'1d ago',tag:'Coverage'},{t:'Company expands GenAI delivery centre footprint',time:'3d ago',tag:'Corporate'}],
  scores:{quality:88,growth:58,health:91,management:84,risk:20},
  technical:{rsi:58,trend:'Above 50 & 200 DMA',support:'₹3,420',resistance:'₹3,640'}
},
HDFCBANK:{
  ticker:'HDFCBANK',name:'HDFC Bank Ltd',sector:'Private Sector Banking',
  cmp:'₹772',chg:'-0.3%',up:false,mcap:'₹11,86,000 Cr',pe:'18.4x',logo:'HB',color:'#FFB020',
  overview:{
    business:'Largest private sector bank in India by assets, offering retail, wholesale, and digital banking services post-merger with HDFC Ltd.',
    products:['Retail Deposits & Loans','Corporate & Wholesale Banking','Credit Cards & Payments','Treasury & Wealth Management'],
    segments:['Retail Banking 48%','Wholesale Banking 33%','Treasury 12%','Other Banking 7%'],
    geography:'Pan-India branch network with 8,800+ branches; limited international presence via select overseas branches.',
    marketShare:'Largest private bank by balance sheet size; among top 3 banks overall in India by deposits and advances.'
  },
  financials:{
    quarters:[{q:'Q1 FY26',rev:75200,profit:16500,margin:21.9},{q:'Q4 FY25',rev:73900,profit:16100,margin:21.8},{q:'Q3 FY25',rev:72500,profit:16700,margin:23.0},{q:'Q2 FY25',rev:71100,profit:16200,margin:22.8}],
    annual:[{y:'FY25',rev:292700,profit:65400},{y:'FY24',rev:264600,profit:60800},{y:'FY23',rev:177300,profit:44100}],
    ratios:{roe:'14.8%',roce:'N/A — Banking entity',debt:'N/A — Banking entity',margin:'22.4% (NIM-adjusted)',cashConv:'High — deposit-funded balance sheet'},
    balanceSheet:{cash:'Statutory reserves per RBI norms',borrowings:'Deposits + borrowings ₹26,80,000 Cr',networth:'₹3,86,000 Cr'}
  },
  management:{
    ceo:'Sashidhar Jagdishan (MD & CEO)',
    team:['Kaizad Bharucha — Deputy MD','Srinivasan Vaidyanathan — CFO'],
    vision:'Management commentary focuses on normalizing the loan-to-deposit ratio post HDFC Ltd merger and steadily rebuilding deposit market share.',
    commentary:'Recent earnings calls highlight progress on branch expansion in semi-urban markets, deposit mobilization momentum, and asset quality stability.'
  },
  growth:{items:['Branch network expansion targeting semi-urban and rural markets','Cross-sell of mortgage products following HDFC Ltd merger integration','Scaling digital banking and payments platform','Continued investment in retail liability franchise'],capex:'Moderate — branch network expansion and technology infrastructure investment.'},
  risk:{promoter:'N/A — widely held institution, no single promoter group.',debt:'N/A — banking entity; monitored via capital adequacy and asset quality instead.',competition:'High — competes with ICICI Bank, Axis Bank, Kotak Mahindra Bank, and SBI.',sector:'Exposed to interest rate cycles, credit growth trends, and regulatory capital norms.',execution:'Post-merger loan-to-deposit ratio normalization and cost synergy realization are key monitorables.'},
  swot:{
    s:['Largest private bank deposit franchise','Strong asset quality track record','Wide branch and digital distribution network','Diversified loan book post HDFC Ltd merger'],
    w:['Elevated loan-to-deposit ratio post-merger','Margin pressure during integration phase','Slower branch productivity ramp-up in new geographies'],
    o:['Cross-sell mortgage and wealth products to expanded base','Deepen semi-urban and rural deposit franchise','Digital lending and payments expansion'],
    t:['Rising deposit competition compressing margins','Asset quality sensitivity to macro credit cycles','Regulatory changes in capital and provisioning norms']
  },
  bcg:{quadrant:'Star',marketGrowth:61,relativeShare:74,note:'Leading position in a still-growing private banking market, with integration-related reinvestment needs.'},
  news:[{t:'HDFC Bank reports steady deposit growth in quarterly update',time:'6h ago',tag:'Results'},{t:'Management reiterates loan-to-deposit normalization timeline',time:'1d ago',tag:'Coverage'},{t:'Bank expands branch network in semi-urban markets',time:'4d ago',tag:'Corporate'}],
  scores:{quality:85,growth:62,health:80,management:82,risk:30},
  technical:{rsi:49,trend:'Range-bound near 50 DMA',support:'₹740',resistance:'₹810'}
},
SBILIFE:{
  ticker:'SBILIFE',name:'SBI Life Insurance Company Ltd',sector:'Life Insurance',
  cmp:'₹1,706',chg:'+3.1%',up:true,mcap:'₹1,70,800 Cr',pe:'72.3x',logo:'SL',color:'#00C2FF',
  overview:{
    business:'Life insurance provider offering protection, savings, and pension products, distributed via SBI bancassurance, agency, and digital channels.',
    products:['Protection Plans (Term)','ULIPs','Savings & Endowment Plans','Group & Pension Products'],
    segments:['Bancassurance (SBI) 55%','Agency Channel 24%','Direct & Digital 12%','Other Channels 9%'],
    geography:'Pan-India, leveraging the State Bank of India branch network for distribution reach.',
    marketShare:'Among the top 3 private life insurers in India by new business premium.'
  },
  financials:{
    quarters:[{q:'Q1 FY26',rev:18400,profit:980,margin:5.3},{q:'Q4 FY25',rev:21200,profit:1120,margin:5.3},{q:'Q3 FY25',rev:17800,profit:940,margin:5.3},{q:'Q2 FY25',rev:16900,profit:890,margin:5.3}],
    annual:[{y:'FY25',rev:74500,profit:3850},{y:'FY24',rev:67200,profit:3460},{y:'FY23',rev:60100,profit:3170}],
    ratios:{roe:'15.2%',roce:'N/A — Insurance entity',debt:'N/A — Insurance entity',margin:'VNB margin 28.1%',cashConv:'High — float-based insurance economics'},
    balanceSheet:{cash:'AUM ₹4,15,000 Cr',borrowings:'N/A',networth:'₹13,200 Cr'}
  },
  management:{
    ceo:'Amit Jhingran (MD & CEO)',
    team:['Manish Kumar — Deputy CEO','Rohini Gade — CFO'],
    vision:'Management commentary emphasizes protection-mix improvement, agency channel productivity, and maintaining industry-leading VNB margins.',
    commentary:'Recent earnings calls highlight steady growth in individual new business premium and continued bancassurance channel strength via SBI.'
  },
  growth:{items:['Deepening protection product mix to improve VNB margin further','Expanding agency channel productivity initiatives','Scaling digital-first term and savings product distribution','Leveraging SBI YONO platform for cross-sell'],capex:'Low — insurance distribution and technology platform investment.'},
  risk:{promoter:'Low — State Bank of India remains anchor promoter with stable holding.',debt:'N/A — insurance entity; monitored via solvency ratio instead.',competition:'High — competes with HDFC Life, ICICI Prudential Life, and Max Life.',sector:'Exposed to interest rate cycles affecting ULIP demand and persistency trends.',execution:'Sustaining bancassurance productivity and persistency ratios are key monitorables.'},
  swot:{
    s:['Industry-leading VNB margins','Strong bancassurance access via SBI network','Diversified product mix across protection and savings','Consistent persistency ratio improvement'],
    w:['High revenue dependency on SBI bancassurance channel','Valuation trades at a premium versus some peers','ULIP segment sensitive to equity market sentiment'],
    o:['Cross-sell via SBI YONO digital platform','Rising protection awareness post-pandemic','Agency channel productivity upside'],
    t:['Regulatory changes in commission and surrender value norms','Interest rate volatility affecting savings product demand','Intensifying competition from bank-promoted peers']
  },
  bcg:{quadrant:'Star',marketGrowth:69,relativeShare:66,note:'High-margin player in a structurally growing life insurance market, scaling protection mix.'},
  news:[{t:'SBI Life reports VNB margin near record levels for the quarter',time:'3h ago',tag:'Results'},{t:'Company highlights protection mix improvement in investor call',time:'1d ago',tag:'Coverage'},{t:'Bancassurance channel productivity flagged as key driver',time:'5d ago',tag:'Corporate'}],
  scores:{quality:80,growth:74,health:76,management:81,risk:34},
  technical:{rsi:64,trend:'Above 50 & 200 DMA',support:'₹1,610',resistance:'₹1,790'}
}
};

const SCREENER_UNIVERSE=[
  {n:'ITC',s:'FMCG',pe:28,roe:28,roce:32,revG:9.2,profitG:11.4,divY:3.2,promHold:0,fiiHold:14.8,quality:84,growth:54,health:90,mgmt:80,risk:18},
  {n:'POLYCAB',s:'Cables & Wires',pe:34,roe:22,roce:26,revG:18.6,profitG:22.1,divY:0.6,promHold:67.4,fiiHold:18.2,quality:79,growth:78,health:81,mgmt:75,risk:32},
  {n:'SIEMENS',s:'Capital Goods',pe:62,roe:18,roce:22,revG:14.2,profitG:16.8,divY:0.8,promHold:75.0,fiiHold:9.4,quality:74,growth:62,health:78,mgmt:77,risk:28},
  {n:'TORNTPOWER',s:'Power',pe:24,roe:16,roce:14,revG:11.4,profitG:9.8,divY:1.1,promHold:72.3,fiiHold:11.6,quality:68,growth:51,health:64,mgmt:70,risk:38},
  {n:'TRIVENI',s:'Water Treatment',pe:38,roe:24,roce:28,revG:24.1,profitG:28.4,divY:0.4,promHold:53.8,fiiHold:7.2,quality:77,growth:86,health:74,mgmt:72,risk:36},
  {n:'SBILIFE',s:'Insurance',pe:72,roe:15,roce:0,revG:10.9,profitG:11.3,divY:0.4,promHold:55.4,fiiHold:24.1,quality:80,growth:74,health:76,mgmt:81,risk:34},
  {n:'ICICIGI',s:'Insurance',pe:38,roe:18,roce:0,revG:13.2,profitG:14.6,divY:0.7,promHold:48.0,fiiHold:21.4,quality:81,growth:69,health:79,mgmt:78,risk:30},
  {n:'HDFCLIFE',s:'Insurance',pe:82,roe:14,roce:0,revG:9.8,profitG:8.4,divY:0.3,promHold:50.4,fiiHold:27.8,quality:72,growth:58,health:70,mgmt:74,risk:40},
  {n:'WIPRO',s:'IT Services',pe:26,roe:17,roce:19,revG:3.4,profitG:4.1,divY:1.2,promHold:72.9,fiiHold:6.8,quality:66,growth:38,health:75,mgmt:68,risk:34},
  {n:'TCS',s:'IT Services',pe:30,roe:48,roce:52,revG:6.8,profitG:8.1,divY:1.5,promHold:71.8,fiiHold:13.2,quality:88,growth:58,health:91,mgmt:84,risk:20},
  {n:'SHRIRAMFIN',s:'NBFC',pe:14,roe:16,roce:14,revG:16.4,profitG:18.2,divY:1.4,promHold:25.4,fiiHold:48.6,quality:75,growth:71,health:68,mgmt:73,risk:44},
  {n:'ZENTEC',s:'IT Services',pe:18,roe:22,roce:24,revG:21.2,profitG:24.6,divY:0.8,promHold:39.2,fiiHold:11.4,quality:78,growth:82,health:77,mgmt:71,risk:42},
  {n:'VGUARD',s:'Consumer Durables',pe:40,roe:18,roce:20,revG:12.8,profitG:14.1,divY:0.5,promHold:48.9,fiiHold:14.6,quality:70,growth:64,health:72,mgmt:69,risk:34},
  {n:'TATVA',s:'Specialty Chemicals',pe:44,roe:20,roce:18,revG:17.9,profitG:19.4,divY:0.3,promHold:46.8,fiiHold:9.8,quality:74,growth:79,health:69,mgmt:70,risk:46},
  {n:'GICRE',s:'Reinsurance',pe:12,roe:14,roce:0,revG:6.4,profitG:7.8,divY:2.8,promHold:85.8,fiiHold:4.2,quality:71,growth:42,health:73,mgmt:68,risk:36},
  {n:'HYUNDAI',s:'Automobiles',pe:22,roe:24,roce:28,revG:9.6,profitG:12.4,divY:1.0,promHold:82.5,fiiHold:8.6,quality:76,growth:61,health:79,mgmt:75,risk:30},
  {n:'VINDHYATEL',s:'Telecom Equipment',pe:16,roe:28,roce:32,revG:26.4,profitG:31.2,divY:0.6,promHold:31.4,fiiHold:6.2,quality:82,growth:91,health:80,mgmt:74,risk:48},
  {n:'TIPSFILMS',s:'Media',pe:18,roe:22,roce:24,revG:19.8,profitG:23.4,divY:0.9,promHold:42.6,fiiHold:13.8,quality:74,growth:80,health:75,mgmt:70,risk:44},
  {n:'PATANJALI',s:'FMCG',pe:46,roe:22,roce:20,revG:14.6,profitG:16.2,divY:0.4,promHold:42.6,fiiHold:5.4,quality:71,growth:68,health:71,mgmt:66,risk:42},
  {n:'NAVNETEDUL',s:'Education',pe:22,roe:26,roce:28,revG:8.4,profitG:9.6,divY:1.8,promHold:71.2,fiiHold:3.4,quality:73,growth:48,health:78,mgmt:72,risk:32},
  {n:'INDIAMART',s:'Internet/B2B',pe:34,roe:25,roce:29,revG:18.4,profitG:23.6,divY:1.1,promHold:43.6,fiiHold:32.8,quality:82,growth:71,health:88,mgmt:78,risk:24},
  {n:'RELIANCE',s:'Conglomerate',pe:24,roe:10,roce:11,revG:6.8,profitG:5.6,divY:0.4,promHold:50.3,fiiHold:22.4,quality:74,growth:68,health:64,mgmt:79,risk:46},
  {n:'HDFCBANK',s:'Banking',pe:18,roe:15,roce:0,revG:10.6,profitG:7.6,divY:1.2,promHold:0,fiiHold:48.2,quality:85,growth:62,health:80,mgmt:82,risk:30}
];

const OPPORTUNITY_GROUPS={
  highGrowth:{label:'High Growth Companies',tickers:['VINDHYATEL','TRIVENI','ZENTEC','TATVA','TIPSFILMS'],note:'Companies showing the strongest revenue and profit growth trajectories in the current screening universe.'},
  value:{label:'Value Companies',tickers:['GICRE','SHRIRAMFIN','HYUNDAI','TCS'],note:'Companies trading at relatively modest valuation multiples versus their profitability profile.'},
  momentum:{label:'Momentum Companies',tickers:['VINDHYATEL','POLYCAB','SBILIFE','INDIAMART'],note:'Companies exhibiting strong recent price and earnings momentum relative to sector peers.'},
  turnaround:{label:'Turnaround Stories',tickers:['TORNTPOWER','WIPRO','PATANJALI'],note:'Companies showing early signs of operational improvement after a period of softer performance.'},
  sectorLeaders:{label:'Sector Leaders',tickers:['TCS','HDFCBANK','ITC','INDIAMART','SBILIFE'],note:'Companies holding the leading competitive position within their respective sectors.'}
};

const NEWS_FEED=[
  {cat:'Breaking',t:'RBI holds repo rate at 6.50%, maintains neutral stance',time:'15m ago',impact:'Market-wide',sentiment:'Neutral'},
  {cat:'Results',t:'TCS wins large multi-year European banking technology deal',time:'2h ago',impact:'TCS, IT Sector',sentiment:'Positive'},
  {cat:'FII/DII',t:'FII inflows hit ₹3,842 Cr — largest single-day buying since March',time:'2h ago',impact:'Market-wide',sentiment:'Positive'},
  {cat:'Corporate Actions',t:'SBI Life VNB margins approach record levels, near 28%',time:'3h ago',impact:'SBILIFE, Insurance',sentiment:'Positive'},
  {cat:'Sector',t:'IndiaMART highlights AI lead-scoring rollout in investor note',time:'1d ago',impact:'INDIAMART',sentiment:'Positive'},
  {cat:'Government Policy',t:'Government extends PLI scheme benefits for select manufacturing categories',time:'1d ago',impact:'Manufacturing, Capital Goods',sentiment:'Positive'},
  {cat:'Bulk Deals',t:'Large block deal reported in HDFC Bank shares on NSE',time:'2d ago',impact:'HDFCBANK',sentiment:'Neutral'},
  {cat:'Results',t:'Reliance updates progress on new energy giga complex commissioning',time:'2d ago',impact:'RELIANCE',sentiment:'Neutral'}
];

const TV_CHANNELS=[
  {id:'cnbc',name:'CNBC TV18',sub:'Business News • Live Markets',color:'#FF4D5E',headline:'Nifty holds above 24,800; buying seen in Banking & IT'},
  {id:'etnow',name:'ET Now',sub:'Markets & Economy',color:'#00C2FF',headline:'FII flows turn positive for third straight session'},
  {id:'ndtv',name:'NDTV Profit',sub:'Business Television',color:'#F5B700',headline:'Sector rotation into financials picks up pace'},
  {id:'bloom',name:'Bloomberg TV',sub:'Global Markets',color:'#1A1A1A',headline:'Asian markets track Wall Street gains overnight'},
  {id:'yahoo',name:'Yahoo Finance',sub:'Markets Live',color:'#7B0099',headline:'Global investors watch central bank commentary this week'}
];

let currentTicker='INDIAMART';
let currentChannel='cnbc';