import type { CSSProperties } from 'react';
import { sources } from './sources';

export function Bowl({ small = false }: { small?: boolean }) {
  if (small) return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M4 17h24c-1 8-6 11-12 11S5 25 4 17Z" fill="currentColor"/><path d="M11 12V6m5 6V3m5 9V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;
  return <svg className="bowl-art" viewBox="0 0 480 430" fill="none" aria-hidden="true">
    <circle cx="242" cy="213" r="184" className="art-orbit" />
    <ellipse cx="243" cy="343" rx="174" ry="31" className="art-plate" />
    <ellipse cx="243" cy="340" rx="147" ry="20" className="art-line" />
    <path d="M109 234c10 84 53 112 133 112s122-28 132-112Z" className="art-bowl" />
    <path d="M130 250c10 52 41 75 84 79" stroke="var(--art-highlight)" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="242" cy="234" rx="133" ry="41" className="art-rim" />
    <ellipse cx="242" cy="235" rx="118" ry="30" className="art-inside" />
    <g transform="translate(161 168) rotate(-15)">
      <path d="M-12 10h84M-12 25h84M-12 40h84M10-12v84M25-12v84M40-12v84" className="art-pins"/>
      <rect width="60" height="60" rx="8" className="art-chip"/>
      <rect x="12" y="12" width="36" height="36" rx="4" className="art-core"/>
      <path d="m25 22-7 8 7 8m10-16 7 8-7 8" className="art-code"/>
    </g>
    <g transform="translate(239 153) rotate(14)">
      <path d="M-12 10h88M-12 27h88M-12 44h88M10-12v88M27-12v88M44-12v88" className="art-pins"/>
      <rect width="64" height="64" rx="8" className="art-chip"/>
      <rect x="12" y="12" width="40" height="40" rx="5" className="art-core"/>
      <path d="M23 26h18M23 33h18M23 40h10" className="art-code"/>
    </g>
    <g transform="translate(207 211) rotate(8)">
      <path d="M-10 9h72M-10 24h72M-10 39h72M9-10v72M24-10v72M39-10v72" className="art-pins"/>
      <rect width="52" height="52" rx="7" className="art-chip"/>
      <rect x="11" y="11" width="30" height="30" rx="4" className="art-core"/>
      <path d="m18 27 6 6 11-13" className="art-code"/>
    </g>
    <path d="M204 128v-16c0-10 12-13 12-24V68m40 62v-13c0-11 13-15 13-26V51m39 90v-13c0-9 12-13 12-22V88" className="art-steam"/>
    <circle cx="216" cy="62" r="4" className="art-dot"/><circle cx="269" cy="45" r="4" className="art-dot"/><circle cx="320" cy="82" r="4" className="art-dot"/>
    <path d="m357 180 35-38m-6-5 12 12m-8-16 12 12m-8-16 12 12m-12-12-11 11" className="art-fork"/>
    <text x="242" y="309" textAnchor="middle" className="art-word">Claus</text>
  </svg>;
}

const steps = [
  { title: 'Buy compute', body: 'On the rewarded testnet', x: 0, y: 0 },
  { title: 'Genesis food', body: 'Your locked agent balance', x: 1, y: 0 },
  { title: 'Run side work', body: 'Useful open model inference', x: 2, y: 0 },
  { title: 'Eat 3, unlock 1', body: 'Draft · settled inference', x: 2, y: 1, href: sources.airdrop },
  { title: 'Buy and burn CLAUS', body: 'From liquid FLOP surplus', x: 1, y: 1 },
  { title: 'Pay stakers and LPs', body: '2.3% default fee on the buy', x: 0, y: 1, href: sources.fees },
];

export function FoodLoop() {
  return <figure className="food-loop" aria-labelledby="loop-caption">
    <div className="loop-grid">
      <svg className="loop-lines" viewBox="0 0 1056 390" preserveAspectRatio="none" aria-hidden="true">
        <defs><marker id="flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="m1 1 7 4-7 4" fill="none" stroke="currentColor" strokeWidth="1.5"/></marker></defs>
        {['M215 72H447', 'M569 72h261', 'M890 97v84', 'M829 237H590', 'M447 237H224'].map(path => <path key={path} d={path} markerEnd="url(#flow-arrow)"/>)}
        <path d="M167 260v73q0 24 24 24h799q25 0 25-25V92q0-20-25-20h-42" markerEnd="url(#flow-arrow)"/>
      </svg>
      <svg className="loop-lines-mobile" viewBox="0 0 24 400" preserveAspectRatio="none" aria-hidden="true"><path d="M2 398h8q12 0 12-14V18q0-14-12-14H2m5-3L2 4l5 3"/></svg>
      <ol className="loop-steps">
        {steps.map((step, index) => <li key={step.title} style={{ '--col': step.x + 1, '--row': step.y + 1, '--order': index } as CSSProperties}>
          <span className="loop-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d={['M5 17 17 5M5 5h12v12', 'M4 10h16v10H4V10Zm3 0V7a5 5 0 0 1 10 0v3', 'M5 5h14v14H5V5Zm4 4h6v6H9V9Z', 'M5 17 17 5M5 5h12v12', 'M8 4c1 6-3 7-3 11a7 7 0 0 0 14 0c0-4-3-6-6-10 0 4-1 6-3 7', 'M4 19V9m8 10V5m8 14V2M2 21h20'][index]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          <strong>{step.href ? <a href={step.href}>{step.title}</a> : step.title}</strong>
          <span>{step.href ? <a href={step.href}>{step.body}</a> : step.body}</span>
        </li>)}
      </ol>
      <p className="loop-return">More volume, more work <span aria-hidden="true">↻</span></p>
    </div>
    <figcaption id="loop-caption">Running costs first, burns from the surplus.</figcaption>
  </figure>;
}
