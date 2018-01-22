import { getAllRulesInDocument, getMatchingElements, getRawComputedStyle, matches } from './domUtils';
import { RawStyleRule, RawStyleDeclaration } from './cssUtils'
import * as shortid from 'shortid'

export type RawStyle = {[name: string]: string}
export interface StyleProcessor {
    process: (style: RawStyle, element: HTMLElement) => Partial<CSSStyleDeclaration>
    match: (rule: RawStyleRule) => boolean
}

export {getAllRulesInDocument, getRawComputedStyle} from './domUtils'

function issueID(element: HTMLElement, prefix = '') {
    const attrName = `data-rawss-${prefix}id`
    if (element.hasAttribute(attrName)) {
        return element.getAttribute(attrName)

    }

    const id = shortid.generate().toLowerCase()
    element.setAttribute(attrName, id)
    return id
}

export function create(document: HTMLDocument) {
    const styleTag = document.createElement('style')
    const managerID = issueID(styleTag)
    document.head.appendChild(styleTag)
    return {
        destroy: () => {
            document.head.removeChild(styleTag)
        },

        run: (processors: StyleProcessor[]) => {
            const allRules = getAllRulesInDocument(document, element => element !== styleTag)
            const cache = new WeakMap()
            function issueRawStyle(element: HTMLElement) {
                if (cache.has(element)) {
                    return cache.get(element);
                }
        
                const style = getRawComputedStyle(allRules, element)
                cache.set(element, style)
                return style
            }
        
            const styleChanges = new Map<HTMLElement, Partial<CSSStyleDeclaration>>()
        
            processors.forEach(processor => {
                new Set(
                    allRules.filter(processor.match)
                        .reduce((els, rule) => [...els, ...getMatchingElements(document, rule)], []))
        
                    .forEach(element => {
                        const rawStyle = issueRawStyle(element)
                        const newStyle = processor.process(rawStyle, element);
                        styleChanges.set(element, Object.assign({}, styleChanges.get(element), newStyle))
                    })
            })
        
            const styleEntries = []
            styleChanges.forEach((value, key) => styleEntries.push([key, value]))
        
            const kebabCase = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()
            let cssText = `
    ${styleEntries.map(([element, style]) => `[data-rawss-${managerID}-id='${issueID(element, `${managerID}-`)}'] {${Object.keys(style).map(name => `
        ${kebabCase(name)}: ${style[name]} !important;
    `)}}`)}
`
        
            styleTag.innerHTML = cssText
        }
    }
}

