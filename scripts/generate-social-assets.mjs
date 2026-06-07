// Generates the social-share images + favicons for synaplan.eu.
//
// Output (committed under public/):
//   og/og-default.png    1200x630  — Open Graph / Facebook
//   og/og-linkedin.png   1200x627  — LinkedIn
//   og/og-twitter.png    1200x675  — Twitter / X (summary_large_image)
//   og/og-square.png     1200x1200 — square fallback (WhatsApp / Mastodon)
//   og/og-default.svg ... (vector sources, one per format)
//   icon.svg             scalable parrot-on-blue mark (modern browsers)
//   icon-192.png / icon-512.png   PWA / Android
//   apple-icon.png       180x180   — iOS home screen
//   favicon.ico          16/32/48  — legacy
//
// No runtime/npm dependency: rasterization uses the system Chromium in
// headless mode. Re-run with:  node scripts/generate-social-assets.mjs
//
// Tweak SIZES / colors / copy below and re-run to iterate.

import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = join(__dirname, '..')
const PUBLIC = join(REPO, 'public')
const OG_DIR = join(PUBLIC, 'og')
// Snap Chromium is confined to $HOME, so render there and copy results back.
const WORK = join(os.homedir(), '.cache', 'synaplan-og-build')

mkdirSync(OG_DIR, { recursive: true })
mkdirSync(WORK, { recursive: true })

// ── Brand ────────────────────────────────────────────────────────────────────
const BLUE = '#002c92'
const BLUE_LIGHT = '#003fc7'
const INK = '#1b2233'
const EU_BLUE = '#003399'
const EU_GOLD = '#ffcc00'
const CH_RED = '#d52b1e'

const TITLE = 'Souverän by design'
const SUBTITLE = 'Open Source von der KI bis zum Browser'
const DOMAIN = 'synaplan.eu'

// Parrot glyph lifted from public/synaplan_logo.svg (bbox ≈ 0..25 × 0.5..32.5).
const PARROT_D =
  'M16.4871 32.1708C16.5338 30.983 15.7888 30.0543 14.7054 29.6512C13.7515 29.2949 12.6393 29.5684 11.6423 29.4496C10.6669 30.569 9.45389 31.4761 8.00694 31.8792C6.84075 32.2032 5.66736 32.1852 4.46517 32.1708C4.44717 32.088 4.47596 32.1132 4.51196 32.0916C4.88269 31.854 5.4154 31.6489 5.82213 31.4221C7.6866 30.3747 9.25233 28.9853 10.5121 27.2576L12.4414 27.2432C16.1703 27.1676 20.018 24.4285 19.7661 20.3829C19.5249 16.5063 15.1589 15.6569 12.3262 14.2531C11.4947 13.8392 10.5985 13.3137 10.1486 12.4715C9.21993 10.733 10.4185 8.79652 12.3298 8.66694C12.9921 8.62015 14.0107 8.62375 14.673 8.66694C15.4468 8.71734 16.3827 9.05567 16.6598 9.84753C17.2933 11.6508 14.6586 12.2195 14.5038 10.3658C13.7767 10.3262 12.3802 10.3047 12.5314 11.3845C12.6825 12.4643 13.3088 12.2879 13.7155 12.5039C14.7558 13.0582 15.9436 13.4469 17.0162 13.9544C17.4841 14.1776 17.9448 14.4223 18.3947 14.6815C18.5459 13.7744 18.4955 12.853 18.5027 11.9352C19.9424 11.0281 20.0792 9.14206 18.9706 7.89668C17.3653 6.08261 14.3526 6.06461 12.1102 6.18699C8.68003 6.37415 5.79693 9.14926 6.82995 12.7306C7.83778 16.2292 12.1174 16.5747 14.8313 18.0829C17.8764 19.7782 16.9694 23.7555 13.8055 24.6517C12.4702 25.0296 11.0556 24.7885 9.68425 24.8857C7.57862 28.4418 3.95406 30.8534 0.00194953 31.9224C-0.023246 31.8972 0.203514 31.5841 0.235908 31.5265C1.48849 29.2625 1.45969 26.7429 1.72965 24.2378C2.07519 21.0199 2.65108 17.4566 5.58097 15.5633C4.80351 14.7211 4.33559 13.5981 4.18442 12.4643C4.01525 11.2117 4.15202 9.90872 4.64873 8.74613C2.89584 8.58776 1.70085 6.91766 1.4093 5.29075C3.01462 5.81265 4.69553 6.05741 6.37643 6.19059L5.15265 5.63269C4.15202 5.07479 3.42495 4.26853 3.09381 3.15633C2.83465 2.28888 2.81306 1.39984 2.88864 0.5C4.33199 1.83536 6.11368 2.95836 8.02854 3.47667C11.5163 4.4197 15.1193 3.20312 18.4991 4.70405C20.5867 5.63269 22.7176 7.75991 22.1273 10.2543C24.4489 11.0821 25.7338 13.7312 24.7188 16.0456C24.2905 17.0247 23.4266 17.8813 22.3972 18.2052C22.7176 17.4458 22.8183 15.8549 21.8681 15.5129C21.8213 15.4949 21.6126 15.4337 21.5874 15.4337H19.8777C20.0756 15.8729 20.432 16.1824 20.7199 16.5531C23.6714 20.3469 21.7709 25.4867 18.024 27.8875C17.7108 28.0891 17.3689 28.2547 17.0702 28.4634C17.1997 28.5786 17.2933 28.5138 17.4445 28.539C18.985 28.8054 20.2448 29.9176 20.45 31.5085C20.4752 31.7172 20.4788 31.9584 20.4896 32.1708H16.4943H16.4871Z'
