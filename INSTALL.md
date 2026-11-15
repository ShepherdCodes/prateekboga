# Endurance add-on — no homepage files replaced

## Install
Copy only endurance.html, endurance.css, endurance.js, endurance-data.json to the SAME folder as your current index.html. Copy the new endurance-images folder as well. These filenames are new. Do not replace your existing index.html, styles.css, script.js, counters.js, or content.json. Preview with your existing server at http://localhost:8000/endurance.html (adjust port if needed). Upload the new files to GitHub alongside the existing site.

## Add the homepage menu link
In your CURRENT index.html find the existing <nav aria-label="Main navigation"> and insert this alongside its existing links:
<a href="endurance.html">Endurance</a>
Do not replace the whole header. Preserve your existing logo and edits. The new page has its own Home / Explore / Endurance / Contact header. To match a customised homepage header exactly, copy your markup carefully, and change homepage anchors such as #contact to index.html#contact. No Research/Art/Book standalone links are added because those pages do not exist yet.

## Link your existing Endurance tile
In your CURRENT content.json, locate the Endurance tile and set only its url field to "endurance.html".
IMPORTANT: the earlier script.js safeURL function accepts only absolute URLs. To support relative local page links, find:
const u=new URL(s);
and change it to:
const u=new URL(s, document.baseURI);
If your function uses the variable name value instead of s, retain that variable name:
const u=new URL(value, document.baseURI);
Keep the rest of safeURL unchanged. Now endurance.html resolves relative to your current site, including GitHub project paths. Alternatively use the full published https:// URL in the tile; that requires no script.js edit but points local preview to the published site.

## Photos and content
Add images to endurance-images/. In endurance-data.json set:
"beforeImage": "endurance-images/before.jpg"
"afterImage": "endurance-images/after.jpg"
Within each event set image to a matching file path, time to your actual finish time (e.g. HH:MM:SS), name to the real event, date to the desired display text, and story to your account. No finish times, race names, or dates are invented. Use descriptive imageAlt text. Filenames are case-sensitive on GitHub hosting. Crop images to suit the paired portraits; CSS uses object-fit:cover and centered positioning. You can adjust object-position in endurance.css.

## Chronology and the graphic
The events array is ordered 21.1 → 42.2 → 73.1 → 53.1 → 100.4 km exactly as supplied. Never sort it by distance. The illustrated chart uses true event distance as its x-axis. Consequently the runner travels backward for 73.1 → 53.1, then forward again. It is NOT cumulative distance. The synthetic elevation profile is deterministic, so it does not jump around on refresh; it is explicitly labelled illustrative. It is not measured terrain.

A sticky chart stays beside scrolling race photographs on desktop and above the stories on smaller screens. The runner position interpolates between race milestones as the page scrolls; it reaches each exact event distance when that story is centered in the reading region. Photos are part of the scrollable story, never hidden; nearby stories may also be partly visible. Scrolling backward reverses the runner. Milestone links jump to stories. Reduced-motion users get a static profile and all stories without a moving runner or pinned chart.

## Future distances
Append an event object to the end of events. Maximum axis distance recalculates from Math.max of all events, so a future 120 km race extends the chart automatically. Adding a shorter event keeps the maximum while preserving chronology. Profile geometry rescales with the maximum: this is decorative terrain, not a fixed geographic track. Empty events or nonpositive/non-numeric distances report a content-loading error.

## Design and testing
This page uses its own endurance.css with en-prefixed classes and does not import or alter your existing stylesheet. Its default palette matches the original olive/charcoal package, not any later unshared changes. Adjust --en-* variables in endurance.css to your current palette. All hero wording is editable in endurance-data.json. The callsign is retained in the header/footer. Your existing files were not available during creation and are not bundled. Functional browser/visual testing has not been performed: check desktop and mobile locally before publishing.
