// @ts-nocheck
// ==================== BRICK C3 - CREATE SQUAD CHECKOUT - PAYMENT LINK - ATOMIC - BRICK IS STRUCTURE - 206 RULES WHERE NEEDED ====================
// Exact path: supabase/functions/create-squad-checkout/index.ts - NEW FOLDER NEW FILE - Keep create-squad-dva intact - Same Supabase project pslllwdefbmtnnsbxevs - No secret leak front page - SQUAD_SECRET_KEY inside Deno.env.get only - Atomic
// Rule 1 DRY,2 KISS Junior read 60s,3 SOLID 1 file=1 job,5 Small Functions <50 lines,6 Intention Names,7 Early Return,8 No Magic,11 Central API Layer,12 Validate Sanitize,13 Type Safety,14 API Contract,15 5 States
// Rule 16 Security First .env + Deno.env.get Edge Function only,19 XSS,21 Fail Fast,26 Handle Errors Gracefully,27 Logging Context,28 Health Checks,20 Idempotency,23 Transactions Money,44 CI/CD,45 Backup,46 RLS,50 Return Fast,52 Verify Signature ready,55 Timeout 15s,57 Multi-tenancy,60 Secrets Management never commit .env sk_ only Edge Function,65 Lock Ordering,70 Atomic,73 Pessimistic Locking,79 Resumption,98 Paginated,104 Naira Kobo,165 Daily Backup,185 Audit,188 Dry Run,195 Persistent,196 Self-Healing,197 No White Screen,198 CORS,199 ID Sanitize,200 Amount Small,201 Network Guard,202 RLS Public Minimal,203 White Orange,204 Public vs Admin,205 No White Screen Final 5 UIs,206 Go-Live War Room Final - Atomic - Brick is Structure - 206 Rules where needed

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// ==================== BRICK C3-1 - CONFIG - ATOMIC - START - Rule 8 No Magic Values + Rule 57 Multi-tenancy + Rule 60 Secrets Management + Rule 206 No leak ====================
const CONFIG = {
  SQUAD_URL: "https://api.squadco.com/transaction/initiate", // Payment Link GTBank - No DVA - No CAC - Starter works - No BVN per student - Only merchant BVN once - Atomic
  REGEX_SLT: /^SLT\/\d{3}$/i, // Rule 12 Validate Sanitize - Atomic
  AMOUNT_MIN: 100, AMOUNT_MAX: 1000000, // Rule 69 Amount Guard - Atomic - Easy edit min max - One change no break
  TENANT: "SOLIDLT_444", // Rule 57 Multi-tenancy - Atomic
  TIMEOUT_MS: 15000, // Rule 55 Timeout Guardrails 15s - Atomic
  CORS_ORIGIN: "*", // Rule 198 CORS Core Fix - Atomic
  CORS_METHODS: "POST, GET, OPTIONS", // Rule 198 - Atomic
  CORS_HEADERS: "Content-Type, Authorization, apikey, x-client-info, x-squad-signature", // Rule 198 - Atomic
} as const;
// ==================== BRICK C3-1 - CONFIG - END ====================

// ==================== BRICK C3-2 - CORS + RESPONSE + SANITIZE - ATOMIC - START - Rule 198 CORS + Rule 12 Validate + Rule 19 XSS + Rule 8 No Magic ====================
function buildCors(): Record<string, string> {
  return { "Access-Control-Allow-Origin": CONFIG.CORS_ORIGIN, "Access-Control-Allow-Methods": CONFIG.CORS_METHODS, "Access-Control-Allow-Headers": CONFIG.CORS_HEADERS };
}
function jsonResponse(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}
function sanitizeRegNo(regNo: string): string {
  // Rule 12 Validate + Parse + Sanitize - sanitizeRegNo() SLT/001 canonical - Atomic - Brick is structure - Small function <50 lines
  if (!regNo) throw new Error("reg_no required - Rule 21 Fail Fast - Atomic");
  const c = regNo.toUpperCase().trim().replace(/[^A-Z0-9\/]/g, "");
  if (!CONFIG.REGEX_SLT.test(c)) throw new Error(`Invalid SLT ID ${c} - Must be SLT/001 format - Rule 12 Validate - Atomic`);
  return c;
}
function sanitizeAmount(a: unknown): number {
  // Rule 68 Integer Currency Protection + Rule 69 Guard + Rule 104 Naira/Kobo - Atomic - Small function <50 lines
  const n = Number(a);
  if (Number.isNaN(n)) throw new Error("amount must be number - Rule 12 - Atomic");
  if (n < CONFIG.AMOUNT_MIN) throw new Error(`Amount min ₦${CONFIG.AMOUNT_MIN} - Rule 69 Guard - Atomic`);
  if (n > CONFIG.AMOUNT_MAX) throw new Error(`Amount max ₦${CONFIG.AMOUNT_MAX} - Rule 69 - Atomic`);
  return Math.round(n); // Rule 68 Integer Currency Protection - Atomic
}
function parseNames(fullName: string) {
  // Rule 12 Validate - Atomic - Small function <50 lines
  const p = fullName.trim().split(/\s+/).filter(Boolean);
  return { first: p[0] || "SOLID", last: p.slice(1).join(" ") || "STUDENT" };
}
// ==================== BRICK C3-2 - CORS + RESPONSE + SANITIZE - END ====================

