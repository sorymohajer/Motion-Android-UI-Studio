// Layout Engine - محرك التخطيط التكيفي
class LayoutEngine {
    constructor() {
        this.deviceTypes = {
            phone: { width: 360, height: 640, name: 'Phone' },
            phoneLarge: { width: 414, height: 896, name: 'Phone Large' },
            tablet: { width: 768, height: 1024, name: 'Tablet' },
            fold: { width: 673, height: 841, name: 'Fold' },
            foldClosed: { width: 316, height: 684, name: 'Fold Closed' }
        };
        
        this.currentDevice = 'phone';
        this.currentOrientation = 'portrait';
        
        this.spacingSystem = {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24,
            xl: 32,
            xxl: 48
        };
        
        this.gridSystem = {
            columns: 12,
            gutter: 16,
            margin: 16
        };
        
        this.layoutRules = {
            maxCardsPerRow: {
                phone: 1,
                phoneLarge: 1,
                tablet: 2,
                fold: 2,
                foldClosed: 1
            },
            maxListItems: {
                phone: 6,
                phoneLarge: 8,
                tablet: 12,
                fold: 10,
                foldClosed: 5
            },
            buttonHeight: {
                phone: 48,
                phoneLarge: 52,
                tablet: 56,
                fold: 52,
                foldClosed: 48
            }
        };
    }

    // تحديث الجهاز الحالي
    setDevice(deviceType) {
        if (this.deviceTypes[deviceType]) {
            this.currentDevice = deviceType;
            this.updatePreviewDimensions();
            return true;
        }
        return false;
    }

    // تحديث الاتجاه
    setOrientation(orientation) {
        this.currentOrientation = orientation;
        this.updatePreviewDimensions();
    }

    // الحصول على أبعاد الجهاز الحالي
    getCurrentDimensions() {
        const device = this.deviceTypes[this.currentDevice];
        if (this.currentOrientation === 'landscape') {
            return {
                width: device.height,
                height: device.width,
                name: device.name + ' (Landscape)'
            };
        }
        return device;
    }

    // تحديث أبعاد المعاينة
    updatePreviewDimensions() {
        const phoneScreen = document.getElementById('phoneScreen');
        const phoneMockup = document.querySelector('.phone-mockup');
        
        if (!phoneScreen || !phoneMockup) return;
        
        const dimensions = this.getCurrentDimensions();
        const scale = this.calculateScale(dimensions);
        
        // تحديث أبعاد المعاينة
        phoneMockup.style.width = (dimensions.width * scale + 40) + 'px';
        phoneMockup.style.height = (dimensions.height * scale + 40) + 'px';
        
        phoneScreen.style.width = (dimensions.width * scale) + 'px';
        phoneScreen.style.height = (dimensions.height * scale) + 'px';
        
        // إضافة كلاس للجهاز
        phoneScreen.className = `phone-screen device-${this.currentDevice} orientation-${this.currentOrientation}`;
        
        // تحديث تسمية الجهاز
        this.updateDeviceLabel(dimensions.name);
        
        // إعادة تطبيق التخطيط
        this.applyAdaptiveLayout();
    }

    // حساب مقياس العرض
    calculateScale(dimensions) {
        const maxWidth = 300;
        const maxHeight = 600;
        
        const scaleX = maxWidth / dimensions.width;
        const scaleY = maxHeight / dimensions.height;
        
        return Math.min(scaleX, scaleY, 1);
    }

    // تحديث تسمية الجهاز
    updateDeviceLabel(deviceName) {
        let deviceLabel = document.getElementById('device-label');
        if (!deviceLabel) {
            deviceLabel = document.createElement('div');
            deviceLabel.id = 'device-label';
            deviceLabel.className = 'device-label';
            
            const previewPanel = document.querySelector('.preview-panel');
            if (previewPanel) {
                previewPanel.insertBefore(deviceLabel, previewPanel.firstChild);
            }
        }
        deviceLabel.textContent = deviceName;
    }

    // تطبيق التخطيط التكيفي
    applyAdaptiveLayout() {
        const screenType = window.previewEngine?.currentScreen;
        if (!screenType) return;
        
        switch(screenType) {
            case 'home':
                this.adaptHomeScreen();
                break;
            case 'settings':
                this.adaptSettingsScreen();
                break;
            case 'onboarding':
                this.adaptOnboardingScreen();
                break;
            case 'login':
                this.adaptLoginScreen();
                break;
        }
    }

    // تكييف الشاشة الرئيسية
    adaptHomeScreen() {
        const cards = document.querySelectorAll('.home-card');
        const maxCardsPerRow = this.layoutRules.maxCardsPerRow[this.currentDevice];
        
        cards.forEach((card, index) => {
            if (maxCardsPerRow === 2) {
                card.style.width = 'calc(50% - 8px)';
                card.style.display = 'inline-block';
                card.style.marginRight = index % 2 === 0 ? '16px' : '0';
            } else {
                card.style.width = '100%';
                card.style.display = 'block';
                card.style.marginRight = '0';
            }
        });
    }

