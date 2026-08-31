/**
 * /author/ 페이지 전용 스크립트
 * 관리자 세션(localStorage 기반 데모) 여부에 따라 배너를 분기하고,
 * 일반 사용자에게는 "칼럼 읽기" 안내를, 관리자 세션에는 "새 칼럼 작성하기" 버튼을 보여줍니다.
 */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var R = window.ChungdongRender;

    var bannerMount = document.getElementById("session-banner-mount");
    if (bannerMount) {
      if (window.Chungdong.isAdmin()) {
        bannerMount.innerHTML =
          '<div class="session-banner session-banner--admin">' +
          "<p><strong>관리자 세션이 활성화되어 있습니다.</strong> 새 칼럼을 바로 작성할 수 있습니다.</p>" +
          '<a class="btn btn--accent btn--sm" href="' + window.Chungdong.url("admin/#/columns/new") + '">새 칼럼 작성하기</a>' +
          "</div>";
      } else {
        bannerMount.innerHTML =
          '<div class="session-banner session-banner--guest">' +
          "<p>운영자가 정리한 칼럼을 읽어보세요. (관리자로 로그인하면 이 자리에 칼럼 작성 버튼이 표시됩니다 — <a href=\"" + window.Chungdong.url("admin/") + "\">관리자 데모 로그인</a>)</p>" +
          "</div>";
      }
    }

    R.renderInto("author-columns", R.latestColumns(3), R.columnCardHTML, "아직 등록된 칼럼이 없습니다.");
    R.renderInto("author-latest-posts", R.latestPosts(4), R.postCardHTML);
  });
})();
