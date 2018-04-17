import getResult, { makeData } from '../helper/makeData'
import BraftPureConvert from '../../src'

it('stripEmptyLeadingTags', () => {
    const data = makeData(
        [
            {
                text: ''
            },
            {
                text: ''
            },
            {
                text: ''
            },
            {
                text: ' ',
                type: 'atomic',
                entityRanges: [{ offset: 0, length: 1, key: 0 }]
            },
            {
                text: ''
            }
        ],
        {
            '0': {
                type: 'CUSTOM',
                mutability: 'IMMUTABLE',
                data: {
                    url: 'http://someplace/test.mp4',
                    type: 'CUSTOM'
                }
            }
        }
    )
    const result = BraftPureConvert({
        rawState: data,
        extendAtomics: {
            notFound(entity) {
                return entity
            }
        },
        stripEmptyLeadingTags: true
    })
    expect(result).toMatchObject([
        {
            data: { type: 'CUSTOM', url: 'http://someplace/test.mp4' },
            mutability: 'IMMUTABLE',
            type: 'CUSTOM'
        },
        '<p></p>'
    ])
})

it('heading with valid text element', () => {
    const data = makeData(
        [
            {
                text: ''
            },
            {
                text: '123'
            },
            {
                text: ''
            },
            {
                text: ' ',
                type: 'atomic',
                entityRanges: [{ offset: 0, length: 1, key: 0 }]
            }
        ],
        {
            '0': {
                type: 'CUSTOM',
                mutability: 'IMMUTABLE',
                data: {
                    url: 'http://someplace/test.mp4',
                    type: 'CUSTOM'
                }
            }
        }
    )
    const result = BraftPureConvert({
        rawState: data,
        extendAtomics: {
            notFound(entity) {
                return entity
            }
        },
        stripEmptyLeadingTags: true
    })
    expect(result).toMatchObject([
        '<p>123</p><p></p>',
        {
            data: { type: 'CUSTOM', url: 'http://someplace/test.mp4' },
            mutability: 'IMMUTABLE',
            type: 'CUSTOM'
        }
    ])
})
