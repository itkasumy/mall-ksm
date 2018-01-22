const commonCityData = require('../../utils/city.js')

var app = getApp()

Page({
	data:{
		provinces: [],
		citys: [],
		districts: [],
		selProvince: '请选择',
		selCity: '请选择',
		selDistrict: '请选择',
		selProvinceIndex: 0,
		selCityIndex: 0,
		selDistrictIndex: 0
	},
	bindCancel () {
		wx.navigateBack({})
	},
	bindSave () {
		var that = this
		var linkMan = e.detail.value.linkMan
		var address = e.detail.value.address
		var mobile = e.detail.value.mobile
		var code = e.detail.value.code

		if (linkMan == '') {
			wx.showModal({
				title: '提示',
				content: '请填写联系人姓名',
				showCancel: false
			})
			return
		}
		if (mobile == '') {
			wx.showModal({
				title: '提示',
				content: '请填写手机号码',
				showCancel: false
			})
			return
		}
		if (this.data.selProvince == '请选择') {
			wx.showModal({
				title: '提示',
				content: '请选择地区',
				showCancel: false
			})
			return
		}
		if (this.data.selCity == '请选择') {
			wx.showModal({
				title: '提示',
				content: '请选择地区',
				showCancel: false
			})
			return
		}

		var cityId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id
		var districtId
		if (this.data.selDistrict == '请选择' || !this.data.selDistrict) {
			districtId = ''
		} else {
			districtId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id
		}

		if (address == '') {
			wx.showModal({
				title: '提示',
				content: '请填写详细地址',
				showCancel: false
			})
			return
		}
		if (code == '') {
			wx.showModal({
				title: '提示',
				content: '请填写邮编',
				showCancel: false
			})
			return
		}

		var apiAddoRuPDATE = 'add'
		var apiAddid = that.data.id
		if (apiAddid) {
			apiAddoRuPDATE = 'update'
		} else {
			apiAddid = 0
		}

		wx.request({
			url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address' + apiAddid,
			data: {
				token: app.globalData.token,
				id: apiAddid,
				provinceId: commonCityData.cityData[this.data.selProvinceIndex].id,
				cityId: cityId,
				districtId: districtId,
				linkMan: linkMan,
				address: address,
				mobile: mobile,
				code: code,
				isDefault: true
			},
			success: res => {
				if (res.data.code != 0) {
					wx.hideLoading()
					wx.showModal({
						title: '失败',
						content: res.data.msg,
						showCancel: false
					})
					return
				}
				wx.navigateBack({})
			}
		})
	},
	onLoad:function(options){
		// 生命周期函数--监听页面加载
	},
	onReady:function(){
		// 生命周期函数--监听页面初次渲染完成
	},
	onShow:function(){
		// 生命周期函数--监听页面显示
	},
	onHide:function(){
		// 生命周期函数--监听页面隐藏
	},
	onUnload:function(){
		// 生命周期函数--监听页面卸载
	},
	onPullDownRefresh: function() {
		// 页面相关事件处理函数--监听用户下拉动作
	},
	onReachBottom: function() {
		// 页面上拉触底事件的处理函数
	},
	onShareAppMessage: function() {
		// 用户点击右上角分享
		return {
			title: 'title', // 分享标题
			desc: 'desc', // 分享描述
			path: 'path' // 分享路径
		}
	}
})