<script>
var CONFIRM_TEXT = '确定';
var CANCEL_TEXT = '取消';

import Popup from 'vue-popup';

export default {
  mixins: [ Popup ],

  props: {
    modal: {
      default: true
    },
    closeOnPressEscape: {
      default: true
    }
  },

  ready() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      let value = (viewport.content.match(/initial-scale=(\d?\.?\d+)/) || [])[1];
      this.viewportZoom = (1 / value).toFixed(2);
    }
  },

  computed: {
    confirmButtonClasses() {
      var classes = `msgbox-btn msgbox-confirm ${this.confirmButtonClass}`;
      if (this.confirmButtonHighlight) {
        classes += ' msgbox-confirm-highlight';
      }
      return classes;
    },
    cancelButtonClasses() {
      var classes = `msgbox-btn msgbox-cancel ${this.cancelButtonClass}`;
      if (this.cancelButtonHighlight) {
        classes += ' msgbox-cancel-highlight';
      }
      return classes;
    },
    showCancelButton() {
      return this.cancelButtonText !== CANCEL_TEXT;
    }
  },

  methods: {
    handleAction(action) {
      if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
        return;
      }
      var callback = this.callback;
      this.visible = false;
      callback(action);
    },

    validate() {
      if (this.$type === 'prompt') {
        var inputPattern = this.inputPattern;
        if (inputPattern && !inputPattern.test(this.inputValue || '')) {
          this.editorErrorMessage = this.inputErrorMessage || '输入的数据不合法!';
          return false;
        }
        var inputValidator = this.inputValidator;
        if (typeof inputValidator === 'function') {
          var validateResult = inputValidator(this.inputValue);
          if (validateResult === false) {
            this.editorErrorMessage = this.inputErrorMessage || '输入的数据不合法!';
            return false;
          }
          if (typeof validateResult === 'string') {
            this.editorErrorMessage = validateResult;
            return false;
          }
        }
      }
      this.editorErrorMessage = '';
      return true;
    }
  },

  watch: {
    inputValue() {
      if (this.$type === 'prompt') {
        this.validate();
      }
    }
  },

  data() {
    return {
      title: '',
      message: '',
      type: '',
      showInput: false,
      showCloseButton: false,
      inputValue: null,
      inputPlaceholder: '',
      inputPattern: null,
      inputValidator: null,
      inputErrorMessage: '',
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonText: CONFIRM_TEXT,
      cancelButtonText: CANCEL_TEXT,
      confirmButtonPosition: 'right',
      confirmButtonHighlight: false,
      confirmButtonClass: '',
      confirmButtonDisabled: false,
      cancelButtonClass: '',
      cancelButtonHighlight: false,

      editorErrorMessage: null,
      callback: null,

      viewportZoom: 1
    };
  }
};
</script>

<template>
<div class="msgbox-wrapper">
  <div class="msgbox"
       v-if="rendered"
       v-show="visible"
       transition="pop-bounce"
       :style="{zoom: viewportZoom}">
    <!-- close button -->
    <span
      v-if="showCloseButton"
      class="msgbox-close"
      @click="handleAction('close')">&times;</span>

    <div
      class="msgbox-header"
      v-if="title"
      v-html="title"
      :class="{collapseheight: title && message}"></div>

    <div class="msgbox-content" v-if="message" :class="{collapseheight: title && message}">
      <div class="msgbox-message" v-html="message"></div>
      <div class="msgbox-input" v-show="showInput">
        <input type="text" v-model="inputValue" :placeholder="inputPlaceholder">
        <div
          class="msgbox-errormsg"
          :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }">{{editorErrorMessage}}</div>
      </div>
    </div>

    <div class="msgbox-btns"
         :class="{ 'msgbox-btns-reverse': confirmButtonPosition === 'left' }">
      <button
        class="{{ cancelButtonClasses }}"
        v-show="showCancelButton"
        @click="handleAction('cancel')">{{ cancelButtonText }}</button>

      <button class="{{ confirmButtonClasses }}"
        v-show="showConfirmButton"
        @click="handleAction('confirm')">{{ confirmButtonText }}</button>
    </div>
  </div>
</div>
</template>

<style src="./msgbox.css"></style>
<style src="vue-popup/lib/popup.css"></style>
