// Static generator for the 3 capture/comparison guides. Run: node tools/gen-guides.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://forgedcarbon.com.au";

const chrome = {
  head: (title, desc, path, ld) => `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18285487994"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18285487994');</script>
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${SITE}${path}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Forged Carbon">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${SITE}${path}">
  <meta property="og:image" content="${SITE}/images/Front-new.png">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${ld}</script>
  <link rel="icon" type="image/png" href="/images/new-logo.png">
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="stylesheet" href="/css/pages.css">
</head>
<body>

<nav class="nav nav--opaque" id="nav">
  <div class="nav__inner">
    <a href="/" class="nav__brand"><img src="/images/new-logo.png" alt="Forged Carbon"></a>
    <div class="nav__links" id="navLinks">
      <a href="/"                class="nav__link">Home</a>
      <a href="/forge-12/"       class="nav__link">The Forge 12</a>
      <a href="/use-cases/"      class="nav__link">Use Cases</a>
      <a href="/locations/"      class="nav__link">Locations</a>
      <a href="/guides/"         class="nav__link nav__link--active">Guides</a>
      <a href="/contact/"        class="nav__cta">Book a Walkthrough</a>
    </div>
    <button class="nav__toggle" id="navToggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
  </div>
</nav>
`,
  foot: `
<section class="cta-section" style="border-top: 1px solid var(--color-hairline);">
  <div class="container">
    <p class="cta-section__eyebrow">On display in Rockhampton — delivered across Queensland</p>
    <h2 class="cta-section__title">Compare it in person.</h2>
    <p class="cta-section__sub">Walk through the Forge 12, see the certification documentation, and judge the difference for yourself.</p>
    <div class="cta-section__actions">
      <a href="/contact/"  class="btn btn--primary">Book a Walkthrough</a>
      <a href="/locations/" class="btn btn--outline">Find Your Town</a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div>
        <a href="/" class="footer__brand"><img src="/images/new-logo.png" alt="Forged Carbon"></a>
        <p class="footer__tagline">Class 1A Certified Permanent Modular Dwellings<br>Shou Sugi Ban Cladding — Queensland Factory<br>Delivered Across Australia</p>
        <a href="/contact/" class="btn btn--ghost">Book a Walkthrough</a>
      </div>
      <div>
        <p class="footer__col-title">Guides</p>
        <nav class="footer__nav">
          <a href="/guides/container-homes-qld/" class="footer__nav-link">Container Homes QLD</a>
          <a href="/guides/tiny-homes-council-approved-qld/" class="footer__nav-link">Council-Approved Tiny Homes</a>
          <a href="/guides/foldable-expandable-homes-qld/" class="footer__nav-link">Foldable &amp; Expandable Homes</a>
          <a href="/guides/granny-flat-cost-queensland/" class="footer__nav-link">Granny Flat Cost QLD</a>
          <a href="/guides/granny-flat-rules-qld/" class="footer__nav-link">Granny Flat Rules QLD</a>
          <a href="/faq/" class="footer__nav-link">FAQ</a>
        </nav>
      </div>
      <div>
        <p class="footer__col-title">Pages</p>
        <nav class="footer__nav">
          <a href="/forge-12/"       class="footer__nav-link">The Forge 12</a>
          <a href="/locations/"      class="footer__nav-link">Delivery Locations</a>
          <a href="/certifications/" class="footer__nav-link">Certifications</a>
          <a href="/contact/"        class="footer__nav-link">Contact &amp; Walkthrough</a>
        </nav>
      </div>
      <div>
        <p class="footer__col-title">Contact</p>
        <p class="footer__contact-line">Display: Rockhampton, QLD — by appointment</p>
        <p class="footer__contact-line" style="margin-top: 0.75rem;"><a href="tel:+61748635788">(07) 4863 5788</a></p>
        <p class="footer__contact-line"><a href="mailto:hello@forgedcarbon.com.au">hello@forgedcarbon.com.au</a></p>
      </div>
    </div>
    <div class="footer__bottom">
      <p class="footer__copy">© 2026 Forged Carbon Pty Ltd. All rights reserved.</p>
      <p class="footer__cert-tag">NCC Class 1A — Permanent Dwelling Certified</p>
    </div>
  </div>
</footer>

<script>
  const nav=document.getElementById('nav'),toggle=document.getElementById('navToggle'),links=document.getElementById('navLinks');
  window.addEventListener('scroll',()=>{nav.classList.toggle('nav--scrolled',window.scrollY>40);},{passive:true});
  toggle.addEventListener('click',()=>{links.classList.toggle('open');toggle.classList.toggle('active');});
</script>
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "92684c560e5c455091b47b34cd3afcc4"}'></script>
</body>
</html>
`,
};

const faqLD = (faqs) => JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

