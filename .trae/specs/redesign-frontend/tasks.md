# Tasks

- [ ] Task 1: 创建新中式设计系统与基础样式
  - [ ] SubTask 1.1: 设计 CSS 变量系统（水墨白/墨色黑双主题）
  - [ ] SubTask 1.2: 引入中文字体（霞鹜文楷/思源宋体 via CDN）
  - [ ] SubTask 1.3: 创建基础布局样式（导航、容器、间距、边框装饰）
  - [ ] SubTask 1.4: 创建通用组件样式（按钮、卡片、表单、通知）
  - [ ] SubTask 1.5: 添加文化动效（水墨晕染、浮现、过渡）

- [ ] Task 2: 重构 HTML 结构与页面布局
  - [ ] SubTask 2.1: 重写 index.html 骨架，引入外部 CSS/JS
  - [ ] SubTask 2.2: 重新设计 Hero 区域（书法标题、水墨背景）
  - [ ] SubTask 2.3: 重新设计功能介绍区域（feature cards）
  - [ ] SubTask 2.4: 重新设计占卜体验区域（表单、结果展示）
  - [ ] SubTask 2.5: 添加主题切换按钮到导航栏
  - [ ] SubTask 2.6: 移除 Pricing 区块和开发步骤内联文档
  - [ ] SubTask 2.7: 重新设计页脚

- [ ] Task 3: 模块化 JavaScript 代码
  - [ ] SubTask 3.1: 创建 `frontend/modules/ui.js`（通知、加载、主题切换工具）
  - [ ] SubTask 3.2: 创建 `frontend/modules/bazi.js`（八字计算、分析、渲染）
  - [ ] SubTask 3.3: 创建 `frontend/modules/divination.js`（六爻起卦、周易64卦、SVG渲染）
  - [ ] SubTask 3.4: 创建 `frontend/modules/ai-chat.js`（DeepSeek API 调用、聊天界面）
  - [ ] SubTask 3.5: 创建 `frontend/modules/history.js`（localStorage 历史记录管理）
  - [ ] SubTask 3.6: 创建 `frontend/app.js`（主入口、事件绑定、初始化）

- [ ] Task 4: 修复功能性缺陷
  - [ ] SubTask 4.1: 统一变量命名（activeMethod/currentMethod）
  - [ ] SubTask 4.2: 替换所有剩余 `alert()` 为 `showNotification()`
  - [ ] SubTask 4.3: 完善 API 错误处理（区分网络/超时/认证错误）
  - [ ] SubTask 4.4: 增强表单验证（日期合理性、空值检查）
  - [ ] SubTask 4.5: 将所有 `onclick` 改为 `addEventListener`
  - [ ] SubTask 4.6: 强化 XSS 防护（formatMarkdown 白名单过滤）

- [ ] Task 5: 实现 SVG 卦象可视化
  - [ ] SubTask 5.1: 创建 SVG 卦象渲染函数（阳爻实线、阴爻断线）
  - [ ] SubTask 5.2: 添加动爻闪烁/高亮动画
  - [ ] SubTask 5.3: 在结果区域替换文本符号为 SVG

- [ ] Task 6: 实现历史记录功能
  - [ ] SubTask 6.1: 设计 localStorage 数据结构
  - [ ] SubTask 6.2: 实现保存占卜记录（时间、方式、结果摘要）
  - [ ] SubTask 6.3: 实现历史记录列表 UI（侧边栏/弹窗）
  - [ ] SubTask 6.4: 实现删除单条/清空全部记录

- [ ] Task 7: 实现结果分享功能
  - [ ] SubTask 7.1: 生成分享文本格式（包含卦象、解读）
  - [ ] SubTask 7.2: 实现复制到剪贴板功能
  - [ ] SubTask 7.3: 添加分享按钮到结果区域

- [ ] Task 8: 响应式与性能优化
  - [ ] SubTask 8.1: 针对移动端调整布局（触摸友好、字体大小）
  - [ ] SubTask 8.2: 添加懒加载（非首屏图片/模块）
  - [ ] SubTask 8.3: 优化 CSS（减少重绘、使用 transform 动画）

# Task Dependencies

- Task 2 depends on Task 1（HTML 需要引用已创建的 CSS）
- Task 3 depends on Task 2（JS 需要操作已创建的 DOM 结构）
- Task 4 可与 Task 3 并行（修复逻辑可独立进行）
- Task 5 depends on Task 3（SVG 渲染需要 divination 模块）
- Task 6 depends on Task 3（历史记录需要占卜结果数据）
- Task 7 depends on Task 3（分享需要占卜结果数据）
- Task 8 depends on Task 2 和 Task 3（响应式需要完整页面和交互）
