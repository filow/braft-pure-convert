import getResult from '../helper/makeData'

describe('integration test', () => {
    it('text color', () => {
        const result = getResult([
            {
                "key": "66sju",
                "text": "文本颜色测试",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [{"offset": 0, "length": 2, "style": "COLOR-F32784"}, {
                    "offset": 2,
                    "length": 2,
                    "style": "COLOR-003BA5"
                }],
                "entityRanges": [],
                "data": {"nodeAttributes": {}}
            }
        ])
        expect(result).toMatchObject(["<p><span style=\"color: #F32784;\">文本</span><span style=\"color: #003BA5;\">颜色</span>测试</p>"])
    });
    it('bold', () => {
        const result = getResult([
            {
                "key": "9t3ce",
                "text": "文本加粗",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [{"offset": 2, "length": 2, "style": "BOLD"}],
                "entityRanges": [],
                "data": {}
            }
        ]);
        expect(result).toMatchObject(['<p>文本<strong>加粗</strong></p>'])
    });
    it('italic', () => {
        const result = getResult([
            {
                "key": "97erd",
                "text": "文本斜体",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [{"offset": 2, "length": 2, "style": "ITALIC"}],
                "entityRanges": [],
                "data": {}
            }
        ]);
        expect(result).toMatchObject(['<p>文本<em>斜体</em></p>'])
    });
    it('underline', () => {
        const result = getResult([
            {
                "key": "dd4lj",
                "text": "文本下划线",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [{"offset": 0, "length": 5, "style": "UNDERLINE"}],
                "entityRanges": [],
                "data": {}
            }
        ]);
        expect(result).toMatchObject(['<p><u>文本下划线</u></p>'])
    });
    it('delete', () => {
        const result = getResult([
            {
                "key": "bei15",
                "text": "文本删除线",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [{"offset": 0, "length": 5, "style": "STRIKETHROUGH"}],
                "entityRanges": [],
                "data": {}
            }
        ]);
        expect(result).toMatchObject(['<p><del>文本删除线</del></p>'])
    });
    it('indent', () => {
        const result = getResult([
            {
                "key": "9osa9",
                "text": "文本缩进1",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {"textIndent": 1}
            }
        ]);
        expect(result).toMatchObject(["<p style=\"text-indent:2em\">文本缩进1</p>"])
    });
    it('indent2', () => {
        const result = getResult([
            {
                "key": "ecio",
                "text": "文本缩进2",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {"textIndent": 2}
            }
        ]);
        expect(result).toMatchObject(["<p style=\"text-indent:4em\">文本缩进2</p>"])
    });
    it('align center', () => {
        const result = getResult([
            {
                "key": "clrhb",
                "text": "文本居中",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {"textAlign": "center"}
            }
        ]);
        expect(result).toMatchObject(["<p style=\"text-align:center\">文本居中</p>"])
    });
    it('align right', () => {
        const result = getResult([
            {
                "key": "fipai",
                "text": "文本右对齐",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {"textAlign": "right"}
            }
        ]);
        expect(result).toMatchObject(["<p style=\"text-align:right\">文本右对齐</p>"])
    });
    it('align justify', () => {
        const result = getResult([
            {
                "key": "9dg1h",
                "text": "文本两端对齐文本两端对齐文本两端对齐文本两端对齐文本两端对齐文本两端对齐文本两端对齐文本两端",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {"nodeAttributes": {}, "textAlign": "justify"}
            }
        ]);
        expect(result).toMatchObject(["<p style=\"text-align:justify\">文本两端对齐文本两端对齐文本两端对齐文本两端对齐文本两端对齐文本两端对齐文本两端对齐文本两端</p>"])
    });
    it('list', () => {
        const result = getResult([
            {
                "key": "djk2",
                "text": "列表1",
                "type": "unordered-list-item",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {}
            }, {
                "key": "3bn9h",
                "text": "列表2",
                "type": "unordered-list-item",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {}
            }, {
                "key": "mq2e",
                "text": "列表3",
                "type": "ordered-list-item",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {}
            }, {
                "key": "av9qo",
                "text": "列表4",
                "type": "ordered-list-item",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [],
                "data": {}
            }
        ]);
        expect(result).toMatchObject(["<ul><li>列表1</li><li>列表2</li></ul><ol><li>列表3</li><li>列表4</li></ol>"])
    });
    it('link', () => {
        const result = getResult([
            {
                "key": "c9sib",
                "text": "链接",
                "type": "unstyled",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [{"offset": 0, "length": 2, "key": 0}],
                "data": {}
            }
        ], {
            "0": {
                "type": "LINK",
                "mutability": "MUTABLE",
                "data": {"href": "https://www.bilibili.com/", "target": ""}
            },
        });
        expect(result).toMatchObject(["<p><a href=\"https://www.bilibili.com/\" target=\"_self\">链接</a></p>"])
    });
    it('hr', () => {
        const result = getResult([
            {
                "key": "evfln",
                "text": " ",
                "type": "atomic",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [{"offset": 0, "length": 1, "key": 1}],
                "data": {}
            }
        ], {
            "1": {"type": "HR", "mutability": "IMMUTABLE", "data": {}},
        });
        expect(result).toMatchObject(["<hr />"])
    });
    it('image', () => {
        const result = getResult([
            {
                "key": "2npj0",
                "text": "a",
                "type": "atomic",
                "depth": 0,
                "inlineStyleRanges": [],
                "entityRanges": [{"offset": 0, "length": 1, "key": 2}],
                "data": {
                    "nodeAttributes": {
                        "src": "//uat-i0.hdslb.com/bfs/activity-plat/static/8a3e1fa14e30dc3be9c5324f604e5991/No5CgUnwn.png",
                        "alt": ""
                    }, "float": "", "alignment": ""
                }
            }
        ], {
            "2": {
                "type": "IMAGE",
                "mutability": "IMMUTABLE",
                "data": {
                    "meta": {},
                    "url": "//uat-i0.hdslb.com/bfs/activity-plat/static/8a3e1fa14e30dc3be9c5324f604e5991/No5CgUnwn.png"
                }
            }
        });
        expect(result).toMatchObject(["<div class=\"media-wrap image-wrap float-none align-none\" ><img src=\"//uat-i0.hdslb.com/bfs/activity-plat/static/8a3e1fa14e30dc3be9c5324f604e5991/No5CgUnwn.png\" /></div>"])
    });
})
