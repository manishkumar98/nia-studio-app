# Nia — Phased Build Architecture
## Solo Developer · Antigravity · Pilot by March 2026

---

## My Recommendation Upfront

**4 weeks, solo dev, AI platform = you cannot build everything at once.**

Here is the honest prioritization: the pilot needs exactly **two things** to work — residents can see their points and EAEs can award them. Everything else is either polish or Phase 2.

Ship the minimum that proves the concept. That is Phase 1. Everything else follows.

---

## The 4-Phase Plan

```
Week 1          Week 2          Week 3          Week 4
────────────    ────────────    ────────────    ────────────
PHASE 1         PHASE 2         PHASE 3         PHASE 4
Store + Auth    Points Core     Staff Tools     Backend Live
(Frontend)      (Frontend)      (Frontend)      (Full Stack)
                                                    │
                                                    ▼
                                              PILOT LAUNCH
                                              2 Nests, WLG
```

---

## Phase 1 — Store + Auth (Week 1)
**Goal: A working storefront residents can log into**
**Test: Can Ramesh log in and browse the Nia Store?**

### What you build
- Login screen (Employee ID + PIN only — no Firebase OTP yet, add in Phase 4)
- The complete Nia Store UI (exact original: hero, pillar cards, product grid, search, filter, cart drawer, checkout toast)
- All 14 products rendering correctly
- Bottom tab bar navigation shell (tabs visible, only Home works)
- Role detection after login (resident sees store, others see "Coming soon")
- All mock data in-memory — no backend

### What you skip
- Points banner (placeholder "-- pts" is fine)
- Earn / Redeem tabs (show "Coming soon")
- EAE interface
- Any backend or database

### Stack
```
Frontend only
React + Vite + Tailwind
All state: useState / Context (no localStorage)
Mock users hardcoded in mockUsers.js
```

### Test checklist before moving to Phase 2
- [ ] Login with NIA001 + PIN 1234 → lands on store
- [ ] Login with EAE001 + PIN 0000 → sees "Staff coming in Phase 2"
- [ ] All 14 products render with correct name, price, emoji, category
- [ ] Search "meal" shows Daily Meals Plan
- [ ] Filter "Studio" shows 5 products only
- [ ] Add 2 items to cart → cart badge shows 2
- [ ] Checkout → toast "Order placed — ₹4,498" → cart clears
- [ ] Responsive: looks correct on 375px mobile width

### Antigravity prompt strategy
3 prompts maximum:
- **Prompt 1A:** Data files + AuthContext + PointsContext (no UI)
- **Prompt 1B:** Login page + Nav + Store (hero, pillars, grid, cards, cart)
- **Prompt 1C:** Routing + BottomNav shell + responsive fixes

---

## Phase 2 — Points Core (Week 2)
**Goal: Residents can see their points balance and redeem rewards**
**Test: Can Ramesh see 185 pts and redeem a Haat Voucher?**

### What you build
- Points banner on home (live balance from context)
- Earn tab (read-only: shows all actions + how to earn, no submit yet)
- Redeem tab (full: reward catalog, balance check, redemption flow, QR voucher generation, My Vouchers)
- Leaderboard (My Nest view with mock rankings)
- Profile tab (balance, transaction history, logout)
- Earn badges on product cards ("Earn 15 pts for on-time rent")
- PointsContext fully wired: balance, transactions, vouchers all in state
- QR display modal (full screen, using qrcode.react)

### What you skip
- EAE award interface (points are still hardcoded in mock data)
- Real transactions from EAE actions
- Backend

### Stack
```
Frontend only — still mock data
Add: qrcode.react package
Points state: PointsContext with seeded balance (185 for Ramesh)
Vouchers: generated client-side with random UUID + "NIA-" prefix
```

