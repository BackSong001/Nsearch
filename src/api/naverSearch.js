import axios from 'axios';

const YOUR_NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const YOUR_NAVER_CLIENT_SECRET = import.meta.env.VITE_NAVER_CLIENT_SECRET;

export const naverSearchAPI = axios.create({
  baseURL: '/v1/search',
  headers: {
    'X-Naver-Client-Id': YOUR_NAVER_CLIENT_ID,
    'X-Naver-Client-Secret': YOUR_NAVER_CLIENT_SECRET,
  },
});

const endpoints = {
  kin: '/kin',
  blog: '/blog',
  news: '/news',
  webkr: '/webkr',
  image: '/image',
  shop: '/shop',
};

export const fetchChunked = async (endpoint, baseParams, totalDisplay) => {
  const maxDisplayPerReq = 100; // API limits per request
  let items = [];
  let remaining = totalDisplay;
  let start = 1;
  const requests = [];

  // Fetch up to totalDisplay by chunking into requests of size up to 100
  while (remaining > 0 && start <= 1000) {
    const d = Math.min(remaining, maxDisplayPerReq);
    let actualDisplay = d;
    if (start + actualDisplay - 1 > 1000) {
      actualDisplay = 1000 - start + 1;
    }
    if (actualDisplay <= 0) break;

    requests.push(
      naverSearchAPI.get(endpoint, {
        params: { ...baseParams, display: actualDisplay, start }
      }).catch(err => {
        console.error(`Error fetching ${endpoint} start=${start}`, err);
        return { data: { items: [] } };
      })
    );
    start += actualDisplay;
    remaining -= actualDisplay;
  }

  const responses = await Promise.all(requests);
  for (const r of responses) {
    if (r && r.data && r.data.items) {
      items = items.concat(r.data.items);
    }
  }
  return items;
};

export const getResultsForCategory = async (rawQuery, category, totalDisplay) => {
  const targetCategory = category || 'all';

  if (targetCategory === 'all') {
    const targets = ['blog', 'news', 'kin']; // 대표 3개 API 병합
    const perTarget = Math.ceil(totalDisplay / targets.length);
    const results = await Promise.all(targets.map(t => fetchChunked(endpoints[t], { query: rawQuery }, perTarget)));

    // 교차 병합 (Interleaving)
    const merged = [];
    let i = 0;
    while (results.some(arr => i < arr.length)) {
      if (i < results[0].length) merged.push({ ...results[0][i], _type: 'blog' });
      if (i < results[1].length) merged.push({ ...results[1][i], _type: 'news' });
      if (i < results[2].length) merged.push({ ...results[2][i], _type: 'kin' });
      i++;
    }
    return merged.slice(0, totalDisplay);
  } else {
    const ep = endpoints[targetCategory] || '/blog';
    const items = await fetchChunked(ep, { query: rawQuery }, totalDisplay);
    return items.map(item => ({ ...item, _type: targetCategory }));
  }
};
