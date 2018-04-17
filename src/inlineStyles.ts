import { DraftJS, BraftPureConvertParams } from './types'
import { forEach } from './common'

export interface IPointStyleArray {
    COLOR?: string
    BGCOLOR?: string
    FONTSIZE?: string
    FONTFAMILY?: string
    UNDERLINE?: boolean
    ITALIC?: boolean
    BOLD?: boolean
    STRIKETHROUGH?: boolean
    CODE?: boolean
    SUBSCRIPT?: boolean
    SUPERSCRIPT?: boolean
}

export interface IStyleArray {
    BOLD: any[]
    ITALIC: any[]
    UNDERLINE: any[]
    STRIKETHROUGH: any[]
    CODE: any[]
    SUPERSCRIPT: any[]
    SUBSCRIPT: any[]
    COLOR: any[]
    BGCOLOR: any[]
    FONTSIZE: any[]
    FONTFAMILY: any[]
    length: number
    [props: string]: any
}
export interface IStyleSections {
    styles: IPointStyleArray
    text: string[]
    start: number
    end: number
}

/**
 * For a given section in a block the function will return a further list of sections,
 * with similar inline styles applicable to them.
 */
export function getInlineStyleSections(params: {
    block: DraftJS.BlockObject
    styles: string[]
    start: number
    end: number
}): IStyleSections[] {
    const { block, styles, start, end } = params

    const styleSections = []
    const { text } = block
    if (text.length > 0) {
        const inlineStyles = getStyleArrayForBlock(block)
        let section: any = {}
        for (let i = start; i < end; i += 1) {
            if (i !== start && sameStyleAsPrevious(inlineStyles, styles, i)) {
                section.text.push(text[i])
                section.end = i + 1
            } else {
                section = {
                    styles: getStylesAtOffset(inlineStyles, i),
                    text: [text[i]],
                    start: i,
                    end: i + 1
                }
                styleSections.push(section)
            }
        }
    }
    return styleSections
}

/**
 * The method returns markup for section to which inline styles
 * like color, background-color, font-size are applicable.
 */
export function getInlineStyleSectionMarkup(
    block: DraftJS.BlockObject,
    styleSection: IStyleSections
): string {
    const styleTagSections = getInlineStyleSections({
        block,
        styles: [
            'BOLD',
            'ITALIC',
            'UNDERLINE',
            'STRIKETHROUGH',
            'CODE',
            'SUPERSCRIPT',
            'SUBSCRIPT'
        ],
        start: styleSection.start,
        end: styleSection.end
    })
    let styleSectionText = ''
    styleTagSections.forEach(stylePropertySection => {
        styleSectionText += getStyleTagSectionMarkup(stylePropertySection)
    })
    styleSectionText = addStylePropertyMarkup(styleSection.styles, styleSectionText)
    return styleSectionText
}

/**
 * Function returns html for text depending on inline style tags applicable to it.
 */
export function addStylePropertyMarkup(styles: IPointStyleArray, text: string): string {
    if (styles && (styles.COLOR || styles.BGCOLOR || styles.FONTSIZE || styles.FONTFAMILY)) {
        let styleString = 'style="'
        if (styles.COLOR) {
            styleString += `color: ${styles.COLOR};`
        }
        if (styles.BGCOLOR) {
            styleString += `background-color: ${styles.BGCOLOR};`
        }
        if (styles.FONTSIZE) {
            styleString += `font-size: ${styles.FONTSIZE}${
                /^\d+$/.test(styles.FONTSIZE) ? 'px' : ''
            };`
        }
        if (styles.FONTFAMILY) {
            styleString += `font-family: ${styles.FONTFAMILY};`
        }
        styleString += '"'
        return `<span ${styleString}>${text}</span>`
    }
    return text
}

/**
 * The method returns markup for section to which inline styles
 * like BOLD, ITALIC, UNDERLINE, STRIKETHROUGH, CODE, SUPERSCRIPT, SUBSCRIPT are applicable.
 */
function getStyleTagSectionMarkup(styleSection: IStyleSections): string {
    const { styles, text } = styleSection
    let content = getSectionText(text)
    forEach(styles, (style, value) => {
        content = addInlineStyleMarkup(style, content, value)
    })
    return content
}

/**
 * Function returns html for text depending on inline style tags applicable to it.
 */
