// ============== 二十四节气种植推荐系统 v6.0 ==============
// 深度重构版 - 引入专业农历算法，完全解决历法准确性问题

let solarTermsData = [];
let plantsData = {};
let lunarCalendar = null;

/**
 * 初始化应用
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化专业农历计算器（使用简易版本）
    lunarCalendar = new SimpleLunarConverter();
    
    loadAllData();
});

/**
 * 加载所有数据
 */
async function loadAllData() {
    try {
        const [termsRes, plantsRes] = await Promise.all([
            fetch('data/solar-terms.json'),
            fetch('data/plants.json')
        ]);
        
        solarTermsData = (await termsRes.json()).solarTerms || [];
        plantsData = (await plantsRes.json()).plants || [];
        
        console.log(`✅ 数据加载完成：${solarTermsData.length}个节气，${plantsData.length}种植物`);
        
        updateApp();
    } catch (error) {
        console.error('❌ 数据加载失败:', error);
        showError('数据加载失败，请检查网络连接');
    }
}

/**
 * 更新整个应用界面
 */
function updateApp() {
    updateTimeDisplay();
    updateRecommendations();
    updateSolarTermInfo();
}

/**
 * 更新时间显示（核心修复点）
 */
function updateTimeDisplay() {
    const now = new Date();
    
    // 使用专业农历转换器
    const lunarResult = lunarCalendar.solarToLunar(now.getFullYear(), now.getMonth() + 1, now.getDate());
    
    // 获取节气信息
    const solarTermInfo = lunarCalendar.getSolarTerm(now);
    
    // 格式化时间
    const timeString = now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // 公历日期
    const dateString = now.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    });
    
    // 农历信息
    const lunarText = lunarResult.lunar.fullText;
    
    // 当前节气
    const currentTerm = solarTermInfo.current.name;
    const nextTerm = solarTermInfo.next.name;
    const daysToNext = solarTermInfo.daysToNext;
    
    // 更新页面元素 - 使用正确的 ID
    const currentDateTimeEl = document.getElementById('currentDateTime');
    const lunarDateEl = document.getElementById('lunarDate');
    const termNameEl = document.querySelector('.term-name');
    const countdownTimeEl = document.querySelector('.countdown-time');
    
    if (currentDateTimeEl) {
        currentDateTimeEl.innerHTML = `
            <div class="date-line">
                <span class="solar-date">${dateString}</span>
                <span class="time">${timeString}</span>
            </div>
        `;
    }
    
    if (lunarDateEl) {
        lunarDateEl.textContent = `📅 ${lunarText}`;
    }
    
    if (termNameEl) {
        termNameEl.textContent = currentTerm;
    }
    
    if (countdownTimeEl) {
        countdownTimeEl.textContent = `${daysToNext}天后`;
    }
}

/**
 * 更新推荐内容（根据当前节气）
 */
function updateRecommendations() {
    const now = new Date();
    const lunarInfo = lunarCalendar.getSolarTerm(now);
    const currentTermName = lunarInfo.current.name;
    
    // 找到适合当前节气的植物
    const seasonPlants = plantsData.filter(plant => 
        plant.suitableTerms && plant.suitableTerms.includes(currentTermName)
    );
    
    const recommendationsEl = document.getElementById('seasonalPlants');
    if (!recommendationsEl) return;
    
    recommendationsEl.innerHTML = '';
    
    if (seasonPlants.length === 0) {
        recommendationsEl.innerHTML = '<p class="no-data">该季节暂无推荐植物</p>';
        return;
    }
    
    seasonPlants.forEach(plant => {
        const card = document.createElement('div');
        card.className = 'plant-card';
        
        // 生成图标（取首字）
        const icon = plant.name.charAt(0);
        
        card.innerHTML = `
            <div class="plant-icon" style="background: ${getColorByIndex(plant.id)}">${icon}</div>
            <div class="plant-info">
                <h3>${plant.name}</h3>
                <p class="plant-desc">${plant.classification?.科 || ''}${plant.classification?.属 || ''}</p>
                <div class="plant-meta">
                    <span><strong>种植季节:</strong> ${plant.plantingSeason}</span>
                    <span><strong>收获季节:</strong> ${plant.harvestSeason}</span>
                </div>
                <div class="plant-care">
                    <strong>💡 护理要点：</strong>
                    ${Array.isArray(plant.care) ? plant.care.join(' · ') : plant.care}
                </div>
            </div>
        `;
        
        recommendationsEl.appendChild(card);
    });
}

