const MEDIA_CACHE_NAME = 'pma-media-v1';

/**
 * @param {string} url
 * @returns {string}
 */
export function resolveMediaUrl(url) {
  if (typeof url !== 'string' || !url.trim()) {
    return '';
  }
  try {
    return new URL(url, window.location.href).href;
  } catch {
    return url;
  }
}

/**
 * GET a URL as a blob, reading from Cache Storage when possible.
 * Authenticated responses are keyed by URL + Authorization so a new token does not reuse old bytes incorrectly.
 *
 * @param {string} url
 * @param {{ token?: string, signal?: AbortSignal }} [options]
 * @returns {Promise<{ blob: Blob, contentType: string }>}
 */
export async function fetchCachedMedia(url, options = {}) {
  const { token, signal } = options;
  const resolvedUrl = resolveMediaUrl(url);
  if (!resolvedUrl) {
    throw new Error('fetchCachedMedia: invalid url');
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const request = new Request(resolvedUrl, {
    method: 'GET',
    headers,
    mode: 'cors',
    credentials: 'omit',
    signal,
  });

  async function fromNetwork() {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${resolvedUrl}`);
    }
    const blob = await response.blob();
    return {
      blob,
      contentType: response.headers.get('content-type') || '',
    };
  }

  if (typeof caches === 'undefined') {
    return fromNetwork();
  }

  let cache;
  try {
    cache = await caches.open(MEDIA_CACHE_NAME);
  } catch {
    return fromNetwork();
  }

  try {
    const cached = await cache.match(request);
    if (cached && cached.ok) {
      const blob = await cached.blob();
      return {
        blob,
        contentType: cached.headers.get('content-type') || '',
      };
    }
  } catch {
    // fall through to network
  }

  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${resolvedUrl}`);
  }

  try {
    await cache.put(request, response.clone());
  } catch (err) {
    console.warn('[mediaCache] cache.put failed', err);
  }

  const blob = await response.blob();
  return {
    blob,
    contentType: response.headers.get('content-type') || '',
  };
}
