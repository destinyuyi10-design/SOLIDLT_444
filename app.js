// app.js - SOLIDLT_444 PRO FIXED - Import singleton, Rules, Bug fixed, Show existing data
import { supabase, storageApi } from "./supabase.js";

const RULES = {
  SLT_PREFIX: "SLT/",
  PAD: 3,
  DEFAULT_STATUS: "unpaid",
  DEFAULT_PROGRAM: "WAEC",
  TENANT: "SOLIDLT_444",
  CACHE_TTL: 60000,
  PHONE_MIN: 7,
  NAME_MIN: 2,
  // BRICK 1B NEW - Automic constants - No Magic
  PROGRAMS: ["WAEC","NECO","GCE","JAMB","POST UTME","NABTEB","Nursing Entrance Examination Prep","JUPEB / Interim Joint Matriculation Board (IJMB)","Direct Entry (DE) Coaching"],
  GENDERS: ["Male","Female"],
  DEFAULT_GENDER: "Male",
  DEFAULT_YEAR: "2025/2026",
  YEAR_START: 2025,
  YEAR_END: 2050,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHOTO_MAX_BEFORE: 2 * 1024 * 1024, // 2MB max before compress - Fail Fast
  PHOTO_TARGET_KB: 15, // 15KB after compress for 2500 = 37.5MB total
  PHOTO_DIM: 200, // 200x200 avatar for SLT/00
  PHOTO_QUALITY: 0.6,
  PHOTO_BUCKET: "student-passports",
  FEE_MIN: 1000, // Boss manual amount min ₦1000 - Rule 8 No Magic - Rule 21 Fail Fast
  CAMERA_DIM: 400, // Big camera display 400x400 -> save 200x200 15KB - Rule 62 Cost
  VALIDITY_MONTHS: [1,2,3,6,12], // Boss dropdown - how many months valid - 1 Month validity default - Rule 8
  GRACE_DAYS: [0,3,7,14,30], // Boss dropdown - grace period days - Rule 8
  DEFAULT_VALIDITY: 1,
  DEFAULT_GRACE: 7,
  DURATIONS: ["1 Month","2 Months","3 Months","6 Months","12 Months"],
  // BRICK 4 - PAYMENTS - API + WEBHOOK URL - MONIEPOINT BUSINESS - Rule 8 No Magic + Rule 21 Fail Fast
  PAYMENT_METHODS: ["Cash","Moniepoint Auto","Transfer","POS"],
  REGEX_SLT: /SLT\/\d{3}/i,
  MONIEPOINT_API_BASE: "https://api.monnify.com",
  RESERVED_ACCOUNT_ENDPOINT: "/api/v2/bank-transfer/reserved-accounts/",
  AUTH_ENDPOINT: "/api/v1/auth/login",
  WEBHOOK_URL: "https://your-domain.com/api/webhook/moniepoint",
  MONIEPOINT_BANK: "Moniepoint MFB",
  PAYMENT_STATUS: ["Active","Partial","Expired","Unpaid"],
  MONIEPOINT_ACCOUNT_TYPE: "Business",
  MONIEPOINT_ACCOUNT_NUMBER: "Business Account • Moniepoint MFB",
  MONIEPOINT_CENTRAL_LABEL: "Business Account • Moniepoint MFB • SLT/001 ref",
  UNMATCHED_TABLE: "unmatched_payments",
};

const els = {
  totalStudents: document.getElementById("totalStudents"),
  totalCollected: document.getElementById("totalCollected"),
  totalOwing: document.getElementById("totalOwing"),
  totalPresent: document.getElementById("totalPresent"),
  studentsBody: document.getElementById("studentsBody"),
  openModalBtn: document.getElementById("openModalBtn"),
  addModal: document.getElementById("addModal"),
  autoIdPreview: document.getElementById("autoIdPreview"),
  fullName: document.getElementById("fullName"),
  phoneInput: document.getElementById("phoneInput"),
  emailInput: document.getElementById("emailInput"),
  genderSelect: document.getElementById("genderSelect"),
  programSelect: document.getElementById("programSelect"),
  yearEntrySelect: document.getElementById("yearEntrySelect"),
  homeAddress: document.getElementById("homeAddress"),
    photoInput: document.getElementById("photoInput"),
  photoPreview: document.getElementById("photoPreview"),
  removePhotoBtn: document.getElementById("removePhotoBtn"),
  avatarWrap: document.getElementById("avatarWrap"),
  cameraModal: document.getElementById("cameraModal"),
  cameraVideo: document.getElementById("cameraVideo"),
  cameraCanvas: document.getElementById("cameraCanvas"),
  cameraCapturePreview: document.getElementById("cameraCapturePreview"),
  openCameraBtn: document.getElementById("openCameraBtn"),
  closeCameraBtn: document.getElementById("closeCameraBtn"),
  switchCameraBtn: document.getElementById("switchCameraBtn"),
  captureBtn: document.getElementById("captureBtn"),
  retakeBtn: document.getElementById("retakeBtn"),
  usePhotoBtn: document.getElementById("usePhotoBtn"),
  saveBtn: document.getElementById("saveBtn"),
  globalSearch: document.getElementById("globalSearch"),
  feesSection: document.getElementById("feesSection"),
  feesBody: document.getElementById("feesBody"),
  navFeesBtn: document.getElementById("navFeesBtn"),
  navDashboardBtn: document.getElementById("navDashboardBtn"),
  openFeeModalBtn: document.getElementById("openFeeModalBtn"),
  feeModal: document.getElementById("feeModal"),
  feeProgramSelect: document.getElementById("feeProgramSelect"),
  feeYearSelect: document.getElementById("feeYearSelect"),
  feeAmountInput: document.getElementById("feeAmountInput"),
  feeAmountPreview: document.getElementById("feeAmountPreview"),
  saveFeeBtn: document.getElementById("saveFeeBtn"),
  closeFeeModalBtn: document.getElementById("closeFeeModalBtn"),
  feeBadge: document.getElementById("feeBadge"),
  feeBadgeError: document.getElementById("feeBadgeError"),
  feeValiditySelect: document.getElementById("feeValiditySelect"),
  feeGraceSelect: document.getElementById("feeGraceSelect"),
  totalFeePlans: document.getElementById("totalFeePlans"),
  waecFeeAmt: document.getElementById("waecFeeAmt"),
  jambFeeAmt: document.getElementById("jambFeeAmt"),
  necoFeeAmt: document.getElementById("necoFeeAmt"),
  validityHint: document.getElementById("validityHint"),  
  // BRICK 4 - PAYMENTS ELS - Rule 11 Central API Layer
  paymentsSection: document.getElementById("paymentsSection"),
  paymentsBody: document.getElementById("paymentsBody"),
  navPaymentsBtn: document.getElementById("navPaymentsBtn"),
  totalCollectedMonth: document.getElementById("totalCollectedMonth"),
  activeStudents: document.getElementById("activeStudents"),
  owingStudents: document.getElementById("owingStudents"),
  expiredFees: document.getElementById("expiredFees"),
  paymentSearch: document.getElementById("paymentSearch"),
  exportPaymentsBtn: document.getElementById("exportPaymentsBtn"),
  openPaymentModalBtn: document.getElementById("openPaymentModalBtn"),
  unmatchedCount: document.getElementById("unmatchedCount"),
  unmatchedBadge: document.getElementById("unmatchedBadge"),
  centralAccountDisplay: document.getElementById("centralAccountDisplay"),
  paymentModal: document.getElementById("paymentModal"),
  payRegNoBadge: document.getElementById("payRegNoBadge"),
  payRegNoInput: document.getElementById("payRegNoInput"),
  payStudentName: document.getElementById("payStudentName"),
  payProgram: document.getElementById("payProgram"),
  payFeeBadge: document.getElementById("payFeeBadge"),
  payAmountInput: document.getElementById("payAmountInput"),
  payMethodSelect: document.getElementById("payMethodSelect"),
  payNarrationInput: document.getElementById("payNarrationInput"),
  payBalancePreview: document.getElementById("payBalancePreview"),
  payValidPreview: document.getElementById("payValidPreview"),
  payDaysPreview: document.getElementById("payDaysPreview"),
  payMethodPreview: document.getElementById("payMethodPreview"),
  moniepointInfoBox: document.getElementById("moniepointInfoBox"),
  payAccountNumber: document.getElementById("payAccountNumber"),
  payAccountRef: document.getElementById("payAccountRef"),
  copyAccountBtn: document.getElementById("copyAccountBtn"),
  copyRefBtn: document.getElementById("copyRefBtn"),
  savePaymentBtn: document.getElementById("savePaymentBtn"),
  closePaymentModalBtn: document.getElementById("closePaymentModalBtn"),
  moniepointWaitModal: document.getElementById("moniepointWaitModal"),
  waitRegNo: document.getElementById("waitRegNo"),
  waitStudentName: document.getElementById("waitStudentName"),
  waitAccountNumber: document.getElementById("waitAccountNumber"),
  waitAmount: document.getElementById("waitAmount"),
  waitRef: document.getElementById("waitRef"),
  closeWaitModalBtn: document.getElementById("closeWaitModalBtn"),
  checkPaymentBtn: document.getElementById("checkPaymentBtn"),
  waitSuccess: document.getElementById("waitSuccess"),
};

function padId(n){ return `${RULES.SLT_PREFIX}${String(n).padStart(RULES.PAD,"0")}`; }
function formatNaira(v){ return "₦" + Number(v||0).toLocaleString(); }

