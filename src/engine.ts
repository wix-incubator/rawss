import { getAllRulesInDocument, getMatchingElements, getRawComputedStyle, matches, waitForStylesToBeLoaded } from './domUtils';
import { RawStyleRule, RawStyleDeclaration, RawStyle } from './cssUtils'
import * as shortid from 'shortid'

export interface StyleProcessor {
    process: (element: HTMLElement, getRawStyle: (HTMLElement) => RawStyle) => Partial<CSSStyleDeclaration>
    match: (rule: RawStyleRule) => boolean
}

export function createStyleProcessor({process, match}) : StyleProcessor {
    return {
        process: (element, getRawStyle) => process(getRawStyle(element), element),
        match
    }
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

export type Engine = {
    run(processor: StyleProcessor[])
    isManaging(e: Node)
    waitForStylesToBeLoaded() : Promise<{}>
    destroy()
}

export function create(document: HTMLDocument) {
    const styleTag = document.createElement('style')
    const managerID = issueID(styleTag)
    document.head.appendChild(styleTag)
    return {
        destroy: () => {
            document.head.removeChild(styleTag)
        },

        isManaging(e: Node) {
            return e === styleTag
        },

        waitForStylesToBeLoaded() {
            return new Promise(r => waitForStylesToBeLoaded(document).then(() => r()))
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
                        const newStyle = processor.process(element, issueRawStyle);
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

