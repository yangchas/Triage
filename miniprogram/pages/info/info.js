// pages/info.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        markers:[],
        latitude:0.0,
        longitude:0.0,
        data:'',
        flag:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let data=JSON.parse(options.data);
        console.log("加載了info")
        if(data.code==1){
            wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 2000
          })
        }else{
            wx.showToast({
                title: data.msg,
                icon: 'error',
                duration: 2000
            })
            wx.navigateBack()//预测错误返回上一层
        }
        
        console.log(data)
        this.setData({
            data
          }),
           // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'Z7CBZ-COZ6R-BZ5WR-WZBCV-56MSO-OQBSV'
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
    feedback:function(e) {
        console.log("触发反馈")
        wx.showToast({
            title: "已反馈",
            icon: 'success',
            duration: 2000
          })
    },
    skipToDetails:function(res) {
        console.log(res);
        let lat = ''; // 获取点击的markers经纬度
        let lon = ''; // 获取点击的markers经纬度
        let name = ''; // 获取点击的markers名称
        let markerId = res.markerId;// 获取点击的markers  id
        let markers = this.data.markers;// 获取markers列表
        console.log(markers);
        for (let item of markers){
            if (item.id === markerId) {
                lat = item.latitude;
                lon = item.longitude;
                name = item.title;
                wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
                    latitude: lat,
                    longitude: lon,
                    name:name,
                    success:function(res){
                        console.log(res);
                    },
                    fail:function(res){
                        console.log(res);
                    }
                })
                break;
            }
        }
    },
    location:function(pe) {
        this.setData({
            flag:true
        })
        var _this = this;
        wx.getLocation({
            type: 'wgs84',
            success (re) {
                console.log(re)
                _this.setData({
                    latitude : re.latitude,
                    longitude : re.longitude//经度
                })
                qqmapsdk.search({
                    keyword: '医院',  //搜索关键词
                    location: _this.data.latitude+','+_this.data.longitude,  //设置周边搜索中心点
                    // location:'36.68013,117.06533',
                    success: function (res) { //搜索成功后的回调
                        var mks = []
                        for (var i = 0; i < res.data.length; i++) {
                            console.log(res.data[i])
                            mks.push({ // 获取返回结果，放到mks数组中
                                title: res.data[i].title,
                                id: Number(res.data[i].id),
                                latitude: res.data[i].location.lat,
                                longitude: res.data[i].location.lng,
                                // iconPath: "/resources/my_marker.png", //图标路径
                                // width: 20,
                                // height: 20
                            })
                        }
                        _this.setData({ //设置markers属性，将搜索结果显示在地图中
                            markers: mks
                        })
                    },
                    fail: function (res) {
                        console.log(res);
                    },
                    complete: function (res){
                    console.log(res);
                    }
                });
            }
        })
    }
})