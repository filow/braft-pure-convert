import getResult from '../helper/makeData'

describe('special chars', () => {
    it('\\n', () => {
        const result = getResult([
            {
                text: '12\n3'
            }
        ])
        expect(result).toMatchObject(['<p>12<br>3</p>'])
    })

    it('<', () => {
        const result = getResult([
            {
                text: '<he'
            }
        ])
        expect(result).toMatchObject(['<p>&lt;he</p>'])
    })

    it('>', () => {
        const result = getResult([
            {
                text: 'llo>'
            }
        ])
        expect(result).toMatchObject(['<p>llo&gt;</p>'])
    })

    it('&', () => {
        const result = getResult([
            {
                text: '&&&'
            }
        ])
        expect(result).toMatchObject(['<p>&amp;&amp;&amp;</p>'])
    })

    it('wrong args', () => {
        const result = getResult([
            {
                text: []
            }
        ])
        expect(result).toMatchObject(['<p></p>'])
    })
})
