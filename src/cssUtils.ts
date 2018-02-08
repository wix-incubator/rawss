import * as specificity from 'css-specificity'
import * as expand from 'css-shorthand-expand'
export interface AtomicStyleEntry {
    name: string;
    value: string;
    important?: boolean;
}

export type AtomicStyle = { [prop: string]: string }
export type AtomicStyleDeclaration = AtomicStyleEntry[]
export interface AtomicStyleRule extends AtomicStyleEntry {
    selector: string | HTMLElement;
}

interface RuleSorter {
    rule: AtomicStyleRule
    index: number
}
const specificityComparator = (a: RuleSorter, b: RuleSorter) => {
    if (a.rule.important !== b.rule.important) {
        return b.rule.important ? 1 : -1
    }
    const selectors = [a.rule.selector, b.rule.selector]
    const isString = selectors.map(s => typeof(s) === 'string')
    if (!isString[0]) {
        return -1;
    }

    if (isString[0] && !isString[1]) {
        return 1;
    }
    const res = selectors.map(s => specificity.calc(s)[0])
    for (var i = 1; i < 4; i++) {
        if (res[0].specificity[i] !== res[1].specificity[i]) {
            return res[1].specificity[i] - res[0].specificity[i]
        }
    }

    return a.index - b.index
}

// yeah I know this doesn't cover strings. tough luck for now, not willing to integrate a full-blown parser, as it will reduce freedom
function clearComments(css) {
    return css.replace(/\/(\*(.|[\r\n])*?\*\/)|(\/[^\n]*)/ig, '')
}

export function parseDeclaration(rawCss: string) : AtomicStyleDeclaration {
    const css = clearComments(rawCss)
    const declarationRegex = /\s*([^;:\s]+)\s*:\s*([^;:!]+)\s*(\!important)?;?\s*/
    let index = 0
    let parsed = null
    let declaration : AtomicStyleDeclaration = []
    while (parsed = css && declarationRegex.exec(css.substr(index))) {
        const name = parsed[1].trim()
        const value = parsed[2].trim()
        const important = !!parsed[3]
        const expanded = expand(name, value) || {[name]: value}
        const entries = Object.keys(expanded).map(name => (Object.assign({name, value: expanded[name]}, important && {important})))
        declaration = [...declaration, ...entries]
        index += parsed.index + parsed[0].length
    }

    return declaration
}

export function parseStylesheet(rawCss: string) : AtomicStyleRule[] {
    if (!rawCss) {
        return []
    }
    const css = clearComments(rawCss)
    const ruleRegex = /([^{}]+){([^{}]+)}/
    let index = 0
    let parsed = null
    let rules : AtomicStyleRule[] = []
    while (parsed = css && ruleRegex.exec(css.substr(index))) {
        const selector = parsed[1].trim()
        const style = parseDeclaration(parsed[2])
        rules = [...rules, ...style.map(entry => ({selector, ...entry}))]
        index += parsed.index + parsed[0].length
    }

    return rules
}

export function sortRulesBySpecificFirst(rules: AtomicStyleRule[]) : AtomicStyleRule[] {
    return rules
        .map((rule, index) => ({rule, index}))
        .sort(specificityComparator)
        .map(e => e.rule)
}   





