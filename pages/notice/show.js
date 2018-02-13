const app = getApp()
const WxParse = require('../../wxParse/wxParse')

Page({
	data:{},
	onLoad: function (opt){
		const that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/detail',
			data: {
				id: opt.id
			},
			success: res => {
				if (res.data.code == 0) {
					that.setData({
						notice: res.data.data
					})
					WxParse.wxParse('article', 'html', res.data.data.content, that, 5)
				}
			}
		})
	}
})