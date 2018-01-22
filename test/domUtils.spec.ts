import {expect} from 'chai'
import {launch, Page} from 'puppeteer'
import {readFileSync} from 'fs'
import * as domUtils from '../src/domUtils';
import { RawStyleRule } from 'src/cssUtils';

const doesRuleApply = domUtils.doesRuleApply
const parseInlineStyle = domUtils.parseInlineStyle
const getAllRulesInDocument = domUtils.getAllRulesInDocument
const getRawComputedStyle = domUtils.getRawComputedStyle
describe('domUtils', () => {
    let browser = null;
    let page : Page = null;
    before(async() => browser = await launch())
    beforeEach(async () => {
        page = await browser.newPage();
        await page.addScriptTag({path: 'dist/domUtils.js'})
    });

    afterEach(() => page.close())
    after(() => browser.close())

    describe('doesRuleApply', () => {
        it('should return true for a simple rule', async () => {
            await page.setContent(`
            <body>
                <div id="test" style="height: three-pixels"></div>
            </body>
            `)
            const applies = await page.$eval('#test', (e : HTMLElement) => doesRuleApply(e, {selector: '#test', name: '', value: ''}))
            expect(applies).to.equal(true)
        })
        it('should return true for a wrong simple rule', async () => {
            await page.setContent(`
            <body>
                <div id="test" style="height: three-pixels"></div>
            </body>
            `)
            const applies = await page.$eval('#test', (e : HTMLElement) => doesRuleApply(e, {selector: '#wrong', name: '', value: ''}))
            expect(applies).to.equal(false)
        })

        it('should return true for a class rule', async () => {
            await page.setContent(`
            <body>
                <div id="test" class="bla" style="height: three-pixels"></div>
            </body>
            `)
            const applies = await page.$eval('#test', (e : HTMLElement) => doesRuleApply(e, {selector: '.bla', name: '', value: ''}))
            expect(applies).to.equal(true)
            
        })

        it('should return false for a wrong class rule', async () => {
            await page.setContent(`
            <body>
                <div id="test" class="bla" style="height: three-pixels"></div>
            </body>
            `)
            const applies = await page.$eval('#test', (e : HTMLElement) => doesRuleApply(e, {selector: '.bla2', name: '', value: ''}))
            expect(applies).to.equal(false)
            
        })

        it('should return true for self inline-style rule', async () => {
            await page.setContent(`
            <body>
                <div id="test" class="bla" style="height: three-pixels"></div>
            </body>
            `)
            const applies = await page.$eval('#test', (e : HTMLElement) => doesRuleApply(e, {selector: e, name: 'baz', value: 'bar'}))
            expect(applies).to.equal(true)
        })
    })

    describe('parse inline style', () => {
        it('should parse the correct rule', async() => {
            await page.setContent(`
            <body>
                <div id="test" class="bla" style="height: three-pixels"></div>
            </body>
            `)
            const inlineStyle: RawStyleRule[] = await page.$eval('#test', (e : HTMLElement) => {
                const rules = parseInlineStyle(e)
                return rules.map(r => [(<HTMLElement>r.selector).id, r.name, r.value])
            })
            expect(inlineStyle).to.deep.equal([['test', 'height', 'three-pixels']])        
        })
    })

    describe('get all rules', () => {
        it('should get rules from inline styles', async() => {
            await page.setContent(`
            <body>
                <div id="test" class="bla" style="height: three-pixels"></div>
            </body>
            `)
            const rules = await page.evaluate(() => getAllRulesInDocument(document).map(r => [(<HTMLElement>r.selector).id, r.name, r.value]))
            expect(rules).to.deep.equal([['test', 'height', 'three-pixels']])                    
        })
        it('should get rules from style tags', async() => {
            await page.setContent(`
            <head>
                <style>* {bla: --123}</style>
            </head>
            `)
            const rules = await page.evaluate(() => getAllRulesInDocument(document))
            expect(rules).to.deep.equal([{selector: '*', name: 'bla', value: '--123'}])                    
        })
        
        it('should filter out rules from managed style tags', async() => {
            await page.setContent(`
            <head>
                <style id="something">* {bla: --456}</style>
                <style>* {bla: --123}</style>
            </head>
            `)
            const rules = await page.evaluate(() => getAllRulesInDocument(document, e => e.getAttribute('id') !== 'something'))
            expect(rules).to.deep.equal([{selector: '*', name: 'bla', value: '--123'}])                    
        })
        
        it('should get rules from different origins in the correct order', async() => {
            await page.setContent(`
            <head>
                <style>* {bla: --123}</style>
                <style>#id {foo:bar /*ok: not*/}</style>
            </head>
            <body>
                <div id="test" class="bla" style="height: sheker"></div>
                <style>* {bla: abc}</style>
            </body>
            `)
            const rules = await page.evaluate(() => getAllRulesInDocument(document))
            expect(rules.map(r => r.value)).to.deep.equal(['sheker', 'bar', 'abc', '--123'])
        })
    })

    describe('get raw computed style', () => {
        it('should return the first rule for each prop', async () => {
            await page.setContent(`
            <head>
                <style>* {bla: 976}</style>
                <style>* {bla: --123}; .bla {foo: 123}</style>
                <style>#test {foo:bar /*ok: not*/}</style>
                <style>#test2 {a:bar /*ok: not*/}</style>
            </head>
            <body>
                <div id="test" class="bla" style="height: sheker"></div>
                <style>.bla {width: 100px}</style>
            </body>
            `)

            const style = await page.$eval('#test', element => {
                    const rules = getAllRulesInDocument(document)
                    return getRawComputedStyle(rules, <HTMLElement>element)
                })
            
            expect(style).to.deep.equal({height: 'sheker', foo: 'bar', width: '100px', bla: '--123'})
        })
    })
})