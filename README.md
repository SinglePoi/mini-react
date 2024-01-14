<h1 align="center">mini-react</h1> 
<p align="center"> 渐进式 react 学习记录 </p>

### 结构

```
.
|-- core
|   |-- React.js
|   `-- ReactDom.js
|-- App.js
|-- index.html
|-- README.md
`-- main.js
```

### 计划

✏️ Step1 实现最简 mini-react
🎈 Step2 实现 fiber 架构

### 内容

✏️ Step1 根据静态渲染节点，逐步迭代到动态渲染

- 封装虚拟 DOM 数据结构
- 将虚拟 DOM 转化为真实 DOM
- 依次渲染节点属性和子节点
- 语义化封装渲染函数
- 以 React 的方式渲染节点
- 借助 Vite 提供 JSX 的支持

🎈 Step2 在浏览器空闲时间处理 DOM 树结构过大的问题

- 使用 requestIdleCallback API 实现将 DOM 树转换为链表结构

### 收获

数据结构的装箱比拆箱更重要，好的结构可以减轻后续算法处理的心智负担
requestIdleCallback API 接受一个函数，并在浏览器空闲时期执行，不影响关键事件
