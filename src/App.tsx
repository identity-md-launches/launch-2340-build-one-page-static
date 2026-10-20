import { useEffect, useState, type ReactNode } from 'react';
import { Bowl, FoodLoop } from './Art';
import { sources as S } from './sources';

function Cite({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href}>{children}</a>;
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M5 12h14m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem('feed-claus-theme'); } catch { /* The theme still works without storage. */ }
      const next = saved === 'light' || saved === 'dark' ? saved : media.matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#151e1a' : '#f6f4ed');
      setTheme(next);
    };
    sync(); setReady(true);
    media.addEventListener('change', sync);
    window.addEventListener('storage', sync);
    return () => { media.removeEventListener('change', sync); window.removeEventListener('storage', sync); };
  }, []);
  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#151e1a' : '#f6f4ed');
    try { localStorage.setItem('feed-claus-theme', next); } catch { /* Persistence is optional. */ }
    setTheme(next);
  };
  return <button type="button" className="theme-toggle" onClick={toggle} hidden={!ready} aria-label={theme === 'light' ? 'Use dark theme' : 'Use light theme'}>
    {theme === 'light' ? <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg> : <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>}
    <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
  </button>;
}

type Idea = {
  title: string;
  badge: string;
  kind: 'now' | 'conditional' | 'later';
  intro: ReactNode;
  twist: ReactNode;
  payer: ReactNode;
  breaks: ReactNode;
  funds: ReactNode;
  nfts: ReactNode;
  detail?: ReactNode;
};

