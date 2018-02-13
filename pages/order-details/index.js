const app = getApp()

Page({
	data:{
		orderId: 0,
		goodsList: [
			{
				pic: '/images/goods02.png',
				name: '爱马仕(HERMES)大地男士最多两行文字，超出就这样显...',
				price: '300.00',
				label: '大地50ml',
				number: 2
			},
			{
				pic: '/images/goods02.png',
				name: '爱马仕(HERMES)大地男士最多两行文字，超出就这样显...',
				price: '300.00',
				label: '大地50ml',
				number: 2
			}
		],
		yunPrice: '10.00'
	},
	onLoad:function(e){
		this.data.orderId = e.id
		this.setData({
			orderId: e.id
		})
	},
	onShow:function(){
		const that = this
		wx.request({
			url: 'https://api/it120.cc/' + app.globalData.subDomain + '/order/detail',
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
					orderDetail: res.data.data
				})
			}
		})
		let yunPrice = parseFloat(this.data.yunPrice)
		let allprice = 0
		this.data.goodsList.forEach(item => {
			allprice += parseFloat(item.price) * item.number
		})
		this.setData({
			allGoodsPrice: allprice,
			yunPrice: yunPrice
		})
	},
	wuliuDetailsTap (e) {
		let orderId = e.currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/wuliu/index?id=' + orderId
		})
	},
	confirmBtnTap (e) {
		let that = this
		let orderId = e.currentTarget.dataset.id
		wx.showModal({
			title: '确认您已收到商品?',
			content: '',
			success: res => {
				if (res.confirm) {
					wx.showLoading()
					wx.request({
						url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/delivery',
						data: {
							token: app.globalData.token,
							orderId: orderId
						},
						success: res => {
							if (res.data.code == 0) {
								that.show()
							}
						}
					})
				}
			}
		})
	},
	submitReputation (e) {
		const that = this
		const postJsonString = {}
		postJsonString.token = app.globalData.token
		postJsonString.orderId = this.data.orderId
		const reputations = []
		let i = 0
		while (e.detail.value['orderGoodsId' + i]) {
			let orderGoodsId = e.detail.value['orderGoodsId' + i]
			let goodsReputation = e.detail.value['goodReputation' + i]
			let goodsReputationRemark = e.detail.value['goodReputationRemark' + i]

			const reputations_json = {}
			reputations_json.id = orderGoodsId
			reputations_json.reputation = goodsReputation
			reputations_json.remark = goodsReputationRemark

			reputations.push(reputations_json)
			i++
		}
		postJsonString.reputations = reputations
		wx.showLoading()
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/reputation',
			data: {
				postJsonString: postJsonString
			},
			success: res => {
				wx.hideLoading()
				if (res.data.code == 0) {
					that.onShow()
				}
			}
		})
	}
})