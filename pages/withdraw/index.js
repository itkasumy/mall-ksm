Page({
	data:{},
	bindCancel () {
		wx.navigateBack({})
	},
	bindSave (e) {
		const that = this
		let amount = e.detail.value.amount

		if (amount == '' || amount * 1 < 100) {
			wx.showModal({
				title: '错误',
				content: '请填写正确的提现金额',
				showCancel: false
			})
			return
		}
		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/withDraw/apply',
			data: {
				token: app.globalData.token,
				monet: amount
			},
			success: res => {
				if (res.data.code == 0) {
					wx.showModal({
						title: '成功',
						content: '您的提现申请已提交，等待财务打款',
						showCancel: false,
						success: res => {
							if (res.confirm) {
								that.bindCancel()
							}
						}
					})
				} else {
					wx.showModal({
						title: '错误',
						content: res.data.msg,
						showCancel: false
					})
				}
			}
		})
	}
})