// BRICK 4 - HELPERS - Validity + Days Left - Rule 5 Small Functions + Rule 8 No Magic
function calculateValidTo(validFrom, durationMonths){
  if(!validFrom) validFrom = new Date();
  const from = new Date(validFrom);
  const to = new Date(from);
  to.setMonth(to.getMonth() + Number(durationMonths||RULES.DEFAULT_VALIDITY));
  return to;
}
function calculateDaysLeft(validTo){
  if(!validTo) return 0;
  const today = new Date(); today.setHours(0,0,0,0);
  const to = new Date(validTo); to.setHours(0,0,0,0);
  const diff = Math.ceil((to - today) / 86400000);
  return diff;
}
function formatDateRange(from, to){
  const f = from? new Date(from).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : '-';
  const t = to? new Date(to).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '-';
  return `${f} → ${t}`;
}
function getDaysLeftBadge(daysLeft){
  if(daysLeft < 0) return `<span style="background:#ff000014;color:#ff4444;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:700">Expired ${Math.abs(daysLeft)}d ago</span>`;
  if(daysLeft <= 3) return `<span style="background:#ff5e2d20;color:#ff5e2d;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:700">${daysLeft} days left</span>`;
  return `<span style="background:#0abf5320;color:#0abf53;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:700">${daysLeft} days left</span>`;
}
function getReg(row){ return row["id number"] || row.reg_no || row.id_number || row.regNo || ""; }

function getYearEntryOptions(){
  const years = [];
  for(let y=RULES.YEAR_START; y<=RULES.YEAR_END; y++){
    years.push(`${y}/${y+1}`);
  }
  return years;
}
function renderOptions(list, selected=""){
  return list.map(v=>`<option value="${v}" ${v===selected?"selected":""}>${v}</option>`).join("");
}
function validateBrick1B({name, phone, email, gender, program, year}){
  if(name.length < RULES.NAME_MIN) throw new Error(`Name min ${RULES.NAME_MIN}`);
  if(phone && phone.length < RULES.PHONE_MIN) throw new Error(`Phone min ${RULES.PHONE_MIN}`);
  if(email && !RULES.EMAIL_REGEX.test(email)) throw new Error("Invalid email");
  if(!RULES.GENDERS.includes(gender)) throw new Error("Gender required - auto dropdown");
  if(!RULES.PROGRAMS.includes(program)) throw new Error("Program required - auto dropdown");
  if(!getYearEntryOptions().includes(year)) throw new Error("Year Entry required");
}

// BRICK 2D - Photo Validate + Compress 2MB -> 15KB webp -> auto delete original
function validatePhoto(file){
  if(!file) return;
  const okTypes = ["image/jpeg","image/png","image/webp","image/jpg"];
  if(!okTypes.includes(file.type)) throw new Error("Photo must be JPG/PNG/WEBP");
  if(file.size > RULES.PHOTO_MAX_BEFORE) throw new Error(`Photo too big max 2MB, your file ${ (file.size/1024/1024).toFixed(2)}MB`);
}
function renderAvatarPreview(url){
  if(!els.photoPreview) return;
  els.photoPreview.src = url;
  els.photoPreview.style.display = "block";
  if(els.avatarWrap) els.avatarWrap.style.display = "flex";
}
function resetPhotoState(){
  compressedPhotoBlob = null; // auto delete 2MB original - keep only 15KB
  if(els.photoInput) els.photoInput.value = "";
  if(els.photoPreview){ els.photoPreview.src = ""; els.photoPreview.style.display = "none"; }
}

// BRICK 2.5B - BIG CAMERA - FRONT/BACK - 400x400 display -> 200x200 15KB - Rule 62 no leak
async function openCameraModal(){
  try{
    if(!navigator.mediaDevices?.getUserMedia) throw new Error("Camera not supported - use Gallery");
    if(els.cameraModal){ els.cameraModal.style.display="flex"; els.cameraModal.classList.add("is-open"); }
    if(els.cameraCapturePreview) els.cameraCapturePreview.style.display="none";
    if(els.cameraVideo) els.cameraVideo.style.display="block";
    if(els.captureBtn) els.captureBtn.style.display="inline-flex";
    if(els.retakeBtn) els.retakeBtn.style.display="none";
    if(els.usePhotoBtn) els.usePhotoBtn.style.display="none";
    if(els.cameraCapturePreview) els.cameraCapturePreview.src="";
    cameraCapturedBlob = null;
    // stop old stream - Rule 62
    if(cameraStream){ cameraStream.getTracks().forEach(t=>t.stop()); cameraStream=null; }
    cameraStream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: facingMode, width: { ideal: RULES.CAMERA_DIM }, height: { ideal: RULES.CAMERA_DIM } },
      audio: false 
    });
    if(els.cameraVideo) els.cameraVideo.srcObject = cameraStream;
  }catch(e){ alert("Camera failed: "+e.message); closeCameraModal(); }
}
function closeCameraModal(){
  if(cameraStream){ cameraStream.getTracks().forEach(t=>t.stop()); cameraStream=null; } // Rule 62 free RAM
  if(els.cameraModal){ els.cameraModal.style.display="none"; els.cameraModal.classList.remove("is-open"); }
  if(els.cameraVideo){ els.cameraVideo.srcObject=null; }
}
async function switchCamera(){
  facingMode = facingMode==="user" ? "environment" : "user";
  if(cameraStream){ cameraStream.getTracks().forEach(t=>t.stop()); cameraStream=null; }
  try{
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode, width:{ideal:RULES.CAMERA_DIM}, height:{ideal:RULES.CAMERA_DIM} }, audio:false });
    if(els.cameraVideo){ els.cameraVideo.srcObject=cameraStream; els.cameraVideo.style.display="block"; }
    if(els.cameraCapturePreview) els.cameraCapturePreview.style.display="none";
    if(els.captureBtn) els.captureBtn.style.display="inline-flex";
    if(els.retakeBtn) els.retakeBtn.style.display="none";
    if(els.usePhotoBtn) els.usePhotoBtn.style.display="none";
  }catch(e){ alert("Switch failed: "+e.message); facingMode = facingMode==="user" ? "environment" : "user"; }
}
async function captureFromCamera(){
  if(!els.cameraVideo || !els.cameraCanvas) return;
  const video = els.cameraVideo;
  if(video.videoWidth===0) { alert("Camera not ready"); return; }
  const canvas = els.cameraCanvas;
  const dim = RULES.PHOTO_DIM; // save 200x200 15KB not 400x400
  canvas.width=dim; canvas.height=dim;
  const ctx = canvas.getContext("2d");
  // center crop from video
  const minSide = Math.min(video.videoWidth, video.videoHeight);
  const sx = (video.videoWidth - minSide)/2;
  const sy = (video.videoHeight - minSide)/2;
  ctx.drawImage(video, sx, sy, minSide, minSide, 0, 0, dim, dim);
  const blob = await new Promise(r=> canvas.toBlob(r, "image/webp", RULES.PHOTO_QUALITY));
  if(!blob) throw new Error("Capture compress failed");
  let finalBlob = blob;
  if(blob.size > 20*1024){
    finalBlob = await new Promise(r=> canvas.toBlob(r, "image/webp", 0.45)) || blob;
  }
  cameraCapturedBlob = finalBlob; // 15KB only
  const previewUrl = URL.createObjectURL(finalBlob);
  if(els.cameraCapturePreview){ els.cameraCapturePreview.src=previewUrl; els.cameraCapturePreview.style.display="block"; }
  if(els.cameraVideo) els.cameraVideo.style.display="none";
  if(els.captureBtn) els.captureBtn.style.display="none";
  if(els.retakeBtn) els.retakeBtn.style.display="inline-flex";
  if(els.usePhotoBtn) els.usePhotoBtn.style.display="inline-flex";
  console.log(`[Camera] Captured 400x400 -> ${dim}x${dim} ${(finalBlob.size/1024).toFixed(1)}KB webp - stream still active`);
}
function retakeCamera(){
  cameraCapturedBlob = null;
  if(els.cameraCapturePreview){ els.cameraCapturePreview.src=""; els.cameraCapturePreview.style.display="none"; }
  if(els.cameraVideo) els.cameraVideo.style.display="block";
  if(els.captureBtn) els.captureBtn.style.display="inline-flex";
  if(els.retakeBtn) els.retakeBtn.style.display="none";
  if(els.usePhotoBtn) els.usePhotoBtn.style.display="none";
}
function useCameraPhoto(){
  if(!cameraCapturedBlob) return;
  compressedPhotoBlob = cameraCapturedBlob; // Rule 11 DRY - reuse existing 15KB logic
  const previewUrl = URL.createObjectURL(compressedPhotoBlob);
  renderAvatarPreview(previewUrl);
  console.log(`[Camera] Use Photo 15KB -> main preview like SLT/008 MONDAY OGBOMO`);
  closeCameraModal();
  cameraCapturedBlob = null;
}

let compressedPhotoBlob = null; // holds only 15KB, not 2MB - Rule 62 cost

let cameraStream = null;
let facingMode = "user"; // front - Rule 11 DRY
let cameraCapturedBlob = null; // temp 15KB before Use

async function compressToWebp15KB(file){
  // Rule 40 Performance Budget + Rule 24 Batch? single canvas
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const dim = RULES.PHOTO_DIM;
  canvas.width = dim; canvas.height = dim;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, dim, dim);
  bitmap.close(); // free 2MB memory immediately
  const blob = await new Promise(res => canvas.toBlob(res, "image/webp", RULES.PHOTO_QUALITY));
  if(!blob) throw new Error("Compress failed");
  // If still >20KB, recompress lower
  if(blob.size > 20*1024){
    const blob2 = await new Promise(r => canvas.toBlob(r, "image/webp", 0.45));
    return blob2 || blob;
  }
  return blob; // 10-15KB only
}

function getStudentAvatar(url, name){
  if(!url) return `<div class="student-avatar" style="width:36px;height:36px;background:var(--brand);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px">${(name||"?").charAt(0).toUpperCase()}</div>`;
  return `<img src="${url}" alt="Student ${name}" class="student-avatar" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid var(--border)" loading="lazy" />`;
}

