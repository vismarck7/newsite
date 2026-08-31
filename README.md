# 충동 (Chungdong)

서평 · 신간 · 글쓰기 정보를 다루는 정적 웹사이트입니다. 별도의 백엔드 서버 없이
HTML/CSS/JavaScript만으로 동작하며, 워드프레스 느낌의 CMS-lite 관리자 데모(`/admin/`)를
함께 포함하고 있습니다.

## 1. 빠르게 미리보기

이 프로젝트는 순수 정적 파일이라 빌드 과정이 없습니다. 아래 중 편한 방법으로 로컬에서
실행해 확인할 수 있습니다.

```bash
# 이 폴더에서 실행
python3 -m http.server 8000
# 또는
npx serve .
```

이후 브라우저에서 `http://localhost:8000` 으로 접속하면 됩니다.

## 1-1. 실제 배포하기 (도메인 루트든 하위 경로든 동일 코드로 동작)

모든 내부 링크(`href`, `src`)는 **파일 위치 기준 상대경로**로 작성되어 있어서,
아래 두 경우 모두 코드 수정 없이 그대로 배포할 수 있습니다.

- **도메인/서브도메인 루트에 배포**: Netlify, Vercel, Cafe24 등 — 저장소 루트를
  그대로 올리면 끝입니다. (Publish directory: `.` / Build command: 없음)
- **GitHub Pages 프로젝트 페이지처럼 하위 경로에 배포**: 예) `https://아이디.github.io/저장소이름/`
  — 이런 경우에도 별도 수정 없이 정상 동작합니다. (단, 저장소를 `아이디.github.io`라는
  이름으로 만들면 하위 경로 없이 도메인 루트로 바로 서비스됩니다.)

이 동작은 각 HTML 파일이 자신의 폴더 깊이에 맞는 `window.SITE_BASE` 값
(`""`, `"../"`, `"../../"` 등)을 스크립트 로드 전에 미리 선언해두고,
`assets/js/common.js`의 `Chungdong.url(path)` 헬퍼가 이 값을 기준으로
헤더/푸터/카드 등에서 동적으로 만드는 모든 링크를 계산하기 때문에 가능합니다.
새 페이지를 추가할 때는 같은 폴더 깊이의 기존 페이지를 참고해 `SITE_BASE` 값과
`<link>/<script>` 상대경로를 맞춰주면 됩니다.

> 참고: `404.html`만 예외로 절대경로(`/about/` 등)를 사용합니다. 404 페이지는 브라우저가
> "존재하지 않는 실제 요청 경로" 기준으로 상대경로를 해석하기 때문에, 상대경로로 만들면
> 오히려 더 쉽게 깨집니다. 그래서 도메인 루트 배포(Netlify/커스텀 도메인/`아이디.github.io`)
> 에서는 정상 동작하지만, GitHub Pages 프로젝트 하위 경로(`/저장소이름/`) 배포에서 깊은
> 경로의 404만큼은 완벽하게 대응하지 못하는 잘 알려진 한계가 있습니다. (홈으로 가는
> 버튼 자체는 여전히 동작하며, 실제 도메인이 연결되면 이 문제도 사라집니다.)

`canonical`, Open Graph `url`, JSON-LD의 `url` 필드는 SEO 목적상 항상 실제 도메인
(`https://www.choongdong.kr/...`)의 전체 절대 URL을 사용합니다. 실제 도메인이 정해지면
이 값들을 실제 도메인으로 일괄 교체해주세요(`data/site.config.js`의 `url` 값과 각
HTML의 `canonical`/`og:url`/JSON-LD `url` 필드).

> ⚠️ `file://` 로 index.html을 직접 열면 일부 브라우저에서 fetch/모듈 관련 정책으로
> 정상 동작하지 않을 수 있습니다. 반드시 위와 같은 간단한 로컬 서버를 통해 확인해주세요.

## 2. 폴더 구조

```
/index.html              홈
/about/                   사이트 소개
/author/                  운영자 소개 + 칼럼 허브 (관리자 세션 감지)
/contact/                 문의하기 (이메일 기반)
/categories/               카테고리 목록 + 5개 카테고리 상세
/posts/{slug}/             글 상세 15개
/columns/                  칼럼 목록 + 상세 3개
/privacy/, /terms/, /disclaimer/   신뢰 페이지
/sitemap/                  HTML 사이트맵
/404.html
/admin/                   관리자(CMS-lite) 데모
/data/                    사이트 전역 데이터 (아래 3절 참고)
/assets/css                공통 스타일 + 관리자 스타일
/assets/js                  공통 스크립트(헤더/푸터/렌더링) + 관리자 스크립트
/assets/icons               파비콘
robots.txt, sitemap.xml
```

## 3. 콘텐츠/설정 수정 위치

| 수정하고 싶은 것 | 파일 위치 |
| --- | --- |
| **사이트명, 한줄 소개, 설명** | `data/site.config.js` (`siteName`, `tagline`, `description`) |
| **메인/서브 컬러** | `data/site.config.js` (`mainColor`, `subColor`) 및 `assets/css/style.css` 상단 `:root` 변수 |
| **연락 이메일** | `data/site.config.js` (`contactEmail`) + `contact/index.html`, `privacy/index.html` 등에 직접 표기된 이메일 |
| **운영자명 / 소개 문구** | `data/site.config.js` (`ownerName`, `ownerBio`, `ownerBioLong`) + `author/index.html` |
| **카테고리 구조** | `data/categories.js` + `categories/{slug}/index.html` 페이지 추가/수정 |
| **일반 글(포스트)** | 목록/카드 정보는 `data/posts.js`, 실제 본문은 `posts/{slug}/index.html` |
| **칼럼** | 목록 정보는 `data/columns.js`, 실제 본문은 `columns/{slug}/index.html` |
| **관리자 기본 문구/데모 비밀번호** | `assets/js/admin.js` 상단 `DEMO_PASSWORD` 및 `admin/index.html` 안내 문구 |

