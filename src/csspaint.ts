import {Rawss, StyleResolver, createRawss} from './rawss'
import { AtomicStyle, AtomicStyleRule } from './cssUtils';
import { escape } from 'querystring';
import { getRawComputedStyle } from './domUtils';

export interface CSSPaintPolyfill {
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
   * 
   * @param options
   */

export function cssPaint()  {
    const rawss = createRawss(window.document.documentElement)
    const regex = /paint\(([^)]+)\)/
    const customPaints = {}
    const elementsWithCustomPaint = new WeakSet<HTMLElement>()
    window['registerPaint'] = (name, cls) => customPaints[name] = cls
    CSS['paintWorklet'] = {
        addModule: uri => {
            const script = document.createElement('script')
            script.src = uri
            script.onload = () => rawss.once()
            document.head.appendChild(script)
        }
    }

    function resolve(element: HTMLElement, getAtomicStyle: (e: HTMLElement) => AtomicStyle) : Partial<CSSStyleDeclaration> {
        const atomicStyle = getAtomicStyle(element)
        const computedStyle = getComputedStyle(element)

        function doPaint({paint}, props, geom) {
            // TODO: cache
            const canvas = document.createElement('canvas')
            canvas.width  = geom.width
            canvas.height = geom.height
            const ctx = canvas.getContext('2d')
            paint(ctx, geom, props)
            return `url(${canvas.toDataURL()})`
        }

        function listenToElementChanges(element) {
            function step() {
                const {clientWidth, clientHeight} = element
                const {width, height} = element.dataset
                if (width !== clientWidth) {
                    element.dataset.width = clientWidth
                }
                if (height !== clientHeight) {
                    element.dataset.height = clientHeight
                }
                window.requestAnimationFrame(step)
            }

            step()
        }

        function process(value) {
            const matched = regex.exec(value)
            if (!matched) {
                return value
            }

            const paintName = matched[1]
            const painter = customPaints[paintName]
            if (!painter) {
                console.warn(`No paint registered name ${paintName}`)
                return value
            }

            const props = (painter.inputProperties || [])
                .reduce((props, propName) => Object.assign({[propName]: computedStyle.getPropertyValue(propName).trim()}, props), {})

            // Careful with layout thrashing.
            const geom = {width: element.offsetWidth, height: element.offsetHeight}
            if (!elementsWithCustomPaint.has(element)) {
                listenToElementChanges(element)
                elementsWithCustomPaint.add(element)
            }
            return doPaint(new painter(), {'get': key => props[key] }, geom)
        }

        return Object.keys(atomicStyle).reduce((style, key) => {
            const value = atomicStyle[key]
            return value.match(regex) ? {...style, [key]: process(value)} : style
        }, {});
    }

    function match(rule: AtomicStyleRule) : boolean {
        return !!rule.value.match(regex)
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