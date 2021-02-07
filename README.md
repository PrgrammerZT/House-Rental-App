## 不合理的地方

> ### 已解决

- 1.FilterPicker 没有暂时的值 使得取消之后停留在原来的位置
- 2.需要处理绝对定位导致显示不全的问题
- 3.有遮罩的时候 还可以下拉滚动
- 4.FilterMore 组件点击取消的时候 即使没有变化 也会刷新
- 5.我的页面登录失败的问题

> ### 待解决

- 1.cityList 中点击#和 z 无法高亮对应的标签
- 2.如何等待 React-Virtualized-List 列表项的完全加载问题 **已解决**
- 3.找到房源的提示时有时无
- 4.没有一个好的 favicon.ico
- 5.tag 标签过多,超过一排时会引起样式错乱
- 6.map 和首页不能携带参数跳转到 houseList **已解决**
- 7.地铁不限的情况无法获取房源

> ### 推测原因

- 3.可能是因为全局 axios 请求结束时的 hide()冲突了 Toast.info() 导致无法显示

> ### 解决方案

- 2.通过给组件设置 ref,父组件完全渲染后,再调用子组件的方法
- 3.完全渲染的意思是 ComponentDidMount 函数中调用
- 4.注意的是 render 方法会在每次状态改变后执行,无论是父组件还是子组件

- 6.可以通过 react-router-dom 中的 state 解决问题 但是清除 state 的时候不知道怎么办
- #### 使用动态路由和 match 解决这个问题 也不清楚如何清除 state
- #### 尝试使用 history.replace() 但是我们从 city 界面回来的时候会使用 history.go 这个 API,就会回到 state 仍存在的地方 好像是这样的
- #### 建议使用 history.replace() 代替 history.push 这个 API
