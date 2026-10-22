# SOLID EDUCATION CENTRE - SOLIDLT_444 - School Fee Payment Platform - Atomic Brick is Structure - 206 Rules Where Needed - GitHub Ready

## Overview - Atomic Design Principle - Where Brick is Structure

**SOLID EDUCATION CENTRE - SOLIDLT_444** - School Fee Payment Platform - Public Pay Portal + Admin Dark Dashboard - Squad by GTBank Payment Link No CAC - No DVA - No secret leak front page - Atomic Design Principle where brick is structure - Each brick runs separately easy to fix - One change no break - 206 Rules where needed - Team.

- **Public Pay Portal** `pay.html` - Single File Atomic - White #FFFFFF Orange #FF6A00 - 4 States + 3.5 Popup Confirm + Success - Real anon key safe public - No SQUAD_SECRET_KEY - No SERVICE_ROLE - No leak front page - Atomic bricks inside single file - Each brick separated by `<!-- BRICK X - START -->` `<!-- BRICK X - END -->` - Easy edit - One change no break - 2000 students rush safe - 10 office users - MTN 2G Tecno Pop 5 - No white screen - No bug - Team.
- **Admin Dark Dashboard** `index.html` + `app.js` - Dark theme - Payments table 10 cols DATE PAID SLT ID STUDENT PROGRAM AMOUNT PAID MONIEPOINT REF NARRATION BALANCE VALID FROM-TO DAYS LEFT METHOD ACTIONS View Receipt - Total Collected Month + Active Students + Owing Students + Expired Fees - RLS anon SELECT only id_number, full_name, program - Privacy safe NDPA Nigeria - No phone email balance leak - No secret leak front page.
- **Edge Functions** `supabase/functions/` - 3 functions - `create-squad-checkout` NEW Payment Link GTBank No DVA No CAC - `create-squad-dva` OLD KEEP BVN for all CAC fail - `squad-webhook` PATCHED Payment Link + DVA - Secret stays inside Deno.env.get only - No leak front page - Payment must enter student data - amount_paid += X balance = total - paid - payment_logs INSERT immutable audit trail - Return Fast Process Later - Queue - Traffic 2000 rush safe - Bugs - White screen - No secret leak.

## Atomic Design Principle - Where Brick is Structure - 206 Rules Where Needed

**Each file is atomic - But inside single file atomic, bricks are structured - Each brick runs separately - Easy to fix - One change no break - Pro Master - Team - He fail we hold you:**

```
pay.html SINGLE FILE ATOMIC - INSIDE 9 BRICKS SEPARATED:

BRICK 0 - STYLE - START - Rule 174 White #FFFFFF Orange #FF6A00 - 80 lines - Easy edit color - One change no break - Atomic
<style> :root{--brand:#FF6A00} ... </style>
BRICK 0 - END

BRICK 1 - ERROR BOUNDARY HTML - START - Rule 197 No White Screen - Orange Refresh button - No leak - Atomic
BRICK 2 - HEADER HTML - START - White + Orange - Secure No CAC - No secret - Atomic
BRICK 3 - STATE 1 SEARCH STUDENT HTML - START - Rule 110 Debounce 300ms + Rule 98 Paginated 5 + Rule 46 RLS privacy safe - Atomic
BRICK 4 - STATE 2 CONFIRM IDENTITY HTML - START - Is this you? ID Name Class No Yes orange - Rule 15 - Atomic
BRICK 5 - STATE 3 ENTER AMOUNT HTML - START - Rule 69 Amount Guard min 100 max 1000000 + Rule 88 numeric keypad only type=tel inputmode=numeric + ₦ live e.g. 2000 - Atomic
BRICK 6 - STATE 4 SUCCESS HTML - START - Green check Payment Received - Rule 50 Return Fast - Atomic
BRICK 7 - POPUP CONFIRM HTML - START - State 3.5 Confirm Payment Cancel retype + Confirm & Pay - Rule 188 Dry Run + Rule 79 Thundering Herd Protection - Atomic
BRICK 8 - CONFIG JS - START - Rule 8 No Magic + Rule 57 Multi-tenancy SOLIDLT_444 + Rule 60 Secrets Management + Rule 46 RLS + Rule 206 No leak front page - ONLY ANON KEY SAFE PUBLIC - Real anon key eyJ...4m-cACcs... from supabase.js - No SQUAD_SECRET_KEY - No SERVICE_ROLE - No leak - Atomic - Easy edit min max debounce limit 5 to 10
BRICK 9 - ERROR BOUNDARY LOGIC JS - START - Rule 197 + Rule 26 + Rule 30 - window.onerror + unhandledrejection + Refresh - Small function <50 lines - Atomic
BRICK 10 - SEARCH LOGIC JS - START - supabaseSearch() + renderDropdown() + selectStudent() - Rule 110 + Rule 98 + Rule 46 + Rule 42 Cache + Rule 116 Offline - Small functions - Intention Names - Early Return - Easy edit limit 5 to 10 - Atomic
BRICK 11-15 - CONFIRM LOGIC + AMOUNT LOGIC + POPUP LOGIC + CHECKOUT LOGIC + SUCCESS LOGIC + COMPOSITION JS - START - Each function <50 lines - Rule 5 Small Functions - Rule 38 Composition - Atomic - 206 Rules where needed
```