const PARROT_W = 24.95
const PARROT_H = 32.0

const FONT_B64 = readFileSync(
  join(__dirname, 'fonts', 'PlusJakartaSans-latin-var.woff2'),
).toString('base64')

const fontFace = `@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:200 800;font-display:block;src:url(data:font/woff2;base64,${FONT_B64}) format('woff2');}`

// ── Helpers ────────────────────────────────────────────────────────────────
/** White parrot, scaled to `h` px tall, top-left anchored at (x,y). */
function parrot(x, y, h, fill = '#fff') {
  const s = h / PARROT_H
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="${PARROT_D}" fill="${fill}"/></g>`
}

/** 5-pointed star path (point up) centred at (cx,cy), outer radius r. */
function star(cx, cy, r) {
  const inner = r * 0.382
  let d = ''
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : inner
    const a = (Math.PI / 5) * i - Math.PI / 2
    const px = cx + rad * Math.cos(a)
    const py = cy + rad * Math.sin(a)
    d += (i === 0 ? 'M' : 'L') + px.toFixed(2) + ' ' + py.toFixed(2)
  }
  return `<path d="${d}Z" fill="${EU_GOLD}"/>`
}

/** EU flag (rounded rect + 12 stars in a circle). */
function euFlag(x, y, w, h, rx) {
  const cx = x + w / 2
  const cy = y + h / 2
  const ring = Math.min(w, h) * 0.3
  const sr = Math.min(w, h) * 0.082
  let stars = ''
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180
    stars += star(cx + ring * Math.sin(a), cy - ring * Math.cos(a), sr)
  }
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${EU_BLUE}"/>${stars}</g>`
}

/** Swiss flag (rounded red square + white cross). */
function swissFlag(x, y, s, rx) {
  const arm = s * 0.16
  const len = s * 0.56
  const cx = x + s / 2
  const cy = y + s / 2
  return `<g><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${rx}" fill="${CH_RED}"/>` +
    `<rect x="${cx - arm / 2}" y="${cy - len / 2}" width="${arm}" height="${len}" rx="${arm * 0.12}" fill="#fff"/>` +
    `<rect x="${cx - len / 2}" y="${cy - arm / 2}" width="${len}" height="${arm}" rx="${arm * 0.12}" fill="#fff"/></g>`
}

