# 前置知识

### (1) 一些单词

```
research 研究 探索
guard 守卫

abstract 抽象 // 抽象组件 keep-alive transition
least recently used // 最近最少使用 - LRU缓存策略 // least最少的 // recently最近
prune 修剪 削减
alive 活着的 活着
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

```
内置组件 component
- props
  - `is`
    - 类型：string | ComponentDefinition | ComponentConstructor
    - **is是什么**？：可以是 ( `组件的名字` )，或者 ( `一个组件的选项对象` )
  - `inline-template`
    - 类型：boolean
- 用法
  - 渲染一个元组件为 `动态组件`，根据 `is` 的值来决定哪个组件被渲染
```

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

### (4) 内置抽象组件 keep-alive

- 组件类型
  - 是一个 ( `抽象组件` )
  - 扩展：
    - 1.抽象组件有哪些？
      - `<transition>`
      - `<keep-alive>`
    - 2.抽象组件的特点？
      - `自身不会渲染成DOM`，即不会渲染到页面上
      - `也不会出现在组件的父组件链中`，即不会和父组件，子组件建立父子关系
  - 原理
    - 问题：抽象组件是如何实现 - 不在父组件链中的呢
    - 回答：在 ( 初始化阶段 ) 会调用 ( initLifecycle )，会去判断 ( 父组件是否为抽象组件 )，如果是抽象组件就选取 ( 抽象组件的上一层 ) 作为父级，即忽略抽象组件和父组件，抽象组件和子组件的层级关系
    - 简化：就是如果是抽象组件，就把抽象组件的 - 父组件作为子组件的父组件
- props
  - **include**
    - 作用：只有名称匹配的组件会被缓存
    - 类型：string|regexp|array
    - 比如：
      - `逗号分隔的字符串 include="a,b"`
      - `正则表达式 :include="/a|b/"`
      - `数组 :include="['a', 'b']"`
    - 官网链接：https://cn.vuejs.org/v2/api/#keep-alive
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
    - 切换 B->A
      - B 组件 - deactivated
      - A 组件 - activated
      - 注意：`此时A组件的mounted不再被执行，因为已经缓存在内存中，并没有被卸载，也就不会重新被mount`
  - **activated 和 deactivated 总结**
    - keep-alive 的渲染分为 ( 首次渲染 ) 和 ( 缓存渲染 )
    - 渲染
      - 首次渲染
        - 首次渲染和一般组件首次渲染差不多，只是做了缓存处理
      - 缓存渲染
        - 并不会再走一次组件初始化，render 和 patch 等一系列流程
        - 减少了 script 的执行时间，性能更好
        - 如果缓存命中，不会再执行 created mounted，而是执行 activated
    - 销毁
      - 如果缓存命中，不会执行 destroyed，而是执行 deactivated

### (5) keep-alive 运用 - 实现路由按需缓存

```
场景：
home首页页 -> list列表页 -> 详情页

需求：
1. 从 详情页 -> 列表页 ------------------ 需要缓存列表页
2. 从 详情页 -> 首页 -> 列表页 ----------- 不缓存列表页

解决方案：
- 1. 利用 keep-alive 组件的 include 和 exclude 两个属性
- 2. 同时利用 vue-router 的 meta 元信息 ( meta:{deep,shouldKeepAlive} )
     - meta.deep 用来表示页面的层级，最终用来判断是前进和还是返回操作
     - meta.shouldKeepAlive 表示路由对应的页面是否需要被keep-alive缓存
- 3. v-if 决定 keep-alive 抽象组件是否被渲染
- 4. watch 一个 $route ( 是组件响应路由变化的解决方案之一，还可以使用 beforeRouteUpdate 守卫 )
- 4. component组件的name属性 和 route对象中的name属性 保持一致

详细过程 ( 最具体的有4种情况 )
- 1. 从首页 -> 列表 -------------------- 向 include 中添加需要缓存
- 2. 从列表 -> 详情 -------------------- 不改变 include，即仍然缓存
- 3. 从详情 -> 列表 -------------------- 不改变 include，即仍然缓存
- 4. 从列表 -> 首页 -------------------- 去除 include，不再缓存

项目源码：
- https://github.com/woow-wu7/7-keep-alive
```

### (6) LRU 缓存策略

- LRU：`Least recently used` 最近最少使用
- least 最少的
- recent 最近的

```
LRU 缓存策略的原理
---

