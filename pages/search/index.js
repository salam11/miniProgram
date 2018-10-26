// pages/serach/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText:'',  //搜索框的值
    searchResultArr:[],
    authorizeState: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'fangun-storeFront',
      success: function(res) {
        app.globalData.loginCache = true;
        app.globalData.peopleInfo = res.data;
        that.setData({
          authorizeState:true
        })
      },
      fail:function(res){

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function(){
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.globalData.code = res.code;
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getPhoneNumber(e) {
    let that = this;
    wx.request({
      url: 'https://api.yuyue58.cn/api/wxLogin',
      method: "POST",
      data: {
        app:'wxe',
        code: app.globalData.code,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      },
      header: { "content-type": "application/x-www-form-urlencoded" },
      success(res) {
        that.setData({
          authorizeState:true
        })
        console.log(res.data)
        let data = res.data;
        //存储缓存
        wx.setStorage({
          key: "fangun-storeFront",
          data: data
        });
        //存app
        app.globalData.loginCache = true;
        app.globalData.peopleInfo = data;
        
      }
    });
  },

  scan:function(){
    let that = this;
    wx.scanCode({
      success(res) {
        let url = res.result;
        //是否有转义了的 %3d
        let flag1 = url.indexOf("%3d");
        if(flag1!=-1){
          let urlArr = url.split("%3d");
          //最后一个%3d 后面的，应该是sid, 32位
          let sid = urlArr[urlArr.length-1];
          if(sid.length==32){
            app.globalData.peopleInfo.sid = sid
            wx.navigateTo({
              url: '../storeHead/index'
            })
          }
        }
      }
    })
  },

  searchInput:function(e){
    let text = e.detail.value;
    this.setData({
      searchText:text
    })
  },

  search:function(){
    let text = this.data.searchText;
    let that = this;
    if(text!=""){
      wx.request({
        url: 'https://api.yuyue58.cn/api/searchShops',
        method: "POST",
        header: { "content-type": "application/x-www-form-urlencoded" },
        data: {
          id: text
        },
        success(res) {
          that.setData({
            searchResultArr: res.data
          })
        }
      })
    }
  },

  selectStore:function(e){
    let sid = e.currentTarget.dataset.sid;
    app.globalData.peopleInfo.sid = sid
    //console.log(app.globalData.peopleInfo.mid)
    wx.navigateTo({
      url: '../storeHead/index'
    })
  }


})