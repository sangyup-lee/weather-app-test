// Node.js 기본 모듈만 사용합니다. 별도 패키지 설치가 필요 없습니다.
import http from 'node:http';
import { readFile } from 'node:fs/promises';

const files = {
  '/': ['index.html', 'text/html'],
  '/style.css': ['style.css', 'text/css'],
  '/app.js': ['app.js', 'text/javascript'],
};
import { json, handleWeather } from './weather.js';

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (req.method !== 'GET') return json(res, 405, { error: 'GET 요청만 지원합니다.' });
    if (url.pathname === '/api/weather') return await handleWeather(req, res);
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
