/* eslint-env node */
module.exports = {
  plugins: {
    //配置使用autoprefixer插件
    //作用:生成浏览器CSS样式规则前缀
    // VueCLI内部已经配置了autoprefixer插件
    //所以又配置了一次，所以产生冲突了
    // 'autoprefixer ': { // autoprefixer插件的配置
    //1配置要兼容到的环境信息
    //browsers:[ 'Android >= 4.0 ' , 'i0s >=8'] ,

    //配置使用postcss-pxtorem插件
    //作用:把px转为rem
    'postcss-pxtorem': {
      // res.file 就是要处理的包含css的文件
      // lib-flexible的 REM适配方案:把一行分为10 份，每份就是十分之一所以 rootvalue应该设置为你的设计稿宽度的十分之一
      // 我们的设计稿是 750，所以应该设置为750 / 10 =75
      //但是 Vant建议设置为 37.5，为什么?因为Vant是基于37.5写的
      // 所以必须设置为37.5，唯一的缺点就是使用我们设计稿的尺寸都必须/2
      //有没有更好的办法?
      // 如果是Vant的样式，就按照37.5来转换如果是我们自己的样式，就按照75来转换通过查阅文档，我们发现 rootValue支持两种类型:
      // 数字:固定的数值
      // 函数:可以动态处理返回
      // postcss-pxtorem处理每个CSS文件的时候都会来调用这个函数它会把被处理的cSS文件相关的信息通过参数传递给该函数
      rootValue(res) {
        return res.file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // * 代表转换css的所有属性
      propList: ['*'],
      //配置不要转换的样式资源
      exclude: 'github-markdown',
    },
  },
}