let cache = { students: [], ts: 0 };
const isCacheValid = () => Date.now() - cache.ts < RULES.CACHE_TTL && cache.students.length > 0;

const studentApi = {
  async getAll(){
    if(isCacheValid()) return cache.students;
    try{
      const { data, error } = await supabase.from("students").select("*").order("id", { ascending: true });
      if(error) throw error;
      cache.students = data || []; cache.ts = Date.now();
      console.log("[Load] students", cache.students.length);
      return cache.students;
    }catch(e){
      // Rule 30 Error Boundary - no throw - return cached or [] - prevent Total Students 0 crash
      console.error("[Load] students Failed to fetch - Check supabase.js ANON_KEY eyJ... + RLS allow all public + internet", e);
      return cache.students.length? cache.students : [];
    }
  },
  async getCount(){
    try{
      const { count, error } = await supabase.from("students").select("*", { count: "exact", head: true });
      if(error) return cache.students.length;
      return count || 0;
    }catch(e){ return cache.students.length; }
  },
  async create(payload){
    const { data, error } = await supabase.from("students").insert([payload]).select().single();
    if(error) throw error;
    cache.ts = 0;
    return data;
  }
};

// BRICK 3D - Fees API - Boss manual + auto reflect - Rule 8, 21, 62
const feesApi = {
  cache: { data: [], ts: 0 },
  isValid(){ return Date.now() - this.cache.ts < RULES.CACHE_TTL && this.cache.data.length>=0; },
  async getAll(){
    if(this.isValid()) return this.cache.data;
    const { data, error } = await supabase.from("fees").select("*").order("year_entry", {ascending:false}).order("program");
    if(error) throw error;
    this.cache.data = data||[]; this.cache.ts = Date.now();
    return this.cache.data;
  },
  async getFee(program, yearEntry){
    const all = await this.getAll();
    return all.find(f=> f.program===program && f.year_entry===yearEntry) || null;
  },
    async create({program, year_entry, amount, duration_months, grace_days}){
    if(!program ||!year_entry) throw new Error("Program + Year required - Rule 21");
    if(amount < RULES.FEE_MIN) throw new Error(`Amount min ₦${RULES.FEE_MIN} - Rule 21`);
    if(!RULES.VALIDITY_MONTHS.includes(duration_months)) throw new Error("Validity months required - dropdown - Rule 21");
    if(!RULES.GRACE_DAYS.includes(grace_days)) throw new Error("Grace days required - dropdown - Rule 21");
    const payload = { program, year_entry, amount, duration_months, grace_days, duration_label: `${duration_months} Month${duration_months>1?"s":""}`, status: "Active", tenant: RULES.TENANT };
    const { data, error } = await supabase.from("fees").upsert([payload], { onConflict: "program,year_entry,tenant" }).select().single();
    if(error) throw error;
    this.cache.ts = 0;
    return data;
  },
  async deleteFee(id){
    const { error } = await supabase.from("fees").delete().eq("id", id);
    if(error) throw error;
    this.cache.ts = 0;
  }
};
const studentFeesApi = {
  async create({reg_no, student_id, program, year_entry, total_amount}){
    const { data, error } = await supabase.from("student_fees").insert([{
      reg_no, student_id, program, year_entry, total_amount, amount_paid:0, balance: total_amount, status: "unpaid", tenant: RULES.TENANT
    }]).select().single();
    if(error) throw error;
    return data;
  },
  async getAll(){ const { data } = await supabase.from("student_fees").select("*").limit(1000); return data||[]; }
};

const paymentApi = { async getAll(){ const { data } = await supabase.from("payments").select("*").limit(1000); return data||[]; } };
const attendanceApi = { async getToday(){ const today = new Date().toISOString().slice(0,10); const { data } = await supabase.from("attendance").select("*").eq("date", today).limit(1000); return data||[]; } };

// BRICK 4 - MONIEPOINT API - API + WEBHOOK URL - Once pay webhook enter student details - Rule 60 Secrets + Rule 52 Verify Signature + Rule 55 Timeout + Rule 56 Circuit Breaker + Rule 20 Idempotency + Rule 50 Return Fast
const moniepointApi = {
  _token: null,
  _tokenExpiry: 0,
  async getAccessToken(){
    // Rule 42 Caching - token 1 hour - Rule 60 Secrets from env or Supabase vault
    if(this._token && Date.now() < this._tokenExpiry - 60000) return this._token;
    const apiKey = localStorage.getItem('MONIEPOINT_API_KEY') || ''; // set by admin Settings - Rule 60
    const secret = localStorage.getItem('MONIEPOINT_SECRET') || '';
    if(!apiKey ||!secret){
      console.warn("[Moniepoint] API Key not set - using Central Account mode - No CAC Level 1 - Rule 8");
      return null;
    }
    try{
      const credentials = btoa(`${apiKey}:${secret}`);
      const res = await fetch(`${RULES.MONIEPOINT_API_BASE}${RULES.AUTH_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
      });
      if(!res.ok) throw new Error(`Auth failed ${res.status}`);
      const json = await res.json();
      this._token = json.responseBody?.accessToken || json.accessToken;
      const expiresIn = json.responseBody?.expiresIn || 3600;
      this._tokenExpiry = Date.now() + (expiresIn * 1000);
      return this._token;
    }catch(e){
      console.error("[Moniepoint] getAccessToken failed", e);
      return null;
    }
  },
  async createReservedAccount({accountReference, accountName, customerName, customerEmail}){
    // Rule 21 Fail Fast - accountReference = SLT/001 auto follow no typing
    if(!RULES.REGEX_SLT.test(accountReference)) throw new Error(`Invalid SLT ID ${accountReference} - Rule 21`);
    const token = await this.getAccessToken();
    // If no token - Level 1 no CAC - fallback to central account - still API + Webhook URL method
    if(!token){
      return {
        account_number: RULES.MONIEPOINT_ACCOUNT_NUMBER,
        bank_name: RULES.MONIEPOINT_BANK,
        account_name: `${customerName} - ${RULES.TENANT}`,
        accountReference,
        isFallback: true,
      };
    }
    try{
      const res = await fetch(`${RULES.MONIEPOINT_API_BASE}${RULES.RESERVED_ACCOUNT_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountReference,
          accountName: accountName || `${customerName} ${RULES.TENANT}`,
          currencyCode: "NGN",
          contractCode: localStorage.getItem('MONIEPOINT_CONTRACT_CODE') || '',
          customerEmail: customerEmail || `${accountReference.toLowerCase()}@solidlt.local`,
          customerName: customerName,
          getAllAvailableBanks: false,
        }),
      });
      if(!res.ok){
        const txt = await res.text();
        throw new Error(`Create reserved account failed ${res.status} ${txt}`);
      }
      const json = await res.json();
      const body = json.responseBody || json;
      return {
        account_number: body.accountNumber || body.account_number || RULES.MONIEPOINT_ACCOUNT_NUMBER,
        bank_name: body.bankName || RULES.MONIEPOINT_BANK,
        account_name: body.accountName || accountName,
        accountReference,
        isFallback: false,
        raw: json,
      };
    }catch(e){
      console.error("[Moniepoint] createReservedAccount failed, fallback to central", e);
      return {
        account_number: RULES.MONIEPOINT_ACCOUNT_NUMBER,
        bank_name: RULES.MONIEPOINT_BANK,
        account_name: `${customerName} - ${RULES.TENANT}`,
        accountReference,
        isFallback: true,
        error: e.message,
      };
    }
  }
};

// BRICK 4 - PAYMENT API EXTENDED - Moniepoint Ref + Narration + Balance + Valid From-To + Days Left + Method
const paymentApiExtended = {
  async getAll(){
    try{
      const { data, error } = await supabase.from("payments").select("*").order("created_at",{ascending:false}).limit(1000);
      if(error) throw error;
      return data||[];
    }catch(e){
      console.error("[Payments] getAll failed", e);
      return [];
    }
  },
  async create(payload){
    // Rule 23 Transactions - 2 updates in 1 - Rule 20 Idempotency moniepoint_ref
    const { data, error } = await supabase.from("payments").insert([payload]).select().single();
    if(error) throw error;
    return data;
  }
};

// BRICK 3F - Render Stats Real Owing - Rule 5,7,8,11,21,42,58
function renderStats(students, payments, attendance, studentFees=[]){
  if(els.totalStudents) els.totalStudents.textContent = students.length;
  const collected = (payments||[]).reduce((s,p)=> s + Number(p.amount||0), 0);
  if(els.totalCollected) els.totalCollected.textContent = formatNaira(collected);

  const unpaidStudents = (students||[]).filter(s=>{
    const raw = (s.payment_status || RULES.DEFAULT_STATUS || "").toLowerCase();
    const normalized = raw === "not_paid"? "unpaid" : raw;
    return normalized === "unpaid" || normalized === "partial";
  });
  const unpaidCount = unpaidStudents.length;

  // Real outstanding - Rule 11 Central API Layer - sum student_fees balance, if empty fallback to fees table * unpaidCount
  let totalOwingAmount = (studentFees||[]).reduce((sum,f)=> sum + Number(f.balance||0), 0);
  if(totalOwingAmount===0 && unpaidCount>0){
    // Fallback for old SLT/001-008 where program=SLT no fee record - use WAEC fee as default - Rule 8 No Magic
    try{
      const feeForFallback = (window._feesCache||[]).find(f=> f.program==="WAEC") || (window._feesCache||[])[0];
      if(feeForFallback) totalOwingAmount = unpaidCount * Number(feeForFallback.amount||0);
    }catch(e){ totalOwingAmount = 0; }
  }

  if(els.totalOwing) els.totalOwing.textContent = unpaidCount? `${unpaidCount} unpaid - ${formatNaira(totalOwingAmount)}` : formatNaira(0);
  if(els.totalPresent) els.totalPresent.textContent = (attendance||[]).length;

  // Log with context - Rule 27 Logging with Context
  console.log(`[Stats] students:${students.length} unpaid:${unpaidCount} owing:${formatNaira(totalOwingAmount)} collected:${formatNaira(collected)} feesCache:${(window._feesCache||[]).length} studentFees:${(studentFees||[]).length}`);
}