// ── Social card ──────────────────────────────────────────────────────────────
function card(W, H) {
  const cx = W / 2
  const cy = H / 2
  const square = W === H

  // Flags (EU landscape + CH square), centred as a pair.
  const euW = 196
  const euH = 138
  const chS = 138
  const gap = 30
  const flagsW = euW + gap + chS
  const flagsX = cx - flagsW / 2
  const flagsTop = cy - (square ? 320 : 232)
  const flags =
    euFlag(flagsX, flagsTop, euW, euH, 18) +
    swissFlag(flagsX + euW + gap, flagsTop, chS, 18)

  const titleSize = square ? 104 : 96
  const subSize = square ? 40 : 38
  const titleY = cy + (square ? 70 : 34)
  const subY = titleY + (square ? 86 : 76)

  // Footer lockup: parrot mark + domain, plus a playful speech bubble.
  const footY = H - (square ? 120 : 78)
  const markH = 40
  const domainSize = 28
  // crude centring of [parrot][gap][domain]
  const gap2 = 16
  const domainW = DOMAIN.length * domainSize * 0.56
  const lockW = PARROT_W * (markH / PARROT_H) + gap2 + domainW
  const lockX = cx - lockW / 2
  const markX = lockX
  const markY = footY - markH
  const domX = lockX + PARROT_W * (markH / PARROT_H) + gap2

  // Speech bubble (the parrot "squawks" — sovereign humour).
  const bubbleText = 'Squawk – souverän!'
  const bubbleW = 296
  const bubbleH = 56
  const bubbleX = cx + lockW / 2 + 26
  const bubbleY = footY - markH - 12
  const bubble =
    `<g font-family="'Plus Jakarta Sans'">` +
    `<rect x="${bubbleX}" y="${bubbleY}" width="${bubbleW}" height="${bubbleH}" rx="${bubbleH / 2}" fill="${BLUE}"/>` +
    `<path d="M${bubbleX + 4} ${bubbleY + bubbleH / 2 + 6} l-22 8 l16 -16 Z" fill="${BLUE}"/>` +
    `<text x="${bubbleX + bubbleW / 2}" y="${bubbleY + bubbleH / 2}" font-size="26" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="central">${bubbleText}</text>` +
    `</g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<style>${fontFace}</style>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#eef1f6"/>
<stop offset="1" stop-color="#dde1e9"/>
</linearGradient>
<radialGradient id="glow" cx="0.5" cy="0.18" r="0.7">
<stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/>
<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</radialGradient>
<filter id="flagShadow" x="-30%" y="-30%" width="160%" height="160%">
<feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#0b1b4d" flood-opacity="0.22"/>
</filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<g filter="url(#flagShadow)">${flags}</g>
<text x="${cx}" y="${titleY}" font-family="'Plus Jakarta Sans'" font-size="${titleSize}" font-weight="800" fill="${INK}" text-anchor="middle" letter-spacing="-2">${TITLE}</text>
<text x="${cx}" y="${subY}" font-family="'Plus Jakarta Sans'" font-size="${subSize}" font-weight="700" fill="${BLUE}" text-anchor="middle">${SUBTITLE}</text>
${parrot(markX, markY, markH, BLUE)}
<text x="${domX}" y="${footY - markH / 2}" font-family="'Plus Jakarta Sans'" font-size="${domainSize}" font-weight="700" fill="#5a6172" dominant-baseline="central">${DOMAIN}</text>
${bubble}
</svg>`
}

