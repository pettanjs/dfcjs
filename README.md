# dfcjs
Disturbingly Fluid Composer for DOM Elements

## What?
`dfcjs` enables writing DOM structures in JavaScript with about the same amount
of overhead as writing HTML code directly. It's a better alternative to those
who dislike compiled scripts (e.g.`jsx`, `tsx`) or templating systems and 
just want to write vanilla JavaScript

## Use DFC in my project
You can use dfc by either directly including the file in your HTML:
````HTML
<script type="application/javascript" src="dfc.js"></script>
````

or by using a bundler like browserify and `require()`-ing it.

## Reference
`dfc (type, props, children?, callback?):Element`

### `type : string | Element`
Either specify a type `<{type}>` for the DOM tag to create a new Element
or provide an existing Element from the DOM to only manipulate it.

When type is `""`, dfc will return a `TextNode` with the string in `props`.

### `props : object | string`
Can only be `string` when `type === ""`. Otherwise, treat it as a POJO hash and
map each key to an attribute for the DOM Element. Special care is taken for 
`className` and `style`.

### `children? : Element[]`
Items to add as children (optional). If provided, the items will be appended to
the current element in the order provided.

### `callback? : function`
Function to call after the Element has been created and manipulated (optional).
If provided, a single argument of the current element is passed into the 
callback function. The return value of the callback is ignored. 

This is usually used to hook listeners etc.

## Example
````JavaScript
const _ = require('dfc');
_(document.body, {}, [
  _('main', { 'className': 'container' }, [
    _('div', {}, [
      _('h1', {}, [_('', 'This is the title')]),
      _('p', { 'className': 'intro-text' }, [_('', 'Here is the intro text.')])
    ]),
    _('div', { 'className': 'card-deck' }, [
      _('div', { 'className': 'card' }, [
        _('div', { 'className': 'card-header' }, [
          _('h4', {}, [_('', 'Plan 1')])
        ]),
        _('div', { 'className': 'card-body' }. [
          _('p', {}, _('', 'Plan Details Blah Blah')),
          _('button', {
            'className': 'btn btn-block btn-large'
          }, [_('', 'Buy Now')], function (buyNowButton) {
            buyNowButton.addEventListener('click', function () {
              doSomething();
            })
          })
        ])
      ])
    ])
  ])
]);
````

Equivalent HTML:
````HTML
<body>
  <main class="container">
    <div>
      <h1>This is the title</h1>
      <p class="intro-text">Here is the intro text.</p>
    </div>
    <div class="card-deck">
      <div class="card">
        <div class="card-header">
          <h4>Plan 1</h4>
        </div>
        <div class="card-body">
          <p>Plan Details Blah Blah</p>,
          <button class="btn btn-block btn-large" onclick="doSomething()">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  </main>
</body>
````