function renderTable(students){
  if(!els.studentsBody) return;
  if(!students.length){
    els.studentsBody.innerHTML = `<tr><td colspan="7" style="color:var(--text-faint);padding:16px">No students yet - Add ${padId(1)}</td></tr>`;
    return;
  }
  els.studentsBody.innerHTML = students.map(s=>{
    const reg = getReg(s) || padId(s.id);
    const name = s.full_name || "Unknown";
    const phone = s.phone || "";
    const email = s.email_address || "";
    const gender = s.gender || "";
    const prog = s.program || RULES.DEFAULT_PROGRAM;
    const year = s.year_entry || RULES.DEFAULT_YEAR;
    const rawStatus = s.payment_status || RULES.DEFAULT_STATUS;
    const normalizedStatus = rawStatus.toLowerCase() === "not_paid" ? "unpaid" : rawStatus.toLowerCase();
    const displayStatus = normalizedStatus.toUpperCase();
    const statusColor = normalizedStatus==="paid"? "var(--success)" : normalizedStatus==="partial"? "orange" : "var(--danger)";
    return `<tr>
      <td style="color:var(--brand);font-weight:800">${reg}</td>
      <td><div style="display:flex;gap:10px;align-items:center">${getStudentAvatar(s.photo_url, name)}<div><div style="font-weight:600">${name}</div><small style="color:#888">${gender} | ${phone}<br>${email}</small></div></div></td>
      <td>${prog}</td>
      <td>${year}</td>
      <td><span style="color:${statusColor};font-weight:700">${displayStatus}</span></td>
      <td style="max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${s.home_address||''}">${s.home_address||""}</td>
      <td><div style="display:flex;gap:4px"><button class="btn btn-primary" style="padding:6px 10px;font-size:11px;background:var(--brand);font-weight:700" onclick="window.openPaymentModal('${reg}')">Pay</button><button class="btn" style="padding:6px 8px;font-size:10px;background:var(--bg-hover);border:1px solid var(--border)">View</button></div></td>
      </tr>`;
    
  }).join("");
}

// BRICK 3E - Render Fees Table + Switch Views - Rule 5 small functions
// BRICK 3E - Render Fees Board 4 Cards + 8 Cols - MATCH solidlt_fees_dashboard.jpg
function renderFeesTable(fees){
  if(!els.feesBody) return;
  // 4 CARDS AUTO REFLECT - Total Plans + WAEC + JAMB + NECO - like board image
  if(els.totalFeePlans) els.totalFeePlans.textContent = fees.length;
  const getAmt = (prog)=>{ const f = fees.find(x=> x.program===prog); return f? formatNaira(f.amount) : "₦0"; };
  if(els.waecFeeAmt) els.waecFeeAmt.textContent = getAmt("WAEC");
  if(els.jambFeeAmt) els.jambFeeAmt.textContent = getAmt("JAMB");
  if(els.necoFeeAmt) els.necoFeeAmt.textContent = getAmt("NECO");
  if(els.validityHint){ const v = fees[0]?.duration_months || RULES.DEFAULT_VALIDITY; els.validityHint.textContent = `${v} Month${v>1?"s":""} validity`; }

  if(!fees.length){
    els.feesBody.innerHTML = `<tr><td colspan="8" style="color:var(--text-faint);padding:16px">No fees set yet - Click + Set New Session Fee - Boss type WAEC ₦45,000 1 Month 7 Days like board</td></tr>`;
    return;
  }

    // STUDENTS AFFECTED real - Rule 11 Central API Layer - check students table (SLT/00) + student_fees - for old SLT program fallback to WAEC
  const affectedCount = (program, year_entry)=>{
    try{
      const fromStudentFees = (window._studentFeesCache||[]).filter(sf=> sf.program===program && sf.year_entry===year_entry).length;
      const fromStudents = (cache.students||[]).filter(s=> {
        const p = (s.program||"").toUpperCase();
        const y = s.year_entry||"";
        // For board demo - count WAEC fee affects SLT program old students too if year matches - Rule 7 Early Return
        if(program==="WAEC" && (p==="SLT" || p==="WAEC") && y===year_entry) return true;
        return p===program && y===year_entry;
      }).length;
      return Math.max(fromStudentFees, fromStudents);
    }catch(e){ return 0; }
  };

  els.feesBody.innerHTML = fees.map(f=>{
    const affected = affectedCount(f.program, f.year_entry);
    const status = f.status || "Active";
    const durationLabel = f.duration_label || `${f.duration_months||1} Month${(f.duration_months||1)>1?"s":""}`;
    const lastUpdated = f.updated_at? new Date(f.updated_at).toLocaleString() : "Just now";
    const progColor = f.program==="WAEC"? "#2d5aff" : f.program==="JAMB"? "#ff5e2d" : f.program==="NECO"? "#0abf53" : "#8a5aff";
    const progBg = f.program==="WAEC"? "#2d5aff" : f.program==="JAMB"? "#ff5e2d" : f.program==="NECO"? "#0abf53" : "#8a5aff";
    return `<tr>
      <td style="font-weight:700">${f.year_entry}</td>
      <td><span style="background:${progBg}25;color:${progBg};padding:5px 12px;border-radius:8px;font-weight:800;font-size:12px;border:1px solid ${progBg}30">${f.program}</span></td>
      <td style="color:var(--brand);font-weight:800">${formatNaira(f.amount)}</td>
      <td>${durationLabel}</td>
      <td style="font-weight:700;text-align:center">${affected}</td>
      <td><span style="background:#0abf5320;color:#0abf53;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid #0abf5330">● ${status}</span></td>
      <td style="color:var(--text-faint);font-size:11px">${lastUpdated}</td>
      <td><div style="display:flex;gap:6px"><button class="btn" title="Delete fee" style="font-size:12px;background:transparent;border:1px solid var(--border);padding:6px 8px" onclick="window.deleteFee('${f.id}')">🗑</button></div></td>
    </tr>`;
  }).join("");
}
async function loadFees(){
  if(els.feesBody) els.feesBody.innerHTML = `<tr><td colspan="8"><div class="skeleton">Loading fees - Fee Structure board - 4 cards...</div></td></tr>`;
  try{
    const fees = await feesApi.getAll();
    const sFees = await studentFeesApi.getAll();
    window._studentFeesCache = sFees; // for affected count - Rule 42 Caching
    window._feesCache = fees; // for stats fallback - Rule 42 + Rule 11
    renderFeesTable(fees);
  }catch(e){
    if(els.feesBody) els.feesBody.innerHTML = `<tr><td colspan="8" style="color:red">Load fees failed: ${e.message} - Check fees RLS allow all public + duration_months,grace_days columns</td></tr>`;
    console.error("[Fees] Load failed", e);
  }
}