### Test checklist before moving to Phase 3
- [ ] Home shows "⚡ Your Points — 185 pts" banner
- [ ] Banner color changes: amber <50, white 50-199, blue 200+
- [ ] Earn tab shows all 4 sections (Daily/Weekly/Referral/Community)
- [ ] Redeem tab shows 14 rewards with correct point costs
- [ ] Ramesh (185 pts) can redeem Haat Voucher ₹100 (90 pts) → balance becomes 95
- [ ] Redeem creates a QR voucher in My Vouchers
- [ ] Tapping voucher → full screen QR modal
- [ ] Reward costing 200 pts shows disabled "Need 15 more pts" state
- [ ] Profile shows balance, transaction history (seeded mock entries)
- [ ] Leaderboard shows Priya(340) > Ramesh(185) > Arjun(72) > Sunita(0)

### Antigravity prompt strategy
4 prompts:
- **Prompt 2A:** PointsBanner + earn badges on ProductCard
- **Prompt 2B:** Earn tab (all 4 sections, referral link copy)
- **Prompt 2C:** Redeem tab (catalog + redemption flow + QR modal)
- **Prompt 2D:** Leaderboard + Profile + transaction history

---

## Phase 3 — Staff Tools (Week 3)
**Goal: EAE can award points to residents. JCO can approve deductions.**
**Test: Rajan (EAE) awards Ramesh +10 pts. Ramesh's balance updates to 195.**

### What you build
- EAE interface: My Residents list, Award/Deduct points (individual), Morning Bulk Check
- EAE Approvals tab (community action requests from residents)
- EAE Daily Summary
- JCO interface: Approval Queue (high-value deductions), Disputes, Escalations, Analytics chart
- Vendor interface: QR scanner (manual code entry), Settlement view
- ProtectedRoute: role-based route guards
- Demo role switcher (bottom-right pill to flip between users)
- Community "Submit for approval" button in Earn tab now works (adds to EAE pending list)

### What you skip
- Backend (still all in-memory)
- Firebase OTP (still PIN only)
- Cross-session persistence (refresh resets state — acceptable for demo)

### Stack
```
Frontend only — still mock data
Add: recharts (for JCO analytics bar chart)
State: EAE actions update PointsContext directly (same in-memory state)
Key insight: since all roles run in the same browser session, 
EAE awarding points directly updates resident's balance in shared context.
This is good enough for a 2-Nest pilot demo.
```

### Test checklist before moving to Phase 4
- [ ] Login as EAE001 → Staff Panel loads, My Residents shows 4 residents
- [ ] Tap Ramesh → Award Points → select Jambo Attendance (+10) → Confirm → balance 195
- [ ] Morning Bulk Check → mark 3 Made, 1 Not Made → submit → balances update
- [ ] Login as JCO001 → Approval Queue shows 3 mock pending deductions
- [ ] Approve one → posts to resident balance
- [ ] Reverse one dispute → resident balance restored
- [ ] Analytics tab shows recharts bar chart
- [ ] Login as VND001 → enter "NIA-ABC123" → success card → Confirm Redemption
- [ ] Demo switcher: flip between all 4 roles in 3 taps
- [ ] ProtectedRoute: going to /staff as resident redirects to /home

### Antigravity prompt strategy
4 prompts:
- **Prompt 3A:** ProtectedRoute + EAE StaffHome + AwardPoints
- **Prompt 3B:** EAE Bulk Check + Approvals + Daily Summary
- **Prompt 3C:** JCO ApprovalQueue + Disputes + Escalations + Analytics
- **Prompt 3D:** Vendor Scanner + Settlement + Demo Role Switcher

---

## Phase 4 — Backend Live (Week 4)
**Goal: Real database, real auth, data persists across sessions**
**Test: EAE awards points on their phone. Resident refreshes their phone. Balance shows correctly.**

### What you build

**Backend (Railway):**
- Node.js + Express + Prisma + PostgreSQL
- Firebase Admin SDK for token verification
- Redis for balance caching
- All API routes: /auth, /products, /cart, /orders, /points, /vouchers, /rewards, /staff, /jco
- Seed script (14 products, 14 rewards, all action codes, Nest "Kush-12", 7 users)
- Append-only transaction ledger
- HMAC-signed QR vouchers

**Frontend updates:**
- Firebase Phone OTP (add to login alongside PIN)
- Replace all mock data with real API calls via apiFetch()
- Demo mode fallback (if VITE_API_URL empty → use mock data, so app still works offline)
- Auth: onAuthStateChanged persists session across refresh

