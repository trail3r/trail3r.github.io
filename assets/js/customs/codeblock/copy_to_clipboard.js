/* ====================================================================================================
파일(File): assets/js/customs/codeblock/copy_to_clipboard.js

목적(Purpose):
    - 코드블럭에 코드를 복사할 수 있는 버튼을 추가합니다.

의존성(Dependencies):
    - Tree-Sitter Syntax Highlighter
    - assets/js/customs/codeblock/metadata.js

참고사항(Notes):
    - 이 코드는 코드블럭의 메타데이터를 표시하는 상단바를 추가하는 코드(./metadata.js)가 먼저 로드되어야 합니다.
======================================================================================================= */



(function () {
    "use strict";

    /* 복사 버튼이 복사 완료를 표시하고 원래 상태로 돌아가는 시간 */
    const RESET_TIME = 1000;  // Unit: ms (milliseconds)

    /* 복사 버튼 아이콘 경로 */
    const COPY_ICON_PATH = "/assets/images/codeblock/copy_button.svg";
    const COPIED_ICON_PATH = "/assets/images/codeblock/copied_button.svg";


    /* 복사 기능 추가 */
    async function copy_to_clipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }

        // Fallback: Back-up Code
        // clipboard API는 localhost 또는 https(SecureContext 환경)에서만 작동합니다.
        // GitHub Pages는 https(SecureContext)로 빌드되지만, 알 수 없는 예외 상황을 위하여 폴백 복사 기능을 정의합니다.
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.cssText = "position: fixed; left: -9999px";

        document.body.appendChild(textarea);
        textarea.select();

        try {
            if (!document.execCommand("copy")) {
                throw new Error("Failed to copy");
            };
        } finally {
            document.body.removeChild(textarea);
        }
    }


    function main(codeblock) {
        const masthead = codeblock.querySelector(".codeblock-masthead");
        const code = codeblock.querySelector("pre > code");
        
        /* 복사 버튼 생성 */
        const wrapper = document.createElement("div");
        wrapper.className = "codeblock-copy";

        // const button = document.createElement("button");
        // button.className = "codeblock-copy_button";
        // button.type = "button";

        // const icon = document.createElement("img");
        // icon.className = "codeblock-copy_button_icon";
        // icon.src = COPY_ICON_PATH;
        // icon.alt = "";
        // icon.setAttribute("aria-hidden", "true");

        // const label = document.createElement("span");
        // label.className = "codeblock-copy_button_label";
        // label.textContent = "복사";

        // button.appendChild(icon);
        // button.appendChild(label);
        // wrapper.appendChild(button);
        // masthead.appendChild(wrapper);

        wrapper.innerHTML = `
            <button class="codeblock-copy_button" type="button">
                <img class="codeblock-copy_button_icon" src="${COPY_ICON_PATH}" alt="" aria-hidden="true">
                <span class="codeblock-copy_button_label">복사</span>
            </button>
        `;

        masthead.appendChild(wrapper);

        const button = wrapper.querySelector(".codeblock-copy_button");
        const icon = wrapper.querySelector(".codeblock-copy_button_icon");
        const label = wrapper.querySelector(".codeblock-copy_button_label");


        /* 복사 버튼 상태 업데이트 */
        const update_label = (text, is_copied) => {
            label.textContent = text;
            icon.src = is_copied ? COPIED_ICON_PATH : COPY_ICON_PATH;
            button.classList.toggle("is-copied", is_copied);

            button.dispatchEvent(new CustomEvent("copybutton:state", {
                bubbles: true, detail: { text: text, copied: is_copied, icon_path: icon.src }
            }));
        }


        /* 복사 기능 실행 */
        let timer = null;  // 복사 버튼 타이머

        const copy = async () => {
            try {
                await copy_to_clipboard(code.textContent || "");
                update_label("복사됨", true);
            } catch (error) {
                timer = setTimeout(() => update_label("복사 실패", false), RESET_TIME);
            } finally {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => update_label("복사", false), RESET_TIME);
            }
        };

        button.addEventListener("click", copy);
    }


    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".highlighter-tree-sitter").forEach(main);
    });
})();