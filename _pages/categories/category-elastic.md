---
title: "Elastic"
layout: archive
permalink: categories/elastic
author_profile: true
sidebar_main: true
---

{% assign posts = site.categories.Elastic %}
{% for post in posts %} {% include archive-single2.html type=page.entries_layout %} {% endfor %}