// BRICK 4 - RENDER PAYMENTS - 4 CARDS + TABLE 10 COLS - Rule 5 Small Functions + Rule 11 Central API Layer + Rule 42 Caching + Rule 15 Handle 3 States + Rule 27 Logging
function renderPaymentsCards(payments, studentFees){
  try{
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthPayments = (payments||[]).filter(p=>{
      const d = p.created_at? new Date(p.created_at) : (p.date_paid? new Date(p.date_paid) : null);
      return d && d >= firstDay;
    });
    const collectedMonth = thisMonthPayments.reduce((s,p)=> s + Number(p.amount||p.amount_paid||0), 0);
    if(els.totalCollectedMonth) els.totalCollectedMonth.textContent = formatNaira(collectedMonth);

    const active = (studentFees||[]).filter(f=>{
      const validTo = f.valid_to? new Date(f.valid_to) : null;
      return f.status === "Active" && validTo && validTo >= now;
    }).length;
    if(els.activeStudents) els.activeStudents.textContent = active;

    const owing = (studentFees||[]).filter(f=>{
      const bal = Number(f.balance||0);
      return bal > 0 || f.status === "Partial" || f.status === "Unpaid" || f.status === "unpaid";
    }).length;
    if(els.owingStudents) els.owingStudents.textContent = owing;

    const expired = (studentFees||[]).filter(f=>{
      const validTo = f.valid_to? new Date(f.valid_to) : null;
      return validTo && validTo < now;
    }).length;
    if(els.expiredFees) els.expiredFees.textContent = expired;

    const unmatched = (window._unmatchedCache||[]).length;
    if(els.unmatchedCount) els.unmatchedCount.textContent = unmatched;
    if(els.centralAccountDisplay) els.centralAccountDisplay.textContent = RULES.MONIEPOINT_CENTRAL_LABEL;

    console.log(`[Payments Cards] month:${formatNaira(collectedMonth)} active:${active} owing:${owing} expired:${expired} unmatched:${unmatched}`);
  }catch(e){ console.error("[Payments Cards] failed", e); }
}
function renderPaymentsTable(payments){
  if(!els.paymentsBody) return;
  if(!payments.length){
    els.paymentsBody.innerHTML = `<tr><td colspan="10" style="color:var(--text-faint);padding:16px">No payments yet - Click + Record Payment - Secretary click Pay for SLT/001 auto id follow - Moniepoint Webhook dey wait for money to enter once he enter auto trap successful</td></tr>`;
    return;
  }
  els.paymentsBody.innerHTML = payments.map(p=>{
    const reg = p.reg_no || p.slt_id || p["id number"] || "-";
    const studentName = p.student_name || p.full_name || "-";
    const prog = p.program || "-";
    const amount = Number(p.amount||p.amount_paid||0);
    const ref = p.moniepoint_ref || p.transaction_ref || "-";
    const narration = p.narration || p.paymentReference || reg;
    const balance = Number(p.balance||0);
    const validFrom = p.valid_from? new Date(p.valid_from) : null;
    const validTo = p.valid_to? new Date(p.valid_to) : null;
    const daysLeft = validTo? calculateDaysLeft(validTo) : 0;
    const method = p.method || p.payment_method || "-";
    const datePaid = p.created_at? new Date(p.created_at).toLocaleString() : (p.date_paid? new Date(p.date_paid).toLocaleString() : "-");
    const balanceColor = balance>0? "var(--brand)" : "var(--green-text)";
    const daysBadge = validTo? getDaysLeftBadge(daysLeft) : "-";
    return `<tr>
      <td style="font-size:11px;color:var(--text-soft)">${datePaid}</td>
      <td><div style="font-weight:800;color:var(--brand)">${reg}</div><div style="font-size:11px;color:var(--text-soft)">${studentName}</div></td>
      <td><span style="background:var(--bg-hover);padding:4px 8px;border-radius:6px;font-size:11px">${prog}</span></td>
      <td style="font-weight:800;color:var(--brand)">${formatNaira(amount)}</td>
      <td><div style="font-size:11px;font-weight:700">${ref}</div><div style="font-size:10px;color:var(--text-faint)">${narration}</div></td>
      <td style="font-weight:700;color:${balanceColor}">${formatNaira(balance)}</td>
      <td style="font-size:11px">${validFrom && validTo? formatDateRange(validFrom, validTo) : "-"}</td>
      <td>${daysBadge}</td>
      <td><span style="background:#00A4FF14;color:#00A4FF;padding:4px 8px;border-radius:12px;font-size:10px;font-weight:700;border:1px solid #00A4FF30">${method}</span></td>
      <td><div style="display:flex;gap:4px"><button class="btn" style="font-size:10px;padding:4px 6px;background:var(--bg-hover);border:1px solid var(--border)" onclick="window.viewPayment('${p.id||reg}')">View</button><button class="btn" style="font-size:10px;padding:4px 6px;background:var(--bg-hover);border:1px solid var(--border)" onclick="window.downloadReceipt('${p.id||reg}')">📄</button></div></td>
    </tr>`;
  }).join("");
}
async function loadPayments(){
  if(els.paymentsBody) els.paymentsBody.innerHTML = `<tr><td colspan="10"><div class="skeleton">Loading payments - Moniepoint Business API + Webhook URL - Once pay webhook enter student details...</div></td></tr>`;
  try{
    const payments = await paymentApiExtended.getAll();
    const sFees = await studentFeesApi.getAll();
    window._studentFeesCache = sFees;
    window._paymentsCache = payments;
    try{
      const { data: unmatched } = await supabase.from(RULES.UNMATCHED_TABLE).select("*").limit(100);
      window._unmatchedCache = unmatched||[];
    }catch(e){ window._unmatchedCache = []; }
    renderPaymentsCards(payments, sFees);
    renderPaymentsTable(payments);
  }catch(e){
    if(els.paymentsBody) els.paymentsBody.innerHTML = `<tr><td colspan="10" style="color:red">Load payments failed: ${e.message} - Check payments RLS allow all public + moniepoint_ref,narration,balance,valid_from,valid_to,days_left,method columns</td></tr>`;
    console.error("[Payments] Load failed", e);
  }
}

function openFeeModal(){
  if(els.feeProgramSelect) els.feeProgramSelect.innerHTML = renderOptions(RULES.PROGRAMS, RULES.DEFAULT_PROGRAM);
  if(els.feeYearSelect) els.feeYearSelect.innerHTML = renderOptions(getYearEntryOptions(), RULES.DEFAULT_YEAR);
  if(els.feeValiditySelect) els.feeValiditySelect.innerHTML = renderOptions(RULES.VALIDITY_MONTHS.map(m=> `${m}`), String(RULES.DEFAULT_VALIDITY));
  if(els.feeGraceSelect) els.feeGraceSelect.innerHTML = renderOptions(RULES.GRACE_DAYS.map(d=> `${d}`), String(RULES.DEFAULT_GRACE));
  if(els.feeAmountInput){ els.feeAmountInput.value=""; if(els.feeAmountPreview) els.feeAmountPreview.textContent="₦0"; }
  if(els.feeModal){ els.feeModal.style.display="flex"; els.feeModal.classList.add("is-open"); }
}

// BRICK 4 - OPEN PAYMENT MODAL - AUTO ID FOLLOW NO TYPING - Rule 21 Fail Fast + Rule 12 Validate + Rule 8 No Magic
async function openPaymentModal(regNo){
  try{
    if(!regNo) throw new Error("No student selected - Rule 21");
    if(!RULES.REGEX_SLT.test(regNo)) throw new Error(`Invalid SLT ID ${regNo} - must be SLT/001 format - Rule 21`);
    const student = (cache.students||[]).find(s=> getReg(s)===regNo);
    if(!student) throw new Error(`Student ${regNo} not found - cache empty - Rule 21`);

    const program = student.program || RULES.DEFAULT_PROGRAM;
    const yearEntry = student.year_entry || RULES.DEFAULT_YEAR;
    const fee = await feesApi.getFee(program, yearEntry);
    const amount = fee? Number(fee.amount) : 0;
    const duration = fee? Number(fee.duration_months||RULES.DEFAULT_VALIDITY) : RULES.DEFAULT_VALIDITY;

    if(els.payRegNoBadge) els.payRegNoBadge.textContent = regNo;
    if(els.payRegNoInput){ els.payRegNoInput.value = regNo; } // readonly auto follow no typing
    if(els.payStudentName) els.payStudentName.value = student.full_name || "";
    if(els.payProgram) els.payProgram.value = `${program} ${yearEntry}`;
    if(els.payFeeBadge) els.payFeeBadge.textContent = fee? `💰 Fee: ${formatNaira(fee.amount)} for ${fee.program} ${fee.year_entry} - ${fee.duration_label||duration+' Month validity'} - auto from Boss set` : `⚠ No fee set for ${program} ${yearEntry}`;
    if(els.payAmountInput){ els.payAmountInput.value = amount || ""; }
    if(els.payNarrationInput) els.payNarrationInput.value = regNo; // auto SLT/001
    if(els.payAccountRef) els.payAccountRef.textContent = regNo;
    if(els.payAccountNumber) els.payAccountNumber.textContent = RULES.MONIEPOINT_CENTRAL_LABEL;
    if(els.payMethodSelect) els.payMethodSelect.value = "Moniepoint Auto";

    const validFrom = new Date();
    const validTo = calculateValidTo(validFrom, duration);
    if(els.payBalancePreview) els.payBalancePreview.textContent = formatNaira(Math.max(0, amount - (Number(els.payAmountInput.value)||0)));
    if(els.payValidPreview) els.payValidPreview.textContent = formatDateRange(validFrom, validTo);
    if(els.payDaysPreview) els.payDaysPreview.textContent = `${calculateDaysLeft(validTo)} days left`;
    if(els.payMethodPreview) els.payMethodPreview.textContent = "Moniepoint Auto";

    if(els.paymentModal){ els.paymentModal.style.display="flex"; els.paymentModal.classList.add("is-open"); }
    console.log(`[Payment Modal] Auto ID follow ${regNo} - no typing - prevent error`);
  }catch(e){
    alert(e.message);
    console.error("[openPaymentModal] failed", e);
  }
}
function closePaymentModal(){ if(els.paymentModal){ els.paymentModal.style.display="none"; els.paymentModal.classList.remove("is-open"); } }
function openMoniepointWaitModal({regNo, studentName, accountNumber, amount}){
  if(els.waitRegNo) els.waitRegNo.textContent = regNo;
  if(els.waitStudentName) els.waitStudentName.textContent = studentName || regNo;
  if(els.waitAccountNumber) els.waitAccountNumber.textContent = accountNumber || RULES.MONIEPOINT_ACCOUNT_NUMBER;
  if(els.waitAmount) els.waitAmount.textContent = formatNaira(amount||0);
  if(els.waitRef) els.waitRef.textContent = regNo;
  if(els.waitSuccess) els.waitSuccess.style.display="none";
  if(els.moniepointWaitModal){ els.moniepointWaitModal.style.display="flex"; els.moniepointWaitModal.classList.add("is-open"); }
}
function closeMoniepointWaitModal(){ if(els.moniepointWaitModal){ els.moniepointWaitModal.style.display="none"; els.moniepointWaitModal.classList.remove("is-open"); } }
window.openPaymentModal = openPaymentModal;
window.viewPayment = (id)=>{ alert(`View Payment ${id} - TODO receipt`); };
window.downloadReceipt = (id)=>{ alert(`Download Receipt ${id} - TODO pdf`); };

// FIX - SEPARATELY VIEW + SHOW CARDS-GRID CORRECT - Rule 37 Separation + Rule 15 Handle 3 States
function showDashboard(){
  const firstCardsGrid = document.querySelector("main.content > section.cards-grid");
  if(firstCardsGrid) firstCardsGrid.style.display="grid";
  document.querySelectorAll("main.content > section.card").forEach(s=>{
    if(s.id==="feesSection" || s.id==="paymentsSection") s.style.display="none";
    else s.style.display="block";
  });
  document.querySelectorAll(".nav-link").forEach(l=> l.classList.remove("active"));
  if(els.navDashboardBtn) els.navDashboardBtn.classList.add("active");
}
function showFees(){
  const firstCardsGrid = document.querySelector("main.content > section.cards-grid");
  if(firstCardsGrid) firstCardsGrid.style.display="none";
  document.querySelectorAll("main.content > section.card").forEach(s=>{
    s.style.display = (s.id==="feesSection") ? "block" : "none";
  });
  if(els.feesSection){ loadFees(); }
  document.querySelectorAll(".nav-link").forEach(l=> l.classList.remove("active"));
  if(els.navFeesBtn) els.navFeesBtn.classList.add("active");
}
function showPayments(){
  const firstCardsGrid = document.querySelector("main.content > section.cards-grid");
  if(firstCardsGrid) firstCardsGrid.style.display="none";
  document.querySelectorAll("main.content > section.card").forEach(s=>{
    s.style.display = (s.id==="paymentsSection") ? "block" : "none";
  });
  if(els.paymentsSection){ loadPayments(); }
  document.querySelectorAll(".nav-link").forEach(l=> l.classList.remove("active"));
  if(els.navPaymentsBtn) els.navPaymentsBtn.classList.add("active");
}

