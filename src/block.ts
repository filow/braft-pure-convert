import {
    forEach,
    isEmptyString,
    trimLeadingZeros,
    trimTrailingZeros,
    mergeTextAndObject
} from './common'
import { DraftJS, BraftPureConvertParams } from './types'
import { getInlineStyleSections, getInlineStyleSectionMarkup } from './inlineStyles'
import { getEntityMarkup, isAtomicEntityBlock } from './entity'
/**
 * Mapping block-type to corresponding html tag.
 */
const blockTypesMapping = {
    unstyled: 'p',
    'header-one': 'h1',
    'header-two': 'h2',
    'header-three': 'h3',
    'header-four': 'h4',
    'header-five': 'h5',
    'header-six': 'h6',
    'unordered-list-item': 'ul',
    'ordered-list-item': 'ol',
    blockquote: 'blockquote',
    code: 'pre'
}

/**
 * Function will return style string for a block.
 */
export function getBlockStyle(data: { [props: string]: any }): string {
    let styles = ''
    forEach(data, (key: string, value: any) => {
        if (value) {
            styles += `${key}:${value};`
        }
    })
    return styles
}

/**
 * Function will return the markup for block preserving the inline styles and
 * special characters like newlines or blank spaces.
 */
export function getBlockInnerMarkup(params: {
    block: DraftJS.BlockObject
    entityMap: { [props: number]: DraftJS.EntityObject }
    extendAtomics: BraftPureConvertParams.ExtendAtomicObject
}): Array<BraftPureConvertParams.ResultValue> {
    const { block, entityMap, extendAtomics } = params

    const blockMarkup: BraftPureConvertParams.ResultValue[] = []
    // 获取内部文本内容，内部文本会被各种样式划分为多个块
    const sections = getSections({
        block
    })
    sections.forEach((section, index) => {
        let sectionText = getSectionMarkup({
            block,
            entityMap,
            section,
            extendAtomics
        })
        if (typeof sectionText === 'string') {
            if (index === 0) {
                sectionText = trimLeadingZeros(sectionText)
            }
            if (index === sections.length - 1) {
                sectionText = trimTrailingZeros(sectionText)
            }
        }

        blockMarkup.push(sectionText)
    })
    return blockMarkup
}

/**
 * Function will return HTML tag for a block.
 */
export function getBlockTag(type: string): string {
    return type && blockTypesMapping[type]
}

/**
 * Function will return html for the block.
 */
export function getBlockMarkup(params: {
    block: DraftJS.BlockObject
    entityMap: { [props: number]: DraftJS.EntityObject }
    extendAtomics: BraftPureConvertParams.ExtendAtomicObject
}): BraftPureConvertParams.ResultValue[] {
    const { block, entityMap, extendAtomics } = params
    const blockHtml = []
    if (isAtomicEntityBlock(block)) {
        blockHtml.push(
            getEntityMarkup({
                entityMap,
                entityKey: block.entityRanges[0].key,
                extendAtomics,
                text: '',
                block
            })
        )
    } else {
        const blockTag = getBlockTag(block.type)
        if (blockTag) {
            blockHtml.push(`<${blockTag}`)
            const blockStyle = getBlockStyle(block.data)
            if (blockStyle) {
                blockHtml.push(` style="${blockStyle}"`)
            }
            blockHtml.push('>')
            blockHtml.push(
                getBlockInnerMarkup({
                    block,
                    entityMap,
                    extendAtomics
                })
            )
            blockHtml.push(`</${blockTag}>`)
        }
    }
    return mergeTextAndObject(blockHtml)
}

/**
 * The function returns an array of entity-sections in blocks.
 * These will be areas in block which have same entity or no entity applicable to them.
 */
function getSections(params: { block: DraftJS.BlockObject }): Array<DraftJS.SelectionEntityRange> {
    const { block } = params

    const sections = []
    let lastOffset = 0
    let sectionRanges: Array<DraftJS.SelectionEntityRange> = block.entityRanges.map(range => {
        const { offset, length, key } = range
        return {
            offset,
            length,
            key,
            type: 'ENTITY'
        }
    })
    sectionRanges = sectionRanges.sort((s1, s2) => s1.offset - s2.offset)
    sectionRanges.forEach(r => {
        if (r.offset > lastOffset) {
            sections.push({
                start: lastOffset,
                end: r.offset
            })
        }
        sections.push({
            start: r.offset,
            end: r.offset + r.length,
            entityKey: r.key,
            type: r.type
        })
        lastOffset = r.offset + r.length
    })
    if (lastOffset < block.text.length) {
        sections.push({
            start: lastOffset,
            end: block.text.length
        })
    }
    return sections
}

/*
* The method returns markup for an entity section.
* An entity section is a continuous section in a block
* to which same entity or no entity is applicable.
*/
function getSectionMarkup(params: {
    block: DraftJS.BlockObject
    entityMap: { [props: number]: DraftJS.EntityObject }
    section: DraftJS.SelectionEntityRange
    extendAtomics: BraftPureConvertParams.ExtendAtomicObject
}): BraftPureConvertParams.ResultValue {
    const { block, entityMap, section, extendAtomics } = params
    const entityInlineMarkup = []
    const inlineStyleSections = getInlineStyleSections({
        block,
        styles: ['COLOR', 'BGCOLOR', 'FONTSIZE', 'FONTFAMILY'],
        start: section.start,
        end: section.end
    })
    inlineStyleSections.forEach(styleSection => {
        entityInlineMarkup.push(getInlineStyleSectionMarkup(block, styleSection))
    })
    let sectionText: BraftPureConvertParams.ResultValue = entityInlineMarkup.join('')
    if (section.type === 'ENTITY') {
        if (section.entityKey !== undefined && section.entityKey !== null) {
            sectionText = getEntityMarkup({
                entityMap,
                entityKey: section.entityKey,
                text: sectionText,
                extendAtomics,
                block
            })
        }
    }
    return sectionText
}
