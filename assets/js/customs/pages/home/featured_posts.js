/*
홈페이지의 대표 게시글 캐러셀의 스크롤 기능을 제어합니다.

참고사항(Notes)
-------------
대표 게시글이 2개 이상일 때만 캐러셀 스크롤 기능을 활성화합니다.
캐러셀 내 게시글 배치가 화면을 벗어날 경우에만 스크롤 버튼을 표시하며, 스크롤 버튼을 누르면 카드 한 개만큼 스크롤합니다.

연관(Related)
------------
"_includes/customs/pages/home/featured_posts.html": 캐러셀의 HTML 마크업 구조를 정의합니다.
"_sass/customs/pages/home/_featured_posts.scss": 캐러셀의 레이아웃과 디자인을 정의합니다.
*/


(() => {
    "use strict";

    const featured_posts_carousels = document.querySelectorAll(".js_featured_posts_carousel", );
    const prefers_reduced_motion = window.matchMedia("(prefers-reduced-motion: reduce)", );

    if (featured_posts_carousels.length === 0) return;  // 캐러셀이 없으면 불필요한 설정과 DOM 탐색을 생략합니다.

    function initialize_featured_posts(featured_posts_carousel) {
        const featured_posts = featured_posts_carousel.querySelector(".js_featured_posts", );
        const featured_post_items = featured_posts.querySelectorAll(".js_featured_post", );
        const featured_posts_navigation = featured_posts_carousel.querySelector(".js_featured_posts_navigation", );
        const previous_button = featured_posts_carousel.querySelector(".js_featured_posts_button_previous", );
        const next_button = featured_posts_carousel.querySelector(".js_featured_posts_button_next", );

        if (!featured_posts) return;
        if (featured_post_items.length < 2) return;  // 카드가 한 개뿐이면 스크롤 탐색 기능을 비활성화합니다.
        if (!featured_posts_navigation || !previous_button || !next_button) return;

        let is_controls_update_scheduled = false;

        function update_controls() {
            const maximum_scroll_left = (featured_posts.scrollWidth - featured_posts.clientWidth);
            const scroll_left = featured_posts.scrollLeft;
            const has_overflow = maximum_scroll_left > 1;

            featured_posts_navigation.hidden = !has_overflow;
            previous_button.disabled = (!has_overflow || scroll_left <= 1);
            next_button.disabled = (!has_overflow || scroll_left >= maximum_scroll_left - 1);
        }

        // 연속된 스크롤 이벤트는 프레임마다 한 번만 처리합니다.
        function schedule_controls_update() {
            if (is_controls_update_scheduled) return;

            is_controls_update_scheduled = true;

            window.requestAnimationFrame(() => {
                is_controls_update_scheduled = false;
                update_controls();
            });
        }

        function get_scroll_step() {
            const computed_style = window.getComputedStyle(featured_posts);
            const column_gap = parseFloat(computed_style.columnGap) || 0;
            const featured_post_width = (featured_post_items[0].getBoundingClientRect().width);

            return featured_post_width + column_gap;
        }

        function move(direction) {
            featured_posts.scrollBy({
                left: direction * get_scroll_step(),
                behavior: prefers_reduced_motion.matches ? "auto" : "smooth",
            });
        }

        previous_button.addEventListener("click", () => move(-1));
        next_button.addEventListener("click", () => move(1));
        featured_posts.addEventListener("scroll", schedule_controls_update, { passive: true }, );

        // 캐러셀 너비가 바뀌면 가로 넘침과 버튼 상태를 다시 계산합니다.
        if ("ResizeObserver" in window) {
            const resize_observer = new ResizeObserver(update_controls);

            resize_observer.observe(featured_posts);
        } else {
            window.addEventListener("resize", schedule_controls_update);
        }

        window.addEventListener("load", update_controls, { once: true });
        update_controls();
    }

    featured_posts_carousels.forEach(initialize_featured_posts, );
})();
