const wxpay = (app, money, orderId, redirectUrl) => {
	let remark = '在线充值'
	let mextAction = {}
	if (orderId !== 0) {
		remark = '支付订单:' + orderId
		nextAction = {
			type: 0,
			id: orderId
		}
	}
	wx.request({
		url: 'https://api.it120.cc/' + app.globalData.subDomain + '/pay/wxapp/get-pay-data',
		data: {
			token: app.globalData.token,
			money: money,
			remark: remark,
			payName: '在线支付',
			nextAction: nextAction
		},
		success: res => {
			if (res.data.code === 0) {
				wx.requestPayment({
					timeStamp: res.data.data.timeStamp,
					nonceStr: res.data.data.nonceStr,
					package: 'prepay_id=' + res.data.data.prepayId,
					signType: 'MD5',
					paySign: res.data.data.sign,
					fail: fal => {
						wx.showToast({
							title: '支付失败' + fal
						})
					},
					success: () => {
						wx.showToast({
							title: '支付成功'
						})
						wx.reLaunch({
							url: redirectUrl
						})
					}
				})
			} else {
				wx.showToast({
					title: '服务器忙' + res.data.code + res.data.msg
				})
			}
		}
	})
}

module.exports = {
	wxpay: wxpay
}
