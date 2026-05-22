# ST. DOMINIC CATHOLIC CHURCH — Website Administrator Guide

**Prepared for** Fr. Frassati Davis, O.P., Fr. Charles Marie Rooney, O.P., and Parish Staff
**Date:** April 2026

---

## Table of Contents

1. [Introduction and Overview](#1-introduction-and-overview)
2. [Getting Started](#2-getting-started)
3. [The Google Sheets CMS](#3-the-google-sheets-cms)
4. [Managing Mass Times and Schedules](#4-managing-mass-times-and-schedules)
5. [Managing Staff and Friars](#5-managing-staff-and-friars)
6. [Managing Announcements](#6-managing-announcements)
7. [Managing Events](#7-managing-events)
8. [Managing the Weekly Bulletin](#8-managing-the-weekly-bulletin)
9. [The Blog System](#9-the-blog-system)
10. [The Contact Form](#10-the-contact-form)
11. [The Parish Registration Form](#11-the-parish-registration-form)
12. [Online Giving (Flocknote)](#12-online-giving-flocknote)
13. [Photos and Images](#13-photos-and-images)
14. [Translations (English and Spanish)](#14-translations-english-and-spanish)
15. [Site Analytics](#15-site-analytics)
16. [Common Tasks — Quick Reference](#16-common-tasks--quick-reference)
17. [Troubleshooting](#17-troubleshooting)
18. [Technical Reference (For Developers)](#18-technical-reference-for-developers)

---

## 1. Introduction and Overview

This guide covers everything you need to know to manage the St. Dominic Catholic Church website. It is written for non-technical administrators who need to update content, publish blog posts, manage events, and keep the site running smoothly.

### What the Website Does

The St. Dominic website serves as the digital front door for our parish. It provides:

- Mass times, confession hours, and adoration schedule
- Information about all seven sacraments (Baptism, First Communion, Confirmation, Marriage, Anointing, Funerals)
- A blog for homilies, reflections, and parish news
- An events calendar
- The weekly bulletin (embedded flipbook)
- Contact and parish registration forms
- Online giving integration
- Information about the church's history, architecture, and Dominican heritage
- Bilingual support (English and Spanish)

### How Content is Managed

The site uses a two-tier content system:

1. **Google Sheets CMS** — A published Google Sheet that the site reads automatically. You edit the spreadsheet, and the website updates within 5 minutes. This controls: staff, schedules, announcements, events, bulletins, and ministries.
2. **Static Data Files** — Content baked into the site code. This includes page text, photos, and the default versions of everything above. Changes to static files require a developer to rebuild the site.

> **Tip:** For day-to-day content management, you will almost always use the Google Sheets CMS. You only need a developer for design changes, adding new pages, or fixing bugs.

### Website Address

- **Current GitHub Pages site:** https://jmmarquez2025.github.io/st-dom-yt-website/
- **Parish domain:** https://saintdominic.org/ remains on the existing site until the domain transfer is scheduled.

---

## 2. Getting Started

### What You Need

- A Google account (for editing the CMS spreadsheet and viewing form responses)
- A web browser (Chrome, Safari, Firefox, or Edge)
- The shared Google Sheet link (ask the developer for this)
- The staff passphrase for the Blog Manager: **veritas**

### Accessing the Blog Manager

1. Go to the website and scroll to the very bottom of any page.
2. Click **"Staff"** in the footer (small link at the bottom right).
3. Enter the passphrase: **veritas**
4. You will see the Blog Dashboard where you can create, edit, and delete posts.

> **Tip:** The passphrase is the Dominican motto — easy for friars to remember! The session stays active until you close the browser tab.

### Accessing the Google Sheets CMS

1. Open the shared Google Sheet link in your browser.
2. You will see tabs at the bottom: Staff, Schedule, Ministries, Announcements, Events, Bulletins.
3. Click a tab to view and edit that section's data.
4. Changes appear on the live website within 5 minutes (the site caches data briefly).

> **Important:** The Google Sheet must remain published to the web. Do not un-publish it or change the sharing settings. If you do, the website will fall back to its bundled static data until the sheet is re-published.

---

## 3. The Google Sheets CMS

The Google Sheets CMS is the heart of the website's content management. It is a regular Google Sheet that the website reads automatically. You never need to touch any code — just edit the spreadsheet.

### How It Works

1. You edit a cell in the Google Sheet (e.g., change a Mass time).
2. The website checks the sheet every 5 minutes for updates.
3. The next visitor to the site sees the updated information.
4. If the sheet is unavailable for any reason, the site shows the last-known data from its static files.

### Sheet Structure

The sheet has six tabs along the bottom:

| Tab Name | What It Controls | How Often You'll Edit It |
|----------|-----------------|------------------------|
| Staff | Friars and staff names, roles, order | Rarely (when someone joins/leaves) |
| Schedule | Mass times, confession, adoration | Occasionally (seasonal changes) |
| Ministries | Ministry list on Get Involved page | Rarely |
| Announcements | Home page news banners | Weekly |
| Events | Events calendar | Weekly |
| Bulletins | Bulletin archive links | Weekly |

### Important Rules for Editing the Sheet

- **Never rename the tabs** — the website looks for exact tab names.
- **Never rearrange or rename the column headers** in Row 1.
- You can add, edit, or delete data rows freely (Row 2 onward).
- Leave cells blank if a field is optional — do not type "N/A" or "none".
- Dates should be in **YYYY-MM-DD** format (e.g., 2026-04-13).
- TRUE/FALSE values must be typed exactly (all caps).

---

## 4. Managing Mass Times and Schedules

Mass times, confession hours, and adoration schedules are managed in the **Schedule** tab of the Google Sheet.

### Schedule Tab Columns

| Column | What It Means | Example |
|--------|--------------|---------|
| category | Type of service | sundayMass, dailyMass, confession, adoration |
| dayKey | Which day/slot this is for | sunday, monday, saturdayVigil, sundayEspanol |
| time | The time(s) for this service | 8:00 AM, 12:00 PM |

### Category Values

- **sundayMass** — Sunday and vigil Masses
- **dailyMass** — Weekday Masses
- **confession** — Confession/Reconciliation times
- **adoration** — Eucharistic Adoration schedule

### Common Tasks

#### Changing a Mass Time
1. Open the Schedule tab.
2. Find the row with the correct category and dayKey.
3. Edit the **time** column with the new time.
4. The website updates within 5 minutes.

#### Adding a New Mass (e.g., a Holiday Mass)
1. Go to the last row of data in the Schedule tab.
2. Add a new row with the category (e.g., sundayMass), a dayKey (e.g., christmas), and the time.

#### Temporarily Suspending a Service
Delete the row or change the time to something like "Suspended" — the site will display whatever text is in the time column.

> **Tip:** The Mass times also appear on the Home page in the "Next Mass" countdown widget. This reads from the same Schedule data automatically.

> **Important:** The mobile "Mass / Confession / Call" strip, Home page essentials, and Mass Times structured data all read from the same Schedule tab. After changing Mass or Confession times, check the Home page and Mass Times page on a phone-sized screen.

---

## 5. Managing Staff and Friars

The **Staff** tab controls who appears on the Priests & Staff page.

### Staff Tab Columns

| Column | What It Means | Example |
|--------|--------------|---------|
| id | Unique identifier (lowercase, hyphenated) | frassati-davis |
| name | Full display name | Fr. Frassati Davis, O.P. |
| role | Role key used for translations | pastor |
| type | Either "friar" or "staff" | friar |
| order | Sort order (lower = first) | 1 |

### Common Tasks

#### Adding a New Friar or Staff Member
1. Add a new row at the bottom of the Staff tab.
2. Choose a unique **id** (lowercase, use hyphens: e.g., john-smith).
3. Enter the full name, role, and type (friar or staff).
4. Set the **order** number to control where they appear in the list.

#### Removing Someone
Delete their row from the sheet. The website will stop showing them within 5 minutes.

#### Changing the Display Order
Edit the **order** column. Lower numbers appear first. You can use 1, 2, 3, etc.

> **Tip:** Staff photos are stored in the website code, not the CMS. To update a photo, send the new image to the developer.

---

## 6. Managing Announcements

Announcements appear in the "News & Announcements" section on the Home page. They are a great way to highlight upcoming events, schedule changes, or parish news.

### Announcements Tab Columns

| Column | What It Means | Example |
|--------|--------------|---------|
| title | Headline of the announcement | Fish Fry This Friday! |
| body | Full text of the announcement | Join us in the parish hall... |
| date | Date (for sorting) | 2026-04-10 |
| active | Whether it shows on the site | TRUE or FALSE |

### Common Tasks

#### Adding a New Announcement
1. Add a new row in the Announcements tab.
2. Type a short, attention-grabbing title.
3. Write the body text (keep it to 1–2 sentences).
4. Enter today's date.
5. Set **active** to **TRUE**.

#### Hiding an Old Announcement
Change the **active** column from TRUE to FALSE. The announcement will disappear from the website but remain in your spreadsheet for records.

#### Editing an Announcement
Simply edit the title or body text in the sheet. Changes go live within 5 minutes.

> **Important:** Only announcements with active set to TRUE appear on the website. Double-check spelling — it must be exactly **TRUE** (all uppercase).

---

## 7. Managing Events

The Events page shows an interactive calendar of parish activities. Events are managed in the **Events** tab of the CMS sheet.

### Events Tab Columns

| Column | What It Means | Example |
|--------|--------------|---------|
| id | Unique identifier | 1, 2, 3... |
| date | Event date | 2026-04-13 |
| title | Event name | Palm Sunday Procession |
| description | Details about the event | Begin at the parish hall... |
| category | Event type for filtering | mass, sacrament, education, social, prayer, other |
| time | When it happens | 10:30 AM |
| location | Where it happens | Church, Parish Hall, etc. |

### Event Categories

| Category Value | Display Name | Color on Site |
|---------------|-------------|--------------|
| mass | Mass & Liturgy | Burgundy |
| sacrament | Sacraments | Purple |
| education | Education & Formation | Blue |
| social | Community & Social | Gold |
| prayer | Prayer & Devotion | Green |
| other | Other | Gray |

### Common Tasks

#### Adding an Event
1. Add a new row in the Events tab.
2. Give it the next **id** number (just increment from the last one).
3. Fill in the date (YYYY-MM-DD), title, description, category, time, and location.

#### Removing a Past Event
You can delete old rows to keep the sheet tidy, or leave them — the site automatically separates past events from upcoming ones.

> **Tip:** Events with a date in the past are shown in a separate "Past Events" section. You don't need to manually hide them.

---

## 8. Managing the Weekly Bulletin

The bulletin page has two parts: an embedded flipbook viewer showing the current week's bulletin, and an archive of past bulletins.

### Updating the Current Bulletin

Each week, when you have the new bulletin PDF:

1. Upload the PDF to your flipbook service (FlipHTML5, Heyzine, or Issuu).
2. Copy the embed/share URL from the flipbook service.
3. Send the new URL to the developer to update the site configuration.

The developer will update the `bulletinUrl` value in the site configuration. In the future, this could be automated so you can change it yourself via the CMS sheet.

### Adding to the Bulletin Archive

The archive is managed in the **Bulletins** tab of the CMS sheet.

| Column | What It Means | Example |
|--------|--------------|---------|
| date | Bulletin date | 2026-04-06 |
| label | Descriptive name | Palm Sunday |
| url | Flipbook embed URL | https://online.fliphtml5.com/... |

#### Adding a Past Bulletin to the Archive
1. Add a new row in the Bulletins tab.
2. Enter the date, a friendly label (e.g., "Fourth Sunday of Lent"), and the flipbook URL.
3. The archive sorts automatically with newest first.

---

## 9. The Blog System

The blog is the most feature-rich part of the website. It supports rich text articles with headings, quotes, images, callout boxes, and more. Posts can be written in English and Spanish, assigned to categories, tagged, and featured on the home page.

### Accessing the Blog Manager

1. Go to the website footer and click **"Staff"**.
2. Enter the passphrase: **veritas**
3. You will see the Blog Dashboard with all existing posts.

### The Blog Dashboard

The dashboard shows:

- A count of published and draft posts
- Filter tabs: All, Published, Drafts
- A search bar to find posts by title, author, or category
- A "New Post" button
- Each post row showing: thumbnail, title, status badge, author, date, and category

Click any post to edit it. Click "New Post" to create a new one.

### Creating a New Blog Post

#### Step 1: Fill in Post Details

- **Title** (required) — The headline of your article
- **Title (Spanish)** — Optional Spanish translation of the title
- **Author** — Select the author from the dropdown
- **Date** — Publication date (defaults to today)
- **Category** — Choose from: Homilies, Dominican Life, Parish News, Faith & Theology, Community
- **Tags** — Comma-separated keywords (e.g., "Lent, Prayer, Hope")
- **Hero Image URL** — A web URL for the large banner image at the top
- **Excerpt** (required) — 1–2 sentence summary that appears on the blog listing page
- **Excerpt (Spanish)** — Optional Spanish translation
- **Featured** — Check to pin this post to the top of the blog page
- **Publish immediately** — Check to make the post visible on the website

#### Step 2: Write the Content

You have two options for writing the article body:

**Option A: Write Here (Built-in Editor)**

The built-in editor works like a simplified word processor. Use the toolbar buttons for:

- Bold and Italic text
- Headings (H2 and H3)
- Block quotes (for Scripture or significant quotes)
- Callout boxes (for highlighted announcements or key points)
- Bulleted and numbered lists
- Images (paste a URL and optional caption)
- Horizontal dividers
- Undo and Redo

Switch to the **Preview** tab at any time to see exactly how the post will look on the website.

**Option B: Link Google Doc**

If you prefer writing in Google Docs:

1. Write your article in a Google Doc using normal formatting (headings, bold, lists, etc.).
2. Share the Doc: Click Share, then "Anyone with the link can view."
3. In the blog composer, switch to "Link Google Doc" mode.
4. Paste the Google Doc URL.
5. The website will automatically pull and format the content from the Doc.

> **Tip:** Google Docs content is re-fetched periodically, so if you update the Doc, the website will reflect changes within a few minutes.

#### Step 3: Save or Publish

At the bottom of the composer, you have two buttons:

- **Save Draft** — Saves the post but does NOT make it visible on the website. Use this to work on a post over time.
- **Publish Now / Update & Publish** — Saves and makes the post immediately visible.

When editing a published post:

- **Unpublish & Save Draft** — Takes the post offline and saves it as a draft.
- **Update & Publish** — Saves changes while keeping the post live.

### Editing an Existing Post

1. From the Blog Dashboard, click on the post you want to edit.
2. Make your changes to any field.
3. Click "Update & Publish" to save, or "Unpublish & Save Draft" to take it offline.

### Deleting a Post

1. Open the post in the editor.
2. Click the red **"Delete"** button in the top right.
3. A confirmation dialog will ask "Delete This Post?"
4. Click **"Delete Post"** to permanently remove it, or **"Keep It"** to cancel.

> **Important:** Deletion is permanent. There is no undo. Make sure you really want to remove the post.

### Blog Post Features on the Website

When a visitor views a published blog post, they see:

- A large hero image with the title and metadata overlaid
- Author name and photo
- Reading time estimate (auto-calculated)
- A table of contents generated from headings (sticky on desktop)
- The full article body with beautiful typography
- Tags at the bottom
- Share buttons (copy link, Facebook, Twitter/X, email)
- An author card with a short bio
- Previous/Next navigation to other posts
- Related posts by category

### Blog Categories Reference

| Category | Best For | Icon |
|----------|---------|------|
| Homilies | Sunday homily texts, feast day reflections | Book |
| Dominican Life | Dominican spirituality, charism, saints | Cross |
| Parish News | Events, milestones, updates | Newspaper |
| Faith & Theology | Catechesis, apologetics, doctrine | Book with text |
| Community | Outreach, ministries, parishioner stories | Handshake |

---

## 10. The Contact Form

The Contact page has a form that visitors can fill out to reach the parish. Submissions are saved to a Google Sheet.

### Viewing Submissions

1. Open the Google Sheet that receives contact form data (ask the developer for the link).
2. Each submission creates a new row with: Timestamp, Name, Email, Phone, Category, and Message.
3. You can sort, filter, and search the sheet like any spreadsheet.

### Form Categories

Visitors choose a category when submitting the form:

- General Inquiry
- Sacraments
- Volunteering
- Prayer Request
- Other

> **Tip:** Consider checking the contact form sheet at least once a day to respond promptly to inquiries.

---

## 11. The Parish Registration Form

The Register page allows new parishioners to sign up directly through the website. Like the contact form, submissions go to a Google Sheet.

### What the Form Collects

- Full name
- Email address and phone number
- Status (child, teen, or adult)
- Interests (checkboxes: liturgy, music, education, service, community, other)
- How they heard about the church
- Optional additional message

### Viewing Registrations

Open the registration Google Sheet. Each new registration adds a row. Follow up with new registrants to welcome them to the parish.

---

## 12. Online Giving (Flocknote)

The Give page provides information about supporting the parish financially and links visitors to the parish's public Flocknote giving portal.

### Setting Up Flocknote Giving

1. In Flocknote, enable Online Giving.
2. Configure public funds such as Sunday Offertory, Building Fund, Food Pantry, or other parish-approved categories.
3. Customize the public Giving Page with the parish logo, message, and brand color.
4. Copy the public Giving URL from the Giving Page settings or the fund's public page settings.
5. Add that URL to `VITE_FLOCKNOTE_GIVING_URL`.

Use the public Giving URL, not the admin/action-center URL. The website should never collect card or bank details directly; payment details stay inside Flocknote's secure checkout.

The Give page now explains one-time gifts, recurring gifts, payment methods, processing-fee awareness, annual statements, and non-online giving methods. If Flocknote funds or fee language change, ask the developer to update both English and Spanish copy.

---

## 13. Photos and Images

Photos are used throughout the site — hero banners, staff portraits, gallery, blog posts, and more.

### Where Photos Live

All website photos are stored in the `public/photos/` folder of the site code. They are optimized in two formats:

- **JPG** — Standard format for all browsers
- **WebP** — Modern format that loads faster (auto-selected by the browser)

### Blog Post Images

For blog posts, images can be added in two ways:

1. **Hero Image** — Paste any public image URL into the "Hero Image URL" field when creating a post. This becomes the large banner at the top of the article.
2. **Inline Images** — Use the Image button in the editor toolbar. Paste an image URL and optionally add a caption.

> **Tip:** Free, high-quality Catholic images can be found at cathopic.com, unsplash.com (search "Catholic" or "church"), or from the diocesan media library.

### Updating Site Photos

To change a photo used on one of the main site pages (not blog posts), send the new image to the developer. They will optimize it, add it to the photo library, and update the code.

---

## 14. Translations (English and Spanish)

The entire website supports both English and Spanish. Visitors toggle between languages using the EN/ES buttons in the navigation bar.

### How Translations Work

- All translatable text is stored in two files: `en.json` (English) and `es.json` (Spanish).
- Blog posts have separate fields for Spanish: Title (Spanish), Excerpt (Spanish), and a Spanish Google Doc link or body.
- The language preference is saved in the visitor's browser, so they don't have to switch every time.

### What You Can Translate Without a Developer

- Blog post titles, excerpts, and full body text (via the composer form)
- Announcements (write the Spanish version in the body text, or ask the developer to add a Spanish column)
- Event descriptions

### What Needs a Developer

Changes to page headings, button labels, navigation items, and other structural text require editing the translation files, which needs a developer.

> **Tip:** When writing a blog post, always try to provide at least a Spanish title and excerpt. The full body translation is nice to have but not required.

---

## 15. Site Analytics

The website is configured to use Cloudflare Web Analytics, a free privacy-friendly analytics service that does not require a cookie consent banner.

### What Analytics Tell You

- How many people visit the site each day/week/month
- Which pages are most popular
- Where visitors come from (Google search, social media, direct)
- What devices they use (desktop, mobile, tablet)
- Which blog posts get the most readers

### Setting Up Analytics

1. In the Cloudflare dashboard, go to Web Analytics and select Add a site.
2. Register the current site host: `jmmarquez2025.github.io`.
3. Choose manual JavaScript snippet installation. Do not change DNS or move the parish domain yet.
4. Copy the public site token from the `data-cf-beacon` snippet.
5. Add the token to GitHub as `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN`, then rerun the Deploy to GitHub Pages workflow.
6. View reports in Cloudflare > Web Analytics after data appears.
7. When the parish domain transfer is scheduled, update the Cloudflare Web Analytics site to `saintdominic.org` or create a new site token and update the GitHub variable.

Until the Cloudflare token is set, no visitor data is collected.

---

## 16. Common Tasks — Quick Reference

### Daily

| Task | Where | How |
|------|-------|-----|
| Check contact form submissions | Contact Responses Google Sheet | Open sheet, review new rows |
| Check registration submissions | Registration Google Sheet | Open sheet, review new rows |

### Weekly

| Task | Where | How |
|------|-------|-----|
| Update announcements | CMS Sheet > Announcements tab | Add/edit rows, set active to TRUE/FALSE |
| Add events | CMS Sheet > Events tab | Add new rows with date, title, category |
| Update bulletin | Flipbook service + developer | Upload PDF, get URL, share with developer |
| Add bulletin to archive | CMS Sheet > Bulletins tab | Add row with date, label, URL |
| Publish blog post | Website > Staff > Blog Manager | Click New Post, fill form, click Publish |

### Monthly / As Needed

| Task | Where | How |
|------|-------|-----|
| Update Mass times | CMS Sheet > Schedule tab | Edit time values in relevant rows |
| Update staff list | CMS Sheet > Staff tab | Add/remove/reorder rows |
| Review analytics | Cloudflare Web Analytics | Login and review traffic data |
| Update photos | Send to developer | Email new photos for optimization |

---

## 17. Troubleshooting

### The website is showing old information
- The site caches data for 5 minutes. Wait a few minutes and refresh the page.
- Try a hard refresh: hold Shift and click the refresh button in your browser.
- Clear your browser cache if the issue persists.

### A blog post won't save
- Make sure all required fields are filled in: Title, Excerpt, and either editor content or a Google Doc link.
- Check for a red error toast message at the bottom right of the screen — it will tell you what's wrong.
- If using the editor, make sure you've typed at least some content in the writing area.

### The passphrase isn't working
- The passphrase is: **veritas** (all lowercase, no spaces).
- Make sure your keyboard isn't in caps lock mode.

### Changes to the Google Sheet aren't appearing
- Is the sheet still published to the web? Check File > Share > Publish to web.
- Did you edit the correct tab? The site reads specific tab names.
- Are the column headers in Row 1 still intact? Don't rename them.
- Wait 5 minutes for the cache to refresh, then hard-refresh the page.

### A blog post looks wrong on the website
- Check the Preview tab in the editor before publishing.
- If using a Google Doc, make sure it's shared as "Anyone with the link can view."
- Images must be publicly accessible URLs (not private Google Drive links).

### The contact form isn't working
- Check if the Google Apps Script deployment is still active.
- The developer can verify the deployment URL in the site configuration.

### Something else is broken
Contact the developer. Provide:
- What page the problem is on
- What you expected to happen
- What actually happened
- A screenshot if possible

---

## 18. Technical Reference (For Developers)

> This section is for the developer maintaining the site code. Non-technical administrators can skip this.

### Technology Stack

- React 18 with Vite 6 (single-page application)
- react-router-dom 7 for routing
- react-i18next for translations
- Lucide React for icons
- Hosted on GitHub Pages with automated deployment via GitHub Actions

### Key Directories

| Path | Purpose |
|------|---------|
| `src/pages/` | Page components (one per route) |
| `src/components/` | Reusable UI components |
| `src/components/blog/` | Blog-specific components (editor, dashboard, body renderer) |
| `src/cms/` | CMS client (Google Sheets fetcher) and React hooks |
| `src/data/` | Static fallback data files |
| `src/constants/` | Config, theme colors, photo paths |
| `src/locales/` | Translation files (en.json, es.json) |
| `src/styles/` | Global CSS |
| `src/utils/` | Utility functions (blog, SEO, etc.) |
| `public/photos/` | Optimized images (JPG + WebP) |
| `cms/` | Google Apps Script source (blog-cms.gs) |
| `.github/workflows/` | CI/CD deployment pipeline |

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_CONTACT_FORM_URL` | Google Apps Script URL for contact form | Recommended |
| `VITE_REGISTRATION_FORM_URL` | Google Apps Script URL for registration | Recommended |
| `VITE_CMS_SHEET_ID` | Published Google Sheet ID for CMS data | Recommended |
| `VITE_BLOG_CMS_URL` | Apps Script URL for blog post CRUD | Optional (uses localStorage fallback) |
| `VITE_ADMIN_CMS_URL` | Apps Script URL for staff dashboard cloud sync | Recommended |
| `VITE_STAFF_PASSPHRASE` | Staff dashboard write passphrase | Recommended |
| `VITE_SITE_URL` | Canonical URL used for SEO, sitemap, and robots.txt | Recommended |
| `VITE_FLOCKNOTE_GIVING_URL` | Public Flocknote giving page URL | Recommended |
| `VITE_WESHARE_URL` | Legacy online giving URL alias | Optional |
| `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` | Public Cloudflare Web Analytics site token | Optional |
| `VITE_BULLETIN_URL` | Current week's flipbook embed URL | Optional |
| `VITE_YOUTUBE_CHANNEL_ID` | YouTube channel ID | Optional |
| `VITE_YOUTUBE_EMBED_URL` | YouTube embed URL | Optional |

### Build Commands

| Command | What It Does |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start local development server (localhost:5173) |
| `npm run build` | Create production build in dist/ folder |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check code quality |
| `npm run images` | Generate WebP versions of photos |

### Parish UX Guardrails

- Keep the current GitHub Pages URL as canonical until the parish domain transfer is explicitly scheduled.
- Keep Mass, Confession, Anointing, Funerals, Contact, and Give within one tap on mobile.
- External safety links in the footer point to the Catholic Diocese of Youngstown Safe Environment page and VIRTUS Online. Verify those links during each major content audit.
- Any new structural text must be added to both `src/locales/en.json` and `src/locales/es.json`.

### Deployment

The site deploys automatically when code is pushed to the main branch:

1. Developer pushes code to GitHub main branch.
2. GitHub Actions runs the build pipeline (`.github/workflows/deploy.yml`).
3. Built files are published to GitHub Pages.
4. The live site updates within 1–2 minutes.

### Blog CMS Backend (Apps Script)

The blog system can use a Google Apps Script backend for persistent storage. The script source is in `cms/blog-cms.gs`. To deploy:

1. Create a Google Sheet for blog data.
2. Open Extensions > Apps Script.
3. Paste the contents of `cms/blog-cms.gs`.
4. In Project Settings > Script Properties, add `WRITE_TOKEN` with the same value as `VITE_STAFF_PASSPHRASE`.
5. Deploy as a Web App (Execute as: You, Access: Anyone).
6. Copy the deployment URL and set `VITE_BLOG_CMS_URL` in `.env` or in the GitHub Pages build environment.

Without the Apps Script deployed, the blog manager saves posts to browser localStorage, which works for testing but is not persistent across devices.

### Key Configuration File

`src/constants/config.js` contains all configurable values including church contact information, service URLs, and CMS connection details. Environment variables in `.env` override the defaults in this file.

### Generating the Admin Guide

To regenerate the Word (.docx) version of this guide:

```bash
npm run docs
```

This runs `docs/generate-docx.py` and saves the file to your Desktop.

---

*Veritas — St. Dominic Catholic Church, 77 East Lucius Avenue, Youngstown, OH 44507*
*Phone: (330) 783-1900 | Email: office@saintdominic.org*
