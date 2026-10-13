# 간단한 날씨 웹앱

HTML, CSS, JavaScript와 Node.js 기본 HTTP 서버로 만든 예제입니다. 프레임워크나 외부 패키지 설치가 필요 없습니다.

## 파일 구조

```text
weather-app/
├── frontend/          # 브라우저에서 실행
│   ├── index.html     # 화면 구조
│   ├── style.css      # 화면 디자인 / 모바일 대응
│   └── app.js         # 검색 요청 / 결과 표시
├── backend/           # 서버에서 실행
│   └── server.js      # 프론트엔드 제공 / 외부 API 호출
├── package.json
└── README.md
```

## 실행 방법

1. [Node.js](https://nodejs.org/) 22 이상을 설치합니다.
2. 터미널에서 이 `weather-app` 폴더를 엽니다. VS Code에서는 폴더를 연 뒤 **터미널 → 새 터미널**을 선택하면 됩니다.
3. 설치 여부를 확인합니다.

   ```powershell
   node --version
   ```

4. 서버를 실행합니다. `npm install`은 필요 없습니다.

   ```powershell
   npm start
   ```

   PowerShell에서 `npm.ps1` 실행 정책 오류가 발생하면 `node backend/server.js`를 실행합니다.

5. 브라우저에서 **http://localhost:3000**을 엽니다. HTML 파일을 직접 더블 클릭하지 말고 이 주소를 이용하세요.
6. `서울`, `부산`, `Tokyo`, `London` 등의 도시 이름을 입력하고 **날씨 확인**을 누릅니다. Enter 키로도 검색할 수 있습니다.
7. 종료하려면 서버를 실행한 터미널에서 **Ctrl+C**를 누릅니다.

3000번 포트를 다른 프로그램이 사용하고 있다면 PowerShell에서 다음처럼 변경합니다.

```powershell
$env:PORT = '3001'
node backend/server.js
```

이때 접속 주소는 http://localhost:3001 입니다.

## 작동 방식

1. 프론트엔드가 `GET /api/weather?city=서울`을 백엔드에 요청합니다.
2. 백엔드가 Open-Meteo Geocoding API로 도시의 위도·경도를 찾습니다.
3. 백엔드가 Open-Meteo Forecast API의 `current` 데이터로 현재 날씨를 요청합니다.
4. 프론트엔드가 기온, 날씨 상태, 체감 온도, 습도, 풍속, 현지 기준 시각을 표시합니다.

주요 한국어 도시명은 영문 검색어로 변환합니다. 검색이 안 되는 도시는 영문 이름으로 시도하세요. 동명 도시는 API의 첫 번째 검색 결과를 사용하므로 표시된 국가와 지역을 확인하세요.

빈 입력, 잘못된 도시, API 오류, 요청 시간 초과 시 안내 메시지를 표시합니다. 백엔드는 프로젝트 내 지정된 프론트엔드 파일만 제공합니다.

## 데이터 제공

- [Open-Meteo 날씨 API 문서](https://open-meteo.com/en/docs)
- [Open-Meteo 도시 검색 API 문서](https://open-meteo.com/en/docs/geocoding-api)
- [이용 조건 및 무료 API 한도](https://open-meteo.com/en/terms)

무료 API는 비상업적 용도로 API 키 없이 사용할 수 있습니다. 상업적 사용에는 별도 이용 조건이 적용됩니다. 현재 날씨는 기상 모델 기반 데이터이며 관측소의 실시간 측정값과 차이가 있을 수 있습니다. 날씨 조회에는 인터넷 연결이 필요합니다.
