/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  St. Dominic — Mass Intentions backend (Google Apps Script)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  ONE web-app deployment serves both sides of the Mass Intentions feature:
 *
 *   1. PUBLIC submit (no token) — the request form on /mass-intentions POSTs a
 *      JSON body { formType:"massIntention", ... }. We append a row to the
 *      private "Intentions" tab and email the office.
 *
 *   2. STAFF read/update (token-gated) — the Staff Dashboard reads every row
 *      and patches individual rows (assign date/time/celebrant, change status,
 *      record the offering, mark fulfilled). The token is the same passphrase
 *      token the rest of the admin uses (Script Property WRITE_TOKEN).
 *
 *  WHY A SEPARATE TAB (not a "managed section"): intention rows contain PII
 *  (requester email/phone/address, names of the deceased, private intentions).
 *  They must NEVER be broadcast to every site visitor the way the public CMS
 *  sections are, so they live here behind the token instead.
 *
 *  ── SETUP (5 minutes) ──
 *  1. Open the Google Sheet you use for parish data (or a new one).
 *  2. Extensions → Apps Script → paste this file.
 *  3. Run → setupIntentionsSheet → authorize when prompted. This creates the
 *     "Intentions" tab with the header row.
 *  4. Project Settings → Script Properties:
 *        WRITE_TOKEN  = veritas        (match the Staff Dashboard passphrase)
 *        OFFICE_EMAIL = office@saintdominic.org   (where new requests are sent)
 *  5. Deploy → New deployment → Web app
 *        Execute as: Me
 *        Who has access: Anyone
 *     Copy the /exec URL.
 *  6. Set VITE_MASS_INTENTIONS_URL to that URL in your deploy env, rebuild,
 *     and flip VITE_MASS_INTENTIONS_ENABLED=true when you're ready to go live.
 *
 *  ── ENDPOINTS ──
 *   POST {formType:"massIntention", ...}            → append + notify office
 *   POST {token, resource:"intentions",
 *         action:"update", id, patch:{...}}          → update one row (staff)
 *   GET  ?resource=intentions&token=<WRITE_TOKEN>    → { intentions:[...] }
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

var SHEET_NAME = "Intentions";

// Column order for the Intentions tab. Add new fields at the END so existing
// rows keep their columns. The dashboard reads/writes by header name.
var HEADERS = [
  "id",
  "status",
  "createdAt",
  "updatedAt",
  "fulfillmentDeadline",
  "requesterName",
  "requesterEmail",
  "requesterPhone",
  "requesterAddress",
  "personName",
  "intentionType",
  "announcementPreference",
  "notes",
  "requestedDatePref",
  "requestedMassPref",
  "assignedDate",
  "assignedTime",
  "celebrantId",
  "celebrantName",
  "offeringReceived",
  "offeringReceivedDate",
  "fulfillmentDate",
  "approvalReason",
  "internalNotes",
];

var LOCKED_STATUSES = ["fulfilled", "archived", "rejected"];
var ANNUAL_LIMIT = 5; // soft — flagged in the office email, never blocks

/* ───────────────────────── Setup ───────────────────────── */

