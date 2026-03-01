/* ====================================================================================================
파일(File): assets/js/customs/tag_expand.js

목적(Purpose):
    - 읽고 있는 위치를 알기 위해 ScrollSpy를 구현하여 목차와 동기화 해 현재 보고 있는 목차를 활성화합니다.

참고사항(Notes):
    - 목차(Table of Contents)를 커스텀해 목차 DOM의 ID에 table-of-contents(전체 목차 DOM)와
      table-of-content(개별 목차 요소)가 있어야 합니다.
======================================================================================================= */

(function () {
    "use strict";

    const toc = document.querySelector("#table-of-contents");
    const content = document.querySelector("#table-of-content");

    if (!toc) {
        // 목차를 비활성화 한 경우에는 스크립트를 즉시 종료하여 연산량을 줄입니다.
        return;
    }

    const HEADING = "h2, h3, h4, h5, h6";


    /* 목차 클릭 시 생성되는 URL 디코딩 */
    const decoder = (href) => {
        // 한글은 URL로 변환될 때 인코딩되기 때문에, URL 디코딩 규칙을 통일하여 ScrollSpy 기능을 안정시킵니다.
        try {
            return decodeURIComponent(href || "").trim();
        } catch (e) {
            return (href || "").trim();
        }
    };


    /* 앵커로부터 ID 생성 */
    const identifier = (href) => {
        const id = href.indexOf("#");
        return decoder(href.slice(id + 1));
    }


    /* 목차 링크 맵핑 */
    const heading = Array.from(content.querySelectorAll(HEADING)).filter((h) => h.id);
    const link = new Map();

    toc.querySelectorAll('a[href^="#"]').forEach((a) => {
        const id = identifier(a.getAttribute("href"));
        if (id) link.set(id, a);
    })


    /* 목차 활성화 상태 관리 */
    let active_link = null;

    const active_link_id = (id) => {
        const target_link = link.get(decoder(id)) || null;
        if (active_link === target_link) return;

        if (active_link) active_link.classList.remove("active");
        active_link = target_link;
        if (active_link) active_link.classList.add("active");
    };


    /* ScrollSpy */
    const observer = new IntersectionObserver(
        (elements) => {
            const visible = elements.filter((e) => e.isIntersecting);

            if (visible.length > 0) {
                visible.sort((upper, lower) => upper.boundingClientRect.top - lower.boundingClientRect.top);
                active_link_id(visible[0].target.id);
            }
        },
        {
            threshold: 0,
            rootMargin: "-10% 0px -80% 0px"
        }
    );

    heading.forEach((h) => observer.observe(h));


    /* 부드러운 스크롤 및 클릭 이벤트 관리 */
    const smooth_scroll = (e, a) => {
        e.preventDefault();

        const id = identifier(a.getAttribute("href"));
        if (!id) {
            // ID가 비어있는 것은 화면의 최상단으로 이동하는 경우입니다.
            window.scrollTo({ top: 0, behavior: "smooth" });
            history.pushState(null, "", window.location.pathname + window.location.search);
            return;
        }

        const target = document.getElementById(id);
        if (target) {
            // ID가 실제 DOM에 존재할 때만 스크롤을 이동합니다. (사용자가 존재하지 않는 임의의 경로를 입력한 경우 무시)
            history.pushState(null, "", `#${encodeURIComponent(id)}`);
            target.scrollIntoView({ behavior: "smooth" });
        }
    };


    document.addEventListener("click", (e) => {
        const anchor = e.target.closest('#table-of-contents a[href^="#"], a.header-link[href^="#"]');
        if (anchor) {
            smooth_scroll(e, anchor);
        }
    });
})();