import { isEmptyString } from './common'
import { DraftJS, BraftPureConvertParams } from './types'
import defaultAtomicTransformer from './default/atomicBlock'
/**
 * Function will return markup for Entity.
 */
export function getEntityMarkup(params: {
    entityMap: { [props: number]: DraftJS.EntityObject }
    entityKey: number
    text: string
    extendAtomics?: BraftPureConvertParams.ExtendAtomicObject
    block: DraftJS.BlockObject
}): BraftPureConvertParams.ResultValue {
    const { entityMap, entityKey, text, extendAtomics, block } = params
    const entity = entityMap[entityKey]
    const type = entity.type.toLowerCase()
    let result
    if (extendAtomics && extendAtomics.transformerFn && extendAtomics.transformerFn[type]) {
        result = extendAtomics.transformerFn[type](entity, text, block)
    } else if (defaultAtomicTransformer[type]) {
        result = defaultAtomicTransformer[type](entity, text, block)
    }
    return result ? result : text
}

/**
 * Function to check if the block is an atomic entity block.
 */
export function isAtomicEntityBlock(block: DraftJS.BlockObject): boolean {
    if ((block.entityRanges.length > 0 && isEmptyString(block.text)) || block.type === 'atomic') {
        return true
    }
    return false
}
