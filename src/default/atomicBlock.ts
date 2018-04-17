import { getHTMLAttributeText } from '../common'
import { BraftPureConvertParams } from '../types'
const transformers: {
    [props: string]: BraftPureConvertParams.TransformFunction
} = {
    link(entity, text) {
        const targetOption = entity.data.targetOption || '_self'
        return `<a href="${entity.data.href}" target="${targetOption}">${text}</a>`
    },
    image(entity, text, block) {
        const imageWrapStyle: { float?: string; ['text-align']?: string } = {}
        let styledClassName = ''

        if (block && block.data) {
            if (block.data.float) {
                imageWrapStyle.float = block.data.float
                styledClassName += ' float-' + block.data.float
            } else if (block.data.alignment) {
                imageWrapStyle['text-align'] = block.data.alignment
                styledClassName += ' align-' + block.data.alignment
            }
        }
        const { url, link, link_target, width, height } = entity.data
        let result = `<div class="media-wrap image-wrap${styledClassName}" ${getHTMLAttributeText({
            styles: imageWrapStyle
        })}>`
        if (link) {
            result += `<a style="display: inline-block" href="${link}" target="${link_target}">`
        }
        result += `<img src="${url}" ${getHTMLAttributeText({
            width,
            height,
            styles: {
                width,
                height
            }
        })}/>`
        if (link) {
            result += '</a>'
        }
        result += '</div>'
        return result
    },
    hr() {
        return `<hr />`
    },
    audio(entity) {
        return `<div class="media-wrap audio-wrap"><audio controls src="${
            entity.data.url
        }" /></div>`
    },
    video(entity) {
        const { url, width, height } = entity.data
        return `<div class="media-wrap video-wrap"><video controls src="${
            entity.data.url
        }" ${getHTMLAttributeText({
            width,
            height
        })}/></div>`
    }
}
export default transformers
// export const defaultFontFamilies = [{
//     name: 'Araial',
//     family: 'Arial, Helvetica, sans-serif'
// }, {
//     name: 'Georgia',
//     family: 'Georgia, serif'
// }, {
//     name: 'Impact',
//     family: 'Impact, serif'
// }, {
//     name: 'Monospace',
//     family: '"Courier New", Courier, monospace'
// }, {
//     name: 'Tahoma',
//     family: "tahoma, arial, 'Hiragino Sans GB', 宋体, sans-serif"
// }]

// // const styleToHTML = (props) => (style) => {

// //     style = style.toLowerCase()

// //     if (style === 'strikethrough') {
// //         return <span style={ { textDecoration: 'line-through' } } />
//     } else if (style === 'superscript') {
//         return <sup/>
//     } else if (style === 'subscript') {
//         return <sub/>
//     } else if (style.indexOf('color-') === 0) {
//         return <span style={ { color: '#' + style.split('-')[1] } } />
//     } else if (style.indexOf('bgcolor-') === 0) {
//         return <span style={ { backgroundColor: '#' + style.split('-')[1] } } />
//     } else if (style.indexOf('fontsize-') === 0) {
//         return <span style={ { fontSize: style.split('-')[1] + 'px' } } />
//     } else if (style.indexOf('lineheight-') === 0) {
//         return <span style={ { lineHeight: style.split('-')[1] } } />
//     } else if (style.indexOf('letterspacing-') === 0) {
//         return <span style={ { letterSpacing: style.split('-')[1] + 'px' } } />
//     } else if (style.indexOf('indent-') === 0) {
//         return <span style={ { paddingLeft: style.split('-')[1] + 'px', paddingRight: style.split('-')[1] + 'px' } } />
//     } else if (style.indexOf('fontfamily-') === 0) {
//         let fontFamily = props.fontFamilies.find((item) => item.name.toLowerCase() === style.split('-')[1])
//         if (!fontFamily) return
//         return <span style={ { fontFamily: fontFamily.family } } />
//     }

// }

// const blockToHTML = (contentState) => (block) => {

//     let result = null
//     let blockStyle = ""

//     const blockType = block.type.toLowerCase()
//     const { textAlign } = block.data

//     if (textAlign) {
//         blockStyle = ` style="text-align:${textAlign};"`
//     }

//     if (blockType === 'atomic') {
//         return convertAtomicBlock(block, contentState)
//     } else if (blockType === 'code-block') {

//         const previousBlock = contentState.getBlockBefore(block.key)
//         const nextBlock = contentState.getBlockAfter(block.key)
//         const previousBlockType = previousBlock && previousBlock.getType()
//         const nextBlockType = nextBlock && nextBlock.getType()
//         const codeBreakLine = block.text ? '' : '<br>'

//         if (previousBlockType === 'code-block' && nextBlockType === 'code-block') {
//             return {
//                 start: `<code><div>${codeBreakLine}`,
//                 end: '</div></code>'
//             }
//         } else if (previousBlockType === 'code-block') {
//             return {
//                 start: `<code><div>${codeBreakLine}`,
//                 end: '</div></code></pre>'
//             }
//         } else if (nextBlockType === 'code-block') {
//             return {
//                 start: `<pre><code><div>${codeBreakLine}`,
//                 end: '</div></code>'
//             }
//         } else {
//             return {
//                 start: `<pre><code><div>${codeBreakLine}`,
//                 end: '</div></code></pre>'
//             }
//         }

//     } else if (blocks[blockType]) {
//         return {
//             start: `<${blocks[blockType]}${blockStyle}>`,
//             end: `</${blocks[blockType]}>`
//         }
//     } else if (blockType === 'unordered-list-item') {
//         return {
//             start: `<li${blockStyle}>`,
//             end: '</li>',
//             nestStart: '<ul>',
//             nestEnd: '</ul>'
//         }
//     } else if (blockType === 'ordered-list-item') {
//         return {
//             start: `<li${blockStyle}>`,
//             end: '</li>',
//             nestStart: '<ol>',
//             nestEnd: '</ol>'
//         }
//     }

// }

// const entityToHTML = (entity, originalText) => {

//     let result = originalText
//     const entityType = entity.type.toLowerCase()

//     if (entityType === 'link') {
//         return <a href={ entity.data.href } target = { entity.data.target } > { originalText } < /a>
//     } else if (entityType === 'color') {
//         return <span style={ { color: entity.data.color } }> { originalText } < /span>
//     } else if (entityType === 'bg-color') {
//         return <span style={ { backgroundColor: entity.data.color } }> { originalText } < /span>
//     }

// }

// export const getToHTMLConfig = (props) => {

//     return {
//         styleToHTML: styleToHTML(props),
//         entityToHTML: entityToHTML,
//         blockToHTML: blockToHTML(props.contentState)
//     }

// }

// export const mergeStyledSpans = (htmlContent) => {
//     return htmlContent
// }

// export const convertCodeBlock = (htmlContent) => {

//     const result = htmlContent
//         .replace(/\<code\>\<div\>\<br\>\<\/div\>\<\/code\>/g, `<code><div></div></code>`)
//         .replace(/\<pre\>\<code\>\<div\>/g, '<code><div>')
//         .replace(/\<\/div\>\<\/code\>\<\/pre\>/g, '</div></code>')
//         .replace(/\<code\>\<div\>/g, '<pre><code>')
//         .replace(/\<\/div\>\<\/code\>/g, '</code></pre>')

//     return result

// }
