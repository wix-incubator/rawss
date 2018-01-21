import { getAllRulesInDocument, getMatchingElements, getRawComputedStyle } from './domUtils';
import { StyleRule } from './cssUtils'

export type RawStyle = {[name: string]: string}
export interface StyleProcessor {
    process: (style: RawStyle) => CSSStyleDeclaration
    match: (rule: StyleRule) => boolean
}

export {getAllRulesInDocument, getRawComputedStyle} from './domUtils'
export function sync(document: HTMLDocument, processors: StyleProcessor[]) {
    const allRules = getAllRulesInDocument(document)
    const cache = new WeakMap()
    function getRawStyle(element: HTMLElement) {
        if (cache.has(element)) {
            return cache.get(element);
        }

        const style = getRawComputedStyle(allRules, element)
        cache.set(element, style)
        return style
    }

    const processed : {style: CSSStyleDeclaration, element: HTMLElement}[] = processors.map((processor) => 
        [].map.call(
            allRules
                .filter(processor.match)
                .map(getMatchingElements.bind(null, document))
                .reduce(Set.prototype.add.call, new Set<HTMLElement>()),
                ((element: HTMLElement) => ({element, style: processor.process(getRawStyle(element))}))))

//    const style = document.styleSheets
    // processed.forEach(result => {

    // })
    return []
}