// Static generator for /locations/[town]/ pages + hub. Run: node tools/gen-locations.mjs
// Output is plain static HTML committed to the repo — no site build step.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://forgedcarbon.com.au";

const COUNCILS = {
  rrc:  { name: "Rockhampton Regional Council",     url: "https://www.rockhamptonregion.qld.gov.au" },
  liv:  { name: "Livingstone Shire Council",        url: "https://www.livingstone.qld.gov.au" },
  gla:  { name: "Gladstone Regional Council",       url: "https://www.gladstone.qld.gov.au" },
  ban:  { name: "Banana Shire Council",             url: "https://www.banana.qld.gov.au" },
  chr:  { name: "Central Highlands Regional Council", url: "https://chrc.qld.gov.au" },
  isa:  { name: "Isaac Regional Council",           url: "https://www.isaac.qld.gov.au" },
  bar:  { name: "Barcaldine Regional Council",      url: "https://www.barcaldinerc.qld.gov.au" },
  bta:  { name: "Blackall-Tambo Regional Council",  url: "https://www.btrc.qld.gov.au" },
  lon:  { name: "Longreach Regional Council",       url: "https://www.longreach.qld.gov.au" },
  mky:  { name: "Mackay Regional Council",          url: "https://www.mackay.qld.gov.au" },
  whi:  { name: "Whitsunday Regional Council",      url: "https://www.whitsundayrc.qld.gov.au" },
  bur:  { name: "Burdekin Shire Council",           url: "https://www.burdekin.qld.gov.au" },
  cht:  { name: "Charters Towers Regional Council", url: "https://www.charterstowers.qld.gov.au" },
  tsv:  { name: "Townsville City Council",          url: "https://www.townsville.qld.gov.au" },
  hin:  { name: "Hinchinbrook Shire Council",       url: "https://www.hinchinbrook.qld.gov.au" },
  cas:  { name: "Cassowary Coast Regional Council", url: "https://www.cassowarycoast.qld.gov.au" },
  cai:  { name: "Cairns Regional Council",          url: "https://www.cairns.qld.gov.au" },
  mar:  { name: "Mareeba Shire Council",            url: "https://www.msc.qld.gov.au" },
  tab:  { name: "Tablelands Regional Council",      url: "https://www.trc.qld.gov.au" },
  dou:  { name: "Douglas Shire Council",            url: "https://www.douglas.qld.gov.au" },
};