새 글을 추가하는 방법:

1. `data/posts.js` 배열에 새 글의 메타데이터(slug, title, excerpt, category, tags, published,
   modified, featured, faq)를 추가합니다.
2. `posts/{slug}/index.html` 을 새로 만들고, 기존 글 파일 구조(제목/메타/목차/본문/체크리스트/
   FAQ/관련 글)를 참고해 내용을 작성합니다.
3. 필요하다면 `sitemap.xml` 에도 새 URL을 추가합니다.

칼럼도 동일한 방식으로 `data/columns.js` + `columns/{slug}/index.html` 을 추가하면 됩니다.

## 4. 관리자(CMS-lite) 데모에 대한 중요한 안내

`/admin/` 경로는 **워드프레스 느낌을 낸 정적 사이트용 CMS-lite 데모**입니다. 실제
운영에 필요한 아래 기능은 포함되어 있지 않습니다.

- ❌ 실제 서버 인증/세션 관리 (비밀번호는 브라우저 안에서만 비교되는 데모용입니다)
- ❌ 데이터베이스 (모든 편집 데이터는 브라우저의 `localStorage`에만 저장됩니다)
- ❌ 서버로의 실제 발행/배포 기능 (여기서 "저장"해도 실제 정적 페이지 파일은
  자동으로 바뀌지 않습니다)

즉, 관리자 화면에서 글이나 칼럼을 작성/수정/삭제해도 **그 브라우저에서만 보이는
데모 데이터**가 바뀔 뿐이며, 다른 사람이 접속했을 때 보이는 실제 사이트 콘텐츠에는
반영되지 않습니다. 실제로 콘텐츠를 반영하려면 위 3절의 방법대로 `data/*.js` 와
`posts/`, `columns/` 폴더의 HTML 파일을 직접 수정해야 합니다.

관리자 화면에서 제공하는 **JSON 내보내기/가져오기** 기능을 활용하면, 편집한 내용을
파일로 저장해두었다가 실제 데이터 파일에 반영할 때 참고자료로 쓸 수 있습니다.

### 향후 확장하고 싶다면

이 CMS-lite 구조는 아래와 같은 방향으로 확장할 수 있도록 데이터와 화면을
분리해 두었습니다.

- **Supabase / Firebase** 같은 BaaS를 붙여 실제 로그인 인증과 데이터베이스 저장으로 교체
- **Git 기반 CMS** (예: Decap CMS 등)를 붙여 관리자 화면의 "저장"이 실제로 저장소에
  커밋되도록 연결
- 저장 시 `data/*.js` 를 생성하는 간단한 빌드 스크립트를 추가해, 관리자 화면 편집 →
  정적 파일 재생성 흐름을 자동화

### 관리자 로그인 데모 방법

`/admin/` 접속 후 아래 중 하나로 로그인할 수 있습니다.

- 데모 비밀번호 `chungdong2026` 입력 후 로그인
- "데모 계정으로 바로 체험하기" 버튼 클릭

## 5. 운영자명 클릭 흐름

사이트 전반(푸터, 홈 운영자 박스, 글/칼럼 하단 편집자 박스)에서 운영자명 **이지원**을
클릭하면 `/author/` 페이지로 이동합니다. 이 페이지는:

- 일반 방문자에게는 운영자 소개, 편집 원칙, 칼럼 목록, 최근 작성한 글을 보여줍니다.
- `localStorage` 기반 관리자 세션이 활성화되어 있으면(위 4절의 방법으로 `/admin/` 에
  로그인한 상태) 같은 페이지 상단에 **"새 칼럼 작성하기"** 버튼이 나타나며, 클릭 시
  `/admin/#/columns/new` (칼럼 관리 > 새 칼럼 작성 화면)로 바로 이동합니다.

## 6. SEO 관련 참고

- 모든 페이지에 고유한 `<title>`, `meta description`, `canonical` 태그가 있습니다.
- Open Graph / Twitter 메타 태그를 포함합니다.
- 글/칼럼 페이지에는 `Article`, `BreadcrumbList` (해당 시 `FAQPage`) JSON-LD 구조화
  데이터가 포함되어 있습니다.
- `robots.txt`, `sitemap.xml`, HTML `사이트맵` 페이지, `404.html`을 포함합니다.
- `/admin/` 경로는 `robots.txt`와 각 관리자 페이지의 `noindex` 메타 태그로 색인에서
  제외됩니다.

## 7. 정직성/신뢰 관련 원칙

이 사이트의 콘텐츠는 실제 사람이 읽고 이해할 수 있는 자연스러운 한국어 정보 글로
작성되었으며, 가짜 후기·가짜 수치·가짜 자격·허위 회사 정보·의미 없는 키워드 반복은
포함하지 않습니다. 연락 수단은 이메일(`vismarcklee@gmail.com`)을 기준으로 합니다.

사이트 전 페이지 `<head>`에는 Google AdSense 사이트 소유권 확인 및 광고 게재용
스크립트(`adsbygoogle.js`)가 포함되어 있으며, 이에 따라 `privacy/index.html`의
"쿠키 및 추적 기술" 항목에 관련 고지를 명시해두었습니다.
