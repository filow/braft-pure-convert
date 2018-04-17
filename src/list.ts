import { getBlockTag, getBlockStyle, getBlockInnerMarkup } from './block'
import { DraftJS, BraftPureConvertParams } from './types'

/**
 * 检查是否是List对象，因为这种对象会有嵌套的能力
 */
export function isList(blockType: string): any {
    return blockType === 'unordered-list-item' || blockType === 'ordered-list-item'
}

/**
 * Function will return html markup for a list block.
 */
export function getListMarkup(params: {
    listBlocks: Array<DraftJS.BlockObject>
    entityMap: { [props: number]: DraftJS.EntityObject }
    extendAtomics: BraftPureConvertParams.ExtendAtomicObject
}): Array<BraftPureConvertParams.ResultValue> {
    const { listBlocks, entityMap, extendAtomics } = params
    const listHtml: Array<any> = []
    let nestedListBlock: Array<DraftJS.BlockObject> = []
    let previousBlock
    listBlocks.forEach(block => {
        let nestedBlock = false
        if (!previousBlock) {
            listHtml.push(`<${getBlockTag(block.type)}>`)
        } else if (previousBlock.type !== block.type) {
            listHtml.push(`</${getBlockTag(previousBlock.type)}>`)
            listHtml.push(`<${getBlockTag(block.type)}>`)
        } else if (previousBlock.depth === block.depth) {
            if (nestedListBlock && nestedListBlock.length > 0) {
                listHtml.push(
                    getListMarkup({
                        listBlocks: nestedListBlock,
                        entityMap,
                        extendAtomics
                    })
                )
                nestedListBlock = []
            }
        } else {
            nestedBlock = true
            nestedListBlock.push(block)
        }
        if (!nestedBlock) {
            listHtml.push('<li')
            const blockStyle = getBlockStyle(block.data)
            if (blockStyle) {
                listHtml.push(` style="${blockStyle}"`)
            }
            listHtml.push('>')
            const innerMarkups = getBlockInnerMarkup({
                block,
                entityMap,
                extendAtomics
            })
            innerMarkups.forEach(item => {
                listHtml.push(item)
            })
            listHtml.push('</li>')
            previousBlock = block
        }
    })

    if (nestedListBlock && nestedListBlock.length > 0) {
        listHtml.push(
            getListMarkup({
                listBlocks: nestedListBlock,
                entityMap,
                extendAtomics
            })
        )
    }
    listHtml.push(`</${getBlockTag(previousBlock.type)}>`)
    return listHtml
}
