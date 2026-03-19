# 🌱 Plant - 二十四节气种植推荐系统

## ✨ 项目简介

基于中国二十四节气的智能植物种植推荐 Web 应用。参考 fruit 项目结构设计，采用纯前端实现，集成农历算法、节气计算引擎和数据驱动 UI。

---

## 🎯 三大核心功能模块

### 1️⃣ 时间与节气显示 (Time & Solar Term)
- ⏰ 实时公历日期时间显示（含时分秒）
- 📅 农历日期自动转换（年号 + 月日）
- 🌸 当前节气智能识别
- ⏳ 下一节气倒计时（天 + 小时）

### 2️⃣ 当季种植推荐 (Seasonal Planting)  
- 🌿 根据当前节气推荐适宜植物
- 📍 展示植物科属、别名、类型
- 🗺️ 适宜种植区域说明
- 📆 最佳播种与收获时间
- 💡 养护要点提示（标签形式）

### 3️⃣ 二十四节气百科 (Solar Terms Encyclopedia)
- 🎴 完整 24 节气网格卡片
- 🌈 四季不同配色（春绿夏金秋棕冬蓝）
- 📖 点击查看详情：
  - 气候特征
  - 物候现象（三候）
  - 传统习俗
  - 种植建议
  - 文化简介

---

## 📁 项目结构

```
plant/
├── index.html              # HTML5 主页面
├── app.js                  # 核心 JavaScript (380 行)
│   ├── SimpleLunar class   # 农历转换算法
│   ├── SolarTermsCalc class # 节气计算引擎
│   └── PlantApp class      # 应用主逻辑
├── style.css               # 响应式 CSS 样式
├── data/
│   ├── solar-terms.json    # 24 节气数据 (24 条)
│   └── plants.json         # 植物数据库 (22 种植物)
├── SKILL.md                # 本技能文档
├── README.md               # 项目说明
└── success_screenshot.png  # 效果截图
```

---

## 🚀 快速启动

### 本地测试
```bash
cd /app/working/mydata/plant
python3 -m http.server 8080
# 访问 http://localhost:8080
```

### GitHub Pages 部署
使用 `github-api-manager` skill:
```bash
copaw skill github-api-manager
```

---

## 🌟 技术亮点

| 特性 | 说明 |
|------|------|
| **纯前端** | 无需后端，浏览器直接运行 |
| **农历算法** | 集成 1900-2099 年农历转换 |
| **节气引擎** | 天文算法精确计算节气时刻 |
| **响应式设计** | 手机/平板/电脑自适应 |
| **数据驱动** | JSON 配置动态生成 UI |
| **美观设计** | 渐变色彩、卡片布局、模态框 |

---

## 📊 数据规模

- **24 个节气**: 立春 → 大寒，完整覆盖四季
- **22 种植物**: 番茄、黄瓜、生菜、菠菜、胡萝卜等常见蔬菜
- **数据结构**:
  ```json
  // 节气示例
  {
    "name": "清明",
    "season": "春季", 
    "climate": "天清地明，气爽风暖",
    "customs": ["扫墓祭祖", "踏青郊游"],
    "plantingTips": "植树造林，麦类追肥"
  }
  
  // 植物示例
  {
    "name": "番茄",
    "suitableTerms": ["惊蛰", "春分", "清明"],
    "regions": ["全国大部分地区"],
    "care": ["喜光温暖", "需支撑架"]
  }
  ```

---

## 🛠️ 扩展建议

1. **增加植物种类**: 在 `plants.json` 添加花卉、水果等
2. **地区筛选**: 按省份筛选适用植物
3. **收藏功能**: LocalStorage 保存用户收藏
4. **图片支持**: 为每种植物添加配图
5. **提醒服务**: 节气变化时的种植推送

---

## 👤 作者信息

- **创建者**: 喵有爱 (miaouai)
- **创建时间**: 2026-03-20
- **灵感来源**: 参考 fruit 项目结构
- **License**: MIT

---

## 🔗 相关链接

- 源代码：待部署到 https://github.com/miaouai/plant
- 在线演示：待部署到 https://miaouai.github.io/plant

---

*顺应天时，科学种植 🌱*
