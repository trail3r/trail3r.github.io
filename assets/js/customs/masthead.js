/*
파일(File):
    - assets/js/customs/masthead.js

목적(Purpose):
    - 모바일 상단 네비게이션 바의 토글 메뉴 기능을 제어합니다.

의존성(Dependencies):
    - _includes/customs/masthead.html

참고사항(Notes):
    - 이 코드 중 일부는 Claude Code를 통해 생성되었습니다.
*/

(function () {
    document.addEventListener("DOMContentLoaded", () => {
        const toggle = document.querySelector(".mobile-nav__toggle");
        const menu = document.getElementById("mobile-links");
        const blur = document.getElementById("mobile-nav__blur");

        const openMenu = () => {
            menu.classList.add("is-open");
            blur.classList.add("is-open");
            toggle.setAttribute("aria-expanded", "true");
            menu.setAttribute("aria-hidden", "false");
        };

        const closeMenu = () => {
            menu.classList.remove("is-open");
            blur.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            menu.setAttribute("aria-hidden", "true");
        };

        toggle.addEventListener("click", () => {
            menu.classList.contains("is-open") ? closeMenu() : openMenu();
        });

        blur.addEventListener("click", closeMenu);

        const accordion = menu.querySelectorAll(".accordion");
        accordion.forEach((sidebar) => {
            sidebar.addEventListener("toggle", () => {
                if (sidebar.open) {
                    accordion.forEach((other) => {
                        if (other !== sidebar) other.open = false;
                    });
                }
            });
        });
    });
}());
