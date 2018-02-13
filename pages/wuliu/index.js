const app = getApp()

Page({
	data:{},
	onLoad: function(e){
		this.data.orderId = e.orderId
	},
	onShow: function(){
		const that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/detail',
			data: {
				token: app.globalData.token,
				id: that.data.orderId
			},
			success: res => {
				wx.hideLoading()
				if (res.data.code != 0) {
					wx.showModal({
						title: '错误',
						content: res.data.msg,
						showCancel: false
					})
					return
				}
				that.setData({
					orderDetail: res.data.data,
					logisticsTraces: res.data.data.logisticsTraces.reverse()
				})
			}
		})
	}
})