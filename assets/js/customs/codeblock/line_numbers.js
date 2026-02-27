/* ====================================================================================================
파일(File):
    - assets/js/customs/codeblock/line_numbers.js

목적(Purpose):
    - 코드블럭의 좌측에 코드 줄 번호를 표시합니다.

의존성(Dependencies):
    - Tree-Sitter Syntax Highligher
    - assets/js/customs/codeblock/metadata.js

참고사항(Notes):
    - 이 코드는 코드블럭의 메타데이터를 표시하는 상단바를 추가하는 코드(./metadata.js)가 먼저 로드되어야 합니다.
======================================================================================================= */


(function () {
    "use strict";

    /* 코드블럭 줄 개수를 계산하여 렌더링 */
    function main(codeblock) {
        const masthead = codeblock.querySelector(".codeblock-masthead");
        const pre = codeblock.querySelector("pre");
        
        /* 줄 번호 중복 삽입 방지 */
        if (codeblock.dataset.gutterProcessed === "true") {
            // 스크롤과 새로고침을 동시에 빠르게 수행하면 간헐적으로 줄 번호가 여러 개 생성되는 경우가 있어 중복 삽입을 방지하였습니다.
            return;
        }


        /* 코드 줄 수 계산 */
        const text = codeblock.textContent || "";
        let lines = text.split("\n").length;

        if (text.endsWith("\n")) {
            // 마지막 줄이 개행으로 끝나 빈 줄이 추가되는 것을 방지합니다.
            lines -= 1;
        }

        lines = Math.max(1, lines);  // 코드가 없는 경우에도 최소 한 줄을 보장하여 레이아웃을 보장합니다.

        /* 코드블럭 컨테이너 구성 */
        let body = codeblock.querySelector(":scope > .codeblock__body");
        if (!body) {
            body = document.createElement("div");
            body.className = "codeblock__body";

            codeblock.insertBefore(body, masthead.nextSibling);

            body.appendChild(pre);
        }


        /* 줄 번호 표시 공간 (gutter) 렌더링 */
        const gutter = document.createElement("div");
        gutter.className = "gutter";

        for (let i = 1; i <= lines; i++) {
            const index = document.createElement("span");
            index.textContent = i;
            gutter.appendChild(index);
        }

        body.insertBefore(gutter, pre);
        codeblock.dataset.gutterProcessed = "true";
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".highlighter-tree-sitter").forEach(main);
    });
})();