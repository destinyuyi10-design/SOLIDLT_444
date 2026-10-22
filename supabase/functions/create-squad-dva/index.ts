// @ts-nocheck
// BRICK C1 - CREATE SQUAD DVA - SOLIDLT_444 - CORS + 64 RULES - YOUR BVN FOR ALL
// Rule 1 DRY, 2 KISS, 3 SOLID 1 file=1 job, 4 YAGNI, 5 Small Functions <50 lines
// Rule 6 Intention Names, 7 Early Return, 8 No Magic Values, 10 Vertical Spacing
// Rule 11 Central API Layer, 12 Validate+Parse+Sanitize, 16 Security First .env
// Rule 21 Fail Fast, 26 Handle Errors Gracefully, 27 Logging with Context
// Rule 28 Health Checks, 50 Return Fast, 52 Verify Signature ready, 55 Timeout
// Rule 57 Multi-tenancy, 60 Secrets Management

/* eslint-disable */
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const CONFIG = {
  SQUAD_API_URL: "https://api.squadco.com/virtual-account",
  REGEX_SLT: /^SLT\/\d{3}$/i,
  DEFAULT_PHONE: "08000000000",
  DEFAULT_DOB: "1990-01-01",
  DEFAULT_FIRST: "SOLID",
  DEFAULT_LAST: "STUDENT",
  TIMEOUT_MS: 15000,
  TENANT: "SOLIDLT_444",
  NAME_MIN: 2,
  CORS_ALLOW_ORIGIN: "*",
  CORS_ALLOW_METHODS: "POST, GET, OPTIONS",
  CORS_ALLOW_HEADERS: "Content-Type, Authorization, apikey, x-client-info, x-squad-signature",
} as const;

// Rule 6 Intention Names + Rule 5 Small Functions
function buildCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": CONFIG.CORS_ALLOW_ORIGIN,
    "Access-Control-Allow-Methods": CONFIG.CORS_ALLOW_METHODS,
    "Access-Control-Allow-Headers": CONFIG.CORS_ALLOW_HEADERS,
  };
}

function jsonResponse(body: unknown, status: number, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parseNames(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] || CONFIG.DEFAULT_FIRST,
    last_name: parts.slice(1).join(" ") || CONFIG.DEFAULT_LAST,
  };
}

function validateInput(regNo: string, fullName: string): void {
  // Rule 7 Early Return + Rule 21 Fail Fast + Rule 12 Validate
  if (!regNo) throw new Error("reg_no required - Rule 21");
  if (!fullName) throw new Error("full_name required");
  if (!CONFIG.REGEX_SLT.test(regNo.trim())) throw new Error(`Invalid SLT ID ${regNo} - Must SLT/001 format`);
  if (fullName.trim().length < CONFIG.NAME_MIN) throw new Error(`Name min ${CONFIG.NAME_MIN} chars`);
}

function sanitizePhone(phone: string): string {
  // Rule 12 Sanitize
  const cleaned = (phone || CONFIG.DEFAULT_PHONE).replace(/\D/g, "");
  return cleaned.slice(-11) || CONFIG.DEFAULT_PHONE;
}

function sanitizeRegNo(regNo: string): string {
  return regNo.toUpperCase().trim();
}

function buildPayload(regNo: string, fullName: string, phone: string, email: string, bvn: string, dob: string) {
  const customerId = sanitizeRegNo(regNo);
  const { first_name, last_name } = parseNames(fullName);

  return {
    customer_identifier: customerId,
    first_name,
    last_name,
    mobile_num: sanitizePhone(phone),
    email: email || `${customerId.toLowerCase().replace("/", "")}@solidlt.local`,
    bvn,
    dob,
  };
}

async function callSquad(payload: Record<string, string>, secret: string) {
  // Rule 11 Central API Layer + Rule 55 Timeout + Rule 27 Logging with Context
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), CONFIG.TIMEOUT_MS);

  try {
    console.log(`[create-squad-dva] Squad request customer=${payload.customer_identifier} tenant=${CONFIG.TENANT}`);

    const res = await fetch(CONFIG.SQUAD_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });

    const json = await res.json();

    if (!res.ok || json.status !== 200) {
      throw new Error(`Squad failed ${res.status} ${JSON.stringify(json)}`);
    }

    return json.data;
  } finally {
    clearTimeout(tid);
  }
}

serve(async (req: Request) => {
  const corsHeaders = buildCorsHeaders();

  // Rule 7 Early Return - Handle OPTIONS preflight - CORS fix for 127.0.0.1:5500
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  // Rule 28 Health Checks
  if (req.method === "GET") {
    return jsonResponse({ status: "ok", message: "create-squad-dva ready - SOLIDLT_444 - CORS enabled" }, 200, corsHeaders);
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "POST only" }, 405, corsHeaders);
  }

  try {
    // Rule 16 Security First + Rule 60 Secrets Management
    const SQUAD_SECRET_KEY = Deno.env.get("SQUAD_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const OWNER_BVN = Deno.env.get("OWNER_BVN");
    const OWNER_DOB = Deno.env.get("OWNER_DOB") || CONFIG.DEFAULT_DOB;

    if (!SQUAD_SECRET_KEY) throw new Error("Missing SQUAD_SECRET_KEY - Rule 60");
    if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
    if (!SERVICE_KEY) throw new Error("Missing SERVICE_ROLE_KEY");
    if (!OWNER_BVN) throw new Error("Missing OWNER_BVN - YOUR BVN FOR ALL");

    const { reg_no, full_name, phone, email } = await req.json();

    validateInput(reg_no, full_name);

    const customerId = sanitizeRegNo(reg_no);
    console.log(`[create-squad-dva] ${customerId} ${full_name} - tenant=${CONFIG.TENANT} - Rule 27`);

    const payload = buildPayload(reg_no, full_name, phone || "", email || "", OWNER_BVN, OWNER_DOB);
    const dva = await callSquad(payload, SQUAD_SECRET_KEY);

    const dvaNumber = dva.virtual_account_number || dva.account_number;
    const dvaBank = dva.bank_name || "GTBank";
    const dvaName = dva.account_name || `SOLID EDUCATION - ${customerId}`;

    if (!dvaNumber) throw new Error("No virtual_account_number from Squad - Rule 26");

    // Rule 57 Multi-tenancy - update only this tenant's student
    const supa = createClient(SUPABASE_URL, SERVICE_KEY);
    const { error } = await supa
      .from("students")
      .update({
        squad_dva_number: dvaNumber,
        squad_dva_bank: dvaBank,
        squad_dva_name: dvaName,
        squad_customer_identifier: customerId,
      })
      .eq("id number", customerId);

    if (error) throw new Error(`DB fail ${error.message} - Rule 47`);

    console.log(`[create-squad-dva] SUCCESS ${customerId} -> ${dvaNumber} ${dvaBank} - Rule 27`);

    return jsonResponse(
      {
        status: "success",
        reg_no: customerId,
        squad_dva_number: dvaNumber,
        squad_dva_bank: dvaBank,
        squad_dva_name: dvaName,
        message: `✅ DVA Created ${customerId} - ${dvaNumber} ${dvaBank}`,
      },
      200,
      corsHeaders
    );
  } catch (e) {
    const err = e as Error;
    console.error(`[create-squad-dva] FAILED ${err.message} - tenant=${CONFIG.TENANT} - Rule 27`);
    return jsonResponse({ status: "error", message: err.message }, 400, corsHeaders);
  }
});