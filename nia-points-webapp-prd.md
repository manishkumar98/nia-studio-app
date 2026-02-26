# Nia Points Web App
## Product Requirements Document
**Document:** PRD-NIA-WEBAPP-003
**Version:** 2.0
**Date:** 25 February 2026
**Based on:** PRD-NIA-PTS-001 + Nia Store App (nia-studio-app.html)
**Primary User:** Residents (workers)
**Phase:** Full Phase 2 — all roles, both login methods
**Status:** DRAFT — For Review

---

## 1. North Star

The resident is the only user who matters in the design room. Every screen, every interaction, every word of copy is written for a blue-collar migrant worker who may be opening an app like this for the first time. EAEs, JCOs, and vendors get functional interfaces — residents get an experience.

The app has one job: make a worker feel that showing up, behaving well, and participating in their community has visible, tangible, immediate value.

---

## 2. Users & Roles

| Role | Who | Design Priority |
|---|---|---|
| **Resident** | Worker living in a Nia Nest | ⭐ Primary — full UX attention |
| **EAE** | On-ground executive managing the Nest | Functional — speed over aesthetics |
| **JCO** | Manager supervising EAEs | Functional — audit and approvals |
| **Vendor** | Haat nano-entrepreneur at a stall | Minimal — scan and confirm only |

All roles share one app, one URL. Role is detected at login and determines the interface rendered. A resident sees zero staff controls. An EAE sees the resident view + a Staff tab.

---

## 3. Login — Both Methods Supported

### 3.1 Phone + OTP (Preferred)
- Resident enters 10-digit mobile number
- OTP sent via SMS (6 digits, 5-minute expiry)
- OTP screen auto-submits on 6th digit entry
- Works for any resident with a mobile number on record

### 3.2 Employee ID + PIN (Fallback)
- Resident enters their Nia Employee ID (issued at onboarding)
- 4-digit PIN (set on first login, changeable from Profile)
- For residents who share phones or don't receive SMS reliably
- PIN reset requires EAE verification (EAE confirms identity in-person, triggers reset link)

### 3.3 Login Rules
- **First-time login:** Phone OTP only. Resident sets PIN during onboarding flow (optional but encouraged).
- **Session:** JWT in memory, 8-hour expiry. Resident stays logged in unless they manually log out.
- **No self-registration.** EAEs create resident accounts at Nest onboarding. If phone not found: "Not registered yet — ask your EAE."
- **Forgot PIN:** "Use OTP instead" option always visible on PIN screen.
- **Language selection:** Shown on first login only. English or हिन्दी. Stored in profile, changeable anytime.

---

## 4. Resident Experience

### 4.1 Home Screen

The existing Nia Store UI (`nia-studio-app.html`) is the home screen — hero, pillar cards, product grid, cart drawer — all preserved exactly. Three additions are layered on:

**Points Banner** — inserted between the nav and the hero section:
```
┌─────────────────────────────────────────────┐
│  ⚡ Your Points                    185 pts  │
│  You're 30 pts from a free Umoja meal →     │
└─────────────────────────────────────────────┘
```
- Tapping anywhere on the banner navigates to the Points tab
- Background color shifts subtly based on balance tier:
  - 0–50 pts: warm amber tint (motivating, not alarming)
  - 51–200 pts: neutral white
  - 200+ pts: soft blue tint (celebration)

**Earn Badges on Product Cards** — each service card gets a small pill below the product name:
- Co-Living Housing → `🏠 Earn 15 pts for on-time rent`
- Job Matching Service → `💼 Earn 30 pts per job referral`
- Digital Literacy Course → `🎓 Earn 10 pts for attending`
- Community Membership → `🤝 Earn 5 pts/week`
- (Full mapping in Appendix A)

**Bottom Tab Bar (mobile):**
```
[ 🏠 Home ] [ ⚡ Earn ] [ 🎁 Redeem ] [ 🏆 Ranks ] [ 👤 Me ]
```
Desktop retains the existing top nav with these added as links.

