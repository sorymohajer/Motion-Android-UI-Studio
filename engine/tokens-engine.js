// Design Tokens Engine - محرك رموز التصميم
class TokensEngine {
    constructor() {
        this.tokens = {
            colors: {},
            typography: {},
            spacing: {},
            radius: {},
            elevation: {},
            animation: {},
            breakpoints: {}
        };
        
        this.initializeDefaultTokens();
    }

    // تهيئة الرموز الافتراضية
    initializeDefaultTokens() {
        // رموز الألوان
        this.tokens.colors = {
            primary: {
                50: '#E3F2FD',
                100: '#BBDEFB',
                200: '#90CAF9',
                300: '#64B5F6',
                400: '#42A5F5',
                500: '#2196F3',
                600: '#1E88E5',
                700: '#1976D2',
                800: '#1565C0',
                900: '#0D47A1'
            },
            secondary: {
                50: '#E0F2F1',
                100: '#B2DFDB',
                200: '#80CBC4',
                300: '#4DB6AC',
                400: '#26A69A',
                500: '#009688',
                600: '#00897B',
                700: '#00796B',
                800: '#00695C',
                900: '#004D40'
            },
            neutral: {
                0: '#FFFFFF',
                50: '#FAFAFA',
                100: '#F5F5F5',
                200: '#EEEEEE',
                300: '#E0E0E0',
                400: '#BDBDBD',
                500: '#9E9E9E',
                600: '#757575',
                700: '#616161',
                800: '#424242',
                900: '#212121',
                1000: '#000000'
            },
            semantic: {
                success: '#4CAF50',
                warning: '#FF9800',
                error: '#F44336',
                info: '#2196F3'
            }
        };

        // رموز الطباعة
        this.tokens.typography = {
            fontFamily: {
                primary: 'Roboto, sans-serif',
                secondary: 'Roboto Mono, monospace',
                display: 'Roboto, sans-serif'
            },
            fontSize: {
                xs: '12px',
                sm: '14px',
                base: '16px',
                lg: '18px',
                xl: '20px',
                '2xl': '24px',
                '3xl': '30px',
                '4xl': '36px',
                '5xl': '48px',
                '6xl': '60px'
            },
            fontWeight: {
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                extrabold: 800
            },
            lineHeight: {
                tight: 1.25,
                snug: 1.375,
                normal: 1.5,
                relaxed: 1.625,
                loose: 2
            },
            letterSpacing: {
                tighter: '-0.05em',
                tight: '-0.025em',
                normal: '0em',
                wide: '0.025em',
                wider: '0.05em',
                widest: '0.1em'
            }
        };

        // رموز التباعد
        this.tokens.spacing = {
            0: '0px',
            1: '4px',
            2: '8px',
            3: '12px',
            4: '16px',
            5: '20px',
            6: '24px',
            8: '32px',
            10: '40px',
            12: '48px',
            16: '64px',
            20: '80px',
            24: '96px',
            32: '128px'
        };

        // رموز الانحناء
        this.tokens.radius = {
            none: '0px',
            sm: '2px',
            base: '4px',
            md: '6px',
            lg: '8px',
            xl: '12px',
            '2xl': '16px',
            '3xl': '24px',
            full: '9999px'
        };

        // رموز الارتفاع/الظلال
        this.tokens.elevation = {
            0: 'none',
            1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
            2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
            3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
            4: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
            5: '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)'
        };

        // رموز الحركة
        this.tokens.animation = {
            duration: {
                fast: '150ms',
                normal: '300ms',
                slow: '500ms',
                slower: '800ms'
            },
            easing: {
                linear: 'linear',
                easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
                easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
                easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
                bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            }
        };

        // نقاط الكسر
        this.tokens.breakpoints = {
            xs: '320px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px'
        };
    }

