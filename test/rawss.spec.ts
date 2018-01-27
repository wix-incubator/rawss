import {expect} from 'chai'
import {launch, Page} from 'puppeteer'
import * as rawss from '../src/rawss';
import * as engine from '../src/engine';
import {RawStyleRule, RawStyle} from 'src/cssUtils'
import * as express from 'express'
const Rawss = rawss.Rawss
const createStyleProcessor = engine.createStyleProcessor
describe('Rawcss', () => {
    let browser = null;
    let page : Page = null;
    let app = null
    let server = null
    const port = 9987
    before(async() => {
        browser = await launch()
        app = express()
        app.use(express.static('test/public'))
        server = app.listen(port)
        page = await browser.newPage();
        await page.goto(`http://localhost:${port}/index.html`)
        page.on('console', (e, args) => console[e['_type']](e['_text']))
    })

    beforeEach(async () => {
        await page.addScriptTag({path: 'dist/rawss.js'})
        await page.addScriptTag({path: 'dist/engine.js'})
    });

    afterEach(() => page.close())
    after(async () => {
        await browser.close();
        await new Promise(r => server.close(r))
    })


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

    it('should process styles from external stylesheets', async() => {
        await page.setContent('<head><style>#test { height: 30px; }</style><link rel="stylesheet" href="/test2.css" /></head><body />')
        const height = await page.evaluate(() => {
            const proc = createStyleProcessor({
                match: (styleRule : RawStyleRule) =>  styleRule.value === 'four-pixels',
                process: (rawStyle : RawStyle, element: HTMLElement) => (Object.keys(rawStyle).reduce((style, key) => ({[key] : rawStyle[key] === 'four-pixels' ? '4px' : rawStyle[key],  ...style}), {}))
            })
            
            
            const rawss = new Rawss(document)
            rawss.add(proc)
            rawss.start()
            document.body.innerHTML = '<div id="test"></div>'

            return rawss.settle().then(() => new Promise(r => {
                requestAnimationFrame(() => {
                    r((<HTMLElement>document.querySelector('#test')).offsetHeight)
                })
            }))
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