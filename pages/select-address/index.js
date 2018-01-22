var app = getApp()

Page({
	data:{
		addressList: []
	},
	onShow:function(){
		this.initShippingAddress()
	},
	initShippingAddress () {
		var that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/list',
			data: {
				token: app.globalData.token
			},
			success: res => {
				if (res.data.code == 0) {
					that.setData({
						addressList: res.data.data
					})
				} else if (res.data.code == 700) {
					that.setData({
						addressList: null
					})
				}
			}
		})
	},
	selectTap (e) {
		var id = e.currentTarget.dataset.id
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/update',
			data: {
				token: app.globalData.token,
				id: id,
				isDefault: true
			},
			success: res => {
				wx.navigateBack({})
			}
		})
	},
	addAddress () {
		wx.navigateTo({
			url: '/pages/address-add/index'
		})
	},
	editAddress (e) {
		wx.navigateTo({
			url: '/pages/address-add/index?id=' + e.currentTarget.dataset.id
		})
	}
})