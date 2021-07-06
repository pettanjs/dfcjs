# dfcjs
Disturbingly Fluid Composer for DOM Elements

## What?
`dfcjs` enables writing DOM structures in JavaScript with about the same amount
of overhead as writing HTML code directly. It's a better alternative to those
who dislike compiled scripts (e.g.`jsx`, `tsx`) or templating systems and
just want to write vanilla JavaScript. DFC allows you to write DOM in JavaScript
with minimal syntactic overhead while also balancing flexibility.

## Use DFC in my project
DFC is written as an UMD module which means you can use DFC by either directly
including the file in your HTML:
````HTML
<script type="application/javascript" src="dfc.js"></script>
````

or by using any module management system (Commonjs or AMD) + a bundler like
browserify to bundle into your application.

## Reference
`dfc (type, props?, children?, callback?):Element | DFC`

DFC can be used either as a _standalone function_ or as a _builder class_.
To use it standalone, you should do the following:
````JavaScript
var element = dfc('div', {'className': 'foo'});
````

If you want to use it like a builder, you can do:
````JavaScript
var element = (new dfc('div')).setProps({'className': 'foo'}).asElement();
````

### `type : string | Element | Document`
Either specify a type `<{type}>` for the DOM tag to create a new Element
or provide an existing Element from the DOM to only manipulate it.

When type is an empty string (`""`), dfc will return a `TextNode` with the
string in `props`.

### `props : object | string`
Can only be `string` when `type === ""`. Otherwise, treat it as a POJO hash and
map each key to an attribute for the DOM Element. Special care is taken for
`className` and `style`.

### `children? : (Element | string)[] | Element | string`
Items to add as children (optional). If provided, the items will be appended to
the current element in the order provided.

If the argument is an array, items will be added sequentially. If the argument
is a string, the string will be added as a new TextNode automatically.

### `callback? : function`
Function to call after the Element has been created and manipulated (optional).
If provided, a single argument of the current element is passed into the
callback function. The return value of the callback is ignored.

This is usually used to hook listeners etc. If the builder approach is used,
the callback will be called every time `asElement` is invoked.

### `.setProps(props) : DFC`
Behaves the same as providing the `props` argument. Overwrites any props that
have been provided previously. Returns the builder itself so it can be chained.

### `.addChildren(children) : DFC`
Behaves similarly to the children argument in the standalone mode. Returns the
builder itself so it can be chained.

### `.asElement() : Element`
Returns the element as it is currently built. This will also invoke the callback
if it is present.

NOTE: The builder only ever builds one item per instance. Calling `.asElement`
multiple times will return the _same_ item. Similarly, invoking builder methods
after the element has been retrieved will continue to mutate the element.

NOTE: The callback is invoked every time `.asElement` is called. This can result
in undesirable duplicate invocations of the callback. Repeat invocation of
`.asElement` is not advised.

## Example
Below is an example of DFC in action (standalone function mode)

````JavaScript
const _ = require('dfc');
_(document.body, {}, [
  _('main', { 'className': 'container' }, [
    _('div', {}, [
      _('h1', {}, 'This is the title'),
      _('p', { 'className': 'intro-text' }, 'Here is the intro text.')
    ]),
    _('div', { 'className': 'card-deck' }, [
      _('div', { 'className': 'card' }, [
        _('div', { 'className': 'card-header' }, [
          _('h4', {}, 'Plan 1')
        ]),
        _('div', { 'className': 'card-body' }. [
          _('p', {}, 'Plan Details Blah Blah'),
          _('button', {
            'className': 'btn btn-block btn-large'
          }, ['Buy Now'], function (buyNowButton) {
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

And the equivalent HTML:
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
