---
title: "이것이 취업을 위한 코딩테스트다"
layout: archive
permalink: categories/jobcoding
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories.Jobcoding %}
{% for post in posts %} {% include archive-single2.html type=page.entries_layout %} {% endfor %}
