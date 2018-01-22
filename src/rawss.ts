import {create, Engine, StyleProcessor} from './engine'


class PrivateData {
    document: HTMLDocument
    engine: Engine
    processors: StyleProcessor[] = []
    observer: MutationObserver
}

const dataMap = new WeakMap<Rawss, PrivateData>()
const d = (r: Rawss) => dataMap.get(r)

function once(data: PrivateData) {
    data.engine.run(data.processors)
}

function process(data: PrivateData, mutations: MutationRecord[]) {
    const relevantMutations = mutations.filter(m => !data.engine.isManaging(m.target))
    if (!relevantMutations.length) {
        return
    }
    
    once(data)
}

function init(r: Rawss, document: HTMLDocument) {
    const p = new PrivateData()
    dataMap.set(r, p)
    p.document = document
    p.engine = create(document)

    p.observer = new MutationObserver((mutations: MutationRecord[]) => {
        process(p, mutations)
    })
}

function start(data: PrivateData) {
    data.observer.observe(data.document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    })
}

function stop(data: PrivateData) {
    data.observer.disconnect()
}

export class Rawss {
    constructor(document: HTMLDocument) {
        init(this, document)
    }

    add(p: StyleProcessor) {
        d(this).processors.push(p)
    }

    destroy() {
        d(this).engine.destroy()
    }

    once() {
        once(d(this))
    }

    start() {
        start(d(this))
    }

    stop() {
        stop(d(this))
    }
}