---

### 4.2 Earn Tab

Residents see what actions earn points and what their status is today. This is read-only for residents — they cannot self-award. Points come from EAE actions and a small set of automatic triggers.

**Layout:** Four collapsible sections. Each row shows the action, the points value, how it's verified, and today's status (Earned ✓ / Not Yet ○ / Not Available –).

**Daily Actions**
| Action | Pts | Verified By | Notes |
|---|---|---|---|
| Nest made before 7 AM | +5 | EAE morning check | Daily cap: 5 pts |
| Zero violations today | +2 | Auto | Passive — no deductions = earned |
| Meal feedback (Umoja app) | +1 | Auto | Max 2/day |
| Common area cleanup | +3 | EAE confirmation | Voluntary sign-up |

**Weekly Actions**
| Action | Pts | Verified By |
|---|---|---|
| Jambo attendance (full session) | +10 | EAE register |
| Sports / Tribe activity | +5 | EAE event log |
| Skill badge session | +10 | Training partner |
| Jambo vendor stall | +15 | EAE + Haat log |

**Referrals**
- Resident taps "Share my referral link" → unique link/code generated
- Tracks three referral types: New resident (+50), Flow job placement (+30), Haat onboarding (+25)
- Status pipeline shown: Invited → Moved In / Started / Set Up → Points Credited
- Referred person must stay/work 7+ days before points post

**Community Actions**
Resident taps "I did this" on eligible actions. This sends a verification request to their EAE or JCO. Once approved, points auto-post.

| Action | Pts | Approver |
|---|---|---|
| Mentor a new resident (first 7 days) | +20 | JCO Res |
| Lead a Jambo session / teach a skill | +25 | EAE |
| Festival organizing committee | +15 | EAE |
| Resolve a conflict (peer mediation) | +10 | JCO Res |
| Report maintenance issue (verified) | +5 | Facility team |
| Suggest improvement (implemented) | +20 | JCO Res |
| 100% rent on-time (full month) | +15 | Auto (finance) |

**Monthly Earnings Tracker** — at top of Earn tab:
```
This month: 145 pts earned   ████████░░░░  Target: 220 pts
At this pace you'll hit your target by [date]
```

---

### 4.3 Redeem Tab

**Catalog** — same card grid style as the store. Filter pills: All / Food / Housing / Digital / Essentials / Skills / Special.

| Reward | Cost | Fulfillment | Category |
|---|---|---|---|
| Haat Voucher ₹50 | 50 pts | Instant QR | Food & Shopping |
| Haat Voucher ₹100 | 90 pts | Instant QR | Food & Shopping |
| Haat Voucher ₹200 | 170 pts | Instant QR | Food & Shopping |
| Free Umoja Meal | 30 pts | Same day | Food |
| Free Chai Week (Sukh Cafe) | 25 pts | Starts Monday | Food |
| Phone Recharge ₹49 | 50 pts | 24 hrs | Digital |
| Grooming Kit | 60 pts | Subject to stock | Essentials |
| Laundry Credit 5kg | 20 pts | Same week | Essentials |
| Skill Badge Priority Enrollment | 20 pts | Next session | Skills |
| Video Call Booth 30 min | 15 pts | Book 1 day ahead | Community |
| Jambo Priority Stall Spot | 40 pts | Next Jambo | Community |
| Rent Discount ₹100 off | 100 pts | Next billing cycle | Housing |
| Rent Discount ₹250 off | 225 pts | Next billing cycle | Housing |
| Festival Special Gift Box | 75 pts | Festival period | Special |

**Redemption Flow:**
1. Tap reward card → detail screen (name, description, fulfillment time, cost, current balance)
2. If sufficient balance: blue "Redeem for X pts" button. If not: "You need X more pts" + earn suggestion link
3. Confirmation sheet: "Redeem [Reward] for [X] pts? New balance: [Y] pts"
4. On confirm: points deducted instantly, QR generated, stored in My Vouchers
5. Toast: "Done! Your [Reward] is ready."