// slug, name, council key, region, km from Rockhampton (approx road), wind region, unique intro, nearby slugs
const TOWNS = [
  ["gracemere","Gracemere","rrc","Central QLD",12,"C","Ten minutes from Rockhampton, Gracemere's larger blocks and growing estates make it one of the easiest places in CQ to add a secondary dwelling.",["rockhampton","mount-morgan","yeppoon"]],
  ["mount-morgan","Mount Morgan","rrc","Central QLD",40,"B","Mount Morgan's historic town blocks and acreage fringe suit a compact, self-contained permanent home — without the cost of a full site build.",["rockhampton","gracemere","biloela"]],
  ["yeppoon","Yeppoon","liv","Central QLD",42,"C","On the Capricorn Coast, Yeppoon is prime short-stay territory — a certified Class 1A dwelling can be legally let to holiday-makers year-round.",["emu-park","rockhampton","gracemere"]],
  ["emu-park","Emu Park","liv","Central QLD",47,"C","Emu Park's relaxed coastal blocks are ideal for a granny flat or an income unit a short walk from the beach.",["yeppoon","rockhampton","gracemere"]],
  ["gladstone","Gladstone","gla","Central QLD",110,"C","Gladstone's industry workforce keeps rental demand strong — a certified secondary dwelling adds genuine, lettable value to your block.",["tannum-sands","boyne-island","calliope"]],
  ["tannum-sands","Tannum Sands","gla","Central QLD",130,"C","Tannum's beachside family blocks suit a parents' retreat or teen space that's a real home, not a converted shed.",["gladstone","boyne-island","agnes-water"]],
  ["boyne-island","Boyne Island","gla","Central QLD",128,"C","Boyne Island offers room to add a self-contained dwelling for family or rental income, minutes from the water.",["tannum-sands","gladstone","calliope"]],
  ["calliope","Calliope","gla","Central QLD",118,"C","Calliope's acreage lifestyle blocks are made for a delivered, certified home — skip the long on-site build.",["gladstone","boyne-island","biloela"]],
  ["agnes-water","Agnes Water & 1770","gla","Central QLD",225,"C","Agnes Water and 1770 are among QLD's strongest boutique short-stay markets — the charred-timber Forge 12 photographs like nothing else on the listing sites.",["gladstone","tannum-sands","miriam-vale"]],
  ["miriam-vale","Miriam Vale","gla","Central QLD",180,"C","Rural blocks around Miriam Vale suit a permanent, certified dwelling delivered complete — ideal as a first home on land.",["agnes-water","gladstone","calliope"]],
  ["biloela","Biloela","ban","Central QLD",145,"B","Biloela's ag and industry economy keeps housing tight — a Class 1A granny flat houses workers or family with council-approvable certainty.",["moura","theodore","mount-morgan"]],
  ["moura","Moura","ban","Central QLD",195,"B","In Moura, worker accommodation is scarce; a certified secondary dwelling is a rentable asset, not a grey-area donga.",["biloela","theodore","blackwater"]],
  ["theodore","Theodore","ban","Central QLD",235,"B","Theodore's generous town blocks take a delivered permanent home easily — with the paperwork to match a standard house.",["moura","biloela","emerald"]],
  ["emerald","Emerald","chr","Central QLD",270,"B","Emerald is the Central Highlands hub — strong rental demand and big blocks make a certified granny flat a genuine investment.",["blackwater","capella","springsure"]],
  ["blackwater","Blackwater","chr","Central QLD",195,"B","Blackwater's mining workforce needs compliant housing — a Class 1A dwelling can be insured and legally rented, unlike caravans.",["emerald","moura","dysart"]],
  ["capella","Capella","chr","Central QLD",300,"B","North of Emerald, Capella's quiet blocks suit family accommodation delivered complete and certified.",["emerald","clermont","springsure"]],
  ["springsure","Springsure","chr","Central QLD",335,"B","Springsure's rural blocks fit a self-contained certified home for family or farm staff.",["emerald","capella","blackall"]],
  ["clermont","Clermont","isa","Central QLD",385,"B","Clermont sits in the Isaac mining belt — certified, insurable worker or family housing is worth more than any temporary unit.",["moranbah","capella","emerald"]],
  ["moranbah","Moranbah","isa","Central QLD",390,"B","Moranbah rents are among QLD's strongest — a Class 1A secondary dwelling is lettable, insurable, permanent yield.",["dysart","clermont","middlemount"]],
  ["dysart","Dysart","isa","Central QLD",330,"B","Dysart's housing squeeze makes a certified granny flat a fast, compliant way to add accommodation.",["middlemount","moranbah","blackwater"]],
  ["middlemount","Middlemount","isa","Central QLD",290,"B","Middlemount blocks can take a delivered permanent dwelling — certified for council, ready for tenants.",["dysart","moranbah","blackwater"]],
  ["barcaldine","Barcaldine","bar","Central West QLD",580,"A","Out west in Barcaldine, building trades are scarce — a complete home delivered and certified solves that in one move.",["blackall","longreach","emerald"]],
  ["blackall","Blackall","bta","Central West QLD",620,"A","Blackall's town and station blocks suit a delivered permanent home — no waiting on distant builders.",["barcaldine","longreach","springsure"]],
  ["longreach","Longreach","lon","Central West QLD",690,"A","Longreach's tourism season rewards quality short-stay — and a Class 1A dwelling can host it legally.",["barcaldine","blackall","emerald"]],
  ["mackay","Mackay","mky","North-East QLD",335,"C","Mackay's strong economy and tight rentals make a certified granny flat one of the best-yielding additions to a suburban block.",["sarina","proserpine","moranbah"]],
  ["sarina","Sarina","mky","North-East QLD",300,"C","South of Mackay, Sarina's larger blocks are ideal for family accommodation or a rentable second dwelling.",["mackay","proserpine","yeppoon"]],
  ["proserpine","Proserpine","whi","North-East QLD",460,"C","Proserpine is the gateway to the Whitsundays — house staff, family, or holiday guests in a certified permanent home.",["airlie-beach","bowen","mackay"]],
  ["airlie-beach","Airlie Beach","whi","North-East QLD",485,"C","Airlie Beach short-stay rates are among the state's best — a distinctive, certified Forge 12 earns premium nightly income, legally.",["proserpine","bowen","mackay"]],
  ["bowen","Bowen","whi","North-East QLD",530,"C","Bowen's big coastal blocks and seasonal workforce suit a self-contained certified dwelling year-round.",["proserpine","airlie-beach","ayr"]],
  ["collinsville","Collinsville","whi","North-East QLD",500,"B","Collinsville's mining and rural mix values housing that's insurable and council-approvable — not another temporary unit.",["bowen","moranbah","charters-towers"]],
  ["ayr","Ayr","bur","North-East QLD",615,"C","In the Burdekin's sugar heartland, Ayr blocks fit a certified granny flat for family or farm workers.",["home-hill","townsville","bowen"]],
  ["home-hill","Home Hill","bur","North-East QLD",605,"C","Across the river from Ayr, Home Hill's generous blocks take a delivered permanent home with ease.",["ayr","townsville","bowen"]],
  ["charters-towers","Charters Towers","cht","North-East QLD",760,"B","Charters Towers' historic blocks and surrounding stations suit a compact certified home delivered complete.",["townsville","collinsville","ayr"]],
  ["townsville","Townsville","tsv","North-East QLD",700,"C","Townsville is North QLD's biggest rental market — a Class 1A granny flat adds legal, insurable rental yield to your block.",["ayr","ingham","charters-towers"]],
  ["ingham","Ingham","hin","North-East QLD",810,"C","Ingham's cane-country blocks have the space for a self-contained certified dwelling for family or income.",["townsville","cardwell","tully"]],
  ["cardwell","Cardwell","cas","North-East QLD",860,"C","Cardwell's coastal strip between Townsville and Cairns suits a rentable, cyclone-region-engineered permanent home.",["tully","ingham","innisfail"]],
  ["tully","Tully","cas","North-East QLD",900,"C","In one of Australia's wettest towns, sealed charred-timber cladding and a steel frame matter — so does real certification.",["cardwell","innisfail","ingham"]],
  ["innisfail","Innisfail","cas","North-East QLD",950,"C","Innisfail's affordable blocks make an approved secondary dwelling one of the region's smartest value-adds.",["tully","cairns","gordonvale"]],
  ["cairns","Cairns","cai","North-East QLD",1040,"C","Cairns' tourism economy rewards standout short-stay properties — and Class 1A certification keeps the income legal and insurable.",["gordonvale","kuranda","port-douglas"]],
  ["gordonvale","Gordonvale","cai","North-East QLD",1015,"C","South of Cairns, Gordonvale's family blocks suit a granny flat that's a genuine certified home.",["cairns","innisfail","atherton"]],
  ["mareeba","Mareeba","mar","North-East QLD",1080,"B","Mareeba's dry-tropics acreage is perfect for a delivered permanent home — arriving certified, not half-built.",["kuranda","atherton","cairns"]],
  ["kuranda","Kuranda","mar","North-East QLD",1065,"C","Kuranda's rainforest blocks call for architectural character — charred timber that belongs in the landscape, certified as a real dwelling.",["mareeba","cairns","atherton"]],
  ["atherton","Atherton","tab","North-East QLD",1120,"B","On the Tablelands, Atherton's cooler climate and rich-soil blocks suit a permanent, insulated Class 1A home.",["malanda","mareeba","ravenshoe"]],
  ["malanda","Malanda","tab","North-East QLD",1110,"B","Malanda's dairy-country acreage takes a delivered certified dwelling for family or farm-stay income.",["atherton","ravenshoe","gordonvale"]],
  ["ravenshoe","Ravenshoe","tab","North-East QLD",1150,"B","Queensland's highest town needs real insulation — R4.0 roof and R2.5 walls come standard in the Forge 12.",["atherton","malanda","mareeba"]],
  ["port-douglas","Port Douglas","dou","North-East QLD",1105,"C","Port Douglas commands some of Australia's highest nightly rates — a certified, architectural Forge 12 is built to earn them legally.",["mossman","cairns","kuranda"]],
  ["mossman","Mossman","dou","North-East QLD",1120,"C","Mossman's cane-and-rainforest blocks suit a self-contained certified home minutes from Port Douglas.",["port-douglas","cairns","kuranda"]],
];

