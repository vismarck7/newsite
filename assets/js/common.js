/**
 * 공통 헤더 / 푸터 / 모바일 내비게이션 렌더링
 * data/site.config.js, data/categories.js 가 먼저 로드되어 있어야 합니다.
 *
 * 각 HTML의 <body data-nav="..."> 값으로 현재 메뉴를 표시합니다.
 * 이 스크립트는 헤더/푸터를 "채워 넣는" 용도이며, 본문 콘텐츠(글 제목/본문 등)는
 * 검색엔진이 바로 읽을 수 있도록 각 HTML 파일에 직접 작성되어 있습니다.
 */
(function () {
  var cfg = window.SITE_CONFIG || {};
  var categories = window.CATEGORIES || [];

  // ---------- 경로 도우미 ----------
  // 각 HTML 파일은 로드 시 자신의 깊이에 맞는 window.SITE_BASE 값
  // ("" | "../" | "../../" ...)을 미리 선언해둡니다. 이 함수는 그 값을 기준으로
  // 사이트 루트 기준 상대경로 링크를 만들어, 사이트가 도메인 루트가 아니라
  // 하위 경로(예: GitHub Pages의 /repo-name/)에 배포되어도 링크가 깨지지 않게 합니다.
  var BASE = window.SITE_BASE || "";
  function url(path) {
    if (!path || path === "/") return BASE || "./";
    return BASE + path;
  }
  window.Chungdong = window.Chungdong || {};
  window.Chungdong.url = url;

  var NAV_ITEMS = [
    { key: "home", label: "홈", path: "" },
    { key: "categories", label: "카테고리", path: "categories/" },
    { key: "poems", label: "오늘의 시", path: "poems/" },
    { key: "columns", label: "칼럼", path: "columns/" },
    { key: "author", label: "운영자 소개", path: "author/" },
    { key: "about", label: "사이트 소개", path: "about/" },
    { key: "contact", label: "문의하기", path: "contact/" },
  ];

  function renderHeader() {
    var mount = document.getElementById("site-header");
    if (!mount) return;
    var current = document.body.getAttribute("data-nav") || "";

    var navLinks = NAV_ITEMS.map(function (item) {
      var isCurrent = item.key === current;
      return (
        '<li><a href="' +
        url(item.path) +
        '"' +
        (isCurrent ? ' aria-current="page"' : "") +
        ">" +
        item.label +
        "</a></li>"
      );
    }).join("");

    mount.innerHTML =
      '<div class="site-header__inner">' +
      '<a class="brand" href="' + url("") + '">' +
      '<span class="brand__mark">' +
      (cfg.siteName || "충동") +
      "</span>" +
      '<span class="brand__tagline">' +
      (cfg.tagline || "") +
      "</span>" +
      "</a>" +
      '<nav class="main-nav" aria-label="주요 메뉴"><ul>' +
      navLinks +
      "</ul></nav>" +
      '<button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="mobile-nav">메뉴 ☰</button>' +
      "</div>" +
      '<nav class="mobile-nav" id="mobile-nav" aria-label="모바일 메뉴"><ul>' +
      navLinks +
      "</ul></nav>";

    var toggle = document.getElementById("nav-toggle");
    var mobileNav = document.getElementById("mobile-nav");
    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var isOpen = mobileNav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }
  }

  function renderFooter() {
    var mount = document.getElementById("site-footer");
    if (!mount) return;

    var categoryLinks = categories
      .map(function (c) {
        return '<li><a href="' + url("categories/" + c.slug + "/") + '">' + c.name + "</a></li>";
      })
      .join("");

    mount.innerHTML =
      '<div class="site-footer__inner">' +
      "<div>" +
      '<div class="site-footer__brand">' +
      (cfg.siteName || "충동") +
      "</div>" +
      "<p>" +
      (cfg.description || "") +
      "</p>" +
      "<p>운영자 · " +
      '<a href="' + url("author/") + '">' +
      (cfg.ownerName || "") +
      "</a><br>" +
      '문의 · <a href="mailto:' +
      (cfg.contactEmail || "") +
      '">' +
      (cfg.contactEmail || "") +
      "</a></p>" +
      "</div>" +
      "<div><h4>카테고리</h4><ul>" +
      categoryLinks +
      "</ul></div>" +
      "<div><h4>사이트 정보</h4><ul>" +
      '<li><a href="' + url("about/") + '">사이트 소개</a></li>' +
      '<li><a href="' + url("author/") + '">운영자 소개</a></li>' +
      '<li><a href="' + url("poems/") + '">오늘의 시</a></li>' +
      '<li><a href="' + url("columns/") + '">칼럼</a></li>' +
      '<li><a href="' + url("contact/") + '">문의하기</a></li>' +
      '<li><a href="' + url("sitemap/") + '">사이트맵</a></li>' +
      '<li><a href="' + url("privacy/") + '">개인정보처리방침</a></li>' +
      '<li><a href="' + url("terms/") + '">이용약관</a></li>' +
      '<li><a href="' + url("disclaimer/") + '">면책고지</a></li>' +
      "</ul></div>" +
      "</div>" +
      '<div class="site-footer__bottom">© ' +
      new Date().getFullYear() +
      " " +
      (cfg.copyrightHolder || cfg.siteName || "") +
      ". All rights reserved. · 이 사이트는 정보 제공을 목적으로 하며 상업적 자문을 대체하지 않습니다.</div>";
  }

  // ---------- 관리자 세션 헬퍼 (localStorage 기반 데모) ----------
  var ADMIN_KEY = "chungdong_admin_session";

  window.Chungdong = window.Chungdong || {};
  window.Chungdong.isAdmin = function () {
    try {
      return window.localStorage.getItem(ADMIN_KEY) === "true";
    } catch (e) {
      return false;
    }
  };
  window.Chungdong.setAdmin = function (value) {
    try {
      if (value) {
        window.localStorage.setItem(ADMIN_KEY, "true");
      } else {
        window.localStorage.removeItem(ADMIN_KEY);
      }
    } catch (e) {
      /* localStorage 사용 불가 환경 - 무시 */
    }
  };

  function formatDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.getFullYear() + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + String(d.getDate()).padStart(2, "0");
  }
  window.Chungdong.formatDate = formatDate;

  function categoryName(slug) {
    var c = categories.filter(function (c) {
      return c.slug === slug;
    })[0];
    return c ? c.name : slug;
  }
  window.Chungdong.categoryName = categoryName;

  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
  });
})();
