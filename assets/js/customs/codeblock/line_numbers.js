/*
파일(File):
    - assets/js/customs/codeblock/line_numbers.js

목적(Purpose):
    - 코드블럭의 좌측에 코드 줄 번호를 표시합니다.

의존성(Dependencies):
    - Tree-Sitter Syntax Highlighter
    - assets/js/customs/codeblock/metadata.js
*/

(function () {
    "use strict";

    /* 코드블럭 줄 번호 렌더링 */
    function renderLineNumbers(codeblock) {
        /* 줄 번호 중복 삽입 방지 */
        if (codeblock.dataset.gutterProcessed === "true") {
            // 스크롤과 새로고침을 동시에 빠르게 수행하면 간헐적으로 줄 번호가 여러 개 생성되는 경우가 있어 중복 삽입을 방지하였습니다.
            return;
        }

        const masthead = codeblock.querySelector(".codeblock-masthead");
        const pre = codeblock.querySelector("pre");

        /* 코드 줄 수 계산 */
        const lines = Math.max(1, (pre.textContent || "").trimEnd().split("\n").length);

        /* 코드블럭 컨테이너 구성 */
        let body = codeblock.querySelector(":scope > .codeblock__body");
        if (!body) {
            // 스크롤과 새로고침을 동시에 빠르게 수행하면 간헐적으로 줄 번호가 여러 개 생성되는 경우가 있어 중복 삽입을 방지하였습니다.
            body = document.createElement("div");
            body.className = "codeblock__body";

            codeblock.insertBefore(body, masthead.nextSibling);
            body.appendChild(pre);
        }

        /* 줄 번호 표시 공간 (gutter) 렌더링 */
        const gutter = document.createElement("div");
        gutter.className = "gutter";

        for (let i = 1; i <= lines; i++) {
            const span = document.createElement("span");
            span.textContent = i;
            gutter.appendChild(span);
        }

        body.insertBefore(gutter, pre);
        codeblock.dataset.gutterProcessed = "true";
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".highlighter-tree-sitter").forEach(renderLineNumbers);
    });

})();