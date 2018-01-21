import { getAllRulesInDocument, getMatchingElements, getRawComputedStyle, matches } from './domUtils';
import { StyleRule } from './cssUtils'
import * as shortid from 'shortid'

export type RawStyle = {[name: string]: string}
export interface StyleProcessor {
    process: (style: RawStyle) => CSSStyleDeclaration
    match: (rule: StyleRule) => boolean
}

export {getAllRulesInDocument, getRawComputedStyle} from './domUtils'
export function run(document: HTMLDocument, processors: StyleProcessor[]) {
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
        if (element.hasAttribute('data-lefil-id')) {
            return element.getAttribute('data-lefil-id')
        }

        const id = shortid.generate()
        element.setAttribute('data-lefil-id', id)
        return id
    }

    function issueStyleManager() : HTMLStyleElement {
        const existing = <HTMLStyleElement>document.querySelector('#lefil-style-manager');
        if (existing) {
            return existing;
        }

        const manager = document.createElement('style')
        document.head.appendChild(manager)
        manager.setAttribute('id', 'lefil-style-manager')
        return manager
    }

    const results : {style: CSSStyleDeclaration, element: HTMLElement}[] = processors.map((processor) => 
        [].map.call(
            allRules
                .filter(processor.match)
                .map(getMatchingElements.bind(null, document))
                .reduce(Set.prototype.add.call, new Set<HTMLElement>()),
                ((element: HTMLElement) => ({element, style: processor.process(issueRawStyle(element))}))))
                .reduce((agg, e) => [...agg, e], [])

    const kebabCase = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()
    let cssText = `
    ${results.map(({style, element}) => `[data-lefil-id='${issueID(element)}'] {
        ${[].map.call(style, (value, name) => `
            ${kebabCase(name)}: ${value} !important;
        `)}
    }`)}
    `

    const manager = issueStyleManager()
    manager.innerHTML = cssText
}