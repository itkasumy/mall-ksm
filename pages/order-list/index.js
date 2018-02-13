const wxpay  = require('../../utils/pay.js')
const app = getApp()

Page({
	data:{
		statusType: ['待付款', '待发货', '待收货', '待评价', '已完成'],
		currentType: 0,
		tabClass: ['', '', '', '', '']
	},
	statusTap (e) {
		var curType = e.currentTarget.dataset.index
		this.data.currentType = curType
		this.setData({
			currentType: curType
		})
		this.onShow()
	},
	orderDetail (e) {
		var orderId = e.currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/order-details/index?id=' + orderId
		})
	},
	cancelOrderTap (e) {
		var that = this
		var orderId = e.currentTarget.dataset.id
		wx.showModal({
			title: '确定要取消该订单吗?',
			content: '',
			success: res => {
				if (res.confirm) {
					wx.showLoading()
					wx.request({
						url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/close',
						data: {
							token: app.globalData.token,
							orderId: orderId
						},
						success: res => {
							wx.hideLoading()
							if (res.data.code === 0) {
								that.onShow()
							}
						}
					})
				}
			}
		})
	},
	toPayTap: e => {
		var that = this
		var orderId = e.currentTarget.dataset.id
		var money = e.currentTarget.dataset.money
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
			data: {
				token: app.globalData.token
			},
			success: res => {
				if (res.data.code === 0) {
					money -= res.data.data.balance
					if (money <= 0) {
						wx.request({
							url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/pay',
							data: {
								token: app.globalData.token,
								orderId: orderId
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							method: 'POST',
							success: res2 => {
								wx.reLaunch({
									url: '/pages/order-list/index'
								})
							}
						})
					} else {
						wxpay.wxpay(app, money, orderId, '/pages/order-list/index')
					}
				} else {
					wx.showModal({
						title: '错误',
						content: '无法获取用户资金信息',
						showCancel: false
					})
				}
			}
		})
	},
	getOrderStatistics () {
		const that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/statistics',
			data: {
				token: app.globalData.token
			},
			success: res => {
				wx.hideLoading()
				if (res.data.code === 0) {
					var tabClass = that.data.tabClass
					if (res.data.data.count_id_no_pay > 0) {
						tabClass[0] = 'red-dot'
					} else {
						tabClass[0] = ''
					}
					if (res.data.data.count_id_no_transfer > 0) {
						tabClass[1] = 'red-dot'
					} else {
						tabClass[1] = ''
					}
					if (res.data.data.count_id_no_fonfirm > 0) {
						tabClass[2] = 'red-dot'
					} else {
						tabClass[2] = ''
					}
					if (res.data.data.count_id_no_reputation > 0) {
						tabClass[3] = 'red-dot'
					} else {
						tabClass[3] = ''
					}
					if (res.data.data.count_id_no_success > 0) {
						// tabClass[4] = 'red-dot'
					} else {
						// tabClass[4] = ''
					}
					
					that.setData({
						tabClass: tabClass
					})
				}
			}
		})
	},
	onShow: function(){
		wx.showLoading()
		const that = this
		const pastData = {
			token: app.globalData.token
		}
		postData.status = that.data.currentType
		this.getOrderStatistics()
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/list',
			data: postData,
			success: res => {
				wx.hideLoading()
				if (res.data.code === 0) {
					that.setData({
						orderList: res.data.data.orderList,
						logisticsMap: res.data.data.logisticsMap,
						goodsMap: res.data.data.goodsMap
					})
				} else {
					this.setData({
						orderList: null,
						logisticsMap: {},
						goodsMap: {}
					})
				}
			}
		})
	}
})