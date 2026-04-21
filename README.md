# 🔮 周易算命 AI

> 传承千年智慧，探索命运奥秘。基于 AI 的免费周易算命工具。

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/HTML5-CSS3-red" alt="HTML5">
  <img src="https://img.shields.io/badge/AI-DeepSeek-7c3aed" alt="AI">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

## ✨ 特性

- **周易64卦**：基于传统周易64卦象，解读卦辞爻辞
- **八字排盘**：四柱八字命理分析，五行强弱评估
- **六爻占卜**：经典六爻起卦解卦
- **AI智能解读**：接入 DeepSeek 大模型，提供专业命理分析
- **完全免费**：所有功能开放，不收一分钱

## 🎯 在线体验

直接访问前端页面：

```bash
# 克隆项目
git clone https://github.com/Alyosha28/zhouyi-ai.git
cd zhouyi-ai

# 启动前端服务
npx http-server frontend -p 8080 -c-1
```

然后打开浏览器访问 http://localhost:8080

## 📦 项目结构

```
周易算命/
├── frontend/
│   └── index.html          # 前端页面（单文件应用）
├── src/
│   ├── core/               # 核心算法
│   │   ├── FortuneTeller.ts    # 周易占卜核心
│   │   └── ZhouyiMethod.ts     # 起卦方法
│   ├── bazi/               # 八字模块
│   │   ├── baZiCalculator.ts   # 八字计算器
│   │   ├── stemsAndBranches.ts # 天干地支
│   │   └── lunarConverter.ts   # 农历转换
│   ├── liuyao/             # 六爻模块
│   │   └── liuYaoCalculator.ts # 六爻计算器
│   ├── fate/               # 命理分析
│   │   └── fateAnalyzer.ts     # 命运分析器
│   └── extensions/         # AI扩展
│       └── deepseek.ts         # DeepSeek API接口
├── __mocks__/              # Mock文件
├── core.test.js            # 测试文件
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript配置
├── README.md               # 项目说明
├── about.md                # 关于作者
└── CONTRIBUTING.md         # 贡献指南
```

## 🛠️ 技术栈

| 技术         | 用途         |
| ------------ | ------------ |
| TypeScript   | 核心算法实现 |
| HTML/CSS/JS  | 前端界面     |
| Node.js      | 运行环境     |
| DeepSeek API | AI智能解读   |
| Jest         | 单元测试     |

## 🚀 快速开始

### 前置要求

- Node.js 16+
- npm 或 yarn

### 安装与运行

```bash
# 1. 安装依赖
npm install

# 2. 编译 TypeScript
npm run build

# 3. 运行测试
npm test

# 4. 启动前端
npx http-server frontend -p 8080 -c-1
```

### 配置 AI 解读

在页面中输入你的 DeepSeek API Key 即可启用 AI 智能解读功能：

1. 访问 https://platform.deepseek.com 获取 API Key
2. 在前端页面 "AI 解读配置" 输入框中粘贴 API Key
3. 进行占卜后，AI 会自动解读结果

## 📖 核心模块说明

| 模块             | 说明             |
| ---------------- | ---------------- |
| FortuneTeller    | 周易64卦占卜核心 |
| BaZiCalculator   | 四柱八字排盘     |
| LiuYaoCalculator | 六爻起卦解卦     |
| FateAnalyzer     | 五行命理分析     |
| DeepSeek         | AI 扩展接口      |

## 📝 开发指南

```bash
# 开发模式（监听模式）
npm run dev

# 运行单个测试
npm test -- core.test.js
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！详细贡献指南请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

## 👤 关于作者

**竟白** - 哈尔滨工业大学在读学生

做这个项目的起因很简单——闲的蛋疼。但更重要的是，市面上的周易算命工具要么收费昂贵，要么算法简单不准确。既然会写代码又懂 AI，不如自己搓一个免费的。

更多详情请查看 [关于我](about.md)

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)

## ⚠️ 免责声明

本项目仅供学习研究使用，不构成任何专业建议。命运掌握在自己手中，请理性看待占卜结果。

---

<p align="center">
  <em>"反者道之动，弱者道之用。"</em>
</p>