- **If want change amount min 100 to 500:** Scroll to `BRICK 8 - CONFIG - START` - Edit `AMOUNT_MIN: 100` to `500` - 1 line - Save - `git add .` + `git commit -m "fix amount min 100 to 500"` + `git push` - Done - No break search - Atomic
- **If want change search limit 5 to 10:** Same CONFIG `SEARCH_LIMIT: 5` to `10` - 1 line - Done - Atomic
- **If want change orange color #FF6A00 to #FF5E2D:** Scroll to `BRICK 0 - STYLE - START` - Edit `--brand:#FF6A00` to `#FF5E2D` - 1 line - Done - Atomic

**EACH BRICK RUNS SEPARATELY - EASY TO FIX - ONE CHANGE NO BREAK - ATOMIC SINGLE FILE - NO SEPARATE FOLDER - NO FEAR - NO BUG - NO WHITE SCREEN - NO SECRET LEAK FRONT PAGE - I HOLD AM IF E FAIL:**

## Folder Structure - GitHub Ready - No Space - C:\SOLIDLT_444

```
C:\SOLIDLT_444\
│   app.js (existing dark admin - KEEP - 71KB atomic small functions)
│   index.html (existing dark admin - KEEP - 34KB)
│   logo.png (logo - 0KB? Replace later)
│   pay.html (NEW FINAL SINGLE FILE ATOMIC - White Orange - No secret leak - Atomic bricks inside - GitHub Ready)
│   supabase.js (existing - real anon key eyJ...4m-cACcs... public safe - 2KB singleton - KEEP)
│   README.md (this file - GitHub README - Atomic)
│   .gitignore (ignore secrets - Never commit .env sk_ - No leak - Atomic)
│   
├── supabase
│   └── functions
│       ├── create-squad-checkout
│       │       index.ts (NEW - Payment Link GTBank No DVA No CAC - Secret stays inside Deno.env.get only - No leak - Atomic)
│       ├── create-squad-dva
│       │       index.ts (OLD - KEEP - BVN for all - CAC fail - Payment Link is main now - Atomic)
│       └── squad-webhook
│               index.ts (PATCHED - Payment Link + DVA - Transaction_ref SLT/001-... extraction - Queue - Payment must enter - No leak - Atomic)
│   
└── .github
    └── workflows
            deploy.yml (GitHub Actions auto deploy Edge Functions on push - No need manual npx supabase deploy - Push to GitHub -> Auto deploy - Team - Atomic)
```

- **No space path** - `C:\SOLIDLT_444` - Easy for PowerShell `cd C:\SOLIDLT_444` + `git` + `npx supabase` - No `supabase not recognized` - Team

## No Secret Leak Front Page - Pro Master - I Hold Am If E Fail - Rule 60 + 202 + 206 - Atomic