    // تحديث رموز الألوان من الثيم الحالي
    updateColorsFromTheme(themeColors) {
        if (!themeColors) return;

        // تحديث الألوان الأساسية
        this.tokens.colors.primary[500] = themeColors.primary;
        this.tokens.colors.primary[600] = themeColors.primaryVariant;
        this.tokens.colors.secondary[500] = themeColors.secondary;
        
        // توليد تدرجات الألوان
        this.generateColorScale('primary', themeColors.primary);
        this.generateColorScale('secondary', themeColors.secondary);
        
        // تحديث ألوان النظام
        this.tokens.colors.background = themeColors.background;
        this.tokens.colors.surface = themeColors.surface;
        this.tokens.colors.error = themeColors.error;
    }

    // توليد تدرج لوني
    generateColorScale(colorName, baseColor) {
        const hsl = this.hexToHsl(baseColor);
        const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
        
        scales.forEach(scale => {
            let lightness;
            if (scale === 500) {
                lightness = hsl[2]; // اللون الأساسي
            } else if (scale < 500) {
                // ألوان أفتح
                const factor = (500 - scale) / 500;
                lightness = hsl[2] + (95 - hsl[2]) * factor;
            } else {
                // ألوان أغمق
                const factor = (scale - 500) / 400;
                lightness = hsl[2] * (1 - factor * 0.8);
            }
            
            this.tokens.colors[colorName][scale] = this.hslToHex(hsl[0], hsl[1], lightness);
        });
    }

    // تحويل HEX إلى HSL
    hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

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

    // تصدير الرموز كـ JSON
    exportAsJSON() {
        return JSON.stringify(this.tokens, null, 2);
    }

    // تصدير الرموز كـ CSS Variables
    exportAsCSS() {
        let css = ':root {\n';
        
        // ألوان
        Object.entries(this.tokens.colors).forEach(([category, colors]) => {
            if (typeof colors === 'object' && colors !== null) {
                Object.entries(colors).forEach(([shade, value]) => {
                    css += `  --color-${category}-${shade}: ${value};\n`;
                });
            } else {
                css += `  --color-${category}: ${colors};\n`;
            }
        });
        
        // طباعة
        Object.entries(this.tokens.typography).forEach(([category, values]) => {
            Object.entries(values).forEach(([key, value]) => {
                css += `  --typography-${category}-${key}: ${value};\n`;
            });
        });
        
        // تباعد
        Object.entries(this.tokens.spacing).forEach(([key, value]) => {
            css += `  --spacing-${key}: ${value};\n`;
        });
        
        // انحناء
        Object.entries(this.tokens.radius).forEach(([key, value]) => {
            css += `  --radius-${key}: ${value};\n`;
        });
        
        // ارتفاع
        Object.entries(this.tokens.elevation).forEach(([key, value]) => {
            css += `  --elevation-${key}: ${value};\n`;
        });
        
        // حركة
        Object.entries(this.tokens.animation).forEach(([category, values]) => {
            Object.entries(values).forEach(([key, value]) => {
                css += `  --animation-${category}-${key}: ${value};\n`;
            });
        });
        
        css += '}\n';
        return css;
    }

    // تصدير الرموز كـ Android XML
    exportAsAndroidXML() {
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
        
        // ألوان
        xml += '    <!-- Colors -->\n';
        Object.entries(this.tokens.colors).forEach(([category, colors]) => {
            if (typeof colors === 'object' && colors !== null) {
                Object.entries(colors).forEach(([shade, value]) => {
                    xml += `    <color name="${category}_${shade}">${value}</color>\n`;
                });
            } else {
                xml += `    <color name="${category}">${colors}</color>\n`;
            }
        });
        
        // أبعاد
        xml += '\n    <!-- Dimensions -->\n';
        Object.entries(this.tokens.spacing).forEach(([key, value]) => {
            xml += `    <dimen name="spacing_${key}">${value.replace('px', 'dp')}</dimen>\n`;
        });
        
        Object.entries(this.tokens.radius).forEach(([key, value]) => {
            if (value !== '9999px') {
                xml += `    <dimen name="radius_${key}">${value.replace('px', 'dp')}</dimen>\n`;
            }
        });
        
        xml += '</resources>\n';
        return xml;
    }

