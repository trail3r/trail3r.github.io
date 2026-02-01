---
layout: splash
permalink: /
header: false

banners:
    - image_path: assets/images/banners/fiction.png
      alt: "개구리 성장기"
      url: "/categories/fictions/"
    - image_path: assets/images/banners/2026.png
      alt: "붉은 말의 해"
      url: "/categories/daily/"
    - image_path: assets/images/banners/campuslife.png
      alt: "캠퍼스 라이프"
      url: "/categories/campuslife/"
    - image_path: assets/images/banners/interest.png
      alt: "몰입의 즐거움"
      url: "/categories/interest/"
    - image_path: assets/images/banners/instagram.png
      alt: "인스타그램"
      url: "https://www.instagram.com/trail3r__"
---



<!-- 블로그의 메인 페이지에 이미지를 렌더링 합니다. -->
<div class="home__body">
    <a class="home__link" href="https://trail3r.github.io/">
        <img class="home__image" src="assets/images/blog_main_image.png" alt="Home main image">
    </a>
</div>


<!-- 블로그의 메인 페이지에 배너를 렌더링 합니다. -->
{%- include customs/main_page_banners.html -%}


<!-- 블로그의 메인 페이지에 최근 업로드된 게시글을 렌더링 합니다. -->
{%- include customs/main_page_recent_posts.html layout="card" -%}