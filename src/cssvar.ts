import {Rawss, StyleProcessor} from './rawss'
import { RawStyle, RawStyleRule } from 'src/cssUtils';
import { escape } from 'querystring';
import { getRawComputedStyle } from 'src/domUtils';

interface CssVariablesOptions {
    rawss?: Rawss
    document?: HTMLDocument
    prefix: string
}

interface CssVariablesPolyfill {
    start()
    stop()
    once()
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

export function cssVariables(opt: CssVariablesOptions = {document: window.document, rawss: null, prefix: '--'}) : CssVariablesPolyfill {
    let rawss = opt.rawss || new Rawss(opt.document)
    const prefix = escapeRegExp(opt.prefix)
    const DECLARE_REGEX = new RegExp(`${prefix}\\w+$`)
    const USE_REGEX = new RegExp(`var\\(\\s*${prefix}(\\w+)\\s*\\)`)

    function process(element: HTMLElement, getRawStyle: (e: HTMLElement) => RawStyle) : Partial<CSSStyleDeclaration> {
        const style = getRawStyle(element)
        return Object.keys(style).reduce((newStyle, key) => {
            let value = style[key]
            let index = 0;
            let accumStyle = newStyle
            let match = null
            while (match = USE_REGEX.exec(value.substr(index))) {
                const varName = match[1]
                const attrName = opt.prefix + varName
                let resolvedValue : string = style[attrName]
                if (!resolvedValue) {
                    for (let e = element.parentElement; e && !resolvedValue; e = e.parentElement) {
                        resolvedValue = getRawStyle(e)[attrName]
                    }
                }

                if (!resolvedValue) {
                    return newStyle
                }

                value = value.replace(new RegExp(`var\\(\\s*${prefix}${varName}\\s*\\)`), resolvedValue)    
                accumStyle = {...accumStyle, ...{[key]: value}}
                index += match.index + match[0].length
            }

            return accumStyle
        }, {})
    }

    function match(rule: RawStyleRule) : boolean {
        return !!rule.value.match(USE_REGEX)
    }

    rawss.add({
        process, match
    })

    return {
        start() {
            rawss.start()
        },

        stop() {
            rawss.stop()
        },

        once() {
            rawss.once()
        }   
    }
}