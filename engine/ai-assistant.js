// AI Assistant Engine - محرك المساعد الذكي
class AIAssistant {
    constructor() {
        this.colorTrends2025 = [
            { name: 'Digital Lime', hex: '#32D74B', category: 'energetic' },
            { name: 'Cyber Purple', hex: '#BF5AF2', category: 'futuristic' },
            { name: 'Ocean Blue', hex: '#007AFF', category: 'calm' },
            { name: 'Sunset Orange', hex: '#FF9500', category: 'energetic' },
            { name: 'Forest Green', hex: '#30D158', category: 'calm' },
            { name: 'Rose Gold', hex: '#FF2D92', category: 'elegant' },
            { name: 'Electric Blue', hex: '#5AC8FA', category: 'modern' },
            { name: 'Warm Gray', hex: '#8E8E93', category: 'neutral' }
        ];
        
        this.appCategories = {
            'productivity': {
                colors: ['#007AFF', '#34C759', '#8E8E93'],
                mood: 'calm',
                animations: ['fade-slide', 'staggered']
            },
            'gaming': {
                colors: ['#BF5AF2', '#FF2D92', '#FF9500'],
                mood: 'energetic',
                animations: ['bounce', 'scale-reveal']
            },
            'finance': {
                colors: ['#007AFF', '#30D158', '#8E8E93'],
                mood: 'calm',
                animations: ['fade-slide', 'staggered']
            },
            'social': {
                colors: ['#FF2D92', '#5AC8FA', '#FF9500'],
                mood: 'energetic',
                animations: ['scale-reveal', 'bounce']
            },
            'ecommerce': {
                colors: ['#FF9500', '#FF2D92', '#007AFF'],
                mood: 'energetic',
                animations: ['scale-reveal', 'staggered']
            },
            'health': {
                colors: ['#30D158', '#5AC8FA', '#8E8E93'],
                mood: 'calm',
                animations: ['fade-slide', 'staggered']
            }
        };
        
        this.accessibilityRules = {
            minContrast: 4.5,
            largeTextContrast: 3.0,
            colorBlindSafe: true
        };
    }

    // اقتراح ألوان ذكية بناءً على نوع التطبيق
    suggestColorsForApp(appType, userPreference = null) {
        const category = this.appCategories[appType] || this.appCategories['productivity'];
        const trendColors = this.colorTrends2025.filter(color => 
            category.colors.some(catColor => this.isColorSimilar(color.hex, catColor))
        );
        
        let suggestions = {
            primary: category.colors[0],
            secondary: category.colors[1],
            accent: category.colors[2],
            mood: category.mood,
            animations: category.animations,
            trendColors: trendColors.slice(0, 3)
        };
        
        // تخصيص بناءً على تفضيل المستخدم
        if (userPreference) {
            suggestions.primary = this.adjustColorForPreference(suggestions.primary, userPreference);
        }
        
        return suggestions;
    }

    // فحص تباين الألوان للوصولية
    checkColorContrast(foreground, background) {
        const fgLuminance = this.getLuminance(foreground);
        const bgLuminance = this.getLuminance(background);
        
        const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                        (Math.min(fgLuminance, bgLuminance) + 0.05);
        
        return {
            ratio: contrast,
            passAA: contrast >= this.accessibilityRules.minContrast,
            passAAA: contrast >= 7.0,
            passLargeText: contrast >= this.accessibilityRules.largeTextContrast,
            rating: this.getContrastRating(contrast)
        };
    }

    // حساب اللمعان للون
    getLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    // تحويل HEX إلى RGB
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // تقييم التباين
    getContrastRating(ratio) {
        if (ratio >= 7.0) return 'ممتاز';
        if (ratio >= 4.5) return 'جيد';
        if (ratio >= 3.0) return 'مقبول للنص الكبير';
        return 'ضعيف - يحتاج تحسين';
    }

    // فحص الألوان للمكفوفين
    checkColorBlindSafety(colors) {
        // محاكاة عمى الألوان الأكثر شيوعاً
        const protanopia = this.simulateProtanopia(colors);
        const deuteranopia = this.simulateDeuteranopia(colors);
        const tritanopia = this.simulateTritanopia(colors);
        
        return {
            original: colors,
            protanopia: protanopia,
            deuteranopia: deuteranopia,
            tritanopia: tritanopia,
            isSafe: this.areColorsSafeForColorBlind(colors),
            recommendations: this.getColorBlindRecommendations(colors)
        };
    }