**My Vouchers** — section at bottom of Redeem tab:
- Active QR codes: reward name, ₹ value, expiry
- Tap → full-screen QR (brightness auto-max) for stall scan
- Expired vouchers: grayed out, archived, tap to see details
- Redeemed vouchers: green checkmark, timestamp

**Rules (visible to resident via "How points work" info link):**
- Points never expire
- Minimum redemption: 15 pts
- Points are personal — cannot be transferred or gifted
- QR vouchers are single-use and tied to your account

---

### 4.4 Leaderboard (Ranks Tab)

**My Nest** (default view):
- Monthly ranking of all residents in the user's Nest
- Current user row always visible (pinned) even if outside top 10
- Top 3: gold / silver / bronze badge
- Privacy toggle: show my name or appear as "Resident #[N]"
- Resets on 1st of each month; previous month archived

**All Nests** (tab toggle):
- Nest-level leaderboard for the Theatre
- Average pts per resident per month
- Resident sees their Nest highlighted
- Nest names shown (e.g., "Kush-12", "DN-04")

**Monthly Prize callout** (if enabled by Theatre Lead):
```
🏆 Top Nest this month wins [prize]. 
You're currently Nest #2. 
Keep going — 200 pts behind Nest Kush-08.
```

---

### 4.5 Profile Tab (Me)

- Name, phone number, Nest, date joined
- Current balance (large, prominent)
- Lifetime stats: Total earned / Total redeemed / Active streak (days with at least one credit)
- Language toggle: English / हिन्दी
- Notification preferences (push on/off per event type)
- Login method: shows active method, option to add/change PIN
- **Transaction History** — full ledger, infinitely scrollable
  - Each row: action label, pts delta (green/red), logged by, timestamp
  - Filter: All / Credits / Debits / Redemptions / This Month / Last Month
  - Tap any deduction → "Dispute this" option → sends to JCO queue with resident's note
- Logout

---

## 5. EAE Interface

EAE logs in and sees the resident home view + a **Staff** tab in the nav (invisible to residents).

### 5.1 My Residents
- Searchable, filterable list of all residents in the EAE's Nest(s)
- Each row: name, balance, last activity, risk flag (⚠ if balance < 0 two weeks running)
- Tap resident → their full profile + award/deduct action

### 5.2 Award / Deduct Points

**Individual Action:**
1. Select resident (search or scroll)
2. Choose action from structured list (credits and deductions, same tables as Section 4.2 / deductions table in Section 6)
3. For deductions > 10 pts: photo upload required
4. For deductions > 25 pts: submits to JCO queue instead of posting directly
5. Add optional note → Preview → Confirm
6. Resident notified instantly

**Morning Bulk Check (shortcut for daily Nest-made check):**
- List of all residents, two-tap toggle: ✓ Made / ✗ Not Made
- EAE completes the list → "Submit Morning Check" → auto-posts +5 or -3 for each
- Time-stamped; locks after 10 AM

### 5.3 Pending Approvals
Community action requests submitted by residents awaiting EAE sign-off. EAE sees action, resident, timestamp, any note. Approve → points post. Reject → resident notified with reason.

### 5.4 Deductions Sent to JCO
EAE's submitted high-value deductions awaiting JCO approval. Status: Pending / Approved / Rejected / Modified.

### 5.5 Daily Summary
All transactions logged today. Total credits, total deductions, residents affected. "Submit Day's Log" marks it complete for JCO review.

---

## 6. Deduction Reference (EAE Action List)

