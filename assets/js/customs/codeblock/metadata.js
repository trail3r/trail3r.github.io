/*
파일(File):
    - assets/js/customs/codeblock/metadata.js

목적(Purpose):
    - 코드 블럭 내 프로그래밍 언어의 종류와 파일명을 표시해주는 상단바를 추가합니다.

의존성(Dependencies):
    - Tree-Sitter Syntax Highlighter
*/

(function () {
    "use strict";

    /* DOM 요소 생성 헬퍼 */
    function createElement(tag, className, textContent) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = textContent;

        return element;
    }

    /* 코드블럭의 메타데이터를 포함한 상단바 렌더링 */
    function renderMasthead(codeblock) {
        /* 상단바 중복 삽입 방지 */
        if (codeblock.querySelector(":scope > .codeblock-masthead")) {
            // 스크롤과 새로고침을 동시에 빠르게 수행하면 간헐적으로 상단바가 여러 개 생성되는 경우가 있어 중복 삽입을 방지하였습니다.
            return;
        }

        /* 메타데이터 추출 */
        const languageMetadata = Array.from(codeblock.classList).find(cls => cls.startsWith("language-"));
        const language = languageMetadata ? languageMetadata.replace("language-", "") : "Code";

        const filenameMetadata = codeblock.dataset.filename;
        const filename = filenameMetadata ? filenameMetadata.trim() : null;

        /* 상단바 렌더링 */
        const masthead = createElement("div", "codeblock-masthead");
        const metadata = createElement("div", "codeblock-masthead__meta");

        metadata.appendChild(createElement("span", "codeblock-masthead__language", language));

        if (filename) {
            // 파일명은 명시한 경우에만 렌더링합니다.
            metadata.appendChild(createElement("span", "codeblock-masthead__filename", filename));
        }

        masthead.appendChild(metadata);

        /* 렌더링된 메타데이터 상단바를 코드 요소 바로 앞에 삽입 */
        codeblock.insertBefore(masthead, codeblock.querySelector(":scope > pre"));
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".highlighter-tree-sitter").forEach(renderMasthead);
    });

})();