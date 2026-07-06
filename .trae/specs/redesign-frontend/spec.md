# 周易算命前端改进与重新设计 Spec

## Why

当前 `frontend/index.html` 是一个单文件 HTML 应用，承载了周易算命工具的全部前端功能。经过全面审查，发现存在以下问题：

1. **视觉设计过时**：使用深色+金色的通用AI模板风格，缺乏文化韵味和独特性，排版拥挤，没有品牌辨识度
2. **功能性缺陷**：部分 JavaScript 存在变量命名不一致、内联事件处理、alert 未完全替换、API 错误处理不完善等问题
3. **交互体验差**：缺少加载状态、结果展示突兀、没有动画过渡、移动端适配不佳
4. **代码质量低**：单文件 2500+ 行，CSS 和 JS 全部内联，难以维护；大量行内样式；重复代码多
5. **可访问性不足**：虽然已有 ARIA 标签，但键盘导航、焦点管理、屏幕阅读器支持仍不完善

## What Changes

### 设计层面
- **全新视觉风格**：从"深色科技风"转向"新中式水墨风"——以宣纸白、墨色、朱砂红、金色点缀为主色调，融入传统中式美学
- **字体升级**：使用有书法韵味的字体（如霞鹜文楷/思源宋体）作为标题字体，提升文化质感
- **布局重构**：采用更开阔的留白、非对称布局、传统中式边框装饰（回纹、云纹）
- **动效设计**：加入水墨晕染、卦象浮现、纸张翻页等符合主题的文化动效
- **响应式优化**：针对手机端重新设计布局，确保触摸友好

### 功能层面
- **修复已知缺陷**：修复变量命名不一致、替换剩余 alert、完善 API 错误处理
- **增强交互**：添加加载动画、结果过渡效果、表单验证提示、操作确认
- **模块化代码**：将 CSS 提取到独立文件，JS 按功能模块拆分
- **性能优化**：懒加载非关键资源、优化图片、减少重绘

### 新增功能
- **卦象可视化**：用 SVG 绘制卦象线条，替代纯文本符号
- **历史记录**：本地存储用户的占卜历史，支持查看和删除
- **分享功能**：支持将占卜结果生成图片/文本分享
- **主题切换**：支持水墨白/墨色黑两种主题

## Impact

- Affected files: `frontend/index.html`, `frontend/hexagram-data.js`
- New files: `frontend/styles.css`, `frontend/app.js`, `frontend/modules/*.js`
- Affected capabilities: 八字测算、六爻占卜、周易64卦、AI聊天解读

## ADDED Requirements

### Requirement: 新中式视觉设计
The system SHALL provide a redesigned UI with traditional Chinese aesthetics.

#### Scenario: 页面加载
- **WHEN** 用户打开页面
- **THEN** 看到水墨风格背景、书法字体标题、传统装饰元素

#### Scenario: 主题切换
- **WHEN** 用户点击主题切换按钮
- **THEN** 页面在水墨白主题和墨色黑主题之间平滑过渡

### Requirement: 卦象 SVG 可视化
The system SHALL render hexagram lines using SVG instead of text symbols.

#### Scenario: 占卜结果显示
- **WHEN** 用户完成一次占卜
- **THEN** 卦象以 SVG 线条形式呈现，阳爻为实线、阴爻为断线，动爻有闪烁动画

### Requirement: 占卜历史记录
The system SHALL store and display user's divination history in localStorage.

#### Scenario: 查看历史
- **WHEN** 用户点击"历史记录"
- **THEN** 展示过往占卜记录列表，包含时间、方式、卦象/八字概要

#### Scenario: 删除记录
- **WHEN** 用户点击删除某条记录
- **THEN** 该记录从 localStorage 和界面中移除

### Requirement: 结果分享
The system SHALL allow users to share divination results.

#### Scenario: 分享结果
- **WHEN** 用户点击"分享结果"
- **THEN** 生成包含卦象、解读的文本/图片，支持复制到剪贴板

## MODIFIED Requirements

### Requirement: 单文件应用重构
The existing single-file HTML application SHALL be refactored into modular files.

- CSS extracted to `frontend/styles.css`
- JavaScript split into:
  - `frontend/app.js` - 主入口、初始化
  - `frontend/modules/bazi.js` - 八字计算与渲染
  - `frontend/modules/divination.js` - 六爻/周易占卜
  - `frontend/modules/ai-chat.js` - AI 聊天功能
  - `frontend/modules/ui.js` - UI 工具函数（通知、加载、主题）
  - `frontend/modules/history.js` - 历史记录管理
- `frontend/hexagram-data.js` 保持不变（数据文件）

### Requirement: 修复功能性缺陷
The following defects SHALL be fixed:

1. **变量命名一致化**：统一 `activeMethod` / `currentMethod` 命名
2. **移除剩余 alert**：`sendChatMessage` 中的 `alert` 替换为 `showNotification`
3. **API 错误处理完善**：区分网络错误、超时错误、认证错误，给出不同提示
4. **表单验证增强**：八字日期选择增加合理性校验（如未来日期禁止）
5. **事件绑定规范化**：所有 `onclick` 改为 `addEventListener`
6. **XSS 防护强化**：`formatMarkdown` 中确保所有 HTML 标签都经过白名单过滤

## REMOVED Requirements

### Requirement: 定价区块
**Reason**: 项目声明"完全免费"，定价区块（Pricing Section）与项目定位矛盾，且为占位内容无实际功能
**Migration**: 直接移除 pricing section，替换为"开源声明"或"关于项目"区块

### Requirement: 开发步骤内联文档
**Reason**: 开发步骤总结不应出现在用户-facing 的页面上，应移至独立文档
**Migration**: 将 dev-steps 内容移至 CONTRIBUTING.md 或独立开发文档
