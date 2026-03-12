# Homepage Structure

## Overview

Korean Defense Conference Deadlines 홈페이지는 **프레임워크 없이** 순수 HTML, CSS, JavaScript로 만들어진 정적 사이트이다.
GitHub Pages에서 호스팅되며, 빌드 과정 없이 바로 배포된다.

## File Tree

```
k-def-conf-deadline.github.io/
├── index.html              # 메인 페이지 (진입점)
├── css/
│   └── style.css           # 전체 스타일시트
├── js/
│   └── main.js             # 렌더링 로직 및 카운트다운 타이머
├── data/
│   ├── conferences.js      # 컨퍼런스 데이터 (JS 전역변수) ← 편집 대상
│   └── conferences.json    # 컨퍼런스 데이터 (JSON 원본, 백업용)
├── assets/                 # 이미지, 파비콘 등 (현재 비어있음)
├── CLAUDE.md               # Claude 작업 규칙
├── Direction.md            # 기능 요구사항
├── history.md              # 작업 히스토리
└── README.md               # 레포 설명
```

## Page Layout

페이지는 3개의 영역으로 구성된다:

```
┌─────────────────────────────────────┐
│           Header                    │
│  "Korean Defense Conference         │
│   Deadlines"                        │
├─────────────────────────────────────┤
│                                     │
│  Upcoming Deadlines (섹션 제목)      │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ [카운트다운 카드]              │    │
│  │ 좌측: 이름, 설명, 일정, 장소  │    │
│  │ 우측: 카운트다운, 마감일시     │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ [카운트다운 카드] ...         │    │
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│           Footer                    │
│  "Last updated: ..."                │
└─────────────────────────────────────┘
```

## Key Files

### `index.html`
- 페이지의 뼈대 (Header, Main, Footer)
- `data/conferences.js`를 먼저 로드한 뒤 `js/main.js`를 로드한다
- `id="countdowns"` div에 카운트다운 카드들이 동적으로 삽입된다
- `id="last-updated"` span에 마지막 업데이트 날짜가 표시된다

### `data/conferences.js`
- `CONFERENCE_DATA` 전역변수에 모든 컨퍼런스 정보를 담고 있다
- **주간 업데이트 시 이 파일만 편집하면 된다**
- 각 컨퍼런스 객체의 필드:

| Field | Type | Description |
|---|---|---|
| `id` | string | 고유 식별자 (예: `"kdsa-2026"`) |
| `name` | string | 짧은 이름 (예: `"KDSA 2026"`) |
| `fullName` | string | 정식 명칭 |
| `description` | string | 컨퍼런스 한줄 설명 |
| `url` | string | 공식 웹사이트 URL |
| `downloadUrl` | string | CFP 다운로드 URL |
| `location` | string | 개최 장소 (예: `"Seoul, South Korea"`) |
| `dates` | string | 개최 기간 (예: `"2026-09-15 ~ 2026-09-17"`) |
| `deadlines` | array | 마감일 목록 (`type`, `date`) |
| `acceptedPapers` | array | 채택 논문 목록 (`title`, `authors`, `url`) |

- `deadlines[].date` 형식: ISO 8601 (`"2026-05-15T23:59:00+09:00"`)

### `js/main.js`
- `DOMContentLoaded` 이벤트에서 `CONFERENCE_DATA`를 읽어 렌더링한다
- **주요 함수:**

| Function | Role |
|---|---|
| `renderCountdowns(conferences)` | 모든 deadline을 날짜순 정렬 후 카운트다운 카드 렌더링 |
| `getTimeRemaining(deadline)` | 남은 시간 계산 (days, hours, minutes, seconds) |
| `getUrgencyClass(remaining)` | 긴급도에 따른 CSS 클래스 반환 |
| `renderFooter(lastUpdated)` | 푸터에 마지막 업데이트 날짜 표시 |

- 카운트다운은 `setInterval`로 **1초마다** 자동 갱신된다
- 지난 7일 이내의 마감된 deadline도 표시된다 (회색, 투명도 60%)

### `css/style.css`
- CSS 변수(`:root`)로 색상 테마를 관리한다
- **긴급도별 색상 코딩:**

| 상태 | 조건 | 색상 | 클래스 |
|---|---|---|---|
| 여유 | 30일 이상 | 초록 (`--color-green`) | (기본) |
| 주의 | 7~30일 | 노랑 (`--color-yellow`) | `.urgent` |
| 임박 | 7일 미만 | 빨강 (`--color-red`) | `.imminent` |
| 지남 | 마감 후 | 회색 (`--color-gray`) | `.passed` |

- `@media (max-width: 600px)` 반응형 처리: 모바일에서 카드가 세로 배치로 전환된다
