/* ====================================================================================================
파일(File):
    - assets/js/customs/codelock/metadata.js

목적(Purpose):
    - 코드 블럭 내 프로그래밍 언어의 종류와 파일명을 표시해주는 상단바를 추가합니다.

의존성(Dependencies):
    - Tree-Sitter Syntax Highlighter
======================================================================================================= */


(function () {
    "use strict";

    /* 코드블럭의 메타데이터를 포함한 상단바 렌더링 */
    function main(codeblock) {
        /* 상단바 중복 삽입 방지 */
        if (codeblock.querySelector(":scope > .codeblock-masthead")) {
            // 스크롤과 새로고침을 동시에 빠르게 수행하면 간헐적으로 상단바가 여러 개 생성되는 경우가 있어 중복 삽입을 방지하였습니다.
            return;
        }
        

        /* 메타데이터 추출 */
        const language_data = Array.from(codeblock.classList).find(cls => cls.startsWith("language-"));
        const language = language_data ? language_data.replace("language-", "") : "code";

        const filename_data = codeblock.dataset.filename;
        const filename = filename_data ? filename_data.trim() : null;


        /* 상단바 렌더링 */
        const masthead = document.createElement("div");
        masthead.className = "codeblock-masthead";

        const metadata = document.createElement("div");
        metadata.className = "codeblock-masthead__meta";

        const masthead_language = document.createElement("span");
        masthead_language.className = "codeblock-masthead__language";
        masthead_language.textContent = language;

        metadata.appendChild(masthead_language);

        if (filename) {
            // 파일명은 명시한 경우에만 렌더링합니다.
            const masthead_filename = document.createElement("span");
            masthead_filename.className = "codeblock-masthead__filename";
            masthead_filename.textContent = filename;
            metadata.appendChild(masthead_filename);
        }

        masthead.appendChild(metadata);


        /* 렌더링된 메타데이터 상단바를 코드 요소 바로 앞에 삽입 */
        const pre = codeblock.querySelector(":scope > pre");
        codeblock.insertBefore(masthead, pre);
    }


    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".highlighter-tree-sitter").forEach(main);
    });

})();