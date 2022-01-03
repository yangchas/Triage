App({
  onLaunch: async function () {
    wx.cloud.init({
      env: "prod-9gz0t9lrb9789ea2"    // 此处init的环境ID和微信云托管没有作用关系，没用就留空
    });
  
  }
})