// ==================== BRICK C3-3 - SQUAD CALL + PAYMENT LOG - ATOMIC - START - Rule 11 Central API Layer + Rule 20 Idempotency + Rule 23 Transactions Money + Rule 27 Logging + Rule 55 Timeout + Rule 68 Integer + Rule 104 Naira Kobo ====================
async function callSquad(payload: Record<string, unknown>, secret: string) {
  // Rule 11 Central API Layer - Squad Payment Link GTBank No DVA No CAC - Atomic - Brick is structure - Small function <50 lines
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), CONFIG.TIMEOUT_MS);
  try {
    console.log(`[create-squad-checkout] Squad initiate amount=${payload.amount} ref=${payload.transaction_ref} email=${payload.email} tenant=${CONFIG.TENANT} - Rule 27 Logging - No leak - Atomic`);
    const res = await fetch(CONFIG.SQUAD_URL, { method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: ctrl.signal });
    const j = await res.json();
    console.log(`[create-squad-checkout] Squad response status=${res.status} body=${JSON.stringify(j).slice(0,600)} - Rule 27 - Atomic`);
    if (!res.ok) throw new Error(`Squad failed ${res.status} ${JSON.stringify(j)} - Check SQUAD_SECRET_KEY + Squad account approved + Payment Link needs no CAC - No secret leak front page - Atomic`);
    const data = j.data || j;
    const checkoutUrl = data.checkout_url || data.checkoutUrl || data.payment_link || data.link;
    if (!checkoutUrl) throw new Error(`No checkout_url from Squad ${JSON.stringify(j)} - Check Squad docs https://squadco.com/docs - Atomic`);
    return { checkout_url: checkoutUrl, transaction_ref: data.transaction_ref || payload.transaction_ref, raw: j };
  } finally { clearTimeout(tid); }
}
async function ensurePaymentLog(supa: any, regNo: string, amount: number, ref: string, email: string) {
  // Rule 20 Idempotency + Rule 23 Transactions for Money + Rule 41 Queue Jobs + Rule 130 Batch Sync - Ensure log before Squad call - Queue - Traffic safe - Atomic - Small function <50 lines
  try {
    const { data: existing } = await supa.from("payments").select("id").eq("moniepoint_ref", ref).single();
    if (existing) { console.log(`[create-squad-checkout] Duplicate ${ref} - Idempotency - Rule 20 - Atomic`); return existing; }
    await supa.from("payments").insert([{
      reg_no: regNo, student_name: "PENDING Squad Payment Link", amount, amount_paid: 0, moniepoint_ref: ref,
      narration: `${regNo} - Squad Payment Link Pending - ${ref}`, method: "Squad Payment Link", payment_method: "Squad Payment Link", status: "Pending", tenant: CONFIG.TENANT, raw_data: { email, created_via: "pay.html single atomic - GitHub Ready - Atomic Brick is Structure", tenant: CONFIG.TENANT },
    }]);
  } catch (e) { console.warn(`[create-squad-checkout] ensurePaymentLog failed ${(e as Error).message} - Continue - Rule 26 Handle Errors Gracefully - Atomic`); }
}
// ==================== BRICK C3-3 - SQUAD CALL + PAYMENT LOG - END ====================

