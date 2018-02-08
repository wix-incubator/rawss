import {Rawss, StyleResolver, createRawss} from './rawss'
import { AtomicStyle, AtomicStyleRule } from './cssUtils';
import { escape } from 'querystring';
import { getRawComputedStyle } from './domUtils';

export interface CssVariablesOptions {
    /**
     * An existing Rawss observer. Better reuse if you have several on the page
     */
    rawss?: Rawss

    /**
     * Root element for scoping style resolving
     */
    rootElement?: HTMLElement

    /**
     * Prefix for variables. Default is (--), as per spec
     */
    prefix: string
}

export interface CssVariablesPolyfill {
    /***
     * Observe changes in the document, and apply CSS variable resolving as they happen
     */
    start() : void

    /***
     * Stop observing
     */
    stop() : void

    /***
     * Resolve based on currently loaded styles
     */
    once() : void
}
/**
 * @hidden
 */
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  /**
   * 
   * @param options
   */
export function cssVariables(options: CssVariablesOptions = {rootElement: window.document.documentElement, rawss: null, prefix: '--'}) : CssVariablesPolyfill {
    let rawss = options.rawss || createRawss(options.rootElement || window.document.documentElement)
    const prefix = escapeRegExp(options.prefix)
    const DECLARE_REGEX = new RegExp(`${prefix}\\w+$`)
    const USE_REGEX = new RegExp(`var\\(\\s*${prefix}(\\w+)\\s*\\)`)

    function resolve(element: HTMLElement, getAtomicStyle: (e: HTMLElement) => AtomicStyle) : Partial<CSSStyleDeclaration> {
        const style = getAtomicStyle(element)
        return Object.keys(style).reduce((newStyle, key) => {
            let value = style[key]
            let index = 0;
            let accumStyle = newStyle
            let match = null
            while (match = USE_REGEX.exec(value.substr(index))) {
                const varName = match[1]
                const attrName = options.prefix + varName
                let resolvedValue : string = style[attrName]
                if (!resolvedValue) {
                    for (let e = element.parentElement; e && !resolvedValue; e = e.parentElement) {
                        resolvedValue = getAtomicStyle(e)[attrName]
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

    function match(rule: AtomicStyleRule) : boolean {
        return !!rule.value.match(USE_REGEX)
    }

    rawss.add({
        resolve, match
    })

    return {
        start() {
            rawss.start()
        },

        stop() {
            rawss.pause()
        },

        once() {
            rawss.once()
        }   
    }
}