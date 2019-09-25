import getResult from '../helper/makeData'

describe('list test', () => {
    it('unordered-list-item', () => {
        const result = getResult([
            {
                text: '123',
                type: 'unordered-list-item'
            }
        ])
        expect(result).toMatchObject(['<ul><li>123</li></ul>'])
    })

    it('ordered-list-item', () => {
        const result = getResult([
            {
                text: '123',
                type: 'ordered-list-item'
            }
        ])
        expect(result).toMatchObject(['<ol><li>123</li></ol>'])
    })

    it('many-chilren', () => {
        const result = getResult([
            {
                text: '123',
                type: 'unordered-list-item'
            },
            {
                text: '456',
                type: 'unordered-list-item'
            }
        ])
        expect(result).toMatchObject(['<ul><li>123</li><li>456</li></ul>'])
    })

    it('two-list', () => {
        const result = getResult([
            {
                text: '123',
                type: 'unordered-list-item'
            },
            {
                text: 'hello'
            },
            {
                text: '456',
                type: 'unordered-list-item'
            }
        ])
        expect(result).toMatchObject(['<ul><li>123</li></ul><p>hello</p><ul><li>456</li></ul>'])
    })

    it('nested-list', () => {
        const result = getResult([
            {
                text: '123',
                type: 'ordered-list-item',
                depth: 0
            },
            {
                text: '456',
                type: 'ordered-list-item',
                depth: 1
            },
            {
                text: '789',
                type: 'ordered-list-item',
                depth: 2
            }
        ])
        expect(result).toMatchObject([
            '<ol><li>123</li><ol><li>456</li><ol><li>789</li></ol></ol></ol>'
        ])
    })

    it('nested-different-list', () => {
        const result = getResult([
            {
                text: '123',
                type: 'ordered-list-item',
                depth: 0
            },
            {
                text: '456',
                type: 'unordered-list-item',
                depth: 1
            },
            {
                text: '789',
                type: 'ordered-list-item',
                depth: 2
            }
        ])
        expect(result).toMatchObject([
            '<ol><li>123</li></ol><ul><li>456</li></ul><ol><li>789</li></ol>'
        ])
    })

    it('nested-different-list-same-depth', () => {
        const result = getResult([
            {
                text: '123',
                type: 'ordered-list-item',
                depth: 0
            },
            {
                text: '456',
                type: 'unordered-list-item',
                depth: 1
            },
            {
                text: '789',
                type: 'unordered-list-item',
                depth: 1
            }
        ])
        expect(result).toMatchObject(['<ol><li>123</li></ol><ul><li>456</li><li>789</li></ul>'])
    })

    it('styled-list', () => {
        const result = getResult([
            {
                text: '123',
                type: 'ordered-list-item',
                data: {
                    'line-height': 1.5
                }
            }
        ])
        expect(result).toMatchObject(['<ol><li style="line-height:1.5">123</li></ol>'])
    })

    it('inline-style', () => {
        const result = getResult([
            {
                text: '123',
                type: 'unordered-list-item',
                inlineStyleRanges: [{ offset: 1, length: 1, style: 'ITALIC' }]
            },
            {
                text: '456',
                type: 'unordered-list-item',
                inlineStyleRanges: [
                    { offset: 0, length: 2, style: 'BOLD' },
                    { offset: 0, length: 2, style: 'color-F32784' }
                ]
            },
            {
                text: '789',
                type: 'ordered-list-item',
                inlineStyleRanges: [{ offset: 1, length: 1, style: 'BOLD' }]
            }
        ])
        expect(result).toMatchObject([
            '<ul><li>1<em>2</em>3</li><li><span style="color: #F32784;"><strong>45</strong></span>6</li></ul><ol><li>7<strong>8</strong>9</li></ol>'
        ])
    })
    // it('fullTest', () => {

    // })
})
