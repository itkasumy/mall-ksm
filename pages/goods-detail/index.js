var app = getApp()
var WxParse = require('../../wxParse/wxParse.js')

Page({
	data: {
		autoplay: true,
		interval: 3000,
		duration: 1000,
		goodsDetail: {},
		swiperCurrent: 0,
		hasMoreSelect: false,
		selectSize: '选择:',
		selectSizePrice: 0,
		shopNum: 0,
		hideShopPopup: true,
		buyNumber: 0,
		buyNumMin: 1,
		buyNumMax: 0,
		propertyChildIds: "",
		propertyChildNames: "",
		canSubmit: false,
		shopCarInfo: {},
		shopType: "addShopCar"
	},
	onLoad: function(e){
		// 生命周期函数--监听页面加载
		var that = this

		if (e.inviter_id) {
			wx.setStorage({
				key: 'inviter_id_' + e.id,
				data: e.inviter_id
			})
		}

		wx.getStorage({
			key: 'shopCarInfo',
			success: res => {
				that.setData({
					shopCarInfo: res.data,
					shopNum: res.data.shopNum
				})
			}
		})

		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/detail',
			data: {
				id: e.id
			},
			success: res => {
				// console.log(res)
				var selectSizeTemp = ""
				if (res.data.data.properties) {
					for (let i = 0; i < res.data.data.properties.length; i++) {
						selectSizeTemp += " " + res.data.data.properties[i].name
					}
					that.setData({
						hasMoreSelect: true,
						selectSize: that.data.selectSize + selectSizeTemp,
						selectSizePrice: res.data.data.basicInfo.minPrice
					})
				}
				that.data.goodsDetail = res.data.data
				if (res.data.data.basicInfo.videoId) {
					// that.getVideoSrc(res.data.data.basicInfo.videoId)
				}
				that.setData({
					goodsDetail: res.data.data,
					selectSizePrice: res.data.data.basicInfo.minPrice,
					buyNumMax: res.data.data.basicInfo.stores,
					buyNumber: res.data.data.basicInfo.stores > 0 ? 1 : 0
				})
				WxParse.wxParse('article', 'html', res.data.data.content, that, 5)
			}
		})
		// this.reputation(e.id)
	},
	onReady:function(){
		// 生命周期函数--监听页面初次渲染完成
	},
	onShow:function(){
		// 生命周期函数--监听页面显示
	},
	onHide:function(){
		// 生命周期函数--监听页面隐藏
	},
	onUnload:function(){
		// 生命周期函数--监听页面卸载
	},
	swiperchange (e) {
		// console.log(e)
		this.setData({
			swiperCurrent: e.detail.current
		})
	},
	goShopCar () {
		wx.reLaunch({
			url: '/pages/shop-cart/index'
		})
	},
	toAddShopCar () {
		this.setData({
			shopType: 'addShopCar'
		})
		this.bindGuiGeTap()
	},
	tobuy () {
		this.setData({
			shopType: 'tobuy'
		})
		this.bindGuiGeTap()
	},
	bindGuiGeTap () {
		this.setData({
			hideShopPopup: false
		})
	},
	closePopupTap () {
		this.setData({
			hideShopPopup: true
		})
	},
	numJianTap () {
		if (this.data.buyNumber > this.data.buyNumMin) {
			var currentNum = this.data.buyNumber
			currentNum--
			this.setData({
				buyNumber: currentNum
			})
		}
	},
	numJiaTap () {
		if (this.data.buyNumber < this.data.buyNumMax) {
			var currentNum = this.data.buyNumber
			currentNum++
			this.setData({
				buyNumber: currentNum
			})
		}
	},
	labelItemTap (e) {
		var that = this
	},
	reputation (goodsId) {
		var that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/reputation',
			data: {
				goodsId: goodsId
			},
			success: res => {
				if (res.data.code == 0) {
					that.setData({
						reputation: res.data.data
					})
				}
			}
		})
	},
	getVidooSrc (videoId) {
		var that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/media/video/detail',
			data: {
				videoId: videoId
			},
			success: res => {
				if (res.data.code == 0) {
					videoMp4Src: res.data.data.fdMp4
				}
			}
		})
	},
	onShareAppMessage: function() {
		return {
			title: this.data.goodsDetail.basicInfo.name,
			path: '/pages/goods-detail/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + app.globalData.uid,
			success: res => {},
			fail: res => {}
		}
	}
})