/**
 * 获取颜色（用于植物卡片装饰）
 */
function getColorByIndex(idStr) {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
        hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

/**
 * 更新节气百科信息
 */
function updateSolarTermInfo() {
    const infoEl = document.getElementById('termsGrid');
    if (!infoEl) return;
    
    // 找到当前节气
    const now = new Date();
    const lunarInfo = lunarCalendar.getSolarTerm(now);
    const currentTermName = lunarInfo.current.name;
    const currentTermData = solarTermsData.find(term => term.name === currentTermName);
    
    // 清空并填充所有节气卡片
    infoEl.innerHTML = '';
    
    if (solarTermsData.length === 0) {
        infoEl.innerHTML = '<p class="no-data">数据加载中...</p>';
        return;
    }
    
    solarTermsData.forEach(term => {
        const isCurrent = term.name === currentTermName;
        const card = document.createElement('div');
        card.className = 'term-card' + (isCurrent ? ' current-term-card' : '');
        
        card.innerHTML = `
            <div class="term-card-header">
                <h3>${term.name}</h3>
                ${isCurrent ? '<span class="current-badge">当前节气</span>' : `<span class="term-order">第${term.order}个节气</span>`}
            </div>
            <div class="term-date">${term.dateRange}</div>
            <div class="term-season"><strong>季节:</strong> ${term.season}</div>
            <div class="term-climate"><strong>气候:</strong> ${term.climate}</div>
            <div class="term-customs">
                <strong>习俗:</strong>${Array.isArray(term.customs) ? term.customs.slice(0, 3).join(' · ') : term.customs}
            </div>
            <div class="term-planting">
                <strong>农事:</strong> ${term.plantingTips || term.agriculture || '-'}
            </div>
        `;
        
        infoEl.appendChild(card);
    });
}

/**
 * 显示错误信息
 */
function showError(message) {
    const container = document.getElementById('app-container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    container.prepend(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

/**
 * 每秒更新时间（只更新时分秒，减少性能开销）
 */
setInterval(() => {
    const now = new Date();
    const timeEl = document.querySelector('.time');
    if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}, 1000);

// ==================== 测试模式（开发者专用）====================
// 在浏览器控制台输入 testLunarCalendar() 可以测试农历转换功能
function testLunarCalendar() {
    if (!lunarCalendar) {
        console.error('农历计算器未初始化');
        return;
    }
    
    const testCases = [
        { year: 2026, month: 3, day: 20 }, // 春分
        { year: 2026, month: 4, day: 4 },  // 清明
        { year: 2026, month: 1, day: 1 },  // 元旦
        { year: 2026, month: 2, day: 17 }, // 春节
        { year: 2025, month: 10, day: 6 }, // 中秋节附近
    ];
    
    console.log('===== 农历转换测试 =====');
    testCases.forEach(tc => {
        const result = lunarCalendar.solarToLunar(tc.year, tc.month, tc.day);
        console.log(`${tc.year}-${tc.month}-${tc.day} → ${result.lunar.fullText} (${result.lunar.animal})`);
    });
    
    console.log('\n===== 节气计算测试 =====');
    const now = new Date();
    const termInfo = lunarCalendar.getSolarTerm(now);
    console.log(`当前：${termInfo.current.name}`);
    console.log(`下一个：${termInfo.next.name}（距离${termInfo.daysToNext}天）`);
}

// 暴露到全局供调试
window.PlantApp = {
    lunarCalendar,
    solarTermsData,
    plantsData,
    testLunarCalendar,
    updateTimeDisplay
};

console.log('🌱 Plant v6.0 启动完成！输入 window.PlantApp.testLunarCalendar() 测试农历功能');
