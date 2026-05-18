# saintdominic.org Domain Transfer Checklist

Prepared for the migration from eCatholic to the GitHub Pages-hosted St. Dominic site.

## Current State

- Registrar account: GKG.net.
- Current authoritative nameservers: `mario.ns.cloudflare.com` and `nataly.ns.cloudflare.com`.
- Current web target: `saintdominic.org` and `www.saintdominic.org` are CNAME records pointing to `cf.sites.ecatholic.com`.
- Email is Google Workspace and must be preserved.
- eCatholic will keep the current site/DNS active until the cancellation form is submitted.
- eCatholic Payments is bundled with the eCatholic hosting plan and is not part of this transfer.

## Records To Preserve

Keep these records exactly unless Google Workspace gives new values:

| Type | Host | Priority | Value |
| --- | --- | --- | --- |
| MX | `@` | 1 | `aspmx.l.google.com.` |
| MX | `@` | 5 | `alt1.aspmx.l.google.com.` |
| MX | `@` | 5 | `alt2.aspmx.l.google.com.` |
| MX | `@` | 10 | `alt3.aspmx.l.google.com.` |
| MX | `@` | 10 | `alt4.aspmx.l.google.com.` |
| TXT | `@` | | `"v=spf1 include:_spf.google.com ~all"` |

## Records To Change At Launch

These replace the eCatholic web records.

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `jmmarquez2025.github.io.` |

Remove the old eCatholic web records:

- `saintdominic.org CNAME cf.sites.ecatholic.com.`
- `www.saintdominic.org CNAME cf.sites.ecatholic.com.`
- `_acme-challenge.saintdominic.org CNAME saintdominic.org.b990d23246b0988a.dcv.cloudflare.com.`

## GitHub Pages Launch Steps

Until launch, keep the GitHub Pages project URL build active with Vite `base`
set to `/st-dom-yt-website/` and `VITE_SITE_URL` set to
`https://jmmarquez2025.github.io/st-dom-yt-website`.

1. Merge/deploy the production-domain build where Vite `base` is `/` and `VITE_SITE_URL` is `https://saintdominic.org`.
2. In GitHub Pages settings for `jmmarquez2025/st-dom-yt-website`, set the custom domain to `saintdominic.org`.
3. Update DNS at the authoritative DNS provider:
   - If staying on GKG DNS, first enable/use GKG DNS Zone Hosting, change nameservers to `NS3.GKG.NET` and `NS4.GKG.NET`, and recreate the preserved mail records plus the new GitHub Pages web records.
   - If using another DNS provider, create the same records there and point GKG nameservers to that provider.
4. Wait for DNS to resolve:
   - `dig saintdominic.org A`
   - `dig www.saintdominic.org CNAME`
   - `dig saintdominic.org MX`
5. In GitHub Pages settings, wait for the TLS certificate to issue, then enforce HTTPS.
6. Verify `https://saintdominic.org/`, `https://www.saintdominic.org/`, `/sitemap.xml`, and `/robots.txt`.
7. Only after the new site is live and verified, coordinate any eCatholic cancellation date. Do not cancel eCatholic before online giving/payment migration is settled.

## References

- GitHub Pages custom domain DNS records: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GKG DNS FAQ and DNS Zone Hosting notes: https://www.gkg.net/domain/support/faq/dns.html
