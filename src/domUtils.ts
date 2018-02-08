import {AtomicStyleRule, AtomicStyleDeclaration, parseDeclaration, sortRulesBySpecificFirst, parseStylesheet} from './cssUtils'
export function matches(e: HTMLElement, selector: string) {
    return (e.matches || e.msMatchesSelector).call(e, selector)
}

export function doesRuleApply(element: HTMLElement, rule: AtomicStyleRule) {
    if (rule.selector instanceof HTMLElement) {
        return element === rule.selector
    }

    return matches(element, <string>rule.selector)
}

export function parseInlineStyle(element: HTMLElement) : AtomicStyleRule[] {
    return parseDeclaration(element.hasAttribute('data-style') ? element.getAttribute('data-style') : element.getAttribute('style')).map(({name, value}) => ({name, value, selector: element}))
}

const loadedExternalStyles = new WeakMap<HTMLElement, string>()

function getStylesheetText(e: HTMLElement) {
    switch (e.tagName) {
        case 'STYLE': return e.innerHTML;
        case 'LINK': return loadedExternalStyles.get(e)
    }
}

export function getAllRules(rootElement: HTMLElement, filter: ((e: HTMLElement) => boolean) = () => true) : AtomicStyleRule[] {
    const elementsWithStyleAttributes = rootElement.querySelectorAll('[style],[data-style]')
    const inlineStyleRules = [].filter.call(elementsWithStyleAttributes, filter).reduce((agg, element) => [...agg, ...parseInlineStyle(element)], []).reverse()
    const styleTags = [].map.call(document.styleSheets, s => s.ownerNode).filter((n : HTMLElement) =>
            n && 
                (rootElement.compareDocumentPosition(rootElement) | Node.DOCUMENT_POSITION_CONTAINS) 
                && filter(n))
        .reverse()
        .reduce((agg, e) => [...agg, ...parseStylesheet(getStylesheetText(e))], [])
    return [...inlineStyleRules, ...sortRulesBySpecificFirst(styleTags)]
}

export function waitForStylesToBeLoaded(rootElement: HTMLElement) {
    const links = rootElement.querySelectorAll('link[rel="stylesheet"]')
    const linksWithoutStyles = [].filter.call(links, (link: HTMLLinkElement) => !loadedExternalStyles.has(link))
    return Promise.all(linksWithoutStyles.map(async (link: HTMLLinkElement) => {
       const response = await fetch(link.href, {headers: {'Content-Type': link.type}})
       loadedExternalStyles.set(link, await response.text())
    }))
}

export function getRawComputedStyle(rules: AtomicStyleRule[], element: HTMLElement) : {[name: string]: string} {
    return rules.reduce((style, rule: AtomicStyleRule) => style[rule.name] || !doesRuleApply(element, rule) ? style : {...style, [rule.name]: rule.value}, {})
}

export function getMatchingElements(rootElement: HTMLElement, rule: AtomicStyleRule)  : HTMLElement[] {
    return typeof(rule.selector) === 'string' ? [].slice.call(rootElement.querySelectorAll(rule.selector)) : [<HTMLElement>rule.selector]
}