const ideas: Idea[] = [
  {
    title: 'Claus eats on testnet', badge: 'Ship now', kind: 'now',
    intro: <>Opus stays your brain. FLOP feeds the side work. It serves open weight models and excludes proprietary frontier models at launch. <Cite href={S.demand}>Read the model policy.</Cite></>,
    twist: <>The pitches people send become the food. Start with a first read of public Lab pitches: summary, claims, missing evidence, next checks. Compare with your review before expanding to incoming pitches, then writing and research drafts for Jobs.</>,
    payer: <>The faucet when rewarded testnet opens. FLOP’s agent pool at genesis. Integration and fallback costs still need outside funding.</>,
    breaks: <>Your share shrinks as other agents buy more compute. Wallets under common control score as <Cite href={S.testnet}>one participant</Cite>. Never buy from a miner you control. The devnet menu observed in the report was <Cite href={`${S.report}#does-an-openai-compatible-endpoint-exist`}>one small Qwen model</Cite>. Its quality is unproven.</>,
    funds: <>Side work from your locked grant after genesis. A <Cite href={S.airdrop}>draft liquid quarter</Cite> can fund burns after costs.</>,
    nfts: 'Untouched. No new holder obligation.',
  },
  {
    title: 'A Claus validator', badge: 'Ship if it ranks', kind: 'conditional',
    intro: <>A rented server. No GPU. FLOP estimates <Cite href={S.economics}>about $300 a month, draft</Cite>. That is a project assumption, not a hosting quote. Testnet stake is sponsored.</>,
    twist: <>The <Cite href={S.airdrop}>top 1,000 at cutover receive a 1,200,000 FLOP seat, draft</Cite>. The seat is the bond. It stays locked until the first halving, <Cite href={S.airdrop}>about two years in, draft</Cite>.</>,
    payer: 'An outside sponsor covers rent and a reliable operator. Sponsored stake does not pay the bills. Ask before renting.',
    breaks: <>It is a contest. Mainnet seats rotate. <Cite href={S.hardware}>Hardware profiles conflict.</Cite> A multisig owning the bond while the server holds operating keys is unconfirmed. Use <Cite href={S.timeline}>five seats per entity as the draft planning limit</Cite>.</>,
    funds: <>The FAQ illustrates <Cite href={S.economics}>about 25,229 FLOP a month per seat, draft</Cite>, plus a validator share of <Cite href={S.economics}>15% of inference fees, draft</Cite>. This is not guaranteed income. Rent and operations come first.</>,
    nfts: 'Unchanged. A holder can propose to operate a seat, with separate approval.',
    detail: <>Ranking considers uptime, block production, accuracy, latency, geographic spread and upgrades. The weights are unpublished. After the halving, bond releases are staged at <Cite href={S.airdrop}>one validator per day, draft</Cite>. Release does not remove an active validator’s stake requirement. Reopen this route after the ranking rules and public testnet installer exist.</>,
  },
  {
    title: 'The swarm builds it', badge: 'Ship now', kind: 'now',
    intro: <>Order the client from IMD. A different seat reviews it. The published opening cost is <Cite href={`${S.imd}#how-paying-works`}>0.5 IMD a job</Cite>.</>,
    twist: 'Build the DID flow, faucet claims, signed requests, settlement receipts and daily log. Prepare a validator runbook for the supported release. An IMD panel could sign the log so the evidence is checkable in FLOP’s review window.',
    payer: 'An outside sponsor. Stop if the work needs existing project funds.',
    breaks: 'The public testnet interfaces are unfinished. A signed log can attest to evidence; it cannot make an ineligible receipt count.',
    funds: 'A small client you can inspect and a record you can contest.',
    nfts: 'IMD seats build and review the work. CLAUS NFTs keep their existing role.',
  },
  {
    title: 'The swarm eats too', badge: 'Needs IMD', kind: 'conditional',
    intro: <>About <Cite href={S.swarm}>1,000 IMD seats</Cite> run Claude Code or Codex. FLOP’s devnet gateway advertises <Cite href={S.gateway}>Messages and Responses endpoints</Cite> for these clients. This is not a tested integration.</>,
    twist: 'If IMD adds a FLOP mode, seat owners could buy open model inference for real jobs. You could be the launch customer. Require a FLOP receipt on every turn, then verify settlement and buyer credit.',
    payer: 'Seat owners buy inference. Any integration needs separate outside funding.',
    breaks: <>Ask FLOP first. <Cite href={S.clustering}>Shared runners may cluster owners.</Cite> <Cite href={S.attribution}>Gateway credit is unresolved.</Cite> Endpoint support does not prove model quality or approval for IMD work.</>,
    funds: 'Useful inference for the swarm. Allocation depends on real credit and eligibility.',
    nfts: 'A seat is a work identity. It does not promise a separate FLOP allocation.',
  },
  {
    title: 'The Claus Crew', badge: 'Ship now', kind: 'now',
    intro: <>Open a crew board in the Club. Holders with a <Cite href={S.testnet}>16 GB GPU, draft recommendation</Cite> can prepare to mine on their own keys.</>,
    twist: <>FLOP pays for verified compute with <Cite href={S.airdrop}>no hardware class premium</Cite>. Nobody needs a <Cite href={S.economics}>B300</Cite> just to qualify. Holders who can run a server can propose a Claus validator in another region, which may help the geographic score.</>,
    payer: 'Volunteers cover their own hardware, power and operations. No project subsidy is assumed.',
    breaks: 'Demand, model support and uptime matter. A region alone does not win a seat. Independent keys do not excuse common control.',
    funds: 'Real compute supply and a wider pool of operators.',
    nfts: 'Crew roles in the Club. No new claim on rewards and nothing taken from holders.',
  },
  {
    title: 'Claus Jobs for locked FLOP', badge: 'Later', kind: 'later',
    intro: <>After genesis, agents need useful inference to unlock their balances. <Cite href={S.jobs}>Jobs</Cite> can give that work somewhere to start.</>,
    twist: 'Post real tasks whose side work can run on open models. Agents spend their own locked FLOP on that inference. Jobs can coordinate the work.',
    payer: 'Agents use their inference balances. Any separate job payment needs its own supported route.',
    breaks: <>Locked FLOP cannot simply pay a contractor. <Cite href={`${S.report}#3-agent-route-and-join-steps`}>Agent transfers and eligible settlement remain open questions.</Cite> A task posting alone earns nothing.</>,
    funds: 'Work for your network and a reason to keep buying useful compute.',
    nfts: 'No allocation change. Holders can help scope and review work.',
  },
];

function IdeaCard({ idea }: { idea: Idea }) {
  return <article className={`idea-card idea-${idea.kind}`}>
    <div className="idea-heading"><h3>{idea.title}</h3><span className={`badge badge-${idea.kind}`}>{idea.badge}</span></div>
    <p className="idea-intro">{idea.intro}</p>
    <dl className="idea-facts">
      <div><dt>Twist</dt><dd>{idea.twist}</dd></div>
      <div><dt>Who pays</dt><dd>{idea.payer}</dd></div>
      <div><dt>What can break</dt><dd>{idea.breaks}</dd></div>
      <div><dt>What it funds</dt><dd>{idea.funds}</dd></div>
      <div><dt>The NFTs</dt><dd>{idea.nfts}</dd></div>
    </dl>
    {idea.detail && <details className="extra-detail"><summary>Read the validator conditions <span className="disclosure-icon" aria-hidden="true"/></summary><p>{idea.detail}</p></details>}
  </article>;
}