const faqHTML = (faqs) => faqs.map(([q, a]) => `
      <details class="faq-item"><summary>${q}</summary><p>${a}</p></details>`).join("");

const header = (eyebrow, h1, sub) => `
<div class="page-header" style="padding-top: calc(var(--nav-h) + var(--sp-16)); padding-bottom: var(--sp-12); border-bottom: 1px solid var(--color-hairline);">
  <div class="container">
    <p style="font-family: var(--font-mono); font-size: var(--tx-xs); text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-muted); margin-bottom: var(--sp-4);"><a href="/" style="color: var(--color-muted);">Home</a> › <a href="/guides/" style="color: var(--color-muted);">Guides</a></p>
    <p class="page-header__eyebrow">${eyebrow}</p>
    <h1 class="page-header__title">${h1}</h1>
    <p class="page-header__sub">${sub}</p>
  </div>
</div>`;

const prose = (html) => `
<section class="section--lg" style="border-bottom: 1px solid var(--color-hairline);">
  <div class="container" style="max-width: 880px;">
    <div class="reveal guide-prose">${html}
    </div>
  </div>
</section>`;

// shared comparison table (kept factual and hedged)
const compareTable = (leftLabel) => `
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: var(--sp-2); margin: var(--sp-8) 0;">
        <div style="background: rgba(14,14,12,0.5); border: 1px solid rgba(240,237,230,0.06); padding: var(--sp-6);">
          <p style="font-family: var(--font-mono); font-size: var(--tx-xs); text-transform: uppercase; letter-spacing: 0.14em; color: var(--color-muted); margin-bottom: var(--sp-5);">${leftLabel}</p>
          <ul style="list-style:none; display:flex; flex-direction:column; gap: var(--sp-3); color: var(--color-muted); font-size: var(--tx-base);">
            <li>✗ Usually not certified NCC Class 1A</li>
            <li>✗ Council approval difficult or impossible</li>
            <li>✗ Hard to insure as residential property</li>
            <li>✗ Banks rarely finance them as dwellings</li>
            <li>✗ Uncertain resale &amp; depreciating value</li>
          </ul>
        </div>
        <div style="background: var(--color-surface); border: 1px solid var(--color-accent-border); padding: var(--sp-6);">
          <p style="font-family: var(--font-mono); font-size: var(--tx-xs); text-transform: uppercase; letter-spacing: 0.14em; color: var(--color-accent); margin-bottom: var(--sp-5);">The Forge 12 — Class 1A</p>
          <ul style="list-style:none; display:flex; flex-direction:column; gap: var(--sp-3); color: var(--color-text); font-size: var(--tx-base);">
            <li><span style="color:var(--color-accent);">✓</span> Certified NCC Class 1A permanent dwelling</li>
            <li><span style="color:var(--color-accent);">✓</span> Council-approvable via private certifier</li>
            <li><span style="color:var(--color-accent);">✓</span> Insurable as residential property</li>
            <li><span style="color:var(--color-accent);">✓</span> Treated as a house — a permanent asset</li>
            <li><span style="color:var(--color-accent);">✓</span> BlueScope steel frame, cyclone-region engineered</li>
          </ul>
        </div>
      </div>`;