function setupIntentionsSheet() {
  var sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return "Intentions sheet ready.";
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function token_() {
  return PropertiesService.getScriptProperties().getProperty("WRITE_TOKEN") || "veritas";
}

function officeEmail_() {
  return (
    PropertiesService.getScriptProperties().getProperty("OFFICE_EMAIL") ||
    "office@saintdominic.org"
  );
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/* ─────────────────────── Row helpers ─────────────────────── */

function headerIndex_() {
  // Map header name → column index (0-based), tolerant of legacy header rows.
  var sheet = getSheet_();
  var width = Math.max(sheet.getLastColumn(), HEADERS.length);
  var row = sheet.getRange(1, 1, 1, width).getValues()[0];
  var map = {};
  for (var i = 0; i < row.length; i++) {
    if (row[i]) map[row[i]] = i;
  }
  // Backfill any headers this deployment knows about but the sheet is missing.
  HEADERS.forEach(function (h) {
    if (map[h] === undefined) map[h] = HEADERS.indexOf(h);
  });
  return map;
}

function rowToObj_(rowValues, hmap) {
  var obj = {};
  Object.keys(hmap).forEach(function (h) {
    obj[h] = rowValues[hmap[h]];
  });
  return obj;
}

function readAll_() {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var hmap = headerIndex_();
  var width = Math.max(sheet.getLastColumn(), HEADERS.length);
  var values = sheet.getRange(2, 1, last - 1, width).getValues();
  var out = [];
  for (var r = 0; r < values.length; r++) {
    if (!values[r][hmap.id]) continue;
    out.push(rowToObj_(values[r], hmap));
  }
  return out;
}

function countForEmailThisYear_(email) {
  if (!email) return 0;
  var e = String(email).trim().toLowerCase();
  var yr = new Date().getFullYear();
  return readAll_().filter(function (i) {
    return (
      String(i.requesterEmail || "").trim().toLowerCase() === e &&
      i.createdAt &&
      new Date(i.createdAt).getFullYear() === yr
    );
  }).length;
}

/* ───────────────────────── GET ───────────────────────── */

function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.resource === "intentions") {
    if (params.token !== token_()) {
      return json_({ error: "Unauthorized" });
    }
    return json_({ intentions: readAll_() });
  }
  return json_({ ok: true });
}

/* ───────────────────────── POST ───────────────────────── */

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ error: "Bad JSON" });
  }

  // ── Staff update (token-gated) ──
  if (data.resource === "intentions" && data.action === "update") {
    if (data.token !== token_()) return json_({ error: "Unauthorized" });
    return updateRow_(data.id, data.patch || {});
  }

  // ── Public submit ──
  if (data.formType === "massIntention") {
    return appendIntention_(data);
  }

  return json_({ error: "Unknown request" });
}

function appendIntention_(data) {
  var sheet = getSheet_();
  setupIntentionsSheet();
  var hmap = headerIndex_();
  var now = new Date();
  var nowIso = now.toISOString();
  var id =
    nowIso.slice(0, 10) + "-" + Math.random().toString(36).slice(2, 8);

  var deadline = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  deadline.setUTCDate(deadline.getUTCDate() + 365);

  var record = {
    id: id,
    status: "pending",
    createdAt: nowIso,
    updatedAt: nowIso,
    fulfillmentDeadline: deadline.toISOString().slice(0, 10),
    requesterName: data.requesterName || "",
    requesterEmail: data.requesterEmail || "",
    requesterPhone: data.requesterPhone || "",
    requesterAddress: data.requesterAddress || "",
    personName: data.personName || "",
    intentionType: data.intentionType || "",
    announcementPreference: data.announcementPreference || "public",
    notes: data.notes || "",
    requestedDatePref: data.requestedDatePref || "first-available",
    requestedMassPref: data.requestedMassPref || "any",
    assignedDate: "",
    assignedTime: "",
    celebrantId: "",
    celebrantName: "",
    offeringReceived: "",
    offeringReceivedDate: "",
    fulfillmentDate: "",
    approvalReason: "",
    internalNotes: "",
  };

  var width = Math.max(sheet.getLastColumn(), HEADERS.length);
  var row = new Array(width).fill("");
  Object.keys(record).forEach(function (k) {
    if (hmap[k] !== undefined) row[hmap[k]] = record[k];
  });
  sheet.appendRow(row);

  notifyOffice_(record);
  notifyRequesterReceived_(record);

  return json_({ result: "success", id: id });
}