| Category | Violation | Pts | Verification |
|---|---|---|---|
| Hygiene | Nest not made by 10 AM | -3 | EAE spot check (warning first) |
| Hygiene | Spitting in common areas | -10 | EAE / resident report |
| Hygiene | Soiling bathroom | -10 | EAE (photo required) |
| Hygiene | Littering corridors | -5 | EAE spot check |
| Conduct | Shouting / disturbance | -15 | EAE / JCO report |
| Conduct | Verbal abuse / intimidation | -25 | JCO investigation |
| Conduct | Physical altercation | -50 | JCO (may trigger eviction review) |
| Conduct | Harassment | -50 | JCO (zero tolerance) |
| Conduct | Alcohol on premises | -30 | EAE / JCO |
| Conduct | Smoking in non-designated areas | -10 | EAE spot check |
| Conduct | Property damage (intentional) | -30 | Facility + repair charge |
| Compliance | Unauthorized overnight guest | -20 | EAE / security log |
| Compliance | Quiet hours violation (10PM–6AM) | -10 | EAE / complaint |
| Compliance | Cooking in Nest | -15 | EAE inspection |
| Compliance | Tampering with electrical fittings | -20 | Facility inspection |
| Compliance | Missed rent (per week late) | -10 | Auto (finance) |

Deductions ≤ 25 pts: EAE posts directly. Deductions > 25 pts: JCO approval required before posting.

---

## 7. JCO Interface

### 7.1 Approval Queue
High-value deductions from all EAEs. Per entry: resident, action, EAE, photo, note. Actions: Approve / Reject / Modify amount.

### 7.2 Dispute Resolution
Resident-flagged transactions. JCO sees both sides. Uphold (deduction stands) or Reverse (balance restored). Resident notified.

### 7.3 Escalation Flags
Auto-flagged: residents with balance < 0 for 2+ consecutive weeks. JCO initiates a private conversation log. No auto-penalty — goal is course correction.

### 7.4 Nest Analytics Dashboard
- % residents earning pts this month (target: 60%)
- % residents redeeming (target: 50%)
- Estimated monthly cost vs ₹7,000 cap
- Top 5 earners, bottom 5 (at-risk)
- EAE log consistency (did EAE submit daily logs?)
- Churn risk list

---

## 8. Vendor Interface

Single-purpose. No store, no points, no nav.

**QR Scanner Screen:**
- Large camera viewfinder
- On valid scan: resident name, voucher value (₹), reward type, confirm button
- On confirm: voucher marked redeemed, settlement logged
- Error states: already redeemed / expired / ID mismatch

**Daily Settlement:**
- Running total of vouchers redeemed today
- Month-end export for Nia reconciliation

---

## 9. Existing Functionality — Must Preserve

This section documents every feature, behavior, and UI element from the current `nia-studio-app.html` that must be carried over without regression. Nothing here is optional. The points system is additive — it must not break, replace, or alter any of the following.

### 9.1 Navigation Bar
- Sticky top nav with frosted glass background (`backdrop-filter: blur`)
- Nia logo (SVG icon + wordmark) — clicking scrolls to hero section
- Nav links: Home, Studio, Flow, Tribe, Shop — each triggers `filterAndScroll()` or `scrollTo()` accordingly
- Active state on "Home" link by default
- Search icon button — focuses the search input and scrolls to shop section
- Cart/bag icon with animated badge counter
  - Badge scales in (`cubic-bezier` spring animation) when cart count > 0
  - Badge displays item count, not unique products
- On mobile (≤ 734px): nav links hidden, logo + icons only

### 9.2 Hero Section
- Eyebrow label: "Nia One Ecosystem" in studio orange (`#bf4800`)
- H1: "Live. Work. Grow." — gradient text (dark to mid-gray), large responsive font (`clamp(40px, 8vw, 80px)`)
- Subheading: "Three pillars, one mission..." — responsive font, secondary color
- Two CTA buttons:
  - Primary (blue pill): "Explore all services" → scrolls to shop
  - Ghost link: "Learn more" → scrolls to pillars section
- Both buttons have arrow SVG icons