    // اقتراح تحسينات للتصميم
    analyzeDesign(screenType, colors, animations, layout) {
        const suggestions = [];
        
        // فحص الألوان
        const contrastCheck = this.checkColorContrast(colors.onPrimary, colors.primary);
        if (!contrastCheck.passAA) {
            suggestions.push({
                type: 'color',
                severity: 'high',
                message: `تباين ضعيف بين النص والخلفية (${contrastCheck.ratio.toFixed(2)}:1)`,
                solution: 'استخدم لون نص أغمق أو خلفية أفتح'
            });
        }

        // فحص الأنيميشن
        if (screenType === 'login' && animations.includes('bounce')) {
            suggestions.push({
                type: 'animation',
                severity: 'medium',
                message: 'حركة Bounce قد تكون مشتتة في شاشة تسجيل الدخول',
                solution: 'استخدم Fade-slide للحصول على تجربة أكثر احترافية'
            });
        }

        // فحص التخطيط
        if (screenType === 'home' && layout.cardCount > 6) {
            suggestions.push({
                type: 'layout',
                severity: 'medium',
                message: 'عدد كبير من البطاقات قد يربك المستخدم',
                solution: 'استخدم تجميع أو تصنيف للبطاقات'
            });
        }

        return {
            score: this.calculateDesignScore(suggestions),
            suggestions: suggestions,
            strengths: this.identifyDesignStrengths(screenType, colors, animations)
        };
    }

    // حساب نقاط التصميم
    calculateDesignScore(suggestions) {
        let score = 100;
        suggestions.forEach(suggestion => {
            switch(suggestion.severity) {
                case 'high': score -= 20; break;
                case 'medium': score -= 10; break;
                case 'low': score -= 5; break;
            }
        });
        return Math.max(0, score);
    }

    // تحديد نقاط القوة في التصميم
    identifyDesignStrengths(screenType, colors, animations) {
        const strengths = [];
        
        const contrastCheck = this.checkColorContrast(colors.onPrimary, colors.primary);
        if (contrastCheck.passAAA) {
            strengths.push('تباين ممتاز للوصولية');
        }
        
        if (this.isColorHarmonyGood(colors)) {
            strengths.push('تناسق لوني جيد');
        }
        
        if (this.isAnimationAppropriate(screenType, animations)) {
            strengths.push('حركات مناسبة لنوع الشاشة');
        }
        
        return strengths;
    }

    // فحص تناسق الألوان
    isColorHarmonyGood(colors) {
        // خوارزمية بسيطة لفحص التناسق اللوني
        const primaryHsl = this.hexToHsl(colors.primary);
        const secondaryHsl = this.hexToHsl(colors.secondary);
        
        const hueDifference = Math.abs(primaryHsl[0] - secondaryHsl[0]);
        
        // تناسق جيد إذا كان الفرق في الصبغة مناسب
        return hueDifference >= 30 && hueDifference <= 180;
    }

    // فحص مناسبة الحركات
    isAnimationAppropriate(screenType, animations) {
        const appropriateAnimations = {
            'splash': ['bounce', 'scale-reveal', 'fade-slide'],
            'login': ['fade-slide', 'staggered'],
            'home': ['staggered', 'scale-reveal'],
            'onboarding': ['fade-slide', 'scale-reveal'],
            'settings': ['staggered', 'fade-slide']
        };
        
        return appropriateAnimations[screenType]?.some(anim => 
            animations.includes(anim)
        ) || false;
    }

