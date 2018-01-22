import {expect} from 'chai'
import {launch, Page} from 'puppeteer'
import * as lefil from '../src/lefil';
import {readFileSync} from 'fs'
import {StyleRule} from 'src/cssUtils'
import { RawStyle } from '../src/lefil';

const run = lefil.run

describe('Lefil API', () => {
    let browser = null;
    let page : Page = null;
    before(async() => browser = await launch())
    beforeEach(async () => {
        page = await browser.newPage();
        page.on('console', (e, args) => console[e['_type']](e['_text']))
        await page.addScriptTag({path: 'dist/lefil.js'})
    });

    afterEach(() => page.close())
    after(() => browser.close())


    it.only('should register and process a simple rule', async() => {
        await page.setContent(`
            <body>
                <div id="test" style="height: three-pixels"></div>
            </body>
        `)
        const height = await page.evaluate(() => {
            const proc =({
                match: (styleRule : StyleRule) =>  styleRule.value === 'three-pixels',
                process: (rawStyle : RawStyle, element: HTMLElement) => (Object.keys(rawStyle).reduce((style, key) => ({[key] : rawStyle[key] === 'three-pixels' ? '3px' : rawStyle[key],  ...style}), {}))
            })
            
            run(document, [proc])
            return (<HTMLElement>document.querySelector('#test')).offsetHeight
        });

        expect(height).to.equal(3)

    })
})