import flattenDeep from 'lodash.flattendeep'
import { BraftPureConvertParams } from './types'

/**
 * Utility function to execute callback for eack key->value pair.
 */
export function forEach(obj: { [props: string]: any }, callback: (key: string, val: any) => any) {
    if (obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                callback(key, obj[key])
            }
        }
    }
}

/**
 * The function returns true if the string passed to it has no content.
 */
export function isEmptyString(str: string): boolean {
    if (str === undefined || str === null || str.length === 0 || str.trim().length === 0) {
        return true
    }
    return false
}

/**
 * Replace leading blank spaces by &nbsp;
 */
export function trimLeadingZeros(sectionText: string): string {
    if (sectionText) {
        let replacedText = sectionText
        for (let i = 0; i < replacedText.length; i += 1) {
            if (sectionText[i] === ' ') {
                replacedText = replacedText.replace(' ', '&nbsp;')
            } else {
                break
            }
        }
        return replacedText
    }
    return sectionText
}

/**
 * Replace trailing blank spaces by &nbsp;
 */
export function trimTrailingZeros(sectionText: string): string {
    if (sectionText) {
        let replacedText = sectionText
        for (let i = replacedText.length - 1; i >= 0; i -= 1) {
            if (replacedText[i] === ' ') {
                replacedText = `${replacedText.substring(0, i)}&nbsp;${replacedText.substring(
                    i + 1
                )}`
            } else {
                break
            }
        }
        return replacedText
    }
    return sectionText
}

export function getHTMLAttributeText(attrList: {
    styles?: { [props: string]: any }
    [props: string]: any
}) {
    let result = ''
    forEach(attrList, (k, v) => {
        if (!v) return
        if (k === 'styles') {
            let styleText = ''
            forEach(v, (styleKey, styleVal) => {
                if (!styleVal) return
                styleText += `${styleKey}: ${styleVal};`
            })
            if (styleText) {
                result += `style="${styleText}" `
            }
        } else {
            result += `${k}="${v}" `
        }
    })
    return result
}

export function mergeTextAndObject(list: any[]): BraftPureConvertParams.ResultValue[] {
    let stringBuffer = ''
    const result: BraftPureConvertParams.ResultValue[] = []
    const flattedData = flattenDeep(list)

    flattedData.forEach(item => {
        if (typeof item === 'string') {
            stringBuffer += item
        } else {
            result.push(stringBuffer)
            result.push(item)
            stringBuffer = ''
        }
    })

    if (stringBuffer !== '') {
        result.push(stringBuffer)
    }
    return result
}

export function trimEmptyElements(list: BraftPureConvertParams.ResultValue[]) {
    let hasStartingContent = false
    const result: BraftPureConvertParams.ResultValue[] = []
    list.forEach(item => {
        if (hasStartingContent) {
            return result.push(item)
        }
        if (typeof item === 'object' || (typeof item === 'string' && item.length > 0)) {
            hasStartingContent = true
            result.push(item)
        }
    })
    return result
}