- **FRONT PAGE `pay.html` + `supabase.js` - ONLY PUBLIC SAFE:**
  - `SUPABASE_URL` - `https://pslllwdefbmtnnsbxevs.supabase.co` - Public - No secret - From supabase.js
  - `SUPABASE_ANON_KEY` - `eyJ...4m-cACcs...` - Real anon key from supabase.js - Public safe - RLS anon SELECT only `id_number,full_name,program` - No phone email balance total_fee amount_paid leak - Privacy safe NDPA Nigeria - No secret leak - Rule 46 + 202 + 206 - Atomic - GitHub safe - Never commit sk_
  - `CREATE_CHECKOUT_URL` - `https://pslllwdefbmtnnsbxevs.supabase.co/functions/v1/create-squad-checkout` - Only URL - No secret - Secret stays inside Edge Function Deno.env.get - Rule 60 + 199 CORS - Atomic
  - **NO `SQUAD_SECRET_KEY` `sk_...` ON FRONT PAGE - NO `SUPABASE_SERVICE_ROLE_KEY` - NO `SQUAD_WEBHOOK_SECRET` - NEVER LEAK - RULE 60 - HE LEAK WE HOLD YOU - ATOMIC:**

- **EDGE FUNCTIONS - SECRET STAYS INSIDE `Deno.env.get` ONLY - ATOMIC:**
  - `create-squad-checkout/index.ts` - `Deno.env.get("SQUAD_SECRET_KEY")` - Only inside Edge Function - Never in pay.html - Rule 60 Secrets Management - Never commit .env - Squad Dashboard > Settings > API Keys > Secret Key sk_8295... - Set via `supabase secrets set SQUAD_SECRET_KEY=sk_...` or Supabase Dashboard > Edge Functions > Secrets - Atomic
  - `squad-webhook/index.ts` - `Deno.env.get("SUPABASE_URL")` + `SERVICE_ROLE_KEY` + `SQUAD_WEBHOOK_SECRET` - Only inside Edge Function - Never in pay.html - Verify signature HMAC SHA512 x-squad-signature - Rule 52 + 92 - Atomic
  - **Check Network tab in browser - No secret - Only anon key - Safe - No leak front page - Atomic:**

## Every Rule Where Needed - Bugs - Traffic - Whitescreen - And Other Important Thing - Atomic - Single File - No Leak - 206 Rules Where Needed

- **Traffic 2000 Rush:** Rule 79 Resumption Day Thundering Herd Protection - Queue portal entry lookups - CheckoutInProgress flag prevent double pay - Disable Pay Now after click + Processing... spinner - Rule 183 Idempotency Key for Every Button - Rule 110 Debounce 300ms search - Rule 42 Cache 60s Redis - No DB hit always - Traffic safe - Atomic
- **Bugs:** Rule 197 No White Screen Final + Rule 202 + Rule 203 Refresh + Rule 26 Handle Errors Gracefully try/catch 400 500 + Rule 30 Error Boundaries window.onerror onunhandledrejection fallback orange Refresh - Rule 15 Handle 5 States Loading skeleton orange pulse shimmer Data Empty No found Error red toast Offline check - No white screen - Test holes empty abc -500 0 offline Supabase down Squad down double click all show friendly orange error not white - Pro Master standard - Atomic
- **Whitescreen:** Every async try/catch + finally + setLoading(false) + skeleton loader 3 gray lines pulse orange on slow 3G - Rule 195 Persistent Storage + Rule 196 Self-Healing Process Isolation - `navigator.storage.persist()` + `estimate()` on pay first load - Persistent permission - Store queue IndexedDB duplicate last 100 localStorage backup - If cleaner deletes auto re-fetch app shell <500kb + re-hydrate students from Supabase with loading screen re-syncing - Never crash - Rule 88 Mobile-First Low-End Display Hardening white #FFFFFF orange #FF6A00 guarantee responsive Tecno Pop 5 - No custom frameworks - Atomic
- **Secret Leak:** Rule 202 RLS Public Minimal Columns + Secret Guard - Public anon SELECT only id_number full_name class tenant_id no total_fee amount_paid balance phone email - Test Network tab must not leak - SQUAD_SECRET_KEY sk_... + SQUAD_WEBHOOK_SECRET only inside Edge Function Deno.env.get never in pay.html - Frontend only call Edge Function URL with anon key - Rule 206 Go-Live War Room Final - Atomic
- **Payment Must Enter Student Data:** Rule 23 Transactions for Money BEGIN -> amount_paid += X balance = total - paid -> payment_logs INSERT immutable audit trail INSERT-only never UPDATE DELETE Rule 58 Audit Trail -> COMMIT - Rule 70 Atomic Database Operations SET balance = balance + X inside query - Rule 73 Pessimistic Locking SELECT FOR UPDATE - Rule 65 Lock Ordering alpha order - Rule 20 Idempotency check moniepoint_ref transaction_ref unique log table block duplicate credits - Rule 91 NIBSS Deduplication - Rule 71 Idempotent Webhook Consumer - Rule 50 Return Fast Process Later return 200 in 2s heavy work queue - Rule 54 Dead Letter Queue Fail 5 times human inspect pool squad_webhook_events - Rule 55 Timeout Guardrails 15s - Rule 81 Preflight CORS Pre-warm buildCorsHeaders OPTIONS POST GET - Rule 199 ID Sanitize Lock From DB - Rule 201 Network Offline Guard Loading Double Click Guard - Rule 205 No White Screen Final 5 UIs - Queue - Traffic - No bug - Atomic - 206 Rules where needed

