export default defineAppConfig({
  pages: [
    'pages/customer/index',
    'pages/demand/index',
    'pages/plan/index',
    'pages/followup/index',
    'pages/satisfaction/index',
    'pages/customer-detail/index',
    'pages/demand-detail/index',
    'pages/plan-detail/index',
    'pages/followup-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '医美顾问',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFF5F8'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#FF6B9D',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/customer/index',
        text: '客户跟进'
      },
      {
        pagePath: 'pages/demand/index',
        text: '诉求记录'
      },
      {
        pagePath: 'pages/plan/index',
        text: '方案确认'
      },
      {
        pagePath: 'pages/followup/index',
        text: '术后回访'
      },
      {
        pagePath: 'pages/satisfaction/index',
        text: '满意评价'
      }
    ]
  }
})