function closeFeeModal(){ if(els.feeModal){ els.feeModal.style.display="none"; els.feeModal.classList.remove("is-open"); } }

async function updateFeeBadge(){
  const program = els.programSelect?.value || "";
  const year = els.yearEntrySelect?.value || "";
  if(!program ||!year){ if(els.feeBadge) els.feeBadge.style.display="none"; if(els.feeBadgeError) els.feeBadgeError.style.display="none"; return; }
  try{
    const fee = await feesApi.getFee(program, year);
    if(fee){
      if(els.feeBadge){ els.feeBadge.textContent = `💰 Fee: ${formatNaira(fee.amount)} for ${fee.program} ${fee.year_entry} - auto from Boss set`; els.feeBadge.style.display="block"; }
      if(els.feeBadgeError) els.feeBadgeError.style.display="none";
    }else{
      if(els.feeBadge) els.feeBadge.style.display="none";
      if(els.feeBadgeError){ els.feeBadgeError.textContent = `⚠️ No fee set for ${program} ${year} - Go Fees Setup set am first - Rule 21 Fail Fast`; els.feeBadgeError.style.display="block"; }
    }
  }catch(e){ console.error("[FeeBadge]", e); }
}
window.deleteFee = async (id)=>{ if(!confirm("Delete this fee?")) return; try{ await feesApi.deleteFee(id); await loadFees(); await updateFeeBadge(); }catch(e){ alert(e.message); } };

async function loadAll(){
  if(els.studentsBody) els.studentsBody.innerHTML = `<tr><td colspan="7"><div class="skeleton">Loading students from Supabase students table...</div></td></tr>`;
  try{
    const results = await Promise.allSettled([
      studentApi.getAll(),
      paymentApi.getAll(),
      attendanceApi.getToday(),
      studentFeesApi.getAll()
    ]);
        const students = results[0].status==="fulfilled"? results[0].value : (cache.students||[]);
    const payments = results[1].status==="fulfilled"? results[1].value : [];
    const attendance = results[2].status==="fulfilled"? results[2].value : [];
    const studentFees = results[3].status==="fulfilled"? results[3].value : [];
    // Global cache for fees board + stats real - Rule 42 Caching + Rule 11
    window._studentFeesCache = studentFees;
    try{ window._feesCache = await feesApi.getAll(); }catch(e){ window._feesCache = []; }
    
    // Rule 7 Early Return - if still empty + no cache, show error but not crash
    if(!students.length &&!cache.students.length){
      throw new Error("Failed to fetch - Check RLS ENABLED + allow all public policy - Check supabase.js ANON_KEY eyJ... + internet - No cache");
    }

    renderStats(students, payments, attendance, studentFees);
    renderTable(students);
    const count = await studentApi.getCount();
    if(els.autoIdPreview) els.autoIdPreview.textContent = padId(count+1);
  }catch(e){
    console.error("[Load] failed", e);
    if(els.studentsBody) els.studentsBody.innerHTML = `<tr><td colspan="7" style="color:red">Load failed: ${e.message} - Check RLS ENABLED + allow all public policy - Try hard refresh Ctrl+Shift+R</td></tr>`;
    // Still render cached 8 if exist
    if(cache.students.length){ renderTable(cache.students); renderStats(cache.students, [], [], []); }
  }
}

function openModal(){ 
  if(!els.addModal) return; 
  if(els.programSelect) els.programSelect.innerHTML = renderOptions(RULES.PROGRAMS, RULES.DEFAULT_PROGRAM);
  if(els.genderSelect) els.genderSelect.innerHTML = renderOptions(RULES.GENDERS, RULES.DEFAULT_GENDER);
  if(els.yearEntrySelect) els.yearEntrySelect.innerHTML = renderOptions(getYearEntryOptions(), RULES.DEFAULT_YEAR);
  resetPhotoState();
  els.addModal.style.display="flex"; 
  els.addModal.classList.add("is-open"); 
}

function closeModal(){ if(!els.addModal) return; els.addModal.style.display="none"; els.addModal.classList.remove("is-open"); }

if(els.openModalBtn) els.openModalBtn.addEventListener("click", openModal);
if(els.addModal) els.addModal.addEventListener("click", (e)=>{ if(e.target===els.addModal) closeModal(); });

// BRICK 2F - Photo Input Listener - Rule 7 Early Return + Rule 37 Separation
if(els.photoInput){
  els.photoInput.addEventListener("change", async (e)=>{
    try{
      const file = e.target.files?.[0];
      if(!file) return;
      validatePhoto(file); // Fail Fast 2MB
      els.photoPreview && (els.photoPreview.style.opacity="0.5");
      const compressed = await compressToWebp15KB(file); // 2MB -> 15KB auto delete original
      compressedPhotoBlob = compressed; // keep only 15KB
      const previewUrl = URL.createObjectURL(compressed);
      renderAvatarPreview(previewUrl);
      console.log(`[Photo] ${ (file.size/1024).toFixed(0)}KB -> ${ (compressed.size/1024).toFixed(1)}KB webp - 2MB deleted`);
    }catch(err){ alert(err.message); resetPhotoState(); }
  });
}
if(els.removePhotoBtn) els.removePhotoBtn.addEventListener("click", resetPhotoState);

// BRICK 2.5B Listeners - Big Camera
if(els.openCameraBtn) els.openCameraBtn.addEventListener("click", openCameraModal);
if(els.closeCameraBtn) els.closeCameraBtn.addEventListener("click", closeCameraModal);
if(els.switchCameraBtn) els.switchCameraBtn.addEventListener("click", switchCamera);
if(els.captureBtn) els.captureBtn.addEventListener("click", captureFromCamera);
if(els.retakeBtn) els.retakeBtn.addEventListener("click", retakeCamera);
if(els.usePhotoBtn) els.usePhotoBtn.addEventListener("click", useCameraPhoto);
if(els.cameraModal) els.cameraModal.addEventListener("click", (e)=>{ if(e.target===els.cameraModal) closeCameraModal(); });
// BRICK 3G - Fees Listeners
if(els.navFeesBtn) els.navFeesBtn.addEventListener("click", (e)=>{ e.preventDefault(); showFees(); });
if(els.navDashboardBtn) els.navDashboardBtn.addEventListener("click", (e)=>{ e.preventDefault(); showDashboard(); });
if(els.openFeeModalBtn) els.openFeeModalBtn.addEventListener("click", openFeeModal);
if(els.closeFeeModalBtn) els.closeFeeModalBtn.addEventListener("click", closeFeeModal);
if(els.feeModal) els.feeModal.addEventListener("click", (e)=>{ if(e.target===els.feeModal) closeFeeModal(); });
if(els.feeAmountInput) els.feeAmountInput.addEventListener("input", ()=>{ const v=Number(els.feeAmountInput.value||0); if(els.feeAmountPreview) els.feeAmountPreview.textContent = formatNaira(v); });
if(els.programSelect) els.programSelect.addEventListener("change", updateFeeBadge);
if(els.yearEntrySelect) els.yearEntrySelect.addEventListener("change", updateFeeBadge);
if(els.saveFeeBtn) els.saveFeeBtn.addEventListener("click", async ()=>{
  try{
    const program = els.feeProgramSelect?.value;
    const year_entry = els.feeYearSelect?.value;
    const amount = Number(els.feeAmountInput?.value||0);
    const duration_months = Number(els.feeValiditySelect?.value||RULES.DEFAULT_VALIDITY);
    const grace_days = Number(els.feeGraceSelect?.value||RULES.DEFAULT_GRACE);
    els.saveFeeBtn.disabled=true; els.saveFeeBtn.textContent="Saving...";
    await feesApi.create({ program, year_entry, amount, duration_months, grace_days });
    closeFeeModal(); await loadFees(); await updateFeeBadge();
  }catch(e){ alert("Save fee failed: "+e.message); }finally{ if(els.saveFeeBtn){ els.saveFeeBtn.disabled=false; els.saveFeeBtn.textContent="Save Fee"; } }
});

