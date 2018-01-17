const app = getApp();
// pages/shop-cart/index.js
Page({
  data: {
    goodsList: {
      saveHidden: true,
      totalPrice: 0,
      allSelect: true,
      noSelect: false,
      list: []
    },
    delBtnWidth: 120
	},
	initEleWidth () {
		var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
		this.setData({
			delBtnWidth: delBtnWidth
		})
	},
	getEleWidth () {
		var real = 0;
		try {
			var res = wx.getSystemInfoSync().windowWidth;
			var scale = (750 / 2) / (w / 2);
			return real = Math.floor(res / scale);
		} catch (e) {
			return false;
		}
	},
	onShow () {
		var shopList = [];
		var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
		if (shopCarInfoMem && shopCarInfoMem.shopList) {
			shopList = shopCarInfoMem.shopList;
		}
		this.data.goodsList.list = shopList;
		this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), shopList);
	},
  onLoad: function (options) {
		this.initEleWidth();
		this.onShow();
	},
	toIndexPage () {
		wx.switchTab({
			url: '/pages/index/index'
		});
	},
  touchS (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      })
    }
  },
  touchM (e) {
		var index = e.currentTarget.dataset.index;
		if (e.touches.length == 1) {
			var moveX = e.touches[0].clientX;
			var idsX = this.data.startX - moveX;
			var delBtnWidth = this.data.delBtnWidth;
			var left = "";
			if (disX == 0 || disX < 0) {
				left = "margin-left: 0px";
			} else if (disX > 0) {
				left = "margin-left: -" + disX + "px";
				if (disX >= delBtnWidth) {
					left = "left: -" + delBtnWidth + "px";
				}
			}
			var list = this.data.goodsList.list;
			if (index != "" && index != null) {
				list[parseInt(index)].left = left;
				this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
			}
		}
	},
	touchM (e) {
		var index = e.currentTarget.dataset.index;
		if (e.changedTouches.length == 1) {
			var endX = e.changedTouches[0].clientX;
			var disX = this.data.startX - endX;
			var delBtnWidth = this.data.delBtnWidth;
			var left = disX > delBtnWidth / 2 ? "margin-left: -" + delBtnWidth + "px" : "margin-left: 0";
			var list = this.data.goodsList.list;
			if (index != "" && index != null) {
				list[parseInt(index)].left = left;
				this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
			}
		}
	},
	delItem (e) {
		var index = e.currentTarget.dataset.index;
		var list = this.data.goodsList.list;
		list.splice(index, 1);
		this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
	},
	setGoodsList (saveHidden, total, allSelect, noSelect, list) {
		this.setData({
			goodsList: {
				saveHidden: saveHidden,
				totalPrice: total,
				allSelect: allSelect,
				noSelect: noSelect,
				list: list
			}
		});
		var shopCarInfo = {};
		var tempNumber = 0;
		shopCarInfo.shopList = list;
		for (let i = 0; i < list.length; i++) {
			tempNumber += list[i].number;
		}
		shopCarInfo.shopNum = tempNumber;
		wx.setStorage({
			key: 'shopCarInfo',
			data: shopCarInfo
		})
	},
	getSaveHide () {
		return this.data.goodsList.saveHidden;
	},
	totalPrice () {
		var total = 0;
		this.data.goodsList.list.forEach(item => {
			if (item.active)
				total += parseFloat(item.price) * item.number
		})
		return parseFloat(total.toFixed(2));
	},
	allSelect () {
		var allSelect = false;
		this.data.goodsList.list.forEach(item => {
			if (item.active) {
				allSelect = true;
			} else {
				return allSelect = false;
			}
		})
		return allSelect;
	},
	noSelect () {
		let noSelect = 0;
		this.data.goodsList.list.forEach(item => {
			if (!item.active)
				noSelect++;
		});
		return noSelect == this.data.goodsList.list.length ? true : false;
	},
	editTap () {
		var list = this.data.goodsList.list;
		for (let i = 0; i < list.length; i++) {
			let curItem = list[i];
			curItem.active = false;
		}
		this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
	},
	saveTap () {
		var list = this.data.goodsList.list;
		for (let i = 0; i < list.length; i++) {
			let curItem = list[i];
			curItem.active = true;
		}
		this.setGoodsList(!this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
	},
	deleteSelected () {
		var list = this.data.goodsList.list.filter(item => {
			return !item.active;
		});
		this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
	},
	jiaBtnTap (e) {
		var index = e.currentTarget.dataset.index;
		var list = this.data.goodsList.list;
		if (index !== "" || index != null) {
			if (list[parseInt(index)].number < 10) {
				list[parseInt(index)].number++;
				this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
			}
		}
	},
	jianBtnTap (e) {
		var index = e.currentTarget.dataset.index;
		var list = this.data.goodsList.list;
		if (index !== "" && index != null) {
			if (list[parseInt(index)].number > 1) {
				list[parseInt(index)].number--;
				this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
			}
		}
	},
	bindAllSelect () {
		var currentAllSelect = this.data.goodsList.allSelect;
		var list = this.data.goodsList.list;
		if (currentAllSelect) {
			list.forEach(item => {
				item.active = false;
			});
		} else {
			list.forEach(item => {
				item.active = true;
			})
		}
		this.setGoodsList(this.getSaveHide(), this.totalPrice(), !currentAllSelect, this.noSelect, list);
	},
	allSelect () {
		var list = this.data.goodsList.list;
		var allSelect = false;
		list.forEach(item => {
			if (item.active) {
				allSelect = true;
			} else {
				return allSelect = false;
			}
		})
		return allSelect;
	},
	selectTap () {
		let index = e.currentTarget.dataset.index;
		let list = this.data.goodsList.list;
		if (index !== "" || index != null) {
			list[parseInt(index)].active = ! list[parseInt(index)].active;
			this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
		}
	},
	navigateToPayOrder () {
		wx.hideLoading();
		wx.navigateTo({
			url: "/pages/to-pay-order/index"
		})
	},
	toPayOrder () {
		wx.showLoading();
		var that = this;
		if (this.data.goodsList.noSelect) {
			wx.hideLoading();
			return;
		}
		var shopList = [];
		var shopCarInfoMem = wx.getStorageInfoSync("shopCarInfo");
		if (shopCarInfoMem && shopCarInfoMem.shopList) {
			shopList = shopCarInfoMem.shopList.filter(entity => {
				return entity.active;
			})
		}
		if (shopList.length == 0) {
			wx.hideLoading();
			return;
		}
		var isFail = false;
		var doneNumber = 0;
		var needDoneNumber = shopList.length;
		for (let i = 0; i < shopList.length; i++) {
			const carShopBean = shopList[i];
			if (isFail) {
				wx.hideLoading();
				return;
			}
			if (!carShopBean.propertyChildIds || carShopBean.propertyChildIds == "") {
				wx.request({
					url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/detail',
					data: {
						id: carShopBean.goodsId
					},
					success: res => {
						doneNumber++;
						if (res.data.data.properties) {
							wx.showModal({
								title: '提示',
								content: res.data.data.basicInfo.name + ' 商品已失效,请重新购买',
								showCancel: false
							})
							isFail = true;
							wx.hideLoading();
							return;
						}
						if (res.data.data.basicInfo.minPrice != carShopBean.price) {
							wx.showModal({
								title: '提示',
								content: res.data.data.basicInfo.name + ' 价格有调整,请重新购买',
								showCancel: false
							})
							isFail = true;
							wx.hideLoading();
							return;
						}
						if (needDoneNumber == doneNumber) {
							that.navigateToPayOrder();
						}
					}
				})
			} else {
				wx.request({
					url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/price',
					data: {
						goodsId: carShopBean.goodsId,
						propertyChildIds: carShopBean.propertyChildIds
					},
					success: res => {
						doneNumber++;
						if (res.data.data.stores < carShopBean.number) {
							wx.showModal({
								title: '提示',
								content: carShopBean.name + ' 库存不足,请重新购买',
								showCancel: false
							})
							isFail = true;
							wx.hideLoading();
							return;
						}
						if (res.data.data.price != carShopBean.price) {
							wx.showModal({
								title: '提示',
								content: carShopBean.name + ' 价格有调整,请重新购买',
								showCancel: false
							})
							isFail = true;
							wx.hideLoading();
							return;
						}
						if (needDoneNumber == doneNumber) {
							that.navigateToPayOrder();
						}
					}
				})
			}
		}
	}
})