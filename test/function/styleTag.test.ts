import getResult from '../helper/makeData'

function makeInlineStyleData(text, styleRanges: any[]) {
    return [
        {
            text: text,
            inlineStyleRanges: styleRanges,
            type: 'unstyled'
        }
    ]
}
describe('inline style test', () => {
    it('returns an empty paragraph when no text is given', () => {
        expect(getResult(makeInlineStyleData('', []))).toMatchObject(['<p></p>'])
    })

    it('applies a single style to a string', () => {
        expect(
            getResult(
                makeInlineStyleData('test', [
                    {
                        style: 'BOLD',
                        offset: 0,
                        length: 4
                    }
                ])
            )
        ).toMatchObject(['<p><strong>test</strong></p>'])
    })

    it('STRIKETHROUGH', () => {
        expect(
            getResult(
                makeInlineStyleData('test', [
                    {
                        style: 'STRIKETHROUGH',
                        offset: 0,
                        length: 4
                    }
                ])
            )
        ).toMatchObject(['<p><del>test</del></p>'])
    })

    it('CODE', () => {
        expect(
            getResult(
                makeInlineStyleData('test', [
                    {
                        style: 'CODE',
                        offset: 0,
                        length: 4
                    }
                ])
            )
        ).toMatchObject(['<p><code>test</code></p>'])
    })

    it('SUPERSCRIPT', () => {
        expect(
            getResult(
                makeInlineStyleData('test', [
                    {
                        style: 'SUPERSCRIPT',
                        offset: 0,
                        length: 4
                    }
                ])
            )
        ).toMatchObject(['<p><sup>test</sup></p>'])
    })

    it('SUBSCRIPT', () => {
        expect(
            getResult(
                makeInlineStyleData('test', [
                    {
                        style: 'SUBSCRIPT',
                        offset: 0,
                        length: 4
                    }
                ])
            )
        ).toMatchObject(['<p><sub>test</sub></p>'])
    })

    it('applies two styles to an entire string', () => {
        expect(
            getResult(
                makeInlineStyleData('test', [
                    {
                        style: 'BOLD',
                        offset: 0,
                        length: 4
                    },
                    {
                        style: 'ITALIC',
                        offset: 0,
                        length: 4
                    }
                ])
            )
        ).toMatchObject(['<p><strong><em>test</em></strong></p>'])
    })
    it('applies overlapping styles to a string', () => {
        expect(
            getResult(
                makeInlineStyleData('abcde', [
                    {
                        style: 'BOLD',
                        offset: 0,
                        length: 3
                    },
                    {
                        style: 'ITALIC',
                        offset: 2,
                        length: 3
                    }
                ])
            )
        ).toMatchObject(['<p><strong>ab</strong><strong><em>c</em></strong><em>de</em></p>'])
    })

    it('applies multiple overlapping styles to a string', () => {
        expect(
            getResult(
                makeInlineStyleData('1234567890', [
                    {
                        style: 'UNDERLINE',
                        offset: 0,
                        length: 4
                    },
                    {
                        style: 'ITALIC',
                        offset: 0,
                        length: 8
                    },
                    {
                        style: 'BOLD',
                        offset: 3,
                        length: 3
                    }
                ])
            )
        ).toMatchObject([
            '<p><em><u>123</u></em><strong><em><u>4</u></em></strong><strong><em>56</em></strong><em>78</em>90</p>'
        ])
    })
})
