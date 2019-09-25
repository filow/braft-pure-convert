import getResult from '../helper/makeData'

describe('inline style', () => {
    it('COLOR', () => {
        const result = getResult([
            {
                text: '123',
                inlineStyleRanges: [
                    {
                        offset: 1,
                        length: 1,
                        style: 'COLOR-345677'
                    }
                ]
            }
        ])
        expect(result).toMatchObject(['<p>1<span style="color: #345677;">2</span>3</p>'])
    })
    it('BGCOLOR', () => {
        const result = getResult([
            {
                text: '123',
                inlineStyleRanges: [
                    {
                        offset: 1,
                        length: 1,
                        style: 'BGCOLOR-345677'
                    }
                ]
            }
        ])
        expect(result).toMatchObject(['<p>1<span style="background-color: #345677;">2</span>3</p>'])
    })
    it('FONTSIZE', () => {
        const result = getResult([
            {
                text: '123',
                inlineStyleRanges: [
                    {
                        offset: 1,
                        length: 1,
                        style: 'FONTSIZE-24'
                    }
                ]
            }
        ])
        expect(result).toMatchObject(['<p>1<span style="font-size: 24px;">2</span>3</p>'])
    })
    it('FONTFAMILY', () => {
        const result = getResult([
            {
                text: '123',
                inlineStyleRanges: [
                    {
                        offset: 1,
                        length: 1,
                        style: 'FONTFAMILY-Arial'
                    }
                ]
            }
        ])
        expect(result).toMatchObject(['<p>1<span style="font-family: Arial;">2</span>3</p>'])
    })
    it('block inline style', () => {
        let result = getResult([
            {
                data: {
                    textAlign: 'left'
                }
            }
        ])
        expect(result).toMatchObject(['<p></p>'])
        result = getResult([
            {
                data: {
                    textAlign: 'center'
                }
            }
        ])
        expect(result).toMatchObject(['<p style="text-align:center"></p>'])
        result = getResult([
            {
                data: {
                    textAlign: 'right'
                }
            }
        ])
        expect(result).toMatchObject(['<p style="text-align:right"></p>'])
    })
})
