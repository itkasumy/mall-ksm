var app = getApp()
Page({
  data: {
		balance: 0,
		freeze: 0,
		score: 0,
		score_sign_continuous: 0
  },
  onShow: function () {
		this.getUserInfo()
		this.getUserAmount()
		this.checkScoreSign()
	},
	getUserInfo (cb) {
		var that = this
		wx.login({
			success: () => {
				wx.getUserInfo({
					success: res => {
						that.setData({
							userInfo: res.userInfo
						})
					}
				})
			}
		})
	},
	recharge () {
		wx.navigateTo({
			url: '/pages/recharge/index'
		})
	},
	withdraw () {
		wx.navigateTo({
			url: '/pages/withdraw/index'
		})
	},
	scoresign () {
		var that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/sign',
			data: {
				token: app.globalData.token
			},
			success: res => {
				if (res.data.code == 0) {
					that.getUserAmount()
					that.checkScoreSign()
				} else {
					wx.showModal({
						title: '错误',
						content: res.data.msg,
						showCancel: false
					})
				}
			}
		})
	},
	getUserAmount () {
		var that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
			data: {
				token: app.globalData.token
			},
			success: res => {
				if (res.data.code == 0) {
					that.setData({
						balance: res.data.data.balance,
						freeze: res.data.data.freeze,
						score: res.data.data.score
					})
				}
			}
		})
	},
	checkScoreSign () {
		var that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/today-signed',
			data: {
				token: app.globalData.token
			},
			success: res => {
				if (res.data.code == 0) {
					that.setData({
						score_sign_continuous: res.data.data.continuous
					})
				}
			}
		})
	}
})