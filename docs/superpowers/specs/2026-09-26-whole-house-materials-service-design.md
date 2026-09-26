# Whole-House Building Materials Service — Design

**Date:** 2026-09-26
**Status:** Approved, ready for implementation planning

## Goal

Forged Carbon is adding a new service: sourcing and supplying building materials
(kitchens, bathroom fixtures, general building materials) for **any** home
project in Australia — not limited to Forge 12 buyers or tiny homes/granny
flats. This is a genuine expansion beyond the company's current identity as a
modular tiny-home builder, but launches under the existing Forged Carbon brand
rather than a new sub-brand, on the existing site.

The business is still in the sourcing stage — no suppliers or pricing are
locked in yet. This phase ships a real, complete page that explains the
service and captures enquiries, without overclaiming a live catalog that
doesn't exist yet.

## Target audience

**Phase 1 (this implementation): Queensland.** Any homeowner, renovator, or
builder in Queensland planning a new build, renovation, or extension — a
broader audience than Forged Carbon's existing tiny-home/granny-flat customer
base, but scoped to the state the business can actually speak to with
confidence right now, consistent with the "QLD-solid, interstate case-by-case"
framing already used across the location pages and guides.

Australia-wide expansion is an explicit future phase (see below), not part of
this build.

## Service model

**Whole-house package / consultation**, not a self-serve product catalog.
Customer describes their project, gets a curated materials package (kitchen +
bathroom + building materials together where relevant) via a quote/consultation
process. This is a deliberate choice over an e-commerce catalog: it matches
where sourcing actually is right now (no locked-in suppliers or prices to
display), and it's a genuinely different, more valuable service shape than "buy
a sink online."

## Branding & site placement

- Stays under the Forged Carbon brand directly — no separate sub-brand name.
- Lives on the existing site (forgedcarbon.com.au), leveraging existing
  domain authority, not a new domain.
- New top-level nav item: **"Materials"**.
- URL: `/materials/`

## Page structure

One page today, deliberately structured so each category section can graduate
to its own dedicated URL later once real suppliers/products exist — without
breaking any internal links, because the anchor IDs used now become the future
page slugs.

Sections, in order:

1. **Hero** — the pitch. Forged Carbon now sources and supplies building
   materials for any home project in Queensland, not just the Forge 12.
   Honest framing: genuinely imported, WaterMark (plumbing) / SAA-RCM
   (electrical) certified where legally required — not just "cheap," since
   compliance is non-negotiable regardless of country of origin.
2. **How it works** — a short, numbered explainer: tell us about your project
   → we put together a materials package → you get a quote → we supply. Sets
   the expectation that this is consultative, not instant checkout.
3. **`#kitchens`** — Kitchens category section: what's covered (cabinetry,
   benchtops, fixtures), same certified/compliant positioning as the rest of
   the site. No specific products or prices (none exist yet).
4. **`#bathroom`** — Bathroom category section: sinks, baths, showers,
   tapware. Same treatment — categories and positioning, not specific SKUs.
5. **`#building-materials`** — Building Materials category section: the
   broader "anything to do with building" catch-all, kept intentionally
   general since sourcing isn't locked in yet.
6. **Enquiry form** — one form serving the whole page (see below).

## Enquiry form

Reuses the site's existing form mechanism exactly — Web3Forms, same access
key already configured for forgedcarbon.com.au, same redirect-to-`/thank-you/`
pattern used on `/contact/`. No new service to set up or configure.

Differences from the existing contact form:
- `subject` hidden field: `"Materials enquiry — Forged Carbon"` (distinguishes
  these leads from Forge 12 walkthrough bookings in the inbox)
- New **Category** field: Kitchen / Bathroom / Building Materials / Not sure
  yet — pre-sorts leads without needing a separate form per section
- New **Project type** field: New build / Renovation / Extension
- New **Location** field — free-text "Suburb/Town" (matching the QLD-wide
  scope of this phase; a dropdown becomes worthwhile once this expands
  beyond one state)
- Reuses the existing generic `/thank-you/` page as-is — not worth a
  materials-specific variant for this phase

## SEO / technical integration

- **Title:** "Whole-House Building Materials Queensland — Kitchens, Bathrooms
  & More, Supplied | Forged Carbon"
- **Meta description, canonical, OG tags:** following the same pattern as
  every other page on the site, scoped to Queensland.
- **Structured data:** `Service` schema only (matching the pattern already
  used on location pages — `provider` linked to the existing `#business`
  entity, `areaServed: Queensland`). **Deliberately no `Product`/`Offer`
  schema** — that would imply specific purchasable items with real prices,
  which don't exist yet. Adding Product schema is an explicit trigger for a
  later phase, once real suppliers and pricing exist.
- **Sitemap:** add `/materials/` to `sitemap.xml`.
- **Nav rollout:** the nav bar is duplicated in every one of the site's ~100
  HTML files (no shared include/templating system), so adding "Materials" to
  the nav means a scripted find/replace pass across all of them — the same
  approach already used for the GA4 rollout earlier in the project. Not a
  manual per-file edit.
- **Homepage teaser:** one new section on the homepage introducing the
  materials service and linking to `/materials/`. Not a homepage redesign —
  additive only.

## Explicit non-goals for this phase

- No live product catalog, no real prices, no supplier names — none of that
  exists yet.
- No `Product`/`Offer` schema (see above).
- No splitting Kitchens/Bathroom/Building Materials into separate URLs yet —
  the page is *built* to allow that later, but doesn't do it now, since
  there isn't enough real content per category yet to justify three
  standalone pages (the same thin-content trap avoided elsewhere on this
  site).
- No changes to the Forge 12 product line, its pricing, or its existing
  location-page network. This is purely additive.

## Future phases (not this implementation)

- Expand from Queensland to Australia-wide once QLD sourcing/demand is
  proven — at that point, revisit the Location field (dropdown of states)
  and the Service schema's `areaServed`.
- Split category sections into dedicated `/materials/kitchens/`,
  `/materials/bathroom/`, `/materials/building-materials/` pages once real
  supplier relationships and product data exist.
- Add `Product`/`Offer` schema per item once real pricing exists.
- Revisit whether a materials-specific thank-you page is warranted once
  volume justifies it.
