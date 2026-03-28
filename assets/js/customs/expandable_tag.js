/*
파일(File):
    - assets/js/customs/expandable_tag.js

목적(Purpose):
    - 태그가 많은 게시글의 일부 태그를 숨기고 "+ N" 버튼을 통해 태그 전체 표시 및 일부 숨기기 기능을 제공합니다.

의존성(Dependencies):
    - _includes/customs/posts-taxonomy.html
*/


(function () {
    "use strict";

    /* 태그의 확장/숨김 상태 설정 */
    function setExpand(tagWrapper, button, expanded) {
        const hiddenTags = tagWrapper.querySelectorAll(".posts__tag--hidden");
        hiddenTags.forEach(tag => (tag.hidden = !expanded));

        button.setAttribute("aria-expanded", String(expanded));
        tagWrapper.dataset.collapsed = expanded ? "false" : "true";

        const expandText = button.getAttribute("data-expand-text") || "+";
        const hideText = button.getAttribute("data-hide-text") || "접기";
        button.textContent = expanded ? hideText : expandText;
    }

    /* 버튼 클릭 이벤트 핸들러 */
    function onClick(event) {
        const button = event.target.closest(".posts__expand-btn");
        const taxonomy = button.closest(".posts__taxonomy");
        const expanded = button.getAttribute("aria-expanded") === "true";
        setExpand(taxonomy, button, !expanded);
    }

    document.addEventListener("click", onClick);

    window.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".posts__taxonomy").forEach(taxonomy => {
            const button = taxonomy.querySelector(".posts__expand-btn");
            setExpand(taxonomy, button, false);  // default: 숨김
        });
    });
})();