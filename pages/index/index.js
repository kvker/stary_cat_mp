const app = getApp()

Page({
  data: {
    list: [],
  },
  // lifetimes
  onLoad(options) {
    this.refresh()
  },
  onPullDownRefresh() {
    this.refresh()
  },
  onReachBottom() {
    this.page += 1
    this.setData({
      page: this.data.page + 1,
    })
    this.getList()
  },
  onShareAppMessage() {
    return {
      title: '来撸猫吧~',
    }
  },
  // methods
  /**
   * 获取列表数据
   */
  async getList(page = this.data.page) {
    let list = this.format(await app.av.read('Cat', q => {
      q.limit(10)
      q.skip(page * 10)
      q.descending('createdAt')
    }))
    wx.stopPullDownRefresh()
    wx.hideToast()
    this.setData({
      list: [...this.data.list, ...list],
    })
    // console.log(this.data.list)
  },
  format(list) {
    return list.map(i => {
      let json = i.toJSON()
      json.id = json.sex ? (json.sex === 1 ? 'M' + json.id : 'G' + json.id) : 'X' + json.id
      json.quchong_outer_label = json.quchong_outer ? app.util.formatDate(json.quchong_outer, 'YY/MM/DD') :
        '未驱虫'
      json.quchong_inner_label = json.quchong_inner ? app.util.formatDate(json.quchong_inner, 'YY/MM/DD') :
        '未驱虫'
      json.lingyang_label = app.util.getLingyangLevelLabel(json.lingyang_level)
      json.jueyu_label = json.jueyu_status ? (json.jueyu_status === 1 ? '已绝育' : '未知') : '未绝育'
      return json
    })
  },
  /**
   * 刷新列表
   */
  refresh() {
    app.showToast('列表拉取...')
    this.setData({
      page: 0,
      list: [],
    })
    this.getList()
  },
})