const GUIDES = [
  {
    dir: "container-homes-qld",
    title: "Container Homes QLD: Legality, Council Approval & the Certified Alternative | Forged Carbon",
    desc: "Thinking about a shipping container home in Queensland? What buyers should know about council approval, insurance and finance — and the certified Class 1A alternative from $149,000.",
    eyebrow: "Buyer's Guide · Queensland",
    h1: `Container homes in QLD —<br>what buyers <em>should know</em>`,
    sub: "Shipping-container homes look affordable and fast. Before you buy one, understand how councils, insurers and banks treat them — and what a certified alternative looks like.",
    body: `
      <h2 style="font-family: var(--font-display); font-size: var(--tx-2xl); margin-bottom: var(--sp-5);">Why container homes are popular</h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-6);">Shipping-container homes promise industrial character, a small footprint and a low entry price. For a studio, site office or farm shed conversion, they can make sense. The complications start when you want to <em>live</em> in one — legally, insured, on your own title.</p>
      <h2 style="font-family: var(--font-display); font-size: var(--tx-2xl); margin: var(--sp-8) 0 var(--sp-5);">The three questions that decide everything</h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-4);"><strong>1. Can it be council-approved as a dwelling?</strong> A building is only a legal home in Queensland if it meets the National Construction Code for its class. Most container conversions are not certified NCC Class 1A, so councils cannot approve them as permanent dwellings — regardless of how well they're fitted out. Requirements vary by council; check your local council's planning scheme (find yours on our <a href="/locations/" style="color: var(--color-accent);">locations pages</a>, each of which links to the official council website).</p>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-4);"><strong>2. Can you insure it?</strong> Insurers classify uncertified structures differently from houses. That often means limited cover, higher premiums, or exclusions — a real problem in cyclone-region Queensland.</p>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-2);"><strong>3. Will a bank finance it?</strong> Lenders finance <em>dwellings</em>. Without Class 1A certification, a container home is usually treated as a chattel — cash purchase only, and it adds little to your property's lending value.</p>
      ${compareTable("Typical Container Conversion")}
      <h2 style="font-family: var(--font-display); font-size: var(--tx-2xl); margin: var(--sp-8) 0 var(--sp-5);">The certified alternative</h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9;">The <a href="/forge-12/" style="color: var(--color-accent);">Forge 12</a> delivers what draws people to container homes — compact footprint, factory build, fast delivery, striking architecture — with the certification of a real house: NCC Class 1A, BlueScope steel frame, Shou Sugi Ban charred-timber cladding, from $149,000. Council-approvable, insurable, financeable, permanent.</p>`,
    faqs: [
      ["Are container homes legal in Queensland?", "Owning one is legal, but living in one usually requires it to be approved as a dwelling — which requires NCC Class 1A certification most container conversions don't have. Requirements vary by local council, so always check your council's planning scheme."],
      ["Can you get a mortgage on a container home?", "Rarely. Banks lend against certified dwellings. Uncertified container homes are typically treated as goods rather than real property, which usually means cash purchase and little added lending value."],
      ["What's the certified alternative to a container home?", "A certified Class 1A modular home. The Forge 12 (from $149,000) offers the same compact, factory-built, delivered-complete appeal, but is certified as a permanent dwelling — council-approvable, insurable and financeable."],
      ["Can a container home ever be Class 1A certified?", "In principle a container-based structure could be engineered and certified to Class 1A, but the structural, insulation, waterproofing and services upgrades required usually erase the cost advantage that attracted buyers in the first place."],
    ],
  },
  {
    dir: "tiny-homes-council-approved-qld",
    title: "Council-Approved Tiny Homes in Queensland — What Actually Qualifies | Forged Carbon",
    desc: "Most tiny homes can't be council approved in QLD because they're built as caravans. Here's what approval actually requires — and a certified Class 1A tiny home from $149,000.",
    eyebrow: "Buyer's Guide · Queensland",
    h1: `Council-approved tiny homes<br>in <em>Queensland</em>`,
    sub: "The phrase “council approved tiny home” is used loosely. Here's what approval actually requires in QLD — and how to buy one that genuinely qualifies.",
    body: `
      <h2 style="font-family: var(--font-display); font-size: var(--tx-2xl); margin-bottom: var(--sp-5);">Why most tiny homes can't be approved</h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-6);">Most tiny homes sold in Australia are built on trailers and registered as caravans. That's a feature for mobility — and a fatal flaw for approval. A caravan is a vehicle, not a building, so it can't be approved as a permanent dwelling, insured as a house, or counted as an improvement to your land. Councils differ on how long a caravan may be occupied on a property, which leaves owners in a permanent grey zone.</p>
      <h2 style="font-family: var(--font-display); font-size: var(--tx-2xl); margin: var(--sp-8) 0 var(--sp-5);">What approval actually requires</h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-2);">For a small home to be approved as a dwelling in Queensland it generally needs: <strong>NCC Class 1A certification</strong> (structural, waterproofing, energy efficiency and habitability standards), compliant <strong>AS/NZS 3000 electrical</strong> and <strong>AS/NZS 3500 plumbing</strong>, engineered footings/tie-downs for your wind region, and lodgement through a <strong>building certifier</strong> under your local council's planning scheme. Each of our <a href="/locations/" style="color: var(--color-accent);">location pages</a> links to the relevant council's official site so you can check local requirements directly.</p>
      ${compareTable("Caravan-Style Tiny Home")}
      <h2 style="font-family: var(--font-display); font-size: var(--tx-2xl); margin: var(--sp-8) 0 var(--sp-5);">A tiny home that qualifies</h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9;">The <a href="/forge-12/" style="color: var(--color-accent);">Forge 12</a> is a compact home (12.0m × 3.5m, 3.0m ceilings) built and certified as a permanent Class 1A dwelling — the tiny-home lifestyle with the legal standing of a house. From $149,000, delivered across Queensland with the full certification pack supplied on handover.</p>`,
    faqs: [
      ["Are tiny homes on wheels council approved in QLD?", "No — a tiny home on wheels is a caravan (a vehicle), and vehicles can't be approved as permanent dwellings. Councils vary on how long caravans may be occupied on a property; check your local council's rules."],
      ["What makes a tiny home council-approvable?", "Certification as an NCC Class 1A dwelling, compliant electrical (AS/NZS 3000) and plumbing (AS/NZS 3500), engineering for your site's wind region, and lodgement through a building certifier under your council's planning scheme."],
      ["Can I rent out a council-approved tiny home?", "Yes — that's one of the biggest advantages. A Class 1A dwelling can be legally rented long-term or as short-stay accommodation, and insured accordingly. See our granny flat rules guide for specifics."],
      ["How much does a council-approvable tiny home cost?", "The Forge 12 is $149,000 as displayed — a complete, certified Class 1A dwelling. Delivery and site connections are additional and depend on your location; contact us for an all-in estimate."],
    ],
  },
  {
    dir: "foldable-expandable-homes-qld",
    title: "Foldable & Expandable Homes in QLD — Are They Worth It? | Forged Carbon",
    desc: "Foldable and expandable homes are trending. What Queensland buyers should know about certification, durability, approval and resale — and the certified permanent alternative.",
    eyebrow: "Buyer's Guide · Queensland",
    h1: `Foldable &amp; expandable homes —<br><em>worth it</em> in QLD?`,
    sub: "Fold-out and expandable homes promise a house in a box at a tempting price. Here's the honest checklist Queensland buyers should run before ordering one.",
    body: `
      <h2 style="font-family: var(--font-display); font-size: var(--tx-2xl); margin-bottom: var(--sp-5);">The appeal — and the catch</h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-6);">Foldable homes ship flat and unfold on site; expandable homes slide out extra rooms from a transport-width core. The engineering is genuinely clever and the sticker prices are attractive. The catch is the same as for container homes and caravan-style tiny homes: <strong>most units imported and sold in Australia are not certified NCC Class 1A</strong>, and many are built to overseas standards that don't map onto the National Construction Code — or onto Queensland's cyclonic wind regions.</p>
      <h2 style="font-family: var(--font-display); font-size: var(--tx-2xl); margin: var(--sp-8) 0 var(--sp-5);">The buyer's checklist</h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-2);">Before ordering any fold-out or expandable unit, get written answers to these: Is it certified NCC Class 1A for Australia — and can the seller show the certificate? Is it engineered for your wind region (much of coastal QLD is Region C — cyclonic)? Are the hinged and sliding joints warranted against leaks for the long term? Will your council approve it as a dwelling (check via your <a href="/locations/" style="color: var(--color-accent);">local council</a>)? Will an insurer cover it and a bank finance it? If any answer is no or vague, you're buying a structure, not a home.</p>
      ${compareTable("Typical Foldable / Expandable Unit")}
      <h2 style="font-family: var(--font-display); font-size: var(--tx-2xl); margin: var(--sp-8) 0 var(--sp-5);">Expandable convenience, permanent certification</h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9;">The <a href="/forge-12/" style="color: var(--color-accent);">Forge 12</a> arrives complete — no folding, no slide-outs, no joints to fail in a cyclone season. One rigid, engineer-certified BlueScope steel structure, certified NCC Class 1A, clad in Shou Sugi Ban charred timber. From $149,000, delivered across Queensland — a home that's certified before it leaves the factory.</p>`,
    faqs: [
      ["Are foldable homes council approved in Queensland?", "Only if certified NCC Class 1A and lodged through a building certifier — which most imported foldable units are not. Ask the seller for the certification documents before paying a deposit, and check your local council's planning scheme."],
      ["Do expandable homes meet the Australian building code?", "Some can, most don't. Many are built to overseas standards that don't automatically satisfy the NCC, and Queensland's cyclonic wind regions add structural requirements that fold-out joints struggle to meet. Always demand Australian certification in writing."],
      ["How long do foldable homes last?", "The moving joints are the weak point — seals and hinges that fold once for delivery still create long-term leak paths, especially in the wet tropics. A rigid certified structure avoids the problem entirely."],
      ["What's the alternative to a foldable or expandable home?", "A certified permanent modular home delivered complete. The Forge 12 gives you factory speed and delivered convenience with Class 1A certification — approvable, insurable, financeable, from $149,000."],
    ],
  },
];

for (const g of GUIDES) {
  const path = `/guides/${g.dir}/`;
  const html =
    chrome.head(g.title, g.desc, path, faqLD(g.faqs)) +
    header(g.eyebrow, g.h1, g.sub) +
    prose(g.body) +
    `
<section class="section" style="background: var(--color-surface); border-bottom: 1px solid var(--color-hairline);">
  <div class="container" style="max-width: 880px;">
    <div class="section-intro reveal" style="margin-bottom: var(--sp-8);">
      <p class="section-intro__eyebrow">FAQ</p>
      <h2 class="section-intro__title">Common <em>questions</em></h2>
    </div>
    <div class="reveal">${faqHTML(g.faqs)}
    </div>
  </div>
</section>` +
    chrome.foot;
  const dir = join(ROOT, "guides", g.dir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
  console.log("wrote", path);
}
