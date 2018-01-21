import { parseDeclaration, parseStylesheet, sortRulesBySpecificFirst } from 'src/cssUtils';
import {expect} from 'chai'

describe('cssUtils', () => {
    describe('declaration', () => {
        it('should parse a single entry declaration', () => {
            expect(parseDeclaration('nothing: something')).to.deep.equal([{name: 'nothing', value: 'something'}])
        })
        it('should parse a single entry declaration with trailing whitespace', () => {
            expect(parseDeclaration('nothing: something ')).to.deep.equal([{name: 'nothing', value: 'something'}])
        })
        it('should parse a single entry declaration with trailing semicolon', () => {
            expect(parseDeclaration('nothing: something;')).to.deep.equal([{name: 'nothing', value: 'something'}])
        })
        it('should parse multiple entries', () => {
            expect(parseDeclaration('foo:1; bar:2')).to.deep.equal([{name: 'foo', value: '1'}, {name: 'bar', value: '2'}])
        })
        it('should parse multiple entries with the same name in the right order', () => {
            expect(parseDeclaration('foo:2; foo:1')).to.deep.equal([{name: 'foo', value: '2'}, {name: 'foo', value: '1'}])
        })
        it('should treat whitespace correctly', () => {
            expect(parseDeclaration(`
                foo:2; 
                a foo:1;
                `)).to.deep.equal([{name: 'foo', value: '2'}, {name: 'foo', value: '1'}])
        })
        it('should ignore single-line comments', () => {
            expect(parseDeclaration(`
                foo:2; 
                // comment
                foo:1 ;
                `)).to.deep.equal([{name: 'foo', value: '2'}, {name: 'foo', value: '1'}])
        })
        it('should ignore single-line comments at the end of an acceptable line', () => {
            expect(parseDeclaration(`
                foo:2// comment
                ;foo:1 ;
                `)).to.deep.equal([{name: 'foo', value: '2'}, {name: 'foo', value: '1'}])
        })
        it('should ignore multiple line comments', () => {
            expect(parseDeclaration(`
                foo:2/* comment
                ; a:b;*dfgradf */;foo:1 ;
                `)).to.deep.equal([{name: 'foo', value: '2'}, {name: 'foo', value: '1'}])
        })
        it('should ignore several single and multiple line comments', () => {
            expect(parseDeclaration(`
                foo:2/* comment
                // abc 1241421 2345w4treddfcg a:1 /*123*
                ; a:b;*dfgradf */;foo:1 ; /*123 */ // bla




                /* * // *

                a a adfea
                //
                `)).to.deep.equal([{name: 'foo', value: '2'}, {name: 'foo', value: '1'}])
        })
    })

    describe('sheet', () => {
        it ('should parse a single rule', () => {
            expect(parseStylesheet('* {foo: 1}')).to.deep.equal([{name: 'foo', value: '1', selector: '*'}])            
        })
        it ('should parse several rules', () => {
            expect(parseStylesheet('* {foo: 1} abc {123: true}')).to.deep.equal([{name: 'foo', value: '1', selector: '*'}, {name: '123', value: 'true', selector: 'abc'}])            
        })
        it ('should ignore single line comments', () => {
            expect(parseStylesheet(`
                * {foo: 1} // bla
                abc {123: true}`)).to.deep.equal([{name: 'foo', value: '1', selector: '*'}, {name: '123', value: 'true', selector: 'abc'}])            
        })
    })

    describe('specificity', () => {
        it('should sort by specificity', () => {
            expect(sortRulesBySpecificFirst([
                {selector: '#id', name: '', value: ''},
                {selector: '.class #id', name: '', value: ''}
            ])).to.deep.equal([
                {selector: '.class #id', name: '', value: ''},
                {selector: '#id', name: '', value: ''}
            ])
        })
        
        it('should put element specificity before selector', () => {
            expect(sortRulesBySpecificFirst([
                {selector: '#id', name: '', value: ''},
                {selector: null, name: '', value: ''}
            ])).to.deep.equal([
                {selector: null, name: '', value: ''},
                {selector: '#id', name: '', value: ''}
            ])
        })
        
        it('should keep order for items with same specificity', () => {
            expect(sortRulesBySpecificFirst([
                {selector: '#id', name: '', value: ''},
                {selector: '#abc', name: '', value: ''}
            ])).to.deep.equal([
                {selector: '#id', name: '', value: ''},
                {selector: '#abc', name: '', value: ''}
            ])
        })
        
        it('should keep order for items with inline specificity', () => {
            expect(sortRulesBySpecificFirst([
                {selector: null, name: 'abc', value: ''},
                {selector: null, name: '', value: ''}
            ])).to.deep.equal([
                {selector: null, name: 'abc', value: ''},
                {selector: null, name: '', value: ''}
            ])
        })
    })
})