### 9.3 Featured Pillar Cards (3-column strip)
- Three cards: Studio 🏠, Flow 🚀, Tribe 🤝
- Each card: large emoji, title, description, "Explore [Pillar]" link button
- Clicking any card calls `filterAndScroll(category)` — filters the product grid AND scrolls to shop
- Hover: `scale(1.02)` transform
- Active state: blue outline when that category filter is active
- On mobile (≤ 734px): stacks to single column

### 9.4 Shop Section
**Section header:** "The Nia Store." heading + "Everything you need to work, live, and thrive." subtext

**Search bar:**
- Live search input — filters products in real time as user types (`oninput`)
- Searches across: product name, description, and category string
- Styled with embedded search SVG icon on the left
- Focus state: blue border + white background + blue glow shadow
- Placeholder: "Search services..."

**Filter pills:**
- Four pills: All Products / Studio / Flow / Tribe
- Active pill: dark background + white text
- Clicking a pill sets `currentFilter`, removes active from all pills, adds to clicked pill
- Also updates the featured pillar card active state to match

**Product grid:**
- Responsive CSS grid: `repeat(auto-fill, minmax(240px, 1fr))`
- On mobile ≤ 734px: 2 columns. On ≤ 420px: 1 column
- Empty state: "No results found." centered message spanning full grid width

### 9.5 Product Cards (All 14 Products)
Each card must render with:
- **Hero image area** (200px height, 160px on mobile): emoji centered, gradient background per category
  - Flow: blue gradient (`#e3f0ff → #f5f5f7`)
  - Studio: orange gradient (`#fff0e6 → #f5f5f7`)
  - Tribe: gray gradient (`#e8e8ed → #f5f5f7`)
- **Category tag**: uppercase, color-coded (blue/orange/gray), letter-spaced
- **Product name**: 17px semibold
- **Description**: 13px, 2-line clamp with ellipsis overflow
- **Price**: formatted with `toLocaleString('en-IN')` and ₹ symbol. Period (e.g. "/mo") in tertiary color. Free products show "Free"
- **Add to Bag button**: blue pill button
  - On click: adds to cart, changes to black "Added" state, shows toast
  - State persists while item is in cart; resets on remove
  - `event.stopPropagation()` prevents card click from triggering
- **Hover**: card lifts (`translateY(-6px)`) + stronger shadow. Hero emoji scales up (`scale(1.05)`)

**All 14 products must be present with exact data:**

| ID | Name | Category | Price | Period | Emoji |
|---|---|---|---|---|---|
| 5 | Co-Living Housing | studio | ₹3,999 | /mo | 🏠 |
| 6 | Daily Meals Plan | studio | ₹1,499 | /mo | 🍛 |
| 7 | Health & Wellness Pack | studio | ₹299 | /mo | 🏥 |
| 8 | Financial Savings Account | studio | Free | — | 💰 |
| 9 | Essential Kit Bundle | studio | ₹599 | — | 🎒 |
| 1 | Job Matching Service | flow | ₹199 | /mo | 💼 |
| 2 | Career Pathway Plan | flow | ₹499 | /qtr | 📈 |
| 3 | Quick Gig Access | flow | ₹99 | /wk | ⚡ |
| 4 | Resume & Profile Builder | flow | ₹149 | — | 📝 |
| 10 | Digital Literacy Course | tribe | ₹249 | — | 📱 |
| 11 | English Communication | tribe | ₹399 | — | 💬 |
| 12 | Leadership Programme | tribe | ₹799 | — | 🌟 |
| 13 | Community Membership | tribe | ₹99 | /mo | 🤝 |
| 14 | Skill Certification | tribe | ₹599 | — | 🏆 |

### 9.6 Cart Drawer
- Triggered by cart icon in nav OR "Check Out" button
- Slide-in from right (`translateX(100%) → 0`), `cubic-bezier(0.32, 0.72, 0, 1)`
- Dark overlay behind drawer; clicking overlay closes cart
- Close (✕) button top-right

**Empty state:** Cart icon emoji (🛒) + "Your Bag is empty." — checkout button disabled