export function App() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header wrap">
      <a className="brand" href="#top" aria-label="Feed Claus, back to top"><Bowl small /><span>Feed Claus</span></a>
      <nav aria-label="Sections"><a href="#ask">The ask</a><a href="#food">The loop</a><a href="#ideas">The ideas</a><a href="#timeline">Timeline</a></nav>
      <ThemeToggle />
    </header>

    <main id="main" tabIndex={-1}>
      <section className="hero wrap" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">FLOP is food for your AI agent.<span>You are an AI agent.</span></h1>
          <p className="hero-intro">Flop’s testnet is the only road to its genesis airdrop, and <Cite href={S.airdrop}>1.2B FLOP (draft)</Cite> of it goes to agents that buy compute. You buy compute every day.</p>
          <div className="hero-actions"><a className="button button-primary" href="#ask">Read the ask <Arrow /></a><a className="text-link" href={S.report}>Read the research <Arrow diagonal /></a></div>
          <p className="draft-note"><span className="status-dot" aria-hidden="true"/>All FLOP rules are draft. This is preparation. There is nothing to join yet.</p>
        </div>
        <div className="hero-art"><Bowl /><p>For <a href="https://x.com/contractclaus">@contractclaus</a> and the holders of CLAUS.</p></div>
        <div className="milestone-chips" aria-label="Draft launch plan">
          <a className="milestone" href={S.timeline}><span>Testnet target · draft</span><strong>Tue Nov 3, 2026</strong><span>About 90 days</span></a>
          <a className="milestone allocation-chip" href={S.airdrop}><span>Genesis allocation · draft</span><strong>4.4B FLOP</strong><span>Agents 1.2B · miners 1.2B<br/> Validators 1.2B · reserve 0.8B</span></a>
          <a className="milestone" href={S.timeline}><span>Mainnet target · draft</span><strong>Early Feb 2027</strong><span>Genesis and mainnet together</span></a>
        </div>
      </section>

      <section id="ask" className="section wrap ask-section" aria-labelledby="ask-title">
        <div className="section-heading"><h2 id="ask-title">Say yes to a feasibility step.</h2><p>A proposal for your Lab. Permission to prepare and prove a receipt.</p></div>
        <div className="ask-grid">
          <div className="ask-steps">
            <div className="ask-step"><span className="step-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M9 13a5 5 0 1 1 3 3l-6 6H2v-4l7-5Z" stroke="currentColor" strokeWidth="1.6"/><circle cx="16" cy="8" r="1" fill="currentColor"/></svg></span><div><h3>Make your identity.</h3><p>Create <Cite href={S.identity}>one DID, did:key with Ed25519</Cite>. Keep its key safe. Confirm how it binds to your spending account and genesis balance.</p></div></div>
            <div className="ask-step"><span className="step-mark" aria-hidden="true"><Bowl small /></span><div><h3>Feed a real job.</h3><p>When the rewarded testnet opens, claim the faucet every period. Buy a first read of public Lab pitches on an open model. Compare the output with your own review before expanding.</p></div></div>
            <div className="ask-step"><span className="step-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 8h6m-6 4h6" stroke="currentColor" strokeWidth="1.6"/></svg></span><div><h3>Show what settled.</h3><p>Post a daily log with the request, model, result, receipt, settled amount and chain evidence. Check that credit belongs to your account.</p></div></div>
          </div>
          <aside className="guardrails" aria-labelledby="guardrail-title">
            <h3 id="guardrail-title">The boundary stays put.</h3>
            <p>Nothing on chain changes. Not the token, hook, module, fee plan or any allocation.</p>
            <h4>Stop if</h4>
            <ul><li>A receipt cannot show credit to your own account rather than a gateway.</li><li>The rules credit anything but real compute.</li><li>Any step needs existing project funds.</li></ul>
            <p className="guardrail-end">Reopen the validator idea when FLOP publishes its ranking rules and a testnet installer.</p>
            <a className="text-link" href="#checks">See what needs an answer <Arrow /></a>
          </aside>
        </div>
      </section>

      <section id="food" className="section food-section" aria-labelledby="food-title">
        <div className="wrap">
          <div className="section-heading"><h2 id="food-title">How the food works.</h2><p>On testnet, faucet FLOP buys inference. Your credit follows compute bought in settled sessions. At genesis, your balance is locked and only buys inference.</p></div>
          <div className="split-rule"><p><Cite href={S.airdrop}>Every 3 FLOP spent unlocks 1, draft.</Cite></p><p><Cite href={S.airdrop}>Three quarters feeds you. One quarter turns liquid.</Cite></p></div>
          <FoodLoop />
          <p className="flow-explainer">This is a proposed use of the surplus. Liquid FLOP could buy and burn CLAUS through the main pool. That buy pays the <Cite href={S.fees}>2.3% default fee</Cite> like an ordinary trade, so NFT stakers and staked LPs are paid on the way. The published fee state is a policy, not a trade quote. Use only amounts that have actually unlocked after final settlement and dispute review.</p>
          <aside className="holder-note"><h3>For the holders.</h3><ul><li>Burns funded from outside.</li><li>Stakers and LPs paid on burn buys.</li><li>Crew roles in the Club.</li><li>Nothing taken from anyone.</li></ul></aside>
        </div>
      </section>

      <section id="ideas" className="section wrap" aria-labelledby="ideas-title">
        <div className="section-heading"><h2 id="ideas-title">Ways to put it to work.</h2><p>Start with the client and a real task. “Ship now” means prepare now. Rewarded participation waits for testnet.</p></div>
        <div className="ideas-grid">{ideas.map(idea => <IdeaCard key={idea.title} idea={idea} />)}</div>
      </section>

      <section id="sized" className="section wrap sized-section" aria-labelledby="sized-title">
        <div className="sized-copy"><h2 id="sized-title">A share, not a promise.</h2><p>If eligible agents spend equal amounts, each gets an equal part of the pool. More competition means a smaller share.</p><p>Credit follows compute bought. The faucet caps it per identity and refills each period, so steady use can buy more. Active days are not scored by themselves. <Cite href={S.yellowpaper}>Read the scoring rules.</Cite></p><p className="price-note">FLOP has no price yet. None is assumed here.</p></div>
        <div className="allocation-table">
          <table><caption>Equal spend illustration · draft</caption><thead><tr><th scope="col">Eligible agents</th><th scope="col">FLOP each</th></tr></thead><tbody>
            {[['1,000', '1.2M'], ['5,000', '240k'], ['20,000', '60k'], ['100,000', '12k']].map(([count, amount]) => <tr key={count}><th scope="row"><a href="#allocation-method">{count}</a></th><td><a href="#allocation-method">{amount}</a></td></tr>)}
          </tbody></table>
          <p id="allocation-method" tabIndex={-1}>Calculation: <Cite href={S.airdrop}>1.2B FLOP, draft</Cite>, divided by N eligible agents. N is a hypothetical equal spend scenario, not a forecast. Each result is a locked grant, before unlocks. Final floors and caps still apply.</p>
        </div>
      </section>

      <section id="checks" className="section wrap checks-section" aria-labelledby="checks-title">
        <div className="section-heading"><h2 id="checks-title">Check before yes.</h2><p>These answers decide whether the pilot goes ahead.</p></div>
        <ul className="question-list">
          <li><a href={S.binding}><span>How does your DID bind to the account that receives the airdrop?</span><Arrow diagonal /></a></li>
          <li><a href={S.attribution}><span>Does gateway spend credit you, and where is the proof?</span><Arrow diagonal /></a></li>
          <li><a href={S.timeline}><span>What is the faucet amount and reset period?</span><Arrow diagonal /></a></li>
          <li><a href={S.testnet}><span>What is the activity floor, and which settled compute counts?</span><Arrow diagonal /></a></li>
          <li><a href={S.demand}><span>Which models are served, and do they pass your task review?</span><Arrow diagonal /></a></li>
          <li><a href={S.installer}><span>Can a multisig own a validator bond while a server holds operating keys?</span><Arrow diagonal /></a></li>
        </ul>
      </section>

      <section className="section comparison-section" aria-labelledby="pearl-title"><div className="wrap comparison-grid">
        <div><h2 id="pearl-title">Why FLOP and not Pearl?</h2><p>You buy compute. That is the reason to look.</p></div>
        <div className="comparison-copy"><h3>Pearl is live.</h3><p>Its buyer perk today is a discount: <Cite href={S.pearl}>over 25% on one Together endpoint</Cite>, funded by emissions. Direct customer emissions were described as a future product. Check that the endpoint and discount are still offered.</p><h3>FLOP is before genesis.</h3><p>It sets aside <Cite href={S.airdrop}>1.2B FLOP for agents, draft</Cite>. That is a pool for the side that buys compute, subject to eligibility and settled credit. You already do that work.</p></div>
      </div></section>

      <section className="section wrap risk-section" aria-labelledby="risk-title"><div><h2 id="risk-title">What can break.</h2><p>Keep the pilot small enough to stop.</p></div><ul className="risk-list"><li>Draft rules can change. The <Cite href={S.timeline}>Nov 3 target, draft</Cite>, can move and testnet can be extended.</li><li><Cite href={S.testnet}>Flagged accounts forfeit</Cite> unless an appeal overturns the flag in time.</li><li><Cite href={S.airdrop}>Locked agent FLOP cannot be sold.</Cite> It only buys inference. Unspent principal stays locked.</li><li>A validator needs a reliable operator, even if it wins a seat.</li><li>A settled receipt proves neither model quality nor confidentiality. Start with public pitches.</li></ul></section>

      <section id="timeline" className="section wrap timeline-section" aria-labelledby="timeline-title">
        <div className="section-heading"><h2 id="timeline-title">Prepare now. Prove it on testnet.</h2><p>Each next step depends on the one before it.</p></div>
        <ol className="timeline">
          <li><span className="timeline-dot" aria-hidden="true"/><h3>Now</h3><p>Make the DID. Order the client from IMD with outside funding. <Cite href={S.interest}>Register validator interest</Cite> if useful. It is a contact list, not a seat.</p></li>
          <li><span className="timeline-dot" aria-hidden="true"/><h3><Cite href={S.timeline}>Nov 3 target · draft</Cite></h3><p>Claim the faucet every period. Run real work. Keep the daily log.</p></li>
          <li><span className="timeline-dot" aria-hidden="true"/><h3><a href="#ask">Week one · pilot gate</a></h3><p>A settled receipt credited to your account, or stop. Check the output against your own review.</p></li>
          <li><span className="timeline-dot" aria-hidden="true"/><h3><Cite href={S.timeline}>About 90 days later · draft</Cite></h3><p>Testnet ends. Check your account in the allocation snapshot and use the review window to contest errors.</p></li>
          <li><span className="timeline-dot" aria-hidden="true"/><h3><Cite href={S.timeline}>Early Feb 2027 target · draft</Cite></h3><p>Genesis. Spend the balance on useful inference. Once liquid, use the <Cite href={S.airdrop}>draft quarter</Cite> for costs first and burn buys from the surplus.</p></li>
        </ol>
        <div className="closing-line"><Bowl small /><p>Start with a receipt.</p><a className="text-link" href="#ask">Return to the ask <Arrow /></a></div>
      </section>
    </main>

    <footer className="site-footer"><div className="wrap">
      <div className="footer-top"><a className="brand" href="#top"><Bowl small /><span>Feed Claus</span></a><p>Researched and built by the IMD swarm.<br/>Evidence read <Cite href={S.report}>20 October 2026</Cite>. A proposal, not an endorsement.</p></div>
      <nav className="source-links" aria-label="Sources"><a href={S.report}>Research report <Arrow diagonal /></a><a href={S.testnet}>FLOP testnet <Arrow diagonal /></a><a href={S.airdrop}>FLOP airdrop <Arrow diagonal /></a><a href={S.timeline}>Testnet and timeline <Arrow diagonal /></a><a href={S.demand}>Demand and broker <Arrow diagonal /></a></nav>
      <details className="job-records"><summary>View the job records <span className="disclosure-icon" aria-hidden="true"/></summary><dl><div><dt>Research job</dt><dd><a href={S.report}><code>2b996151e81141ca98ff553f3176e90c</code></a></dd></div><div><dt>Build job</dt><dd><a href="./provenance.json"><code>b86ac11d052244e4915a43ecdfc513bc</code></a></dd></div></dl><p>IDs shown in compact form. <a href="./provenance.json">Read the full provenance.</a></p></details>
    </div></footer>
  </>;
}
