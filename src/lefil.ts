import { getAllRulesInDocument, getMatchingElements, getRawComputedStyle, matches } from './domUtils';
import { StyleRule, StyleDeclaration } from './cssUtils'
import * as shortid from 'shortid'

export type RawStyle = {[name: string]: string}
export interface StyleProcessor {
    process: (style: RawStyle, element: HTMLElement) => Partial<CSSStyleDeclaration>
    match: (rule: StyleRule) => boolean
}

export {getAllRulesInDocument, getRawComputedStyle} from './domUtils'
export function run(document: HTMLDocument, processors: StyleProcessor[]) {
    const MANAGER_ID = 'lefil-style-manager'
    const ITEM_ID_ATTR_NAME = 'data-lefil-id'
    const allRules = getAllRulesInDocument(document, element => !matches(element, '#lefil-style-manager'))
    const cache = new WeakMap()
    function issueRawStyle(element: HTMLElement) {
        if (cache.has(element)) {
            return cache.get(element);
        }

        const style = getRawComputedStyle(allRules, element)
        cache.set(element, style)
        return style
    }

    function issueID(element: HTMLElement) {
        if (element.hasAttribute(ITEM_ID_ATTR_NAME)) {
            return element.getAttribute(ITEM_ID_ATTR_NAME)
        }

        const id = shortid.generate()
        element.setAttribute(ITEM_ID_ATTR_NAME, id)
        return id
    }

    function issueStyleManager() : HTMLStyleElement {
        const existing = <HTMLStyleElement>document.getElementById(MANAGER_ID);
        if (existing) {
            return existing;
        }

        const manager = document.createElement('style')
        document.head.appendChild(manager)
        manager.setAttribute('id', MANAGER_ID)
        return manager
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
    ${styleEntries.map(([element, style]) => `[${ITEM_ID_ATTR_NAME}='${issueID(element)}'] {${Object.keys(style).map(name => `
        ${kebabCase(name)}: ${style[name]} !important;
    `)}}`)}
    `

    console.log(cssText)

    const manager = issueStyleManager()
    manager.innerHTML = cssText
}