**Deploy:**
- Backend → Railway (auto-deploy from GitHub)
- Frontend → Vercel (auto-deploy from GitHub)

### Test checklist — pilot readiness
- [ ] Login via phone OTP works on a real device
- [ ] Login via Employee ID + PIN works
- [ ] Products load from DB (not mock file)
- [ ] Add to cart → refresh page → cart persists
- [ ] Order placed → visible in /orders
- [ ] EAE on Device A awards points → Resident on Device B refreshes → balance updated
- [ ] Redeem reward → QR generated from backend → vendor scans on Device C → redeemed
- [ ] JCO approves deduction → resident balance updated
- [ ] Balance survives browser refresh (Redis + DB backed)
- [ ] /health endpoint returns 200 on Railway
- [ ] CORS blocks requests from non-Vercel origin

### Antigravity prompt strategy
5 prompts:
- **Prompt 4A:** Backend project setup (index.js, middleware, Firebase Admin, Redis)
- **Prompt 4B:** Store APIs (/products, /cart, /orders) + Prisma schema + seed
- **Prompt 4C:** Points + Voucher APIs (/points, /vouchers, /rewards) + QR signing
- **Prompt 4D:** Staff + JCO APIs (/staff, /jco) + auth routes
- **Prompt 4E:** Frontend API integration (apiFetch, Firebase OTP, replace all mocks)

---

## Summary Table

| | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|---|---|---|---|---|
| **Week** | 1 | 2 | 3 | 4 |
| **Focus** | Store + Login | Points UI | Staff Tools | Backend |
| **Backend?** | ❌ | ❌ | ❌ | ✅ |
| **Database?** | ❌ | ❌ | ❌ | ✅ |
| **Real auth?** | ❌ PIN mock | ❌ PIN mock | ❌ PIN mock | ✅ Firebase OTP |
| **Shareable?** | ✅ | ✅ | ✅ | ✅ |
| **Pilot-ready?** | ❌ | ❌ | ✅ Demo | ✅ Production |
| **Antigravity prompts** | 3 | 4 | 4 | 5 |
| **Risk** | Low | Low | Medium | High |

---

## Why This Order

**Store first, not auth.** The store is your most complex UI (14 products, cart, search, filters, animations). Get it pixel-perfect in week 1 when you have the most energy. Auth is actually the simplest piece — a two-field form.

**Points UI before points logic.** Build what residents see (Phase 2) before building how EAEs give it to them (Phase 3). This lets you demo to Sachin/Deepak after week 2 with a real-looking product even if points are hardcoded.

**Backend last.** This is counterintuitive but correct for a solo dev on an AI platform. The frontend mock data architecture is designed to be a drop-in replacement — every hook has a demo fallback. If Phase 4 slips, Phase 3 is still pilot-ready for a controlled 2-Nest demo where the EAE and the resident are in the same room.

**16 total Antigravity prompts across 4 weeks = 4 prompts per week = less than 1 per day.** This is a sustainable pace that gives you time to test between prompts.

---

## Risk Management

| Risk | Mitigation |
|---|---|
| Phase 4 backend slips past pilot date | Phase 3 is fully functional for a supervised demo — EAE and resident use same device or same session. Ship Phase 3 to pilot, Phase 4 to full rollout. |
| Antigravity drifts from design tokens | Keep a sticky note with the 7 color values. Paste them into every prompt. |
| A single prompt produces broken code | Never move to the next prompt until current one passes its test checklist. Fix first. |
| State lost on page refresh (Phases 1-3) | Acceptable for pilot demo. Warn EAE: "Don't refresh during demo." Solved in Phase 4. |
| Firebase OTP setup takes longer than expected | PIN login is fully functional as a backup. Pilot can run on PIN-only. |

---

## What to Tell Deepak

> "We are building in 4 phases. After week 3, we have a fully functional frontend demo — all 4 roles work, points flow from EAE to resident, QR vouchers generate. It runs on mock data which means it works offline and never crashes. Week 4 we plug in the real database and Firebase. The pilot in March runs on either Phase 3 (demo mode, controlled) or Phase 4 (production, if backend is ready). We are not betting the pilot on backend timing."
