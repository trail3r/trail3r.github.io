/*
파일(File):
    - assets/js/customs/codeblock/floating_copy_button.js

목적(Purpose):
    - 코드블럭의 복사 버튼이 가려지면 복사 버튼을 코드블럭 내부에 띄워 복사 편의성을 제공합니다.

의존성(Dependencies):
    - Tree-Sitter Syntax Highlighter
    - assets/js/customs/codeblock/metadata.js
    - assets/js/customs/codeblock/copy_to_clipboard.js
*/


(function () {
    "use strict";

    const MASTHEAD = document.querySelector(".masthead");
    const BUTTON = ".codeblock-copy_button";

    /* 최소 길이 제한: 코드가 20줄을 초과해야 떠있는 복사 버튼을 렌더링합니다. */
    const MIN_LINES = 20;

    /* 복사 버튼 위치 조절 */
    const PADDING_TOP = 8;     // Unit: px (pixels)
    const PADDING_RIGHT = 11;  // Unit: px (pixels)

    /* DOM 요소 생성 헬퍼 */
    function createElement(tag, className, textContent) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = textContent;

        return element;
    }

    /* 플로팅 복사 버튼의 DOM 요소 */
    let wrapper = null;
    let button = null;
    let icon = null;
    let label = null;

    /* 캐시 변수 */
    let activeBlock = null;
    let cachedMarginTop = 0;
    let targetCodeblocks = [];

    /* 변수 초기화 */
    function initialize() {
        // 상단 네비게이션 바의 높이를 계산하여 캐싱합니다.
        cachedMarginTop = Math.round(MASTHEAD.getBoundingClientRect().height + PADDING_TOP);

        /* 플로팅 복사 버튼 생성 */
        wrapper = createElement("div", "codeblock-copy--floating");
        wrapper.style.display = "none";

        button = createElement("button", "codeblock-copy_button codeblock-copy_button--floating");
        button.type = "button";

        icon = createElement("img", "codeblock-copy_button_icon");
        icon.alt = "";
        icon.setAttribute("aria-hidden", "true");

        label = createElement("span", "codeblock-copy_button_label", "복사");

        button.append(icon, label);
        wrapper.appendChild(button);
        document.body.appendChild(wrapper);

        /* 페이지 내 코드블럭 중 플로팅 버튼이 필요한 코드블럭 저장 */
        document.querySelectorAll(".highlighter-tree-sitter").forEach(codeblock => {
            const code = codeblock.querySelector("pre > code");
            const lines = Math.max(1, (code.textContent || "").trimEnd().split("\n").length);

            if (lines > MIN_LINES) {
                targetCodeblocks.push(codeblock);
            }
        });
    }

    /* 플로팅 복사 버튼 비활성화 */
    function deactivate() {
        wrapper.style.display = "none";
        activeBlock = null;
    }

    /* 스크롤 위치에 따른 플로팅 복사 버튼 활성화 상태 및 위치 업데이트 */
    function update() {
        let target = null;

        for (const codeblock of targetCodeblocks) {
            const codeblockPosition = codeblock.getBoundingClientRect();

            if (codeblockPosition.bottom < 0 || codeblockPosition.top > window.innerHeight) {
                // 화면을 벗어난 코드블럭은 계산을 생략합니다.
                continue;
            }

            const originalButton = codeblock.querySelector(BUTTON);
            const originalButtonPosition = originalButton.getBoundingClientRect();

            if (originalButtonPosition.bottom > cachedMarginTop - 10) {
                // 코드블럭의 원본 복사 버튼이 화면에 보이면 떠있는 복사 버튼을 비활성화합니다.
                continue;
            }

            if (codeblockPosition.bottom <= cachedMarginTop + originalButtonPosition.height + 20) {
                // 코드블럭이 화면에서 완전히 사라지기 전에 떠있는 복사 버튼을 비활성화합니다.
                continue;
            }

            // 비활성 조건을 통과하였다면, 해당 코드블럭은 플로팅 버튼을 띄워야 합니다.
            target = codeblock;
            break;
        }

        /* 탐색 대상 코드블럭이 없으면 떠있는 복사 버튼을 비활성화 */
        if (!target) {
            deactivate();
            return;
        }

        /* 스크롤 중 새로운 코드블럭 활성화 시 버튼 UI 동기화 */
        if (target !== activeBlock) {
            activeBlock = target;
            const originalButton = activeBlock.querySelector(BUTTON);

            if (originalButton) {
                const originalIcon = originalButton.querySelector(".codeblock-copy_button_icon");
                const originalLabel = originalButton.querySelector(".codeblock-copy_button_label");

                // 원본 복사 버튼의 상태를 플로팅 복사 버튼으로 복사합니다.
                icon.src = originalIcon.src;
                label.textContent = originalLabel.textContent;
                button.classList.toggle("is-copied", originalButton.classList.contains("is-copied"));
            }

            wrapper.style.display = "block";
        }

        /* 플로팅 복사 버튼 위치 조절 */
        const right = Math.max(8, (window.innerWidth - activeBlock.getBoundingClientRect().right) + PADDING_RIGHT);
        wrapper.style.top = `${cachedMarginTop}px`;
        wrapper.style.right = `${right}px`;
    }

    function renderFloatingCopyButton() {
        initialize();

        /* 플로팅 복사 버튼 클릭 시 원본 복사 버튼에 클릭 이벤트 전달 */
        button.addEventListener("click", () => {
            if (!activeBlock) {
                return;
            }

            const originalButton = activeBlock.querySelector(BUTTON);
            originalButton.dispatchEvent(new CustomEvent("copybutton:request", { bubbles: true }));
        });

        /* 원본 복사 버튼과 플로팅 복사 버튼의 상태 동기화 */
        document.addEventListener("copybutton:state", (e) => {
            if (activeBlock && activeBlock.contains(e.target)) {
                if (e.detail.iconPath) icon.src = e.detail.iconPath;
                if (e.detail.text) label.textContent = e.detail.text;
                button.classList.toggle("is-copied", !!e.detail.copied);
            }
        });

        /* 스크롤 성능 최적화 */
        let tick = false;
        function ScrollingOrResize() {
            if (tick) return;
            tick = true;
            requestAnimationFrame(() => {
                // Throttling: 스크롤 이벤트의 무분별한 호출을 방지합니다.
                update();
                tick = false;
            });
        }

        /* 화면 크기 변경 시 버튼 위치 조정 */
        window.addEventListener("resize", () => {
            cachedMarginTop = Math.round(MASTHEAD.getBoundingClientRect().height + PADDING_TOP);
            ScrollingOrResize();
        });

        /* 스크롤 중 플로팅 복사 버튼 위치 및 활성화 상태 업데이트 */
        window.addEventListener("scroll", ScrollingOrResize, { passive: true });

        update();
    }

    document.addEventListener("DOMContentLoaded", renderFloatingCopyButton);
})();