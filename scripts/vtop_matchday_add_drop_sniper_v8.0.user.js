// ==UserScript==
// @name         VTOP FFCS Match-Day Add & Drop Pre-Armed Lightning Sniper & Atomic Re-Obtain (v8.0)
// @namespace    https://vtopregcc.vit.ac.in/
// @version      8.0 - Match Day Atomic Method C Sniper & Rollback Guardian
// @description  Zero-latency pre-armed micro-burst sniper with Atomic Method C (Drop-Peek-Swap), Triple Rollback Defense, and Auto-SignIn Guardian.
// @author       Antigravity
// @match        https://vtopregcc.vit.ac.in/MockRegistration/*
// @match        https://vtopregcc.vit.ac.in/CourseRegistration/*
// @match        https://vtopregcc.vit.ac.in/LiveRegistration/*
// @match        https://vtopregcc.vit.ac.in/LiveRegistration
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // =========================================================================
  // CONFIGURATION & CREDENTIALS
  // =========================================================================
  const CONFIG = {
    username: "YOUR_VTOP_USERNAME",
    password: "YOUR_VTOP_PASSWORD",
    autoLogin: true,
    radarIntervalMs: 650, // 650ms micro-burst pulse
    keepAliveIntervalMs: 45000 // 45 seconds heartbeat
  };

  // =========================================================================
  // 1. ACTIVE PORTFOLIO & PRE-ARMED ROLLBACK BUFFERS
  // =========================================================================
  const HELD_COURSES = {
    "BACSE203": {
      name: "Computer Networks",
      courseId: "CH_BACSE203_00100",
      code: "BACSE203",
      type: "ETL",
      slot: "B2+TB2",
      cat: "PCC",
      heldProf: "SRIMATHI C",
      theoryClassId: "CH2026270501543",
      labClassId: "CH2026270501544",
      clash: "B2/L13/L14/L37/L38/L49/L50/TB2",
      isLocked: false,
      dreamProfs: [
        { name: "MONICA K M", erp: "51578", theoryClassId: "CH2026270501545", labClassId: "CH2026270501546", slot: "B2+TB2", labSlot: "L37+L38" },
        { name: "MONICA K M", erp: "51578", theoryClassId: "CH2026270501547", labClassId: "CH2026270501548", slot: "B2+TB2", labSlot: "L49+L50" }
      ]
    },
    "BACSE205": {
      name: "Fundamentals of AI & ML",
      courseId: "CH_BACSE205_00100",
      code: "BACSE205",
      type: "ETL",
      slot: "E2+TE2",
      cat: "PCC",
      heldProf: "DOMINIC SAVIO M",
      theoryClassId: "CH2026270501646",
      labClassId: "CH2026270501659",
      clash: "E2/L15/L16/L39/L40/L55/L56/TE2",
      isLocked: false,
      dreamProfs: [
        { name: "TAHIR MUJTABA", erp: "53896", theoryClassId: "CH2026270501648", labClassId: "CH2026270501661", slot: "E2+TE2", labSlot: "L39+L40" },
        { name: "SELLAM V", erp: "50800", theoryClassId: "CH2026270501650", labClassId: "CH2026270501663", slot: "E2+TE2", labSlot: "L55+L56" }
      ]
    },
    "BACSE324": {
      name: "Embedded Systems Architecture",
      courseId: "CH_BACSE324_00100",
      code: "BACSE324",
      type: "ETL",
      slot: "G2+TG2",
      cat: "CON",
      heldProf: "PUGAZHENTHI R",
      theoryClassId: "CH2026270502766",
      labClassId: "CH2026270502782",
      clash: "G2/L37/L38/L51/L52/L59/L60/TG2",
      isLocked: false,
      dreamProfs: [
        { name: "MANIMARAN A", erp: "52296", theoryClassId: "CH2026270502768", labClassId: "CH2026270502784", slot: "G2+TG2", labSlot: "L37+L38" },
        { name: "GUGA PRIYA G", erp: "51336", theoryClassId: "CH2026270502770", labClassId: "CH2026270502786", slot: "G2+TG2", labSlot: "L51+L52" }
      ]
    },
    "BACSE345": {
      name: "Cloud Automation Tools",
      courseId: "CH_BACSE345_00100",
      code: "BACSE345",
      type: "ETL",
      slot: "A2+TA2",
      cat: "CON",
      heldProf: "MEIGNANAMOORTHI D",
      theoryClassId: "CH2026270502844",
      labClassId: "CH2026270502854",
      clash: "A2/L21/L22/TA2",
      isLocked: true // Locked Evening Anchor
    },
    "BAMAT205": {
      name: "Discrete Mathematics & Linear Algebra",
      courseId: "CH_BAMAT205_00100",
      code: "BAMAT205",
      type: "TH",
      slot: "C2+TC2+TCC2",
      cat: "PCC",
      heldProf: "PROSENJIT PAUL",
      theoryClassId: "CH2026270500216",
      labClassId: "-",
      clash: "C2/L43/L44/L55/L56/TC2/TCC2",
      isLocked: true // 🏆 PROSENJIT PAUL IS GOATED (★4.73) - SACRED GROUND
    },
    "BAHUM111": {
      name: "Introduction to Psychology",
      courseId: "CH_BAHUM111_00100",
      code: "BAHUM111",
      type: "TH",
      slot: "D2+TD2",
      cat: "UCC",
      heldProf: "MAHARISHI R",
      theoryClassId: "CH2026270503445",
      labClassId: "-",
      clash: "D2/L33/L34/L49/L50/TD2",
      isLocked: true // 🎯 SECURED 24.0 Cr KEYSTONE - LOCKED
    },
    "BASTS102": {
      name: "Soft Skills Practice II",
      courseId: "CH_BASTS102_00100",
      code: "BASTS102",
      type: "SS",
      slot: "F2+TF2",
      cat: "ECC",
      heldProf: "SIXPHRASE (APT)",
      theoryClassId: "CH2026270503378",
      labClassId: "-",
      clash: "F2/TF2",
      isLocked: true // LOCKED
    }
  };

  // =========================================================================
  // 2. LOW-LATENCY NETWORKING ENGINE
  // =========================================================================
  const postForm = (url, body) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest"
      },
      body
    }).then(r => r.text()).catch(() => "");

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const seatsOf = radio => {
    if (!radio) return 0;
    const span = radio.parentElement?.querySelector('span');
    if (span) {
      const n = parseInt(span.textContent.trim(), 10);
      if (!isNaN(n)) return n;
    }
    const trText = radio.closest('tr')?.innerText || '';
    if (trText.includes("Full")) return 0;
    const m = trText.match(/(\d+)\s*$/);
    return m ? parseInt(m[1], 10) : 0;
  };

  // =========================================================================
  // 3. REGISTRATION SHOOTER
  // =========================================================================
  async function shootRegistration(classIdVal, courseId, courseCode, courseType, courseCat, clashSlotVal, log) {
    const params = new URLSearchParams({
      ClassID: classIdVal,
      courseId: courseId,
      courseType: courseType,
      courseCode: courseCode,
      courseCat: courseCat,
      courseOption: "RGR",
      clashSlot: clashSlotVal,
      pageSize: "10",
      page: "1",
      subCourseOption: "",
      subCourseType: "",
      subCourseDate: "",
      searchType: "",
      searchVal: "",
      clArr: "",
      epjSlotFlag: "",
      crCourseStatus: "",
      crCourseId: "",
      crCourseCode: "",
      crCourseType: "",
      crSubCourseOption: "",
      crSubCourseType: "",
      crSubCourseDate: "",
      null: "null"
    });

    log(`🚀 Booking request: ${courseCode} (${classIdVal})...`, "warn");
    const t0 = performance.now();
    const resp = await postForm("processRegisterCourse", params.toString());
    const dt = Math.round(performance.now() - t0);

    if (resp.includes("Registered and Approved") || resp.includes("Successfully Registered")) {
      log(`🎯 SUCCESS! ${courseCode} REGISTERED IN ${dt}ms!`, "success");
      return true;
    } else {
      const doc = new DOMParser().parseFromString(resp, "text/html");
      const err = doc.querySelector('.alert, #msg, .swal-title')?.innerText?.trim() || "Server rejected request";
      log(`❌ Failed (${dt}ms): ${err}`, "warn");
      return false;
    }
  }

  // =========================================================================
  // 4. EMERGENCY ROLLBACK GUARDIAN
  // =========================================================================
  async function executeRollback(held, log) {
    const heldClassIdStr = held.type === "ETL" ? `${held.theoryClassId},${held.labClassId},` : `${held.theoryClassId},,`;
    for (let attempt = 1; attempt <= 3; attempt++) {
      log(`🛡️ ROLLBACK ATTEMPT ${attempt}/3 for ${held.heldProf}...`, "warn");
      const ok = await shootRegistration(heldClassIdStr, held.courseId, held.code, held.type, held.cat, `${held.clash},`, log);
      if (ok) {
        log(`✅ ROLLBACK SECURED! Original seat with ${held.heldProf} is 100% SAFE!`, "success");
        return true;
      }
      await sleep(60);
    }
    log(`🚨 CRITICAL: Rollback failed 3 times! Check VTOP immediately!`, "warn");
    return false;
  }

  // =========================================================================
  // 5. ATOMIC METHOD C ENGINE (DROP-PEEK-SWAP)
  // =========================================================================
  let isMethodCRunning = false;

  async function executeAtomicMethodC(courseCode, log) {
    if (isMethodCRunning) {
      log("⏳ Another Method C sequence is currently in progress. Please wait.", "warn");
      return;
    }

    const held = HELD_COURSES[courseCode];
    if (!held) {
      log(`Unknown course code: ${courseCode}`, "warn");
      return;
    }

    if (held.isLocked) {
      log(`🛑 ${held.code} (${held.heldProf}) is LOCKED. Sacred ground cannot be dropped!`, "warn");
      return;
    }

    const targetProfNames = held.dreamProfs.map(p => p.name).join(" / ");
    const confirmMsg = `⚡ EXECUTE ATOMIC METHOD C FOR ${held.code}?\n\n` +
      `Currently Held: ${held.heldProf} (${held.slot})\n` +
      `Target Upgrade: ${targetProfNames}\n\n` +
      `The script will:\n` +
      `1. Drop ${held.heldProf} (~90ms)\n` +
      `2. Fetch live sections table (~120ms)\n` +
      `3. If target has seats: BOOK TARGET!\n` +
      `4. If target is FULL: INSTANT AUTO-ROLLBACK to ${held.heldProf}!\n\n` +
      `Total exposure time: ~280ms.\nProceed?`;

    if (!window.confirm(confirmMsg)) {
      log(`Method C cancelled by user for ${held.code}.`, "info");
      return;
    }

    isMethodCRunning = true;
    log(`⚡ [METHOD C] Starting Atomic Drop-Peek-Swap for ${held.code}...`, "pulse");
    const t0 = performance.now();

    try {
      // Step 1: Drop Held Course
      log(`🗑️ [1/3] Dropping ${held.heldProf} to expose catalog...`, "warn");
      const dropRes = await postForm("processDeleteConfirmationCourseRegistration", `courseId=${held.courseId}&mailOTP=A0A0A0&null=null`);
      const tDrop = Math.round(performance.now() - t0);
      log(`✓ Drop completed in ${tDrop}ms`, "pulse");

      // Step 2: Fetch Sections Catalog
      log(`📡 [2/3] Fetching live sections...`, "pulse");
      const catalogHtml = await postForm("processCourseRegistration", `courseId=${held.courseId}&page=1&pageSize=50&searchType=&searchVal=&null=null`);
      const tCat = Math.round(performance.now() - t0);

      if (!catalogHtml || catalogHtml.includes("SessionTimedOut")) {
        log(`🚨 CRITICAL: Session expired or invalid response! Firing Rollback NOW!`, "warn");
        await executeRollback(held, log);
        return;
      }

      // Step 3: Scan For Dream Teachers
      const doc = new DOMParser().parseFromString(catalogHtml, "text/html");
      let selectedDream = null;
      let selectedRadio = null;

      for (const dream of held.dreamProfs) {
        let radio = doc.querySelector(`input[name="classnbr1"][data-parameter2="${dream.erp}"]`);
        if (!radio && dream.theoryClassId) {
          radio = doc.querySelector(`input[name="classnbr1"][value="${dream.theoryClassId}"]`);
        }
        if (radio && seatsOf(radio) > 0) {
          selectedDream = dream;
          selectedRadio = radio;
          break;
        }
      }

      if (selectedDream && selectedRadio) {
        // DREAM TEACHER HAS AVAILABLE SEATS!
        const seatsFound = seatsOf(selectedRadio);
        log(`🔥 DREAM FOUND! ${selectedDream.name} has ${seatsFound} seat(s)! Shooting booking...`, "success");
        const dreamClassIdStr = held.type === "ETL" ? `${selectedDream.theoryClassId},${selectedDream.labClassId},` : `${selectedDream.theoryClassId},,`;
        const ok = await shootRegistration(dreamClassIdStr, held.courseId, held.code, held.type, held.cat, `${held.clash},`, log);
        const totalMs = Math.round(performance.now() - t0);

        if (ok) {
          log(`🏆🏆 METHOD C TRIUMPH! Successfully swapped to ${selectedDream.name} in ${totalMs}ms!`, "success");
          held.heldProf = selectedDream.name;
          held.theoryClassId = selectedDream.theoryClassId;
          held.labClassId = selectedDream.labClassId;
          return;
        } else {
          log(`⚠️ Dream booking rejected by VTOP. Reverting to original professor...`, "warn");
          await executeRollback(held, log);
        }
      } else {
        // TARGET IS FULL - EXECUTE INSTANT ROLLBACK
        log(`🛡️ Target full (0 seats). Reclaiming original seat with ${held.heldProf}...`, "warn");
        await executeRollback(held, log);
      }

      const totalMs = Math.round(performance.now() - t0);
      log(`⚡ Method C cycle completed in ${totalMs}ms.`, "info");
    } catch (err) {
      log(`🚨 Error during Method C: ${err.message}. Firing emergency rollback!`, "warn");
      await executeRollback(held, log);
    } finally {
      isMethodCRunning = false;
    }
  }

  // =========================================================================
  // 6. AUTO-SIGN IN & KEEP-ALIVE GUARDIAN
  // =========================================================================
  function initGuardian(log) {
    // Session Keep-Alive Heartbeat every 45s
    setInterval(async () => {
      if (window.location.pathname.includes("LiveRegistration") && !document.getElementById("loginButton")) {
        try {
          await postForm("processCourseRegistration", "courseId=CH_BAMAT205_00100&page=1&pageSize=1&searchType=&searchVal=&null=null");
          log(`💓 Session keep-alive ping sent. Active!`, "pulse");
        } catch (e) {}
      }
    }, CONFIG.keepAliveIntervalMs);

    // Auto-Sign In on Login Screen
    const loginBtn = document.getElementById("loginButton");
    const userInp = document.getElementById("username");
    const passInp = document.getElementById("password");
    const captchaInp = document.getElementById("captchaString");

    if (loginBtn && userInp) {
      userInp.value = CONFIG.username;
      passInp.value = CONFIG.password;

      // Auto-submit instantly when 6 captcha characters are entered
      captchaInp.addEventListener("input", () => {
        if (captchaInp.value.trim().length === 6) {
          setTimeout(() => loginBtn.click(), 100);
        }
      });
      captchaInp.focus();
    }
  }

  // =========================================================================
  // 7. MATCH DAY HUD INTERFACE (v8.0)
  // =========================================================================
  function mountHUD() {
    if (document.getElementById("vtop-matchday-hud")) {
      document.getElementById("vtop-matchday-hud").remove();
    }

    const hud = document.createElement("div");
    hud.id = "vtop-matchday-hud";
    hud.innerHTML = `
      <div id="vtop-md-header">
        <span>⚡ VTOP Atomic Method C Sniper (v8.0)</span>
        <button id="vtop-md-toggle">—</button>
      </div>
      <div id="vtop-md-body">
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 2px;">
            <span style="color: #4ade80;">🟢 24.0 / 24.0 Cr SECURED</span>
            <span style="color: #38bdf8;">Evening Slots Locked</span>
          </div>
          <div style="color: #94a3b8; font-size: 10px;">Discrete Math & Intro Psych are LOCKED Sacred Ground.</div>
        </div>

        <div style="margin-bottom: 8px;">
          <div style="font-size: 10px; color: #a1a1aa; font-weight: bold; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
            ⚡ 1-Click Atomic Method C Triggers:
          </div>
          <button id="vtop-btn-swap-net" style="width: 100%; background: #2563eb; color: white; padding: 7px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; margin-bottom: 4px; font-size: 11px; text-align: left; display: flex; justify-content: space-between;">
            <span>🌐 NETWORKS (BACSE203)</span>
            <span style="background: #1d4ed8; padding: 1px 6px; border-radius: 3px;">➔ MONICA K M</span>
          </button>
          <button id="vtop-btn-swap-ai" style="width: 100%; background: #4f46e5; color: white; padding: 7px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; margin-bottom: 4px; font-size: 11px; text-align: left; display: flex; justify-content: space-between;">
            <span>🤖 AI & ML (BACSE205)</span>
            <span style="background: #4338ca; padding: 1px 6px; border-radius: 3px;">➔ TAHIR MUJTABA</span>
          </button>
          <button id="vtop-btn-swap-esa" style="width: 100%; background: #0891b2; color: white; padding: 7px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; margin-bottom: 4px; font-size: 11px; text-align: left; display: flex; justify-content: space-between;">
            <span>⚡ EMBEDDED (BACSE324)</span>
            <span style="background: #0e7490; padding: 1px 6px; border-radius: 3px;">➔ MANIMARAN A</span>
          </button>
        </div>

        <div id="vtop-md-term" style="height: 140px; background: #000; border: 1px solid #18181b; border-radius: 6px; overflow-y: auto; padding: 8px; font-family: monospace; font-size: 11px; line-height: 1.4;"></div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #vtop-matchday-hud {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 460px;
        background: #09090b;
        color: #f4f4f5;
        border: 1px solid #27272a;
        border-radius: 10px;
        box-shadow: 0 12px 35px rgba(0,0,0,0.85);
        z-index: 9999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      }
      #vtop-md-header {
        background: #18181b;
        padding: 10px 14px;
        font-size: 12px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 9px;
        border-top-right-radius: 9px;
        border-bottom: 1px solid #27272a;
      }
      #vtop-md-header button { background: none; border: none; color: #a1a1aa; cursor: pointer; font-size: 14px; }
      #vtop-md-body { padding: 12px; }
      .t-info { color: #38bdf8; }
      .t-pulse { color: #71717a; font-size: 10px; }
      .t-success { color: #4ade80; font-weight: bold; }
      .t-warn { color: #fbbf24; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(hud);

    const term = document.getElementById("vtop-md-term");
    function log(msg, type = "info") {
      const line = document.createElement("div");
      line.className = `t-${type}`;
      line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
      term.appendChild(line);
      if (term.childNodes.length > 80) term.removeChild(term.firstChild);
      term.scrollTop = term.scrollHeight;
    }

    const minBtn = document.getElementById("vtop-md-toggle");
    const body = document.getElementById("vtop-md-body");
    minBtn.addEventListener("click", () => {
      body.style.display = body.style.display === "none" ? "block" : "none";
      minBtn.textContent = body.style.display === "none" ? "+" : "—";
    });

    document.getElementById("vtop-btn-swap-net").addEventListener("click", () => executeAtomicMethodC("BACSE203", log));
    document.getElementById("vtop-btn-swap-ai").addEventListener("click", () => executeAtomicMethodC("BACSE205", log));
    document.getElementById("vtop-btn-swap-esa").addEventListener("click", () => executeAtomicMethodC("BACSE324", log));

    initGuardian(log);
    log("VTOP Match-Day Sniper v8.0 active.", "info");
    log("Atomic Method C pre-armed with Triple-Rollback Defense.", "pulse");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHUD);
  } else {
    mountHUD();
  }
})();
