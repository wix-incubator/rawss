import {expect} from 'chai'
import {launch, Page} from 'puppeteer'
import * as rawss from '../src/rawss';
import * as engine from '../src/engine';
import {RawStyleRule, RawStyle} from 'src/cssUtils'

const Rawss = rawss.Rawss
const createStyleProcessor = engine.createStyleProcessor
describe('Engine', () => {
    let browser = null;
    let page : Page = null;
    before(async() => browser = await launch())
    beforeEach(async () => {
        page = await browser.newPage();
        page.on('console', (e, args) => console[e['_type']](e['_text']))
        await page.addScriptTag({path: 'dist/rawss.js'})
        await page.addScriptTag({path: 'dist/engine.js'})
    });

    afterEach(() => page.close())
    after(() => browser.close())

    it('should register and process a rule using once()', async() => {
        await page.setContent(`
            <body>
                <div id="test" style="height: three-pixels"></div>
            </body>
        `)
        const height = await page.evaluate(() => {
            const proc = createStyleProcessor({
                match: (styleRule : RawStyleRule) =>  styleRule.value === 'three-pixels',
                process: (rawStyle : RawStyle, element: HTMLElement) => (Object.keys(rawStyle).reduce((style, key) => ({[key] : rawStyle[key] === 'three-pixels' ? '3px' : rawStyle[key],  ...style}), {}))
            })
            
            const rawss = new Rawss(document)
            rawss.add(proc)
            rawss.once()
            return (<HTMLElement>document.querySelector('#test')).offsetHeight
        });

        expect(height).to.equal(3)
    })

    it('should register and process a rule using start()', async() => {
        const height = await page.evaluate(() => {
            const proc = createStyleProcessor({
                match: (styleRule : RawStyleRule) =>  styleRule.value === 'four-pixels',
                process: (rawStyle : RawStyle, element: HTMLElement) => (Object.keys(rawStyle).reduce((style, key) => ({[key] : rawStyle[key] === 'four-pixels' ? '4px' : rawStyle[key],  ...style}), {}))
            })
            
            const rawss = new Rawss(document)
            rawss.add(proc)
            rawss.start()
            document.body.innerHTML = '<div id="test" style="height: four-pixels"></div>'
            return new Promise(r => {
                requestAnimationFrame(() => {
                    r((<HTMLElement>document.querySelector('#test')).offsetHeight)
                })
            })
        });

        expect(height).to.equal(4)
    })

    it('should process several changes in a row', async() => {
        const height = await page.evaluate(() => {
            const proc = createStyleProcessor({
                match: (styleRule : RawStyleRule) =>  styleRule.value === 'four-pixels',
                process: (rawStyle : RawStyle, element: HTMLElement) => (Object.keys(rawStyle).reduce((style, key) => ({[key] : rawStyle[key] === 'four-pixels' ? '4px' : rawStyle[key],  ...style}), {}))
            })
            
            const rawss = new Rawss(document)
            rawss.add(proc)
            rawss.start()
            document.body.innerHTML = '<div id="test" style="height: 100px"></div>'

            return new Promise(r => {
                requestAnimationFrame(() => {
                    document.getElementById('test').setAttribute('style', 'height: 100px; height: four-pixels')
                    requestAnimationFrame(() => {
                        r((<HTMLElement>document.querySelector('#test')).offsetHeight)
                    })
                })
            })
        });

        expect(height).to.equal(4)
    })

    it('should not process changes once stop is called', async() => {
        const height = await page.evaluate(() => {
            const proc = createStyleProcessor({
                match: (styleRule : RawStyleRule) =>  styleRule.value === 'four-pixels',
                process: (rawStyle : RawStyle, element: HTMLElement) => (Object.keys(rawStyle).reduce((style, key) => ({[key] : rawStyle[key] === 'four-pixels' ? '4px' : rawStyle[key],  ...style}), {}))
            })
            
            const rawss = new Rawss(document)
            rawss.add(proc)
            rawss.start()
            document.body.innerHTML = '<div id="test" style="height: 100px"></div>'

            return new Promise(r => {
                requestAnimationFrame(() => {
                    rawss.stop()
                    document.getElementById('test').setAttribute('style', 'height: 100px; height: four-pixels')
                    requestAnimationFrame(() => {
                        r((<HTMLElement>document.querySelector('#test')).offsetHeight)
                    })
                })
            })
        });

        expect(height).to.equal(100)
    })
})