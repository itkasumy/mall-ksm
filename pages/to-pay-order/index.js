var app = getApp()

Page({
	data:{
		goodsList: [],
		isNeedLogistics: 0,
		allGoodsPrice: 0,
		yunPrice: 0,
		allGoodsAndYunPrice: 0,
		goodsJsonStr: '',
		orderType: '',
		hasNoCoupons: true,
		coupons: [],
		youhuijine: 0,
		curCoupons: null
	},
	onLoad:function(e){
		this.setData({
			isNeedLogistics: 1,
			orderType: e.orderType
		})
	},
	onShow:function(){
		var shopList = []
		if (this.data.orderType == 'buyNow') {
			var buyNowInfoMem = wx.getStorageSync('buyNowInfo')
			if (buyNowInfoMem && buyNowInfoMem.shopList) {
				shopList = buyNowInfoMem.shopList
			}
		} else {
			var shopCarInfoMen = wx.getStorageSync('shopCarInfo')
			if (shopCarInfoMen && shopCarInfoMen.shopList) {
				shopList = shopCarInfoMen.shopList.filter(entity => {
					return entity.active
				})
			}
		}
		this.setData({
			goodsList: shopList
		})
		this.initShippingAddress()
	},
	addAddress () {
		wx.navigateTo({
			url: '/pages/address-add/index'
		})
	},
	selectAddress () {
		wx.navigateTo({
			url: '/pages/select-address/index'
		})
	},
	initShippingAddress () {
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/default',
			data: {
				token: app.globalData.token
			},
			success: res => {
				if (res.data.code == 0) {
					that.setData({
						curAddressData: res.data.data
					})
				} else {
					that.setData({
						curAddressData: null
					})
				}
				// that.processYunfei()
			}
		})
	}
})