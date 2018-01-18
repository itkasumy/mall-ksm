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
		this.reputation(e.id)
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
	addShopCar () {
		if (this.data.goodsDetail.properties && !this.data.canSubmit) {
			if (!this.data.canSubmit) {
				wx.showModal({
					title: '提示',
					content: '请选择商品规格!',
					showCancel: false
				})
			}
			this.bindGuiGeTap()
			return
		}

		if (this.data.buyNumber < 1) {
			wx.showModal({
				title: '提示',
				content: '购买数量不能为0!',
				showCancel: false
			})
			return
		}

		var shopCarInfo = this.bulidShopCarInfo()

		this.setData({
			shopCarInfo: shopCarInfo,
			shopNum: shopCarInfo.shopNum
		})

		wx.setStorage({
			key: 'shopCarInfo',
			data: shopCarInfo
		})
		this.closePopupTap()

		wx.showToast({
			title: '加入购物车成功',
			icon: 'success',
			duration: 2000,
			mask: true
		})
	},
	buyNow () {
		if (this.data.goodsDetail.properties && !this.data.canSubmit) {
			if (!this.data.canSubmit) {
				wx.showModal({
					title: '提示',
					content: '请选择商品规格!',
					showCancel: false
				})
			}
			this.bindGuiGeTap()
			wx.showModal({
				title: '提示',
				content: '请先选择规格尺寸哦~',
				showCancel: false
			})
			return
		}

		if (this.data.buyNumber < 1) {
			wx.showModal({
				title: '提示',
				content: '购买数量不能为0!',
				showCancel: false
			})
			return
		}

		var buyNowInfo = this.buliduBuyNowInfo()
		wx.setStorage({
			key: 'buyNowInfo',
			data: buyNowInfo
		})
		this.closePopupTap()

		wx.navigateTo({
			url: '/pages/to-pay-order/index?orderType=buyNow'
		})
	},
	bulidShopCarInfo () {
		var shopCarMap = {}
		shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id
		shopCarMap.pic = this.data.goodsDetail.basicInfo.pic
		shopCarMap.name = this.data.goodsDetail.basicInfo.name
		shopCarMap.propertyChildIds = this.data.propertyChildIds
		shopCarMap.label = this.data.propertyChildNames
		shopCarMap.price = this.data.selectSizePrice
		shopCarMap.left = ''
		shopCarMap.active = true
		shopCarMap.number = this.data.buyNumber
		shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId
		shopCarMap.logistics = this.data.goodsDetail.logistics
		shopCarMap.weight = this.data.goodsDetail.basicInfo.weight

		var shopCarInfo = this.data.shopCarInfo
		if (!shopCarInfo.shopNum) {
			shopCarInfo.shopNum = 0
		}
		if (!shopCarInfo.shopList) {
			shopCarInfo.shopList = []
		}
		var hasSameGoodsIndex = -1
		for (let i = 0; i < shopCarInfo.shopList.length; i++) {
			let tmpShopCarMap = shopCarInfo.shopList[i]
			if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
				hasSameGoodsIndex = i
				shopCarMap.number += tmpShopCarMap.number
				break
			}			
		}

		shopCarInfo.shopNum += this.data.buyNumber
		if (hasSameGoodsIndex > -1) {
			shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap)
		} else {
			shopCarInfo.shopList.push(shopCarMap)
		}
		return shopCarInfo
	},
	buliduBuyNowInfo () {
		var shopCarMap = {}
		shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id
		shopCarMap.pic = this.data.goodsDetail.basicInfo.pic
		shopCarMap.name = this.data.goodsDetail.basicInfo.name
		shopCarMap.propertyChildIds = this.data.propertyChildIds
		shopCarMap.label = this.data.propertyChildNames
		shopCarMap.price = this.data.selectSizePrice
		shopCarMap.left = ''
		shopCarMap.active = true
		shopCarMap.number = this.data.buyNumber
		shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId
		shopCarMap.logistics = this.data.goodsDetail.logistics
		shopCarMap.weight = this.data.goodsDetail.basicInfo.weight

		var buyNowInfo = {}
		if (!buyNowInfo.shopNum) {
			buyNowInfo.shopNum = 0
		}
		if (!buyNowInfo.shopList) {
			buyNowInfo.shopList = []
		}
		buyNowInfo.shopList.push(shopCarMap)
		return buyNowInfo
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