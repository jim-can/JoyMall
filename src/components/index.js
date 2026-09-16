import Sku from './XtxSku/index.vue'
import ImageView from './imageView/index.vue'

// 通过插件的方式把components中的所有组件都进行全局化注册
export const componentPlugin = {
  install(app) {
    // app.component('组件名', 组件配置对象)
    app.component('XtxSku', Sku)
    app.component('XtxImageView', ImageView)
  }
}