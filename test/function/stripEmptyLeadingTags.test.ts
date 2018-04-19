import getResult, { makeData } from '../helper/makeData'
import BraftPureConvert from '../../src'

const entityData = {
    type: 'CUSTOM',
    mutability: 'IMMUTABLE',
    data: {
        url: 'http://someplace/test.mp4',
        type: 'CUSTOM'
    }
}
function testHelper(textData) {
    const data = makeData(textData, {
        '0': entityData
    })
    const result = BraftPureConvert({
        rawState: data,
        extendAtomics: {
            notFound(entity) {
                return entity
            }
        },
        stripEmptyLeadingTags: true
    })
    return result
}
it('stripEmptyLeadingTags', () => {
    const result = testHelper([
        { text: '' },
        { text: '' },
        { text: '' },
        {
            text: ' ',
            type: 'atomic',
            entityRanges: [{ offset: 0, length: 1, key: 0 }]
        },
        { text: '' }
    ])
    expect(result).toMatchObject([entityData])
})

it('heading with valid text element', () => {
    const result = testHelper([
        { text: '' },
        { text: '123' },
        { text: '' },
        {
            text: ' ',
            type: 'atomic',
            entityRanges: [{ offset: 0, length: 1, key: 0 }]
        }
    ])

    expect(result).toMatchObject(['<p>123</p><p></p>', entityData])
})

it('ending with valid text element', () => {
    const result = testHelper([
        {
            text: ' ',
            type: 'atomic',
            entityRanges: [{ offset: 0, length: 1, key: 0 }]
        },
        { text: '' },
        { text: '123' },
        { text: '' }
    ])

    expect(result).toMatchObject([entityData, '<p></p><p>123</p>'])
})

it('ending with object', () => {
    const result = testHelper([
        {
            text: ' ',
            type: 'atomic',
            entityRanges: [{ offset: 0, length: 1, key: 0 }]
        },
        { text: '' },
        { text: '' },
        { text: '' }
    ])

    expect(result).toMatchObject([entityData])
})
