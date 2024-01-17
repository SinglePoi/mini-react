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
🧨 Step3 统一提交  
🎊 Step4 实现 function component

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

🧨 Step3 统一提交

- 每次创建 DOM 都进行一个提交无疑是消耗性能的
- 浏览器的空闲时间是不确定的，但最后一步是可确定的
- 在最后一部完成真实 DOM 的渲染，不仅可以提升用户体验，还可以节省性能消耗

🎊 Step4 实现 function component

- component 的类型为 function，需要通过调用才能获取到真实的 component
- 将 funciton component 的 props 作为 function 的参数，使得 component 可以获取到参数
- 因为 function component 的缘故，DOM 树的结构被拉长。转换链表时，需要获取到更深层次的 parent

### 收获

- 数据结构的装箱比拆箱更重要，好的结构可以减轻后续算法处理的心智负担
- requestIdleCallback API 接受一个函数，并在浏览器空闲时期执行，不影响关键事件
- 学习的核心要点在于学习源码针对问题的解决思路，以及将思路应用到自身开发过程中的思考
- 知识是可迁移的，如何运用知识是学习的首要目的

### 感谢

感谢崔学社提供的交流平台
