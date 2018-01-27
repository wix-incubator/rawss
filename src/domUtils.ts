import {RawStyleRule, RawStyleDeclaration, parseDeclaration, sortRulesBySpecificFirst, parseStylesheet} from './cssUtils'
export function matches(e: HTMLElement, selector: string) {
    return (e.matches || e.msMatchesSelector).call(e, selector)
}

export function doesRuleApply(element: HTMLElement, rule: RawStyleRule) {
    if (rule.selector instanceof HTMLElement) {
        return element === rule.selector
    }

    return matches(element, <string>rule.selector)
}

export function parseInlineStyle(element: HTMLElement) : RawStyleRule[] {
    return parseDeclaration(element.getAttribute('style')).map(({name, value}) => ({name, value, selector: element}))
}

const loadedExternalStyles = new WeakMap<HTMLLinkElement, string>()

function getStylesheetText(e: HTMLElement) {
    switch (e.tagName.toLowerCase()) {
        case 'style': return e.innerHTML;
        case 'link': loadedExternalStyles.get(<HTMLLinkElement>e)
    }
}

// TODO: link rels
export function getAllRulesInDocument(document: HTMLDocument, filter: ((e: HTMLElement) => boolean) = () => true) : RawStyleRule[] {
    const elementsWithStyleAttributes = document.querySelectorAll('[style]')
    const inlineStyleRules = [].filter.call(elementsWithStyleAttributes, filter).reduce((agg, element) => [...agg, ...parseInlineStyle(element)], []).reverse()
    const styleTags = [].slice.call(document.querySelectorAll('style, link[rel="stylesheet"]')).filter(filter).reverse().reduce((agg, e) => [...agg, ...parseStylesheet(getStylesheetText(e))], [])
    return [...inlineStyleRules, ...sortRulesBySpecificFirst(styleTags)]
}

export function waitForStylesLoaded(document: HTMLDocument) {
    const links = document.querySelectorAll('link[rel="stylesheet"]')
    const linksWithoutStyles = [].filter.call(links, (link: HTMLLinkElement) => !loadedExternalStyles.has(link))
    return Promise.all(linksWithoutStyles.map((link: HTMLLinkElement) =>
        console.log(link.href) || fetch(link.href, {headers: {'Content-Type': link.type},})
            .then(response => response.text())
            .then(text => {
                loadedExternalStyles.set(link, text)
            }))
    )
}

export function getRawComputedStyle(rules: RawStyleRule[], element: HTMLElement) : {[name: string]: string} {
    return rules.reduce((style, rule: RawStyleRule) => style[rule.name] || !doesRuleApply(element, rule) ? style : {...style, [rule.name]: rule.value}, {})
}

export function getMatchingElements(document: HTMLDocument, rule: RawStyleRule)  : HTMLElement[] {
    return typeof(rule.selector) === 'string' ? [].slice.call(document.querySelectorAll(rule.selector)) : [<HTMLElement>rule.selector]
}