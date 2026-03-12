# How to Use & Edit

## 1. 새 컨퍼런스 추가하기

`data/conferences.js` 파일의 `conferences` 배열에 새 객체를 추가한다.

```js
{
  "id": "conf-2026",              // 고유 ID
  "name": "CONF 2026",            // 카드에 표시되는 짧은 이름
  "fullName": "Full Conference Name 2026",
  "description": "컨퍼런스에 대한 한줄 설명.",
  "url": "https://conference-website.com",
  "downloadUrl": "https://conference-website.com/cfp.pdf",
  "location": "Seoul, South Korea",
  "dates": "2026-10-01 ~ 2026-10-03",
  "deadlines": [
    {
      "type": "Paper Submission",
      "date": "2026-06-15T23:59:00+09:00"
    },
    {
      "type": "Notification",
      "date": "2026-08-01T23:59:00+09:00"
    }
  ],
  "acceptedPapers": []
}
```

**주의사항:**
- `date`는 반드시 ISO 8601 형식 (예: `"2026-06-15T23:59:00+09:00"`)
- KST 기준이면 `+09:00`을 붙인다
- `deadlines`에 여러 마감일을 추가하면 각각 별도의 카운트다운 카드로 표시된다

## 2. 기존 컨퍼런스 수정하기

`data/conferences.js`에서 해당 컨퍼런스 객체를 찾아 필드를 수정한다.
마감일 변경, 장소 변경, 설명 수정 등 모두 이 파일 하나에서 처리한다.

## 3. 컨퍼런스 삭제하기

`data/conferences.js`의 `conferences` 배열에서 해당 객체를 제거한다.
마감일이 지난 컨퍼런스는 7일 후 자동으로 화면에서 사라지므로, 급히 삭제하지 않아도 된다.

## 4. 채택 논문 추가하기

해당 컨퍼런스의 `acceptedPapers` 배열에 추가한다:

```js
"acceptedPapers": [
  {
    "title": "논문 제목",
    "authors": "저자1, 저자2",
    "url": "https://link-to-paper.com"
  }
]
```

> 현재 카운트다운 카드에는 채택 논문이 표시되지 않는다.
> 향후 별도 섹션을 추가할 때 사용할 수 있도록 데이터만 보관한다.

## 5. 마지막 업데이트 날짜 변경

`data/conferences.js` 파일 상단의 `lastUpdated` 값을 수정한다:

```js
"lastUpdated": "2026-03-17",
```

이 날짜가 페이지 하단 Footer에 표시된다.

## 6. 로컬에서 미리보기

HTML 파일을 브라우저에서 직접 열면 된다:

```bash
# 방법 1: 파일 직접 열기
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# 방법 2: 로컬 서버 (선택사항)
python3 -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```

## 7. 배포하기 (GitHub Pages)

```bash
git add data/conferences.js
git commit -m "update conference deadlines"
git push
```

GitHub Pages가 `main` 브랜치 루트 디렉토리를 서빙하도록 설정되어 있으면,
push 후 수 분 내에 자동 배포된다.

**GitHub Pages 설정 (최초 1회):**
1. Repository > Settings > Pages
2. Source: `Deploy from a branch`
3. Branch: `main`, Folder: `/ (root)`
4. Save

## 8. 주간 업데이트 체크리스트

1. `data/conferences.js` 열기
2. 새 컨퍼런스 추가 또는 기존 정보 수정
3. `lastUpdated` 날짜 변경
4. 로컬에서 `index.html` 열어 확인
5. `git add` → `git commit` → `git push`

## 9. Claude와 함께 업데이트하기

Claude에게 다음과 같이 요청하면 된다:

- "새 컨퍼런스 XXX를 추가해줘. 마감일은 6월 15일이고 장소는 서울이야."
- "KDSA 2026의 Paper Submission 마감일을 7월 1일로 변경해줘."
- "지난 컨퍼런스 삭제해줘."

Claude는 `data/conferences.js`만 수정하면 되며, 다른 파일은 건드릴 필요가 없다.
