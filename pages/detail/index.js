const app = getApp()

Page({
  data: {
    objectId: '',
    detail: {},
    age_list: ['未知', '0-3个月', '3-6个月', '6-12个月', ...Array.from({
      length: 17
    }, (i, idx) => idx).map(i => `${i + 1}-${i + 2}岁`)],
  },

  onLoad(options) {
    this.setData({
      objectId: options.objectId,
    })
  },

  onShow() {
    this.getDetail(this.objectId)
  },

  onShareAppMessage() {
    return {
      title: '花名: ' + this.data.detail.name,
      imageUrl: this.data.detail.imgs[0],
    }
  },

  // methods
  async getDetail(objectId = this.data.objectId) {
    let list = await app.av.read('Cat', q => {
      q.equalTo('objectId', objectId)
    })
    // console.log(list[0])
    this.setData({
      detail: this.formatDetail(list[0])
    })
    wx.setNavigationBarTitle({
      title: `${this.data.detail.name}的档案`,
    })
  },
  formatDetail(detail) {
    let json = detail.toJSON()
    json.age_label = this.data.age_list[json.age]
    json.sex_label = json.sex ? (json.sex === 1 ? '母' : '公') : '未知'
    json.id = json.sex ? (json.sex === 1 ? 'M' + json.id : 'G' + json.id) : 'X' + json.id
    json.quchong_outer_label = json.quchong_outer ? app.util.formatDate(json.quchong_outer, 'YY/MM/DD') : '未驱虫'
    json.quchong_inner_label = json.quchong_inner ? app.util.formatDate(json.quchong_inner, 'YY/MM/DD') : '未驱虫'
    json.category_label = app.util.getCategoryLabel(json.category)
    json.lingyang_label = app.util.getLingyangLevelLabel(json.lingyang_level)
    json.jueyu_label = json.jueyu_status ? (json.jueyu_status === 1 ? '已绝育' : '未知') : '未绝育'
    json.waiguan = json.waiguan || '暂时为空'
    json.xingge = json.xingge || '暂时为空'
    json.imgs = [json.cover_img, ...json.imgs]
    return json
  },
  previewImg(e) {
    const {
      url,
      idx
    } = e.currentTarget.dataset
    wx.previewImage({
      current: url,
      urls: this.data.detail.imgs,
    })
  },
})