const NAME_BY_SLUG = Object.fromEntries(TOWNS.map(t => [t[0], t[1]]));
NAME_BY_SLUG["rockhampton"] = "Rockhampton";

const esc = s => s.replace(/&/g, "&amp;");

const windText = w =>
  w === "C" ? "cyclonic wind Region C" : w === "B" ? "wind Region B" : "wind Region A";

function faq(t) {
  const [slug, name, ck, , km, wind] = t;
  const c = COUNCILS[ck];
  return [
    [`How much does a granny flat cost in ${name}?`,
     `The Forge 12 is $149,000 AUD as displayed — a complete NCC Class 1A certified dwelling. Delivery to ${name} (approx. ${km} km by road from our Rockhampton display) and site connections are quoted separately. Contact us for an all-in estimate for your block.`],
    [`Are tiny homes council approved in ${name}?`,
     `Only if they are certified as a permanent dwelling. Most tiny homes and caravan-style units cannot be approved as housing. The Forge 12 is NCC Class 1A — the same classification as a standard house — so it can be lodged for approval under ${c.name}'s planning scheme via a private building certifier.`],
    [`Can I put a container or foldable home on my block in ${name}?`,
     `Shipping-container and fold-out homes usually aren't certified as Class 1A dwellings, which makes council approval, insurance and finance difficult in the ${c.name} area. A certified permanent dwelling avoids those problems — see our container homes guide for the full comparison.`],
    [`Is the Forge 12 suitable for ${name}'s climate?`,
     `Yes. ${name} sits in ${windText(wind)} (confirmed for your specific site during approval), and the Forge 12 is engineered on a BlueScope steel frame with Shou Sugi Ban charred-timber cladding, R4.0 roof / R2.5 wall insulation, cedar windows and Colorbond roofing.`],
  ];
}

