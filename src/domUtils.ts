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
export function getAllRulesInDocument(document: HTMLDocument, filter: ((e: HTMLElement) => boolean) = () => true) : StyleRule[] {
    const elementsWithStyleAttributes = document.querySelectorAll('[style]')
    const inlineStyleRules = [].filter.call(elementsWithStyleAttributes, filter).reduce((agg, element) => [...agg, ...parseInlineStyle(element)], [])
    const styleTags = [].slice.call(document.querySelectorAll('style')).filter(filter).reverse().reduce((agg, e) => [...agg, ...parseStylesheet(e.innerHTML)], [])
    return [...inlineStyleRules, ...sortRulesBySpecificFirst(styleTags)]
}

export function getRawComputedStyle(rules: StyleRule[], element: HTMLElement) : {[name: string]: string} {
    return rules.reduce((style, rule: StyleRule) => style[rule.name] || !doesRuleApply(element, rule) ? style : {...style, [rule.name]: rule.value}, {})
}

export function getMatchingElements(document: HTMLDocument, rule: StyleRule)  : HTMLElement[] {
    return typeof(rule.selector) === 'string' ? [].slice.call(document.querySelectorAll(rule.selector)) : [<HTMLElement>rule.selector]
}