    // تصدير الرموز كـ Jetpack Compose
    exportAsCompose() {
        let compose = `package com.example.ui.theme

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

object DesignTokens {
    
    // Colors
    object Colors {
`;
        
        // ألوان
        Object.entries(this.tokens.colors).forEach(([category, colors]) => {
            if (typeof colors === 'object' && colors !== null) {
                compose += `        object ${this.capitalize(category)} {\n`;
                Object.entries(colors).forEach(([shade, value]) => {
                    compose += `            val _${shade} = Color(0xFF${value.substring(1)})\n`;
                });
                compose += '        }\n\n';
            } else {
                compose += `        val ${category} = Color(0xFF${colors.substring(1)})\n`;
            }
        });
        
        compose += `    }
    
    // Spacing
    object Spacing {
`;
        
        // تباعد
        Object.entries(this.tokens.spacing).forEach(([key, value]) => {
            compose += `        val _${key} = ${value.replace('px', '.dp')}\n`;
        });
        
        compose += `    }
    
    // Corner Radius
    object Radius {
`;
        
        // انحناء
        Object.entries(this.tokens.radius).forEach(([key, value]) => {
            if (value !== '9999px') {
                compose += `        val ${key} = ${value.replace('px', '.dp')}\n`;
            } else {
                compose += `        val ${key} = 50.dp // Full radius\n`;
            }
        });
        
        compose += `    }
    
    // Typography
    object Typography {
        object FontSize {
`;
        
        // أحجام الخط
        Object.entries(this.tokens.typography.fontSize).forEach(([key, value]) => {
            compose += `            val ${key} = ${value.replace('px', '.sp')}\n`;
        });
        
        compose += `        }
        
        object FontWeight {
`;
        
        // أوزان الخط
        Object.entries(this.tokens.typography.fontWeight).forEach(([key, value]) => {
            compose += `            val ${key} = androidx.compose.ui.text.font.FontWeight(${value})\n`;
        });
        
        compose += `        }
    }
    
    // Animation
    object Animation {
        object Duration {
`;
        
        // مدة الحركة
        Object.entries(this.tokens.animation.duration).forEach(([key, value]) => {
            compose += `            val ${key} = ${value.replace('ms', '')}\n`;
        });
        
        compose += `        }
    }
}`;
        
        return compose;
    }

