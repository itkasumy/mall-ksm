const app = getApp()

Page({
	data:{
		coupons: []
	},
	onShow:function(){
		this.getMyCoupons()
	},
	getMyCoupons () {
		const that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/my',
			data: {
				token: app.globalData.token,
				status: 0
			},
			success: res => {
				if (res.data.code == 0) {
					const coupons = res.data.data
					if (coupons.length > 0) {
						that.setData({
							coupons: coupons
						})
					}
				}
			}
		})
	},
	goBuy () {
		wx.reLaunch({
			url: '/pages/index/index'
		})
	}
})