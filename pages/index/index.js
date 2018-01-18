//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false,
    SwiperCurrent: 0,
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    scrollTop: "0",
    loadingMoreHidden: true,
    hasNoCoupons: true,
    coupons: [],
    searchInput: '',
    userInfo: {}
  },
  onLoad: function () {
    var that = this;

    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })

    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName'
      },
      success: (res) => {
        if (res.data.code === 404) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
        } else {
          that.setData({
            banners: res.data.data
          });
          // console.log(res.data.data);
        }
      }
    })

    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: (res) => {
        var categories = [
          {
            id: 0,
            name: '全部'
          }
        ];
        if (res.data.code === 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
          }
        }
        that.setData({
          categories: categories,
          activeCategoryId: 0
        })
        // console.log(res.data.data)
        that.getGoodsList(0);
      }
    })

    that.getCoupons()
    that.getNotice()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  swiperchange: function (e) {
    // console.log(e.detail.current);
    this.setData({
      swiperCurrent: e.detail.current
    })
	},
	toDetailsTap (e) {
		wx.navigateTo({
			url: '/pages/goods-detail/index?id=' + e.currentTarget.dataset.id
		})
	},
  tapBanner: function (e) {
    if (e.currentTarget.dataset.id !== 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  tapClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    // console.log(e);
    this.getGoodsList(this.data.activeCategoryId)
  },
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
  },
  toSearch: function () {
    this.getGoodsList(this.data.activeCategoryId);
  },
  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      categoryId = '';
    }
    // console.log(categoryId);
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      data: {
        categoryId: categoryId,
        nameLike: that.data.searchInput
      },
      success: (res) => {
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        var goods = [];
        if (res.data.code !== 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false
          });
          return;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
        }
        that.setData({
          goods: goods
        })
      }
    })
  },
  getCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/coupons',
      data: {
        type: ''
      },
      success: res => {
        if (res.data.code === 0) {
          that.setData({
            hasNoCoupons: false,
            coupons: res.data.data
          })
        }
      }
    })
  },
  getCoupon: function (e) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
      data: {
        id: e.currentTarget.dataset.id,
        token: app.globalData.token
      },
      success: res => {
        if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showModal({
            title: '错误',
            content: '来晚了',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20003) {
          wx.showModal({
            title: '错误',
            content: '你领过了，别贪心哦~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 30001) {
          wx.showModal({
            title: '错误',
            content: '您的积分不足',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20004) {
          wx.showModal({
            title: '错误',
            content: '已过期~',
            showCancel: false
          })
        }
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功，赶紧去下单吧~',
            icon: 'success',
            duration: 2000
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
  },
  toDetailTap: function (e) {
    wx.navigateTo({
      url: '/pages/goods-detail/index?id=' + e.currentTarget.dataset.id
    })
  },
  scroll: function (e) {
    var that = this,
        scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  getNotice: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/list',
      data: {
        pageSize: 5
      },
      success: res => {
        if (res.data.code == 0) {
          that.setData({
            noticeList: res.data.data
          })
        }
      }
    })
  },
  onShareAppMessage: () => {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success: res => {},
      fail: res => {}
    }
  }
})