**Cart item row:**
- Category-colored square thumbnail (64×64px, 14px radius) with product emoji
- Product name + total price for that line (price × qty)
- Quantity controls: − button / qty number / + button (circular, bordered)
- Remove link (blue text, right-aligned)
- Fade-up animation on item entry

**Footer:**
- "Subtotal" label + running total in ₹ (formatted `en-IN`)
- Full-width "Check Out" button — blue, disabled when cart empty

**Checkout behavior:**
- Clears cart completely
- Closes drawer
- Shows toast: "Order placed — ₹[total]"
- Re-renders product grid (resets all "Added" button states)
- Resets cart badge to 0

### 9.7 Toast Notifications
- Fixed bottom-center, pill shape, dark background, white text
- Slides up on show (`translateY(80px) → 0`), spring animation
- Auto-dismisses after 2800ms
- Used for: "Added to your Bag" and "Order placed — ₹[amount]"

### 9.8 Promo Section
- Full-width gray background section
- Heading: "Built for India's workforce."
- Subtext: "From migrants to gig workers..."
- Blue pill CTA: "Get started" → scrolls to shop

### 9.9 Footer
- Four-column grid (2-col on mobile): Shop & Learn / Services / Nia One / Support
- Each column has a heading and 3 navigation links
- Footer bottom bar: copyright "© 2026 Nia One. All rights reserved." + Privacy Policy / Terms of Use / Legal links
- All footer links are currently `javascript:void(0)` — preserve this behavior in MVP

### 9.10 Scroll Behavior
- All `scrollTo(id)` calls use `scrollIntoView({ behavior: 'smooth', block: 'start' })`
- Sections with IDs that must remain: `hero`, `pillars`, `shop`, `promo`, `footer`
- Nav search button: focuses search input AND scrolls to shop section simultaneously

### 9.11 Responsive Breakpoints (Must Not Regress)
| Breakpoint | Changes |
|---|---|
| ≤ 734px | Nav links hidden; pillar cards stack 1-col; product grid 2-col; reduced padding throughout |
| ≤ 420px | Product grid goes 1-col |

---

## 10. Notifications (Points System)

| Trigger | Message | Channel |
|---|---|---|
| Points credited | "+10 pts for Jambo! Balance: 185 pts" | Push + WhatsApp |
| Points deducted | "-10 pts logged. Balance: 175 pts. Dispute?" | Push + WhatsApp |
| Voucher issued | "Your ₹100 Haat Voucher is ready. Show QR at stall." | Push |
| Balance < 50 pts | "Low balance. Attend Jambo Saturday to earn 10 pts." | Push |
| Referral confirmed | "+50 pts! Your referral moved in." | Push + WhatsApp |
| Dispute resolved | "Your dispute: [outcome + reason]" | Push + WhatsApp |
| Weekly summary | "This week: +45 pts earned. Balance: 220 pts." | WhatsApp |

WhatsApp bot keywords for non-app users: `BALANCE` → current pts, `REDEEM` → catalog link, `HELP` → EAE contact.

---

## 10. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Vanilla JS / HTML / CSS (extend existing) | No framework change; existing store is pure HTML |
| Auth | Phone OTP + Employee ID + PIN | Both methods; OTP via MSG91/Gupshup |
| Session | JWT in memory (no localStorage) | Security; works within app constraints |
| Backend | Node.js + Express | Lightweight REST API |
| Database | PostgreSQL | Structured ledger; append-only transactions |
| Cache | Redis | Real-time balance reads |
| QR | UUID-based, cryptographically signed | Single-use, resident ID verified at scan |
| Notifications | Firebase (push) + WhatsApp Business API | Dual channel coverage |
| Storage | S3-compatible | EAE photo evidence uploads |

---

## 11. Screen Map

