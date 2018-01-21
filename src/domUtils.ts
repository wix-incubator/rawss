import {StyleRule, StyleDeclaration, parseDeclaration, sortRulesBySpecificFirst, parseStylesheet} from './cssUtils'
export function matches(e: HTMLElement, selector: string) {
    return (e.matches || e.msMatchesSelector).call(e, selector)
}

export function doesRuleApply(element: HTMLElement, rule: StyleRule) {
    if (rule.selector instanceof HTMLElement) {
        return element === rule.selector
    }

    return matches(element, <string>rule.selector)
}

export function parseInlineStyle(element: HTMLElement) : StyleRule[] {
    return parseDeclaration(element.getAttribute('style')).map(({name, value}) => ({name, value, selector: element}))
}

// TODO: link rels
export function getAllRulesInDocument(document: HTMLDocument) : StyleRule[] {
    const elementsWithStyleAttributes = document.querySelectorAll('[style]')
    const inlineStyleRules = [].reduce.call(elementsWithStyleAttributes, (agg, element) => [...agg, ...parseInlineStyle(element)], [])
    const styleTags = [].slice.call(document.querySelectorAll('style')).reverse().reduce((agg, e) => [...agg, ...parseStylesheet(e.innerHTML)], [])
    return [...inlineStyleRules, ...sortRulesBySpecificFirst(styleTags)]
}