/* =====================================================================
   MARKETO RUPEE™ — Premium AI Agent Mascot
   Body silhouette IS the ₹ glyph. Glass faceplate + neon eyes.
   Holographic platform base with rotating data ring.
   States: idle, thinking, analyzing, researching, alert, success
===================================================================== */
function rupeeMascotSVG(state){
  state = state || 'idle';

  // Ring speed / orbit content varies by state
  const ringClass = (state==='thinking') ? 'm-ring-fast' : 'm-ring-slow';
  const showChartOrbit = state==='analyzing';
  const showDocOrbit = state==='researching';
  const alertPulse = state==='alert';
  const successGlow = state==='success';
  const glowColor = alertPulse ? '#F5B700' : successGlow ? '#00D084' : '#00C2FF';

  // particle field — small dots with staggered float
  let particles = '';
  const pPos = [[18,40],[124,36],[10,90],[132,96],[26,16],[110,18]];
  pPos.forEach((p,i)=>{
    particles += `<circle cx="${p[0]}" cy="${p[1]}" r="1.4" fill="${glowColor}" opacity=".55" class="m-particle" style="animation-delay:${i*0.4}s"/>`;
  });

  // orbiting mini bar-chart glyphs (analyzing state)
  let chartOrbit = '';
  if(showChartOrbit){
    chartOrbit = `<g class="m-orbit-ring">
      <g transform="translate(70,8)"><rect x="-5" y="-2" width="2.4" height="8" fill="#00D084"/><rect x="-1.5" y="-5" width="2.4" height="11" fill="#00C2FF"/><rect x="2" y="-3.5" width="2.4" height="9.5" fill="#F5B700"/></g>
      <g transform="translate(108,90) rotate(120)"><rect x="-5" y="-2" width="2.4" height="8" fill="#00D084"/><rect x="-1.5" y="-5" width="2.4" height="11" fill="#00C2FF"/><rect x="2" y="-3.5" width="2.4" height="9.5" fill="#F5B700"/></g>
      <g transform="translate(32,90) rotate(240)"><rect x="-5" y="-2" width="2.4" height="8" fill="#00D084"/><rect x="-1.5" y="-5" width="2.4" height="11" fill="#00C2FF"/><rect x="2" y="-3.5" width="2.4" height="9.5" fill="#F5B700"/></g>
    </g>`;
  }
  // orbiting document glyphs (researching state)
  let docOrbit = '';
  if(showDocOrbit){
    docOrbit = `<g class="m-orbit-ring">
      <g transform="translate(70,6)"><rect x="-5" y="-6" width="10" height="13" rx="1.5" fill="none" stroke="#00C2FF" stroke-width="1.3"/><line x1="-2.5" y1="-2.5" x2="2.5" y2="-2.5" stroke="#00C2FF" stroke-width="1"/><line x1="-2.5" y1="0.5" x2="2.5" y2="0.5" stroke="#00C2FF" stroke-width="1"/><line x1="-2.5" y1="3.5" x2="1" y2="3.5" stroke="#00C2FF" stroke-width="1"/></g>
      <g transform="translate(110,92) rotate(130)"><rect x="-5" y="-6" width="10" height="13" rx="1.5" fill="none" stroke="#F5B700" stroke-width="1.3"/><line x1="-2.5" y1="-2.5" x2="2.5" y2="-2.5" stroke="#F5B700" stroke-width="1"/><line x1="-2.5" y1="0.5" x2="2.5" y2="0.5" stroke="#F5B700" stroke-width="1"/></g>
      <g transform="translate(30,92) rotate(250)"><rect x="-5" y="-6" width="10" height="13" rx="1.5" fill="none" stroke="#00D084" stroke-width="1.3"/><line x1="-2.5" y1="-2.5" x2="2.5" y2="-2.5" stroke="#00D084" stroke-width="1"/><line x1="-2.5" y1="0.5" x2="2.5" y2="0.5" stroke="#00D084" stroke-width="1"/></g>
    </g>`;
  }
  // success chevrons rising (placed clear of the glyph body, to the right)
  let chevrons = '';
  if(successGlow){
    chevrons = `<g class="m-chevron-group">
      <path d="M98 95 l7 -7 l7 7" stroke="#00D084" stroke-width="2.2" fill="none" stroke-linecap="round" class="m-chevron" style="animation-delay:0s"/>
      <path d="M98 105 l7 -7 l7 7" stroke="#00D084" stroke-width="2.2" fill="none" stroke-linecap="round" class="m-chevron" style="animation-delay:.35s"/>
      <path d="M98 115 l7 -7 l7 7" stroke="#00D084" stroke-width="2.2" fill="none" stroke-linecap="round" class="m-chevron" style="animation-delay:.7s"/>
    </g>`;
  }

  // data ring ticks (rotates around base platform, faster when thinking)
  let ticks = '';
  for(let i=0;i<16;i++){
    const ang = (i/16)*360;
    ticks += `<line x1="0" y1="-44" x2="0" y2="-39" stroke="${glowColor}" stroke-width="1.4" opacity="${i%4===0?0.9:0.35}" transform="rotate(${ang})"/>`;
  }

  return `<svg viewBox="0 0 140 170" xmlns="http://www.w3.org/2000/svg" class="rupee-mascot-svg ${alertPulse?'m-alert':''}">
    <defs>
      <radialGradient id="bodyGrad-${state}" cx="50%" cy="32%" r="70%">
        <stop offset="0%" stop-color="#FFF1C2"/>
        <stop offset="45%" stop-color="#F5B700"/>
        <stop offset="100%" stop-color="#9C6B00"/>
      </radialGradient>
      <radialGradient id="glow-${state}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${glowColor}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="glass-${state}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#BFEFFF" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0A2A40" stop-opacity="0.15"/>
      </linearGradient>
    </defs>

    <!-- ambient glow field -->
    <circle cx="70" cy="62" r="58" fill="url(#glow-${state})" class="${alertPulse?'m-glow-pulse':''}"/>

    <!-- particle field -->
    ${particles}

    <!-- holographic base platform -->
    <ellipse cx="70" cy="150" rx="46" ry="9" fill="none" stroke="${glowColor}" stroke-width="1.2" opacity="0.55"/>
    <ellipse cx="70" cy="150" rx="34" ry="6" fill="${glowColor}" opacity="0.08"/>
    <g class="${ringClass}" style="transform-origin:70px 150px">
      <g transform="translate(70,150)">${ticks}</g>
    </g>

    <!-- main floating body group -->
    <g class="m-float">

      <!-- orbiting context glyphs (analyzing / researching) -->
      ${chartOrbit}${docOrbit}

      <!-- dashed orbit ring around head -->
      <ellipse cx="70" cy="55" rx="40" ry="40" fill="none" stroke="${glowColor}" stroke-width="1" stroke-dasharray="2 5" opacity="0.45" class="m-orbit-spin" style="transform-origin:70px 55px"/>

      <!-- ₹ GLYPH BODY (the silhouette itself) -->
      <g>
        <path d="M48 28 H92 a6 6 0 0 1 0 12 H66 v9 h20 a6 6 0 0 1 0 12 H66 l28 33 a3 3 0 0 1 -2.4 4.8 H80 a4 4 0 0 1 -3.1 -1.5 L52 64 H48 v-12 h12 v-9 H48 a6 6 0 0 1 0 -12 z"
          fill="url(#bodyGrad-${state})" stroke="#7A5200" stroke-width="0.6"/>
      </g>

      <!-- glass faceplate over upper torso -->
      <rect x="50" y="34" width="40" height="22" rx="8" fill="url(#glass-${state})" stroke="${glowColor}" stroke-width="1" opacity="0.9"/>

      <!-- AI eyes -->
      <circle cx="61" cy="45" r="3.6" fill="#04101C"/>
      <circle cx="79" cy="45" r="3.6" fill="#04101C"/>
      <circle cx="61" cy="45" r="3.6" fill="none" stroke="${glowColor}" stroke-width="1"/>
      <circle cx="79" cy="45" r="3.6" fill="none" stroke="${glowColor}" stroke-width="1"/>
      <circle cx="62.3" cy="43.7" r="1.3" fill="#E8FBFF" class="m-eye-flicker"/>
      <circle cx="80.3" cy="43.7" r="1.3" fill="#E8FBFF" class="m-eye-flicker"/>

      <!-- floating energy core (chest) -->
      <circle cx="70" cy="64" r="4" fill="${glowColor}" opacity="0.85" class="m-core-pulse"/>
      <circle cx="70" cy="64" r="7" fill="none" stroke="${glowColor}" stroke-width="0.8" opacity="0.4" class="m-core-pulse"/>
    </g>

    ${chevrons}
  </svg>`;
}
