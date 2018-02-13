const wxpay = require('../../utils/pay')
const app = getApp()

Page({
	data:{},
	bindCancel () {
		wx.navigateBack({})
	},
	bindSave (e) {
		const that = this
		let amount = e.details.value.amount

		if (amount == '' || amount * 1 < 0) {
			wx.showModal({
				title: '错误',
				content: '请填写正确的充值金额',
				showCancel: false
			})
			return
		}
		wxpay.wxpay(app, amount, 0, '/pages/my/index')
	}
})