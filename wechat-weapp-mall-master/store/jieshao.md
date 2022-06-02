一个基于原生小程序的 mini 全局状态管理库，跨页面/组件数据共享渲染。

全局状态 state 支持所有 Page 和 Component，更新时使用独有 diff 能力，性能更强。
周期监听 pageListener 能监听所有页面的 onLoad、onShow 等周期事件，方便埋点、统计等行为。
全局事件 methods，一处声明，所有 wxml 直接可用的函数。
适合原生小程序，即使后期引入，也只需增加几行代码。