/* ====================================================================================================
파일(File): assets/js/customs/posts-archive-layout-switch.js

목적(Purpose):
    - 단일 마크업으로 렌더링된 카테고리별 게시판의 레이아웃 전환 기능을 구현합니다.

참고사항(Notes):
    - 단일 마크업으로 게시판을 렌더링하는 `_includes/customs/posts-archive.html`과 함께 사용됩니다.
======================================================================================================= */



(function () {
    "use strict";

    /* 게시판의 레이아웃 상태 전환 */
    function set_layout(posts_archive, layout) {
        posts_archive.setAttribute("data-layout", layout);
        posts_archive.classList.remove("posts-archive--card", "posts-archive--gallery", "posts-archive--list");
        posts_archive.classList.add(`posts-archive--${layout}`);

        const buttons = posts_archive.querySelectorAll("[data-posts-archive-layout]");
        for (const button of buttons) {
            const button_layout = button.getAttribute("data-posts-archive-layout");
            button.setAttribute("aria-pressed", button_layout === layout ? "true" : "false");
        }
    }


    function main(posts_archive) {
        // 사용자가 선택한 레이아웃 상태를 저장합니다.
        const storage = window.localStorage;
        const storage_key = "posts-archive:layout:" + posts_archive.getAttribute("data-storage-key");

        const layout = new Set(["card", "gallery", "list"]);

        const default_layout = posts_archive.getAttribute("data-default-layout") || "card";
        const save_layout = storage.getItem(storage_key);
        const initial_layout = layout.has(save_layout) ? save_layout : (layout.has(default_layout) ? default_layout : "card");

        set_layout(posts_archive, initial_layout);

        posts_archive.addEventListener("click", (event) => {
            const button = event.target.closest("[data-posts-archive-layout]");
            const next_layout = button.getAttribute("data-posts-archive-layout");

            set_layout(posts_archive, next_layout);

            storage.setItem(storage_key, next_layout);
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("[data-posts-archive]").forEach(main);
    })
})();