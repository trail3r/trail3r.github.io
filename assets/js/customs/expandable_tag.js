/* ====================================================================================================
파일(File): assets/js/customs/tag_expand.js

목적(Purpose):
    - 태그가 많은 게시글의 일부 태그를 숨기고 "+ N" 버튼을 통해 태그 전체 표시 및 일부 숨기기 기능을 제공합니다.

인자(Argument):
    - (선택사항) post(객체): 카테고리/태그를 렌더링할 게시글 객체(기본값: 현재 컨텍스트의 post)

참고사항(Notes):
    - _includes/customs/posts-taxonomy.html과 함께 작동합니다.
    - 태그를 숨기고 표시하는 기능은 _sass/customs/_posts-taxonomy.scss와 함께 작동합니다.
======================================================================================================= */


(function () {
    "use strict";

    /* 태그의 확장/숨김 상태 설정 */
    function set_expand(tag_wrapper, button, expanded) {
        const hidden_tags = tag_wrapper.querySelectorAll(".posts__tag--hidden");
        hidden_tags.forEach(select => (select.hidden = !expanded));

        button.setAttribute("aria-expanded", String(expanded));
        tag_wrapper.dataset.collapsed = expanded ? "false" : "true";

        const expand_text = button.getAttribute("data-expand-text") || "+";
        const hide_text = button.getAttribute("data-hide-text") || "접기";
        button.textContent = expanded ? hide_text : expand_text;
    }


    /* 버튼 클릭 시 호출되는 이벤트 핸들러 */
    function on_click(element) {
        const button = element.target.closest(".posts__tag-expand-btn");
        const taxonomy = button.closest(".posts__taxonomy");
        const expanded = button.getAttribute("aria-expanded") === "true";
        set_expand(taxonomy, button, !expanded);
    }

    document.addEventListener("click", on_click);

    window.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".posts__taxonomy").forEach(taxonomy => {
            const button = taxonomy.querySelector(".posts__tag-expand-btn");
            set_expand(taxonomy, button, false);  // 초기 상태는 숨김 상태입니다.
        });
    });
})();