import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { registerApplication, start }  from 'single-spa';

Vue.config.productionTip = false
async function loadScript(url) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script)
  })
}
function httpRequest(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  // request.responseType = 'json';
  // request.onload = function () {
  //   var data = this.response;
  //   console.log(data);
  // };
  request.onreadystatechange = function () {
    console.log('this', this)
    if(this.readyState === 4 && this.status === 200) {
      const json = this.responseText;
      console.log(json, this.response)
    }
  }
  request.send()
}
// httpRequest('http://localhost:10000/js/app.js')
// singleSpa 缺陷：手动加载脚本 不够灵活 不能动态加载js文件
// 样式不隔离 没有js沙箱机制
registerApplication('myVueApp',
  async () => {
    console.log('加载模块')
    await loadScript('http://localhost:10000/js/chunk-vendors.js');
    await loadScript('http://localhost:10000/js/app.js');
    await loadScript('https://webapi.amap.com/maps?v=1.4.15&key=6878ff04b750edc137385f8d3cf10cb8&plugin=AMap.Autocomplete,AMap.BezierCurveEditor,AMap.ToolBar,AMap.PlaceSearch')
    return window.singleVue;
  },
  location => location.pathname.startsWith('/vue') // 用户切换到/vue的路径下，我需要加载刚才定义的子应用
)
start();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
