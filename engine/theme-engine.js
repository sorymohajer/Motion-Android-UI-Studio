// Theme Engine - محرك الألوان والثيمات
class ThemeEngine {
    constructor() {
        this.currentTheme = 'light';
        this.currentPreset = 'minimal';
        this.primaryColor = '#6200EE';
        this.mood = 'calm';
        this.colorScheme = {};
        
        this.generateColorScheme();
    }

    // توليد مخطط الألوان التلقائي
    generateColorScheme() {
        const primary = this.hexToHsl(this.primaryColor);
        
        // توليد الألوان بناءً على البريست والمود
        if (this.currentPreset === 'dark') {
            this.colorScheme = this.generateDarkColors(primary);
        } else if (this.currentPreset === 'glass') {
            this.colorScheme = this.generateGlassColors(primary);
        } else if (this.currentPreset === 'material') {
            this.colorScheme = this.generateMaterialColors(primary);
        } else if (this.currentPreset === 'gradient') {
            this.colorScheme = this.generateGradientColors(primary);
        } else if (this.currentPreset === 'cyber') {
            this.colorScheme = this.generateCyberColors(primary);
        } else {
            // minimal preset أو default
            switch(this.mood) {
                case 'calm':
                    this.colorScheme = this.generateCalmColors(primary);
                    break;
                case 'energetic':
                    this.colorScheme = this.generateEnergeticColors(primary);
                    break;
                case 'dark':
                    this.colorScheme = this.generateDarkColors(primary);
                    break;
                case 'neon':
                    this.colorScheme = this.generateNeonColors(primary);
                    break;
                default:
                    this.colorScheme = this.generateCalmColors(primary);
            }
        }
        
        console.log('Generated color scheme:', this.colorScheme);
    }

    generateCalmColors(primary) {
        return {
            primary: this.primaryColor,
            primaryVariant: this.adjustColor(primary, -20, 0, -10),
            secondary: this.adjustColor(primary, 30, -20, 0),
            secondaryVariant: this.adjustColor(primary, 30, -20, -15),
            background: this.currentTheme === 'light' ? '#FAFAFA' : '#121212',
            surface: this.currentTheme === 'light' ? '#FFFFFF' : '#1E1E1E',
            error: '#B00020',
            onPrimary: '#FFFFFF',
            onSecondary: '#000000',
            onBackground: this.currentTheme === 'light' ? '#000000' : '#FFFFFF',
            onSurface: this.currentTheme === 'light' ? '#000000' : '#FFFFFF',
            onError: '#FFFFFF'
        };
    }

    generateEnergeticColors(primary) {
        return {
            primary: this.primaryColor,
            primaryVariant: this.adjustColor(primary, 0, 20, 10),
            secondary: this.adjustColor(primary, 60, 0, 15),
            secondaryVariant: this.adjustColor(primary, 60, 10, 0),
            background: this.currentTheme === 'light' ? '#FFF8F0' : '#1A1A1A',
            surface: this.currentTheme === 'light' ? '#FFFFFF' : '#2A2A2A',
            error: '#FF5722',
            onPrimary: '#FFFFFF',
            onSecondary: '#000000',
            onBackground: this.currentTheme === 'light' ? '#000000' : '#FFFFFF',
            onSurface: this.currentTheme === 'light' ? '#000000' : '#FFFFFF',
            onError: '#FFFFFF'
        };
    }

    generateDarkColors(primary) {
        return {
            primary: this.adjustColor(primary, 0, -10, 20),
            primaryVariant: this.adjustColor(primary, 0, -20, 10),
            secondary: this.adjustColor(primary, 45, -30, 25),
            secondaryVariant: this.adjustColor(primary, 45, -40, 15),
            background: '#0A0A0A',
            surface: '#1C1C1C',
            error: '#CF6679',
            onPrimary: '#000000',
            onSecondary: '#FFFFFF',
            onBackground: '#FFFFFF',
            onSurface: '#FFFFFF',
            onError: '#000000'
        };
    }

    generateNeonColors(primary) {
        return {
            primary: this.adjustColor(primary, 0, 40, 30),
            primaryVariant: this.adjustColor(primary, 0, 60, 20),
            secondary: this.adjustColor(primary, 120, 50, 40),
            secondaryVariant: this.adjustColor(primary, 120, 70, 30),
            background: '#000000',
            surface: '#111111',
            error: '#FF0080',
            onPrimary: '#000000',
            onSecondary: '#000000',
            onBackground: '#00FFFF',
            onSurface: '#00FFFF',
            onError: '#FFFFFF'
        };
    }

