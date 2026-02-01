/* 
    파일: assets/js/customs/bulletin_layout_switch.js
    
    목적: _includes/customs/bulletin.html을 통해 렌더링된 단일 마크업에 게시판 레이아웃 전환 기능을 추가합니다.
*/



(function () {
    "use strict";

    const LAYOUT = new Set(["card", "gallery", "list"]);

    const BULLETIN = "[data-bulletin]";
    const BUTTON = "[data-bulletin-layout]";

    const PREFIX = "bulletin--";
    const STORAGE_PREFIX = "bulletin:layout:";

    /**
     * layout 입력을 정규화하는 함수입니다.
     * @param {string} text 정규화하고 싶은 문자열을 전달합니다.
     * @returns 입력값을 문자열로 변환하고, 공백을 제거하고, 소문자로 변환한 결과를 반환합니다.
     */
    function normalization(text) {
        return (text || "").toString().trim().toLowerCase();
    }


    /**
     * 로컬 저장 공간을 조회합니다.
     * @returns Document 출처의 Storage 객체를 반환합니다.
     */
    function gest_localStorage() {
        try {
            return window.localStorage;
        } catch (e) {
            return null;
        }
    }


    /**
     * 사용자가 선택한 게시판 레이아웃 형태를 저장합니다.
     * @param {string} bulletin 사용자 정의 게시판을 전달합니다.
     * @returns Document 출처의 Storage 객체에 레이아웃 상태를 덧붙여 저장한 객체를 반환합니다.
     */
    function gest_localStorage_key(bulletin) {
        const key = normalization(bulletin.getAttribute("data-storage-key")) || normalization(bulletin.getAttribute("data-key"));

        if (key) {
            return `${STORAGE_PREFIX}${key}`
        }

        // fallback
        const path = normalization(window.location.pathname) || "global";
        return `${STORAGE_PREFIX}${path}`
    }


    /**
     * 게시판의 레이아웃을 설정합니다.
     * @param {string} bulletin 사용자 정의 게시판을 전달합니다.
     * @param {string} layout 설정할 레이아웃 상태를 전달합니다.
     */
    function set_layout(bulletin, layout) {
        const final_layout = LAYOUT.has(layout) ? layout : "card";

        bulletin.setAttribute("data-layout", final_layout);

        bulletin.classList.remove(`${PREFIX}card`, `${PREFIX}gallery`, `${PREFIX}list`);
        bulletin.classList.add(`${PREFIX}${final_layout}`);

        const buttons = bulletin.querySelectorAll(BUTTON);
        for (const button of buttons) {
            const button_layout = normalization(button.getAttribute("data-bulletin-layout"));
            button.setAttribute("aria-pressed", button_layout === final_layout ? "true" : "false");
        }
    }


    function main(bulletin) {
        const storage = gest_localStorage();
        const storage_key = gest_localStorage_key(bulletin);

        const default_layout = normalization(bulletin.getAttribute("data-default-layout")) || "card";

        const save_layout = storage ? normalization(storage.getItem(storage_key)) : "";

        const initial_layout = LAYOUT.has(save_layout) ? save_layout : (LAYOUT.has(default_layout) ? default_layout : "card");

        set_layout(bulletin, initial_layout);

        bulletin.addEventListener("click", (event) => {
            const button = event.target.closest(BUTTON);
            if (!button || !bulletin.contains(button)) {
                return;
            }

            const next_layout = normalization(button.getAttribute("data-bulletin-layout"));
            if (!LAYOUT.has(next_layout)) {
                return;
            }

            set_layout(bulletin, next_layout);

            if (storage) {
                try {
                    storage.setItem(storage_key, next_layout);
                } catch (e) {
                    // Ignore.
                }
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(BULLETIN).forEach(main);
    });
})();