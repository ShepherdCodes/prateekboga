# Prateek "Shepherd" Boga — portfolio update

Hero → A little context → Four tiles → Metrics → Contact.

## Publishing
Upload the contents of this folder to the repository root, replacing the previous index.html, styles.css, script.js, and content.json. Keep existing personal assets if needed. In GitHub Settings → Pages use Deploy from a branch → main → /(root). No build step required. Relative paths support project repositories and custom domains.

## Preview
Inside this folder run `python -m http.server 8000`, then visit http://localhost:8000. Do not open via file:// because the JSON fetch may be blocked.

## Logo
Put your future logo in assets/logo.png (or an SVG/WebP file) and set logoImage in content.json to "assets/logo.png". Until then a circular PB fallback is shown. A broken image also falls back to PB. Transparent square artwork works well. The adjacent text always retains the full display name.

## Editing
Edit content.json. The display name is Prateek "Shepherd" Boga. In JSON embedded quotation marks must remain escaped as generated. The roles and pursuit-of-excellence sentence appear directly under the hero name. Add your email to enable the mailto button; no backend form is included.

Metrics now contain three entries: publications, total running distance in km, and longest single run in km. Enter verified values in value (numbers or strings), optional sourceUrl, and updatedAt (e.g. YYYY-MM-DD). Null shows a dash, not a fake zero. Example entry: {"value":1234.5,"label":"Total running distance · km","sourceUrl":"","updatedAt":""}. Example values are not achievements.

Tiles without a url open draft detail dialogs. Set an https:// URL to link to a dedicated future page. No additional webpages are built yet.

## Automation status and privacy
No scraping or authenticated API integration is installed. Values remain manual. The JSON shape supports later updates by a scheduled backend or GitHub Actions process. Never put Garmin keys, passwords, tokens, or third-party API secrets in content.json, browser JavaScript, or a public repository. Only publish aggregate values, not activity locations, raw routes, or private account data.

For historical running metrics, sum distances and take the maximum single-activity distance over the complete, deduplicated set of run activities, excluding cycling/walking and explicitly deciding whether to include treadmill/trail/virtual runs. An incomplete sync must not be labelled all-time. Garmin API history availability must be checked before implementing. A one-time historical export plus incremental updates may be necessary.
For publications, define the count (e.g. deduplicated published works; preprints excluded if subsequently published). A Scholar profile count may differ from a curated publication count.

Fonts are loaded from Google Fonts with local system fallbacks. Original CSS/SVG hero art is retained; no uploaded photos are included. Review at desktop/mobile widths before publishing. No live API connection or browser-based visual testing is claimed.
