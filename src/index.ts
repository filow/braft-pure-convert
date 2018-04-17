import { getBlockMarkup } from './block'
import { isList, getListMarkup } from './list'
import { DraftJS, BraftPureConvertParams } from './types'
import { mergeTextAndObject, trimEmptyElements } from './common'

export type ConvertResult = BraftPureConvertParams.ResultValue[]
export default function braftPureConvert(params: {
    rawState: DraftJS.RawEditorState
    extendAtomics?: BraftPureConvertParams.ExtendAtomicObject
}): ConvertResult {
    const { rawState, extendAtomics } = params
    const result: ConvertResult[] = []
    if (rawState) {
        const { blocks, entityMap } = rawState
        if (blocks && blocks.length > 0) {
            let listBlocks: DraftJS.BlockObject[] = []
            blocks.forEach(block => {
                if (isList(block.type)) {
                    listBlocks.push(block)
                } else {
                    // 处理嵌套的list对象
                    if (listBlocks.length > 0) {
                        const listHtml = getListMarkup({
                            listBlocks,
                            entityMap,
                            extendAtomics
                        })
                        result.push(listHtml as any)
                        listBlocks = []
                    }
                    const blockHtml = getBlockMarkup({
                        block,
                        entityMap,
                        extendAtomics
                    })
                    result.push(blockHtml)
                }
            })
            if (listBlocks.length > 0) {
                const listHtml = getListMarkup({
                    listBlocks,
                    entityMap,
                    extendAtomics
                })
                result.push(listHtml as any)
                listBlocks = []
            }
        }
    }
    return trimEmptyElements(mergeTextAndObject(result))
}
