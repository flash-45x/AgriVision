// High-reliability agricultural and botanical SVG and Photo assets for AgriVision
// These guaranteed data URIs prevent 404 broken images while providing realistic agricultural visuals.

export const TOMATO_LEAF_BLIGHT_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#143621"/>
      <stop offset="100%" stop-color="#0a1f13"/>
    </linearGradient>
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#40916c"/>
      <stop offset="50%" stop-color="#2d6a4f"/>
      <stop offset="100%" stop-color="#1b4332"/>
    </linearGradient>
    <radialGradient id="blightSpot1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="35%" stop-color="#78350f"/>
      <stop offset="65%" stop-color="#b45309"/>
      <stop offset="85%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#2d6a4f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blightSpot2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3b1302"/>
      <stop offset="40%" stop-color="#78350f"/>
      <stop offset="70%" stop-color="#ca8a04"/>
      <stop offset="90%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#2d6a4f" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="2" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Background Soil/Foliage field -->
  <rect width="600" height="400" fill="url(#bgGrad)"/>
  
  <!-- Subtle background blur leaf silhouettes -->
  <path d="M 50,350 Q 120,200 280,180 Q 200,320 50,350" fill="#1b4332" opacity="0.4"/>
  <path d="M 550,50 Q 480,220 320,250 Q 420,100 550,50" fill="#2d6a4f" opacity="0.3"/>

  <!-- Main Tomato Leaf Structure (Serrated Leaflets) -->
  <g filter="url(#shadow)">
    <!-- Main stem -->
    <path d="M 120,380 Q 260,250 480,100" stroke="#74c69d" stroke-width="8" fill="none" stroke-linecap="round"/>
    
    <!-- Central Leaflet -->
    <path d="M 480,100 Q 420,40 330,70 Q 300,100 270,120 Q 350,160 410,140 Q 460,130 480,100 Z" fill="url(#leafGrad)"/>
    <!-- Left Leaflet -->
    <path d="M 330,190 Q 240,130 160,160 Q 140,210 180,250 Q 250,260 330,220 Z" fill="url(#leafGrad)"/>
    <!-- Right Leaflet -->
    <path d="M 380,150 Q 470,180 520,260 Q 470,300 400,270 Q 360,230 380,150 Z" fill="url(#leafGrad)"/>
    <!-- Bottom Left Leaflet -->
    <path d="M 230,280 Q 150,270 100,340 Q 160,370 240,320 Z" fill="url(#leafGrad)"/>

    <!-- Vein Lines -->
    <!-- Center Veins -->
    <path d="M 330,70 Q 370,110 480,100" stroke="#74c69d" stroke-width="3" fill="none" opacity="0.8"/>
    <path d="M 360,95 Q 390,75 420,70" stroke="#74c69d" stroke-width="1.8" fill="none" opacity="0.7"/>
    <path d="M 390,110 Q 430,125 450,130" stroke="#74c69d" stroke-width="1.8" fill="none" opacity="0.7"/>
    
    <!-- Left Leaflet Veins -->
    <path d="M 280,210 Q 200,190 160,160" stroke="#74c69d" stroke-width="3" fill="none" opacity="0.8"/>
    <path d="M 240,200 Q 210,160 180,160" stroke="#74c69d" stroke-width="1.8" fill="none" opacity="0.7"/>
    <path d="M 250,205 Q 210,235 180,250" stroke="#74c69d" stroke-width="1.8" fill="none" opacity="0.7"/>

    <!-- Right Leaflet Veins -->
    <path d="M 370,180 Q 440,220 520,260" stroke="#74c69d" stroke-width="3" fill="none" opacity="0.8"/>
    <path d="M 410,205 Q 460,190 490,195" stroke="#74c69d" stroke-width="1.8" fill="none" opacity="0.7"/>
    <path d="M 440,220 Q 440,270 410,270" stroke="#74c69d" stroke-width="1.8" fill="none" opacity="0.7"/>
  </g>

  <!-- Early Blight Pathological Lesions (Concentric Bullseye Target Spots + Chlorotic Yellow Halo) -->
  
  <!-- Lesion 1 (Large Bullseye on Right Leaflet) -->
  <circle cx="440" cy="235" r="48" fill="url(#blightSpot1)"/>
  <!-- Concentric fungal rings -->
  <circle cx="440" cy="235" r="28" stroke="#451a03" stroke-width="2" fill="none" opacity="0.8"/>
  <circle cx="440" cy="235" r="18" stroke="#78350f" stroke-width="2.5" fill="none" opacity="0.9"/>
  <circle cx="440" cy="235" r="8" fill="#290e02"/>

  <!-- Lesion 2 (Bullseye on Center Leaflet) -->
  <circle cx="370" cy="115" r="40" fill="url(#blightSpot2)"/>
  <circle cx="370" cy="115" r="22" stroke="#451a03" stroke-width="2" fill="none" opacity="0.8"/>
  <circle cx="370" cy="115" r="12" stroke="#78350f" stroke-width="2" fill="none" opacity="0.9"/>
  <circle cx="370" cy="115" r="5" fill="#290e02"/>

  <!-- Lesion 3 (Spreading spot on Left Leaflet) -->
  <circle cx="210" cy="205" r="36" fill="url(#blightSpot1)"/>
  <circle cx="210" cy="205" r="20" stroke="#451a03" stroke-width="1.8" fill="none" opacity="0.75"/>
  <circle cx="210" cy="205" r="10" stroke="#78350f" stroke-width="2" fill="none" opacity="0.85"/>
  <circle cx="210" cy="205" r="4" fill="#290e02"/>

  <!-- Secondary Smaller Necrotic Spots -->
  <circle cx="310" cy="140" r="16" fill="url(#blightSpot2)"/>
  <circle cx="170" cy="225" r="14" fill="url(#blightSpot1)"/>
  <circle cx="475" cy="190" r="18" fill="url(#blightSpot2)"/>
  <circle cx="410" cy="135" r="12" fill="url(#blightSpot1)"/>

  <!-- Leaf Tip Yellowing / Necrosis Edge -->
  <path d="M 460,100 Q 480,100 480,115 Q 465,120 455,108 Z" fill="#ca8a04"/>
  <path d="M 505,250 Q 520,260 515,275 Q 495,265 505,250 Z" fill="#a16207"/>

  <!-- Diagnosis Diagnostic Tag Overlay -->
  <g transform="translate(20, 20)">
    <rect width="185" height="32" rx="10" fill="#000000" fill-opacity="0.75" stroke="#eab308" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="5" fill="#ef4444"/>
    <text x="30" y="21" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="900">Tomato Leaf Blight</text>
  </g>
</svg>
`)}`;

