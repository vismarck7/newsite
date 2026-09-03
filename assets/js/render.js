/**
 * 글/칼럼/카테고리 카드 렌더링에 사용하는 공통 함수 모음
 * data/*.js, assets/js/common.js 이후에 로드되어야 합니다.
 */
(function () {
  var POSTS = window.POSTS || [];
  var COLUMNS = window.COLUMNS || [];
  var CATEGORIES = window.CATEGORIES || [];
  var POEMS = window.POEMS || [];

  function byModifiedDesc(a, b) {
    return new Date(b.modified) - new Date(a.modified);
  }
  function byPublishedDesc(a, b) {
    return new Date(b.published) - new Date(a.published);
  }

  function postCardHTML(post) {
    var catName = window.Chungdong.categoryName(post.category);
    var date = window.Chungdong.formatDate(post.modified || post.published);
    var href = window.Chungdong.url("posts/" + post.slug + "/");
    return (
      '<article class="post-card">' +
      '<div class="post-card__meta"><span class="tag">' +
      catName +
      "</span><span>" +
      date +
      " 업데이트</span></div>" +
      '<h3><a href="' +
      href +
      '">' +
      post.title +
      "</a></h3>" +
      "<p>" +
      post.excerpt +
      "</p>" +
      '<a class="post-card__link" href="' +
      href +
      '">글 읽기 →</a>' +
      "</article>"
    );
  }

  function columnCardHTML(col) {
    var date = window.Chungdong.formatDate(col.modified || col.published);
    return (
      '<article class="column-card">' +
      '<span class="tag">칼럼</span>' +
      '<h3><a href="' +
      window.Chungdong.url("columns/" + col.slug + "/") +
      '">' +
      col.title +
      "</a></h3>" +
      "<p>" +
      col.excerpt +
      "</p>" +
      '<div class="column-card__date">' +
      date +
      " · " +
      (window.SITE_CONFIG.ownerName || "") +
      "</div>" +
      "</article>"
    );
  }

  function poemCardHTML(poem) {
    return (
      '<article class="poem-card">' +
      '<span class="poem-card__mark" aria-hidden="true">❝</span>' +
      '<h3><a href="' +
      window.Chungdong.url("poems/" + poem.slug + "/") +
      '">' +
      poem.title +
      "</a></h3>" +
      '<span class="poet">' +
      poem.poet +
      " · " +
      poem.poetYears +
      "</span>" +
      "<p>" +
      poem.excerpt +
      "</p>" +
      "</article>"
    );
  }

  function categoryCardHTML(cat) {
    return (
      '<a class="category-card" href="' +
      window.Chungdong.url("categories/" + cat.slug + "/") +
      '">' +
      '<div class="category-card__icon" aria-hidden="true">📚</div>' +
      "<h3>" +
      cat.name +
      "</h3>" +
      "<p>" +
      cat.description +
      "</p>" +
      "</a>"
    );
  }

  window.ChungdongRender = {
    latestPosts: function (n) {
      return POSTS.slice().sort(byModifiedDesc).slice(0, n || 6);
    },
    featuredPosts: function (n) {
      return POSTS.filter(function (p) {
        return p.featured;
      })
        .sort(byPublishedDesc)
        .slice(0, n || 4);
    },
    postsByCategory: function (slug) {
      return POSTS.filter(function (p) {
        return p.category === slug;
      }).sort(byModifiedDesc);
    },
    relatedPosts: function (slug, n) {
      var current = POSTS.filter(function (p) {
        return p.slug === slug;
      })[0];
      if (!current) return [];
      return POSTS.filter(function (p) {
        return p.slug !== slug && p.category === current.category;
      })
        .sort(byModifiedDesc)
        .slice(0, n || 3);
    },
    latestColumns: function (n) {
      return COLUMNS.slice().sort(byModifiedDesc).slice(0, n || 3);
    },
    latestPoems: function (n) {
      return POEMS.slice().sort(byModifiedDesc).slice(0, n || 6);
    },
    relatedPoems: function (slug, n) {
      return POEMS.filter(function (p) {
        return p.slug !== slug;
      })
        .sort(byModifiedDesc)
        .slice(0, n || 3);
    },
    postCardHTML: postCardHTML,
    columnCardHTML: columnCardHTML,
    categoryCardHTML: categoryCardHTML,
    poemCardHTML: poemCardHTML,
    renderInto: function (mountId, items, htmlFn, emptyMsg) {
      var mount = document.getElementById(mountId);
      if (!mount) return;
      if (!items.length) {
        mount.innerHTML = '<p style="color:var(--color-text-faint)">' + (emptyMsg || "표시할 콘텐츠가 없습니다.") + "</p>";
        return;
      }
      mount.innerHTML = items.map(htmlFn).join("");
    },
  };
})();