function pageHTML(t) {
  const [slug, name, ck, region, km, wind, intro, nearby] = t;
  const c = COUNCILS[ck];
  const url = `${SITE}/locations/${slug}/`;
  const title = `Granny Flats & Modular Homes ${name} QLD — Class 1A | Forged Carbon`;
  const desc = `Council-approvable NCC Class 1A granny flats, modular & tiny homes delivered to ${name}, QLD (${c.name} area). The Forge 12 from $149,000 — certified, insurable, permanent.`;
  const faqs = faq(t);

  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": `Granny flats & modular homes — ${name}`,
        serviceType: "Modular home / granny flat supply and delivery",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [{ "@type": "City", name }, { "@type": "AdministrativeArea", name: c.name.replace(" Council", "") }],
        url,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Locations", item: `${SITE}/locations/` },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ],
  });

  const nearbyLinks = nearby
    .map(s => `<a href="/locations/${s === "rockhampton" ? "rockhampton" : s}/" style="color: var(--color-accent);">${NAME_BY_SLUG[s] || s}</a>`)
    .join(" · ");

  const faqHTML = faqs.map(([q, a]) => `
      <details class="faq-item">
        <summary>${esc(q)}</summary>
        <p>${esc(a)}</p>
      </details>`).join("");

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18285487994"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18285487994');</script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Forged Carbon">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
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
      <a href="/locations/"      class="nav__link nav__link--active">Locations</a>
      <a href="/guides/"         class="nav__link">Guides</a>
      <a href="/contact/"        class="nav__cta">Book a Walkthrough</a>
    </div>
    <button class="nav__toggle" id="navToggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
  </div>