1. 将 ( 最不常用 ) 的从 ( 数组 ) 中剔除 ( 数组头部 - 是最不常用的 )
2. 在存在 max 的情况下
   - 如果 ( 最新访问的节点 ) 在 ( 缓存数组 ) 中 ( 存在 )，就把该节点 ( 移动 ) 到 ( 数组尾部 - 表示新使用 )
   - 如果 ( 最新访问的节点 ) 在 ( 缓存数组 ) 中 ( 不存在 )，直接 ( 添加 ) 到 ( 数组尾部 - 表示最常用 )
3. 如下图
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adec02e21ecd4b8b8d51107a4ca0ca7b~tplv-k3u1fbpfcp-watermark.image?)

### (7) Vue.extend 和 Vue.component

```
1
Vue.extend
- 作用：使用基础Vue构造器，创建一个子类
- 注意：不是创建vue实例，而是创建一个 ( 子类 )，再通过 `new子类` 来生成vue组件实例
- 官网：https://cn.vuejs.org/v2/api/#Vue-extend
- 源码分析：https://juejin.cn/post/6844904201944825863

2
Vue.component
- 作用：注册 或 获取 全局组件
- 注册组件
  - 第二个参数可以是 Vue.extend返回的子类构造器
  - 第二个参数可以是 配置对象
- 获取注册的组件
  - 返回一个构造起
// 注册组件，传入一个扩展过的构造器 Vue.component('my-component', Vue.extend({ /* ... */ }))
// 注册组件，传入一个选项对象 (自动调用 Vue.extend) Vue.component('my-component', { /* ... */ })
// 获取注册的组件 (始终返回构造器) var MyComponent = Vue.component('my-component')
```

### (8) es2022 新特性

```
1
数组的 at 方法
---
const arr = [1,2,3]
arr.at(-1) // 3
arr[arr.length - 1] // 相比于之前的写更短更优雅
```

```
2
顶层 await
---
该特性已经被 vue3 所使用
await Promise.resolve(1) // 用最新的chrome测试过了，已经支持
```

```
3
类的 私有属性 和 私有方法
- 特点
  - 都不能在外部直接访问，可以在内部中直接访问
  - 可以通过类的原型方法 - 来间接访问私有方法和私有属性
---
class C {
  constructor() {
    this.#getName(); // 私有方法 和 私有属性 只能在类中直接调用
  }
  #name = "woow_wu7";
  #getName = () => this.name;
  getName = () => this.#name;
  // 1. 私有属性访问时，也需要加 #
  // 2. 私有方法和私有属性 - 可以在外部调用实例原型方法 - 来间接访问私有属性和私有方法
}
const c = new C();
console.log("c.name", c.name); // undefined
console.log("c.getName()", c.getName()); // woow_wu7
```

# (一) keep-alive 源码

- 源码文件位置：src/core/components/keep-alive.js
- [源码仓库]()

```
1. keep-alive 组件的初始化注册
- 原因：因为 keep-alive 是一个组件，初始化的时需要注册成vue的全局组件，则可以在所有的页面中使用全局组件
- 源码文件位置：src/core/global-api/index.js
---

// 1
// 注册全局内置组件，比如keep-alive
// - builtInComponents 就是 <keep-alive> 组件
extend(Vue.options.components, builtInComponents);
```

