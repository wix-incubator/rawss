import * as specificity from 'css-specificity'

export interface RawStyleEntry {
    name: string;
    value: string;
    important?: boolean;
}

export type RawStyle = { [prop: string]: string }

const specificityComparator = (a: RawStyleRule, b: RawStyleRule) => {
    if (a.important !== b.important) {
        return b.important ? 1 : -1
    }
    const selectors = [a.selector, b.selector]
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

    return -1
}

export type RawStyleDeclaration = RawStyleEntry[]

export interface RawStyleRule extends RawStyleEntry {
    selector: string | HTMLElement;
}

// yeah I know this doesn't cover strings. tough luck for now, not willing to integrate a full-blown parser, as it will reduce freedom
function clearComments(css) {
    return css.replace(/\/(\*(.|[\r\n])*?\*\/)|(\/[^\n]*)/ig, '')
}

export function parseDeclaration(rawCss: string) : RawStyleDeclaration {
    const css = clearComments(rawCss)
    const declarationRegex = /\s*([^;:\s]+)\s*:\s*([^;:!]+)\s*(\!important)?;?\s*/
    let index = 0
    let parsed = null
    const declaration : RawStyleDeclaration = []
    while (parsed = css && declarationRegex.exec(css.substr(index))) {
        const entry : RawStyleEntry = {name: parsed[1].trim(), value: parsed[2].trim()}
        if (parsed[3]) {
            entry.important = true;
        }
        declaration.push(entry)
        index += parsed.index + parsed[0].length
    }

    return declaration
}

export function parseStylesheet(rawCss: string) : RawStyleRule[] {
    if (!rawCss) {
        return []
    }
    const css = clearComments(rawCss)
    const ruleRegex = /([^{}]+){([^{}]+)}/
    let index = 0
    let parsed = null
    let rules : RawStyleRule[] = []
    while (parsed = css && ruleRegex.exec(css.substr(index))) {
        const selector = parsed[1].trim()
        const style = parseDeclaration(parsed[2])
        rules = [...rules, ...style.map(entry => ({selector, ...entry}))]
        index += parsed.index + parsed[0].length
    }

    return rules
}

export function sortRulesBySpecificFirst(rules: RawStyleRule[]) : RawStyleRule[] {
    return rules.sort((a, b) => specificityComparator(a, b))
}   





