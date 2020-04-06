const { is_dev } = require('/config.js')
const av = require('/static/js/av.js')
const util = require('/static/js/util.js')

App({
  is_dev: is_dev,
  av: av,
  util: util,
  showLoading() {},
  showToast() {},
})