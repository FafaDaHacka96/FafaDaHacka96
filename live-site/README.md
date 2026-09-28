# Live content for fayssal-tutoring.netlify.app

Change text on the website (rates, availability, announcements, subjects, testimonials, contact links) in about a minute, without redeploying on Netlify.

## How it works

```
You edit content.json  ──►  GitHub (this repo)  ──►  live-content.js on your site
(admin.html or github.com)                          fetches it on every page view
                                                    and swaps the text in
```

- The site's HTML only has to be deployed to Netlify **once**, after you add the script tag and mark the editable parts.
- After that, each change is one commit to `live-site/content.json`. Visitors see it on their next page load, usually within a minute.
- If GitHub can't be reached, the page just shows the text already written in the HTML.

### What this changes and what it doesn't

- **Your visitors** see edits right away.
- **Google search results** (the title and snippet under your link) only change when Google re-crawls the page. No tool can make that instant. Google does run JavaScript, so it will pick up the live text on its next visit. Still, keep the important text written into the HTML too, since that's the fallback and what gets indexed most reliably.
- **Layout and design changes** (new sections, colours, images in new places) still need a normal Netlify deploy. This setup is for the *text and links* inside sections you've marked.

## One-time setup

### 1. Add the script to your site

Copy `live-content.js` into your site's folder, next to `index.html`, and add this line inside `<head>`:

```html
<script src="live-content.js" defer></script>
```

### 2. Mark the parts you want to edit

Add a `data-live` attribute naming the field in `content.json`. Keep your current text inside as the fallback:

```html
<p>Rate: <span data-live="rates.individual">$40 / hour</span></p>
```

| Attribute | What it does | Example |
|---|---|---|
| `data-live="key"` | Replaces the element's text | `<span data-live="availability">…</span>` |
| `data-live-html="key"` | Replaces the element's HTML (allows `<b>`, links) | `<p data-live-html="about">…</p>` |
| `data-live-href="key"` | Sets a link's `href` (an email becomes `mailto:` automatically) | `<a data-live-href="contact.bookingLink">Book</a>` |
| `data-live-src="key"` | Sets an image's `src` | `<img data-live-src="photo">` |
| `data-live-show="key"` | Shows the element when the value is `true`, hides it when `false` | `<div data-live-show="announcement.show" hidden>…</div>` |
| `data-live-list="key"` | Repeats the inner `<template>` once per list item | see below |

Nested fields use dots: `rates.individual` means the `individual` field inside `rates`.

Lists: put a `<template>` inside the list element. Everything else inside it is the fallback and gets replaced.

```html
<!-- "subjects": ["Calculus", "Physics"] -->
<ul data-live-list="subjects">
  <template><li data-live-item></li></template>
  <li>Calculus</li>
</ul>

<!-- "testimonials": [{ "quote": "…", "name": "…" }] -->
<div data-live-list="testimonials">
  <template>
    <blockquote><p data-live-item="quote"></p><footer data-live-item="name"></footer></blockquote>
  </template>
</div>
```

`example.html` shows every attribute in a working page.

Then deploy to Netlify once, as usual.

### 3. Make `content.json` match your site

Edit `live-site/content.json` so the values match what's on your site now. The values in it are placeholders. Add or rename fields freely; just keep the `data-live` names in your HTML in sync.

### 4. Set up the editor (optional, but easiest)

`admin.html` is a form for editing `content.json` from any browser, including your phone.

1. Create a GitHub token: **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
   - Repository access: **Only select repositories** → `FafaDaHacka96/FafaDaHacka96`
   - Permissions: **Contents → Read and write**
2. Put `admin.html` in your site folder too (it goes live with the same one-time deploy), then open `https://fayssal-tutoring.netlify.app/admin.html`.
3. Open **Connection settings**, paste the token, and click **Save and load content**.

The page contains no secrets. The token is kept only in your own browser's storage, so a visitor who finds `/admin.html` can't change anything. Don't paste the token into anything else, and revoke it on GitHub if a device is lost.

## Making a change

**With the editor:** open `/admin.html`, change a field, click **Publish** (or Ctrl/Cmd + S). Each field shows its key (e.g. `rates.individual`), which is the name to use in `data-live`.

**Without the editor:** on github.com, open `live-site/content.json`, click the pencil icon, edit, and **Commit changes**. This works from the GitHub mobile app too.

## Limits

- This repo must stay **public**, because visitors' browsers read `content.json` directly. Only put text here that's meant to be on the website anyway.
- The script reads from the GitHub API, which allows 60 fresh reads per hour per visitor network. Past that it switches to `raw.githubusercontent.com`, where changes can take up to ~5 minutes to show.
- Visitors may briefly see the built-in text before the live text loads. Keeping the HTML close to the live content makes this unnoticeable.

## Files

| File | Purpose |
|---|---|
| `content.json` | The editable content |
| `live-content.js` | Add to your site. Loads `content.json` and fills in the page |
| `admin.html` | Editor that saves changes to GitHub |
| `example.html` | Demo page using every attribute |
