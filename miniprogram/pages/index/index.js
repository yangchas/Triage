const app = getApp()
import WxValidate from '../../utils/WxValidate.js'
Page({
  data: {
      formData:{
        name: '',
        age: '0',
        // sex:'',
        content:'',
        remark:'',
        sex:'3'
      },
      sex: [{
        id: 1,
        value: '男'
      }, {
        id: 0,
        value: '女'
      }],
  },
  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  radioChange: function (e) {
    //  console.log('radio发生change事件，携带value值为：', e.detail.value)
    //  console.log(this.data)
    const sex = this.data.sex
    for (let i = 0, len = sex.length; i < len; ++i) {
      sex[i].checked = false
      if(sex[i].id == e.detail.value){
        sex[i].checked = true
        this.data.formData.sex=e.detail.value
      }
    }
    this.setData({
      sex
    })
    // console.log(this.data.sex);
  },
  onLoad:function(){
    rules:{};
    messages:{};
    this.initValidate();
    console.log("loading")
  },
  tomap () {
    wx.navigateTo({
      url: '../map/map'
    })
  },
  onShareAppMessage () {
    return {
      title: '快来使用LBS定位小工具',
      imageUrl: '../../asset/logo.png'
    }
  },
  submitForm(){
    wx.navigateTo({
      url: '../map/map'
    })
  },
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
//验证函数
initValidate() {
    const rules = {
      name: {
        required: true,
        minlength:2
      },
      age:{
        required:true,
        number:true,
        max:112
      },
      content:{
        required:true,
        minlength:2
      }
    }
    const messages = {
      name: {
        required: '请填写姓名',
        minlength:'请输入正确的名称'
      },
      age:{
        required:'请填写年龄',
        max:"请输入正确的年龄"
      },
      // sex:{
      //   required:'请填写手机号',
      //   tel:'请填写正确的手机号'
      // },
 
      content:{
        required:'请描述症状',
        minlength:'描述太少了，请多写点吧'
      }

    }
    this.WxValidate = new WxValidate(rules, messages)
    
  },

//调用验证函数
 formSubmit: function(e) {
    // console.log(this.selectComponent('#form'))
    // console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    console.log(this.data.formData)
    const params = this.data.formData
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    wx.cloud.callContainer({
      "config": {
        "env": "prod-9gz0t9lrb9789ea2"
      },
      "path": "/api/info",
      "header": {
        "X-WX-SERVICE": "django-weyc",
        "content-type": "application/json"
      },
      data: this.data.formData,
      "method": "POST",
      success (res) {
        console.log(res.data)
        wx.navigateTo({
          url: '../info/info?data='+JSON.stringify(res.data)
        })
      }
    })
    // wx.request({
    //   url: 'http://localhost:8000/api/info', //仅为示例，并非真实的接口地址
    //   data: this.data.formData,
    //   "method": "POST",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success (res) {
    //     console.log(res.data)
    //     wx.navigateTo({
    //       url: '../info/info?data='+JSON.stringify(res.data)
    //     })
    //   }
    // })
    // console.log(res); // 在控制台里查看打印
    // this.showModal({
    //   msg: '提交成功'
    // })
  }
})