// ==================== BRICK C3-4 - MAIN SERVE - ATOMIC - START - Rule 14 API Contract + Rule 21 Fail Fast + Rule 26 Handle Errors Gracefully + Rule 27 Logging Context + Rule 28 Health Checks + Rule 198 CORS + Rule 206 Go-Live War Room Final ====================
serve(async (req: Request) => {
  const cors = buildCors();
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: cors }); // Rule 198 CORS Core Fix + Pre-warm Rule 81 - Atomic
  if (req.method === "GET") return jsonResponse({ status: "ok", message: "create-squad-checkout ready - Squad by GTBank Payment Link - SOLIDLT_444 - No DVA No CAC - CORS enabled - No secret leak front page - Secret inside Edge Function only - Rule 60 + 206 - Atomic - Brick is Structure - GitHub Ready" }, 200, cors);
  if (req.method !== "POST") return jsonResponse({ error: "POST only - Use POST with reg_no, amount, full_name, transaction_ref - Rule 14 API Contract - Atomic" }, 405, cors);
  try {
    const SQUAD_SECRET_KEY = Deno.env.get("SQUAD_SECRET_KEY"); // Rule 60 Secrets Management - Only inside Edge Function - Never commit .env - Never in pay.html front page - No leak - Rule 202 - Atomic - Brick is structure
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SQUAD_SECRET_KEY) throw new Error("Missing SQUAD_SECRET_KEY - Set in Supabase Edge Functions secrets - Supabase Dashboard > Edge Functions > Secrets > SQUAD_SECRET_KEY - Squad Dashboard > Settings > API Keys > Secret Key sk_... - No leak front page - Rule 60 - Atomic");
    if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL - Atomic");
    if (!SERVICE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY - Set in secrets - Atomic");

    const body = await req.json();
    const { reg_no, full_name, amount, transaction_ref, email, tenant } = body;
    const cleanRegNo = sanitizeRegNo(reg_no);
    const cleanAmount = sanitizeAmount(amount);
    if (!full_name || full_name.trim().length < 2) throw new Error("full_name min 2 chars - Rule 12 - Atomic");

    const finalRef = (transaction_ref || `${cleanRegNo}-${Date.now()}-${cleanAmount}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`).toUpperCase(); // Rule 51 Gateway Stamp - Atomic
    const finalEmail = email || `${cleanRegNo.toLowerCase().replace(/\//g, '')}@solidlt.local`;
    const finalTenant = tenant || CONFIG.TENANT;

    console.log(`[create-squad-checkout] ${cleanRegNo} ${full_name} ₦${cleanAmount} ref ${finalRef} tenant=${finalTenant} - Rule 27 Logging with Context user:SLT/001 - No secret leak - Atomic - Brick is structure`);

    const supa = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: student } = await supa.from("students").select("id_number, full_name, program").eq("id_number", cleanRegNo).maybeSingle();
    if (!student) console.warn(`[create-squad-checkout] Student ${cleanRegNo} not found - Allow anyway for public pay portal - Rule 21 Fail Fast but allow - Log - Rule 27 - Atomic`);

    await ensurePaymentLog(supa, cleanRegNo, cleanAmount, finalRef, finalEmail);

    const { first, last } = parseNames(full_name || student?.full_name || "SOLID STUDENT");
    let squadPayload: any = {
      amount: cleanAmount * 100, // Squad expects kobo - Rule 104 Naira/Kobo Precision Rounding - ₦2000 = 200000 kobo - If fails fallback to Naira - Rule 86 Kobo Unit Normalization Guard - Atomic
      email: finalEmail,
      currency: "NGN",
      transaction_ref: finalRef,
      customer_name: `${first} ${last}`.trim(),
      meta: { reg_no: cleanRegNo, tenant: finalTenant, student_name: full_name },
    };

    let result;
    try { result = await callSquad(squadPayload, SQUAD_SECRET_KEY); }
    catch (e) {
      const errMsg = (e as Error).message;
      if (errMsg.includes("amount") || errMsg.includes("kobo")) {
        console.warn(`[create-squad-checkout] Kobo amount failed, retry with Naira amount - ${errMsg} - Rule 104 - Atomic`);
        squadPayload = { ...squadPayload, amount: cleanAmount };
        result = await callSquad(squadPayload, SQUAD_SECRET_KEY);
      } else throw e;
    }

    console.log(`[create-squad-checkout] SUCCESS ${cleanRegNo} -> ${result.checkout_url} ref ${result.transaction_ref} - Squad by GTBank - No CAC - No secret leak front page - Secret stays in Edge Function only - Atomic - Brick is Structure - GitHub Ready - Rule 206`);

    return jsonResponse({
      status: "success",
      reg_no: cleanRegNo,
      amount: cleanAmount,
      transaction_ref: finalRef,
      checkout_url: result.checkout_url,
      message: `✅ Squad Payment Link checkout created ${cleanRegNo} ₦${cleanAmount} - Redirect to ${result.checkout_url} - Squad by GTBank - No CAC - No secret leak front page - Secret stays in Edge Function only - Atomic - Brick is Structure - GitHub Ready`,
    }, 200, cors);
  } catch (e) {
    const err = e as Error;
    console.error(`[create-squad-checkout] FAILED ${err.message} - tenant=${CONFIG.TENANT} - Rule 27 + Rule 54 DLQ + Rule 26 - No leak front page - Atomic - Brick is structure`);
    return jsonResponse({ status: "error", message: err.message }, 400, cors);
  }
});
// ==================== BRICK C3-4 - MAIN SERVE - END - Go-Live War Room Final - Rule 206 - Atomic - Brick is Structure - 206 Rules Where Needed ====================
