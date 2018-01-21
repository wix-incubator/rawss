// import {expect} from 'chai'
// import {launch, Page} from 'puppeteer'
// import * as lefil from '../src/lefil';
// import {readFileSync} from 'fs'

// describe('Lefil API', () => {
//     let browser = null;
//     let page : Page = null;
//     before(async() => browser = await launch())
//     beforeEach(async () => {
//         page = await browser.newPage();
//         await page.addScriptTag({path: 'src/cssparser.js'})
//         await page.addScriptTag({path: 'dist/main.js'})
//     });

//     afterEach(() => page.close())
//     after(() => browser.close())


//     it('should register and process a simple rule', async() => {
//         await page.setContent(`
//             <body>
//                 <div id="test" style="height: three-pixels"></div>
//             </body>
//         `)
//         // const height = await page.evaluate(() => {
//         //     const context = new Context()
//         //     context.addRule({
//         //         match: (value: string, key: string, selector: string) =>  value === 'three-pixels',
//         //         process: (value: string, key: string, element: HTMLElement) => '3px'
//         //     })
            
//         //     context.sync()
//         //     return (<HTMLElement>document.querySelector('#test')).offsetHeight
//         // });

//         // expect(height).to.equal(3)

//     })
// })