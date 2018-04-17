import getResult, { makeData } from '../helper/makeData'
import BraftPureConvert from '../../src'
import { DraftJS, BraftPureConvertParams } from '../../src/types'
describe('inline entities', () => {
    it('links href', () => {
        const result = getResult(
            [
                {
                    text: 'blablab labla',
                    entityRanges: [
                        { offset: 3, length: 2, key: 0 },
                        { offset: 5, length: 1, key: 1 }
                    ]
                }
            ],
            {
                '0': { type: 'LINK', mutability: 'MUTABLE', data: { href: 'a.com', target: '' } },
                '1': { type: 'LINK', mutability: 'MUTABLE', data: { href: 'b.com', target: '' } }
            }
        )
        expect(result).toMatchObject([
            '<p>bla<a href="a.com" target="_self">bl</a><a href="b.com" target="_self">a</a>b labla</p>'
        ])
    })
})
