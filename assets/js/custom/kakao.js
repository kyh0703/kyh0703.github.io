function sendLink(page_title, page_description, page_url) {
    if (!Kakao.isinitialized())
        Kakao.init("85708b5cb536e693138f21a784bc7b25");

    Kakao.Link.sendCustom({
    templateId: 62424, // 복사해둔 템플릿 ID
    templateArgs: {
        title: page_title,
        description: page_description,
        url: page_url,
    },
    });
}