    // تكييف شاشة الإعدادات
    adaptSettingsScreen() {
        const sections = document.querySelectorAll('.settings-section');
        const isTablet = this.currentDevice === 'tablet' || this.currentDevice === 'fold';
        
        sections.forEach(section => {
            if (isTablet) {
                section.style.padding = this.spacingSystem.lg + 'px';
                section.style.marginBottom = this.spacingSystem.xl + 'px';
            } else {
                section.style.padding = this.spacingSystem.md + 'px';
                section.style.marginBottom = this.spacingSystem.lg + 'px';
            }
        });
    }

    // تكييف شاشة التعريف
    adaptOnboardingScreen() {
        const content = document.querySelector('.onboarding-content');
        const isTablet = this.currentDevice === 'tablet' || this.currentDevice === 'fold';
        
        if (content) {
            if (isTablet) {
                content.style.padding = this.spacingSystem.xxl + 'px';
                content.style.maxWidth = '600px';
                content.style.margin = '0 auto';
            } else {
                content.style.padding = this.spacingSystem.lg + 'px';
                content.style.maxWidth = 'none';
                content.style.margin = '0';
            }
        }
    }

    // تكييف شاشة تسجيل الدخول
    adaptLoginScreen() {
        const form = document.querySelector('.login-form');
        const isTablet = this.currentDevice === 'tablet' || this.currentDevice === 'fold';
        
        if (form) {
            if (isTablet) {
                form.style.maxWidth = '400px';
                form.style.padding = this.spacingSystem.xl + 'px';
            } else {
                form.style.maxWidth = '280px';
                form.style.padding = this.spacingSystem.md + 'px';
            }
        }
    }

    // اقتراح تحسينات التخطيط
    suggestLayoutImprovements(screenType) {
        const suggestions = [];
        const device = this.deviceTypes[this.currentDevice];
        
        // فحص الكثافة
        if (this.currentDevice === 'tablet' && screenType === 'home') {
            suggestions.push({
                type: 'layout',
                message: 'يمكن استخدام تخطيط عمودين للاستفادة من المساحة الإضافية',
                action: 'enable-two-column'
            });
        }
        
        // فحص الأزرار
        const buttons = document.querySelectorAll('.phone-screen button');
        buttons.forEach(button => {
            const height = parseInt(getComputedStyle(button).height);
            const minHeight = this.layoutRules.buttonHeight[this.currentDevice];
            
            if (height < minHeight) {
                suggestions.push({
                    type: 'accessibility',
                    message: `ارتفاع الزر صغير جداً (${height}px). الحد الأدنى المُوصى به ${minHeight}px`,
                    action: 'increase-button-height'
                });
            }
        });
        
        return suggestions;
    }

    // تطبيق التباعد التلقائي
    applyAutoSpacing() {
        const elements = document.querySelectorAll('.phone-screen > div > *');
        const spacing = this.getOptimalSpacing();
        
        elements.forEach((element, index) => {
            if (index > 0) {
                element.style.marginTop = spacing.vertical + 'px';
            }
        });
    }

    // الحصول على التباعد الأمثل
    getOptimalSpacing() {
        const device = this.deviceTypes[this.currentDevice];
        const density = device.width / 360; // نسبة إلى الهاتف العادي
        
        return {
            vertical: Math.round(this.spacingSystem.md * density),
            horizontal: Math.round(this.spacingSystem.md * density),
            section: Math.round(this.spacingSystem.lg * density)
        };
    }

    // تحليل التخطيط الحالي
    analyzeCurrentLayout() {
        const analysis = {
            device: this.getCurrentDimensions(),
            spacing: this.analyzeSpacing(),
            alignment: this.analyzeAlignment(),
            density: this.analyzeDensity(),
            suggestions: []
        };
        
        // إضافة اقتراحات بناءً على التحليل
        if (analysis.density.score < 70) {
            analysis.suggestions.push({
                type: 'density',
                message: 'التخطيط مزدحم جداً',
                solution: 'زيادة التباعد بين العناصر'
            });
        }
        
        if (analysis.alignment.score < 80) {
            analysis.suggestions.push({
                type: 'alignment',
                message: 'محاذاة العناصر غير متسقة',
                solution: 'استخدام نظام شبكة موحد'
            });
        }
        
        return analysis;
    }

    // تحليل التباعد
    analyzeSpacing() {
        const elements = document.querySelectorAll('.phone-screen > div > *');
        const spacings = [];
        
        for (let i = 1; i < elements.length; i++) {
            const prevRect = elements[i-1].getBoundingClientRect();
            const currRect = elements[i].getBoundingClientRect();
            const spacing = currRect.top - prevRect.bottom;
            spacings.push(spacing);
        }
        
        const avgSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length;
        const consistency = this.calculateConsistency(spacings);
        
        return {
            average: avgSpacing,
            consistency: consistency,
            score: consistency > 0.8 ? 90 : consistency > 0.6 ? 70 : 50
        };
    }

