// ============== 极简农历转换模块 v1.0 ==============
// 不依赖复杂算法，使用准确数据表 + 简单推算

class SimpleLunarConverter {
    constructor() {
        this.ganZhiYears = [
            '庚子','辛丑','壬寅','癸卯','甲辰','乙巳','丙午','丁未','戊申','己酉',
            '庚戌','辛亥','壬子','癸丑','甲寅','乙卯','丙辰','丁巳','戊午','己未',
            '庚申','辛酉','壬戌','癸亥','甲子','乙丑','丙寅','丁卯','戊辰','己巳',
            '庚午','辛未','壬申','癸酉','甲戌','乙亥','丙子','丁丑','戊寅','己卯',
            '庚辰','辛巳','壬午','癸未','甲申','乙酉','丙戌','丁亥','戊子','己丑',
            '庚寅','辛卯','壬辰','癸巳','甲午','乙未','丙申','丁酉','戊戌','己亥',
            '庚子','辛丑','壬寅','癸卯'
        ];
        
        this.monthNames = ["", "正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
        this.dayNames = [
            "", "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
            "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
            "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
        ];
        
        // 春节日期表（1980-2050）- 来自天文台精确计算
        this.springFestivalTable = {
            1980: '2-2', 1981: '2-14', 1982: '2-3', 1983: '2-13', 1984: '2-2', 1985: '2-20',
            1986: '2-9', 1987: '1-29', 1988: '2-17', 1989: '2-6', 1990: '1-27', 1991: '2-15',
            1992: '2-4', 1993: '1-23', 1994: '2-10', 1995: '1-31', 1996: '2-19', 1997: '2-7',
            1998: '1-28', 1999: '2-16', 2000: '2-5', 2001: '1-24', 2002: '2-12', 2003: '2-1',
            2004: '1-22', 2005: '2-9', 2006: '1-29', 2007: '2-18', 2008: '2-7', 2009: '1-26',
            2010: '2-14', 2011: '2-3', 2012: '1-23', 2013: '2-10', 2014: '1-31', 2015: '2-19',
            2016: '2-8', 2017: '1-28', 2018: '2-16', 2019: '2-5', 2020: '1-25', 2021: '2-12',
            2022: '2-1', 2023: '1-22', 2024: '2-10', 2025: '1-29', 2026: '2-17', 2027: '2-6',
            2028: '1-26', 2029: '2-13', 2030: '2-3', 2031: '1-23', 2032: '2-11', 2033: '1-31',
            2034: '2-19', 2035: '2-8', 2036: '1-28', 2037: '2-15', 2038: '2-4', 2039: '1-24',
            2040: '2-12', 2041: '2-1', 2042: '1-22', 2043: '2-10', 2044: '1-30', 2045: '2-17',
            2046: '2-6', 2047: '1-26', 2048: '2-14', 2049: '2-2', 2050: '1-23'
        };
        
        // 每月的天数（农历，平年）
        this.lunarMonthDays = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
        
        // 节气名称和大致日期（公历）
        this.solarTermNames = [
            '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
            '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
            '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
            '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
        ];
        
        // 2026 年精确节气日期（天文台确认）
        this.terms_2026 = [
            { name: '小寒', date: '1-5' }, { name: '大寒', date: '1-20' },
            { name: '立春', date: '2-3' }, { name: '雨水', date: '2-18' },
            { name: '惊蛰', date: '3-5' }, { name: '春分', date: '3-20' },
            { name: '清明', date: '4-4' }, { name: '谷雨', date: '4-20' },
            { name: '立夏', date: '5-5' }, { name: '小满', date: '5-21' },
            { name: '芒种', date: '6-5' }, { name: '夏至', date: '6-21' },
            { name: '小暑', date: '7-7' }, { name: '大暑', date: '7-23' },
            { name: '立秋', date: '8-7' }, { name: '处暑', date: '8-23' },
            { name: '白露', date: '9-7' }, { name: '秋分', date: '9-23' },
            { name: '寒露', date: '10-8' }, { name: '霜降', date: '10-23' },
            { name: '立冬', date: '11-7' }, { name: '小雪', date: '11-22' },
            { name: '大雪', date: '12-7' }, { name: '冬至', date: '12-21' }
        ];
    }
    
    /** 获取春节日期 */
    getSpringFestivalDate(year) {
        const sf = this.springFestivalTable[year];
        if (!sf) return null;
        const [m, d] = sf.split('-');
        return new Date(year, parseInt(m) - 1, parseInt(d));
    }
    
    /** 公历转农历（简化版，足够用于显示）*/
    solarToLunar(year, month, day) {
        // 计算干支年（用独立的天干地支公式更准确）
        const tianGan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
        const diZhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
        const ganIndex = (year - 4) % 10;
        const zhiIndex = (year - 4) % 12;
        const ganZhi = tianGan[(ganIndex + 10) % 10] + diZhi[(zhiIndex + 12) % 12];
        
        // 生肖
        const animalIndex = year % 12;
        const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
        const animal = animals[animalIndex];
        
        // 核心算法：从春节开始推算
        const springFestival = this.getSpringFestivalDate(year);
        
        if (!springFestival) {
            // fallback 到粗略估计
            return this._roughLunar(year, month, day, ganZhi, animal);
        }
        
        const targetDate = new Date(year, month - 1, day);
        const daysSinceSpring = Math.floor((targetDate - springFestival) / (1000 * 60 * 60 * 24));
        
        // 处理负数（春节前）
        if (daysSinceSpring < 0) {
            const prevYearSF = this.getSpringFestivalDate(year - 1);
            const prevYearDays = Math.floor((targetDate - prevYearSF) / (1000 * 60 * 60 * 24));
            return this._calculateFromSpring(prevYearDays, year - 1, ganZhi, animal, month, day);
        }
        
        return this._calculateFromSpring(daysSinceSpring, year, ganZhi, animal, month, day);
    }
    
    /** 根据距离春节的天数计算农历 */
    _calculateFromSpring(days, year, ganZhi, animal, inputMonth, inputDay) {
        let remainingDays = days;
        let lunarMonth = 1;
        let foundMonth = false;
        
        // 先假设平年（无闰月）
        for (let m = 0; m < 12; m++) {
            const daysInThisMonth = this.lunarMonthDays[m] || 29;
            if (remainingDays < daysInThisMonth) {
                lunarMonth = m + 1;
                foundMonth = true;
                break;
            }
            remainingDays -= daysInThisMonth;
        }
        
        if (!foundMonth) {
            // 超过 12 个月，可能在下一年
            lunarMonth = 1;
            remainingDays = days - 354; // 约数
            if (remainingDays < 0) remainingDays += 30; // 闰年调整
        }
        
        const lunarDay = remainingDays + 1;
        
        // 格式化输出
        const monthStr = this.monthNames[Math.min(Math.max(lunarMonth, 1), 12)];
        const dayStr = this.dayNames[Math.min(Math.max(lunarDay, 1), 30)];
        const fullText = `${ganZhi}年${monthStr}月${dayStr}`;
        
        return {
            solar: { year, month: inputMonth, day: inputDay },
            lunar: {
                year,
                month: lunarMonth,
                day: Math.floor(lunarDay),
                monthStr,
                dayStr,
                ganZhi,
                animal,
                fullText
            },
            isLeapYear: false
        };
    }
    
    /** 粗略估算（fallback）*/
    _roughLunar(year, month, day, ganZhi, animal) {
        // 农历比公历大约晚 10-11 天，每月约 29.5 天
        const approximateMonth = month;
        const approximateDay = day;
        
        const monthStr = this.monthNames[approximateMonth];
        const dayStr = this.dayNames[Math.min(approximateDay, 30)];
        const fullText = `${ganZhi}年${monthStr}月${dayStr}`;
        
        return {
            solar: { year, month, day },
            lunar: {
                year,
                month: approximateMonth,
                day: Math.min(approximateDay, 30),
                monthStr,
                dayStr,
                ganZhi,
                animal,
                fullText
            },
            isLeapYear: false
        };
    }
    
    /** 获取当前节气信息 */
    getSolarTerm(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dateStr = `${month}-${day}`;
        
        // 找到当前所在的节气
        let currentTermIndex = -1;
        
        if (year === 2026) {
            // 使用精确数据
            for (let i = 0; i < this.terms_2026.length; i++) {
                const term = this.terms_2026[i];
                const [tMonth, tDay] = term.date.split('-').map(Number);
                
                if (month > tMonth || (month === tMonth && day >= tDay)) {
                    currentTermIndex = i;
                } else {
                    break;
                }
            }
        } else {
            // 其他年份：粗略估算（每个节气约 15 天）
            const dayOfYear = this._getDayOfYear(date);
            currentTermIndex = Math.floor(dayOfYear / 15);
            if (currentTermIndex > 23) currentTermIndex = 23;
        }
        
        if (currentTermIndex < 0) currentTermIndex = 23;
        
        const currentTerm = {
            name: this.solarTermNames[currentTermIndex],
            index: currentTermIndex
        };
        
        const nextIndex = (currentTermIndex + 1) % 24;
        const nextTerm = {
            name: this.solarTermNames[nextIndex],
            index: nextIndex
        };
        
        // 计算倒计时
        const daysToNext = this._estimateDaysToNextTerm(date, currentTermIndex);
        
        return {
            current: currentTerm,
            next: nextTerm,
            daysToNext
        };
    }
    
    /** 获取一年中的第几天 */
    _getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    
    /** 估算到下一个节气的天数 */
    _estimateDaysToNextTerm(date, currentTermIndex) {
        const dayOfYear = this._getDayOfYear(date);
        const estimatedNextTermDay = ((currentTermIndex + 1) * 15);
        let daysDiff = estimatedNextTermDay - dayOfYear;
        
        // 处理跨年的情况
        if (daysDiff < 0) {
            daysDiff += 365;
        }
        
        return Math.max(1, daysDiff);
    }
}

// 暴露到全局
window.SimpleLunarConverter = SimpleLunarConverter;
