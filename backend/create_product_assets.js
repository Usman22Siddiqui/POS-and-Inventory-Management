const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Map of 3D SVGs per SKU in Mossy Hollow palette
const productSVGs = {
  'frg-002': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#BAC095" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#636B2F" stop-opacity="0.1"/>
      </radialGradient>
      <filter id="shadow3d" x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#3D4127" flood-opacity="0.25"/>
      </filter>
    </defs>
    <rect width="400" height="400" fill="url(#bg)" rx="24"/>
    <!-- 3D Ceramic Plates -->
    <ellipse cx="200" cy="270" rx="130" ry="45" fill="#3D4127" opacity="0.18"/>
    <!-- Bottom Plate -->
    <g filter="url(#shadow3d)">
      <ellipse cx="200" cy="240" rx="120" ry="40" fill="#636B2F"/>
      <ellipse cx="200" cy="235" rx="114" ry="36" fill="#BAC095"/>
      <ellipse cx="200" cy="235" rx="80" ry="24" fill="#F7F8F1"/>
    </g>
    <!-- Middle Plate -->
    <g filter="url(#shadow3d)">
      <ellipse cx="200" cy="205" rx="100" ry="34" fill="#3D4127"/>
      <ellipse cx="200" cy="200" rx="94" ry="30" fill="#D4DE95"/>
      <ellipse cx="200" cy="200" rx="64" ry="20" fill="#F7F8F1"/>
    </g>
    <!-- Top Plate -->
    <g filter="url(#shadow3d)">
      <ellipse cx="200" cy="168" rx="80" ry="28" fill="#636B2F"/>
      <ellipse cx="200" cy="164" rx="74" ry="24" fill="#BAC095"/>
      <ellipse cx="200" cy="164" rx="48" ry="15" fill="#FFFFFF"/>
    </g>
    <text x="200" y="350" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">CERAMIC PLATES</text>
  </svg>`,

  'frg-003': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="vaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D4DE95"/>
        <stop offset="50%" stop-color="#BAC095"/>
        <stop offset="100%" stop-color="#636B2F"/>
      </linearGradient>
      <filter id="glow">
        <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#3D4127" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="320" rx="70" ry="20" fill="#3D4127" opacity="0.15"/>
    <g filter="url(#glow)">
      <!-- Vase body 3D shape -->
      <path d="M 170 100 Q 150 160 130 220 Q 120 280 200 290 Q 280 280 270 220 Q 250 160 230 100 Z" fill="url(#vaseGrad)"/>
      <ellipse cx="200" cy="100" rx="30" ry="10" fill="#3D4127"/>
      <ellipse cx="200" cy="98" rx="26" ry="8" fill="#D4DE95"/>
      <!-- Botanical Leaf stem -->
      <path d="M 200 95 Q 220 40 260 30" stroke="#3D4127" stroke-width="4" fill="none"/>
      <path d="M 230 65 Q 260 55 255 75 Q 240 75 230 65 Z" fill="#636B2F"/>
      <path d="M 260 30 Q 280 25 285 45 Q 270 45 260 30 Z" fill="#BAC095"/>
    </g>
    <text x="200" y="360" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">ARTISAN GLASS VASE</text>
  </svg>`,

  'cld-002': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="yogurtTub" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#BAC095"/>
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="15" stdDeviation="12" flood-color="#3D4127" flood-opacity="0.2"/>
      </filter>
    </defs>
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="300" rx="90" ry="25" fill="#3D4127" opacity="0.15"/>
    <g filter="url(#shadow)">
      <!-- Tub Base -->
      <path d="M 130 170 L 150 280 Q 200 300 250 280 L 270 170 Z" fill="url(#yogurtTub)"/>
      <!-- Label Band -->
      <path d="M 137 205 L 146 255 Q 200 272 254 255 L 263 205 Q 200 220 137 205 Z" fill="#636B2F"/>
      <text x="200" y="240" font-family="sans-serif" font-size="13" font-weight="bold" fill="#D4DE95" text-anchor="middle">GREEK YOGURT</text>
      <!-- Tub Lid -->
      <ellipse cx="200" cy="170" rx="72" ry="24" fill="#3D4127"/>
      <ellipse cx="200" cy="166" rx="70" ry="22" fill="#D4DE95"/>
      <ellipse cx="200" cy="166" rx="45" ry="12" fill="#636B2F"/>
    </g>
    <text x="200" y="360" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">HONEY GREEK YOGURT</text>
  </svg>`,

  'cld-003': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="salmonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#C99A3C"/>
        <stop offset="50%" stop-color="#A6493B"/>
        <stop offset="100%" stop-color="#8a3024"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="285" rx="105" ry="35" fill="#3D4127" opacity="0.16"/>
    <!-- Board -->
    <ellipse cx="200" cy="245" rx="120" ry="45" fill="#3D4127"/>
    <ellipse cx="200" cy="238" rx="116" ry="42" fill="#BAC095"/>
    <!-- Salmon Fillet 3D -->
    <path d="M 120 230 Q 180 180 270 200 Q 290 230 250 250 Q 160 260 120 230 Z" fill="url(#salmonGrad)"/>
    <!-- White marbling lines -->
    <path d="M 150 215 Q 180 230 200 245" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M 190 205 Q 220 220 240 235" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M 230 200 Q 255 210 265 220" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
    <!-- Herb Garnish -->
    <circle cx="160" cy="205" r="4" fill="#636B2F"/>
    <circle cx="168" cy="202" r="3" fill="#636B2F"/>
    <text x="200" y="350" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">SMOKED SALMON FILLET</text>
  </svg>`,

  'cld-004': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="290" rx="90" ry="28" fill="#3D4127" opacity="0.15"/>
    <!-- Bowl -->
    <ellipse cx="200" cy="250" rx="100" ry="38" fill="#636B2F"/>
    <ellipse cx="200" cy="245" rx="95" ry="34" fill="#D4DE95"/>
    <!-- Mozzarella Ball 3D -->
    <circle cx="200" cy="200" r="55" fill="#3D4127" opacity="0.2"/>
    <circle cx="196" cy="190" r="55" fill="#FFFFFF"/>
    <!-- Basil leaves -->
    <path d="M 190 140 Q 230 130 220 165 Q 200 160 190 140 Z" fill="#636B2F"/>
    <path d="M 160 170 Q 140 140 180 150 Q 170 170 160 170 Z" fill="#BAC095"/>
    <!-- Drizzle -->
    <path d="M 180 180 Q 210 200 230 195" stroke="#C99A3C" stroke-width="4" stroke-linecap="round" fill="none"/>
    <text x="200" y="350" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">FRESH MOZZARELLA</text>
  </svg>`,

  'tch-002': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="285" rx="95" ry="25" fill="#3D4127" opacity="0.18"/>
    <!-- 3D Hub Body -->
    <g>
      <!-- Base extrusion -->
      <rect x="110" y="160" width="180" height="90" rx="16" fill="#3D4127"/>
      <rect x="110" y="150" width="180" height="90" rx="16" fill="#636B2F"/>
      <!-- Top Bevel -->
      <rect x="118" y="156" width="164" height="78" rx="10" fill="#BAC095"/>
      <!-- USB Ports -->
      <rect x="135" y="175" width="22" height="10" rx="2" fill="#3D4127"/>
      <rect x="170" y="175" width="22" height="10" rx="2" fill="#3D4127"/>
      <rect x="205" y="175" width="22" height="10" rx="2" fill="#3D4127"/>
      <rect x="240" y="175" width="22" height="10" rx="2" fill="#3D4127"/>
      <!-- LED Indicator -->
      <circle cx="130" cy="210" r="4" fill="#D4DE95"/>
      <text x="200" y="215" font-family="monospace" font-size="11" fill="#3D4127" text-anchor="middle" font-weight="bold">USB-C HUB 7-PORT</text>
      <!-- Cable -->
      <path d="M 290 195 Q 340 195 340 140" stroke="#3D4127" stroke-width="8" stroke-linecap="round" fill="none"/>
    </g>
    <text x="200" y="350" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">USB-C CHARGING HUB</text>
  </svg>`,

  'tch-003': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="290" rx="120" ry="30" fill="#3D4127" opacity="0.18"/>
    <!-- 3D Keyboard Base -->
    <g>
      <rect x="80" y="150" width="240" height="110" rx="14" fill="#3D4127"/>
      <rect x="80" y="140" width="240" height="110" rx="14" fill="#636B2F"/>
      <!-- Key Matrix -->
      <!-- Row 1 -->
      <rect x="95" y="152" width="24" height="16" rx="4" fill="#D4DE95"/>
      <rect x="125" y="152" width="24" height="16" rx="4" fill="#BAC095"/>
      <rect x="155" y="152" width="24" height="16" rx="4" fill="#BAC095"/>
      <rect x="185" y="152" width="24" height="16" rx="4" fill="#BAC095"/>
      <rect x="215" y="152" width="24" height="16" rx="4" fill="#BAC095"/>
      <rect x="245" y="152" width="24" height="16" rx="4" fill="#BAC095"/>
      <rect x="275" y="152" width="30" height="16" rx="4" fill="#3D4127"/>

      <!-- Row 2 -->
      <rect x="95" y="174" width="30" height="16" rx="4" fill="#3D4127"/>
      <rect x="131" y="174" width="24" height="16" rx="4" fill="#BAC095"/>
      <rect x="161" y="174" width="24" height="16" rx="4" fill="#BAC095"/>
      <rect x="191" y="174" width="24" height="16" rx="4" fill="#BAC095"/>
      <rect x="221" y="174" width="24" height="16" rx="4" fill="#BAC095"/>
      <rect x="251" y="174" width="24" height="16" rx="4" fill="#D4DE95"/>
      <rect x="281" y="174" width="24" height="16" rx="4" fill="#3D4127"/>

      <!-- Row 3 - Spacebar -->
      <rect x="95" y="196" width="36" height="16" rx="4" fill="#3D4127"/>
      <rect x="137" y="196" width="120" height="16" rx="4" fill="#D4DE95"/>
      <rect x="263" y="196" width="42" height="16" rx="4" fill="#3D4127"/>
    </g>
    <text x="200" y="350" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">MECHANICAL KEYBOARD</text>
  </svg>`,

  'cln-001': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="305" rx="80" ry="24" fill="#3D4127" opacity="0.18"/>
    <!-- Industrial Canister -->
    <g>
      <rect x="130" y="140" width="140" height="150" rx="20" fill="#3D4127"/>
      <rect x="130" y="130" width="140" height="150" rx="20" fill="#C99A3C"/>
      <!-- Warning Band -->
      <rect x="130" y="180" width="140" height="50" fill="#A6493B"/>
      <polygon points="175,215 200,188 225,215" fill="#F7F8F1"/>
      <text x="200" y="212" font-family="sans-serif" font-weight="bold" font-size="16" fill="#A6493B" text-anchor="middle">!</text>
      <!-- Handle -->
      <path d="M 160 130 L 160 85 Q 200 70 240 85 L 240 130" stroke="#3D4127" stroke-width="12" stroke-linecap="round" fill="none"/>
      <!-- Cap -->
      <rect x="230" y="90" width="30" height="20" rx="4" fill="#3D4127"/>
    </g>
    <text x="200" y="360" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">INDUSTRIAL DEGREASER</text>
  </svg>`,

  'cln-002': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="310" rx="65" ry="20" fill="#3D4127" opacity="0.15"/>
    <!-- Eco Spray Bottle -->
    <g>
      <!-- Bottle Body -->
      <path d="M 160 160 Q 150 220 150 280 Q 200 300 250 280 Q 250 220 240 160 Z" fill="#BAC095"/>
      <!-- Label -->
      <rect x="160" y="200" width="80" height="55" rx="6" fill="#636B2F"/>
      <text x="200" y="225" font-family="sans-serif" font-size="11" font-weight="bold" fill="#D4DE95" text-anchor="middle">ECO FLOOR</text>
      <text x="200" y="242" font-family="sans-serif" font-size="9" fill="#FFFFFF" text-anchor="middle">LAVENDER 1L</text>
      <!-- Trigger Mechanism -->
      <rect x="180" y="125" width="40" height="35" fill="#3D4127"/>
      <path d="M 180 125 L 140 120 L 140 100 L 230 100 L 245 125 Z" fill="#636B2F"/>
      <path d="M 170 125 Q 160 145 175 160" stroke="#3D4127" stroke-width="6" stroke-linecap="round" fill="none"/>
    </g>
    <text x="200" y="360" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">ECO FLOOR CLEANER</text>
  </svg>`,

  'cln-003': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="305" rx="65" ry="20" fill="#3D4127" opacity="0.15"/>
    <!-- Bleach Bottle -->
    <g>
      <path d="M 165 140 L 155 280 Q 200 300 245 280 L 235 140 Z" fill="#D4DE95"/>
      <rect x="157" y="195" width="86" height="50" rx="4" fill="#A6493B"/>
      <text x="200" y="225" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FFFFFF" text-anchor="middle">BLEACH</text>
      <!-- Safety Cap -->
      <rect x="185" y="100" width="30" height="40" rx="6" fill="#3D4127"/>
      <!-- Hazard Diamond -->
      <polygon points="200,230 207,237 200,244 193,237" fill="#C99A3C"/>
    </g>
    <text x="200" y="360" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">BLEACH CONCENTRATE</text>
  </svg>`,

  'gen-001': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="300" rx="85" ry="25" fill="#3D4127" opacity="0.15"/>
    <!-- Tote Bag -->
    <g>
      <path d="M 130 170 L 140 290 Q 200 305 260 290 L 270 170 Z" fill="#BAC095"/>
      <path d="M 130 170 Q 200 180 270 170" stroke="#636B2F" stroke-width="4" fill="none"/>
      <!-- Handles -->
      <path d="M 165 170 Q 165 80 200 80 Q 235 80 235 170" stroke="#3D4127" stroke-width="8" stroke-linecap="round" fill="none"/>
      <!-- Pocket / Motif -->
      <rect x="175" y="210" width="50" height="45" rx="4" fill="#636B2F"/>
      <circle cx="200" cy="232" r="10" fill="#D4DE95"/>
    </g>
    <text x="200" y="350" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">COTTON TOTE BAG</text>
  </svg>`,

  'gen-002': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="290" rx="90" ry="25" fill="#3D4127" opacity="0.15"/>
    <!-- Beeswax Candles -->
    <!-- Candle 1 -->
    <g>
      <rect x="135" y="160" width="35" height="110" rx="6" fill="#C99A3C"/>
      <ellipse cx="152" cy="160" rx="17" ry="6" fill="#D4DE95"/>
      <path d="M 152 160 L 152 145" stroke="#3D4127" stroke-width="2"/>
      <path d="M 152 145 Q 160 130 152 120 Q 144 130 152 145 Z" fill="#636B2F"/>
    </g>
    <!-- Candle 2 (Taller) -->
    <g>
      <rect x="182" y="130" width="36" height="140" rx="6" fill="#636B2F"/>
      <ellipse cx="200" cy="130" rx="18" ry="6" fill="#BAC095"/>
      <path d="M 200 130 L 200 115" stroke="#3D4127" stroke-width="2"/>
      <path d="M 200 115 Q 208 100 200 90 Q 192 100 200 115 Z" fill="#C99A3C"/>
    </g>
    <!-- Candle 3 -->
    <g>
      <rect x="230" y="180" width="35" height="90" rx="6" fill="#BAC095"/>
      <ellipse cx="247" cy="180" rx="17" ry="6" fill="#D4DE95"/>
      <path d="M 247 180 L 247 165" stroke="#3D4127" stroke-width="2"/>
      <path d="M 247 165 Q 255 150 247 140 Q 239 150 247 165 Z" fill="#636B2F"/>
    </g>
    <text x="200" y="350" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">BEESWAX CANDLE SET</text>
  </svg>`,

  'gen-003': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="285" rx="90" ry="25" fill="#3D4127" opacity="0.15"/>
    <!-- Notebook Isometric -->
    <g>
      <path d="M 130 160 L 250 120 L 270 240 L 150 280 Z" fill="#3D4127"/>
      <path d="M 125 150 L 245 110 L 265 230 L 145 270 Z" fill="#636B2F"/>
      <!-- Inner Pages -->
      <path d="M 135 155 L 240 120 L 255 225 L 150 260 Z" fill="#BAC095"/>
      <!-- Bookmark ribbon -->
      <path d="M 190 135 L 205 250 L 215 245 L 200 130 Z" fill="#C99A3C"/>
      <!-- Label -->
      <rect x="165" y="165" width="60" height="40" rx="4" fill="#F7F8F1" transform="rotate(-18 195 185)"/>
    </g>
    <text x="200" y="350" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">RECYCLED NOTEBOOK</text>
  </svg>`,

  'gen-004': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" fill="#F7F8F1" rx="24"/>
    <ellipse cx="200" cy="290" rx="100" ry="25" fill="#3D4127" opacity="0.15"/>
    <!-- Bamboo Cutting Board -->
    <g>
      <!-- Board Base Extrusion -->
      <rect x="100" y="165" width="200" height="100" rx="16" fill="#3D4127"/>
      <rect x="100" y="150" width="200" height="100" rx="16" fill="#BAC095"/>
      <!-- Wood Stripes -->
      <line x1="100" y1="180" x2="300" y2="180" stroke="#636B2F" stroke-width="3" opacity="0.4"/>
      <line x1="100" y1="210" x2="300" y2="210" stroke="#636B2F" stroke-width="3" opacity="0.4"/>
      <line x1="100" y1="230" x2="300" y2="230" stroke="#636B2F" stroke-width="3" opacity="0.4"/>
      <!-- Juice Groove -->
      <rect x="115" y="165" width="170" height="70" rx="8" fill="none" stroke="#636B2F" stroke-width="3"/>
      <!-- Hanging Hole -->
      <circle cx="265" cy="200" r="10" fill="#3D4127"/>
    </g>
    <text x="200" y="350" font-family="sans-serif" font-weight="bold" font-size="14" fill="#3D4127" text-anchor="middle" letter-spacing="2">BAMBOO CUTTING BOARD</text>
  </svg>`,
};

for (const [sku, svgContent] of Object.entries(productSVGs)) {
  const filePath = path.join(uploadsDir, `${sku}.svg`);
  fs.writeFileSync(filePath, svgContent.trim(), 'utf8');
  console.log(`✓ Generated SVG image for ${sku}`);
}

console.log('All product assets created successfully.');
