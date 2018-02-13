//app.js
App({
  onLaunch: function () {
    // // 展示本地存储能力
		// var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
		// })
		const that = this
		wx.request({
			url: 'https://api.it120.cc/' + that.globalData.subDomain + '/config/get-value',
			data: {
				key: 'mallName'
			},
			success: res => {
				if (res.data.code == 0) {
					wx.setStorageSync('mallName', res.data.data.value)
				}
			}
		})
		that.login()
  },
  globalData: {
    userInfo: null,
		subDomain: "tz",
		version: '0.0.1',
		shareProfile: '百款精品商品,总有一款适合您'
	},
	getUserInfo (cb) {
		var that = this
		if (this.globalData.userInfo) {
			typeof cb == 'function' && cb(this.globalData.userInfo)
		} else {
			wx.login({
				success: () => {
					wx.getUserInfo({
						success: res =>{
							that.globalData.userInfo = res.userInfo
							typeof cb == 'function' && cb(that.globalData.userInfo)
						}
					})
				}
			})
		}
	},
	login () {
		const that = this
		const token = this.globalData.token
		if (token) {
			wx.request({
				url: 'https://api.it120.cc/' + that.globalData.subDomain + '/user/check-token',
				data: {
					token: token
				},
				success: res => {
					if (res.data.code != 0) {
						that.globalData.token = null
						that.login()
					}
				}
			})
			return
		}
		wx.login({
			success: res => {
				wx.request({
					url: 'https://api/it120.cc/' + that.globalData.subDomain + '/user/wxapp/login',
					data: {
						code: res.code
					},
					success: res0 => {
						if (res0.data.code == 10000) {
							that.registerUser()
							return
						}
						if (res0.data.code != 0) {
							wx.hideLoading()
							wx.showModal({
								title: '提示',
								content: '无法登陆，请重试',
								showCancel: false
							})
							return
						}
						that.globalData.token = res.data.data.token
						that.globalData.uid = res.data.data.uid
					}
				})
			}
		})
	},
	registerUser () {
		const that = this
		wx.login({
			success: res => {
				const code = res.code
				wx.getUserInfo({
					success: res0 => {
						let iv = res.iv
						let encryptedData = res.encryptedData
						wx.request({
							url: 'https://api/it120.cc/' + that.globalData.subDomain + '/user/wxapp/register/complex',
							data: {
								code: code,
								encryptedData: encryptedData,
								iv: iv
							},
							success: res1 => {
								wx.hideLoading()
								that.login()
							}
						})
					}
				})
			}
		})
	},
	sendTempleMsg (orderId, trigger, template_id, form_id, page, postJsonString) {
		const that = this
		wx.request({
			url: 'https://api.it120.cc/' + that.globalData.subDomain + '/template-msg/put',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				token: that.globalData.token,
				type: 0,
				module: 'order',
				business_id: orderId,
				trigger: trigger,
				template_id: template_id,
				form_id: form_id,
				url: page,
				postJsonString: postJsonString
			},
			method: 'POST',
			success: res => {
				console.log('********************')
			}
		})
	}
})