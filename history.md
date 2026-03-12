# Work History

## 2026-03-10 — Initial Homepage Implementation

### What was done
- Created the Korean Defense Conference Deadlines homepage from scratch
- Designed and implemented a static site using vanilla HTML, CSS, and JavaScript (no frameworks)
- Ready for GitHub Pages deployment

### Files created
| File | Purpose |
|---|---|
| `index.html` | Main page with header, countdown section, conferences section, footer |
| `css/style.css` | Responsive styles with color-coded urgency indicators |
| `js/main.js` | Fetches `conferences.json`, renders countdown timers (auto-updates every 60s), conference cards, deadline tables, accepted papers |
| `data/conferences.json` | Central data file with 2 placeholder conferences (KDSA 2026, ADD Symposium 2026) |

### Key design decisions
- **Vanilla HTML/CSS/JS** — no build tools or frameworks needed; deploys directly on GitHub Pages
- **Data separated from presentation** — weekly updates only require editing `conferences.json`
- **Countdown timers** — client-side JS with color coding (green > 30 days, yellow 7-30 days, red < 7 days, gray = passed)
- **Mobile responsive** — flexbox layout adapts to small screens
- **Reference**: modeled after https://sec-deadlines.github.io/

### Next steps
- Replace placeholder conference data with real Korean defense conferences
- Enable GitHub Pages in repo settings (main branch, root directory)
- Add favicon/logo to `assets/`

## 2026-03-12 — Direction 2: Enhanced Countdown Cards & Removed Conferences Section

### What was done
- **Enhanced countdown cards (left part):**
  - Added conference description below the conference name (truncated to 2 lines via CSS)
  - Added conference dates (e.g., "Conference: 2026-09-15 ~ 2026-09-17")
  - Replaced the date next to deadline type with the conference location
- **Enhanced countdown cards (right part):**
  - Wrapped countdown timer and new deadline datetime in a `.countdown-right` flex container
  - Added formatted deadline date+time with KST timezone below the countdown timer
- **Removed "Conferences" section** entirely (HTML, JS `renderConferences` function, and all related CSS)

### Files modified
| File | Changes |
|---|---|
| `index.html` | Removed the `<section class="conferences-section">` block |
| `js/main.js` | Passed `description`, `location`, `conferenceDates` to deadline entries; updated card template with new elements; removed `renderConferences` function and its call |
| `css/style.css` | Added `.conf-description`, `.conf-dates`, `.countdown-right`, `.deadline-datetime` styles; removed all conference-card related CSS (162-335); updated responsive rules |

### Key decisions
- Used `toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })` to always display deadline times in KST
- Used `-webkit-line-clamp: 2` for description truncation (works in all major browsers)
- Cleaned up dead CSS from removed Conferences section to keep stylesheet lean

## 2026-03-12 — One Card Per Conference + Passed Deadline Styling

### What was done
- **컨퍼런스당 1개 카드로 변경**: 기존 deadline별 카드 6개 → 컨퍼런스별 카드 2개
- 각 카드 좌측에 해당 컨퍼런스의 모든 deadline을 리스트로 표시
- 우측에는 가장 가까운 다음 deadline의 카운트다운 + "Next: {type}" 라벨 표시
- **지난 deadline은 gray 폰트** 처리, 리스트 하단으로 정렬
- **모든 deadline이 지난 컨퍼런스**는 카드 자체를 하단으로 정렬
- 미사용 함수 `getStatusColor` 제거

### Files modified
| File | Changes |
|---|---|
| `js/main.js` | `renderCountdowns`를 컨퍼런스 단위 렌더링으로 재작성; `getConferenceInfo`, `renderConferenceCard` 함수 추가; 미사용 `getStatusColor` 제거 |
| `css/style.css` | `.deadline-list`, `.deadline-item`, `.deadline-passed`, `.countdown-label` 스타일 추가; 미사용 `.deadline-type`, `.deadline-datetime` 제거; 카드 `align-items`를 `flex-start`로 변경 |
