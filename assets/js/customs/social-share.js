/*
파일(File):
    - assets/js/customs/social-share.js

목적(Purpose):
    - 게시글 URL 복사 버튼에 클립보드 복사 기능을 추가합니다.
*/

(function () {
    "use strict";

    const RESET_TIME = 500;

    function fallback(text) {
        const textarea = document.createElement("textarea");

        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.cssText = "position: fixed; top: 0; left: -9999px";

        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);

        try {
            if (!document.execCommand("copy")) {
                throw new Error("Failed to copy");
            }
        } finally {
            document.body.removeChild(textarea);
        }
    }

    async function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }

        fallback(text);
        return undefined;
    }

    function getLabel(button) {
        return button.querySelector(".btn__label") || button.querySelector("span");
    }

    function setLabel(button, text) {
        const label = getLabel(button);

        if (label) {
            label.textContent = text;
        }
    }

    function resetLabel(button) {
        setLabel(button, button.dataset.copyDefaultLabel);
        button.classList.remove("is-copied", "is-copy-failed");
    }

    function bindCopyButton(button) {
        const label = getLabel(button);

        button.dataset.copyDefaultLabel = label ? label.textContent : "URL 복사";

        button.addEventListener("click", async () => {
            const url = button.dataset.copyUrl || window.location.href;

            try {
                await copyToClipboard(url);
                setLabel(button, "URL 복사 완료!");
                button.classList.add("is-copied");
                button.classList.remove("is-copy-failed");
            } catch {
                setLabel(button, "복사 실패");
                button.classList.add("is-copy-failed");
                button.classList.remove("is-copied");
            } finally {
                if (button.copyResetTimer) {
                    clearTimeout(button.copyResetTimer);
                }

                button.copyResetTimer = setTimeout(() => resetLabel(button), RESET_TIME);
            }
        });
    }

    function init() {
        document.querySelectorAll("[data-copy-url-button]").forEach(bindCopyButton);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