```
2. keep-alive 组件
- 源码文件位置：src/core/components/keep-alive.js
---

// keep-alive 组件 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// 1
// keep-alive组件的 - 初始化全局注册
// - 原因：因为 keep-alive 是一个组件，初始化的时需要注册成vue的全局组件，则可以在所有的页面中使用全局组件
// - 流程：
export default {
  name: 'keep-alive',
  abstract: true,
  // abstract: true,
  // - 抽象组件的标志，即 keep-alive 是一个抽象组件
  // - 抽象组件的 ( 特点 )
  //  - 1. 自身不会渲染成 DOM ----------- 即不会渲染到页面上
  //  - 2. 也不会出现在组件的父组件链中 --- 即不会和 ( keep-alive的父组件 ) 和 ( keep-alive的子组件 ) 建立两个父子关系
  // - 原理
  //   - 问题：抽象组件是如何实现 - 不在父组件链中的呢
  //   - 回答：在 ( 初始化阶段 ) 会调用 ( initLifecycle )，会去判断 ( 父组件是否为抽象组件 )，如果是抽象组件就选取 ( 抽象组件的上一层 ) 作为父级，即忽略抽象组件和父组件，抽象组件和子组件的层级关系
  //   - 简化：就是如果是抽象组件，就把抽象组件的 - 父组件作为子组件的父组件
  //   - 流程：init -> initLifecycle(vm)
  //   - 文件位置：src/core/instance/lifecycle.js
  // - 常见的抽象组件：<keep-alive> <transition>

  // 3 个 props
  props: {
    include: patternTypes,
    // include可以是
    // - 逗号分隔的字符串，比如 ----- <keep-alive include="a,b">
    // - 正则表达式，比如 --------- <keep-alive :include="/a|b/">
    // - 数组，比如 --------------- <keep-alive :include="['a', 'b']">
    // - 官网说明：https://cn.vuejs.org/v2/api/#keep-alive
    // - 使用详见1 https://github.com/woow-wu7/7-keep-alive
    // - 使用详见2 https://github.com/woow-wu7/vue2-research/blob/master/src/views/KeepAlive.vue
    exclude: patternTypes,
    max: [String, Number]
  },

  methods: {
    // cacheVNode
    // - 在 mounted 时被调用
    // - 在 updated 是也被调用
    cacheVNode() {
      const { cache, keys, vnodeToCache, keyToCache } = this
      if (vnodeToCache) {
        const { tag, componentInstance, componentOptions } = vnodeToCache
        cache[keyToCache] = {
          name: getComponentName(componentOptions), // 组件名
          tag, // tag
          componentInstance, // 组件实例
        }
        // cache
        // - key -> keyToCache
        // - value -> 组装的组件对象

        keys.push(keyToCache)

        // prune oldest entry
        // 删掉最古老的条目
        // LRU 缓存策略执行的时机，max存在，并且大于了max
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
        this.vnodeToCache = null
      }
    }
  },

  created () {
    this.cache = Object.create(null)
    // cache
    // - cache对象，用来缓存 vnode
    // - LRU：
    //  - 最近最少使用的缓存策略
    //  - keep-alive 使用的是 least recently used 最近最少使用的缓存策略
    //  - 详见：https://juejin.cn/post/6862206197877964807

    this.keys = [] // vnode 的 key
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys) // 清除缓存的组件，同时卸载组件
    }
  },

  mounted () {
    this.cacheVNode()

    // 监听 include 和 exclude 的变化，从而决定是否缓存组件
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  updated () {
    this.cacheVNode()
  },

  render () {
    const slot = this.$slots.default

    const vnode: VNode = getFirstComponentChild(slot) // 获取 slot 中的第一个 ( 组件vnode )

    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions // 获取组件配置项

    if (componentOptions) {
      // check pattern
      // 检查模式
      const name: ?string = getComponentName(componentOptions) // 获取组件的 name 属性，或 tag 属性
      const { include, exclude } = this

      // 111111 不做缓存
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        // 组件名与include不匹配或与exclude匹配都会直接退出并返回 VNode，不走缓存机制
        // - 1. name 在 include 中不存在
        // - 2. name 在 exclude 中存在
        // - 以上两种情况都直接返回返回 slot，不做缓存处理
        return vnode
      }

      // 222222 以下是缓存的逻辑
      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key

      if (cache[key]) { // -- 组件已经缓存过
        vnode.componentInstance = cache[key].componentInstance // 直接获取缓存的组件的 vnode.componentInstance
        // make current key freshest
        // 确保当前的key是最新的，即 LRU 最近最少使用缓存策略
        remove(keys, key) // ------- 1. 删除 keys 数组中的 key
        keys.push(key) // ---------- 2. 删除后，把该 key 放在 keys 数组的 ( 尾部 )，即 LRU 最近最少使用的缓存策略
      } else { // ----------- 组件未缓存过
        // delay setting the cache until update
        // 延迟设置缓存，直到更新
        this.vnodeToCache = vnode // 供 cacheVNode 方法使用
        this.keyToCache = key // 供 cacheVNode 方法使用
      }

      vnode.data.keepAlive = true
      // 在组件的data中，添加标志位 keepAlive，表示该组件被缓存了
      // 注意：这里是 <keep-alive> 包裹的组件的data.keepAlive，而不是 keep-alive 组件
    }
    return vnode || (slot && slot[0]) // 返回第一个组件，或者 slot，或者 slot[0]，逐渐降级
  }
}
```

# (二) keep-alive 相关链接

- keep-alive 实现动态路由缓存：https://github.com/woow-wu7/7-keep-alive
- activated 和 deactivated 测试：https://github.com/woow-wu7/vue2-research/blob/master/src/views/KeepAlive.vue
- keep-alive 源码分析仓库：https://github.com/woow-wu7/7-vue2-source-code-analysis

# 资料

- 路由按需加载 https://juejin.cn/post/6844903846901186574
- keep-alive 源码分析 1 https://juejin.cn/post/6998804817309073421
- keep-alive 源码分析 2 https://juejin.cn/post/6862206197877964807
- 政采云 keep-alive3 https://www.zoo.team/article/lru-keep-alive
- 美团缓存策略 https://tech.meituan.com/2017/03/17/cache-about.html