// ── App icon (parrot on blue) ────────────────────────────────────────────────
function icon(size, { sunglasses = false, pad = 0.17, radius = 0.22 } = {}) {
  const S = size
  const rx = S * radius
  const inner = S * (1 - pad * 2)
  const h = inner
  const s = h / PARROT_H
  const w = PARROT_W * s
  const x = (S - w) / 2
  const y = (S - h) / 2
  let glasses = ''
  if (sunglasses) {
    // Cheeky dark shades on the parrot's head (visible on the white glyph).
    const gy = y + h * 0.27
    const lens = w * 0.3
    const lh = lens * 0.66
    const gx = x + w * 0.42
    const bridge = lens * 0.26
    glasses =
      `<g fill="#0a1024">` +
      `<rect x="${gx}" y="${gy}" width="${lens}" height="${lh}" rx="${lh * 0.32}"/>` +
      `<rect x="${gx + lens + bridge}" y="${gy}" width="${lens}" height="${lh}" rx="${lh * 0.32}"/>` +
      `<rect x="${gx + lens}" y="${gy + lh * 0.32}" width="${bridge}" height="${lh * 0.24}"/>` +
      `</g>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${BLUE_LIGHT}"/><stop offset="1" stop-color="${BLUE}"/>
</linearGradient></defs>
<rect width="${S}" height="${S}" rx="${rx}" fill="url(#b)"/>
${parrot(x, y, h, '#fff')}
${glasses}
</svg>`
}

// ── Rasterize via headless Chromium ──────────────────────────────────────────
const CHROME =
  process.env.CHROME_BIN ||
  ['chromium', 'chromium-browser', 'google-chrome'].find((c) => {
    try { execFileSync('command', ['-v', c]); return true } catch { return false }
  }) ||
  'chromium'

function rasterize(svg, w, h, outPng, { transparent = false } = {}) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0}html,body{width:${w}px;height:${h}px;overflow:hidden}</style></head><body>${svg}</body></html>`
  const htmlPath = join(WORK, 'page.html')
  const shotPath = join(WORK, 'shot.png')
  writeFileSync(htmlPath, html)
  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${w},${h}`,
    `--screenshot=${shotPath}`,
  ]
  if (transparent) args.push('--default-background-color=00000000')
  args.push('file://' + htmlPath)
  execFileSync(CHROME, args, { stdio: 'ignore' })
  copyFileSync(shotPath, outPng)
}

// ── Minimal ICO writer (wraps PNG frames) ────────────────────────────────────
function writeIco(pngPaths, outPath) {
  const imgs = pngPaths.map((p) => readFileSync(p))
  const count = imgs.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(count, 4)
  const dir = Buffer.alloc(16 * count)
  let offset = 6 + 16 * count
  const sizes = [16, 32, 48]
  imgs.forEach((img, i) => {
    const sz = sizes[i] ?? 32
    const b = i * 16
    dir.writeUInt8(sz >= 256 ? 0 : sz, b + 0)
    dir.writeUInt8(sz >= 256 ? 0 : sz, b + 1)
    dir.writeUInt8(0, b + 2)
    dir.writeUInt8(0, b + 3)
    dir.writeUInt16LE(1, b + 4)
    dir.writeUInt16LE(32, b + 6)
    dir.writeUInt32LE(img.length, b + 8)
    dir.writeUInt32LE(offset, b + 12)
    offset += img.length
  })
  writeFileSync(outPath, Buffer.concat([header, dir, ...imgs]))
}

// ── Build ────────────────────────────────────────────────────────────────────
const CARDS = [
  ['og-default', 1200, 630],
  ['og-linkedin', 1200, 627],
  ['og-twitter', 1200, 675],
  ['og-square', 1200, 1200],
]

console.log('Rendering social cards…')
for (const [name, w, h] of CARDS) {
  const svg = card(w, h)
  writeFileSync(join(OG_DIR, `${name}.svg`), svg)
  rasterize(svg, w, h, join(OG_DIR, `${name}.png`))
  console.log(`  ✓ og/${name}.png (${w}×${h})`)
}

console.log('Rendering icons…')
const iconSvg = icon(512, { sunglasses: true })
writeFileSync(join(PUBLIC, 'icon.svg'), iconSvg)
for (const s of [192, 512]) {
  rasterize(icon(s, { sunglasses: true }), s, s, join(PUBLIC, `icon-${s}.png`), { transparent: true })
  console.log(`  ✓ icon-${s}.png`)
}
rasterize(icon(180, { sunglasses: true }), 180, 180, join(PUBLIC, 'apple-icon.png'), { transparent: true })
console.log('  ✓ apple-icon.png')

// Favicon: clean parrot (no shades — keeps it legible at 16px).
const icoFrames = []
for (const s of [16, 32, 48]) {
  const p = join(WORK, `fav-${s}.png`)
  rasterize(icon(s, { sunglasses: false, pad: 0.13, radius: 0.2 }), s, s, p, { transparent: true })
  icoFrames.push(p)
}
writeIco(icoFrames, join(PUBLIC, 'favicon.ico'))
console.log('  ✓ favicon.ico (16/32/48)')

rmSync(WORK, { recursive: true, force: true })
console.log('Done.')
