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
		this.getUserApiInfo()
		this.setData({
			version: app.globalData.version
		})
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
	},
	getPhoneNumber (e) {
		console.log(e)
		if (!e.detail.errMsg || e.detail.errMsg != 'getPhoneNumber:ok') {
			wx.showModal({
				title: '提示',
				content: '无法获取手机号码',
				showCancel: false
			})
			return
		}
		var that = this
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
			data: {
				token: app.globalData.token,
				encryptedData: e.detail.encryptedData,
				iv: e.detail.iv
			},
			success: res => {
				if (res.data.code == 0) {
					wx.showToast({
						title: '绑定成功',
						icon: 'success',
						duration: 2000,
						mask: true
					})
					that.getUserApiInfo()
				} else {
					wx.showModal({
						title: '提示',
						content: '绑定失败',
						showCancel: false
					})
				}
			}
		})
	},
	getUserApiInfo () {
		var that = this
		wx.request({
			url: 'https://api/it120.cc/' + app.globalData.subDomain + '/user/detail',
			data: {
				token: app.globalData.token
			},
			success: res => {
				if (res.data.code == 0) {
					that.setData({
						apiUserInfoMap: res.data.data,
						userMobile: res.data.data.base.mobile
					})
				}
			}
		})
	},
	aboutUs () {
		wx.showModal({
			title: '关于我们',
			content: '本系统基于开源小程序商城系统 https://github.com/itkasumy/mall-ksm 搭建,祝大家使用愉快',
			showCancel: false
		})
	},
	relogin () {
		var that = this
		wx.authorize({
			scope: 'scope.userInfo',
			success () {
				app.globalData.token = null
				app.login()
				wx.showModal({
					title: '提示',
					content: '重新登录成功',
					showCancel: false,
					success: res => {
						if (res.confirm) {
							that.onShow()
						}
					}
				})
			},
			fail (res) {
				wx.openSetting({})
			}
		})
	}
})