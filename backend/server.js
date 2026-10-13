// Node.js 기본 모듈만 사용합니다. 별도 패키지 설치가 필요 없습니다.
import http from 'node:http';
import { readFile } from 'node:fs/promises';

const files = {
  '/': ['index.html', 'text/html'],
  '/style.css': ['style.css', 'text/css'],
  '/app.js': ['app.js', 'text/javascript'],
};
const aliases = { '서울': 'Seoul', '부산': 'Busan', '인천': 'Incheon', '대구': 'Daegu', '대전': 'Daejeon', '광주': 'Gwangju', '제주': 'Jeju', '도쿄': 'Tokyo', '런던': 'London', '뉴욕': 'New York', '파리': 'Paris' };

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}

async function fetchJSON(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Weather API status: ${response.status}`);
  return response.json();
}

async function weather(city) {
  // 1. 도시 이름을 위도·경도로 변환합니다.
  const geoURL = new URL('https://geocoding-api.open-meteo.com/v1/search');
  geoURL.search = new URLSearchParams({ name: aliases[city] || city, count: '1', language: 'ko', format: 'json' });
  const geo = await fetchJSON(geoURL);
  const location = geo.results?.[0];
  if (!location) return null;

  // 2. 해당 좌표의 현재 날씨를 가져옵니다. API 키는 사용하지 않습니다.
  const weatherURL = new URL('https://api.open-meteo.com/v1/forecast');
  weatherURL.search = new URLSearchParams({
    latitude: String(location.latitude), longitude: String(location.longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
    timezone: 'auto', wind_speed_unit: 'ms',
  });
  const data = await fetchJSON(weatherURL);
  if (!data.current || !Number.isFinite(data.current.temperature_2m)) throw new Error('Missing weather data');
  return { location: { name: location.name, country: location.country, region: location.admin1 }, current: data.current, timezone: data.timezone };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (req.method !== 'GET') return json(res, 405, { error: 'GET 요청만 지원합니다.' });
    if (url.pathname === '/api/weather') {
      const city = (url.searchParams.get('city') || '').trim();
      if (city.length < 2 || city.length > 100) return json(res, 400, { error: '도시 이름을 2~100자로 입력해 주세요.' });
      const result = await weather(city);
      return result ? json(res, 200, result) : json(res, 404, { error: '도시를 찾을 수 없습니다. 영문 이름으로도 검색해 보세요.' });
    }
    const file = files[url.pathname];
    if (!file) return json(res, 404, { error: '페이지를 찾을 수 없습니다.' });
    const content = await readFile(new URL(`../frontend/${file[0]}`, import.meta.url));
    res.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8` });
    res.end(content);
  } catch (error) {
    console.error(error.message);
    json(res, 502, { error: '날씨 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.' });
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, '127.0.0.1', () => console.log(`날씨 앱: http://localhost:${port}`));
