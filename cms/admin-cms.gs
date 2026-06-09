/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  St. Dominic Admin CMS — Google Apps Script
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  This script is the *write-capable* backend for the Staff Dashboard.
 *  It lets admins in any browser / device save their changes to a shared
 *  Google Sheet, so every visitor sees the same data.
 *
 *  HOW IT WORKS:
 *  - A single "AdminData" tab in the sheet stores one row per section.
 *    Columns:  section | data (JSON blob) | updatedAt
 *  - The website's localStorage is a fast in-browser cache. On page load
 *    the site pulls the latest data from this script; after an admin saves,
 *    the site pushes the updated section back here.
 *  - Writes are gated by a passphrase (the same one that unlocks the
 *    Staff Dashboard — "veritas" by default). Rotate it any time by
 *    editing the Script Property "WRITE_TOKEN".
 *
 *  SETUP (5 minutes):
 *  1. Open the Google Sheet you use for site content (or create a new one).
 *  2. Extensions → Apps Script → paste this file.
 *  3. Run → setupAdminSheet → authorize when prompted.
 *     This creates the "AdminData" tab and seeds an empty row per section.
 *  4. Project Settings → Script Properties → add key WRITE_TOKEN,
 *     value: veritas   (or any passphrase — make it match the one used
 *     on the Staff Dashboard passphrase screen).
 *  5. Deploy → New deployment → Web app
 *        Execute as: Me
 *        Who has access: Anyone
 *     Copy the web-app URL.
 *  6. Set VITE_ADMIN_CMS_URL to the web-app URL in your local/deploy
 *     environment, then rebuild and deploy the site.
 *
 *  DATA MODEL:
 *     Each row = one logical "section" of the site.
 *     section  : stdom_announcements | stdom_events | stdom_schedule |
 *                stdom_staff_directory | stdom_ministries | stdom_settings |
 *                stdom_bulletin_current_url | stdom_bulletin_archive
 *     data     : the raw JSON string the site stores in localStorage
 *     updatedAt: ISO timestamp of the last write
 *
 *  ENDPOINTS:
 *     GET  ?section=<name>   → { section, data, updatedAt }
 *     GET  (no section)      → { sections: { key: { data, updatedAt } } }
 *     POST { token, section, data }   → { success: true, updatedAt }
 *     POST { token, action:"clear" }  → wipes every managed section
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

var SHEET_NAME = "AdminData";

var MANAGED_SECTIONS = [
  "stdom_announcements",
  "stdom_bulletin_current_url",
  "stdom_bulletin_archive",
  "stdom_events",
  "stdom_schedule",
  "stdom_staff_directory",
  "stdom_ministries",
  "stdom_settings"
];

var COLS = { SECTION: 0, DATA: 1, UPDATED_AT: 2 };


/**
 * ━━━ READ ENDPOINT ━━━
 *   GET ?section=stdom_events        → one section
 *   GET (no query)                   → every section
 */
function doGet(e) {
  try {
    var sheet = getOrCreateSheet_();
    var rows = sheet.getDataRange().getValues();
    var single = e && e.parameter && e.parameter.section;

    var index = {};
    for (var i = 1; i < rows.length; i++) {
      var key = rows[i][COLS.SECTION];
      if (!key) continue;
      index[key] = {
        data: rows[i][COLS.DATA] || "",
        updatedAt: rows[i][COLS.UPDATED_AT] || ""
      };
    }

    if (single) {
      var record = index[single] || { data: "", updatedAt: "" };
      return jsonResponse({ section: single, data: record.data, updatedAt: record.updatedAt });
    }

    // Ensure every managed section is represented (empty string if never written)
    var sections = {};
    MANAGED_SECTIONS.forEach(function (k) {
      sections[k] = index[k] || { data: "", updatedAt: "" };
    });

    return jsonResponse({ sections: sections });
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}


/**
 * ━━━ WRITE ENDPOINT ━━━
 *   POST JSON body { token, section, data }
 *   POST JSON body { token, action:"clear" }
 *
 *  Note: because the website posts with mode:"no-cors" (to avoid CORS
 *  preflight), the browser ignores the response — but we still return
 *  JSON so you can test the endpoint manually (curl, Postman, etc.).
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || "{}");

    // ── Auth ──
    var expectedToken = PropertiesService.getScriptProperties().getProperty("WRITE_TOKEN");
    if (!expectedToken) {
      return jsonResponse({ error: "WRITE_TOKEN script property is not configured" });
    }
    if (!body.token || body.token !== expectedToken) {
      return jsonResponse({ error: "Unauthorized" });
    }

    var sheet = getOrCreateSheet_();

    // ── Clear-all ──
    if (body.action === "clear") {
      var last = sheet.getLastRow();
      if (last > 1) sheet.deleteRows(2, last - 1);
      seedSections_(sheet);
      SpreadsheetApp.flush();
      return jsonResponse({ success: true, cleared: true });
    }

    // ── Upsert a single section ──
    if (!body.section || MANAGED_SECTIONS.indexOf(body.section) === -1) {
      return jsonResponse({ error: "Unknown section: " + body.section });
    }

    var dataStr = typeof body.data === "string" ? body.data : JSON.stringify(body.data || "");
    var now = new Date().toISOString();
    var rows = sheet.getDataRange().getValues();
    var existing = -1;
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][COLS.SECTION] === body.section) { existing = i + 1; break; }
    }

    if (existing > 0) {
      sheet.getRange(existing, 1, 1, 3).setValues([[body.section, dataStr, now]]);
    } else {
      sheet.appendRow([body.section, dataStr, now]);
    }

    SpreadsheetApp.flush();
    return jsonResponse({ success: true, section: body.section, updatedAt: now });
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}


/**
 * ━━━ ONE-TIME SHEET SETUP ━━━
 *  Run this once from the Apps Script editor. It creates the "AdminData"
 *  tab, formats the header, and seeds one empty row per managed section.
 */
function setupAdminSheet() {
  var sheet = getOrCreateSheet_();

  // Header row
  var headers = ["Section", "Data (JSON)", "Updated At"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var header = sheet.getRange(1, 1, 1, headers.length);
  header.setBackground("#6B1D2A");
  header.setFontColor("#FFFFFF");
  header.setFontWeight("bold");
  header.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);

  sheet.setColumnWidth(1, 240);
  sheet.setColumnWidth(2, 600);
  sheet.setColumnWidth(3, 200);

  seedSections_(sheet);

  SpreadsheetApp.flush();
  Logger.log("AdminData tab ready. Add WRITE_TOKEN in Script Properties, then deploy as web app to activate.");
}


// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 3).setValues([["Section", "Data (JSON)", "Updated At"]]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function seedSections_(sheet) {
  var existing = {};
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][COLS.SECTION]) existing[rows[i][COLS.SECTION]] = true;
  }
  MANAGED_SECTIONS.forEach(function (key) {
    if (!existing[key]) sheet.appendRow([key, "", ""]);
  });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