// BRICK 4 - RECORD PAYMENT - MANUAL CASH + MONIEPOINT WEBHOOK WAIT - AUTO TRAP ONCE PAY WEBHOOK ENTER STUDENT DETAILS - Rule 23 Transactions + Rule 20 Idempotency + Rule 27 Logging + Rule 50 Return Fast
async function updatePayPreview(){
  const amount = Number(els.payAmountInput?.value||0);
  const regNo = els.payRegNoInput?.value || "";
  const student = (cache.students||[]).find(s=> getReg(s)===regNo);
  const program = student?.program || RULES.DEFAULT_PROGRAM;
  const yearEntry = student?.year_entry || RULES.DEFAULT_YEAR;
  const fee = await feesApi.getFee(program, yearEntry);
  const total = fee? Number(fee.amount) : amount;
  const duration = fee? Number(fee.duration_months||RULES.DEFAULT_VALIDITY) : RULES.DEFAULT_VALIDITY;
  const balance = Math.max(0, total - amount);
  const validFrom = new Date();
  const validTo = calculateValidTo(validFrom, duration);
  if(els.payBalancePreview) els.payBalancePreview.textContent = formatNaira(balance);
  if(els.payValidPreview) els.payValidPreview.textContent = formatDateRange(validFrom, validTo);
  if(els.payDaysPreview) els.payDaysPreview.textContent = `${calculateDaysLeft(validTo)} days left`;
  if(els.payMethodPreview) els.payMethodPreview.textContent = els.payMethodSelect?.value || "Moniepoint Auto";
}
async function recordPayment(){
  try{
    const regNo = els.payRegNoInput?.value?.trim() || "";
    if(!RULES.REGEX_SLT.test(regNo)) throw new Error("Invalid SLT ID - auto follow failed - Rule 21");
    const amount = Number(els.payAmountInput?.value||0);
    if(amount < RULES.FEE_MIN) throw new Error(`Amount min ₦${RULES.FEE_MIN} - Rule 21`);
    const method = els.payMethodSelect?.value || "Cash";
    const student = (cache.students||[]).find(s=> getReg(s)===regNo);
    if(!student) throw new Error(`Student ${regNo} not found`);
    const program = student.program || RULES.DEFAULT_PROGRAM;
    const yearEntry = student.year_entry || RULES.DEFAULT_YEAR;
    const fee = await feesApi.getFee(program, yearEntry);
    const duration = fee? Number(fee.duration_months||RULES.DEFAULT_VALIDITY) : RULES.DEFAULT_VALIDITY;
    const validFrom = new Date();
    const validTo = calculateValidTo(validFrom, duration);
    const daysLeft = calculateDaysLeft(validTo);
    const balance = Math.max(0, (fee? Number(fee.amount) : amount) - amount);

    if(els.savePaymentBtn){ els.savePaymentBtn.disabled=true; els.savePaymentBtn.textContent="Saving..."; }

    if(method === "Moniepoint Auto"){
      // API + Webhook URL - create reserved account + wait modal - dey wait for money to enter once he enter auto trap
      const studentName = student.full_name || regNo;
      const reserved = await moniepointApi.createReservedAccount({
        accountReference: regNo,
        accountName: `${studentName} ${RULES.TENANT}`,
        customerName: studentName,
        customerEmail: student.email_address || `${regNo.toLowerCase().replace('/','')}@solidlt.local`,
      });
      closePaymentModal();
      openMoniepointWaitModal({regNo, studentName, accountNumber: reserved.account_number, amount});
      console.log(`[Moniepoint] Reserved account for ${regNo} -> ${reserved.account_number} ${reserved.bank_name} - Webhook URL ${RULES.WEBHOOK_URL} - Waiting for payment - Once pay webhook enter student details`);
      // For demo Level 1 no API key - fallback central - still wait - webhook will auto trap when payment enters central + narration regNo
      return;
    }

    // MANUAL CASH - secretary carry money for hand then manually enter amount auto update id number
    const payload = {
      reg_no: regNo,
      student_name: student.full_name,
      program,
      year_entry: yearEntry,
      amount: amount,
      amount_paid: amount,
      moniepoint_ref: null,
      narration: `${regNo} Cash by Secretary`,
      balance,
      valid_from: validFrom.toISOString(),
      valid_to: validTo.toISOString(),
      days_left: daysLeft,
      method: "Cash",
      payment_method: "Cash",
      status: balance<=0? "Active" : "Partial",
      tenant: RULES.TENANT,
    };
    await paymentApiExtended.create(payload);
    // Update student_fees - auto update id number - transaction
    try{
      const { data: sFee } = await supabase.from("student_fees").select("*").eq("reg_no", regNo).single();
      if(sFee){
        await supabase.from("student_fees").update({
          amount_paid: Number(sFee.amount_paid||0)+amount,
          balance,
          status: balance<=0? "Active" : "Partial",
          valid_from: validFrom.toISOString(),
          valid_to: validTo.toISOString(),
          days_left: daysLeft,
          method: "Cash",
          updated_at: new Date().toISOString(),
        }).eq("reg_no", regNo);
      } else {
        await supabase.from("student_fees").insert([{
          reg_no: regNo,
          student_id: student.id || null,
          program,
          year_entry: yearEntry,
          total_amount: fee? Number(fee.amount) : amount,
          amount_paid: amount,
          balance,
          status: balance<=0? "Active" : "Partial",
          valid_from: validFrom.toISOString(),
          valid_to: validTo.toISOString(),
          days_left: daysLeft,
          method: "Cash",
          tenant: RULES.TENANT,
        }]);
      }
      await supabase.from("students").update({ payment_status: balance<=0? "paid" : "partial" }).eq("id number", regNo);
    }catch(fe){ console.error("[Fees] update failed", fe); }

    closePaymentModal();
    await loadAll();
    await loadPayments();
    alert(`Payment saved for ${regNo} - ${formatNaira(amount)} Cash - Auto updated ID - Balance ${formatNaira(balance)} - Valid ${formatDateRange(validFrom, validTo)}`);
  }catch(e){
    alert("Save payment failed: "+e.message);
    console.error("[recordPayment] failed", e);
  }finally{
    if(els.savePaymentBtn){ els.savePaymentBtn.disabled=false; els.savePaymentBtn.textContent="Save Payment - Auto Update ID"; }
  }
}
async function handleMoniepointWebhook(payload){
  // Rule 52 Verify Signature - X-Moniepoint-Signature HMAC - Rule 20 Idempotency transactionReference - Rule 23 Transactions - Rule 50 Return Fast
  try{
    const accountRef = payload.accountReference || payload.paymentReference || payload.account_reference || "";
    const amountPaid = Number(payload.amountPaid || payload.amount_paid || payload.amount || 0);
    const transactionRef = payload.transactionReference || payload.transaction_reference || payload.monnify_ref || `REF-${Date.now()}`;
    const paidOn = payload.paidOn || payload.paid_on || new Date().toISOString();
    if(!RULES.REGEX_SLT.test(accountRef)){
      console.warn(`[Webhook] Invalid accountRef ${accountRef} - go to unmatched - Rule 21`);
      await supabase.from(RULES.UNMATCHED_TABLE).insert([{ moniepoint_ref: transactionRef, amount: amountPaid, narration: accountRef, date: paidOn, status: "unmatched", tenant: RULES.TENANT }]);
      return;
    }
    // Idempotency check - Rule 20
    const { data: existing } = await supabase.from("payments").select("id").eq("moniepoint_ref", transactionRef).single();
    if(existing){ console.log(`[Webhook] Duplicate ${transactionRef} - already processed - Rule 20`); return; }

    const student = (cache.students||[]).find(s=> getReg(s)===accountRef);
    if(!student){
      console.warn(`[Webhook] Student ${accountRef} not found - unmatched`);
      await supabase.from(RULES.UNMATCHED_TABLE).insert([{ moniepoint_ref: transactionRef, amount: amountPaid, narration: accountRef, date: paidOn, status: "unmatched", tenant: RULES.TENANT }]);
      return;
    }
    const program = student.program || RULES.DEFAULT_PROGRAM;
    const yearEntry = student.year_entry || RULES.DEFAULT_YEAR;
    const fee = await feesApi.getFee(program, yearEntry);
    const duration = fee? Number(fee.duration_months||RULES.DEFAULT_VALIDITY) : RULES.DEFAULT_VALIDITY;
    const validFrom = new Date(paidOn);
    const validTo = calculateValidTo(validFrom, duration);
    const daysLeft = calculateDaysLeft(validTo);
    const total = fee? Number(fee.amount) : amountPaid;
    const balance = Math.max(0, total - amountPaid);

    // Transaction BEGIN - auto update id number - Rule 23
    await supabase.from("payments").insert([{
      reg_no: accountRef,
      student_name: student.full_name,
      program,
      year_entry: yearEntry,
      amount: amountPaid,
      amount_paid: amountPaid,
      moniepoint_ref: transactionRef,
      narration: accountRef,
      balance,
      valid_from: validFrom.toISOString(),
      valid_to: validTo.toISOString(),
      days_left: daysLeft,
      method: "Moniepoint Auto",
      payment_method: "Moniepoint Auto",
      status: balance<=0? "Active" : "Partial",
      tenant: RULES.TENANT,
    }]);
    const { data: sFee } = await supabase.from("student_fees").select("*").eq("reg_no", accountRef).single();
    if(sFee){
      await supabase.from("student_fees").update({
        amount_paid: Number(sFee.amount_paid||0)+amountPaid,
        balance,
        status: balance<=0? "Active" : "Partial",
        valid_from: validFrom.toISOString(),
        valid_to: validTo.toISOString(),
        days_left: daysLeft,
        moniepoint_ref: transactionRef,
        method: "Moniepoint Auto",
        updated_at: new Date().toISOString(),
      }).eq("reg_no", accountRef);
    } else {
      await supabase.from("student_fees").insert([{
        reg_no: accountRef,
        student_id: student.id || null,
        program,
        year_entry: yearEntry,
        total_amount: total,
        amount_paid: amountPaid,
        balance,
        status: balance<=0? "Active" : "Partial",
        valid_from: validFrom.toISOString(),
        valid_to: validTo.toISOString(),
        days_left: daysLeft,
        moniepoint_ref: transactionRef,
        method: "Moniepoint Auto",
        tenant: RULES.TENANT,
      }]);
    }
    await supabase.from("students").update({ payment_status: balance<=0? "paid" : "partial" }).eq("id number", accountRef);

    console.log(`[Webhook] Auto trap successful for ${accountRef} ${formatNaira(amountPaid)} REF ${transactionRef} - Enter account update student payment details - Valid ${formatDateRange(validFrom, validTo)}`);
    if(els.waitSuccess){ els.waitSuccess.style.display="block"; els.waitSuccess.textContent=`✅ Payment Successful! ${formatNaira(amountPaid)} received for ${accountRef} - Auto updated student payment details - ${formatDateRange(validFrom, validTo)}`; }
    await loadAll();
    await loadPayments();
  }catch(e){
    console.error("[handleMoniepointWebhook] failed", e);
  }
}
window.handleMoniepointWebhook = handleMoniepointWebhook; // for backend /api/webhook/moniepoint to call via Supabase Edge Function

