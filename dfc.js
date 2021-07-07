/**
 * DFC - Minimal JS DOM Manipulator
 * @author Jim Chen
 * @source https://github.com/pettanjs/dfcjs
 * @license MIT
 **/
'use strict';
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports === 'object' &&
    typeof exports.nodeName !== 'string') {

    factory(exports);
  } else {
    factory(root);
  }
})(this, function (exports) {
  const SVG_TYPES = [
    'svg', 'rect', 'circle', 'ellipse', 'path', 'g'
  ];

  function _addChildren(parent, child) {
    if (typeof parent === 'undefined' || typeof child === 'undefined') {
      return;
    }
    if (parent === null || child === null) {
      return;
    }
    if (Array.isArray(child)) {
      child.forEach(function (item) {
        _addChildren(parent, item);
      });
    } else if (typeof child === 'string') {
      _addChildren(parent, Compose('', child));
    } else {
      parent.appendChild(child);
    }
  }

  function _setProperties(parent, props) {
    if (typeof props !== 'object' || props === null) {
      return;
    }
    for (var propName in props) {
      if (propName === 'style') {
        for (var styleKey in props.style) {
          parent.style[styleKey] = props.style[styleKey];
        }
      } else if (propName === 'className') {
        parent.className = props[propName];
      } else {
        parent.setAttribute(propName, props[propName]);
      }
    }
  }

  /**
   * Creates an element or constructs a builder for creating an element
   * @constructor
   * @param type - {string | Element | Document} DOM item being manipulated
   * @param props - {object | string} Properties to set or string for TextNode
   * @param children - {Element | string | Element[] | string[]}
   *     Things to add as children
   * @param callback - {function} A function to call once the item is
   *     constructed
   **/
  function Compose(type, props, children, callback) {
    if (typeof this === 'undefined' || this === null) {
      var self = {};
    } else {
      var self = this;
    }
    self._element = null;
    self._callback = callback;

    if (type instanceof Element || type instanceof HTMLDocument) {
      self._element = type;
    } else if (typeof type === 'string') {
      type = type.toLowerCase().trim();
      if (type === '') {
        self._element = document.createTextNode(props);
      } else if (SVG_TYPES.indexOf(type) >= 0) {
        self._element = document.createElementNS("http://www.w3.org/2000/svg", type);
      } else {
        self._element = document.createElement(type);
      }
    } else {
      throw new Error('First argument must be a string or Element.');
    }

    _setProperties(self._element, props);
    _addChildren(self._element, children);

    if (typeof this === 'undefined' || this === null) {
      if (typeof self._callback === 'function') {
        self._callback(self._element);
      }
      return self._element;
    } else {
      return this;
    }
  };

  Compose.prototype.setProps = function (props) {
    _setProperties(this._element, props);
    return this;
  }

  Compose.prototype.addChildren = function (children) {
    _addChildren(this._element, children)
    return this;
  }

  Compose.prototype.asElement = function () {
    if (typeof this._callback === 'function') {
      this._callback(this._element);
    }
    return this._element;
  }

  exports.dfc = Compose;
});
