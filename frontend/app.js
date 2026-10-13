const form = document.querySelector('#weather-form');
const status = document.querySelector('#status');
const card = document.querySelector('#weather');
const button = document.querySelector('#submit');
const setText = (id, value) => { document.getElementById(id).textContent = value; };

// Open-Meteo의 WMO 날씨 코드를 한국어로 표시합니다.
function condition(code, isDay) {
  if (code === 0) return [isDay ? '☀️' : '🌙', '맑음'];
  if (code === 1) return ['🌤️', '대체로 맑음'];
  if (code === 2) return ['⛅', '구름 조금'];
  if (code === 3) return ['☁️', '흐림'];
  if ([45, 48].includes(code)) return ['🌫️', '안개'];
  if ([51, 53, 55, 56, 57].includes(code)) return ['🌦️', '이슬비'];
  if ([61, 63, 65, 66, 67].includes(code)) return ['🌧️', '비'];
  if ([71, 73, 75, 77, 85, 86].includes(code)) return ['❄️', '눈'];
  if ([80, 81, 82].includes(code)) return ['🌧️', '소나기'];
  if ([95, 96, 99].includes(code)) return ['⛈️', '뇌우'];
  return ['🌡️', '날씨 정보'];
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = document.querySelector('#city').value.trim();
  card.hidden = true;
  status.hidden = false;
  status.className = '';
  if (city.length < 2) { status.textContent = '도시 이름을 2자 이상 입력해 주세요.'; return; }
  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  status.textContent = '도시의 날씨를 가져오는 중입니다…';
  try {
    // 외부 API는 백엔드에서 호출하며, 브라우저는 우리 서버에만 요청합니다.
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, { signal: AbortSignal.timeout(25000) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '날씨 조회에 실패했습니다.');
    const current = data.current;
    const [icon, description] = condition(current.weather_code, current.is_day);
    setText('location', data.location.name);
    setText('region', [data.location.region, data.location.country].filter(Boolean).join(' · '));
    setText('icon', icon);
    setText('temperature', `${Math.round(current.temperature_2m)}°C`);
    setText('description', description);
    setText('feels-like', `${Math.round(current.apparent_temperature)}°C`);
    setText('humidity', `${current.relative_humidity_2m}%`);
    setText('wind', `${current.wind_speed_10m} m/s`);
    setText('updated', `기준 시각: ${current.time.replace('T', ' ')} (${data.timezone}, 현지 시간)`);
    card.hidden = false;
    status.textContent = `${data.location.name}의 날씨를 가져왔습니다.`;
    status.hidden = true;
  } catch (error) {
    status.className = 'error';
    status.textContent = error.name === 'TimeoutError' ? '응답 시간이 초과되었습니다. 다시 시도해 주세요.' : error.message === 'Failed to fetch' ? '서버에 연결할 수 없습니다. 서버 실행 상태를 확인해 주세요.' : error.message;
  } finally {
    button.disabled = false;
    form.removeAttribute('aria-busy');
  }
});
