# 7-keep-alive

# 项目说明

- 本项目主要解决 首页 -> 列表 -> 详情 的缓存问题

# 前置知识

### (1) 一些单词

```
research 研究 探索
guard 守卫
```

### (2) 路由守卫 guard

```
1. 全局 - 前置守卫
router.beforeEach
- router.beforeEach((to, from, next) => {})
  - to 即将进入的路由对象
  - from 即将离开的路由对象
  - next
    - next() --------- 进行 pipeline管道中的下一个钩子
    - next(false) ---- 中断当前导航
    - next('/') ------ 跳转到一个不同的地址，当前的导航被中断，然后进行一个新的导航
    - next(error) ---- 导航会被终止且该错误会被传递给 router.onError()

2. 全局 - 解析守卫
router.beforeResolve
- 在导航被确认之前，同时在所有 ( 组件内守卫和异步路由组件被解析 ) 之后，解析守卫就被调用

3. 全局 - 后置守卫
router.afterEach
- router.afterEach((to, from) => {})
- 注意：全局后置守卫没有next了，因为是管道中最后的钩子

4. 路由 - 路由独享的守卫
beforeEnter
- 在路由对象中定义，作为路由对象的一个属性

5. 组件 - 组件内的守卫
- beforeRouteEnter
- beforeRouteUpdate (2.2 新增) ---- 在当前路由改变，但是该组件被复用时调用
- beforeRouteLeave --------------- 导航离开该组件的对应路由时调用
```

### (3) watch $route 响应路由参数的变化

```
问题描述：
- 复用：当使用 ( 路由参数时，即动态路由 ) 时，原来的 ( 组件实例会被复用 )
- 原因：因为比起卸载后再创建，复用能提高效率
- 问题：复用组件，则组件的 ( 生命周期 ) 勾子不会再执行
- 解决
  - 方案1
    - 直接 watch $route对象
    - watch: { $route(to, from) {//对路由变化作出响应...}}
  - 方案2
    - 使用 beforeRouteUpdate(to, from, next) 组件内守卫
```

### (4) 内置组件 component

- props
  - `is`
    - 类型：string | ComponentDefinition | ComponentConstructor
    - **is 是什么**？：可以是 ( `组件的名字` )，或者 ( `一个组件的选项对象` )
  - `inline-template`
    - 类型：boolean
- 用法
  - 渲染一个元组件为 `动态组件`，根据 `is` 的值来决定哪个组件被渲染

```
<!-- 动态组件由 vm 实例的 `componentId` property 控制 -->
<component :is="componentId"></component>

<!-- 也能够渲染注册过的组件或 prop 传入的组件 -->
<component :is="$options.components.child"></component>

---
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
- currentTabComponent
  - 可以是 ---- 1. 已注册组件的名字，即组件的name属性
  - 或者 ------ 2. 一个组件的选项对象
<component v-bind:is="currentTabComponent"></component>
```

### (4) 内置组件 keep-alive

- 组件类型
  - 是一个 ( `抽象组件` )
  - 扩展：
    - 1.抽象组件有哪些？比如：`<transition>` `<keep-alive>`
    - 2.抽象组件的特点？比如：`自身不会渲染成DOM`，`也不会出现在组件的父组件链中`
- props
  - **include**
    - 作用：只有名称匹配的组件会被缓存
    - 类型：string|regexp
  - **exclude**
    - 作用：任何名称匹配的组件都不会被缓存
    - 类型：string|regexp
  - **max**
    - 作用：表示最多可以缓存的组件实例个数
    - 类型：number
    - 具体：一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉
- 用法
  - `<keep-alive>` 包裹 ( `动态组件` ) 时，会 ( `缓存不活动的组件` )，而 ( `不会销毁它们` )
- **activated** 和 **deactivated**
  - 生命周期：是两个生命周期函数
  - 调用时机：当 `<keep-alive>` 包裹的组件切换时，activated 和 deactivated 两个钩子会执行
  - 执行顺序：
    - 初始化渲染，默认加载 A 组件
      - A 组件 - mounted
      - A 组件 - activated
    - 切换 A->B
      - A 组件 - deactivated
      - B 组件 - mounted
      - B 组件 - activated
    - 切换 B-A
      - B 组件 - deactivated
      - A 组件 - activated
      - 注意：`此时A组件的mounted不再被执行，因为已经缓存在内存中，并没有被卸载，也就不会重新被mount`

# keep-alive 运用 - 实现路由按需缓存

```
场景：
home首页页 -> list列表页 -> 详情页

需求：
1. 从 详情页 -> 列表页 ------------------ 需要缓存列表页
2. 从 详情页 -> 首页 -> 列表页 ----------- 不缓存列表页

解决方案：
- 1. 利用 keep-alive 组件的 include 和 exclude 两个属性
- 2. 同时利用 vue-router 的 meta 元信息
- 3. v-if
- 4. watch 一个 $route ( 是组件响应路由变化的解决方案之一，还可以使用 beforeRouteUpdate 守卫 )
- 4. component组件的name属性 和 route对象中的name属性 保持一致

详细过程 ( 最具体的有4种情况 )
- 1. 从首页 -> 列表 -------------------- 向 include 中添加需要缓存
- 2. 从列表 -> 详情 -------------------- 不改变 include，即仍然缓存
- 3. 从详情 -> 列表 -------------------- 不改变 include，即仍然缓存
- 4. 从列表 -> 首页 -------------------- 去除 include，不再缓存
```

# 相关项目源码链接

- [测试 activated deactivated component keepAlive](https://github.com/woow-wu7/vue2-research/blob/master/src/views/KeepAlive.vue)

# 资料

- 路由按需加载 https://juejin.cn/post/6844903846901186574
