/* ====================================================================================================
파일(File): assets/js/customs/codeblock_rainbow_brackets.js

목적(Purpose):
    - 코드블럭의 가독성을 향상시키기 위해 괄호에 무지개 괄호 강조 효과를 추가합니다.

의존성(Dependencies):
    - Tree-Sitter Syntax Highligher

참고사항 (Notes):
    - Tree-Sitter는 괄호를 Parsing하지 않고 텍스트 노드로 남겨두므로, 괄호를 찾아내 직접 태그를 감싸 괄호 효과를 적용합니다.
======================================================================================================= */


(function() {
    "use strict";

    const BRACKETS = new Set(["(", "{", "["]);
    const BRACKETS_MAP = new Map([[")", "("], ["}", "{"], ["]", "["]]);

    /* 정규표현식을 활용하여 괄호 추출: 괄호를 캡쳐합니다. */
    const BRACKET_REGEX = /([(){}[\]])/;

    /* 괄호 깊이 제한: n단계를 넘어가면 다시 첫 단계로 돌아갑니다. */
    const DEPTH_LIMIT = 8;


    /* 괄호를 <span> 태그로 감쌈 */
    function span(text, depth, is_match) {
        const bracket = document.createElement("span");
        // 8의 배수에서 나머지가 0이 되는 것을 방지하기 위해 -1을 빼고 나눈 뒤, 다시 1을 더합니다.
        const bracket_depth = ((depth -1) % DEPTH_LIMIT) + 1;

        if (is_match) {
            bracket.classList.add("bracket", `bracket-depth-${bracket_depth}`)
        } else {
            bracket.classList.add("bracket-mismatch");
        }

        bracket.textContent = text;

        return bracket;
    }


    function main(codeblock) {
        const docx = codeblock.ownerDocument;

        /* 주석(Comment)과 문자열(String)은 괄호 강조 효과에서 제외 */
        const walker = docx.createTreeWalker(
            codeblock,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const skip = node.parentElement?.closest('.ts-comment, .ts-string, code');

                    if (node.nodeValue.trim() && skip.tagName == "CODE") {
                        // 탐색된 요소가 텍스트(공백 제외)이거나 코드블럭 탐색을 마치면 필터를 통과합니다.
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );


        const text_nodes = [];
        let node;

        /* 탐색 대상 저장 */
        while ((node = walker.nextNode())) {
            text_nodes.push(node);
        }


        const stack = [];

        for (const text_node of text_nodes) {
            const text = text_node.nodeValue;

            if (!BRACKET_REGEX.test(text)) {
                // 텍스트에 괄호가 없으면 빠르게 다음 탐색을 수행합니다.
                continue;
            }

            const fragment = docx.createDocumentFragment();
            const brackets = text.split(BRACKET_REGEX);

            for (const bracket of brackets) {
                if (!bracket) continue;  // split() 함수가 생성한 공백 문자는 탐색 대상에서 제외합니다.

                if (BRACKETS.has(bracket)) {
                    // 여는 괄호를 저장합니다.
                    const depth = stack.length + 1;
                    const element = span(bracket, depth, true);

                    stack.push({ bracket: bracket, depth: depth, element: element });
                    fragment.appendChild(element);
                } else if (BRACKETS_MAP.has(bracket)) {
                    // 괄호의 매칭 여부를 판단하고, 강조효과를 적용하기 위해 <span>태그로 감쌉니다.
                    const matched_opener = BRACKETS_MAP.get(bracket);
                    const top = stack[stack.length -1];

                    if (top && top.bracket === matched_opener) {
                        // 괄호가 매칭된 경우
                        fragment.appendChild(span(bracket, top.depth, true));
                        stack.pop();
                    } else {
                        // 괄호가 매칭되지 않은 경우
                        const depth = Math.max(1, stack.length + 1);
                        fragment.appendChild(span(bracket, depth, false));
                    }
                } else {
                    fragment.appendChild(document.createTextNode(bracket));
                }
            }

            /* 텍스트 노드를 새로 구성한 노드로 교체 */
            text_node.parentNode.replaceChild(fragment, text_node);
        }


        for (const mismatch of stack) {
            mismatch.element.className = "bracket-mismatch";
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".highlighter-tree-sitter pre code").forEach(main);
    });
})();