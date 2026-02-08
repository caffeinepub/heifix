# Specification

## Summary
**Goal:** Replace the current HEIFIX hero and logo visuals with more realistic (photorealistic) static images and update the UI to use them.

**Planned changes:**
- Create photorealistic replacements for the existing hero and logo images as new static assets under `frontend/public/assets/generated`.
- Update `frontend/src/App.tsx` to point the header logo `<img>` and Home page hero `<img>` to the new realistic image filenames.

**User-visible outcome:** The Home page hero and header logo appear more realistic/photorealistic and load correctly without broken image links.
