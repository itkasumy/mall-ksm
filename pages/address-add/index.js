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
	bindSave (e) {
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
	initCityData (level, obj) {
		if (level == 1) {
			var pinkArray = []
			for (let i = 0; i < commonCityData.cityData.length; i++) {
				pinkArray.push(commonCityData.cityData[i].name)
			}
			this.setData({
				provinces: pinkArray
			})
		} else if (level == 2) {
			var pinkArray = []
			var dataArray = obj.cityList
			for ( let i = 0; i < dataArray.length; i++) {
				pinkArray.push(dataArray[i].name)
			}
			this.setData({
				citys: pinkArray
			})
		} else if (level == 3) {
			var pinkArray = []
			var dataArray = obj.districtList
			for (let i = 0; i < dataArray.length; i++) {
				pinkArray.push(dataArray[i].name)
			}
			this.setData({
				districts: pinkArray
			})
		}
	},
	bindPickerProvinceChange (e) {
		var selItem = commonCityData.cityData[e.detail.value]
		this.setData({
			selProvince: selItem.name,
			selProvinceIndex: e.detail.value,
			selCity: '请选择',
			selCityIndex: 0,
			selDistrict: '请选择',
			selDistrictIndex: 0
		})
		this.initCityData(2, selItem)
	},
	bindPickerChange (e) {
		var selItem = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[e.detail.value]
		if (selItem && selItem.name && e.detail.value) {
			this.setData({
				selDistrict: selItem.name,
				selDistrictIndex: e.detail.value
			})
		}
	},
	onLoad:function(e){
		var that = this
		this.initCityData(1)
		var id = e.id
		if (id) {
			wx.showLoading()
			wx.request({
				url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/detail',
				data: {
					token: app.globalData.token,
					id: id
				},
				success: res => {
					wx.hideLoading()
					if (res.data.code == 0) {
						that.setData({
							id: id,
							addressData: res.data.data,
							selProvince: res.data.data.provinceStr,
							selCity: res.data.data.cityStr,
							selDistrict: res.data.data.areaStr
						})
						that.setDBSaveAddressId(res.data.data)
						return
					} else {
						wx.showModal({
							title: '提示',
							content: '无法获取快递地址数据',
							showCancel: false
						})
					}
				}
			})
		}
	},
	setDBSaveAddressId (data) {
		var retSelIdx = 0
		for (let i = 0; i < commonCityData.cityData.length; i++) {
			if (data.provinceId == commonCityData.cityData[i].id) {
				this.data.selProvinceIndex = i
				for (let j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
					if (data.cityId == commonCityData.cityData[i].cityList[j].id) {
						this.data.selCityIndex = j
						for (let k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
							if (data.districtId == commonCityData.cityData[i].cityList[j].districtList[k].id) {
								this.data.selDistrictIndex = k
							}
						}
					}
				}
			}
		}
	},
	selectCity () {},
	deleteAddress (e) {
		var that = this
		var id = e.currentTarget.dataset.id
		wx.showModal({
			title: '提示',
			content: '确定要删除该收获地址吗？',
			success: res => {
				if (res.confirm) {
					wx.request({
						url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/delete',
						data: {
							token: app.globalData.token,
							id: id
						},
						success: res => {
							wx.navigateBack({})
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	readFromWx () {
		let that = this
		wx.chooseAddress({
			success: res => {
				let provinceName = res.provinceName
				let cityName = res.cityName
				let districtName = res.countyName
				let retSelIdx = 0
				for (let i = 0; i < commonCityData.cityData.length; i++) {
					if (provinceName == commonCityData.cityData[i].name) {
						that.data.selProvinceIndex = i
						for (let j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
							if (cityName == commonCityData.cityData[i].cityList[j].id) {
								that.data.selCityIndex = j
								for (let k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
									if (districtName == commonCityData.cityData[i].cityList[j].districtList[k].id) {
										that.data.selDistrictIndex = k
									}
								}
							}
						}
					}
				}

				that.setData({
					wxaddress: res,
					selProvince: provinceName,
					selCity: cityName,
					selDistrict: districtName
				})
			}
		})
	}
})