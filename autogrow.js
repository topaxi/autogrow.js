// Author:  Damian Senn
// Website: https://github.com/topaxi/autogrow.js
// License: MIT
!function(window) { 'use strict';

var document = window.document
  , _slice   = Array.prototype.slice
  , autogrow = window.autogrow = function(el) {
    if (el.length !== void 0) _slice.call(el).forEach(autogrow)
    else return new Autogrow(el)
  }

function prev(el) {
  while (el = el.previousSibling) {
    if (el.nodeType != 3) return el
  }
}

function hide(el, s) {
  el.style.display = s ? 'none' : 'inline-block'
}

function getComputedStyle(el) {
  // FF < 4 needs a second parameter...
  return window.getComputedStyle(el, null)
}

function escapeHTML(s) {
  return s.replace(/&/g,  '&amp;')
          .replace(/</g,  '&lt;')
          .replace(/>/g,  '&gt;')
          .replace(/"/g,  '&quot;')
          .replace(/'/g,  '&#x27;')
          .replace(/\//g, '&#x2F;')
}

function nl2br(s) {
  return s.replace(/\n/g, '<br>')
}

function Autogrow(el) {
  this.el   = el
  this.grow = this.grow.bind(this)

  el.style.minHeight = el.rows + 'em'
  el.style.overflow  = 'hidden'

  el.addEventListener('keydown', this.grow, false)
  el.addEventListener('change',  this.grow, false)
  el.addEventListener('keyup',   this.grow, false)

  this.createDummy()
  this.grow()
}

Autogrow.prototype = {
    constructor: Autogrow
  , grow: function() {
    this.updateDummy()

    this.dummy.innerHTML = nl2br(escapeHTML(this.el.value)) + '<br><br>'

    hide(this.dummy, false)

    var height = getComputedStyle(this.dummy).getPropertyValue('height')
    this.el.style.height = height

    hide(this.dummy, true)

    if (this.onresize) this.onresize(parseInt(height, 10))
  }
  , createDummy: function() {
    if (!this.dummy) {
      this.dummy = prev(this.el)
      this.dummy = (this.dummy && this.dummy.classList.contains('autogrow-dummy'))
            ? this.dummy
            : this.el.parentNode.insertBefore( document.createElement('pre')
                                             , this.el
                                             )

      this.dummy.classList.add('autogrow-dummy')
    }
  }
  , updateDummy: function() {
    var dstyle = this.dummy.style
      , ostyle = getComputedStyle(this.el)

    dstyle.whiteSpace    = 'pre-wrap'
    dstyle.wordWrap      = ostyle.getPropertyValue('word-wrap') || 'break-word'
    dstyle.width         = ostyle.getPropertyValue('width')
    dstyle.padding       = ostyle.getPropertyValue('padding')
    dstyle.fontFamily    = ostyle.getPropertyValue('font-family')
    dstyle.fontSize      = ostyle.getPropertyValue('font-size')
    dstyle.lineHeight    = ostyle.getPropertyValue('line-height')
  }
  , destroy: function() {
    this.el.removeAttribute('style')
    this.el.removeEventListener('keydown', this.grow)
    this.el.removeEventListener('change',  this.grow)
    this.el.removeEventListener('keyup',   this.grow)

    if (this.dummy) this.dummy.parentNode.removeChild(this.dummy)

    this.el    = null
    this.dummy = null
  }
}

autogrow(document.querySelectorAll('[data-autogrow=true]'))

}(this)
