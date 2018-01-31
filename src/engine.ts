import { getAllRules, getMatchingElements, getRawComputedStyle, matches, waitForStylesToBeLoaded } from './domUtils';
import { AtomicStyleRule, AtomicStyleDeclaration, AtomicStyle } from './cssUtils'
import * as shortid from 'shortid'

/**
 * @
 */
export interface StyleResolver {
    /**
     * @param element: Element to resolve style for
     * @param getAtomicStyle: receive any raw style for an element
     */
    resolve: (element: HTMLElement, getAtomicStyle: (HTMLElement) => AtomicStyle) => Partial<CSSStyleDeclaration>
    match: (rule: AtomicStyleRule) => boolean
}

/**
 * @hidden
 * @param resolver
 */
export function createStyleResolver({resolve, match}) : StyleResolver {
    return {
        resolve: (element, getAtomicStyle) => resolve(getAtomicStyle(element), element),
        match
    }
}

/**
 * @hidden
 */
export {getAllRules, getRawComputedStyle} from './domUtils'

/**
 * @hidden
 */
function issueID(element: HTMLElement, attrName) {
    if (element.hasAttribute(attrName)) {
        return element.getAttribute(attrName)
    }

    const id = shortid.generate().toLowerCase()
    element.setAttribute(attrName, id)
    return id
}

/**
 * @hidden
 */
export type Engine = {
    run(resolver: StyleResolver[])
    isManaging(m: MutationRecord)
    waitForStylesToBeLoaded() : Promise<{}>
    cleanup()
}

/**
 * 
 * @hidden
 */
export function create(rootElement: HTMLElement) {
    const document = rootElement.ownerDocument
    const headElement = rootElement === document.documentElement ? document.head : rootElement;
    const styleTag = document.createElement('style')
    const managerID = issueID(styleTag, 'rawss')
    headElement.appendChild(styleTag)
    return {
        cleanup: () => {
            headElement.removeChild(styleTag)
        },

        isManaging(m: MutationRecord) {
            return m.target === styleTag || m.target.parentNode === styleTag || m.attributeName === managerID
        },

        waitForStylesToBeLoaded() {
            return new Promise(r => waitForStylesToBeLoaded(rootElement).then(() => r()))
        },

        run: (resolvers: StyleResolver[]) => {
            const allRules = getAllRules(rootElement, element => element !== styleTag)
            const cache = new WeakMap<HTMLElement, AtomicStyle>()
            function issueAtomicStyle(element: HTMLElement) {
                if (cache.has(element)) {
                    return cache.get(element);
                }
        
                const style = getRawComputedStyle(allRules, element)
                cache.set(element, style)
                return style
            }
        
            const styleChanges = new Map<HTMLElement, Partial<CSSStyleDeclaration>>()
        
            resolvers.forEach(resolver => {
                new Set(
                    allRules.filter(resolver.match)
                        .reduce((els, rule) => [...els, ...getMatchingElements(rootElement, rule)], []))
        
                    .forEach(element => {
                        const newStyle = resolver.resolve(element, issueAtomicStyle);
                        styleChanges.set(element, Object.assign({}, styleChanges.get(element), newStyle))
                    })
            })
        
            const styleEntries = []
            styleChanges.forEach((value, key) => styleEntries.push([key, value]))
        
            const kebabCase = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()
            let cssText = `
    ${styleEntries.map(([element, style]) => `[${managerID}='${issueID(element, managerID)}'] {${Object.keys(style).map(name => `
        ${kebabCase(name)}: ${style[name]} !important;
    `)}}`).join('\n')}
`        
            styleTag.innerHTML = cssText
        }
    }
}