</nav>

<div class="page-header" style="padding-top: calc(var(--nav-h) + var(--sp-16)); padding-bottom: var(--sp-12); border-bottom: 1px solid var(--color-hairline);">
  <div class="container">
    <p style="font-family: var(--font-mono); font-size: var(--tx-xs); text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-muted); margin-bottom: var(--sp-4);"><a href="/" style="color: var(--color-muted);">Home</a> › <a href="/locations/" style="color: var(--color-muted);">Locations</a> › ${name}</p>
    <p class="page-header__eyebrow">${esc(region)} · ${esc(c.name)}</p>
    <h1 class="page-header__title">Granny flats &amp; modular homes<br>in <em>${name}</em></h1>
    <p class="page-header__sub">${esc(intro)} The Forge 12 — NCC Class 1A certified, from $149,000, delivered from our Queensland factory.</p>
  </div>
</div>

<div class="trust-bar">
  <span class="trust-bar__item">NCC Class 1A Certified</span>
  <span class="trust-bar__item">~${km} km from our Rockhampton display</span>
  <span class="trust-bar__item">${windText(wind).replace(/^c/, "C").replace(/^w/, "W")} engineered</span>
  <span class="trust-bar__item">From $149,000 AUD</span>
</div>

<section class="section--lg" style="border-bottom: 1px solid var(--color-hairline);">
  <div class="container" style="max-width: 880px;">
    <div class="reveal">
      <span class="t-label" style="margin-bottom: var(--sp-5);">Council approval in ${esc(name)}</span>
      <h2 style="font-family: var(--font-display); font-size: clamp(var(--tx-2xl), 3.5vw, var(--tx-4xl)); font-weight: 400; line-height: 1.15; letter-spacing: -0.025em; margin-bottom: var(--sp-6);">Approvable under <em style="font-style: italic; color: var(--color-accent);">${esc(c.name)}</em></h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-6);">Secondary dwellings and small homes in ${name} are assessed under ${c.name}'s planning scheme. Because the Forge 12 is certified <strong>NCC Class 1A</strong> — the same building classification as a standard house — it can be lodged for approval as a secondary or primary dwelling through a private building certifier, insured as residential property, and legally rented.</p>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-6);">Most "tiny homes", caravan-style units and container conversions can't achieve this, because they aren't certified as permanent dwellings. That's the difference between an asset on your title and a grey-area structure.</p>
      <p style="font-size: var(--tx-base); color: var(--color-muted); line-height: 1.8;">Check current local requirements at the official <a href="${c.url}" target="_blank" rel="noopener" style="color: var(--color-accent);">${esc(c.name)} website</a>, or ask us — we work with private certifiers on lodgement and supply the full certification pack with every home.</p>
    </div>
  </div>
</section>

