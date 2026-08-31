/**
 * 카테고리 데이터
 * 새 카테고리를 추가하려면 이 배열에 객체를 하나 추가하고,
 * /categories/{slug}/index.html 페이지를 만들어 연결하세요.
 */
window.CATEGORIES = [
  {
    slug: "new-releases",
    name: "신간 소식",
    shortName: "신간",
    description:
      "매달 쏟아지는 신간 중 어떤 책을 먼저 살펴봐야 할지 고민하는 분들을 위한 카테고리입니다. 신간을 고르는 기준, 정보를 확인하는 방법, 번역서와 국내 창작물의 차이 등을 다룹니다.",
    icon: "book-open",
  },
  {
    slug: "fiction-reviews",
    name: "소설 서평",
    shortName: "소설",
    description:
      "장편 소설, 단편집, 미스터리 등 다양한 소설을 읽고 서평을 쓰는 방법을 다룹니다. 이야기를 고르는 안목과 감상을 정리하는 요령을 소개합니다.",
    icon: "feather",
  },
  {
    slug: "essay-nonfiction",
    name: "에세이·비소설 서평",
    shortName: "에세이",
    description:
      "에세이, 인문 교양서, 자기계발서 등 비소설 분야의 책을 읽고 자신의 생각을 정리하는 방법을 다룹니다. 비판적으로 읽는 태도에 대해서도 안내합니다.",
    icon: "bookmark",
  },
  {
    slug: "writing-tips",
    name: "글쓰기 팁",
    shortName: "글쓰기",
    description:
      "서평이나 감상문을 처음 쓰는 분들을 위한 실용적인 글쓰기 정보를 다룹니다. 글의 구조를 잡는 법부터 퇴고 체크리스트까지 단계별로 안내합니다.",
    icon: "pen",
  },
  {
    slug: "reading-habits",
    name: "독서 습관",
    shortName: "습관",
    description:
      "꾸준히 읽는 습관을 만들고 유지하는 방법, 독서 기록을 남기는 방법 등 독서를 생활의 일부로 만드는 데 필요한 정보를 다룹니다.",
    icon: "calendar",
  },
];