function updateRow_(id, patch) {
  if (!id) return json_({ error: "Missing id" });
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return json_({ error: "Not found" });
  var hmap = headerIndex_();
  var width = Math.max(sheet.getLastColumn(), HEADERS.length);
  var values = sheet.getRange(2, 1, last - 1, width).getValues();

  for (var r = 0; r < values.length; r++) {
    if (values[r][hmap.id] === id) {
      var current = rowToObj_(values[r], hmap);
      if (LOCKED_STATUSES.indexOf(String(current.status)) !== -1) {
        return json_({ error: "This intention is locked and cannot be edited." });
      }
      var notify = !!patch.notify;
      delete patch.notify; // control flag, not a stored column
      var rowNum = r + 2;
      Object.keys(patch).forEach(function (k) {
        if (hmap[k] !== undefined) {
          sheet.getRange(rowNum, hmap[k] + 1).setValue(patch[k]);
        }
      });
      sheet.getRange(rowNum, hmap.updatedAt + 1).setValue(new Date().toISOString());

      if (notify) {
        var merged = {};
        Object.keys(current).forEach(function (k) { merged[k] = current[k]; });
        Object.keys(patch).forEach(function (k) { merged[k] = patch[k]; });
        notifyRequesterUpdate_(merged);
      }
      return json_({ result: "success", id: id });
    }
  }
  return json_({ error: "Not found" });
}

/* ─────────────────────── Notifications ─────────────────────── */

function notifyOffice_(rec) {
  try {
    var overLimit = countForEmailThisYear_(rec.requesterEmail) > ANNUAL_LIMIT;
    var body =
      "New Mass intention request\n\n" +
      "For: " + rec.personName + " (" + rec.intentionType + ")\n" +
      "Requested by: " + rec.requesterName + "\n" +
      "Email: " + rec.requesterEmail + "\n" +
      "Phone: " + (rec.requesterPhone || "—") + "\n" +
      "Address: " + (rec.requesterAddress || "—") + "\n" +
      "Preferred date: " + rec.requestedDatePref + "\n" +
      "Preferred Mass: " + rec.requestedMassPref + "\n" +
      "Announce: " + rec.announcementPreference + "\n" +
      "Notes: " + (rec.notes || "—") + "\n" +
      (overLimit
        ? "\n⚠ This requester has exceeded the suggested annual limit of " +
          ANNUAL_LIMIT +
          " intentions.\n"
        : "") +
      "\nReview it in the Staff Dashboard → Mass Intentions.";
    MailApp.sendEmail(officeEmail_(), "Mass Intention request: " + rec.personName, body);
  } catch (err) {
    // Email is best-effort; the row is already saved.
  }
}

function notifyRequesterReceived_(rec) {
  try {
    if (!rec.requesterEmail) return;
    MailApp.sendEmail(
      rec.requesterEmail,
      "We received your Mass intention request",
      "Thank you for requesting a Mass intention for " +
        rec.personName +
        ".\n\nThe parish office will contact you within three business days to " +
        "confirm the date and time. An offering is a voluntary donation and is " +
        "never required.\n\n— St. Dominic Catholic Church"
    );
  } catch (err) {
    // best-effort
  }
}

function notifyRequesterUpdate_(rec) {
  try {
    if (!rec.requesterEmail) return;
    var subject, body;
    if (rec.status === "scheduled") {
      subject = "Your Mass intention has been scheduled";
      body =
        "Your Mass intention for " +
        rec.personName +
        " has been scheduled" +
        (rec.assignedDate ? " for " + rec.assignedDate : "") +
        (rec.assignedTime ? " at " + rec.assignedTime : "") +
        (rec.celebrantName ? ", offered by " + rec.celebrantName : "") +
        ".\n\nThank you.\n— St. Dominic Catholic Church";
    } else if (rec.status === "rejected") {
      subject = "About your Mass intention request";
      body =
        "We're sorry — we were unable to schedule your Mass intention for " +
        rec.personName +
        ".\nReason: " +
        (rec.approvalReason || "—") +
        "\n\nPlease call the office at (330) 783-1900 if you have questions.\n" +
        "— St. Dominic Catholic Church";
    } else {
      subject = "Update on your Mass intention";
      body =
        "There is an update on your Mass intention for " +
        rec.personName +
        ".\n\n— St. Dominic Catholic Church";
    }
    MailApp.sendEmail(rec.requesterEmail, subject, body);
  } catch (err) {
    // best-effort
  }
}
