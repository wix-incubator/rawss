import {expect} from 'chai'
import {launch, Page} from 'puppeteer'
import * as cssvar from '../src/cssvar';
import {RawStyleRule, RawStyle} from 'src/cssUtils'

const cssVariables = cssvar.cssVariables

describe('CSS Variables', () => {
    let browser = null;
    let page : Page = null;
    before(async() => browser = await launch())
    beforeEach(async () => {
        page = await browser.newPage();
        page.on('console', (e, args) => console[e['_type']](e['_text']))
        await page.addScriptTag({path: 'dist/cssvar.js'})
    });

    afterEach(() => page.close())
    after(() => browser.close())

    it('should support simple CSS variables with $$ syntax', async() => {
        await page.setContent(`
            <head>
                <style>
                    body { $$myVar: 1px; }
                    #container {
                        $$myVar: 2px;
                    }
                </style>
            </head>
            <body>
                <div id="container">
                    <div id="test" style="height: calc(var($$myVar) + 5px)"></div>
                </div>
            </body>
        `)
        const height = await page.evaluate(() => {
            const cssVars = cssVariables({prefix: '$$', document})
            cssVars.once()
            return (<HTMLElement>document.querySelector('#test')).offsetHeight
        });

        expect(height).to.equal(7)
    })

    it('should support several CSS variables with $$ syntax', async() => {
        await page.setContent(`
            <head>
                <style>
                    body { $$var1: 1px; $$var2: 3px }
                    #container {
                        $$var1: 2px;
                    }
                </style>
            </head>
            <body>
                <div id="container">
                    <div id="test" style="height: calc(var($$var1) + 5px + var($$var2))"></div>
                </div>
            </body>
        `)
        const height = await page.evaluate(() => {
            const cssVars = cssVariables({prefix: '$$', document})
            cssVars.once()
            return (<HTMLElement>document.querySelector('#test')).offsetHeight
        });

        expect(height).to.equal(10)
    })

    it('should support whitespace inside variable usage', async() => {
        await page.setContent(`
            <head>
                <style>
                    body { $$var1: 1px; $$var2: 3px }
                    #container {
                        $$var1: 2px;
                    }
                </style>
            </head>
            <body>
                <div id="container">
                    <div id="test" style="height: calc(var( $$var1) + 5px + var($$var2    ))"></div>
                </div>
            </body>
        `)
        const height = await page.evaluate(() => {
            const cssVars = cssVariables({prefix: '$$', document})
            cssVars.once()
            return (<HTMLElement>document.querySelector('#test')).offsetHeight
        });

        expect(height).to.equal(10)
    })

})