    // تصدير الرموز كـ Swift (SwiftUI)
    exportAsSwift() {
        let swift = `import SwiftUI

struct DesignTokens {
    
    // MARK: - Colors
    struct Colors {
`;
        
        // ألوان
        Object.entries(this.tokens.colors).forEach(([category, colors]) => {
            if (typeof colors === 'object' && colors !== null) {
                swift += `        struct ${this.capitalize(category)} {\n`;
                Object.entries(colors).forEach(([shade, value]) => {
                    const rgb = this.hexToRgb(value);
                    swift += `            static let _${shade} = Color(red: ${(rgb.r/255).toFixed(3)}, green: ${(rgb.g/255).toFixed(3)}, blue: ${(rgb.b/255).toFixed(3)})\n`;
                });
                swift += '        }\n\n';
            }
        });
        
        swift += `    }
    
    // MARK: - Spacing
    struct Spacing {
`;
        
        // تباعد
        Object.entries(this.tokens.spacing).forEach(([key, value]) => {
            swift += `        static let _${key}: CGFloat = ${value.replace('px', '')}\n`;
        });
        
        swift += `    }
    
    // MARK: - Corner Radius
    struct Radius {
`;
        
        // انحناء
        Object.entries(this.tokens.radius).forEach(([key, value]) => {
            if (value !== '9999px') {
                swift += `        static let ${key}: CGFloat = ${value.replace('px', '')}\n`;
            } else {
                swift += `        static let ${key}: CGFloat = 50 // Full radius\n`;
            }
        });
        
        swift += `    }
}`;
        
        return swift;
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

    // تكبير أول حرف
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // تحديث رموز الحركة
    updateAnimationTokens(motionSettings) {
        if (motionSettings.duration) {
            this.tokens.animation.duration.custom = motionSettings.duration + 'ms';
        }
        if (motionSettings.easing) {
            this.tokens.animation.easing.custom = motionSettings.easing;
        }
    }

    // تحديث رموز التباعد
    updateSpacingTokens(layoutSettings) {
        if (layoutSettings.spacing) {
            Object.entries(layoutSettings.spacing).forEach(([key, value]) => {
                this.tokens.spacing[key] = value + 'px';
            });
        }
    }

    // الحصول على رمز محدد
    getToken(category, key, subkey = null) {
        if (subkey) {
            return this.tokens[category]?.[key]?.[subkey];
        }
        return this.tokens[category]?.[key];
    }

    // تعيين رمز محدد
    setToken(category, key, value, subkey = null) {
        if (!this.tokens[category]) {
            this.tokens[category] = {};
        }
        
        if (subkey) {
            if (!this.tokens[category][key]) {
                this.tokens[category][key] = {};
            }
            this.tokens[category][key][subkey] = value;
        } else {
            this.tokens[category][key] = value;
        }
    }

    // تطبيق الرموز على CSS
    applyCSSTokens() {
        const css = this.exportAsCSS();
        
        // إزالة الأنماط السابقة
        const existingStyle = document.getElementById('design-tokens');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // إضافة الأنماط الجديدة
        const style = document.createElement('style');
        style.id = 'design-tokens';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // تحليل استخدام الرموز
    analyzeTokenUsage() {
        const usage = {
            colors: {},
            spacing: {},
            typography: {},
            total: 0
        };
        
        // فحص استخدام الألوان في CSS
        const stylesheets = document.styleSheets;
        for (let sheet of stylesheets) {
            try {
                const rules = sheet.cssRules || sheet.rules;
                for (let rule of rules) {
                    if (rule.style) {
                        const cssText = rule.style.cssText;
                        
                        // البحث عن متغيرات الألوان
                        const colorMatches = cssText.match(/var\(--color-[^)]+\)/g);
                        if (colorMatches) {
                            colorMatches.forEach(match => {
                                const tokenName = match.replace('var(--', '').replace(')', '');
                                usage.colors[tokenName] = (usage.colors[tokenName] || 0) + 1;
                                usage.total++;
                            });
                        }
                        
                        // البحث عن متغيرات التباعد
                        const spacingMatches = cssText.match(/var\(--spacing-[^)]+\)/g);
                        if (spacingMatches) {
                            spacingMatches.forEach(match => {
                                const tokenName = match.replace('var(--', '').replace(')', '');
                                usage.spacing[tokenName] = (usage.spacing[tokenName] || 0) + 1;
                                usage.total++;
                            });
                        }
                    }
                }
            } catch (e) {
                // تجاهل الأخطاء في الوصول للـ stylesheets
            }
        }
        
        return usage;
    }

    // اقتراح تحسينات للرموز
    suggestTokenImprovements() {
        const suggestions = [];
        const usage = this.analyzeTokenUsage();
        
        // فحص الألوان غير المستخدمة
        Object.keys(this.tokens.colors).forEach(category => {
            if (typeof this.tokens.colors[category] === 'object') {
                Object.keys(this.tokens.colors[category]).forEach(shade => {
                    const tokenName = `color-${category}-${shade}`;
                    if (!usage.colors[tokenName]) {
                        suggestions.push({
                            type: 'unused-token',
                            category: 'colors',
                            token: tokenName,
                            message: `اللون ${tokenName} غير مستخدم`
                        });
                    }
                });
            }
        });
        
        // فحص التباعد المتكرر
        const spacingValues = Object.values(this.tokens.spacing);
        const duplicateSpacing = spacingValues.filter((value, index) => 
            spacingValues.indexOf(value) !== index
        );
        
        if (duplicateSpacing.length > 0) {
            suggestions.push({
                type: 'duplicate-values',
                category: 'spacing',
                message: 'يوجد قيم تباعد مكررة يمكن دمجها'
            });
        }
        
        return suggestions;
    }
}

// إنشاء مثيل عام
window.tokensEngine = new TokensEngine();