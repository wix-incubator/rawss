# Rawss
A generic framework for polyfilling CSS
Aiming for a fully functional polyfill for CSS variable

## What it lets you do
* Write any CSS in any browser that supports mutation observers, and process it. 
* Use CSS variables in any browser

## API
const {Rawss, StyleProcessor, cssVariables} = require('rawss')

### StyleProcessor: A generic processor interface to handle a raw CSS rule
* match({name, value, selector}): boolean
Implement to specify which style declarations apply to your processor

* process(element, getRawStyle): CSSStyleDeclaration
Implement to apply raw style to real, valid style
getRawStyle can return the raw, unfiltered style of any element

### Rawss: generic API for responding to any style change
### cssVariables: specific implementation for CSS variables polyfill
[API](https://wix.github.io/rawss/docs/)