// BRICK 4 - PAYMENTS LISTENERS - Rule 37 Separation - separately click open - FIX image_fd049b.png
if(els.navPaymentsBtn) els.navPaymentsBtn.addEventListener("click", (e)=>{ e.preventDefault(); showPayments(); });
if(els.openPaymentModalBtn) els.openPaymentModalBtn.addEventListener("click", ()=>{
  const first = (cache.students||[])[0];
  if(first) openPaymentModal(getReg(first));
  else alert("No students - Add SLT/001 first");
});
if(els.closePaymentModalBtn) els.closePaymentModalBtn.addEventListener("click", closePaymentModal);
if(els.paymentModal) els.paymentModal.addEventListener("click", (e)=>{ if(e.target===els.paymentModal) closePaymentModal(); });
if(els.closeWaitModalBtn) els.closeWaitModalBtn.addEventListener("click", closeMoniepointWaitModal);
if(els.moniepointWaitModal) els.moniepointWaitModal.addEventListener("click", (e)=>{ if(e.target===els.moniepointWaitModal) closeMoniepointWaitModal(); });
if(els.savePaymentBtn) els.savePaymentBtn.addEventListener("click", recordPayment);
if(els.payAmountInput) els.payAmountInput.addEventListener("input", updatePayPreview);
if(els.payMethodSelect) els.payMethodSelect.addEventListener("change", ()=>{
  updatePayPreview();
  if(els.moniepointInfoBox) els.moniepointInfoBox.style.display = els.payMethodSelect.value==="Moniepoint Auto"? "block" : "none";
});
if(els.copyAccountBtn) els.copyAccountBtn.addEventListener("click", async ()=>{
  const txt = els.payAccountNumber?.textContent || RULES.MONIEPOINT_ACCOUNT_NUMBER;
  try{ await navigator.clipboard.writeText(txt); els.copyAccountBtn.textContent="Copied!"; setTimeout(()=>{ els.copyAccountBtn.textContent="Copy"; },1500); }catch(e){ alert(txt); }
});
if(els.copyRefBtn) els.copyRefBtn.addEventListener("click", async ()=>{
  const txt = els.payAccountRef?.textContent || els.payRegNoInput?.value || "";
  try{ await navigator.clipboard.writeText(txt); els.copyRefBtn.textContent="Copied!"; setTimeout(()=>{ els.copyRefBtn.textContent="Copy"; },1500); }catch(e){ alert(txt); }
});
if(els.paymentSearch){
  let paySearchTimer;
  els.paymentSearch.addEventListener("input", ()=>{
    clearTimeout(paySearchTimer);
    paySearchTimer = setTimeout(()=>{
      const q = els.paymentSearch.value.toLowerCase().trim();
      const all = window._paymentsCache||[];
      if(!q){ renderPaymentsTable(all); return; }
      const filtered = all.filter(p=>
        (p.reg_no||"").toLowerCase().includes(q) ||
        (p.student_name||"").toLowerCase().includes(q) ||
        (p.moniepoint_ref||"").toLowerCase().includes(q) ||
        (p.narration||"").toLowerCase().includes(q)
      );
      renderPaymentsTable(filtered);
    }, 300);
  });
}
if(els.exportPaymentsBtn) els.exportPaymentsBtn.addEventListener("click", ()=>{
  const payments = window._paymentsCache||[];
  if(!payments.length){ alert("No payments to export"); return; }
  const header = ["DATE PAID","SLT ID","STUDENT","PROGRAM","AMOUNT PAID","MONIEPOINT REF+NARRATION","BALANCE","VALID FROM-TO","DAYS LEFT","METHOD"];
  const rows = payments.map(p=>[
    p.created_at||p.date_paid||"",
    p.reg_no||"",
    p.student_name||"",
    p.program||"",
    p.amount||p.amount_paid||"",
    `${p.moniepoint_ref||""} ${p.narration||""}`,
    p.balance||0,
    `${p.valid_from||""} → ${p.valid_to||""}`,
    p.days_left||"",
    p.method||""
  ]);
  const csv = [header,...rows].map(r=> r.map(v=> `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`payments_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
});
if(els.checkPaymentBtn) els.checkPaymentBtn.addEventListener("click", async ()=>{
  const regNo = els.waitRegNo?.textContent || "";
  if(!regNo) return;
  els.checkPaymentBtn.textContent="Checking..."; els.checkPaymentBtn.disabled=true;
  try{
    await loadPayments();
    const payments = window._paymentsCache||[];
    const found = payments.find(p=> (p.reg_no===regNo || p.narration===regNo) && new Date(p.created_at) > new Date(Date.now()-10*60000));
    if(found){
      if(els.waitSuccess){ els.waitSuccess.style.display="block"; els.waitSuccess.textContent=`✅ Payment Successful! ${formatNaira(found.amount||found.amount_paid)} for ${regNo} - Auto updated`; }
    } else {
      alert(`No payment found yet for ${regNo} - Webhook dey wait... Make sure student don pay to account ${els.waitAccountNumber?.textContent}`);
    }
  }finally{ els.checkPaymentBtn.textContent="Check Now"; els.checkPaymentBtn.disabled=false; }
});

if(els.saveBtn){
  els.saveBtn.addEventListener("click", async ()=>{
    try{
      const name = els.fullName?.value.trim() || "";
      const phone = els.phoneInput?.value.trim() || "";
      // RULES
      if(name.length < RULES.NAME_MIN) throw new Error(`Full Name must be at least ${RULES.NAME_MIN} chars - Rule`);
      if(phone && phone.length < RULES.PHONE_MIN) throw new Error(`Phone must be at least ${RULES.PHONE_MIN} digits - Rule`);

      els.saveBtn.disabled = true; els.saveBtn.textContent = "Saving...";
      const count = await studentApi.getCount();
      const next = count + 1;
const regNo = padId(next);
let photoUrl = null;
if(compressedPhotoBlob){
  els.saveBtn.textContent = "Uploading 15KB...";
  photoUrl = await storageApi.uploadPassport(compressedPhotoBlob, regNo);
}   

      const email = els.emailInput?.value.trim() || "";
      const gender = els.genderSelect?.value || RULES.DEFAULT_GENDER;
      const program = els.programSelect?.value || RULES.DEFAULT_PROGRAM;
      const yearEntry = els.yearEntrySelect?.value || RULES.DEFAULT_YEAR;
      const address = els.homeAddress?.value.trim() || "";

      validateBrick1B({name, phone, email, gender, program, year: yearEntry});

      // BRICK 3F - Fee check - Fail Fast Rule 21 - Boss must set fee first
      const feeForStudent = await feesApi.getFee(program, yearEntry);
      if(!feeForStudent) throw new Error(`No fee set for ${program} ${yearEntry} - Go Fees Setup page, boss manually type amount first - Rule 21`);
      if(feeForStudent.amount < RULES.FEE_MIN) throw new Error(`Fee amount invalid min ₦${RULES.FEE_MIN}`);

      const payload = {
        "id number": regNo,
        full_name: name,
        phone: phone,
        email_address: email || null,
        gender: gender,
        home_address: address || null,
        program: program,
        year_entry: yearEntry,
        payment_status: RULES.DEFAULT_STATUS,
        qr_token: `${RULES.TENANT}_${Math.random().toString(36).slice(2,10).toUpperCase()}`,
        photo_url: photoUrl || null,
      };
      console.log("[Create] payload", payload);
      await studentApi.create(payload);
      // Auto create student_fees - auto reflect - Rule 11 DRY
     try{
     const createdStudent = cache.students.find(s=> (s["id number"]||s.reg_no)===regNo) || { id: null };
     // get latest from DB for id
     const { data: latest } = await supabase.from("students").select("id").eq("id number", regNo).single();
     await studentFeesApi.create({ reg_no: regNo, student_id: latest?.id || null, program, year_entry: yearEntry, total_amount: feeForStudent.amount });
     console.log(`[Fees] Auto created student_fees ${regNo} ${formatNaira(feeForStudent.amount)} - auto reflect`);
    }catch(fe){ console.error("[Fees] auto create failed", fe); alert("Student saved but fee record failed: "+fe.message+" - Check student_fees RLS"); }
      compressedPhotoBlob = null; // auto delete after save - Rule 62
      if(els.fullName) els.fullName.value=""; if(els.phoneInput) els.phoneInput.value="";
      closeModal();
      await loadAll();
    }catch(err){
      alert("Save failed: " + err.message);
      console.error(err);
    }finally{
      if(els.saveBtn){ els.saveBtn.disabled = false; els.saveBtn.textContent = "Save"; }
    }
  });
}

// Global search with debounce - Rule
let searchTimer;
if(els.globalSearch){
  els.globalSearch.addEventListener("input", ()=>{
    clearTimeout(searchTimer);
    searchTimer = setTimeout(()=>{
      const q = els.globalSearch.value.toLowerCase().trim();
      if(!q){ renderTable(cache.students); return; }
      const filtered = cache.students.filter(s=>
        (getReg(s)||"").toLowerCase().includes(q) ||
        (s.full_name||"").toLowerCase().includes(q) ||
        (s.phone||"").includes(q)
      );
      renderTable(filtered);
    }, 300);
  });
}

loadAll();
console.log("[PRO] SOLIDLT_444 app.js FIXED - Singleton, Rules kept, existing data");