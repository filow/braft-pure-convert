import getResult, { makeData } from '../helper/makeData'
import BraftPureConvert from '../../src'

describe('atomic components', () => {
    it('hr', () => {
        const result = getResult(
            [
                {
                    text: ' ',
                    entityRanges: [{ offset: 0, length: 1, key: 0 }],
                    type: 'atomic'
                }
            ],
            {
                '0': { type: 'HR', mutability: 'IMMUTABLE', data: {} }
            }
        )
        expect(result).toMatchObject(['<hr />'])
    })

    it('link', () => {
        const result = getResult(
            [
                {
                    text: ' ',
                    entityRanges: [{ offset: 0, length: 1, key: 0 }],
                    type: 'atomic'
                }
            ],
            {
                '0': { type: 'LINK', mutability: 'IMMUTABLE', data: { href: 'http://a.com' } }
            }
        )
        expect(result).toMatchObject(['<a href="http://a.com" target="_self"></a>'])
    })

    it('image', () => {
        let result = getResult(
            [
                {
                    text: ' ',
                    type: 'atomic',
                    entityRanges: [{ offset: 0, length: 1, key: 0 }],
                    data: { alignment: 'center' }
                }
            ],
            {
                '0': {
                    type: 'IMAGE',
                    mutability: 'IMMUTABLE',
                    data: {
                        url: 'http://someplace/test.png',
                        name: 'test.png',
                        type: 'IMAGE',
                        height: '50px'
                    }
                }
            }
        )
        expect(result).toMatchObject([
            '<div class="media-wrap image-wrap float-none align-center" style="text-align: center;" ><img src="http://someplace/test.png" height="50px" style="height: 50px;" /></div>'
        ])

        result = getResult(
            [
                {
                    text: ' ',
                    type: 'atomic',
                    entityRanges: [{ offset: 0, length: 1, key: 0 }],
                    data: {}
                }
            ],
            {
                '0': {
                    type: 'IMAGE',
                    mutability: 'IMMUTABLE',
                    data: {
                        url: 'http://someplace/test.png',
                        name: 'test.png',
                        type: 'IMAGE'
                    }
                }
            }
        )
        expect(result).toMatchObject([
            '<div class="media-wrap image-wrap float-none align-none" ><img src="http://someplace/test.png" /></div>'
        ])

        result = getResult(
            [
                {
                    text: ' ',
                    type: 'atomic',
                    entityRanges: [{ offset: 0, length: 1, key: 0 }],
                    data: { float: 'right' }
                }
            ],
            {
                '0': {
                    type: 'IMAGE',
                    mutability: 'IMMUTABLE',
                    data: {
                        url: 'http://someplace/test.png',
                        name: 'test.png',
                        type: 'IMAGE',
                        link: 'http://a.com',
                        link_target: '_self',
                        width: '40px'
                    }
                }
            }
        )
        expect(result).toMatchObject([
            '<div class="media-wrap image-wrap float-right align-none" style="float: right;" ><a style="display: inline-block" href="http://a.com" target="_self"><img src="http://someplace/test.png" width="40px" style="width: 40px;" /></a></div>'
        ])
    })

    it('audio', () => {
        const result = getResult(
            [
                {
                    text: ' ',
                    type: 'atomic',
                    entityRanges: [{ offset: 0, length: 1, key: 0 }]
                }
            ],
            {
                '0': {
                    type: 'AUDIO',
                    mutability: 'IMMUTABLE',
                    data: {
                        url: 'http://someplace/test.mp3',
                        type: 'AUDIO'
                    }
                }
            }
        )
        expect(result).toMatchObject([
            '<div class="media-wrap audio-wrap"><audio controls src="http://someplace/test.mp3" /></div>'
        ])
    })

    it('audio', () => {
        const result = getResult(
            [
                {
                    text: ' ',
                    type: 'atomic',
                    entityRanges: [{ offset: 0, length: 1, key: 0 }]
                }
            ],
            {
                '0': {
                    type: 'AUDIO',
                    mutability: 'IMMUTABLE',
                    data: {
                        url: 'http://someplace/test.mp3',
                        type: 'AUDIO'
                    }
                }
            }
        )
        expect(result).toMatchObject([
            '<div class="media-wrap audio-wrap"><audio controls src="http://someplace/test.mp3" /></div>'
        ])
    })

    it('video', () => {
        const result = getResult(
            [
                {
                    text: ' ',
                    type: 'atomic',
                    entityRanges: [{ offset: 0, length: 1, key: 0 }]
                }
            ],
            {
                '0': {
                    type: 'VIDEO',
                    mutability: 'IMMUTABLE',
                    data: {
                        url: 'http://someplace/test.mp4',
                        type: 'VIDEO',
                        width: '1px',
                        height: '2px'
                    }
                }
            }
        )
        expect(result).toMatchObject([
            '<div class="media-wrap video-wrap"><video controls src="http://someplace/test.mp4" width="1px" height="2px" /></div>'
        ])
    })

    it('customElement => text', () => {
        const data = makeData(
            [
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
        let result = BraftPureConvert({
            rawState: data,
            extendAtomics: {
                transformerFn: {
                    custom(entity) {
                        return `<p class="custom-elemnt">${entity.data.url}</p>`
                    }
                }
            }
        })
        expect(result).toMatchObject(['<p class="custom-elemnt">http://someplace/test.mp4</p>'])

        result = BraftPureConvert({
            rawState: data
        })
        expect(result).toMatchObject([])

        result = BraftPureConvert({
            rawState: data,
            extendAtomics: {
                transformerFn: {
                    custom(entity, text, block) {
                        return entity
                    }
                }
            }
        })
        expect(result).toMatchObject([
            {
                type: 'CUSTOM',
                mutability: 'IMMUTABLE',
                data: {
                    url: 'http://someplace/test.mp4',
                    type: 'CUSTOM'
                }
            }
        ])
    })

    it('customElement failure', () => {
        const data = makeData(
            [
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
            }
        })
        expect(result).toMatchObject([
            {
                data: { type: 'CUSTOM', url: 'http://someplace/test.mp4' },
                mutability: 'IMMUTABLE',
                type: 'CUSTOM'
            }
        ])
    })
})