```
/login
  ├── Phone + OTP
  └── Employee ID + PIN

/home (Resident)           ← Existing store + points banner + earn badges
/earn                      ← Daily / Weekly / Referral / Community actions
/redeem                    ← Reward catalog + My Vouchers
/ranks                     ← My Nest + All Nests leaderboard
/profile                   ← Account + ledger + dispute + settings

/staff (EAE only)
  ├── My Residents
  ├── Award / Deduct (individual)
  ├── Morning Bulk Check
  ├── Pending Approvals
  └── Daily Summary

/manage (JCO only)
  ├── Approval Queue
  ├── Dispute Resolution
  ├── Escalation Flags
  └── Nest Analytics

/vendor (Vendor only)
  ├── QR Scanner
  └── Daily Settlement
```

---

## 12. MVP Scope

**Ships at Pilot (Mar 2026)**
- Login: phone OTP + Employee ID + PIN, both working
- Resident: points banner, earn tab (read-only), redeem tab + QR vouchers, transaction history, leaderboard (My Nest)
- EAE: My Residents, individual award/deduct, morning bulk check
- JCO: approval queue for > 25 pt deductions, dispute resolution
- Vendor: QR scanner
- WhatsApp notifications for point events

**Sprint 2 (Apr 2026)**
- Referral link generation + status tracking
- Community action request + EAE/JCO approval flow
- All Nests leaderboard
- Nest Analytics for JCO
- Hindi language toggle (all strings)

**Phase 3 (Jul–Aug 2026)**
- Rafiki AI nudges ("15 pts from a free meal — here's how")
- Streak badges + bonus multipliers
- Geo-fenced Jambo auto check-in
- ANCHOR tenure multiplier (1.2x after 6 months)

---

## 13. Open Questions

1. **Signup bonus:** 50 pts on first login? Recommend yes — drives early earning behavior and immediate redemption exploration.
2. **PIN reset UX:** EAE verifies identity in-person and triggers reset. What is the exact EAE flow for this? Needs Ops sign-off.
3. **Rent discount automation:** Manual (JCO applies discount after redemption) in MVP, or direct billing API? Recommend manual for MVP.
4. **Non-smartphone fallback:** Physical QR card issued by EAE for residents without phones. Card design and print process needed from Ops before pilot.
5. **EAE over-awarding audit:** Recommend JCO auto-alert if any EAE awards > 300 pts in a single day — signals potential gaming.
6. **Festival box stock availability:** Need a simple in-stock/out-of-stock flag per reward in the backend. Who owns inventory updates — Haat coordinator?

---

## Appendix A — Product → Earn Badge Mapping

| Product ID | Product Name | Earn Badge |
|---|---|---|
| 5 | Co-Living Housing | 🏠 Earn 15 pts for on-time rent |
| 6 | Daily Meals Plan | 🍛 Earn 1 pt per meal feedback |
| 7 | Health & Wellness Pack | 🏥 Stay well, keep earning |
| 8 | Financial Savings Account | 💰 Auto-save + earn pts for on-time rent |
| 9 | Essential Kit Bundle | 🎒 Part of your Nest starter |
| 1 | Job Matching Service | 💼 Earn 30 pts per job referral |
| 2 | Career Pathway Plan | 📈 Complete milestones, earn pts |
| 3 | Quick Gig Access | ⚡ Earn 30 pts when your referral gets placed |
| 4 | Resume & Profile Builder | 📝 Share with friends, earn referral pts |
| 10 | Digital Literacy Course | 📱 Earn 10 pts for attending |
| 11 | English Communication | 💬 Earn 10 pts for attending |
| 12 | Leadership Programme | 🌟 Earn 10 pts + Lead a session for 25 pts |
| 13 | Community Membership | 🤝 Earn 5 pts/week for participation |
| 14 | Skill Certification | 🏆 Earn 10 pts + cert upon completion |

---

*End of document. Next: Figma wireframes for Login screen, Resident Home (points banner), and EAE Award Points screen. Review with Deepak w/c 2 March 2026.*
