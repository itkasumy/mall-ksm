var app = getApp()

Page({
	data:{
		remind: '加载中',
		angle: 0,
		userInfo: {}
	},
	goToIndex () {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
	onLoad:function(options){
		var that = this
		wx.setNavigationBarTitle({
			title: wx.getStorageSync('mallName')
		})

		app.getUserInfo(userInfo => {
			that.setData({
				userInfo: userInfo
			})
		})
	},
	onReady:function(){
		var that = this
		setTimeout(() => {
			that.setData({
				remind: ''
			})
		}, 1000)

		wx.onAccelerometerChange(res => {
			var angle = -(res.x * 30).toFixed(1)
			if (angle > 14) {
				angle = 14
			} else if (angle <= -14) {
				angle = -14
			}

			if (that.data.angle != angle) {
				that.setData({
					angle: angle
				})
			}
		})
	}
})