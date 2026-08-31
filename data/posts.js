/**
 * 글(포스트) 메타데이터
 * 홈, 카테고리, 사이트맵, 관련 글 컴포넌트는 이 배열을 기준으로 목록을 렌더링합니다.
 * 실제 본문은 /posts/{slug}/index.html 파일에 직접 작성되어 있습니다.
 * 새 글을 추가할 때는 이 배열에 항목을 추가하고, 같은 slug로 폴더/HTML을 만드세요.
 */
window.POSTS = [
  {
    slug: "choosing-new-releases",
    title: "이번 달 신간, 무엇부터 봐야 할까: 신간을 고르는 기준",
    excerpt:
      "서점 매대를 가득 채운 신간 중에서 나에게 맞는 책을 고르는 실용적인 기준을 정리했습니다.",
    category: "new-releases",
    tags: ["신간", "책 고르는 법", "입문"],
    published: "2026-03-05",
    modified: "2026-03-05",
    featured: true,
    faq: false,
  },
  {
    slug: "tracking-new-book-info",
    title: "신간 정보를 놓치지 않고 확인하는 몇 가지 방법",
    excerpt:
      "서점 앱, 출판사 소식, 독서 커뮤니티 등 신간 정보를 꾸준히 확인할 수 있는 채널을 비교했습니다.",
    category: "new-releases",
    tags: ["신간", "정보 채널", "독서 습관"],
    published: "2026-03-19",
    modified: "2026-04-02",
    featured: false,
    faq: true,
  },
  {
    slug: "translated-vs-domestic",
    title: "번역서와 국내 창작 신간, 어떤 기준으로 먼저 읽을까",
    excerpt:
      "번역서와 국내 창작물은 읽는 재미가 조금 다릅니다. 두 갈래를 비교해 보고 고르는 기준을 정리했습니다.",
    category: "new-releases",
    tags: ["신간", "번역서", "국내 소설"],
    published: "2026-08-20",
    modified: "2026-08-20",
    featured: false,
    faq: false,
  },
  {
    slug: "how-to-pick-immersive-novels",
    title: "몰입감 있는 장편 소설을 고르는 법",
    excerpt:
      "쉽게 몰입되는 장편 소설을 고르기 위해 표지 너머로 확인하면 좋은 정보들을 소개합니다.",
    category: "fiction-reviews",
    tags: ["소설", "장편", "책 고르는 법"],
    published: "2026-04-10",
    modified: "2026-04-10",
    featured: true,
    faq: false,
  },
  {
    slug: "writing-review-for-story-collection",
    title: "단편집을 읽고 서평을 쓰는 방법",
    excerpt:
      "여러 편이 묶인 단편집은 장편과 다른 방식으로 서평을 써야 합니다. 단편집 서평의 접근법을 정리했습니다.",
    category: "fiction-reviews",
    tags: ["소설", "단편집", "서평 쓰기"],
    published: "2026-05-02",
    modified: "2026-05-15",
    featured: false,
    faq: false,
  },
  {
    slug: "mystery-review-basics",
    title: "추리·미스터리 소설, 스포일러 없이 서평 쓰는 법",
    excerpt:
      "반전이 핵심인 미스터리 소설은 서평을 쓸 때 특히 조심스럽습니다. 스포일러 없이 감상을 전하는 방법을 소개합니다.",
    category: "fiction-reviews",
    tags: ["소설", "미스터리", "서평 쓰기"],
    published: "2026-08-25",
    modified: "2026-08-25",
    featured: false,
    faq: true,
  },
  {
    slug: "essay-reading-notes",
    title: "에세이를 읽고 나만의 생각을 정리하는 법",
    excerpt:
      "에세이는 저자의 생각에 공감하거나 반박하며 읽는 재미가 있습니다. 읽은 뒤 생각을 정리하는 방법을 안내합니다.",
    category: "essay-nonfiction",
    tags: ["에세이", "독서 기록", "서평 쓰기"],
    published: "2026-04-22",
    modified: "2026-04-22",
    featured: false,
    faq: false,
  },
  {
    slug: "humanities-book-starting-point",
    title: "인문 교양서, 어디서부터 시작하면 좋을까",
    excerpt:
      "두껍고 어렵게 느껴지는 인문 교양서를 처음 읽는 분들을 위해 접근하는 순서와 요령을 정리했습니다.",
    category: "essay-nonfiction",
    tags: ["인문", "교양서", "입문"],
    published: "2026-05-28",
    modified: "2026-06-10",
    featured: true,
    faq: false,
  },
  {
    slug: "reading-self-help-critically",
    title: "자기계발서, 비판적으로 읽는다는 것의 의미",
    excerpt:
      "자기계발서를 무조건 따르기보다 나에게 맞는 부분을 가려 읽는 태도에 대해 이야기합니다.",
    category: "essay-nonfiction",
    tags: ["자기계발서", "비판적 읽기"],
    published: "2026-08-10",
    modified: "2026-08-10",
    featured: false,
    faq: false,
  },
  {
    slug: "review-writing-first-sentence",
    title: "서평 쓰기 입문: 첫 문장부터 막막할 때",
    excerpt:
      "서평의 첫 문장을 쓰지 못해 멈춰버리는 분들을 위해, 시작을 쉽게 만드는 몇 가지 방법을 정리했습니다.",
    category: "writing-tips",
    tags: ["서평 쓰기", "글쓰기 입문"],
    published: "2026-03-12",
    modified: "2026-07-01",
    featured: true,
    faq: true,
  },
  {
    slug: "essay-structure-basics",
    title: "글의 구조를 잡는 법: 서론-본론-결론 다시 보기",
    excerpt:
      "기본적인 글 구조를 다시 점검하면 서평이나 감상문을 훨씬 수월하게 쓸 수 있습니다.",
    category: "writing-tips",
    tags: ["글쓰기", "글 구조"],
    published: "2026-06-05",
    modified: "2026-06-05",
    featured: false,
    faq: false,
  },
  {
    slug: "proofreading-checklist",
    title: "퇴고할 때 반드시 확인해야 할 체크리스트",
    excerpt:
      "글을 다 쓴 뒤 놓치기 쉬운 부분을 점검할 수 있는 퇴고 체크리스트를 정리했습니다.",
    category: "writing-tips",
    tags: ["퇴고", "글쓰기 체크리스트"],
    published: "2026-08-28",
    modified: "2026-08-28",
    featured: true,
    faq: true,
  },
  {
    slug: "building-reading-habit",
    title: "꾸준히 읽는 습관을 만드는 현실적인 방법",
    excerpt:
      "의욕만으로는 오래가지 않는 독서 습관. 현실적으로 지속 가능한 방법을 정리했습니다.",
    category: "reading-habits",
    tags: ["독서 습관", "루틴"],
    published: "2026-04-15",
    modified: "2026-04-15",
    featured: true,
    faq: true,
  },
  {
    slug: "leaving-books-unfinished",
    title: "완독하지 못한 책, 그냥 덮어도 될까",
    excerpt:
      "끝까지 읽지 못한 책에 대한 부담을 내려놓아도 되는 이유와, 그래도 괜찮은 상황을 정리했습니다.",
    category: "reading-habits",
    tags: ["완독", "독서 습관"],
    published: "2026-06-20",
    modified: "2026-06-20",
    featured: false,
    faq: false,
  },
  {
    slug: "reading-log-methods",
    title: "독서 기록을 남기는 다양한 방법 비교",
    excerpt:
      "노트, 앱, 블로그 등 독서 기록을 남기는 여러 방법의 장단점을 비교해 나에게 맞는 방식을 찾아봅니다.",
    category: "reading-habits",
    tags: ["독서 기록", "독서 앱"],
    published: "2026-08-05",
    modified: "2026-08-18",
    featured: false,
    faq: false,
  },
];
