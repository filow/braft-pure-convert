export declare namespace DraftJS {
    type DraftInlineStyleType = 'BOLD' | 'CODE' | 'ITALIC' | 'STRIKETHROUGH' | 'UNDERLINE'
    type DraftBlockType =
        | 'unstyled'
        | 'paragraph'
        | 'header-one'
        | 'header-two'
        | 'header-three'
        | 'header-four'
        | 'header-five'
        | 'header-six'
        | 'unordered-list-item'
        | 'ordered-list-item'
        | 'blockquote'
        | 'code-block'
        | 'atomic'
    interface RawDraftInlineStyleRange {
        style: DraftInlineStyleType
        offset: number
        length: number
    }
    interface RawDraftEntityRange {
        key: number
        offset: number
        length: number
    }
    interface SelectionEntityRange {
        key?: number
        offset: number
        length: number
        type: string
        start: number
        end: number
        entityKey?: number
    }
    interface BlockObject {
        data: {
            [props: string]: any
        }
        depth: number
        entityRanges: RawDraftEntityRange[]
        inlineStyleRanges: RawDraftInlineStyleRange[]
        key: string
        text: string
        type: DraftBlockType
    }
    interface EntityObject {
        type: string
        mutability: 'IMMUTABLE' | 'MUTABLE'
        data: {
            type: string
            [props: string]: any
        }
    }
    interface RawEditorState {
        blocks: any[]
        entityMap: { [props: number]: EntityObject }
    }
}

export declare namespace BraftPureConvertParams {
    type ResultValue = string | DraftJS.EntityObject
    type TransformFunction = (
        entity: DraftJS.EntityObject,
        text?: string,
        block?: DraftJS.BlockObject
    ) => ResultValue
    interface ExtendAtomicObject {
        transformerFn?: {
            [key: string]: TransformFunction
        }
        notFound?: TransformFunction
    }
}
