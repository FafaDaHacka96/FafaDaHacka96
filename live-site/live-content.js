/*
 * live-content.js
 *
 * Fills parts of a static page with values from content.json in GitHub, so
 * text can change without redeploying the site. Add once to the page:
 *
 *   <script src="live-content.js" defer></script>
 *
 * then mark the elements to keep live, e.g. <span data-live="rates.individual">$40 / hour</span>.
 * The text already in the HTML stays as the fallback (and is what search engines index).
 *
 * Optional attributes on the <script> tag:
 *   data-repo  GitHub "owner/repo" holding the content (default below)
 *   data-path  path of the JSON file in that repo (default below)
 *   data-src   load from this URL instead of GitHub (useful for local testing)
 */
(function () {
  'use strict';

  var DEFAULT_REPO = 'FafaDaHacka96/FafaDaHacka96';
  var DEFAULT_PATH = 'live-site/content.json';

  var script = document.currentScript;
  var repo = (script && script.getAttribute('data-repo')) || DEFAULT_REPO;
  var path = (script && script.getAttribute('data-path')) || DEFAULT_PATH;
  var src = script && script.getAttribute('data-src');

  function fetchJson(url, options) {
    return fetch(url, options).then(function (res) {
      if (!res.ok) throw new Error(url + ' responded ' + res.status);
      return res.json();
    });
  }

  function loadContent() {
    if (src) return fetchJson(src, { cache: 'no-cache' });
    // The GitHub API reflects a commit within seconds and its 304 revalidations
    // don't count toward the 60 requests/hour/IP limit. If the limit is hit anyway,
    // fall back to raw.githubusercontent.com, which lags by up to ~5 minutes.
    var api = 'https://api.github.com/repos/' + repo + '/contents/' + path;
    var raw = 'https://raw.githubusercontent.com/' + repo + '/HEAD/' + path;
    return fetchJson(api, {
      cache: 'no-cache',
      headers: { Accept: 'application/vnd.github.raw+json' }
    }).catch(function () {
      return fetchJson(raw + '?t=' + Date.now());
    });
  }

  function lookup(data, key) {
    return key.split('.').reduce(function (obj, part) {
      return obj == null ? undefined : obj[part];
    }, data);
  }

  function toHref(value) {
    var s = String(value);
    // A bare email address becomes a mailto: link.
    return s.indexOf('@') > 0 && s.indexOf(':') === -1 ? 'mailto:' + s : s;
  }

  function each(root, attr, fn) {
    var nodes = root.querySelectorAll('[' + attr + ']');
    for (var i = 0; i < nodes.length; i++) {
      fn(nodes[i], nodes[i].getAttribute(attr));
    }
  }

  function isScalar(value) {
    return typeof value === 'string' || typeof value === 'number';
  }

  // Applies one data object to every data-live-* element under root.
  // itemAttr is the attribute used for keys ("data-live" or, inside lists, "data-live-item").
  function apply(root, data, itemAttr) {
    each(root, 'data-live-list', function (el, key) {
      var items = lookup(data, key);
      var template = el.querySelector(':scope > template');
      if (!Array.isArray(items) || !template) return;
      Array.prototype.slice.call(el.children).forEach(function (child) {
        if (child !== template) el.removeChild(child);
      });
      items.forEach(function (item) {
        var fragment = template.content.cloneNode(true);
        fill(fragment, item);
        el.appendChild(fragment);
      });
    });

    var get = function (key) { return lookup(data, key); };
    each(root, itemAttr, function (el, key) {
      var value = get(key);
      if (isScalar(value)) el.textContent = value;
    });
    each(root, itemAttr + '-html', function (el, key) {
      var value = get(key);
      if (isScalar(value)) el.innerHTML = value;
    });
    each(root, itemAttr + '-href', function (el, key) {
      var value = get(key);
      if (isScalar(value)) el.setAttribute('href', toHref(value));
    });
    each(root, itemAttr + '-src', function (el, key) {
      var value = get(key);
      if (isScalar(value)) el.setAttribute('src', value);
    });
    each(root, itemAttr + '-show', function (el, key) {
      var value = get(key);
      if (value !== undefined) el.hidden = !value;
    });
  }

  // Fills one cloned list item. A plain string item goes into the element marked
  // data-live-item=""; an object item uses its field names, e.g. data-live-item="name".
  function fill(fragment, item) {
    if (isScalar(item)) {
      each(fragment, 'data-live-item', function (el) { el.textContent = item; });
    } else if (item && typeof item === 'object') {
      apply(fragment, item, 'data-live-item');
    }
  }

  function run() {
    loadContent().then(function (data) {
      apply(document, data, 'data-live');
      document.documentElement.classList.add('live-content-loaded');
      document.dispatchEvent(new CustomEvent('live-content:loaded', { detail: data }));
    }).catch(function (err) {
      // Keep the page's built-in text if the content can't be fetched.
      console.warn('[live-content] using the page\'s built-in text:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
