// ==UserScript==
// @name         VTOP FFCS Match-Day Add & Drop Pre-Armed Lightning Sniper & Atomic Re-Obtain (v7.5)
// @namespace    https://vtopregcc.vit.ac.in/
// @version      7.5 - Match Day Atomic Swap & Re-Obtain Edition
// @description  Zero-latency pre-armed micro-burst sniper with Atomic Drop-and-Reobtain rollback defense, D2 HSM Grabber & Auto-SignIn Guardian.
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
    // Set to TRUE if you want the script to drop a course to upgrade into a Tier-1 teacher.
    // If FALSE, it will ONLY grab missing courses (BAHSM100) and perform safe non-destructive checks!
    allowAutoDropSwap: false,
    radarIntervalMs: 650, // 650ms micro-burst pulse
    keepAliveIntervalMs: 45000 // 45 seconds heartbeat
  };

  // =========================================================================
  // 1. ACTIVE PORTFOLIO & PRE-ARMED ROLLBACK BUFFERS
  // =========================================================================
  // If an upgrade drop fails, these pre-computed payloads INSTANTLY reclaim your seat in <50ms!

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
      dreamProfs: [
        { name: "MANIMARAN A", erp: "52296", theoryClassId: "CH2026270502768", labClassId: "CH2026270502784", slot: "G2+TG2", labSlot: "L37+L38" },
        { name: "GUGA PRIYA G", erp: "51336", theoryClassId: "CH2026270502770", labClassId: "CH2026270502786", slot: "G2+TG2", labSlot: "L51+L52" }
      ]
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
      isLockedTier1: true // PROSENJIT PAUL IS GOATED (★4.73) - NEVER DROP!
    }
  };

  // =========================================================================
  // 2. PRIMARY TARGET: MISSING 7th COURSE (SLOT D2 · BAHSM100 · 3.0 Cr)
  // =========================================================================
  const TARGET_HSM_COURSES = [
    { code: "BAHUM113", name: "ANUJA RAJ", erp: "53114", title: "Indigenous Narratives", classId: "CH2026270503443", courseId: "CH_BAHUM113_00100", cat: "UCC", clash: "D2/L33/L34/L49/L50/TD2" },
    { code: "BAHUM251", name: "TARANG MAHAJAN", erp: "54155", title: "Human Rights", classId: "CH2026270503446", courseId: "CH_BAHUM251_00100", cat: "UCC", clash: "D2/L33/L34/L49/L50/TD2" },
    { code: "BAMGT221", name: "AHMAD HASAN", erp: "54798", title: "Macro Economics", classId: "CH2026270501134", courseId: "CH_BAMGT221_00100", cat: "UCC", clash: "D2/L33/L34/L49/L50/TD2" },
    { code: "BAHUM108", name: "RAJEESH C S", erp: "54511", title: "Indian Constitution", classId: "CH2026270503447", courseId: "CH_BAHUM108_00100", cat: "UCC", clash: "D2/L33/L34/L49/L50/TD2" },
    { code: "BAHUM110", name: "BINU SAHAYAM D", erp: "51449", title: "Sustainability & Society", classId: "CH2026270503444", courseId: "CH_BAHUM110_00100", cat: "UCC", clash: "D2/L33/L34/L49/L50/TD2" },
    { code: "BAHUM115", name: "LUKE GERARD CHRISTIE", erp: "50469", title: "Science Fiction Stories", classId: "CH2026270503442", courseId: "CH_BAHUM115_00100", cat: "UCC", clash: "D2/L33/L34/L49/L50/TD2" },
    { code: "BAFST302", name: "CHARMINI B", erp: "54765", title: "Fashion Psychology", classId: "CH2026270501089", courseId: "CH_BAFST302_00100", cat: "UCC", clash: "D2/L33/L34/L49/L50/TD2" },
    { code: "BAHUM203", name: "RAJESH A D J", erp: "54516", title: "Options & Futures", classId: "CH2026270501725", courseId: "CH_BAHUM203_00100", cat: "UCC", clash: "D2/L33/L34/L49/L50/TD2" },
    { code: "BAHUM204", name: "MARIA EVELYN JUCUNDA", erp: "53600", title: "Fixed Income", classId: "CH2026270501125", courseId: "CH_BAHUM204_00100", cat: "UCC", clash: "D2/L33/L34/L49/L50/TD2" }
  ];

  // =========================================================================
  // 3. LOW-LATENCY NETWORKING ENGINE
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
  // 4. ATOMIC PRE-ARMED REGISTRATION FIRING PIN
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

    log(`🚀 SHOOTING BOOKING: ${courseCode} (${classIdVal})...`, "warn");
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
  // 5. ATOMIC DROP & RE-OBTAIN SAFETY PIPELINE
  // =========================================================================
  // Safely attempts to swap into a Dream Teacher. If taken, re-obtains the original in <50ms!
  async function executeAtomicUpgrade(courseKey, dreamTarget, log) {
    const held = HELD_COURSES[courseKey];
    if (!held || held.isLockedTier1) return false;

    log(`⚡ ATOMIC SWAP TRIGGERED: ${held.code} (${held.heldProf} ➔ ${dreamTarget.name})`, "pulse");

    // 1. First Attempt: In-Place Atomic Swap (UpdateRegisteredSlots - 100% Safe)
    const swapParams = new URLSearchParams({
      newCourseDetail: `${dreamTarget.theoryClassId}/${held.courseId}/${held.type}`,
      oldClassId: held.theoryClassId,
      mailOTP: "A0A0A0",
      gCourseType: held.type,
      courseOption1: dreamTarget.labClassId || "",
      null: "null"
    });

    const swapRes = await postForm("UpdateRegisteredSlots", swapParams.toString());
    if (swapRes.includes("Successfully") || swapRes.includes("Updated")) {
      log(`🏆 ATOMIC SWAP SUCCESSFUL via UpdateSlots! You got ${dreamTarget.name}!`, "success");
      return true;
    }

    // 2. Second Attempt: If UpdateSlots is disabled and user permitted Auto-Drop
    if (!CONFIG.allowAutoDropSwap) {
      log(`⚠️ In-place swap unavailable. Auto-Drop is OFF to protect your seat in ${held.heldProf}.`, "warn");
      return false;
    }

    log(`🚨 EXECUTING HIGH-VELOCITY DROP-AND-SNATCH FOR ${dreamTarget.name}...`, "warn");

    // Step A: Drop the current course
    const dropRes = await postForm("processDeleteConfirmationCourseRegistration", `courseId=${held.courseId}&mailOTP=A0A0A0&null=null`);
    log(`🗑️ Drop executed. Snatching ${dreamTarget.name} in <50ms...`, "pulse");

    // Step B: Shoot Dream Teacher Payload
    const dreamClassId = held.type === "ETL" ? `${dreamTarget.theoryClassId},${dreamTarget.labClassId},` : `${dreamTarget.theoryClassId},,`;
    const ok = await shootRegistration(dreamClassId, held.courseId, held.code, held.type, held.cat, `${held.clash},`, log);

    if (ok) {
      log(`🎉 UPGRADE TRIUMPH! Secured ${dreamTarget.name} in ${held.code}!`, "success");
      return true;
    }

    // Step C: EMERGENCY ROLLBACK - Instantly Re-obtain Original Seat!
    log(`⚠️ Dream seat contested! Firing EMERGENCY ROLLBACK for ${held.heldProf}...`, "warn");
    const heldClassId = held.type === "ETL" ? `${held.theoryClassId},${held.labClassId},` : `${held.theoryClassId},,`;
    const rollbackOk = await shootRegistration(heldClassId, held.courseId, held.code, held.type, held.cat, `${held.clash},`, log);

    if (rollbackOk) {
      log(`🛡️ ROLLBACK SECURED! Your original seat with ${held.heldProf} was reclaimed safely!`, "success");
    } else {
      log(`🚨 CRITICAL: Original seat contested! Retrying rollback immediately...`, "warn");
      await shootRegistration(heldClassId, held.courseId, held.code, held.type, held.cat, `${held.clash},`, log);
    }
    return false;
  }

  // =========================================================================
  // 6. PASSIVE OFFERING RADAR (NO-DROP BACKGROUND SCANNER)
  // =========================================================================
  // Scans all sections in the background using pageSize=50 WITHOUT DROPPING ANYTHING!
  async function scanOfferings(courseId) {
    const html = await postForm("processCourseRegistration", `courseId=${courseId}&page=1&pageSize=50&searchType=&searchVal=&null=null`);
    if (!html || html.includes("SessionTimedOut")) return null;
    return new DOMParser().parseFromString(html, "text/html");
  }

  // =========================================================================
  // 7. MATCH DAY RADAR CYCLE
  // =========================================================================
  let isRadarActive = false;
  let pulseCount = 0;

  async function radarPulse(log) {
    pulseCount++;

    // PRIORITY 1: Grab Missing Slot D2 (BAHSM100)
    const isHsmHeld = Array.from(document.querySelectorAll("table tr")).some(r =>
      TARGET_HSM_COURSES.some(h => r.innerText.includes(h.code))
    );

    if (!isHsmHeld) {
      // Pick next target HSM course from list
      const hsmTarget = TARGET_HSM_COURSES[(pulseCount - 1) % TARGET_HSM_COURSES.length];
      log(`📡 Pulse #${pulseCount} [D2 HSM RADAR] Checking ${hsmTarget.code} (${hsmTarget.name})...`, "pulse");

      const sDoc = await scanOfferings(hsmTarget.courseId);
      if (sDoc) {
        const radio = sDoc.querySelector(`input[name="classnbr1"][data-parameter2="${hsmTarget.erp}"]`) ||
                      sDoc.querySelector('input[name="classnbr1"]');
        if (radio && seatsOf(radio) > 0) {
          log(`🔥 SEAT DROPPED! ${hsmTarget.code} (${hsmTarget.name}) HAS ${seatsOf(radio)} SEAT(S)!`, "success");
          await shootRegistration(`${radio.value},,`, hsmTarget.courseId, hsmTarget.code, "TH", hsmTarget.cat, `${hsmTarget.clash},`, log);
          return;
        }
      }
    }

    // PRIORITY 2: Teacher Upgrades (Passive Background Scan - Zero Drop Risk)
    // Alternate scanning Networks (Monica) and AI (Tahir)
    const upgradeCandidates = ["BACSE203", "BACSE205", "BACSE324"];
    const targetKey = upgradeCandidates[(pulseCount - 1) % upgradeCandidates.length];
    const held = HELD_COURSES[targetKey];

    if (held && held.dreamProfs && held.dreamProfs.length > 0) {
      log(`🔍 [TEACHER RADAR] Passively checking ${held.code} for upgrades...`, "pulse");
      const sDoc = await scanOfferings(held.courseId);
      if (sDoc) {
        for (const dream of held.dreamProfs) {
          const radio = sDoc.querySelector(`input[name="classnbr1"][data-parameter2="${dream.erp}"]`);
          if (radio && seatsOf(radio) > 0) {
            log(`✨ DREAM PROF OPENS: ${dream.name} in ${held.code} has ${seatsOf(radio)} seat(s)!`, "success");
            await executeAtomicUpgrade(targetKey, dream, log);
            return;
          }
        }
      }
    }
  }

  // =========================================================================
  // 8. AUTO-SIGN IN & KEEP-ALIVE GUARDIAN
  // =========================================================================
  function initGuardian(log) {
    // 1. Session Keep-Alive Heartbeat
    setInterval(async () => {
      if (window.location.pathname.includes("LiveRegistration") && !document.getElementById("loginButton")) {
        try {
          await postForm("processCourseRegistration", "courseId=CH_BAMAT205_00100&page=1&pageSize=1&searchType=&searchVal=&null=null");
          log(`💓 Session keep-alive ping sent. Active!`, "pulse");
        } catch (e) {}
      }
    }, CONFIG.keepAliveIntervalMs);

    // 2. Auto-Sign In on Login Screen
    const loginBtn = document.getElementById("loginButton");
    const userInp = document.getElementById("username");
    const passInp = document.getElementById("password");
    const captchaInp = document.getElementById("captchaString");

    if (loginBtn && userInp) {
      userInp.value = CONFIG.username;
      passInp.value = CONFIG.password;

      // Play Alert Chime
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {}

      // Auto-submit instantly when 6 captcha characters are entered
      captchaInp.addEventListener("input", () => {
        if (captchaInp.value.trim().length === 6) {
          localStorage.setItem("vtop_auto_resume", "true");
          setTimeout(() => loginBtn.click(), 100);
        }
      });
      captchaInp.focus();
    }

    // 3. Auto-Resume on registration page
    if (localStorage.getItem("vtop_auto_resume") === "true") {
      localStorage.removeItem("vtop_auto_resume");
      setTimeout(() => {
        const btn = document.getElementById("vtop-btn-snipe-md");
        if (btn && !isRadarActive) btn.click();
      }, 1500);
    }
  }

  // =========================================================================
  // 9. MATCH DAY HUD INTERFACE
  // =========================================================================
  function mountHUD() {
    if (document.getElementById("vtop-matchday-hud")) return;

    const hud = document.createElement("div");
    hud.id = "vtop-matchday-hud";
    hud.innerHTML = `
      <div id="vtop-md-header">
        <span>⚡ VTOP Match-Day Atomic Sniper (v7.5)</span>
        <button id="vtop-md-toggle">—</button>
      </div>
      <div id="vtop-md-body">
        <button id="vtop-btn-snipe-md" style="width: 100%; background: #dc2626; color: white; padding: 10px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-bottom: 8px;">
          🎯 START MATCH DAY LIGHTNING RADAR
        </button>
        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; font-size: 11px; line-height: 1.5;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 4px;">
            <span id="vtop-md-status" style="color: #f87171;">🔴 STANDBY</span>
            <span style="color: #38bdf8;">Goal: 21.0 ➔ 24.0 Cr</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #334155; padding-top: 6px; margin-top: 4px;">
            <span style="color: #e2e8f0;">Auto-Drop Swap:</span>
            <button id="vtop-toggle-drop" style="background: ${CONFIG.allowAutoDropSwap ? '#dc2626' : '#334155'}; color: white; border: none; padding: 3px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: bold;">
              ${CONFIG.allowAutoDropSwap ? '⚠️ AUTO-DROP: ON' : '🛡️ AUTO-DROP: SAFE (OFF)'}
            </button>
          </div>
        </div>
        <div id="vtop-md-term" style="height: 150px; background: #000; border: 1px solid #18181b; border-radius: 6px; overflow-y: auto; padding: 8px; font-family: monospace; font-size: 11px; line-height: 1.4;"></div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #vtop-matchday-hud {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 480px;
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

    const dropToggleBtn = document.getElementById("vtop-toggle-drop");
    dropToggleBtn.addEventListener("click", () => {
      CONFIG.allowAutoDropSwap = !CONFIG.allowAutoDropSwap;
      dropToggleBtn.textContent = CONFIG.allowAutoDropSwap ? "⚠️ AUTO-DROP: ON" : "🛡️ AUTO-DROP: SAFE (OFF)";
      dropToggleBtn.style.background = CONFIG.allowAutoDropSwap ? "#dc2626" : "#334155";
      log(CONFIG.allowAutoDropSwap ?
        "⚠️ WARNING: Auto-Drop Swap ENABLED. Script will drop your seat if a Dream Prof opens!" :
        "🛡️ Auto-Drop disabled. Running in 100% Zero-Drop Safe Mode.", "warn");
    });

    const snipeBtn = document.getElementById("vtop-btn-snipe-md");
    const status = document.getElementById("vtop-md-status");

    async function loop() {
      while (isRadarActive) {
        await radarPulse(log);
        await sleep(CONFIG.radarIntervalMs + Math.floor(Math.random() * 200));
      }
    }

    snipeBtn.addEventListener("click", () => {
      if (isRadarActive) {
        isRadarActive = false;
        snipeBtn.textContent = "🎯 START MATCH DAY LIGHTNING RADAR";
        snipeBtn.style.background = "#dc2626";
        status.textContent = "🔴 STANDBY";
        status.style.color = "#f87171";
        log("Radar paused.", "warn");
      } else {
        isRadarActive = true;
        snipeBtn.textContent = "⏹️ STOP RADAR";
        snipeBtn.style.background = "#991b1b";
        status.textContent = "🟢 ACTIVE RADAR (PULSING)";
        status.style.color = "#4ade80";
        log("Match Day v7.5 active! Fast radar on D2 HSM + Atomic Drop & Re-obtain engaged.", "success");
        loop();
      }
    });

    initGuardian(log);
    log("Match Day v7.5 loaded. Ready for 8:30 AM Add & Drop rush.", "info");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHUD);
  } else {
    mountHUD();
  }
})();
