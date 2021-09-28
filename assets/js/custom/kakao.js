function sendLink(page_title, page_description, page_url) {
    console.log(page_title);
    console.log(page_description);
    console.log(page_url);

    if (!Kakao.isInitialized())
        Kakao.init("85708b5cb536e693138f21a784bc7b25");

    Kakao.Link.sendCustom({
    templateId: 62424,
    templateArgs: {
        title: page_title,
        description: page_description,
        url: page_url,
    },
    });
}