<section class="section" style="background: var(--color-surface); border-bottom: 1px solid var(--color-hairline);">
  <div class="container" style="max-width: 880px;">
    <div class="reveal">
      <span class="t-label" style="margin-bottom: var(--sp-5);">Tiny, container &amp; foldable homes in ${esc(name)}?</span>
      <h2 style="font-family: var(--font-display); font-size: clamp(var(--tx-2xl), 3vw, var(--tx-3xl)); font-weight: 400; line-height: 1.2; margin-bottom: var(--sp-6);">Comparing your options? <em style="font-style: italic; color: var(--color-accent);">Read this first.</em></h2>
      <p style="font-size: var(--tx-lg); color: rgba(240,237,230,0.72); line-height: 1.9; margin-bottom: var(--sp-6);">If you've been researching tiny homes, shipping-container homes or fold-out homes for ${name}, the crucial question is certification: without NCC Class 1A, most can't be council-approved as a dwelling, insured as property, or financed by a bank. The Forge 12 gives you the compact footprint with the paperwork of a real house.</p>
      <div style="display:flex; gap: var(--sp-4); flex-wrap: wrap;">
        <a href="/guides/container-homes-qld/" class="btn btn--outline">Container Homes: The Facts</a>
        <a href="/guides/tiny-homes-council-approved-qld/" class="btn btn--outline">Council-Approved Tiny Homes</a>
        <a href="/forge-12/" class="btn btn--primary">See the Forge 12</a>
      </div>
    </div>
  </div>
</section>

<section class="section--lg" style="border-bottom: 1px solid var(--color-hairline);">
  <div class="container" style="max-width: 880px;">
    <div class="section-intro reveal" style="margin-bottom: var(--sp-8);">
      <p class="section-intro__eyebrow">${esc(name)} FAQ</p>
      <h2 class="section-intro__title">Common <em>questions</em></h2>
    </div>
    <div class="reveal">${faqHTML}
    </div>
    <p class="reveal" style="margin-top: var(--sp-8); font-family: var(--font-mono); font-size: var(--tx-xs); text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-muted);">Also delivering near ${esc(name)}: ${nearbyLinks}</p>
  </div>
</section>

