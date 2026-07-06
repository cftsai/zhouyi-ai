# Checklist

## 设计系统
- [x] CSS 变量系统支持水墨白和墨色黑双主题
- [x] 中文字体（霞鹜文楷/思源宋体）正确加载并应用
- [x] 基础布局样式（导航、容器、间距）符合新中式风格
- [x] 通用组件样式（按钮、卡片、表单、通知）统一且美观
- [x] 文化动效（水墨晕染、浮现、过渡）正常运行

## HTML 结构
- [x] index.html 正确引入外部 CSS 和 JS 文件
- [x] Hero 区域展示书法标题和水墨背景
- [x] 功能介绍区域（feature cards）布局正确
- [x] 占卜体验区域（表单、结果展示）交互正常
- [x] 导航栏包含主题切换按钮
- [x] Pricing 区块和开发步骤内联文档已移除
- [x] 页脚信息正确

## JavaScript 模块
- [x] `frontend/modules/ui.js` 提供通知、加载、主题切换功能
- [x] `frontend/modules/bazi.js` 八字计算、分析、渲染正确
- [x] `frontend/modules/divination.js` 六爻起卦、周易64卦、SVG渲染正确
- [x] `frontend/modules/ai-chat.js` DeepSeek API 调用和聊天界面正常
- [x] `frontend/modules/history.js` localStorage 历史记录管理正常
- [x] `frontend/app.js` 主入口初始化正确，事件绑定无误

## 功能缺陷修复
- [x] 变量命名统一（activeMethod/currentMethod 一致化）
- [x] 所有 alert() 替换为 showNotification()
- [x] API 错误处理区分网络/超时/认证错误
- [x] 表单验证增强（日期合理性、空值检查）
- [x] 所有 onclick 改为 addEventListener
- [x] XSS 防护强化（formatMarkdown 白名单过滤）

## SVG 卦象可视化
- [x] SVG 卦象渲染函数正确绘制阳爻实线、阴爻断线
- [x] 动爻闪烁/高亮动画正常
- [x] 结果区域使用 SVG 替代文本符号

## 历史记录
- [x] localStorage 数据结构正确
- [x] 占卜记录保存完整（时间、方式、结果摘要）
- [x] 历史记录列表 UI 正常展示
- [x] 删除单条/清空全部记录功能正常

## 结果分享
- [x] 分享文本格式包含卦象和解读
- [x] 复制到剪贴板功能正常
- [x] 分享按钮在结果区域可见且可用

## 响应式与性能
- [x] 移动端布局适配正确（触摸友好、字体大小合适）
- [x] 非首屏资源懒加载正常
- [x] CSS 动画使用 transform，减少重绘
