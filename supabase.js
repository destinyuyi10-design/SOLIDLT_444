// supabase.js - SOLIDLT_444 PRO SINGLETON - FIXED COMPATIBLE - OLD + NEW - ATOMIC BRICK IS STRUCTURE - 206 RULES - NO SECRET LEAK FRONT PAGE - REAL ANON KEY SAFE PUBLIC
// COMPATIBLE WITH app.js 71KB (expects supabase + storageApi) + pay.html atomic (expects SUPABASE_URL + SUPABASE_ANON_KEY + window globals) - No SQUAD_SECRET_KEY - No SERVICE_ROLE - No leak - Atomic
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const SUPABASE_URL = "https://pslllwdefbmtnnsbxevs.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbGxsd2RlZmJtdG5uc2J4ZXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjUyMTQsImV4cCI6MjEwNDQ0MTIxNH0.4m-cACcs_pqHSIgukjFP4Xh4ia5Y2yv8QBwqbi4aCvA";

// Singleton supabase client - For app.js 71KB - supabase.from("students").select("*") - fees - payments - attendance - student_fees
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, storageKey: "SOLIDLT_444_SINGLE" }
});

// Window globals - For non-module scripts + pay.html compatibility if needed - No leak - Real anon key safe public - RLS only id_number,full_name,program - Privacy safe
if (typeof window !== 'undefined') {
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  window.supabase = supabase;
}

console.log("[Supabase] singleton ready - Compatible - supabase + storageApi + SUPABASE_URL + SUPABASE_ANON_KEY - No leak front page - Atomic - Brick is Structure", SUPABASE_URL);

// BRICK 2A - Storage API - Central Layer - Rule 11 - For app.js - uploadPassport 15KB webp - Bucket student-passports - 2MB -> 15KB compress - Camera 400x400 -> 200x200 15KB - Rule 62 cost - Atomic - Brick is structure - Small function <50 lines
export const storageApi = {
  BUCKET: "student-passports",
  async uploadPassport(blob, regNo){
    if(!blob) return null;
    const fileName = `${regNo.replace("/","_")}_${Date.now()}.webp`;
    const { data, error } = await supabase.storage.from(this.BUCKET).upload(fileName, blob, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: false
    });
    if(error) throw error;
    const { data: pub } = supabase.storage.from(this.BUCKET).getPublicUrl(data.path);
    return pub?.publicUrl || null; // 15KB url only
  }
};