export function addInlineStyleMarkup(style: string, content: string, value: boolean): string {
    if (style === 'BOLD') {
        return `<strong>${content}</strong>`
    } else if (style === 'ITALIC') {
        return `<em>${content}</em>`
    } else if (style === 'UNDERLINE') {
        return `<u>${content}</u>`
    } else if (style === 'STRIKETHROUGH') {
        return `<del>${content}</del>`
    } else if (style === 'CODE') {
        return `<code>${content}</code>`
    } else if (style === 'SUPERSCRIPT') {
        return `<sup>${content}</sup>`
    } else if (style === 'SUBSCRIPT') {
        return `<sub>${content}</sub>`
    }
    return content
}

/**
 * The function returns text for given section of block after doing required character replacements.
 */
function getSectionText(text: string[]): string {
    if (text && text.length > 0) {
        const chars = text.map(ch => {
            switch (ch) {
                case '\n':
                    return '<br>'
                case '&':
                    return '&amp;'
                case '<':
                    return '&lt;'
                case '>':
                    return '&gt;'
                default:
                    return ch
            }
        })
        return chars.join('')
    }
    return ''
}

/**
 * The function will return array of inline styles applicable to the block.
 */
function getStyleArrayForBlock(block: DraftJS.BlockObject): IStyleArray {
    const { text, inlineStyleRanges } = block
    const inlineStyles = {
        BOLD: new Array(text.length),
        ITALIC: new Array(text.length),
        UNDERLINE: new Array(text.length),
        STRIKETHROUGH: new Array(text.length),
        CODE: new Array(text.length),
        SUPERSCRIPT: new Array(text.length),
        SUBSCRIPT: new Array(text.length),
        COLOR: new Array(text.length),
        BGCOLOR: new Array(text.length),
        FONTSIZE: new Array(text.length),
        FONTFAMILY: new Array(text.length),
        length: text.length
    }
    if (inlineStyleRanges && inlineStyleRanges.length > 0) {
        inlineStyleRanges.forEach(range => {
            const { offset } = range
            const length = offset + range.length
            for (let i = offset; i < length; i += 1) {
                const style = range.style.toLowerCase()
                if (style.indexOf('color-') === 0) {
                    inlineStyles.COLOR[i] = range.style.substring(6)
                } else if (style.indexOf('bgcolor-') === 0) {
                    inlineStyles.BGCOLOR[i] = range.style.substring(8)
                } else if (style.indexOf('fontsize-') === 0) {
                    inlineStyles.FONTSIZE[i] = range.style.substring(9)
                } else if (style.indexOf('fontfamily-') === 0) {
                    inlineStyles.FONTFAMILY[i] = range.style.substring(11)
                } else if (inlineStyles[range.style]) {
                    inlineStyles[range.style][i] = true
                }
            }
        })
    }
    return inlineStyles
}

/**
 * Function returns true for a set of styles if the value of these styles at an offset
 * are same as that on the previous offset.
 */
export function sameStyleAsPrevious(
    inlineStyles: IStyleArray,
    styles: string[],
    index: number
): boolean {
    let sameStyled = true
    if (index > 0 && index < inlineStyles.length) {
        styles.forEach(style => {
            sameStyled = sameStyled && inlineStyles[style][index] === inlineStyles[style][index - 1]
        })
    } else {
        sameStyled = false
    }
    return sameStyled
}

/**
 * The function will return inline style applicable at some offset within a block.
 */
export function getStylesAtOffset(inlineStyles: IStyleArray, offset: number): IPointStyleArray {
    const styles: IPointStyleArray = {}
    if (inlineStyles.COLOR[offset]) {
        styles.COLOR = inlineStyles.COLOR[offset]
    }
    if (inlineStyles.BGCOLOR[offset]) {
        styles.BGCOLOR = inlineStyles.BGCOLOR[offset]
    }
    if (inlineStyles.FONTSIZE[offset]) {
        styles.FONTSIZE = inlineStyles.FONTSIZE[offset]
    }
    if (inlineStyles.FONTFAMILY[offset]) {
        styles.FONTFAMILY = inlineStyles.FONTFAMILY[offset]
    }
    if (inlineStyles.UNDERLINE[offset]) {
        styles.UNDERLINE = true
    }
    if (inlineStyles.ITALIC[offset]) {
        styles.ITALIC = true
    }
    if (inlineStyles.BOLD[offset]) {
        styles.BOLD = true
    }
    if (inlineStyles.STRIKETHROUGH[offset]) {
        styles.STRIKETHROUGH = true
    }
    if (inlineStyles.CODE[offset]) {
        styles.CODE = true
    }
    if (inlineStyles.SUBSCRIPT[offset]) {
        styles.SUBSCRIPT = true
    }
    if (inlineStyles.SUPERSCRIPT[offset]) {
        styles.SUPERSCRIPT = true
    }
    return styles
}