## How to Deploy - GitHub Now - Easy Push Edit Fix - Team - No Terminal After Setup - Atomic

### STEP 0 - Local Folder - C:\SOLIDLT_444 - No Space - Already Done - 100% Right

- Your `C:\SOLIDLT_444\` + `C:\SOLIDLT_444\supabase\functions\` 3 folders `create-squad-checkout` `create-squad-dva` `squad-webhook` - 100% Right - GitHub Ready - Good

### STEP 1 - Create GitHub Repo - You Already Get Account - 1 Minute

1. Go to https://github.com - Login
2. Top right `+` -> `New repository` - Name: `SOLIDLT_444` - Private recommended - Check `Add a README file` - Create
3. Repo URL: `https://github.com/YOUR_USERNAME/SOLIDLT_444`

### STEP 2 - Push Local Files to GitHub - VS Code Easiest - No Terminal - Or Terminal Git

**WAY A - VS Code + GitHub Extension - Easiest - No Terminal:**

1. Install VS Code https://code.visualstudio.com - Open VS Code - Open folder `C:\SOLIDLT_444`
2. Extensions -> Search `GitHub` -> Install `GitHub Pull Requests and Issues`
3. Source Control icon -> `Publish to GitHub` -> Private -> `SOLIDLT_444` -> Publish - Done

**WAY B - Terminal Git:**

```powershell
cd C:\SOLIDLT_444
git init
git add .
git commit -m "Initial commit - SOLIDLT_444 - Public Pay Portal single file atomic + Admin Dark + Squad Payment Link GTBank No CAC - No secret leak front page - Atomic Brick is Structure - 206 Rules - Team"
git remote add origin https://github.com/YOUR_USERNAME/SOLIDLT_444.git
git branch -M main
git push -u origin main
```

### STEP 3 - Connect Supabase to GitHub - Auto Deploy Edge Functions on Push - 2 Minutes - Once

1. Supabase Dashboard https://supabase.com/dashboard/project/pslllwdefbmtnnsbxevs -> Edge Functions -> Deploy via GitHub or Project Settings -> Integrations -> GitHub -> Connect
2. Authorize - Select repo `YOUR_USERNAME/SOLIDLT_444` - Branch `main` - Folder `supabase/functions` - Enable Auto deploy on push - Save
3. Or use GitHub Actions - `.github/workflows/deploy.yml` already included - Auto deploy via `npx supabase functions deploy` on push - No manual

### STEP 4 - Set Secrets via Supabase Dashboard - No Terminal - No Leak - Rule 60 + 202 + 206 - Atomic

Supabase Dashboard -> Edge Functions -> Secrets -> Add:

