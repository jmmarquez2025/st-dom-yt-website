/**
 * Site-wide configuration. Update these values to connect services.
 *
 * ── Contact Form (Google Sheets) ──
 * 1. Create a Google Sheet.
 * 2. Go to Extensions → Apps Script.
 * 3. Paste the following script:
 *
 *    function doPost(e) {
 *      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *      var data = JSON.parse(e.postData.contents);
 *      sheet.appendRow([
 *        data.timestamp, data.name, data.email,
 *        data.phone, data.category, data.message
 *      ]);
 *      return ContentService
 *        .createTextOutput(JSON.stringify({ result: "success" }))
 *        .setMimeType(ContentService.MimeType.JSON);
 *    }
 *
 * 4. Click Deploy → New deployment → Web app.
 *    Execute as: Me | Who has access: Anyone
 * 5. Copy the URL below.
 *
 * ── WeShare Online Giving ──
 * When you have a WeShare account, paste the giving-page URL below.
 *
 * ── Google Sheets CMS ──
 * 1. Create a Google Sheet with tabs: Staff, Schedule, Ministries, Announcements
 *    (see src/cms/client.js for column definitions)
 * 2. File → Share → Publish to web → Entire Document → Publish
 * 3. Copy the Sheet ID from the URL:
 *    https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
 * 4. Paste it below. The site will fetch live data from the sheet.
 *    If the sheet is unavailable, bundled static data is used as fallback.
 */

export const CONFIG = {
  // Google Apps Script web-app URL (leave empty to fall back to mailto)
  contactFormUrl: import.meta.env.VITE_CONTACT_FORM_URL || "",

  // Registration form URL — same Apps Script as contact form, routes by formType.
  registrationFormUrl: import.meta.env.VITE_REGISTRATION_FORM_URL || "",

  // Optional CORS proxy in front of the form endpoints (e.g. a Cloudflare
  // Worker — see cms/contact-proxy.js). When set, the contact + registration
  // forms switch to CORS mode and surface real success/error responses from
  // the Apps Script. Leave empty to keep the no-cors fire-and-forget path.
  formProxyUrl: import.meta.env.VITE_FORM_PROXY_URL || "",

  // WeShare online giving page
  weShareUrl: import.meta.env.VITE_WESHARE_URL || "",

  // Google Sheets CMS — paste your published Sheet ID here
  cmsSheetId: import.meta.env.VITE_CMS_SHEET_ID || "",

  // YouTube channel embed (Fray Nelson)
  youtubeChannelUrl: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || "https://www.youtube.com/fraynelson",
  youtubeEmbedUrl: import.meta.env.VITE_YOUTUBE_EMBED_URL || "https://www.youtube.com/embed?listType=user_uploads&list=fraynelson",

  // Dominican Province of St. Joseph
  provinceUrl: "https://dominicanfriars.org/",

  // Flipbook bulletin embed URL
  // Paste the share/embed URL from your flipbook service (FlipHTML5, Heyzine, Issuu, etc.)
  // Example: "https://online.fliphtml5.com/abcde/fghij/"
  bulletinUrl: import.meta.env.VITE_BULLETIN_URL || "",

  // Site URL for SEO (canonical, OpenGraph, etc.)
  // Update this when deploying to the production domain
  siteUrl: (import.meta.env.VITE_SITE_URL || "https://jmmarquez2025.github.io/st-dom-yt-website").replace(/\/$/, ""),

  // Blog CMS — Google Apps Script URL serving blog posts from Google Docs
  // See cms/blog-cms.gs for setup instructions
  blogCmsUrl: import.meta.env.VITE_BLOG_CMS_URL || "",

  // Admin CMS — Google Apps Script URL backing the Staff Dashboard.
  // Lets admin edits sync across browsers/devices instead of living only
  // in one machine's localStorage. See cms/admin-cms.gs for setup.
  // Leave empty to fall back to localStorage-only mode.
  adminCmsUrl: import.meta.env.VITE_ADMIN_CMS_URL || "",

  // Analytics — Plausible (privacy-friendly, no cookie banner needed)
  // Sign up at https://plausible.io and add your domain
  plausibleDomain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || "",

  // Church info
  phone: "(330) 783-1900",
  phoneLink: "tel:+13307831900",
  fax: "(330) 783-2396",
  email: "office@saintdominic.org",
  address: "77 East Lucius Avenue",
  city: "Youngstown",
  state: "OH",
  zip: "44507",
  fullAddress: "77 East Lucius Avenue, Youngstown, OH 44507",
  officeHours: "Mon–Fri, 8:30 AM – 1:30 PM",
  mapsQuery: "77+East+Lucius+Ave,+Youngstown,+OH+44507",
};
