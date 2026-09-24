# LIBO Scholarship

Responsive Arabic/English educational services landing page. React, TypeScript, and Vite; all images and fonts are served locally. Arabic is the default. No backend or external credentials are required.

## Run

```sh
npm install
npm run dev
```

## Verify and build

```sh
npx playwright install chromium
npm test
npm run build
npm run preview
```

The production build is generated in `dist/`. Host that directory with any static hosting service. Deployment is not configured.

## Content and contact details

Edit `src/content.ts` for translations, service descriptions, FAQs, and contact constants. The service IDs are shared between languages to preserve form selections. A local storage preference named `libo-language` remembers the selected language.

The form creates a WhatsApp message to +218921100078. The visitor must send the message in WhatsApp; the site does not send it automatically or retain enquiry details. A direct link remains available if a browser blocks the new window. No analytics, cookies, form storage, or server submissions are implemented.

## Assets

The supplied LIBO Scholarship logo is stored unchanged at `public/images/libo-logo.jpeg`. Photography is downloaded from Unsplash and used under the [Unsplash License](https://unsplash.com/license). Destination photography is illustrative; it does not imply a university partnership or programme availability.

| Local file    | Original asset                                               |
| ------------- | ------------------------------------------------------------ |
| campus.jpg    | https://images.unsplash.com/photo-1562774053-701939374585    |
| graduates.jpg | https://images.unsplash.com/photo-1541339907198-e08756dedf3f |
| london.jpg    | https://images.unsplash.com/photo-1513635269975-59663e0ac1ad |
| china.jpg     | https://images.unsplash.com/photo-1508804185872-d7badad00f7d |
| istanbul.jpg  | https://images.unsplash.com/photo-1524231757912-21f4fe3a7200 |
| malaysia.jpg  | https://images.unsplash.com/photo-1596422846543-75c6fc197f07 |

Tajawal and DM Sans fonts are bundled through Fontsource; their license files are included in `public/licenses/` and the production build. Icons are from Lucide (ISC license).

The About section uses `public/images/graduates-men.png`, edited from the original `graduates.jpg` with the built-in imagegen tool at the user's request. The original is retained. Final edit prompt:

> Use case: precise-object-edit. Asset type: LIBO Scholarship website graduation photograph. Edit the supplied photograph so all seven foreground graduates are adult men with short hairstyles, wearing the same black graduation gowns with teal and gold hoods, dark trousers and appropriate shoes. Preserve the seven-person group, their rear-facing positions and celebratory raised-arm poses, tossed graduation caps, original landscape composition and aspect ratio, Singapore skyline, park, warm sunset, colors, lighting and photographic realism. Change only the foreground graduates as needed to make them men; keep the background and rest of the scene unchanged. No text or watermarks.

Browser tests cover Arabic/English language persistence, enquiry validation and message encoding, blocked-window fallbacks, card prefilling, FAQs, contact links, image loading, responsive overflow, mobile navigation, and automated accessibility checks at desktop, tablet, and mobile sizes. No test sends a WhatsApp message.