<section class="cta-section" style="border-top: 1px solid var(--color-hairline);">
  <div class="container">
    <p class="cta-section__eyebrow">Delivered to ${esc(name)} from our Queensland factory</p>
    <h2 class="cta-section__title">Start with a walkthrough.</h2>
    <p class="cta-section__sub">See the Forge 12 in person at our Rockhampton display — or send your block details and we'll talk delivery to ${name}, approvals and timing.</p>
    <div class="cta-section__actions">
      <a href="/contact/"  class="btn btn--primary">Book a Walkthrough</a>
      <a href="/guides/granny-flat-cost-queensland/" class="btn btn--outline">See the Costs</a>
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
        <p class="footer__col-title">Pages</p>
        <nav class="footer__nav">
          <a href="/"                class="footer__nav-link">Home</a>
          <a href="/forge-12/"       class="footer__nav-link">The Forge 12</a>
          <a href="/locations/"      class="footer__nav-link">Delivery Locations</a>
          <a href="/guides/"         class="footer__nav-link">Guides</a>
          <a href="/faq/"            class="footer__nav-link">FAQ</a>
          <a href="/certifications/" class="footer__nav-link">Certifications</a>
          <a href="/contact/"        class="footer__nav-link">Contact &amp; Walkthrough</a>
        </nav>
      </div>
      <div>
        <p class="footer__col-title">Certifications</p>
        <nav class="footer__nav">
          <span class="footer__nav-link">NCC Class 1A — Permanent Dwelling</span>
          <span class="footer__nav-link">AS/NZS 3000 — Electrical</span>
          <span class="footer__nav-link">AS/NZS 3500 — Plumbing</span>
          <span class="footer__nav-link">AS 3740 — Waterproofing</span>
          <span class="footer__nav-link">Engineer Certified Frame</span>
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
`;
}

function hubHTML() {
  const regions = {};
  const all = [["rockhampton","Rockhampton","rrc","Central QLD",0,"C","",[]], ...TOWNS];
  for (const t of all) (regions[t[3]] ||= []).push(t);
  const sections = Object.entries(regions).map(([region, ts]) => `
    <div class="reveal" style="margin-bottom: var(--sp-12);">
      <h2 style="font-family: var(--font-display); font-size: var(--tx-2xl); margin-bottom: var(--sp-6);">${esc(region)}</h2>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 3px;">
        ${ts.map(([slug, name, ck]) => `<a href="/locations/${slug}/" style="background: var(--color-surface); border: 1px solid var(--color-hairline); padding: var(--sp-5); display:block;">
          <span style="font-family: var(--font-display); font-size: var(--tx-lg); color: var(--color-text); display:block;">${name}</span>
          <span style="font-family: var(--font-mono); font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-muted);">${esc(COUNCILS[ck].name)}</span>
        </a>`).join("\n        ")}
      </div>
    </div>`).join("\n");

  const url = `${SITE}/locations/`;
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18285487994"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18285487994');</script>
  <title>Delivery Locations — Granny Flats &amp; Modular Homes Across QLD | Forged Carbon</title>
  <meta name="description" content="NCC Class 1A granny flats and modular homes delivered across Central Queensland, the Central West and North Queensland — from Rockhampton to Cairns. Find your town.">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="Delivery Locations — Forged Carbon">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/images/Front-new.png">
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
      <a href="/locations/"      class="nav__link nav__link--active">Locations</a>
      <a href="/guides/"         class="nav__link">Guides</a>
      <a href="/contact/"        class="nav__cta">Book a Walkthrough</a>
    </div>
    <button class="nav__toggle" id="navToggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
  </div>
</nav>

<div class="page-header" style="padding-top: calc(var(--nav-h) + var(--sp-16)); padding-bottom: var(--sp-12); border-bottom: 1px solid var(--color-hairline);">
  <div class="container">
    <p class="page-header__eyebrow">Queensland factory · Delivered Australia-wide</p>
    <h1 class="page-header__title">Where we <em>deliver</em></h1>
    <p class="page-header__sub">The Forge 12 is built in Queensland and delivered complete — certified NCC Class 1A before it arrives. Find your town for local approval details, delivery distance and FAQs.</p>
  </div>
</div>

<section class="section--lg">
  <div class="container">
${sections}
    <p class="reveal" style="font-family: var(--font-mono); font-size: var(--tx-xs); text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-muted);">Not listed? We deliver Australia-wide — <a href="/contact/" style="color: var(--color-accent);">ask about your town</a>.</p>
  </div>
</section>

<section class="cta-section" style="border-top: 1px solid var(--color-hairline);">
  <div class="container">
    <p class="cta-section__eyebrow">On display in Rockhampton — by appointment</p>
    <h2 class="cta-section__title">One home. Any town.</h2>
    <div class="cta-section__actions">
      <a href="/contact/"  class="btn btn--primary">Book a Walkthrough</a>
      <a href="/forge-12/" class="btn btn--outline">View the Forge 12</a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer__bottom" style="border-top:none; padding-top:0;">
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
`;
}

// ---- emit ----
let made = 0, skipped = 0;
for (const t of TOWNS) {
  const dir = join(ROOT, "locations", t[0]);
  const file = join(dir, "index.html");
  if (existsSync(file)) { skipped++; continue; }
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, pageHTML(t));
  made++;
}
writeFileSync(join(ROOT, "locations", "index.html"), hubHTML());

// ---- sitemap ----
const staticPaths = ["", "forge-12/", "use-cases/", "story/", "certifications/", "contact/", "faq/", "guides/",
  "guides/granny-flat-cost-queensland/", "guides/granny-flat-rules-qld/", "guides/off-grid-solar-homes-qld/",
  "guides/container-homes-qld/", "guides/tiny-homes-council-approved-qld/", "guides/foldable-expandable-homes-qld/",
  "display-model-for-sale/", "locations/", "locations/rockhampton/"];
const urls = [...staticPaths.map(p => `${SITE}/${p}`), ...TOWNS.map(t => `${SITE}/locations/${t[0]}/`)];
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n") + `\n</urlset>\n`);

writeFileSync(join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`towns generated: ${made}, skipped(existing): ${skipped}, hub + sitemap (${urls.length} urls) + robots.txt written`);
