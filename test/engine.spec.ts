import {expect} from 'chai'
import {launch, Page} from 'puppeteer'
import * as engine from '../src/engine';
import {readFileSync} from 'fs'
import {RawStyleRule} from 'src/cssUtils'
import { RawStyle } from '../src/engine';

const create = engine.create

describe('Engine', () => {
    let browser = null;
    let page : Page = null;
    before(async() => browser = await launch())
    beforeEach(async () => {
        page = await browser.newPage();
        page.on('console', (e, args) => console[e['_type']](e['_text']))
        await page.addScriptTag({path: 'dist/engine.js'})
    });

    afterEach(() => page.close())
    after(() => browser.close())


    it('should register and process a simple rule', async() => {
        await page.setContent(`
            <body>
                <div id="test" style="height: three-pixels"></div>
            </body>
        `)
        const height = await page.evaluate(() => {
            const proc =({
                match: (styleRule : RawStyleRule) =>  styleRule.value === 'three-pixels',
                process: (rawStyle : RawStyle, element: HTMLElement) => (Object.keys(rawStyle).reduce((style, key) => ({[key] : rawStyle[key] === 'three-pixels' ? '3px' : rawStyle[key],  ...style}), {}))
            })
            
            create(document).run([proc])
            return (<HTMLElement>document.querySelector('#test')).offsetHeight
        });

        expect(height).to.equal(3)

    })
})