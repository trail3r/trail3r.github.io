/* ====================================================================================================
파일(File): assets/js/customs/codeblock/floating_copy_button.js

목적(Purpose):
    - 코드블럭의 복사 버튼이 가려지면 복사 버튼을 코드블럭 내부에 띄워 복사 편의성을 제공합니다.

의존성(Dependencies):
    - Tree-Sitter Syntax Highlighter
    - assets/js/customs/codeblock/metadata.js

참고사항(Notes):
    - 이 코드는 코드블럭의 메타데이터를 표시하는 상단바를 추가하는 코드(./metadata.js)가 먼저 로드되어야 합니다.
======================================================================================================= */


(function () {
    "use strict";
    
    const MASTHEAD = document.querySelector(".masthead");
    const BUTTON = ".codeblock-copy_button";

    /* 최소 길이 제한: 코드가 20줄을 초과해야 떠있는 복사 버튼을 렌더링합니다. */
    const MIN_LINES = 20;

    /* 복사 버튼 위치 조절 */
    const PADDING_TOP = 8;  // Unit: px (pixels)
    const PADDING_RIGHT = 11;  // Unit: px (pixels)

    /* 플로팅 복사 버튼의 DOM 요소 저장 */
    let wrapper = null;
    let button = null;
    let icon = null;
    let label = null;

    /* 캐시 변수 */
    let active_block = null;
    let cached_margin_top = 0;
    let target_codeblocks = [];


    /* 변수 초기화 */
    function initialize() {
        // 상단 네비게이션 바의 높이를 계산하여 캐싱합니다.
        cached_margin_top = Math.round(MASTHEAD.getBoundingClientRect().height + PADDING_TOP);

        /* 플로팅 복사 버튼 생성 */
        wrapper = document.createElement("div");
        wrapper.className = "codeblock-copy--floating";
        wrapper.style.display = "none";
        wrapper.innerHTML = `
            <button class="codeblock-copy_button codeblock-copy_button--floating" type="button">
                <img class="codeblock-copy_button_icon" alt="" aria-hidden="true">
                <span class="codeblock-copy_button_label">복사</span>
            </button>
        `;

        document.body.appendChild(wrapper);

        button = wrapper.querySelector("button");
        icon = wrapper.querySelector(".codeblock-copy_button_icon");
        label = wrapper.querySelector(".codeblock-copy_button_label");


        /* 페이지 내 코드블럭 중 플로팅 버튼이 필요한 코드블럭 저장 */
        document.querySelectorAll(".highlighter-tree-sitter").forEach(codeblock => {
            const code = codeblock.querySelector("pre > code");
            
            // 코드의 줄 수를 계산합니다.
            const text = code.textContent || "";
            let lines = text.split("\n").length;
            if (text.endsWith("\n")) lines -= 1;

            // 20줄을 초과하는 코드블럭을 저장합니다.
            if (Math.max(1, lines) > MIN_LINES) {
                target_codeblocks.push(codeblock);
            }
        });
    }


    /* 플로팅 복사 버튼 비활성화 */
    function deactive() {
        wrapper.style.display = "none";
        active_block = null;
    }


    /* 스크롤 위치에 따른 플로팅 복사 버튼 활성화 상태 및 위치 업데이트 */
    function update() {
        let target = null;

        for (const codeblock of target_codeblocks) {
            const codeblock_position = codeblock.getBoundingClientRect();

            if (codeblock_position.bottom < 0 || codeblock_position.top > window.innerHeight) {
                // 화면을 벗어난 코드블럭은 계산을 생략합니다.
                continue;
            }

            const original_button = codeblock.querySelector(BUTTON);
            const original_button_position = original_button.getBoundingClientRect();

            if (original_button_position.bottom > cached_margin_top - 10) {
                // 코드블럭의 원본 복사 버튼이 화면에 보이면 떠있는 복사 버튼을 비활성화합니다.
                continue;
            }

            if (codeblock_position.bottom <= cached_margin_top + original_button_position.height + 20) {
                // 코드블럭이 화면에서 완전히 사라지기 전에 떠있는 복사 버튼을 비활성화합니다.
                continue;
            }

            // 비활성 조건을 통과하였다면, 해당 코드블럭은 플로팅 버튼을 띄워야 합니다.
            target = codeblock;
            break;
        }


        /* 탐색 대상 코드블럭이 없으면 떠있는 복사 버튼을 비활성화 */
        if (!target) {
            deactive();
            return;
        }


        /* 스크롤 중 새로운 코드블럭 활성화 시 버튼 UI 동기화 */
        if (target !== active_block) {
            active_block = target;
            const original_button = active_block.querySelector(BUTTON);

            if (original_button) {
                const original_icon = original_button.querySelector(".codeblock-copy_button_icon");
                const original_label = original_button.querySelector(".codeblock-copy_button_label");

                // 원본 복사 버튼의 상태를 플로팅 복사 버튼으로 복사합니다.
                icon.src = original_icon.src;
                label.textContent = original_label.textContent;
                button.classList.toggle("is-copied", original_button.classList.contains("is-copied"));
            }

            wrapper.style.display = "block";
        }


        /* 플로팅 복사 버튼 위치 조절 */
        const right = Math.max(8, (window.innerWidth - active_block.getBoundingClientRect().right) + PADDING_RIGHT);
        wrapper.style.top = `${cached_margin_top}px`;
        wrapper.style.right = `${right}px`;
    }


    function main() {
        initialize();

        /* 플로팅 복사 버튼 클릭 시 원본 복사 버튼에 클릭 이벤트 전달 */
        button.addEventListener("click", () => {
            if (!active_block) {
                // 게시글에 코드블럭이 없으면 함수를 즉시 종료합니다.
                return;
            }
            const original_button = active_block.querySelector(BUTTON);
            original_button.dispatchEvent(new CustomEvent("copybutton:request", { bubbles: true }));
        });


        /* 원본 복사 버튼과 플로팅 복사 버튼의 상태 동기화 */
        document.addEventListener("copybutton:state", (e) => {
            if (active_block && active_block.contains(e.target)) {
                if (e.detail.icon_path) icon.src = e.detail.icon_path;
                if (e.detail.text) label.textContent = e.detail.text;
                button.classList.toggle("is-copied", !!e.detail.copied);
            }
        });


        /* 스크롤 성능 최적화 */
        let tick = false;
        function scrolling_or_resize() {
            if (tick) return;
            tick = true;
            requestAnimationFrame(() => {
                // Throttling: 스크롤 이벤트의 무분별한 호출을 방지합니다.
                update();
                tick = false;
            });
        }


        /* 화면 크기가 변경 시 버튼 위치 조정 */
        window.addEventListener("resize", () => {
            cached_margin_top = Math.round(MASTHEAD.getBoundingClientRect().height + PADDING_TOP);
            scrolling_or_resize();
        });


        /* 스크롤 중 플로팅 복사 버튼 위치 및 활성화 상태 업데이트 */
        window.addEventListener("scroll", scrolling_or_resize, { passive: true });

        
        update();
    }


    document.addEventListener("DOMContentLoaded", main);
})();