    generateGlassColors(primary) {
        return {
            primary: this.primaryColor,
            primaryVariant: this.adjustColor(primary, 0, 0, -15),
            secondary: this.adjustColor(primary, 30, -10, 10),
            secondaryVariant: this.adjustColor(primary, 30, -10, -5),
            background: 'rgba(255, 255, 255, 0.1)',
            surface: 'rgba(255, 255, 255, 0.2)',
            error: '#FF6B6B',
            onPrimary: '#FFFFFF',
            onSecondary: '#000000',
            onBackground: '#FFFFFF',
            onSurface: '#FFFFFF',
            onError: '#FFFFFF'
        };
    }

    generateMaterialColors(primary) {
        return {
            primary: '#1976D2',
            primaryVariant: '#0D47A1',
            secondary: '#03DAC6',
            secondaryVariant: '#018786',
            background: '#F5F5F5',
            surface: '#FFFFFF',
            error: '#B00020',
            onPrimary: '#FFFFFF',
            onSecondary: '#000000',
            onBackground: '#000000',
            onSurface: '#000000',
            onError: '#FFFFFF'
        };
    }

    generateGradientColors(primary) {
        return {
            primary: '#FF6B6B',
            primaryVariant: '#FF5252',
            secondary: '#4ECDC4',
            secondaryVariant: '#26A69A',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            surface: '#FFFFFF',
            error: '#F44336',
            onPrimary: '#FFFFFF',
            onSecondary: '#FFFFFF',
            onBackground: '#FFFFFF',
            onSurface: '#000000',
            onError: '#FFFFFF'
        };
    }

    generateCyberColors(primary) {
        return {
            primary: '#00FFFF',
            primaryVariant: '#00E5E5',
            secondary: '#FF00FF',
            secondaryVariant: '#E500E5',
            background: '#000000',
            surface: '#111111',
            error: '#FF0080',
            onPrimary: '#000000',
            onSecondary: '#000000',
            onBackground: '#00FFFF',
            onSurface: '#00FFFF',
            onError: '#FFFFFF'
        };
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

    // تعديل اللون
    adjustColor(hsl, hueShift, satShift, lightShift) {
        let [h, s, l] = hsl;
        h = (h + hueShift) % 360;
        s = Math.max(0, Math.min(100, s + satShift));
        l = Math.max(0, Math.min(100, l + lightShift));
        return this.hslToHex(h, s, l);
    }

    // تحديث اللون الأساسي
    updatePrimaryColor(color) {
        this.primaryColor = color;
        this.generateColorScheme();
    }

    // تحديث المود
    updateMood(mood) {
        this.mood = mood;
        this.generateColorScheme();
    }

    // تحديث الثيم
    updateTheme(theme) {
        this.currentTheme = theme;
        this.generateColorScheme();
    }

    // تحديث البريست
    updatePreset(preset) {
        console.log('Updating preset to:', preset);
        this.currentPreset = preset;
        this.generateColorScheme(); // إعادة توليد الألوان للبريست الجديد
        this.applyPresetStyles();
    }

    // تطبيق أنماط البريست
    applyPresetStyles() {
        const phoneScreen = document.getElementById('phoneScreen');
        if (!phoneScreen) return;

        // إزالة الكلاسات السابقة
        phoneScreen.className = 'phone-screen';
        
        // إضافة كلاس البريست الجديد
        phoneScreen.classList.add(`preset-${this.currentPreset}`);
        
        // تطبيق الألوان
        this.applyCSSVariables();
        
        console.log('Applied preset styles:', this.currentPreset);
    }

    // تطبيق متغيرات CSS
    applyCSSVariables() {
        const root = document.documentElement;
        
        // تطبيق ألوان المخطط
        Object.entries(this.colorScheme).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
        
        // متغيرات إضافية للبريست
        root.style.setProperty('--preset', this.currentPreset);
        root.style.setProperty('--theme', this.currentTheme);
        
        // إضافة كلاسات للجسم
        document.body.className = `theme-${this.currentTheme} preset-${this.currentPreset}`;
    }

    // الحصول على مخطط الألوان للتصدير
    getColorSchemeForExport() {
        return {
            preset: this.currentPreset,
            mood: this.mood,
            theme: this.currentTheme,
            colors: this.colorScheme
        };
    }
}

// إنشاء مثيل عام
window.themeEngine = new ThemeEngine();

// تهيئة فورية
document.addEventListener('DOMContentLoaded', function() {
    if (window.themeEngine) {
        window.themeEngine.applyCSSVariables();
        console.log('Theme engine initialized successfully');
    }
});