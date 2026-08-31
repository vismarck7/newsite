/**
 * 충동 관리자 모드 (CMS-lite 데모)
 * ------------------------------------------------------------
 * 중요: 이 관리자 화면은 정적 사이트에 붙인 "워드프레스 느낌의" 데모 UI입니다.
 * 실제 데이터베이스, 서버 인증, 권한 관리가 없으며 모든 데이터는
 * 이용자의 브라우저 localStorage에만 저장됩니다. 브라우저 저장소를 지우거나
 * 다른 기기/브라우저로 접속하면 이곳에서 수정한 내용은 사라집니다.
 * 실제 사이트에 콘텐츠를 반영하려면 /data/*.js 파일과 /posts, /columns 폴더의
 * HTML 파일을 직접 수정해야 합니다. (README 참고)
 * ------------------------------------------------------------
 */
(function () {
  var LS_KEYS = {
    posts: "chungdong_cms_posts",
    columns: "chungdong_cms_columns",
    categories: "chungdong_cms_categories",
    settings: "chungdong_cms_settings",
  };
  var DEMO_PASSWORD = "chungdong2026";

  function loadJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function saveJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      alert("브라우저 저장소에 저장하지 못했습니다. 시크릿 모드이거나 저장 공간이 부족할 수 있습니다.");
    }
  }
  function escapeHTML(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  // ---------- 초기 데이터 시딩 (data/*.js -> localStorage 편집본) ----------
  function seedIfEmpty() {
    if (!window.localStorage.getItem(LS_KEYS.posts)) {
      var posts = (window.POSTS || []).map(function (p) {
        return {
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          tags: (p.tags || []).join(", "),
          body:
            "이 글의 실제 본문은 /posts/" +
            p.slug +
            "/ 정적 페이지에 직접 작성되어 있습니다.\n이 데모 편집기에서 수정해도 실제 게시된 페이지에는 반영되지 않습니다.\n(자세한 내용은 관리자 대시보드 상단 안내 또는 README를 확인하세요.)",
          faqItems: [],
          relatedSlugs: [],
          featured: !!p.featured,
          status: "published",
          published: p.published,
          modified: p.modified,
        };
      });
      saveJSON(LS_KEYS.posts, posts);
    }
    if (!window.localStorage.getItem(LS_KEYS.columns)) {
      var columns = (window.COLUMNS || []).map(function (c) {
        return {
          slug: c.slug,
          title: c.title,
          excerpt: c.excerpt,
          body:
            "이 칼럼의 실제 본문은 /columns/" +
            c.slug +
            "/ 정적 페이지에 직접 작성되어 있습니다.\n이 데모 편집기에서 수정해도 실제 게시된 페이지에는 반영되지 않습니다.",
          status: "published",
          published: c.published,
          modified: c.modified,
        };
      });
      saveJSON(LS_KEYS.columns, columns);
    }
    if (!window.localStorage.getItem(LS_KEYS.categories)) {
      saveJSON(LS_KEYS.categories, window.CATEGORIES || []);
    }
    if (!window.localStorage.getItem(LS_KEYS.settings)) {
      var cfg = window.SITE_CONFIG || {};
      saveJSON(LS_KEYS.settings, {
        siteName: cfg.siteName,
        tagline: cfg.tagline,
        ownerName: cfg.ownerName,
        ownerBio: cfg.ownerBio,
        contactEmail: cfg.contactEmail,
        mainColor: cfg.mainColor,
        subColor: cfg.subColor,
        siteUrl: cfg.url,
      });
    }
  }

  function getPosts() { return loadJSON(LS_KEYS.posts, []); }
  function setPosts(v) { saveJSON(LS_KEYS.posts, v); }
  function getColumns() { return loadJSON(LS_KEYS.columns, []); }
  function setColumns(v) { saveJSON(LS_KEYS.columns, v); }
  function getCategories() { return loadJSON(LS_KEYS.categories, []); }
  function setCategories(v) { saveJSON(LS_KEYS.categories, v); }
  function getSettings() { return loadJSON(LS_KEYS.settings, {}); }
  function setSettings(v) { saveJSON(LS_KEYS.settings, v); }

  // ---------- 로그인 ----------
  var loginScreen = document.getElementById("admin-login");
  var appScreen = document.getElementById("admin-app");

  function showApp() {
    loginScreen.hidden = true;
    appScreen.hidden = false;
    seedIfEmpty();
    router();
  }
  function showLogin() {
    loginScreen.hidden = false;
    appScreen.hidden = true;
  }

  document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var pw = document.getElementById("login-password").value;
    if (pw === DEMO_PASSWORD) {
      window.Chungdong.setAdmin(true);
      showApp();
    } else {
      alert("데모 비밀번호가 올바르지 않습니다. 화면에 안내된 비밀번호(chungdong2026)를 입력해주세요.");
    }
  });
  document.getElementById("demo-login-btn").addEventListener("click", function () {
    window.Chungdong.setAdmin(true);
    showApp();
  });
  document.getElementById("logout-btn").addEventListener("click", function () {
    window.Chungdong.setAdmin(false);
    showLogin();
  });

  // ---------- 라우터 ----------
  var main = document.getElementById("admin-main");

  function parseHash() {
    var h = window.location.hash.replace(/^#\/?/, "");
    return h.split("/").filter(Boolean);
  }

  function router() {
    var parts = parseHash();
    var route = parts[0] || "dashboard";

    document.querySelectorAll(".admin-sidebar a").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-route") === route);
    });

    if (route === "dashboard") return renderDashboard();
    if (route === "posts" && parts[1] === "new") return renderPostForm(null);
    if (route === "posts" && parts[1] === "edit") return renderPostForm(parts[2]);
    if (route === "posts") return renderPostsList();
    if (route === "columns" && parts[1] === "new") return renderColumnForm(null);
    if (route === "columns" && parts[1] === "edit") return renderColumnForm(parts[2]);
    if (route === "columns") return renderColumnsList();
    if (route === "categories") return renderCategories();
    if (route === "settings") return renderSettings();
    renderDashboard();
  }
  window.addEventListener("hashchange", router);

  // ---------- 대시보드 ----------
  function renderDashboard() {
    var posts = getPosts();
    var columns = getColumns();
    var cats = getCategories();
    var published = posts.filter(function (p) { return p.status === "published"; }).length;
    var draft = posts.filter(function (p) { return p.status === "draft"; }).length;
    var featured = posts.filter(function (p) { return p.featured; }).length;

    var recent = posts
      .map(function (p) { return { type: "글", title: p.title, slug: p.slug, modified: p.modified, route: "#/posts/edit/" + p.slug }; })
      .concat(columns.map(function (c) { return { type: "칼럼", title: c.title, slug: c.slug, modified: c.modified, route: "#/columns/edit/" + c.slug }; }))
      .sort(function (a, b) { return new Date(b.modified) - new Date(a.modified); })
      .slice(0, 6);

    main.innerHTML =
      "<h1>대시보드</h1>" +
      '<p class="admin-main__lead">충동 CMS-lite 데모 관리자 화면입니다. 아래 통계는 브라우저에 저장된 편집 데이터를 기준으로 합니다.</p>' +
      '<div class="admin-stat-grid">' +
      statCard(posts.length, "총 글 수") +
      statCard(columns.length, "총 칼럼 수") +
      statCard(cats.length, "카테고리 수") +
      statCard(featured, "추천 글 수") +
      statCard(published, "발행됨") +
      statCard(draft, "초안") +
      "</div>" +
      '<div class="admin-panel">' +
      "<h2>최근 수정된 콘텐츠</h2>" +
      '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>구분</th><th>제목</th><th>수정일</th><th></th></tr></thead><tbody>' +
      (recent.length
        ? recent.map(function (r) {
            return (
              "<tr><td>" + r.type + "</td><td class=\"wrap\">" + escapeHTML(r.title) + "</td><td>" + r.modified + "</td>" +
              '<td><a class="btn btn--ghost btn--sm" href="' + r.route + '">편집</a></td></tr>'
            );
          }).join("")
        : '<tr><td colspan="4">아직 콘텐츠가 없습니다.</td></tr>') +
      "</tbody></table></div></div>" +
      '<div class="admin-panel">' +
      "<h2>빠른 실행</h2>" +
      '<div class="import-export-row">' +
      '<a class="btn btn--primary btn--sm" href="#/posts/new">+ 새 글 작성</a>' +
      '<a class="btn btn--accent btn--sm" href="#/columns/new">+ 새 칼럼 작성</a>' +
      '<a class="btn btn--secondary btn--sm" href="#/categories">카테고리 관리</a>' +
      "</div></div>";
  }
  function statCard(num, label) {
    return '<div class="admin-stat-card"><span class="num">' + num + '</span><span class="label">' + label + "</span></div>";
  }

  // ---------- 글 목록 ----------
  function renderPostsList() {
    var posts = getPosts().slice().sort(function (a, b) { return new Date(b.modified) - new Date(a.modified); });
    main.innerHTML =
      "<h1>일반 글 관리</h1>" +
      '<p class="admin-main__lead">이 데모에서 편집한 내용은 브라우저에만 저장되며 실제 정적 페이지에는 반영되지 않습니다.</p>' +
      '<div class="admin-toolbar"><a class="btn btn--primary btn--sm" href="#/posts/new">+ 새 글 작성</a></div>' +
      '<div class="admin-panel"><div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
      "<th>제목</th><th>카테고리</th><th>상태</th><th>추천</th><th>발행일</th><th>수정일</th><th></th>" +
      "</tr></thead><tbody>" +
      (posts.length
        ? posts.map(function (p) {
            return (
              "<tr><td class=\"wrap\">" + escapeHTML(p.title) + "</td>" +
              "<td>" + window.Chungdong.categoryName(p.category) + "</td>" +
              '<td><span class="' + (p.status === "published" ? "badge-published" : "badge-draft") + '">' + (p.status === "published" ? "발행" : "초안") + "</span></td>" +
              "<td>" + (p.featured ? "★" : "-") + "</td>" +
              "<td>" + p.published + "</td><td>" + p.modified + "</td>" +
              '<td class="admin-table__actions">' +
              '<a class="btn btn--ghost btn--sm" href="#/posts/edit/' + p.slug + '">편집</a>' +
              '<button class="btn btn--ghost btn--sm" data-delete-post="' + p.slug + '">삭제</button>' +
              "</td></tr>"
            );
          }).join("")
        : '<tr><td colspan="7">등록된 글이 없습니다.</td></tr>') +
      "</tbody></table></div></div>";

    main.querySelectorAll("[data-delete-post]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var slug = btn.getAttribute("data-delete-post");
        if (confirm("정말 이 글을 삭제하시겠습니까? (데모 저장소에서만 삭제됩니다)")) {
          setPosts(getPosts().filter(function (p) { return p.slug !== slug; }));
          renderPostsList();
        }
      });
    });
  }

  // ---------- 글 작성/수정 폼 ----------
  function renderPostForm(slug) {
    var isEdit = !!slug;
    var posts = getPosts();
    var post = isEdit ? posts.filter(function (p) { return p.slug === slug; })[0] : null;
    if (isEdit && !post) {
      main.innerHTML = "<h1>글을 찾을 수 없습니다</h1><a href=\"#/posts\">← 목록으로</a>";
      return;
    }
    var cats = getCategories();
    var allPosts = posts.filter(function (p) { return p.slug !== slug; });

    var faqText = post && post.faqItems ? post.faqItems.map(function (f) { return f.q + " | " + f.a; }).join("\n") : "";

    main.innerHTML =
      "<h1>" + (isEdit ? "글 수정" : "새 글 작성") + "</h1>" +
      '<p class="admin-main__lead">제목, 슬러그, 요약, 카테고리, 본문, FAQ, 관련 글, 추천 여부, 발행 상태를 입력하세요.</p>' +
      '<form id="post-form">' +
      '<div class="admin-form-grid">' +
      '<div class="admin-form-main">' +
      '<div class="admin-panel">' +
      field("title", "제목", post ? post.title : "", "text", true) +
      field("slug", "슬러그 (URL, 영문 소문자·하이픈 권장)", post ? post.slug : "", "text", true, isEdit) +
      field("excerpt", "요약", post ? post.excerpt : "", "textarea-small") +
      selectField("category", "카테고리", cats.map(function (c) { return { value: c.slug, label: c.name }; }), post ? post.category : (cats[0] && cats[0].slug)) +
      '<div class="form-field"><label for="f-body">본문</label><textarea id="f-body" name="body">' + escapeHTML(post ? post.body : "") + "</textarea></div>" +
      '<div class="form-field"><label for="f-faq">FAQ (한 줄에 하나, "질문 | 답변" 형식)</label><textarea id="f-faq" name="faq" style="min-height:90px;">' + escapeHTML(faqText) + "</textarea></div>" +
      "</div>" +
      "</div>" +
      '<div class="admin-form-side">' +
      '<div class="admin-panel">' +
      "<h2>발행 설정</h2>" +
      '<div class="toggle-row"><label for="f-status">발행 상태</label>' +
      '<select id="f-status" name="status"><option value="published"' + (post && post.status === "draft" ? "" : " selected") + '>발행</option><option value="draft"' + (post && post.status === "draft" ? " selected" : "") + ">초안</option></select></div>" +
      '<div class="toggle-row"><label for="f-featured">추천 글로 노출</label><input type="checkbox" id="f-featured" name="featured"' + (post && post.featured ? " checked" : "") + "></div>" +
      field("published", "작성일", post ? post.published : todayISO(), "date") +
      field("modified", "수정일", post ? post.modified : todayISO(), "date") +
      "</div>" +
      '<div class="admin-panel">' +
      "<h2>관련 글</h2>" +
      '<select id="f-related" multiple size="6" style="width:100%;">' +
      allPosts.map(function (p) {
        var selected = post && post.relatedSlugs && post.relatedSlugs.indexOf(p.slug) > -1;
        return '<option value="' + p.slug + '"' + (selected ? " selected" : "") + ">" + escapeHTML(p.title) + "</option>";
      }).join("") +
      "</select><p class=\"admin-hint\">Ctrl(⌘)+클릭으로 여러 개 선택할 수 있습니다.</p>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="form-actions">' +
      '<button type="submit" class="btn btn--primary">저장</button>' +
      '<button type="button" id="preview-btn" class="btn btn--secondary">미리보기</button>' +
      '<a href="#/posts" class="btn btn--ghost">취소</a>' +
      "</div>" +
      "</form>";

    document.getElementById("preview-btn").addEventListener("click", function () {
      var data = readPostForm();
      openPreview(data.title, data.excerpt, data.body);
    });

    document.getElementById("post-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var data = readPostForm();
      if (!data.slug) {
        alert("슬러그를 입력해주세요.");
        return;
      }
      var list = getPosts();
      var existingIndex = list.findIndex(function (p) { return p.slug === (isEdit ? slug : data.slug); });
      if (!isEdit && list.some(function (p) { return p.slug === data.slug; })) {
        alert("이미 존재하는 슬러그입니다. 다른 슬러그를 입력해주세요.");
        return;
      }
      if (existingIndex > -1) {
        list[existingIndex] = data;
      } else {
        list.push(data);
      }
      setPosts(list);
      alert("저장되었습니다. (브라우저 저장소 기준 데모 저장이며, 실제 사이트에는 반영되지 않습니다)");
      window.location.hash = "#/posts";
    });
  }

  function readPostForm() {
    var faqLines = document.getElementById("f-faq").value.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
    var faqItems = faqLines.map(function (line) {
      var idx = line.indexOf("|");
      return idx > -1 ? { q: line.slice(0, idx).trim(), a: line.slice(idx + 1).trim() } : { q: line, a: "" };
    });
    var relatedSelect = document.getElementById("f-related");
    var relatedSlugs = Array.prototype.slice.call(relatedSelect.selectedOptions).map(function (o) { return o.value; });
    return {
      title: document.getElementById("f-title").value.trim(),
      slug: document.getElementById("f-slug").value.trim(),
      excerpt: document.getElementById("f-excerpt").value.trim(),
      category: document.getElementById("f-category").value,
      body: document.getElementById("f-body").value,
      faqItems: faqItems,
      relatedSlugs: relatedSlugs,
      featured: document.getElementById("f-featured").checked,
      status: document.getElementById("f-status").value,
      published: document.getElementById("f-published").value,
      modified: document.getElementById("f-modified").value,
    };
  }

  // ---------- 칼럼 목록 ----------
  function renderColumnsList() {
    var columns = getColumns().slice().sort(function (a, b) { return new Date(b.modified) - new Date(a.modified); });
    main.innerHTML =
      "<h1>칼럼 관리 <span class=\"column-type-badge\">운영자 전용</span></h1>" +
      '<p class="admin-main__lead">칼럼은 일반 정보 글과 달리 운영자(' + escapeHTML((window.SITE_CONFIG || {}).ownerName || "") + ')의 시선이 담긴 관점 글입니다.</p>' +
      '<div class="admin-toolbar"><a class="btn btn--accent btn--sm" href="#/columns/new">+ 새 칼럼 작성</a></div>' +
      '<div class="admin-panel"><div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
      "<th>제목</th><th>상태</th><th>발행일</th><th>수정일</th><th></th>" +
      "</tr></thead><tbody>" +
      (columns.length
        ? columns.map(function (c) {
            return (
              "<tr><td class=\"wrap\">" + escapeHTML(c.title) + "</td>" +
              '<td><span class="' + (c.status === "draft" ? "badge-draft" : "badge-published") + '">' + (c.status === "draft" ? "초안" : "발행") + "</span></td>" +
              "<td>" + c.published + "</td><td>" + c.modified + "</td>" +
              '<td class="admin-table__actions">' +
              '<a class="btn btn--ghost btn--sm" href="#/columns/edit/' + c.slug + '">편집</a>' +
              '<button class="btn btn--ghost btn--sm" data-delete-column="' + c.slug + '">삭제</button>' +
              "</td></tr>"
            );
          }).join("")
        : '<tr><td colspan="5">등록된 칼럼이 없습니다.</td></tr>') +
      "</tbody></table></div></div>";

    main.querySelectorAll("[data-delete-column]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var slug = btn.getAttribute("data-delete-column");
        if (confirm("정말 이 칼럼을 삭제하시겠습니까? (데모 저장소에서만 삭제됩니다)")) {
          setColumns(getColumns().filter(function (c) { return c.slug !== slug; }));
          renderColumnsList();
        }
      });
    });
  }

  // ---------- 칼럼 작성/수정 폼 ----------
  function renderColumnForm(slug) {
    var isEdit = !!slug;
    var columns = getColumns();
    var col = isEdit ? columns.filter(function (c) { return c.slug === slug; })[0] : null;
    if (isEdit && !col) {
      main.innerHTML = "<h1>칼럼을 찾을 수 없습니다</h1><a href=\"#/columns\">← 목록으로</a>";
      return;
    }

    main.innerHTML =
      "<h1>" + (isEdit ? "칼럼 수정" : "새 칼럼 작성") + " <span class=\"column-type-badge\">운영자 메모/관점 글</span></h1>" +
      '<p class="admin-main__lead">칼럼은 정보 전달보다 운영자의 관찰과 생각을 담는 글입니다. 정직한 관찰(“요즘 자주 보이는 질문” 등) 위주로 작성해주세요.</p>' +
      '<form id="column-form">' +
      '<div class="admin-form-grid">' +
      '<div class="admin-form-main">' +
      '<div class="admin-panel">' +
      field("title", "제목", col ? col.title : "", "text", true) +
      field("slug", "슬러그", col ? col.slug : "", "text", true, isEdit) +
      field("excerpt", "요약(리드 문장)", col ? col.excerpt : "", "textarea-small") +
      '<div class="form-field"><label for="f-body">본문 (관점/메모)</label><textarea id="f-body" name="body">' + escapeHTML(col ? col.body : "") + "</textarea></div>" +
      "</div>" +
      "</div>" +
      '<div class="admin-form-side">' +
      '<div class="admin-panel">' +
      "<h2>발행 설정</h2>" +
      '<div class="toggle-row"><label for="f-status">발행 상태</label>' +
      '<select id="f-status" name="status"><option value="published"' + (col && col.status === "draft" ? "" : " selected") + '>발행</option><option value="draft"' + (col && col.status === "draft" ? " selected" : "") + ">초안</option></select></div>" +
      field("published", "작성일", col ? col.published : todayISO(), "date") +
      field("modified", "수정일", col ? col.modified : todayISO(), "date") +
      '<p class="admin-hint">칼럼 작성자는 항상 "' + escapeHTML((window.SITE_CONFIG || {}).ownerName || "") + '"(으)로 연결됩니다.</p>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="form-actions">' +
      '<button type="submit" class="btn btn--primary">저장</button>' +
      '<button type="button" id="preview-btn" class="btn btn--secondary">미리보기</button>' +
      '<a href="#/columns" class="btn btn--ghost">취소</a>' +
      "</div>" +
      "</form>";

    document.getElementById("preview-btn").addEventListener("click", function () {
      var title = document.getElementById("f-title").value;
      var excerpt = document.getElementById("f-excerpt").value;
      var body = document.getElementById("f-body").value;
      openPreview(title, excerpt, body);
    });

    document.getElementById("column-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        title: document.getElementById("f-title").value.trim(),
        slug: document.getElementById("f-slug").value.trim(),
        excerpt: document.getElementById("f-excerpt").value.trim(),
        body: document.getElementById("f-body").value,
        status: document.getElementById("f-status").value,
        published: document.getElementById("f-published").value,
        modified: document.getElementById("f-modified").value,
      };
      if (!data.slug) {
        alert("슬러그를 입력해주세요.");
        return;
      }
      var list = getColumns();
      var existingIndex = list.findIndex(function (c) { return c.slug === (isEdit ? slug : data.slug); });
      if (!isEdit && list.some(function (c) { return c.slug === data.slug; })) {
        alert("이미 존재하는 슬러그입니다.");
        return;
      }
      if (existingIndex > -1) {
        list[existingIndex] = data;
      } else {
        list.push(data);
      }
      setColumns(list);
      alert("저장되었습니다. (브라우저 저장소 기준 데모 저장이며, 실제 사이트에는 반영되지 않습니다)");
      window.location.hash = "#/columns";
    });
  }

  // ---------- 카테고리 ----------
  function renderCategories() {
    var cats = getCategories();
    main.innerHTML =
      "<h1>카테고리</h1>" +
      '<p class="admin-main__lead">카테고리 구조는 사이트 정보 구조의 뼈대입니다. 데모에서는 이름과 설명 문구를 편집해볼 수 있습니다.</p>' +
      '<div class="admin-panel"><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>이름</th><th>슬러그</th><th class="wrap">설명</th><th></th></tr></thead><tbody>' +
      cats.map(function (c, i) {
        return (
          '<tr><td><input data-cat-field="name" data-idx="' + i + '" value="' + escapeHTML(c.name) + '" style="width:120px;"></td>' +
          "<td>" + c.slug + "</td>" +
          '<td class="wrap"><input data-cat-field="description" data-idx="' + i + '" value="' + escapeHTML(c.description) + '" style="width:100%;"></td>' +
          '<td><a class="btn btn--ghost btn--sm" href="/categories/' + c.slug + '/" target="_blank">보기 ↗</a></td></tr>'
        );
      }).join("") +
      "</tbody></table></div>" +
      '<div class="form-actions"><button id="save-cats" class="btn btn--primary btn--sm">카테고리 저장</button></div>' +
      '<p class="admin-hint">새 카테고리를 추가하려면 /data/categories.js 파일에 항목을 추가하고 /categories/{slug}/index.html 페이지를 만들어야 합니다. (README 참고)</p>' +
      "</div>";

    document.getElementById("save-cats").addEventListener("click", function () {
      var inputs = main.querySelectorAll("[data-cat-field]");
      inputs.forEach(function (input) {
        var idx = Number(input.getAttribute("data-idx"));
        var field = input.getAttribute("data-cat-field");
        cats[idx][field] = input.value;
      });
      setCategories(cats);
      alert("저장되었습니다. (데모 저장소 기준)");
    });
  }

  // ---------- 사이트 설정 ----------
  function renderSettings() {
    var s = getSettings();
    main.innerHTML =
      "<h1>사이트 설정</h1>" +
      '<p class="admin-main__lead">사이트명, 소개 문구, 운영자 정보, 색상 등을 관리합니다. 실제 반영은 /data/site.config.js 파일 수정을 통해 이루어집니다.</p>' +
      '<div class="admin-panel settings-form">' +
      '<form id="settings-form">' +
      field("siteName", "사이트명", s.siteName, "text") +
      field("tagline", "한줄 소개", s.tagline, "text") +
      field("ownerName", "운영자명", s.ownerName, "text") +
      field("ownerBio", "운영자 소개 문구", s.ownerBio, "textarea-small") +
      field("contactEmail", "연락 이메일", s.contactEmail, "email") +
      field("mainColor", "메인 컬러", s.mainColor, "color") +
      field("subColor", "서브 컬러", s.subColor, "color") +
      field("siteUrl", "기본 도메인", s.siteUrl, "text") +
      '<div class="form-actions"><button type="submit" class="btn btn--primary">설정 저장</button></div>' +
      "</form></div>" +
      '<div class="admin-panel">' +
      "<h2>데이터 내보내기 / 가져오기</h2>" +
      '<p class="admin-hint">현재 브라우저에 저장된 글·칼럼·카테고리·설정 데이터를 JSON 파일로 내보내거나, 백업해둔 JSON 파일을 불러올 수 있습니다.</p>' +
      '<div class="import-export-row">' +
      '<button id="export-json" class="btn btn--secondary btn--sm">JSON으로 내보내기</button>' +
      '<label class="btn btn--secondary btn--sm" style="cursor:pointer;">JSON 가져오기<input type="file" id="import-json" accept="application/json" style="display:none;"></label>' +
      '<button id="reset-data" class="btn btn--ghost btn--sm">데모 데이터 초기화</button>' +
      "</div>" +
      '<p class="admin-hint" style="margin-top:12px;">내보낸 JSON을 실제 사이트에 반영하려면, 그 내용을 참고해 /data/posts.js, /data/columns.js 파일을 직접 수정하고 해당 slug의 정적 HTML 페이지를 만들어야 합니다.</p>' +
      "</div>";

    document.getElementById("settings-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var updated = {
        siteName: document.getElementById("f-siteName").value,
        tagline: document.getElementById("f-tagline").value,
        ownerName: document.getElementById("f-ownerName").value,
        ownerBio: document.getElementById("f-ownerBio").value,
        contactEmail: document.getElementById("f-contactEmail").value,
        mainColor: document.getElementById("f-mainColor").value,
        subColor: document.getElementById("f-subColor").value,
        siteUrl: document.getElementById("f-siteUrl").value,
      };
      setSettings(updated);
      alert("설정이 저장되었습니다. (데모 저장소 기준이며, 실제 사이트 반영은 /data/site.config.js 수정이 필요합니다)");
    });

    document.getElementById("export-json").addEventListener("click", function () {
      var payload = {
        exportedAt: new Date().toISOString(),
        posts: getPosts(),
        columns: getColumns(),
        categories: getCategories(),
        settings: getSettings(),
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "chungdong-cms-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    document.getElementById("import-json").addEventListener("change", function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          if (data.posts) setPosts(data.posts);
          if (data.columns) setColumns(data.columns);
          if (data.categories) setCategories(data.categories);
          if (data.settings) setSettings(data.settings);
          alert("가져오기가 완료되었습니다.");
          router();
        } catch (err) {
          alert("JSON 파일을 읽는 데 실패했습니다. 형식을 확인해주세요.");
        }
      };
      reader.readAsText(file);
    });

    document.getElementById("reset-data").addEventListener("click", function () {
      if (confirm("데모 데이터를 초기 상태로 되돌리시겠습니까? 저장소에 저장된 편집 내용이 모두 사라집니다.")) {
        window.localStorage.removeItem(LS_KEYS.posts);
        window.localStorage.removeItem(LS_KEYS.columns);
        window.localStorage.removeItem(LS_KEYS.categories);
        window.localStorage.removeItem(LS_KEYS.settings);
        seedIfEmpty();
        alert("초기화되었습니다.");
        router();
      }
    });
  }

  // ---------- 미리보기 모달 ----------
  function openPreview(title, excerpt, body) {
    document.getElementById("preview-content").innerHTML =
      "<h1>" + escapeHTML(title || "(제목 없음)") + "</h1>" +
      "<p style=\"color:var(--color-text-soft);\">" + escapeHTML(excerpt || "") + "</p>" +
      "<hr>" +
      "<div>" + escapeHTML(body || "").split("\n").map(function (line) { return "<p>" + (line || "&nbsp;") + "</p>"; }).join("") + "</div>";
    document.getElementById("preview-modal").hidden = false;
  }
  document.getElementById("preview-close").addEventListener("click", function () {
    document.getElementById("preview-modal").hidden = true;
  });

  // ---------- 폼 필드 헬퍼 ----------
  function field(name, label, value, type, required, readonly) {
    type = type || "text";
    if (type === "textarea-small") {
      return (
        '<div class="form-field"><label for="f-' + name + '">' + label + "</label>" +
        '<textarea id="f-' + name + '" name="' + name + '" style="min-height:70px;">' + escapeHTML(value) + "</textarea></div>"
      );
    }
    return (
      '<div class="form-field"><label for="f-' + name + '">' + label + "</label>" +
      '<input type="' + type + '" id="f-' + name + '" name="' + name + '" value="' + escapeHTML(value) + '"' +
      (required ? " required" : "") +
      (readonly ? " readonly" : "") +
      "></div>"
    );
  }
  function selectField(name, label, options, selected) {
    return (
      '<div class="form-field"><label for="f-' + name + '">' + label + "</label>" +
      '<select id="f-' + name + '" name="' + name + '">' +
      options.map(function (o) {
        return '<option value="' + o.value + '"' + (o.value === selected ? " selected" : "") + ">" + o.label + "</option>";
      }).join("") +
      "</select></div>"
    );
  }

  // ---------- 초기 진입 ----------
  document.addEventListener("DOMContentLoaded", function () {
    if (window.Chungdong.isAdmin()) {
      showApp();
    } else {
      showLogin();
    }
    if (!window.location.hash) {
      window.location.hash = "#/dashboard";
    }
  });
})();