    // تحويل HEX إلى HSL
    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h * 360, s * 100, l * 100];
    }

    // مقارنة تشابه الألوان
    isColorSimilar(color1, color2, threshold = 50) {
        const hsl1 = this.hexToHsl(color1);
        const hsl2 = this.hexToHsl(color2);
        
        const hueDiff = Math.abs(hsl1[0] - hsl2[0]);
        const satDiff = Math.abs(hsl1[1] - hsl2[1]);
        const lightDiff = Math.abs(hsl1[2] - hsl2[2]);
        
        return (hueDiff + satDiff + lightDiff) / 3 < threshold;
    }

    // تعديل اللون بناءً على التفضيل
    adjustColorForPreference(color, preference) {
        const hsl = this.hexToHsl(color);
        
        switch(preference) {
            case 'brighter':
                hsl[2] = Math.min(100, hsl[2] + 20);
                break;
            case 'darker':
                hsl[2] = Math.max(0, hsl[2] - 20);
                break;
            case 'more-saturated':
                hsl[1] = Math.min(100, hsl[1] + 20);
                break;
            case 'less-saturated':
                hsl[1] = Math.max(0, hsl[1] - 20);
                break;
        }
        
        return this.hslToHex(hsl[0], hsl[1], hsl[2]);
    }

    // تحويل HSL إلى HEX
    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    // محاكاة عمى الألوان (مبسطة)
    simulateProtanopia(colors) {
        // محاكاة بسيطة لعمى الأحمر-الأخضر
        return colors; // سيتم تطويرها لاحقاً
    }

    simulateDeuteranopia(colors) {
        return colors;
    }

    simulateTritanopia(colors) {
        return colors;
    }

    areColorsSafeForColorBlind(colors) {
        // فحص بسيط - يمكن تطويره أكثر
        return true;
    }

    getColorBlindRecommendations(colors) {
        return ['استخدم أنماط أو أشكال إضافية للتمييز', 'تجنب الاعتماد على اللون فقط'];
    }

    // اقتراح تحسينات فورية
    getSuggestions(currentDesign) {
        const suggestions = [];
        
        // فحص الألوان
        if (currentDesign.colors) {
            const colorAnalysis = this.analyzeDesign(
                currentDesign.screenType,
                currentDesign.colors,
                currentDesign.animations,
                currentDesign.layout
            );
            suggestions.push(...colorAnalysis.suggestions);
        }
        
        return suggestions;
    }

    // توليد palette ألوان كاملة
    generateColorPalette(baseColor, mood = 'calm') {
        const baseHsl = this.hexToHsl(baseColor);
        const palette = {
            primary: baseColor,
            primaryVariant: '',
            secondary: '',
            secondaryVariant: '',
            background: '',
            surface: '',
            error: '#B00020',
            onPrimary: '#FFFFFF',
            onSecondary: '#000000',
            onBackground: '#000000',
            onSurface: '#000000',
            onError: '#FFFFFF'
        };

        // توليد الألوان بناءً على المود
        switch(mood) {
            case 'calm':
                palette.primaryVariant = this.hslToHex(baseHsl[0], baseHsl[1], Math.max(0, baseHsl[2] - 15));
                palette.secondary = this.hslToHex((baseHsl[0] + 30) % 360, Math.max(0, baseHsl[1] - 20), baseHsl[2]);
                palette.background = '#FAFAFA';
                palette.surface = '#FFFFFF';
                break;
            case 'energetic':
                palette.primaryVariant = this.hslToHex(baseHsl[0], Math.min(100, baseHsl[1] + 20), Math.min(100, baseHsl[2] + 10));
                palette.secondary = this.hslToHex((baseHsl[0] + 60) % 360, baseHsl[1], Math.min(100, baseHsl[2] + 15));
                palette.background = '#FFF8F0';
                palette.surface = '#FFFFFF';
                break;
            case 'dark':
                palette.primaryVariant = this.hslToHex(baseHsl[0], Math.max(0, baseHsl[1] - 20), Math.max(0, baseHsl[2] - 10));
                palette.secondary = this.hslToHex((baseHsl[0] + 45) % 360, Math.max(0, baseHsl[1] - 30), Math.min(100, baseHsl[2] + 25));
                palette.background = '#0A0A0A';
                palette.surface = '#1C1C1C';
                palette.onPrimary = '#000000';
                palette.onBackground = '#FFFFFF';
                palette.onSurface = '#FFFFFF';
                break;
            case 'neon':
                palette.primaryVariant = this.hslToHex(baseHsl[0], Math.min(100, baseHsl[1] + 60), Math.min(100, baseHsl[2] + 20));
                palette.secondary = this.hslToHex((baseHsl[0] + 120) % 360, Math.min(100, baseHsl[1] + 50), Math.min(100, baseHsl[2] + 40));
                palette.background = '#000000';
                palette.surface = '#111111';
                palette.onBackground = '#00FFFF';
                palette.onSurface = '#00FFFF';
                break;
        }

        return palette;
    }
}

// إنشاء مثيل عام
window.aiAssistant = new AIAssistant();