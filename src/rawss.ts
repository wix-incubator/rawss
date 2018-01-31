import {create, Engine, StyleResolver} from './engine'

/**
 * Interface for managing CSS resolve lifecycle 
 */
export interface Rawss {
    /**
     * Add a style resolver
     * @param resolver
     */
    add(resolver: StyleResolver)

    /***
     * Process all resolvers once
     */
    once()

    /**
     * Observe the document for changes, and resolve when needed
     */
    start()

    /**
     * Stop observing the docment for changes
     */
    pause()

    /**
     * Remove attributes/elements created by Rawss
     */
    cleanup()

    /**
     * Returns a promise that gets resolved when all styles are loaded
     */
    settle() : Promise<{}>
}

export function createRawss(rootElement: HTMLElement) : Rawss {
    const resolvers : StyleResolver[] = []
    const engine = create(rootElement)
    function once() {
        engine.run(resolvers)
    }

    function resolve(mutations: MutationRecord[]) {
        const relevantMutations = mutations.filter(m => !engine.isManaging(m))
        if (!relevantMutations.length) {
            return
        }
        
        once()
        reapplyOnStylesLoaded()
    }
    
    function pause() {
        observer.disconnect()
    }

    function reapplyOnStylesLoaded() {
        engine.waitForStylesToBeLoaded().then(once);
    }    
    
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
        resolve(mutations)
    })

    function start() {
        observer.observe(rootElement, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true 
        })
    }
    
    reapplyOnStylesLoaded()

    return {
        add(resolver: StyleResolver) {
            resolvers.push(resolver)
        },

        cleanup() {
            engine.cleanup();
        },

        once, start, pause,

        settle() {
            return engine.waitForStylesToBeLoaded()
        }
    }
}

export type StyleResolver = StyleResolver
