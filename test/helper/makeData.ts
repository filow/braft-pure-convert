import { DraftJS } from '../../src/types'
import BraftPureConvert from '../../src'

export function makeData(blocks: Array<any>, entityMap = {}): DraftJS.RawEditorState {
    const blockList = blocks.map(item => {
        return Object.assign(
            {
                key: Math.random()
                    .toString(16)
                    .substr(2, 5),
                text: '',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {}
            },
            item
        )
    })
    return {
        blocks: blockList,
        entityMap
    }
}

export default function getResult(blocks: Array<any>, entityMap = {}) {
    const data = makeData(blocks, entityMap)
    const result = BraftPureConvert({
        rawState: data
    })
    return result
}