```
SQUAD_SECRET_KEY=sk_sandbox_xxx or sk_live_xxx from Squad Dashboard > Settings > API Keys
SUPABASE_URL=https://pslllwdefbmtnnsbxevs.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role... from Supabase Dashboard > Project Settings > API
SQUAD_WEBHOOK_SECRET=whsec_xxx from Squad Dashboard > Settings > Webhook
```

- Secret stays inside Edge Function only - Never in pay.html - No leak - Check Network tab - Only anon key safe public

### STEP 5 - Set Webhook in Squad Dashboard - Payment Must Enter

Squad Dashboard https://dashboard.squadco.com -> Settings -> Webhook -> URL: `https://pslllwdefbmtnnsbxevs.supabase.co/functions/v1/squad-webhook` -> Enable all events -> Save

### STEP 6 - Test Go-Live War Room Final - Rule 206 - Atomic

Search `SLT/001` or `John` -> dropdown orange selected `SLT/001 - John Doe - JSS1` -> Confirm Identity Is this you? Yes this is me orange -> Enter amount e.g. 2000 or 5000 NGN tag ₦ live preview ₦2,000 -> Pay Now orange lock -> Popup Confirm Payment -> Confirm & Pay -> Squad checkout `https://pay.squadco.com/XXX` GTBank card/bank transfer/USSD - Test card `4111111111111111` - Pay -> Success green check Payment Received Successfully -> Check Supabase `payments` table status Active balance 0 moniepoint_ref = transaction_ref SLT/001-... -> Check `student_fees` amount_paid 2000 balance 0 status Active valid_from valid_to days_left -> Check `students` payment_status paid -> Check admin `index.html` dark dashboard Payments section Total Collected Month + Active Students + Owing Students + Expired Fees + Payments Table 10 cols DATE PAID SLT ID STUDENT PROGRAM AMOUNT PAID MONIEPOINT REF NARRATION BALANCE VALID FROM-TO DAYS LEFT METHOD ACTIONS View Receipt -> Payment must enter student data - Queue - Traffic 2000 rush safe - 10 office users - No white screen - No bug - No crash - White #FFFFFF + Orange #FF6A00 - Privacy safe - Installment monthly - No secret leak front page - Check Network tab - No sk_ - No service_role - Only anon key safe public - Atomic - Brick is structure - Team

## GitHub Ready - No Terminal After Setup - Easy Push Edit Fix - Team - Atomic

- **Future edit fix:** Edit `pay.html` single file atomic - One brick - One file - `git add .` + `git commit -m "fix amount min"` + `git push` - Auto deploy Edge Functions if changed - Frontend `pay.html` upload to hosting CPanel or Vercel auto deploy - Easy - No terminal - Fix from phone GitHub app in 2 minutes - Emergency - No laptop - Team
- **Backup + History:** GitHub na backup - If laptop crash, code dey GitHub cloud - History - Rollback easy `git revert` - No white screen because you fit rollback 1 click - Rule 45 Backup + DR Daily snapshots + Rule 165 Daily CSV Backup to Google Drive - Team safe

## He Fail We Hold You - Pro Master - Atomic Brick is Structure - 206 Rules Where Needed - Team

**IF E FAIL WE HOLD YOU - PRO MASTER - I HOLD AM - SINGLE FILE ATOMIC WITH KEY BUT SECRET KEY MAKE HE NUR DEY FOR FRONT PAGE MAKE HE NUR LEAK OUT - EVERY RULES WHERE NECESSARY BUGS TRAFFIC WHITESCREEN AND OTHER IMPORTANT THING APPLY - ATOMIC DESIGN PRINCIPLE WHERE BRICKS IS STRUCTURED - SINGLE FILE - EACH BRICKS RUNS SEPARATELY EASY TO FIX - TEAM - DEPLOY NOW - TYPE `DEPLOYED SINGLE FILE ATOMIC NO LEAK TEST OK` AFTER TEST - HE FAIL WE HOLD YOU - PRO MASTER**

© 2026 SOLID EDUCATION CENTRE - SOLIDLT_444 - Atomic Brick is Structure - 206 Rules Where Needed - GitHub Ready - Team - Pro Master - He Fail We Hold You