export const POWDERY_MILDEW_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgCucurbit" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#132a13"/>
      <stop offset="100%" stop-color="#061208"/>
    </linearGradient>
    <linearGradient id="cucurbitLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2d6a4f"/>
      <stop offset="50%" stop-color="#1b4332"/>
      <stop offset="100%" stop-color="#081c15"/>
    </linearGradient>
    <radialGradient id="mildewPatch1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#f1f5f9" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#cbd5e1" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#2d6a4f" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="mildewPatch2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#e2e8f0" stop-opacity="0.6"/>
      <stop offset="85%" stop-color="#94a3b8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#1b4332" stop-opacity="0"/>
    </radialGradient>
    <filter id="leafShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="3" dy="5" stdDeviation="8" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="600" height="400" fill="url(#bgCucurbit)"/>

  <!-- Broad Cucurbit / Pea Leaf Geometry -->
  <g filter="url(#leafShadow)">
    <path d="M 300,360 Q 140,340 80,240 Q 60,130 180,70 Q 250,50 300,100 Q 350,50 420,70 Q 540,130 520,240 Q 460,340 300,360 Z" fill="url(#cucurbitLeaf)"/>
    
    <!-- Prominent Palmate Veins -->
    <path d="M 300,360 Q 300,220 300,100" stroke="#74c69d" stroke-width="6" fill="none" opacity="0.8"/>
    <path d="M 300,280 Q 200,200 120,160" stroke="#52b788" stroke-width="4.5" fill="none" opacity="0.75"/>
    <path d="M 300,280 Q 400,200 480,160" stroke="#52b788" stroke-width="4.5" fill="none" opacity="0.75"/>
    <path d="M 300,240 Q 180,260 100,240" stroke="#52b788" stroke-width="3.5" fill="none" opacity="0.7"/>
    <path d="M 300,240 Q 420,260 500,240" stroke="#52b788" stroke-width="3.5" fill="none" opacity="0.7"/>
    <path d="M 300,200 Q 230,120 180,70" stroke="#52b788" stroke-width="3.5" fill="none" opacity="0.7"/>
    <path d="M 300,200 Q 370,120 420,70" stroke="#52b788" stroke-width="3.5" fill="none" opacity="0.7"/>
  </g>

  <!-- White Powdery Mildew Fungal Colonies (Talcum-like Coating) -->
  <ellipse cx="230" cy="180" rx="65" ry="50" fill="url(#mildewPatch1)"/>
  <ellipse cx="380" cy="160" rx="75" ry="60" fill="url(#mildewPatch1)"/>
  <ellipse cx="300" cy="240" rx="55" ry="45" fill="url(#mildewPatch2)"/>
  <ellipse cx="160" cy="230" rx="45" ry="35" fill="url(#mildewPatch2)"/>
  <ellipse cx="440" cy="230" rx="50" ry="40" fill="url(#mildewPatch1)"/>
  <ellipse cx="260" cy="110" rx="40" ry="30" fill="url(#mildewPatch2)"/>
  <ellipse cx="350" cy="90" rx="35" ry="25" fill="url(#mildewPatch1)"/>
  <ellipse cx="460" cy="140" rx="35" ry="30" fill="url(#mildewPatch2)"/>

  <!-- Powder Grain Texture -->
  <g fill="#ffffff" opacity="0.7">
    <circle cx="220" cy="170" r="2.5"/><circle cx="240" cy="190" r="1.8"/><circle cx="210" cy="195" r="2"/>
    <circle cx="370" cy="150" r="2.5"/><circle cx="395" cy="170" r="2"/><circle cx="360" cy="175" r="1.5"/>
    <circle cx="430" cy="220" r="2.2"/><circle cx="450" cy="240" r="1.8"/><circle cx="290" cy="250" r="2"/>
  </g>

  <!-- Diagnosis Diagnostic Tag Overlay -->
  <g transform="translate(20, 20)">
    <rect width="180" height="32" rx="10" fill="#000000" fill-opacity="0.75" stroke="#f1f5f9" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="5" fill="#f59e0b"/>
    <text x="30" y="21" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="900">Powdery Mildew</text>
  </g>
</svg>
`)}`;

export const HEALTHY_WHEAT_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="60%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="wheatStalkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#15803d"/>
      <stop offset="70%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#86efac"/>
    </linearGradient>
    <linearGradient id="wheatHeadGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#16a34a"/>
      <stop offset="50%" stop-color="#84cc16"/>
      <stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
  </defs>

  <!-- Sunny Agricultural Sky & Golden Glow -->
  <rect width="600" height="400" fill="url(#skyGrad)"/>
  
  <!-- Sun Ray Highlights -->
  <circle cx="520" cy="80" r="90" fill="#fef08a" opacity="0.4"/>
  <circle cx="520" cy="80" r="50" fill="#ffffff" opacity="0.7"/>

  <!-- Field Background Layer (Lush wheat field) -->
  <path d="M 0,220 Q 150,210 300,230 Q 450,210 600,220 L 600,400 L 0,400 Z" fill="#15803d" opacity="0.5"/>
  <path d="M 0,250 Q 200,240 400,260 Q 500,240 600,250 L 600,400 L 0,400 Z" fill="#166534" opacity="0.7"/>

  <!-- Foreground Crisp Wheat Stalks & Heads -->
  
  <!-- Stalk 1 (Left Center) -->
  <g transform="translate(180, 50)">
    <path d="M 20,350 Q 10,200 20,100" stroke="url(#wheatStalkGrad)" stroke-width="7" fill="none"/>
    <!-- Blade Leaves -->
    <path d="M 18,220 Q -60,180 -100,210 Q -40,190 18,235 Z" fill="#22c55e"/>
    <path d="M 18,170 Q 90,120 140,150 Q 70,140 18,185 Z" fill="#16a34a"/>
    <!-- Wheat Spikelet Head -->
    <g transform="translate(15, 20)">
      <path d="M 5,90 Q -8,50 5,0 Q 18,50 5,90 Z" fill="url(#wheatHeadGrad)"/>
      <!-- Awns (Beards) -->
      <line x1="5" y1="10" x2="-25" y2="-40" stroke="#ca8a04" stroke-width="1.8"/>
      <line x1="5" y1="20" x2="35" y2="-35" stroke="#ca8a04" stroke-width="1.8"/>
      <line x1="5" y1="35" x2="-30" y2="-15" stroke="#ca8a04" stroke-width="1.8"/>
      <line x1="5" y1="50" x2="40" y2="5" stroke="#ca8a04" stroke-width="1.8"/>
      <line x1="5" y1="0" x2="5" y2="-60" stroke="#eab308" stroke-width="2"/>
    </g>
  </g>

  <!-- Stalk 2 (Center Hero) -->
  <g transform="translate(300, 30)">
    <path d="M 10,370 Q 0,180 10,80" stroke="url(#wheatStalkGrad)" stroke-width="8" fill="none"/>
    <!-- Leaves -->
    <path d="M 10,240 Q 100,180 160,220 Q 80,200 10,255 Z" fill="#22c55e"/>
    <path d="M 10,180 Q -80,130 -120,160 Q -50,145 10,195 Z" fill="#16a34a"/>
    <!-- Wheat Head -->
    <g transform="translate(5, 10)">
      <path d="M 5,100 Q -10,50 5,0 Q 20,50 5,100 Z" fill="url(#wheatHeadGrad)"/>
      <!-- Awns -->
      <line x1="5" y1="5" x2="5" y2="-70" stroke="#facc15" stroke-width="2.2"/>
      <line x1="5" y1="15" x2="-35" y2="-45" stroke="#ca8a04" stroke-width="2"/>
      <line x1="5" y1="25" x2="45" y2="-40" stroke="#ca8a04" stroke-width="2"/>
      <line x1="5" y1="45" x2="-40" y2="-10" stroke="#ca8a04" stroke-width="2"/>
      <line x1="5" y1="60" x2="50" y2="10" stroke="#ca8a04" stroke-width="2"/>
    </g>
  </g>

  <!-- Stalk 3 (Right) -->
  <g transform="translate(420, 70)">
    <path d="M 10,330 Q 20,180 10,90" stroke="url(#wheatStalkGrad)" stroke-width="7" fill="none"/>
    <path d="M 10,210 Q -60,170 -100,200 Q -40,180 10,225 Z" fill="#22c55e"/>
    <!-- Head -->
    <g transform="translate(5, 25)">
      <path d="M 5,85 Q -8,45 5,0 Q 18,45 5,85 Z" fill="url(#wheatHeadGrad)"/>
      <line x1="5" y1="5" x2="10" y2="-55" stroke="#eab308" stroke-width="2"/>
      <line x1="5" y1="20" x2="-25" y2="-30" stroke="#ca8a04" stroke-width="1.8"/>
      <line x1="5" y1="35" x2="35" y2="-20" stroke="#ca8a04" stroke-width="1.8"/>
    </g>
  </g>

  <!-- Diagnosis Diagnostic Tag Overlay -->
  <g transform="translate(20, 20)">
    <rect width="180" height="32" rx="10" fill="#000000" fill-opacity="0.75" stroke="#22c55e" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="5" fill="#22c55e"/>
    <text x="30" y="21" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="900">Healthy Wheat Crop</text>
  </g>
</svg>
`)}`;

export const MUSTARD_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="mustardSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="60%" stop-color="#7dd3fc"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="mustardFieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ca8a04"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
    <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="60%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
  </defs>

  <!-- Blue Sky -->
  <rect width="600" height="400" fill="url(#mustardSky)"/>
  
  <!-- Golden Mustard Horizon / Background Field -->
  <ellipse cx="300" cy="380" rx="450" ry="180" fill="url(#mustardFieldBg)"/>
  <ellipse cx="150" cy="320" rx="300" ry="120" fill="#ca8a04" opacity="0.6"/>
  <ellipse cx="450" cy="310" rx="280" ry="110" fill="#eab308" opacity="0.7"/>

  <!-- Mustard Stems & Foliage -->
  <g stroke="#15803d" stroke-linecap="round">
    <path d="M 300,400 Q 300,240 280,120" stroke-width="8" fill="none"/>
    <path d="M 285,280 Q 220,250 160,260" stroke-width="5" fill="none"/>
    <path d="M 290,220 Q 360,190 410,210" stroke-width="5" fill="none"/>
    <path d="M 285,160 Q 230,130 190,140" stroke-width="4" fill="none"/>
    <path d="M 282,140 Q 330,110 360,120" stroke-width="4" fill="none"/>

    <!-- Left plant -->
    <path d="M 120,400 Q 140,260 160,150" stroke-width="6" fill="none"/>
    <path d="M 145,280 Q 80,260 50,280" stroke-width="4" fill="none"/>
    <path d="M 155,210 Q 200,180 230,190" stroke-width="4" fill="none"/>

    <!-- Right plant -->
    <path d="M 480,400 Q 460,270 440,160" stroke-width="6" fill="none"/>
    <path d="M 465,270 Q 520,250 550,270" stroke-width="4" fill="none"/>
    <path d="M 450,220 Q 400,190 380,200" stroke-width="4" fill="none"/>
  </g>

  <!-- Mustard Leaves (Lyrate Deep Green) -->
  <path d="M 285,280 Q 200,290 150,250 Q 220,240 285,275 Z" fill="#166534"/>
  <path d="M 290,220 Q 380,220 420,190 Q 350,180 290,215 Z" fill="#15803d"/>
  <path d="M 145,280 Q 70,300 40,270 Q 100,250 145,275 Z" fill="#166534"/>
  <path d="M 465,270 Q 540,280 560,255 Q 500,245 465,265 Z" fill="#15803d"/>

  <!-- Vibrant Golden Yellow 4-Petal Mustard Flower Clusters (Cruciform) -->
  <!-- Top Center Cluster -->
  <g transform="translate(280, 110)">
    <!-- Flowers -->
    <g transform="translate(0, 0)">
      <circle cx="-10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="-10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="0" cy="0" r="5" fill="#ca8a04"/>
    </g>
    <g transform="translate(-40, 20) scale(0.8)">
      <circle cx="-10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="-10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="0" cy="0" r="5" fill="#ca8a04"/>
    </g>
    <g transform="translate(45, 15) scale(0.85)">
      <circle cx="-10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="-10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="0" cy="0" r="5" fill="#ca8a04"/>
    </g>
    <g transform="translate(10, -35) scale(0.75)">
      <circle cx="-10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="-10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="0" cy="0" r="5" fill="#ca8a04"/>
    </g>
    <g transform="translate(-25, -25) scale(0.7)">
      <circle cx="-10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="-10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="0" cy="0" r="5" fill="#ca8a04"/>
    </g>
  </g>

  <!-- Left Cluster -->
  <g transform="translate(160, 140) scale(0.85)">
    <circle cx="-10" cy="-10" r="14" fill="url(#petalGrad)"/>
    <circle cx="10" cy="-10" r="14" fill="url(#petalGrad)"/>
    <circle cx="-10" cy="10" r="14" fill="url(#petalGrad)"/>
    <circle cx="10" cy="10" r="14" fill="url(#petalGrad)"/>
    <circle cx="0" cy="0" r="5" fill="#ca8a04"/>
    
    <g transform="translate(-30, 25) scale(0.8)">
      <circle cx="-10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="-10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="0" cy="0" r="5" fill="#ca8a04"/>
    </g>
  </g>

  <!-- Right Cluster -->
  <g transform="translate(440, 150) scale(0.9)">
    <circle cx="-10" cy="-10" r="14" fill="url(#petalGrad)"/>
    <circle cx="10" cy="-10" r="14" fill="url(#petalGrad)"/>
    <circle cx="-10" cy="10" r="14" fill="url(#petalGrad)"/>
    <circle cx="10" cy="10" r="14" fill="url(#petalGrad)"/>
    <circle cx="0" cy="0" r="5" fill="#ca8a04"/>

    <g transform="translate(35, 20) scale(0.8)">
      <circle cx="-10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="-10" r="14" fill="url(#petalGrad)"/>
      <circle cx="-10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="10" cy="10" r="14" fill="url(#petalGrad)"/>
      <circle cx="0" cy="0" r="5" fill="#ca8a04"/>
    </g>
  </g>

  <!-- Slender Mustard Silique Pods -->
  <g stroke="#65a30d" stroke-width="2.5" fill="none" stroke-linecap="round">
    <path d="M 270,180 Q 230,170 210,185"/>
    <path d="M 290,190 Q 340,180 370,195"/>
    <path d="M 280,240 Q 240,230 220,245"/>
    <path d="M 295,250 Q 350,240 380,255"/>
  </g>
</svg>
`)}`;

export const COTTON_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="cottonSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="70%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#e0f2fe"/>
    </linearGradient>
    <radialGradient id="cottonFluff" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </radialGradient>
  </defs>

  <rect width="600" height="400" fill="url(#cottonSky)"/>
  
  <!-- Soil & Field Bottom -->
  <ellipse cx="300" cy="420" rx="400" ry="120" fill="#78350f"/>
  <ellipse cx="300" cy="400" rx="380" ry="90" fill="#15803d" opacity="0.6"/>

  <!-- Cotton Plant Branches -->
  <g stroke="#713f12" stroke-linecap="round" fill="none">
    <path d="M 300,400 Q 290,260 300,120" stroke-width="8"/>
    <path d="M 295,300 Q 200,270 140,250" stroke-width="5"/>
    <path d="M 295,250 Q 390,220 460,200" stroke-width="5"/>
    <path d="M 298,180 Q 220,150 170,130" stroke-width="4"/>
    <path d="M 300,160 Q 370,130 420,110" stroke-width="4"/>
  </g>

  <!-- Palmate Cotton Leaves -->
  <g fill="#166534">
    <path d="M 200,280 Q 140,270 110,310 Q 150,330 200,290 Z"/>
    <path d="M 390,230 Q 460,220 490,260 Q 440,280 390,240 Z"/>
    <path d="M 240,160 Q 180,150 150,190 Q 200,210 240,170 Z"/>
  </g>

  <!-- Open Cotton Bolls (White Fluffy Fibers & Dried Brown Calyx/Bracts) -->
  
  <!-- Central Top Boll -->
  <g transform="translate(300, 120)">
    <!-- Dried Bracts / Calyx -->
    <path d="M 0,10 L -25,-5 L -5,25 Z" fill="#78350f"/>
    <path d="M 0,10 L 25,-5 L 5,25 Z" fill="#78350f"/>
    <path d="M 0,10 L 0,-30 L 15,-10 Z" fill="#78350f"/>
    <path d="M 0,10 L 0,35 L -15,15 Z" fill="#451a03"/>
    <!-- 4 White Cotton Puffs -->
    <circle cx="-15" cy="-12" r="22" fill="url(#cottonFluff)"/>
    <circle cx="15" cy="-12" r="22" fill="url(#cottonFluff)"/>
    <circle cx="-12" cy="12" r="22" fill="url(#cottonFluff)"/>
    <circle cx="15" cy="12" r="22" fill="url(#cottonFluff)"/>
    <circle cx="0" cy="0" r="16" fill="#ffffff"/>
  </g>

  <!-- Left Boll 1 -->
  <g transform="translate(140, 240) scale(0.85)">
    <path d="M 0,10 L -25,-5 L -5,25 Z" fill="#78350f"/>
    <path d="M 0,10 L 25,-5 L 5,25 Z" fill="#78350f"/>
    <circle cx="-14" cy="-10" r="20" fill="url(#cottonFluff)"/>
    <circle cx="14" cy="-10" r="20" fill="url(#cottonFluff)"/>
    <circle cx="-10" cy="10" r="20" fill="url(#cottonFluff)"/>
    <circle cx="14" cy="10" r="20" fill="url(#cottonFluff)"/>
    <circle cx="0" cy="0" r="14" fill="#ffffff"/>
  </g>

  <!-- Right Boll 1 -->
  <g transform="translate(460, 190) scale(0.9)">
    <path d="M 0,10 L -25,-5 L -5,25 Z" fill="#78350f"/>
    <path d="M 0,10 L 25,-5 L 5,25 Z" fill="#78350f"/>
    <circle cx="-15" cy="-12" r="22" fill="url(#cottonFluff)"/>
    <circle cx="15" cy="-12" r="22" fill="url(#cottonFluff)"/>
    <circle cx="-12" cy="12" r="22" fill="url(#cottonFluff)"/>
    <circle cx="15" cy="12" r="22" fill="url(#cottonFluff)"/>
    <circle cx="0" cy="0" r="15" fill="#ffffff"/>
  </g>

  <!-- Top Left Boll 2 -->
  <g transform="translate(170, 125) scale(0.75)">
    <circle cx="-15" cy="-12" r="20" fill="url(#cottonFluff)"/>
    <circle cx="15" cy="-12" r="20" fill="url(#cottonFluff)"/>
    <circle cx="-12" cy="12" r="20" fill="url(#cottonFluff)"/>
    <circle cx="15" cy="12" r="20" fill="url(#cottonFluff)"/>
    <circle cx="0" cy="0" r="12" fill="#ffffff"/>
  </g>

  <!-- Top Right Boll 2 -->
  <g transform="translate(420, 105) scale(0.75)">
    <circle cx="-15" cy="-12" r="20" fill="url(#cottonFluff)"/>
    <circle cx="15" cy="-12" r="20" fill="url(#cottonFluff)"/>
    <circle cx="-12" cy="12" r="20" fill="url(#cottonFluff)"/>
    <circle cx="15" cy="12" r="20" fill="url(#cottonFluff)"/>
    <circle cx="0" cy="0" r="12" fill="#ffffff"/>
  </g>
</svg>
`)}`;

export const SUGARCANE_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="caneSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="60%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="caneStalk" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4d7c0f"/>
      <stop offset="40%" stop-color="#84cc16"/>
      <stop offset="80%" stop-color="#65a30d"/>
      <stop offset="100%" stop-color="#3f6212"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#caneSky)"/>
  
  <!-- Sugarcane Field Bed -->
  <rect y="330" width="600" height="70" fill="#78350f"/>
  <rect y="310" width="600" height="30" fill="#15803d" opacity="0.8"/>

  <!-- Thick Jointed Sugarcane Stalks -->
  
  <!-- Stalk 1 (Left) -->
  <g transform="translate(140, 20)">
    <rect x="0" y="0" width="28" height="340" fill="url(#caneStalk)" rx="4"/>
    <!-- Node rings / Joints -->
    <line x1="0" y1="60" x2="28" y2="60" stroke="#facc15" stroke-width="4"/>
    <line x1="0" y1="120" x2="28" y2="120" stroke="#facc15" stroke-width="4"/>
    <line x1="0" y1="180" x2="28" y2="180" stroke="#facc15" stroke-width="4"/>
    <line x1="0" y1="240" x2="28" y2="240" stroke="#facc15" stroke-width="4"/>
    <line x1="0" y1="300" x2="28" y2="300" stroke="#facc15" stroke-width="4"/>
    <!-- Arching Leaves -->
    <path d="M 28,60 Q 120,40 180,110 Q 120,80 28,66" fill="#166534"/>
    <path d="M 0,120 Q -90,90 -130,160 Q -80,130 0,126" fill="#15803d"/>
  </g>

  <!-- Stalk 2 (Center Hero) -->
  <g transform="translate(280, 0)">
    <rect x="0" y="0" width="34" height="360" fill="url(#caneStalk)" rx="6"/>
    <!-- Joints -->
    <line x1="0" y1="50" x2="34" y2="50" stroke="#facc15" stroke-width="5"/>
    <line x1="0" y1="110" x2="34" y2="110" stroke="#facc15" stroke-width="5"/>
    <line x1="0" y1="170" x2="34" y2="170" stroke="#facc15" stroke-width="5"/>
    <line x1="0" y1="230" x2="34" y2="230" stroke="#facc15" stroke-width="5"/>
    <line x1="0" y1="290" x2="34" y2="290" stroke="#facc15" stroke-width="5"/>
    <!-- Arching Sword-like Leaves -->
    <path d="M 34,50 Q 160,20 240,80 Q 160,60 34,56" fill="#22c55e"/>
    <path d="M 0,110 Q -120,70 -190,140 Q -110,110 0,116" fill="#16a34a"/>
    <path d="M 34,170 Q 140,140 210,210 Q 130,180 34,176" fill="#15803d"/>
  </g>

  <!-- Stalk 3 (Right) -->
  <g transform="translate(430, 30)">
    <rect x="0" y="0" width="28" height="330" fill="url(#caneStalk)" rx="4"/>
    <line x1="0" y1="55" x2="28" y2="55" stroke="#facc15" stroke-width="4"/>
    <line x1="0" y1="115" x2="28" y2="115" stroke="#facc15" stroke-width="4"/>
    <line x1="0" y1="175" x2="28" y2="175" stroke="#facc15" stroke-width="4"/>
    <line x1="0" y1="235" x2="28" y2="235" stroke="#facc15" stroke-width="4"/>
    <path d="M 0,55 Q -80,40 -120,90 Q -70,70 0,60" fill="#16a34a"/>
    <path d="M 28,115 Q 110,95 150,150 Q 100,130 28,120" fill="#15803d"/>
  </g>
</svg>
`)}`;

export const RICE_PADDY_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="paddySky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#7dd3fc"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="paddyWater" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="40%" stop-color="#16a34a"/>
      <stop offset="100%" stop-color="#14532d"/>
    </linearGradient>
    <linearGradient id="paddyGrain" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#84cc16"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#paddySky)"/>
  
  <!-- Flooded Terraced Rice Paddy with Standing Water Reflections -->
  <rect y="230" width="600" height="170" fill="url(#paddyWater)"/>
  <ellipse cx="300" cy="270" rx="350" ry="40" fill="#bae6fd" opacity="0.35"/>
  <ellipse cx="150" cy="340" rx="280" ry="30" fill="#7dd3fc" opacity="0.25"/>

  <!-- Paddy Mud Bunds (Dikes) -->
  <path d="M 0,240 Q 200,230 400,245 Q 500,240 600,235 L 600,250 Q 400,255 0,250 Z" fill="#78350f" opacity="0.7"/>

  <!-- Lush Emerald Green Rice Plants & Drooping Golden Panicles -->
  
  <!-- Left Rice Clump -->
  <g transform="translate(140, 70)">
    <path d="M 20,290 Q 30,120 -30,40" stroke="#4ade80" stroke-width="5.5" fill="none"/>
    <path d="M 20,290 Q -20,180 -80,140 Q -30,170 20,280" fill="#16a34a"/>
    <path d="M 20,290 Q 60,160 110,130 Q 50,170 20,285" fill="#22c55e"/>
    <!-- Drooping Heavy Grain Panicle -->
    <g transform="translate(-30, 40)">
      <ellipse cx="0" cy="0" rx="7" ry="14" fill="url(#paddyGrain)" transform="rotate(-35)"/>
      <ellipse cx="-12" cy="18" rx="7" ry="14" fill="url(#paddyGrain)" transform="rotate(-20)"/>
      <ellipse cx="-20" cy="38" rx="7" ry="14" fill="url(#paddyGrain)" transform="rotate(-5)"/>
      <ellipse cx="-24" cy="60" rx="7" ry="14" fill="url(#paddyGrain)" transform="rotate(10)"/>
      <ellipse cx="-22" cy="82" rx="6" ry="12" fill="url(#paddyGrain)" transform="rotate(20)"/>
    </g>
  </g>

  <!-- Center Hero Rice Clump -->
  <g transform="translate(300, 30)">
    <path d="M 10,330 Q 0,130 80,25" stroke="#4ade80" stroke-width="6" fill="none"/>
    <path d="M 5,230 Q -100,160 -150,210 Q -80,180 5,240" fill="#22c55e"/>
    <path d="M 10,200 Q 130,120 190,170 Q 110,150 10,210" fill="#16a34a"/>
    <!-- Water base ripple -->
    <ellipse cx="10" cy="330" rx="40" ry="8" fill="#bae6fd" opacity="0.4"/>
    <!-- Heavy Curved Panicle -->
    <g transform="translate(80, 25)">
      <ellipse cx="0" cy="0" rx="8" ry="16" fill="url(#paddyGrain)" transform="rotate(40)"/>
      <ellipse cx="18" cy="20" rx="8" ry="16" fill="url(#paddyGrain)" transform="rotate(55)"/>
      <ellipse cx="30" cy="42" rx="8" ry="16" fill="url(#paddyGrain)" transform="rotate(70)"/>
      <ellipse cx="38" cy="68" rx="8" ry="16" fill="url(#paddyGrain)" transform="rotate(85)"/>
      <ellipse cx="40" cy="95" rx="8" ry="16" fill="url(#paddyGrain)" transform="rotate(95)"/>
      <ellipse cx="36" cy="120" rx="7" ry="14" fill="url(#paddyGrain)" transform="rotate(105)"/>
    </g>
  </g>

  <!-- Right Rice Clump -->
  <g transform="translate(460, 60)">
    <path d="M 10,300 Q 0,130 60,35" stroke="#4ade80" stroke-width="5" fill="none"/>
    <path d="M 10,210 Q -60,150 -100,180 Q -40,170 10,220" fill="#16a34a"/>
    <g transform="translate(60, 35)">
      <ellipse cx="0" cy="0" rx="7" ry="13" fill="url(#paddyGrain)" transform="rotate(35)"/>
      <ellipse cx="14" cy="18" rx="7" ry="13" fill="url(#paddyGrain)" transform="rotate(50)"/>
      <ellipse cx="22" cy="38" rx="7" ry="13" fill="url(#paddyGrain)" transform="rotate(65)"/>
      <ellipse cx="26" cy="60" rx="7" ry="13" fill="url(#paddyGrain)" transform="rotate(80)"/>
    </g>
  </g>
</svg>
`)}`;

export const SOYBEAN_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="soySky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="60%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="soyPod" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a3e635"/>
      <stop offset="50%" stop-color="#65a30d"/>
      <stop offset="100%" stop-color="#3f6212"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#soySky)"/>
  <rect y="330" width="600" height="70" fill="#78350f"/>
  <ellipse cx="300" cy="350" rx="400" ry="80" fill="#15803d" opacity="0.6"/>

  <!-- Soybean Plant Main Stems -->
  <g stroke="#65a30d" stroke-linecap="round" fill="none">
    <path d="M 300,360 Q 290,240 300,100" stroke-width="7"/>
    <path d="M 295,270 Q 210,230 160,200" stroke-width="5"/>
    <path d="M 298,220 Q 380,180 430,160" stroke-width="5"/>
  </g>

  <!-- Trifoliate Soybean Leaves (Broad Oval Lush Green) -->
  <g fill="#15803d">
    <ellipse cx="300" cy="70" rx="35" ry="50" transform="rotate(-5, 300, 70)"/>
    <ellipse cx="250" cy="100" rx="35" ry="45" transform="rotate(-40, 250, 100)"/>
    <ellipse cx="350" cy="100" rx="35" ry="45" transform="rotate(40, 350, 100)"/>

    <ellipse cx="150" cy="170" rx="30" ry="42" transform="rotate(-30, 150, 170)"/>
    <ellipse cx="110" cy="200" rx="28" ry="38" transform="rotate(-60, 110, 200)"/>
    <ellipse cx="180" cy="210" rx="28" ry="38" transform="rotate(15, 180, 210)"/>

    <ellipse cx="440" cy="130" rx="30" ry="42" transform="rotate(25, 440, 130)"/>
    <ellipse cx="410" cy="170" rx="28" ry="38" transform="rotate(-20, 410, 170)"/>
    <ellipse cx="480" cy="160" rx="28" ry="38" transform="rotate(55, 480, 160)"/>
  </g>

  <!-- Plump Fuzzy Soybean Pods Hanging along Nodes -->
  <g transform="translate(290, 170)">
    <path d="M 0,0 C 18,12 28,34 16,54 C 4,48 -6,26 0,0 Z" fill="url(#soyPod)"/>
    <circle cx="10" cy="16" r="6" fill="#bef264" opacity="0.65"/>
    <circle cx="13" cy="33" r="6" fill="#bef264" opacity="0.65"/>
    <circle cx="9" cy="46" r="5" fill="#bef264" opacity="0.65"/>
  </g>
  <g transform="translate(305, 190)">
    <path d="M 0,0 C -18,12 -28,34 -16,54 C -4,48 6,26 0,0 Z" fill="url(#soyPod)"/>
  </g>

  <g transform="translate(210, 240)">
    <path d="M 0,0 C 16,10 24,28 14,46 C 4,42 -4,22 0,0 Z" fill="url(#soyPod)"/>
  </g>
  <g transform="translate(370, 210)">
    <path d="M 0,0 C -16,10 -24,28 -14,46 C -4,42 4,22 0,0 Z" fill="url(#soyPod)"/>
  </g>
</svg>
`)}`;

export const MAIZE_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="maizeSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="60%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="cornKernelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
    <linearGradient id="cornHuskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#84cc16"/>
      <stop offset="70%" stop-color="#4d7c0f"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#maizeSky)"/>
  <rect y="340" width="600" height="60" fill="#78350f"/>
  <ellipse cx="300" cy="350" rx="380" ry="60" fill="#15803d" opacity="0.7"/>

  <!-- Maize Main Stalks -->
  <g stroke="#65a30d" stroke-linecap="round" fill="none">
    <path d="M 300,380 Q 295,200 300,50" stroke-width="12"/>
    <path d="M 160,380 Q 155,220 150,80" stroke-width="10"/>
    <path d="M 440,380 Q 445,230 450,90" stroke-width="10"/>
  </g>

  <!-- Top Tassel Flowers -->
  <g stroke="#ca8a04" stroke-width="2.5" stroke-linecap="round">
    <line x1="300" y1="50" x2="300" y2="10"/>
    <line x1="300" y1="35" x2="275" y2="15"/>
    <line x1="300" y1="35" x2="325" y2="15"/>
    <line x1="300" y1="45" x2="260" y2="30"/>
    <line x1="300" y1="45" x2="340" y2="30"/>
  </g>

  <!-- Broad Arching Corn Leaves -->
  <path d="M 300,220 Q 140,160 50,220 Q 150,190 300,230" fill="#16a34a"/>
  <path d="M 300,180 Q 460,120 550,180 Q 450,150 300,190" fill="#22c55e"/>
  <path d="M 300,130 Q 180,90 90,140 Q 190,110 300,140" fill="#15803d"/>
  <path d="M 300,100 Q 420,60 500,100 Q 410,80 300,110" fill="#16a34a"/>

  <!-- Big Ripe Corn Cobs on Stalk (with Yellow Kernels, Green Husk & Silk) -->
  <!-- Central Corn Cob -->
  <g transform="translate(305, 170) rotate(22)">
    <!-- Silk Tassel -->
    <path d="M 0,-40 Q 15,-60 5,-75 M 0,-40 Q -8,-58 -2,-72" stroke="#b45309" stroke-width="2" fill="none"/>
    <!-- Yellow Corn Ear -->
    <rect x="-18" y="-40" width="36" height="90" rx="16" fill="url(#cornKernelGrad)"/>
    <!-- Corn Rows Grid -->
    <g stroke="#ca8a04" stroke-width="1.5" opacity="0.6">
      <line x1="-15" y1="-20" x2="15" y2="-20"/>
      <line x1="-16" y1="0" x2="16" y2="0"/>
      <line x1="-15" y1="20" x2="15" y2="20"/>
      <line x1="-12" y1="40" x2="12" y2="40"/>
      <line x1="-6" y1="-38" x2="-6" y2="48"/>
      <line x1="6" y1="-38" x2="6" y2="48"/>
    </g>
    <!-- Partially Open Green Husk Leaves -->
    <path d="M -18,50 Q -30,0 -12,-35 Q -10,15 -10,50 Z" fill="url(#cornHuskGrad)"/>
    <path d="M 18,50 Q 30,0 12,-35 Q 10,15 10,50 Z" fill="url(#cornHuskGrad)"/>
  </g>

  <!-- Secondary Left Corn Cob -->
  <g transform="translate(155, 190) rotate(-20) scale(0.85)">
    <rect x="-16" y="-35" width="32" height="75" rx="14" fill="url(#cornKernelGrad)"/>
    <path d="M -16,40 Q -26,0 -10,-30 Q -8,10 -8,40 Z" fill="url(#cornHuskGrad)"/>
    <path d="M 16,40 Q 26,0 10,-30 Q 8,10 8,40 Z" fill="url(#cornHuskGrad)"/>
  </g>
</svg>
`)}`;

export const TOMATO_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="tomatoSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#7dd3fc"/>
      <stop offset="100%" stop-color="#bbf7d0"/>
    </linearGradient>
    <radialGradient id="ripeTomato" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#f87171"/>
      <stop offset="30%" stop-color="#ef4444"/>
      <stop offset="75%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </radialGradient>
    <radialGradient id="highlight" cx="30%" cy="30%" r="30%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="600" height="400" fill="url(#tomatoSky)"/>
  <rect y="330" width="600" height="70" fill="#78350f"/>
  <ellipse cx="300" cy="350" rx="380" ry="70" fill="#15803d" opacity="0.7"/>

  <!-- Tomato Vines & Branches -->
  <g stroke="#15803d" stroke-width="7" stroke-linecap="round" fill="none">
    <path d="M 280,380 Q 270,220 310,100"/>
    <path d="M 290,260 Q 200,200 130,220"/>
    <path d="M 295,190 Q 400,160 480,180"/>
  </g>

  <!-- Serrated Compound Tomato Leaves -->
  <g fill="#166534">
    <path d="M 130,220 Q 80,170 60,200 Q 90,230 130,225 Z"/>
    <path d="M 180,180 Q 150,130 120,150 Q 140,190 180,185 Z"/>
    <path d="M 480,180 Q 540,140 560,170 Q 520,200 480,185 Z"/>
    <path d="M 410,140 Q 460,90 490,110 Q 450,150 410,145 Z"/>
    <path d="M 310,100 Q 300,30 350,50 Q 340,90 310,100 Z"/>
  </g>

  <!-- Yellow Tomato Star Blossoms -->
  <g transform="translate(360, 110) scale(0.7)">
    <polygon points="0,-18 5,-5 18,-5 8,4 12,17 0,8 -12,17 -8,4 -18,-5 -5,-5" fill="#facc15"/>
    <circle cx="0" cy="0" r="4" fill="#ca8a04"/>
  </g>

  <!-- Plump Ripe Red Tomatoes on the Vine -->
  <!-- Tomato 1 (Large Center Left) -->
  <g transform="translate(240, 240)">
    <circle cx="0" cy="0" r="46" fill="url(#ripeTomato)"/>
    <ellipse cx="-14" cy="-14" rx="14" ry="9" fill="url(#highlight)" transform="rotate(-30)"/>
    <!-- 5-Star Green Calyx & Stem -->
    <path d="M 0,-46 L -8,-58 L -2,-45 L 8,-58 L 2,-45 L 14,-50 L 5,-42 L 0,-46 Z" fill="#15803d"/>
    <path d="M 0,-46 Q 10,-65 25,-70" stroke="#15803d" stroke-width="4" fill="none"/>
  </g>

  <!-- Tomato 2 (Large Center Right) -->
  <g transform="translate(340, 260)">
    <circle cx="0" cy="0" r="42" fill="url(#ripeTomato)"/>
    <ellipse cx="-12" cy="-12" rx="12" ry="8" fill="url(#highlight)" transform="rotate(-30)"/>
    <path d="M 0,-42 L -7,-54 L -2,-41 L 7,-54 L 2,-41 L 12,-46 L 4,-38 L 0,-42 Z" fill="#15803d"/>
  </g>

  <!-- Tomato 3 (Ripening Orange-Red Top) -->
  <g transform="translate(320, 160) scale(0.75)">
    <circle cx="0" cy="0" r="38" fill="url(#ripeTomato)"/>
    <ellipse cx="-10" cy="-10" rx="10" ry="6" fill="url(#highlight)" transform="rotate(-30)"/>
    <path d="M 0,-38 L -6,-48 L -2,-37 L 6,-48 L 2,-37 L 10,-42 L 3,-34 L 0,-38 Z" fill="#15803d"/>
  </g>

  <!-- Tomato 4 (Small Green-Red Cluster) -->
  <g transform="translate(180, 270) scale(0.65)">
    <circle cx="0" cy="0" r="38" fill="url(#ripeTomato)"/>
    <ellipse cx="-10" cy="-10" rx="10" ry="6" fill="url(#highlight)" transform="rotate(-30)"/>
  </g>
</svg>
`)}`;

export const POTATO_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="potatoSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="potatoSoil" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#542805"/>
      <stop offset="40%" stop-color="#3d1d04"/>
      <stop offset="100%" stop-color="#241001"/>
    </linearGradient>
    <radialGradient id="potatoSkin" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#d4a373"/>
      <stop offset="40%" stop-color="#bc6c25"/>
      <stop offset="85%" stop-color="#8c4308"/>
      <stop offset="100%" stop-color="#582a05"/>
    </radialGradient>
  </defs>

  <!-- Sky above surface -->
  <rect width="600" height="400" fill="url(#potatoSky)"/>

  <!-- Underground Cross-Section Loam Soil Bed -->
  <rect y="190" width="600" height="210" fill="url(#potatoSoil)"/>
  <!-- Soil texture clods -->
  <ellipse cx="120" cy="220" rx="30" ry="12" fill="#78350f" opacity="0.6"/>
  <ellipse cx="380" cy="210" rx="40" ry="15" fill="#78350f" opacity="0.6"/>
  <ellipse cx="500" cy="230" rx="25" ry="10" fill="#78350f" opacity="0.6"/>

  <!-- Aboveground Green Potato Plant Stems & Foliage -->
  <g stroke="#15803d" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M 300,210 Q 295,140 300,50"/>
    <path d="M 295,160 Q 220,110 160,130"/>
    <path d="M 298,130 Q 380,80 440,100"/>
  </g>

  <g fill="#166534">
    <ellipse cx="300" cy="40" rx="25" ry="35"/>
    <ellipse cx="160" cy="120" rx="24" ry="32" transform="rotate(-30, 160, 120)"/>
    <ellipse cx="440" cy="90" rx="24" ry="32" transform="rotate(30, 440, 90)"/>
    <ellipse cx="230" cy="110" rx="20" ry="28" transform="rotate(-20, 230, 110)"/>
    <ellipse cx="370" cy="80" rx="20" ry="28" transform="rotate(20, 370, 80)"/>
  </g>

  <!-- Subterranean Root System connecting tubers -->
  <g stroke="#d4a373" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8">
    <path d="M 300,210 Q 280,260 210,280"/>
    <path d="M 300,210 Q 330,270 390,290"/>
    <path d="M 300,210 Q 300,280 300,340"/>
    <path d="M 210,280 Q 150,300 120,330"/>
    <path d="M 390,290 Q 460,310 490,340"/>
  </g>

  <!-- Big Fresh Harvested Potato Tubers with Soil Texture & Eyes -->
  <!-- Central Potato -->
  <g transform="translate(300, 340)">
    <ellipse cx="0" cy="0" rx="55" ry="40" fill="url(#potatoSkin)"/>
    <!-- Potato Eyes / Dimples -->
    <circle cx="-25" cy="-12" r="3" fill="#3d1d04"/>
    <circle cx="20" cy="-10" r="2.5" fill="#3d1d04"/>
    <circle cx="0" cy="15" r="3" fill="#3d1d04"/>
    <circle cx="-15" cy="18" r="2" fill="#3d1d04"/>
    <circle cx="30" cy="12" r="2.5" fill="#3d1d04"/>
  </g>

  <!-- Left Potato -->
  <g transform="translate(190, 280) rotate(-25)">
    <ellipse cx="0" cy="0" rx="50" ry="36" fill="url(#potatoSkin)"/>
    <circle cx="-20" cy="-8" r="2.5" fill="#3d1d04"/>
    <circle cx="15" cy="8" r="2.5" fill="#3d1d04"/>
  </g>

  <!-- Right Potato -->
  <g transform="translate(410, 290) rotate(20)">
    <ellipse cx="0" cy="0" rx="52" ry="38" fill="url(#potatoSkin)"/>
    <circle cx="-15" cy="10" r="2.5" fill="#3d1d04"/>
    <circle cx="18" cy="-8" r="2.5" fill="#3d1d04"/>
  </g>

  <!-- Small Seed Potato -->
  <g transform="translate(120, 335) rotate(15)">
    <ellipse cx="0" cy="0" rx="35" ry="26" fill="url(#potatoSkin)"/>
  </g>
</svg>
`)}`;

export const ONION_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="onionSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="onionSoil" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="60%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#1c0901"/>
    </linearGradient>
    <radialGradient id="redOnionBulb" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#e879f9"/>
      <stop offset="35%" stop-color="#c026d3"/>
      <stop offset="70%" stop-color="#86198f"/>
      <stop offset="100%" stop-color="#4a044e"/>
    </radialGradient>
  </defs>

  <rect width="600" height="400" fill="url(#onionSky)"/>
  <rect y="230" width="600" height="170" fill="url(#onionSoil)"/>

  <!-- Hollow Tubular Green Onion Shoots / Leaves -->
  <g stroke="#16a34a" stroke-linecap="round" fill="none">
    <!-- Center plant shoots -->
    <path d="M 300,210 Q 280,100 240,20" stroke-width="9"/>
    <path d="M 300,210 Q 300,90 305,15" stroke-width="8"/>
    <path d="M 300,210 Q 325,105 370,30" stroke-width="9"/>

    <!-- Left plant shoots -->
    <path d="M 160,240 Q 140,140 100,50" stroke-width="7"/>
    <path d="M 160,240 Q 170,130 180,45" stroke-width="7"/>

    <!-- Right plant shoots -->
    <path d="M 440,240 Q 425,140 395,55" stroke-width="7"/>
    <path d="M 440,240 Q 460,130 495,60" stroke-width="7"/>
  </g>

  <!-- Big Harvested Layered Red Onion Bulbs Nestled in Soil -->
  <!-- Center Hero Red Onion -->
  <g transform="translate(300, 270)">
    <!-- Root hairs -->
    <path d="M 0,45 L -10,75 M 0,45 L 0,80 M 0,45 L 10,75 M 0,45 L -20,65 M 0,45 L 20,65" stroke="#fef08a" stroke-width="2" fill="none"/>
    <!-- Bulb Body -->
    <ellipse cx="0" cy="0" rx="55" ry="48" fill="url(#redOnionBulb)"/>
    <!-- Onion Papery Skin Striations -->
    <path d="M 0,-48 Q -40,0 0,48" stroke="#f5d0fe" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M 0,-48 Q 40,0 0,48" stroke="#f5d0fe" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M 0,-48 Q -20,0 0,48" stroke="#f5d0fe" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M 0,-48 Q 20,0 0,48" stroke="#f5d0fe" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- Top neck -->
    <path d="M -12,-44 L 0,-62 L 12,-44 Z" fill="#86198f"/>
  </g>

  <!-- Left Red Onion -->
  <g transform="translate(160, 290) scale(0.85)">
    <path d="M 0,45 L -10,70 M 0,45 L 8,70" stroke="#fef08a" stroke-width="2" fill="none"/>
    <ellipse cx="0" cy="0" rx="50" ry="44" fill="url(#redOnionBulb)"/>
    <path d="M 0,-44 Q -35,0 0,44" stroke="#f5d0fe" stroke-width="1.8" fill="none" opacity="0.6"/>
    <path d="M 0,-44 Q 35,0 0,44" stroke="#f5d0fe" stroke-width="1.8" fill="none" opacity="0.6"/>
  </g>

  <!-- Right Red Onion -->
  <g transform="translate(440, 290) scale(0.85)">
    <path d="M 0,45 L -8,70 M 0,45 L 10,70" stroke="#fef08a" stroke-width="2" fill="none"/>
    <ellipse cx="0" cy="0" rx="50" ry="44" fill="url(#redOnionBulb)"/>
    <path d="M 0,-44 Q -35,0 0,44" stroke="#f5d0fe" stroke-width="1.8" fill="none" opacity="0.6"/>
    <path d="M 0,-44 Q 35,0 0,44" stroke="#f5d0fe" stroke-width="1.8" fill="none" opacity="0.6"/>
  </g>
</svg>
`)}`;

export const GROUNDNUT_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="groundnutSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#bae6fd"/>
      <stop offset="100%" stop-color="#fef08a"/>
    </linearGradient>
    <linearGradient id="sandySoil" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#92400e"/>
      <stop offset="50%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <linearGradient id="peanutShell" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="50%" stop-color="#fde68a"/>
      <stop offset="85%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
  </defs>

  <rect width="600" height="400" fill="url(#groundnutSky)"/>
  <rect y="180" width="600" height="220" fill="url(#sandySoil)"/>

  <!-- Aboveground Foliage: 4-Leaflet Groundnut Clusters & Small Yellow Flowers -->
  <g fill="#15803d">
    <ellipse cx="300" cy="130" rx="28" ry="38" transform="rotate(-25, 300, 130)"/>
    <ellipse cx="270" cy="100" rx="28" ry="38" transform="rotate(-65, 270, 100)"/>
    <ellipse cx="330" cy="100" rx="28" ry="38" transform="rotate(25, 330, 100)"/>
    <ellipse cx="300" cy="70" rx="28" ry="38" transform="rotate(65, 300, 70)"/>

    <ellipse cx="180" cy="140" rx="24" ry="32" transform="rotate(-30, 180, 140)"/>
    <ellipse cx="420" cy="140" rx="24" ry="32" transform="rotate(30, 420, 140)"/>
  </g>

  <!-- Small Golden Yellow Peanut Blossom -->
  <circle cx="280" cy="150" r="8" fill="#facc15"/>
  <circle cx="320" cy="145" r="7" fill="#facc15"/>

  <!-- Subterranean Pegs (Gynophores) penetrating soil to form pods -->
  <g stroke="#d97706" stroke-width="3" stroke-linecap="round" fill="none">
    <path d="M 290,170 Q 270,230 220,260"/>
    <path d="M 310,170 Q 330,230 380,260"/>
    <path d="M 300,170 Q 295,250 300,320"/>
    <path d="M 300,220 Q 240,280 160,310"/>
    <path d="M 300,220 Q 360,280 440,310"/>
  </g>

  <!-- Double-Humped Reticulated Groundnut / Peanut Pods in Soil -->
  <!-- Center Pod -->
  <g transform="translate(300, 330) rotate(15)">
    <path d="M -35,0 C -35,-22 -10,-20 0,-10 C 10,-20 35,-22 35,0 C 35,22 10,20 0,10 C -10,20 -35,22 -35,0 Z" fill="url(#peanutShell)"/>
    <!-- Shell Mesh Texture Grid -->
    <path d="M -25,-8 L -20,8 M -12,-10 L -8,10 M 12,-10 L 8,10 M 25,-8 L 20,8" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
  </g>

  <!-- Left Pod 1 -->
  <g transform="translate(215, 270) rotate(-35)">
    <path d="M -32,0 C -32,-20 -9,-18 0,-9 C 9,-18 32,-20 32,0 C 32,20 9,18 0,9 C -9,18 -32,20 -32,0 Z" fill="url(#peanutShell)"/>
    <path d="M -20,-6 L -16,6 M 16,-6 L 12,6" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
  </g>

  <!-- Right Pod 1 -->
  <g transform="translate(385, 270) rotate(35)">
    <path d="M -32,0 C -32,-20 -9,-18 0,-9 C 9,-18 32,-20 32,0 C 32,20 9,18 0,9 C -9,18 -32,20 -32,0 Z" fill="url(#peanutShell)"/>
    <path d="M -20,-6 L -16,6 M 16,-6 L 12,6" stroke="#92400e" stroke-width="1.5" opacity="0.6"/>
  </g>

  <!-- Deep Left Pod 2 -->
  <g transform="translate(150, 320) rotate(-15) scale(0.85)">
    <path d="M -30,0 C -30,-18 -8,-16 0,-8 C 8,-16 30,-18 30,0 C 30,18 8,16 0,8 C -8,16 -30,18 -30,0 Z" fill="url(#peanutShell)"/>
  </g>

  <!-- Deep Right Pod 2 -->
  <g transform="translate(450, 320) rotate(20) scale(0.85)">
    <path d="M -30,0 C -30,-18 -8,-16 0,-8 C 8,-16 30,-18 30,0 C 30,18 8,16 0,8 C -8,16 -30,18 -30,0 Z" fill="url(#peanutShell)"/>
  </g>
</svg>
`)}`;

export const CHILLI_CROP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
  <defs>
    <linearGradient id="chilliSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#7dd3fc"/>
      <stop offset="100%" stop-color="#bbf7d0"/>
    </linearGradient>
    <radialGradient id="hotChilli" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#f87171"/>
      <stop offset="40%" stop-color="#ef4444"/>
      <stop offset="85%" stop-color="#b91c1c"/>
      <stop offset="100%" stop-color="#7f1d1d"/>
    </radialGradient>
  </defs>

  <rect width="600" height="400" fill="url(#chilliSky)"/>
  <rect y="330" width="600" height="70" fill="#78350f"/>
  <ellipse cx="300" cy="350" rx="380" ry="70" fill="#15803d" opacity="0.7"/>

  <!-- Bushy Chilli Plant Stems -->
  <g stroke="#15803d" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M 300,380 Q 290,220 300,90"/>
    <path d="M 295,260 Q 200,200 130,210"/>
    <path d="M 298,200 Q 400,160 470,180"/>
  </g>

  <!-- Pointed Ovate Leaves -->
  <g fill="#166534">
    <ellipse cx="300" cy="80" rx="20" ry="38"/>
    <ellipse cx="140" cy="180" rx="18" ry="32" transform="rotate(-40, 140, 180)"/>
    <ellipse cx="460" cy="160" rx="18" ry="32" transform="rotate(40, 460, 160)"/>
    <ellipse cx="230" cy="150" rx="16" ry="28" transform="rotate(-20, 230, 150)"/>
    <ellipse cx="370" cy="130" rx="16" ry="28" transform="rotate(25, 370, 130)"/>
  </g>

  <!-- Bright Red Hanging Chilli Peppers (Curved Horn Shape) -->
  <!-- Center Chilli -->
  <g transform="translate(300, 200)">
    <path d="M 0,0 C 18,25 22,60 5,90 C 2,92 -2,92 -3,88 C 8,60 5,25 -8,0 Z" fill="url(#hotChilli)"/>
    <ellipse cx="-4" cy="0" rx="9" ry="5" fill="#15803d"/>
    <path d="M -4,0 Q -10,-18 -15,-25" stroke="#15803d" stroke-width="3" fill="none"/>
  </g>

  <!-- Left Chilli -->
  <g transform="translate(200, 240) rotate(-15)">
    <path d="M 0,0 C 16,22 20,55 4,80 C 1,82 -2,82 -3,78 C 6,55 4,22 -7,0 Z" fill="url(#hotChilli)"/>
    <ellipse cx="-4" cy="0" rx="8" ry="4" fill="#15803d"/>
  </g>

  <!-- Right Chilli -->
  <g transform="translate(400, 220) rotate(15)">
    <path d="M 0,0 C 16,22 20,55 4,80 C 1,82 -2,82 -3,78 C 6,55 4,22 -7,0 Z" fill="url(#hotChilli)"/>
    <ellipse cx="-4" cy="0" rx="8" ry="4" fill="#15803d"/>
  </g>

  <!-- Green Young Chilli -->
  <g transform="translate(250, 170) rotate(20) scale(0.8)">
    <path d="M 0,0 C 14,20 18,50 4,70 C 1,72 -2,72 -3,68 C 6,50 4,20 -6,0 Z" fill="#22c55e"/>
    <ellipse cx="-3" cy="0" rx="7" ry="4" fill="#15803d"/>
  </g>
</svg>
`)}`;

export const WHEAT_CROP_SVG = HEALTHY_WHEAT_SVG;
export const CROP_FALLBACK_SVG = HEALTHY_WHEAT_SVG;

// ============================================================================
// LOCKED & VERIFIED CROP VISUAL MAPPING (PERMANENT - DO NOT RANDOMIZE)
// All 12 crops are verified and permanently locked to local high-res photos:
// 1. Wheat: Golden wheat ears in field
// 2. Rice / Paddy: Green rice paddy field with visible rice plants & standing water
// 3. Cotton: Real open white fluffy cotton bolls on cotton plant
// 4. Sugarcane: Close-up of tall green sugarcane stalks
// 5. Mustard: Blooming bright yellow mustard flowers field
// 6. Maize: Ripe golden corn cobs on stalk
// 7. Tomato: Ripe red tomatoes on vine
// 8. Potato: Freshly harvested potato tubers
// 9. Soybean: Real soybean plants with visible green pods
// 10. Chilli: Real red chilli peppers on plant
// 11. Onion: Red onion bulbs
// 12. Groundnut: In-shell groundnut/peanuts pods
// ============================================================================

export interface CropVisualItem {
  id: string;
  name: string;
  photo: string;
  svg: string;
  emoji: string;
}

export const CROP_VISUALS: Record<string, Readonly<CropVisualItem>> = Object.freeze({
  wheat: Object.freeze({
    id: "wheat",
    name: "Wheat",
    photo: "/crops/wheat.jpg",
    svg: HEALTHY_WHEAT_SVG,
    emoji: "🌾",
  }),
  rice: Object.freeze({
    id: "rice",
    name: "Rice / Paddy",
    photo: "/crops/rice.jpg",
    svg: RICE_PADDY_CROP_SVG,
    emoji: "🌾",
  }),
  cotton: Object.freeze({
    id: "cotton",
    name: "Cotton",
    photo: "/crops/cotton.jpg",
    svg: COTTON_CROP_SVG,
    emoji: "☁️",
  }),
  sugarcane: Object.freeze({
    id: "sugarcane",
    name: "Sugarcane",
    photo: "/crops/sugarcane.jpg",
    svg: SUGARCANE_CROP_SVG,
    emoji: "🎋",
  }),
  mustard: Object.freeze({
    id: "mustard",
    name: "Mustard",
    photo: "/crops/mustard.jpg",
    svg: MUSTARD_CROP_SVG,
    emoji: "🌼",
  }),
  maize: Object.freeze({
    id: "maize",
    name: "Maize / Corn",
    photo: "/crops/maize.jpg",
    svg: MAIZE_CROP_SVG,
    emoji: "🌽",
  }),
  tomato: Object.freeze({
    id: "tomato",
    name: "Tomato",
    photo: "/crops/tomato.jpg",
    svg: TOMATO_CROP_SVG,
    emoji: "🍅",
  }),
  potato: Object.freeze({
    id: "potato",
    name: "Potato",
    photo: "/crops/potato.jpg",
    svg: POTATO_CROP_SVG,
    emoji: "🥔",
  }),
  soybean: Object.freeze({
    id: "soybean",
    name: "Soybean",
    photo: "/crops/soybean.jpg",
    svg: SOYBEAN_CROP_SVG,
    emoji: "🌱",
  }),
  chilli: Object.freeze({
    id: "chilli",
    name: "Chilli",
    photo: "/crops/chilli.jpg",
    svg: CHILLI_CROP_SVG,
    emoji: "🌶️",
  }),
  onion: Object.freeze({
    id: "onion",
    name: "Onion",
    photo: "/crops/onion.jpg",
    svg: ONION_CROP_SVG,
    emoji: "🧅",
  }),
  groundnut: Object.freeze({
    id: "groundnut",
    name: "Groundnut / Peanut",
    photo: "/crops/groundnut.jpg",
    svg: GROUNDNUT_CROP_SVG,
    emoji: "🥜",
  }),
});

/**
 * Returns distinct photo and fallback SVG for any crop name or id in any language.
 */
export function getCropVisual(cropNameOrId: string): { image: string; fallback: string; emoji: string } {
  const norm = (cropNameOrId || "").toLowerCase();
  
  if (norm.includes("wheat") || norm.includes("गेहूं") || norm.includes("sharbati") || norm.includes("lokwan") || norm.includes("godhumai")) {
    return { image: CROP_VISUALS.wheat.photo, fallback: CROP_VISUALS.wheat.svg, emoji: CROP_VISUALS.wheat.emoji };
  }
  if (norm.includes("paddy") || norm.includes("rice") || norm.includes("धान") || norm.includes("चावल") || norm.includes("వరి") || norm.includes("நெல்")) {
    return { image: CROP_VISUALS.rice.photo, fallback: CROP_VISUALS.rice.svg, emoji: CROP_VISUALS.rice.emoji };
  }
  if (norm.includes("cotton") || norm.includes("कपास") || norm.includes("bt") || norm.includes("పత్తి") || norm.includes("பருத்தி")) {
    return { image: CROP_VISUALS.cotton.photo, fallback: CROP_VISUALS.cotton.svg, emoji: CROP_VISUALS.cotton.emoji };
  }
  if (norm.includes("sugarcane") || norm.includes("गन्ना") || norm.includes("ऊस") || norm.includes("చెరకు") || norm.includes("கரும்பு")) {
    return { image: CROP_VISUALS.sugarcane.photo, fallback: CROP_VISUALS.sugarcane.svg, emoji: CROP_VISUALS.sugarcane.emoji };
  }
  if (norm.includes("mustard") || norm.includes("सरसों") || norm.includes("pusa") || norm.includes("मोहरी") || norm.includes("ఆవాలు") || norm.includes("கடுகு")) {
    return { image: CROP_VISUALS.mustard.photo, fallback: CROP_VISUALS.mustard.svg, emoji: CROP_VISUALS.mustard.emoji };
  }
  if (norm.includes("maize") || norm.includes("corn") || norm.includes("मक्का") || norm.includes("मका") || norm.includes("మొక్కజొన్న") || norm.includes("மக்காச்சோளம்")) {
    return { image: CROP_VISUALS.maize.photo, fallback: CROP_VISUALS.maize.svg, emoji: CROP_VISUALS.maize.emoji };
  }
  if (norm.includes("tomato") || norm.includes("टमाटर") || norm.includes("टोमॅटो") || norm.includes("టమోటా") || norm.includes("தக்காளி")) {
    return { image: CROP_VISUALS.tomato.photo, fallback: CROP_VISUALS.tomato.svg, emoji: CROP_VISUALS.tomato.emoji };
  }
  if (norm.includes("potato") || norm.includes("आलू") || norm.includes("बटाटा") || norm.includes("బంగాళాదుంప") || norm.includes("உருளை")) {
    return { image: CROP_VISUALS.potato.photo, fallback: CROP_VISUALS.potato.svg, emoji: CROP_VISUALS.potato.emoji };
  }
  if (norm.includes("soybean") || norm.includes("सोयाबीन") || norm.includes("சோயாபீன்") || norm.includes("సోయాబీన్")) {
    return { image: CROP_VISUALS.soybean.photo, fallback: CROP_VISUALS.soybean.svg, emoji: CROP_VISUALS.soybean.emoji };
  }
  if (norm.includes("chilli") || norm.includes("chili") || norm.includes("pepper") || norm.includes("मिर्च") || norm.includes("మిరప") || norm.includes("மிளகாய்")) {
    return { image: CROP_VISUALS.chilli.photo, fallback: CROP_VISUALS.chilli.svg, emoji: CROP_VISUALS.chilli.emoji };
  }
  if (norm.includes("onion") || norm.includes("प्याज") || norm.includes("कांदा") || norm.includes("ఉల్లి") || norm.includes("வெங்காயம்")) {
    return { image: CROP_VISUALS.onion.photo, fallback: CROP_VISUALS.onion.svg, emoji: CROP_VISUALS.onion.emoji };
  }
  if (norm.includes("groundnut") || norm.includes("peanut") || norm.includes("मूंगफली") || norm.includes("भुईमूग") || norm.includes("వేరుశెనగ") || norm.includes("நிலக்கடலை")) {
    return { image: CROP_VISUALS.groundnut.photo, fallback: CROP_VISUALS.groundnut.svg, emoji: CROP_VISUALS.groundnut.emoji };
  }

  // Exact key match fallback
  if (CROP_VISUALS[norm]) {
    return {
      image: CROP_VISUALS[norm].photo,
      fallback: CROP_VISUALS[norm].svg,
      emoji: CROP_VISUALS[norm].emoji,
    };
  }

  return {
    image: CROP_VISUALS.wheat.photo,
    fallback: CROP_VISUALS.wheat.svg,
    emoji: CROP_VISUALS.wheat.emoji,
  };
}
