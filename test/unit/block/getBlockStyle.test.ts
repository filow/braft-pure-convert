import { getBlockStyle } from '../../../src/block'

describe('atomic components', () => {
    it('block style', () => {
        const result = getBlockStyle({
            width: '1px',
            height: 2
        })
        expect(result).toBe('width:1px;height:2;')
    })

    it('empty attribute should be removed', () => {
        const result = getBlockStyle({
            width: '1px',
            empty: undefined
        })
        expect(result).toBe('width:1px;')
    })
})