    // تحليل المحاذاة
    analyzeAlignment() {
        const elements = document.querySelectorAll('.phone-screen > div > *');
        const leftPositions = Array.from(elements).map(el => el.getBoundingClientRect().left);
        const consistency = this.calculateConsistency(leftPositions);
        
        return {
            consistency: consistency,
            score: consistency > 0.9 ? 95 : consistency > 0.7 ? 80 : 60
        };
    }

    // تحليل الكثافة
    analyzeDensity() {
        const container = document.querySelector('.phone-screen');
        if (!container) return { score: 50 };
        
        const containerArea = container.offsetWidth * container.offsetHeight;
        const elements = container.querySelectorAll('*');
        let totalElementArea = 0;
        
        elements.forEach(el => {
            totalElementArea += el.offsetWidth * el.offsetHeight;
        });
        
        const density = totalElementArea / containerArea;
        const score = density > 0.8 ? 30 : density > 0.6 ? 60 : density > 0.4 ? 90 : 70;
        
        return {
            density: density,
            score: score
        };
    }

    // حساب الاتساق
    calculateConsistency(values) {
        if (values.length < 2) return 1;
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        // كلما قل الانحراف المعياري، زاد الاتساق
        return Math.max(0, 1 - (stdDev / mean));
    }

    // تصدير إعدادات التخطيط
    exportLayoutSettings() {
        return {
            device: this.currentDevice,
            orientation: this.currentOrientation,
            dimensions: this.getCurrentDimensions(),
            spacing: this.spacingSystem,
            grid: this.gridSystem,
            rules: this.layoutRules
        };
    }

    // تطبيق تخطيط محفوظ
    applyLayoutSettings(settings) {
        if (settings.device) {
            this.setDevice(settings.device);
        }
        if (settings.orientation) {
            this.setOrientation(settings.orientation);
        }
        if (settings.spacing) {
            this.spacingSystem = { ...this.spacingSystem, ...settings.spacing };
        }
    }

    // إنشاء شبكة مرئية للمساعدة في التصميم
    showGrid(show = true) {
        let gridOverlay = document.getElementById('grid-overlay');
        
        if (show && !gridOverlay) {
            gridOverlay = document.createElement('div');
            gridOverlay.id = 'grid-overlay';
            gridOverlay.className = 'grid-overlay';
            
            const phoneScreen = document.getElementById('phoneScreen');
            if (phoneScreen) {
                phoneScreen.appendChild(gridOverlay);
                this.drawGrid(gridOverlay);
            }
        } else if (!show && gridOverlay) {
            gridOverlay.remove();
        }
    }

    // رسم الشبكة
    drawGrid(container) {
        const dimensions = this.getCurrentDimensions();
        const columnWidth = (dimensions.width - (this.gridSystem.margin * 2) - (this.gridSystem.gutter * (this.gridSystem.columns - 1))) / this.gridSystem.columns;
        
        container.innerHTML = '';
        
        for (let i = 0; i < this.gridSystem.columns; i++) {
            const column = document.createElement('div');
            column.className = 'grid-column';
            column.style.cssText = `
                position: absolute;
                left: ${this.gridSystem.margin + (i * (columnWidth + this.gridSystem.gutter))}px;
                top: 0;
                width: ${columnWidth}px;
                height: 100%;
                background: rgba(255, 0, 0, 0.1);
                border: 1px solid rgba(255, 0, 0, 0.2);
                pointer-events: none;
            `;
            container.appendChild(column);
        }
    }
}

// إضافة أنماط CSS للشبكة والأجهزة
const layoutCSS = `
.device-label {
    text-align: center;
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
    font-weight: 500;
}

.grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1000;
}

.device-phone .home-card {
    margin-bottom: 15px;
}

.device-tablet .home-card {
    width: calc(50% - 8px);
    display: inline-block;
    vertical-align: top;
    margin-right: 16px;
    margin-bottom: 20px;
}

.device-tablet .home-card:nth-child(even) {
    margin-right: 0;
}

.device-fold .login-form {
    max-width: 350px;
}

.device-foldClosed .login-form {
    max-width: 250px;
}

.orientation-landscape .phone-screen {
    overflow-x: auto;
}

.orientation-landscape .splash-content {
    flex-direction: row;
    align-items: center;
    gap: 30px;
}

.orientation-landscape .onboarding-content {
    flex-direction: row;
    text-align: left;
}

.orientation-landscape .onboarding-image {
    margin: 0 30px 0 0;
}
`;

// إضافة CSS للصفحة
const layoutStyle = document.createElement('style');
layoutStyle.textContent = layoutCSS;
document.head.appendChild(layoutStyle);

// إنشاء مثيل عام
window.layoutEngine = new LayoutEngine();