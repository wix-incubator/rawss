import {StyleRule, StyleDeclaration, parseDeclaration} from './cssUtils'
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
