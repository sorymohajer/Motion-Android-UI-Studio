// Preview Engine - محرك المعاينة المباشرة
class PreviewEngine {
    constructor() {
        this.currentScreen = 'splash';
        this.screenData = {};
        this.isAnimating = false;
        
        // بيانات الشاشات الافتراضية
        this.defaultScreenData = {
            splash: {
                appName: 'تطبيقي',
                tagline: 'مرحباً بك',
                logoText: 'Logo'
            },
            login: {
                title: 'تسجيل الدخول',
                emailLabel: 'البريد الإلكتروني',
                passwordLabel: 'كلمة المرور',
                loginButton: 'دخول',
                signupText: 'إنشاء حساب جديد'
            },
            home: {
                title: 'الرئيسية',
                welcomeText: 'مرحباً بك',
                cards: ['البطاقة الأولى', 'البطاقة الثانية', 'البطاقة الثالثة']
            },
            onboarding: {
                pages: [
                    { title: 'مرحباً', description: 'اكتشف ميزات التطبيق الرائعة' },
                    { title: 'سهل الاستخدام', description: 'واجهة بسيطة وسهلة' },
                    { title: 'ابدأ الآن', description: 'جاهز للبدء؟' }
                ]
            },
            settings: {
                title: 'الإعدادات',
                sections: [
                    { title: 'الحساب', items: ['الملف الشخصي', 'الخصوصية'] },
                    { title: 'التطبيق', items: ['الإشعارات', 'اللغة'] }
                ]
            }
        };
        
        this.initializeScreenData();
    }

    // تهيئة بيانات الشاشات
    initializeScreenData() {
        this.screenData = { ...this.defaultScreenData };
    }

    // تحديث الشاشة الحالية
    updateScreen(screenType) {
        if (this.isAnimating) return;
        
        console.log('Updating screen to:', screenType);
        
        this.currentScreen = screenType;
        this.renderScreen();
        this.updateContentInputs();
        
        // تحديث dropdown إذا لم يكن محدث
        const screenSelect = document.getElementById('screenType');
        if (screenSelect && screenSelect.value !== screenType) {
            screenSelect.value = screenType;
        }
    }

    // رسم الشاشة
    renderScreen() {
        const phoneScreen = document.getElementById('phoneScreen');
        if (!phoneScreen) {
            console.error('Phone screen element not found');
            return;
        }

        console.log('Rendering screen:', this.currentScreen);
        
        this.isAnimating = true;
        
        // مسح المحتوى السابق
        phoneScreen.innerHTML = '';
        
        // رسم الشاشة الجديدة
        switch(this.currentScreen) {
            case 'splash':
                this.renderSplashScreen(phoneScreen);
                break;
            case 'login':
                this.renderLoginScreen(phoneScreen);
                break;
            case 'home':
                this.renderHomeScreen(phoneScreen);
                break;
            case 'onboarding':
                this.renderOnboardingScreen(phoneScreen);
                break;
            case 'settings':
                this.renderSettingsScreen(phoneScreen);
                break;
            default:
                console.warn('Unknown screen type:', this.currentScreen, 'defaulting to splash');
                this.renderSplashScreen(phoneScreen);
        }
        
        // تطبيق الأنيميشن
        setTimeout(() => {
            this.applyScreenAnimation();
            this.addInteractiveEffects();
            this.isAnimating = false;
            console.log('Screen rendering complete');
        }, 100);
    }

    // رسم شاشة Splash
    renderSplashScreen(container) {
        const data = this.screenData.splash;
        
        container.innerHTML = `
            <div class="splash-screen">
                <div class="splash-background"></div>
                <div class="splash-content">
                    <div class="splash-logo">${data.logoText}</div>
                    <h1 class="splash-title">${data.appName}</h1>
                    <p class="splash-tagline">${data.tagline}</p>
                </div>
            </div>
        `;
        
        this.applySplashStyles();
    }

    // رسم شاشة Login
    renderLoginScreen(container) {
        const data = this.screenData.login;
        
        const loginHTML = `
            <div class="login-screen" style="height: 100%; padding: 40px 20px; background: var(--color-background, #FAFAFA); display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div class="login-header" style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: var(--color-primary, #6200EE); font-size: 28px; font-weight: bold;">${data.title}</h1>
                </div>
                <div class="login-form" style="max-width: 280px; width: 100%;">
                    <div class="input-field" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--color-onBackground, #000); font-size: 14px;">${data.emailLabel}</label>
                        <input type="email" placeholder="${data.emailLabel}" style="width: 100%; padding: 15px; border: 2px solid #E0E0E0; border-radius: 8px; font-size: 16px; background: var(--color-surface, #FFFFFF);">
                    </div>
                    <div class="input-field" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--color-onBackground, #000); font-size: 14px;">${data.passwordLabel}</label>
                        <input type="password" placeholder="${data.passwordLabel}" style="width: 100%; padding: 15px; border: 2px solid #E0E0E0; border-radius: 8px; font-size: 16px; background: var(--color-surface, #FFFFFF);">
                    </div>
                    <button class="login-button" style="width: 100%; padding: 15px; background: linear-gradient(45deg, var(--color-primary, #6200EE), var(--color-primaryVariant, #3700B3)); color: white; border: none; border-radius: 25px; font-size: 16px; font-weight: bold; margin-bottom: 20px; cursor: pointer;">${data.loginButton}</button>
                    <p class="signup-link" style="text-align: center; color: var(--color-primary, #6200EE); font-size: 14px;">${data.signupText}</p>
                </div>
            </div>
        `;
        
        container.innerHTML = loginHTML;
        
        // التأكد من تطبيق الألوان
        if (window.themeEngine) {
            window.themeEngine.applyCSSVariables();
        }
    }

    // رسم شاشة Home
    renderHomeScreen(container) {
        const data = this.screenData.home;
        
        const cardsHTML = data.cards.map((card, index) => `
            <div class="home-card" style="margin-bottom: 15px; background: var(--color-surface, #FFFFFF); padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h3 style="color: var(--color-primary, #6200EE); margin-bottom: 8px; font-size: 16px;">${card}</h3>
                <p style="color: var(--color-onSurface, #000); font-size: 14px;">وصف البطاقة ${index + 1}</p>
            </div>
        `).join('');
        
        const homeHTML = `
            <div class="home-screen" style="height: 100%; background: var(--color-background, #FAFAFA);">
                <div class="home-header" style="padding: 30px 20px; background: var(--color-primary, #6200EE); color: white; text-align: center; border-radius: 0 0 12px 12px; margin-bottom: 20px;">
                    <h1 style="font-size: 24px; margin-bottom: 8px;">${data.title}</h1>
                    <p style="font-size: 16px; opacity: 0.9;">${data.welcomeText}</p>
                </div>
                <div class="home-content" style="padding: 0 20px;">
                    ${cardsHTML}
                </div>
            </div>
        `;
        
        container.innerHTML = homeHTML;
        
        // التأكد من تطبيق الألوان
        if (window.themeEngine) {
            window.themeEngine.applyCSSVariables();
        }
    }

    // رسم شاشة Onboarding
    renderOnboardingScreen(container) {
        const data = this.screenData.onboarding;
        const currentPage = data.pages[0]; // عرض الصفحة الأولى
        
        container.innerHTML = `
            <div class="onboarding-screen">
                <div class="onboarding-content">
                    <div class="onboarding-image"></div>
                    <h2>${currentPage.title}</h2>
                    <p>${currentPage.description}</p>
                </div>
                <div class="onboarding-navigation">
                    <div class="page-indicators">
                        ${data.pages.map((_, index) => `
                            <div class="indicator ${index === 0 ? 'active' : ''}"></div>
                        `).join('')}
                    </div>
                    <button class="next-button">التالي</button>
                </div>
            </div>
        `;
        
        this.applyOnboardingStyles();
    }

    // رسم شاشة Settings
    renderSettingsScreen(container) {
        const data = this.screenData.settings;
        
        const sectionsHTML = data.sections.map(section => `
            <div class="settings-section">
                <h3>${section.title}</h3>
                ${section.items.map(item => `
                    <div class="settings-item">
                        <span>${item}</span>
                        <div class="toggle-switch"></div>
                    </div>
                `).join('')}
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="settings-screen">
                <div class="settings-header">
                    <h1>${data.title}</h1>
                </div>
                <div class="settings-content">
                    ${sectionsHTML}
                </div>
            </div>
        `;
        
        this.applySettingsStyles();
    }

    // تطبيق أنماط Splash
    applySplashStyles() {
        const style = `
            .splash-screen {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }
            .splash-background {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, var(--color-primary, #6200EE), var(--color-primaryVariant, #3700B3));
            }
            .splash-content {
                text-align: center;
                color: white;
                z-index: 1;
            }
            .splash-logo {
                width: 80px;
                height: 80px;
                background: rgba(255,255,255,0.2);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 24px;
                font-weight: bold;
            }
            .splash-title {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .splash-tagline {
                font-size: 16px;
                opacity: 0.9;
            }
        `;
        this.addScreenStyles(style);
    }

    // تطبيق أنماط Login
    applyLoginStyles() {
        const style = `
            .login-screen {
                height: 100%;
                padding: 40px 20px;
                background: var(--color-background, #FAFAFA);
            }
            .login-header {
                text-align: center;
                margin-bottom: 40px;
            }
            .login-header h1 {
                color: var(--color-primary, #6200EE);
                font-size: 24px;
                font-weight: bold;
            }
            .login-form {
                max-width: 280px;
                margin: 0 auto;
            }
            .input-field {
                margin-bottom: 20px;
            }
            .input-field label {
                display: block;
                margin-bottom: 8px;
                color: var(--color-onBackground, #000);
                font-size: 14px;
            }
            .input-field input {
                width: 100%;
                padding: 12px;
                border: 2px solid #E0E0E0;
                border-radius: 8px;
                font-size: 16px;
                background: var(--color-surface, #FFFFFF);
            }
            .login-button {
                width: 100%;
                padding: 15px;
                background: linear-gradient(45deg, var(--color-primary, #6200EE), var(--color-primaryVariant, #3700B3));
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 20px;
                cursor: pointer;
            }
            .signup-link {
                text-align: center;
                color: var(--color-primary, #6200EE);
                font-size: 14px;
            }
        `;
        this.addScreenStyles(style);
    }

    // تطبيق أنماط Home
    applyHomeStyles() {
        const style = `
            .home-screen {
                height: 100%;
                background: var(--color-background, #FAFAFA);
            }
            .home-header {
                padding: 30px 20px;
                background: var(--color-primary, #6200EE);
                color: white;
                text-align: center;
            }
            .home-header h1 {
                font-size: 24px;
                margin-bottom: 8px;
            }
            .home-content {
                padding: 20px;
            }
            .home-card {
                background: var(--color-surface, #FFFFFF);
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 15px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .home-card h3 {
                color: var(--color-primary, #6200EE);
                margin-bottom: 8px;
                font-size: 16px;
            }
            .home-card p {
                color: var(--color-onSurface, #000);
                font-size: 14px;
            }
        `;
        this.addScreenStyles(style);
    }

    // تطبيق أنماط Onboarding
    applyOnboardingStyles() {
        const style = `
            .onboarding-screen {
                height: 100%;
                display: flex;
                flex-direction: column;
                background: var(--color-background, #FAFAFA);
            }
            .onboarding-content {
                flex: 1;
                padding: 40px 20px;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .onboarding-image {
                width: 120px;
                height: 120px;
                background: linear-gradient(135deg, var(--color-primary, #6200EE), var(--color-secondary, #03DAC6));
                border-radius: 60px;
                margin: 0 auto 30px;
            }
            .onboarding-content h2 {
                font-size: 24px;
                color: var(--color-onBackground, #000);
                margin-bottom: 15px;
            }
            .onboarding-content p {
                font-size: 16px;
                color: #666;
                line-height: 1.5;
            }
            .onboarding-navigation {
                padding: 20px;
                text-align: center;
            }
            .page-indicators {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-bottom: 20px;
            }
            .indicator {
                width: 8px;
                height: 8px;
                border-radius: 4px;
                background: #E0E0E0;
            }
            .indicator.active {
                background: var(--color-primary, #6200EE);
            }
            .next-button {
                background: var(--color-primary, #6200EE);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 20px;
                font-size: 16px;
            }
        `;
        this.addScreenStyles(style);
    }

    // تطبيق أنماط Settings
    applySettingsStyles() {
        const style = `
            .settings-screen {
                height: 100%;
                background: var(--color-background, #FAFAFA);
            }
            .settings-header {
                padding: 30px 20px;
                background: var(--color-surface, #FFFFFF);
                border-bottom: 1px solid #E0E0E0;
            }
            .settings-header h1 {
                color: var(--color-onSurface, #000);
                font-size: 24px;
            }
            .settings-content {
                padding: 20px;
            }
            .settings-section {
                margin-bottom: 30px;
            }
            .settings-section h3 {
                color: var(--color-primary, #6200EE);
                font-size: 16px;
                margin-bottom: 15px;
            }
            .settings-item {
                background: var(--color-surface, #FFFFFF);
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .toggle-switch {
                width: 40px;
                height: 20px;
                background: var(--color-primary, #6200EE);
                border-radius: 10px;
                position: relative;
            }
            .toggle-switch::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                top: 2px;
                right: 2px;
            }
        `;
        this.addScreenStyles(style);
    }

    // إضافة أنماط للشاشة
    addScreenStyles(css) {
        // إزالة الأنماط السابقة
        const existingStyle = document.getElementById('screen-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // إضافة الأنماط الجديدة
        const style = document.createElement('style');
        style.id = 'screen-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // تطبيق الأنيميشن على الشاشة
    applyScreenAnimation() {
        const elements = document.querySelectorAll('.phone-screen > div > *');
        if (window.motionEngine && elements.length > 0) {
            // إضافة تأخير قصير لضمان رسم العناصر
            setTimeout(() => {
                window.motionEngine.applyAnimation(Array.from(elements));
            }, 150);
        }
    }

    // تحديث المعاينة المباشرة
    updateLivePreview() {
        if (this.isAnimating) return;
        
        // تطبيق الثيم الحالي
        if (window.themeEngine) {
            window.themeEngine.applyCSSVariables();
        }
        
        // إعادة رسم الشاشة
        this.renderScreen();
    }

    // تحديث الألوان فوراً
    updateColors() {
        if (window.themeEngine) {
            window.themeEngine.applyCSSVariables();
        }
        
        // تحديث الخلفية إذا كانت الشاشة splash
        if (this.currentScreen === 'splash') {
            const splashBg = document.querySelector('.splash-background');
            if (splashBg && window.themeEngine) {
                const colors = window.themeEngine.colorScheme;
                splashBg.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.primaryVariant})`;
            }
        }
    }

    // إضافة تأثيرات تفاعلية للأزرار
    addInteractiveEffects() {
        const buttons = document.querySelectorAll('.phone-screen button, .phone-screen .login-button, .phone-screen .next-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (window.motionEngine) {
                    window.motionEngine.animateButton(button, 'press');
                }
                
                // إضافة تأثير ripple
                this.createRippleEffect(e, button);
            });
        });
    }

    // إنشاء تأثير Ripple
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 600ms linear;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // تحديث حقول الإدخال
    updateContentInputs() {
        const contentInputs = document.getElementById('contentInputs');
        if (!contentInputs) return;

        const data = this.screenData[this.currentScreen];
        let inputsHTML = '';

        switch(this.currentScreen) {
            case 'splash':
                inputsHTML = `
                    <div class="input-group">
                        <label>اسم التطبيق</label>
                        <input type="text" value="${data.appName}" onchange="updateScreenData('splash', 'appName', this.value)">
                    </div>
                    <div class="input-group">
                        <label>الشعار</label>
                        <input type="text" value="${data.tagline}" onchange="updateScreenData('splash', 'tagline', this.value)">
                    </div>
                    <div class="input-group">
                        <label>نص اللوجو</label>
                        <input type="text" value="${data.logoText}" onchange="updateScreenData('splash', 'logoText', this.value)">
                    </div>
                `;
                break;
            case 'login':
                inputsHTML = `
                    <div class="input-group">
                        <label>عنوان الشاشة</label>
                        <input type="text" value="${data.title}" onchange="updateScreenData('login', 'title', this.value)">
                    </div>
                    <div class="input-group">
                        <label>تسمية البريد</label>
                        <input type="text" value="${data.emailLabel}" onchange="updateScreenData('login', 'emailLabel', this.value)">
                    </div>
                    <div class="input-group">
                        <label>تسمية كلمة المرور</label>
                        <input type="text" value="${data.passwordLabel}" onchange="updateScreenData('login', 'passwordLabel', this.value)">
                    </div>
                    <div class="input-group">
                        <label>نص زر الدخول</label>
                        <input type="text" value="${data.loginButton}" onchange="updateScreenData('login', 'loginButton', this.value)">
                    </div>
                `;
                break;
            case 'home':
                inputsHTML = `
                    <div class="input-group">
                        <label>عنوان الشاشة</label>
                        <input type="text" value="${data.title}" onchange="updateScreenData('home', 'title', this.value)">
                    </div>
                    <div class="input-group">
                        <label>نص الترحيب</label>
                        <input type="text" value="${data.welcomeText}" onchange="updateScreenData('home', 'welcomeText', this.value)">
                    </div>
                `;
                break;
        }

        contentInputs.innerHTML = inputsHTML;
    }

    // تحديث بيانات الشاشة
    updateScreenData(screen, key, value) {
        if (this.screenData[screen]) {
            this.screenData[screen][key] = value;
            this.renderScreen();
        }
    }

    // الحصول على بيانات الشاشة للتصدير
    getScreenDataForExport() {
        return {
            currentScreen: this.currentScreen,
            screenData: this.screenData
        };
    }
}

// دوال عامة للاستخدام في HTML
function updateScreen() {
    const screenSelect = document.getElementById('screenType');
    if (screenSelect && window.previewEngine) {
        const screenType = screenSelect.value;
        console.log('Changing screen to:', screenType);
        window.previewEngine.updateScreen(screenType);
    }
}

function updateScreenData(screen, key, value) {
    if (window.previewEngine) {
        window.previewEngine.updateScreenData(screen, key, value);
    }
}

function selectPreset(button, preset) {
    console.log('Selecting preset:', preset);
    
    // إزالة active من جميع الأزرار
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    // إضافة active للزر المحدد
    button.classList.add('active');
    
    if (window.themeEngine) {
        window.themeEngine.updatePreset(preset);
        window.themeEngine.applyCSSVariables();
    }
    
    if (window.previewEngine) {
        setTimeout(() => {
            window.previewEngine.renderScreen();
        }, 100);
    }
}

function updateColors() {
    const color = document.getElementById('primaryColor').value;
    if (window.themeEngine) {
        window.themeEngine.updatePrimaryColor(color);
        // تطبيق الألوان فوراً
        window.themeEngine.applyCSSVariables();
    }
    
    if (window.previewEngine) {
        // إعادة رسم الشاشة مع الألوان الجديدة
        setTimeout(() => {
            window.previewEngine.renderScreen();
        }, 100);
    }
}

function updateMood() {
    const mood = document.getElementById('mood').value;
    if (window.themeEngine) {
        window.themeEngine.updateMood(mood);
        // تطبيق الألوان الجديدة فوراً
        window.themeEngine.applyCSSVariables();
    }
    
    if (window.previewEngine) {
        setTimeout(() => {
            window.previewEngine.renderScreen();
        }, 100);
    }
}

function updateAnimation() {
    const animation = document.getElementById('animationStyle').value;
    if (window.motionEngine) {
        window.motionEngine.updateAnimationType(animation);
    }
    
    // إعادة تطبيق الأنيميشن على العناصر الحالية
    if (window.previewEngine) {
        setTimeout(() => {
            window.previewEngine.applyScreenAnimation();
        }, 100);
    }
}

function toggleTheme(theme) {
    console.log('Toggling theme to:', theme);
    
    // تحديث الأزرار
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (window.themeEngine) {
        window.themeEngine.updateTheme(theme);
        window.themeEngine.applyCSSVariables();
    } else {
        console.error('Theme engine not found');
    }
    
    if (window.previewEngine) {
        setTimeout(() => {
            window.previewEngine.renderScreen();
        }, 100);
    }
}

// إنشاء مثيل عام
window.previewEngine = new PreviewEngine();

// تهيئة فورية
document.addEventListener('DOMContentLoaded', function() {
    console.log('Preview engine initializing...');
    
    if (window.previewEngine) {
        // تأخير قصير للتأكد من تحميل جميع المحركات
        setTimeout(() => {
            const phoneScreen = document.getElementById('phoneScreen');
            if (phoneScreen) {
                window.previewEngine.updateScreen('splash');
                console.log('Preview engine initialized successfully');
            } else {
                // محاولة أخرى بعد تأخير أطول
                setTimeout(() => {
                    const phoneScreen2 = document.getElementById('phoneScreen');
                    if (phoneScreen2) {
                        window.previewEngine.updateScreen('splash');
                        console.log('Preview engine initialized on second attempt');
                    }
                }, 2000);
            }
        }, 100);
    }
});

// دوال محسنة للتحديث المباشر
function updateColorsEnhanced() {
    const color = document.getElementById('primaryColor').value;
    if (window.themeEngine) {
        window.themeEngine.updatePrimaryColor(color);
    }
    
    if (window.previewEngine) {
        window.previewEngine.updateColors();
        window.previewEngine.updateLivePreview();
    }
}

function updateMoodEnhanced() {
    const mood = document.getElementById('mood').value;
    if (window.themeEngine) {
        window.themeEngine.updateMood(mood);
    }
    
    if (window.previewEngine) {
        window.previewEngine.updateColors();
        window.previewEngine.updateLivePreview();
    }
}

function updateAnimationEnhanced() {
    const animation = document.getElementById('animationStyle').value;
    if (window.motionEngine) {
        window.motionEngine.updateAnimationType(animation);
    }
    
    // إعادة تطبيق الأنيميشن على العناصر الحالية
    if (window.previewEngine) {
        setTimeout(() => {
            window.previewEngine.applyScreenAnimation();
        }, 100);
    }
}

function selectPresetEnhanced(button, preset) {
    // إزالة active من جميع الأزرار
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
    // إضافة active للزر المحدد
    button.classList.add('active');
    
    if (window.themeEngine) {
        window.themeEngine.updatePreset(preset);
    }
    
    if (window.previewEngine) {
        // إضافة تأثير loading قصير
        const phoneScreen = document.getElementById('phoneScreen');
        if (phoneScreen) {
            phoneScreen.style.opacity = '0.7';
            phoneScreen.style.transition = 'opacity 0.2s ease';
            setTimeout(() => {
                window.previewEngine.updateLivePreview();
                phoneScreen.style.opacity = '1';
            }, 200);
        }
    }
}

function toggleThemeEnhanced(theme) {
    // تحديث الأزرار
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (window.themeEngine) {
        window.themeEngine.updateTheme(theme);
    }
    
    if (window.previewEngine) {
        window.previewEngine.updateColors();
        window.previewEngine.updateLivePreview();
    }
}

// إضافة مؤشر تحميل
function showLoadingIndicator() {
    const phoneScreen = document.getElementById('phoneScreen');
    if (phoneScreen) {
        const loader = document.createElement('div');
        loader.className = 'loading-spinner';
        loader.id = 'loading-indicator';
        phoneScreen.appendChild(loader);
    }
}

function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.remove();
    }
}

// تحسين دالة التصدير
function exportProjectEnhanced() {
    // إظهار مؤشر التحميل
    const exportBtn = document.querySelector('.export-btn');
    const originalText = exportBtn.textContent;
    
    exportBtn.textContent = 'جاري التصدير...';
    exportBtn.disabled = true;
    
    // تأخير قصير لإظهار التحميل
    setTimeout(() => {
        if (window.exportEngine) {
            window.exportEngine.exportProject();
        }
        
        // إعادة تعيين الزر
        setTimeout(() => {
            exportBtn.textContent = originalText;
            exportBtn.disabled = false;
            
            // إظهار رسالة نجاح
            showSuccessMessage('تم تصدير المشروع بنجاح!');
        }, 2000);
    }, 500);
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const container = document.querySelector('.studio-container');
    if (container) {
        container.insertBefore(successDiv, container.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}
// دوال الميزات المتقدمة الجديدة

// فتح Motion Studio
function openMotionStudio() {
    // حفظ الحالة الحالية في localStorage
    const currentState = {
        screenType: window.previewEngine?.currentScreen || 'splash',
        screenData: window.previewEngine?.screenData || {},
        theme: {
            preset: window.themeEngine?.currentPreset || 'minimal',
            primaryColor: window.themeEngine?.primaryColor || '#6200EE',
            mood: window.themeEngine?.mood || 'calm',
            colorScheme: window.themeEngine?.colorScheme || {}
        },
        animation: {
            type: window.motionEngine?.currentAnimation || 'fade-slide',
            duration: window.motionEngine?.animationDuration || 300,
            easing: window.motionEngine?.animationEasing || 'ease-out'
        }
    };
    
    localStorage.setItem('studioState', JSON.stringify(currentState));
    console.log('Saved studio state:', currentState);
    
    window.open('ui/motion-studio.html', '_blank');
}

// فتح مساعد الألوان
function openColorAssistant() {
    showColorAssistantPanel();
}

// عرض لوحة مساعد الألوان
function showColorAssistantPanel() {
    const panel = document.createElement('div');
    panel.className = 'design-feedback-panel open';
    panel.id = 'colorAssistantPanel';
    
    panel.innerHTML = `
        <div class="feedback-header">
            <h3>🎨 مساعد الألوان الذكي</h3>
            <button class="feedback-close" onclick="closeColorAssistant()">×</button>
        </div>
        <div class="feedback-content">
            <div class="feedback-section">
                <h3>ألوان الاتجاه 2025</h3>
                <div class="color-trends">
                    <div class="trend-colors" id="trendColors2025">
                        <!-- سيتم ملؤها بواسطة JavaScript -->
                    </div>
                </div>
            </div>
            
            <div class="feedback-section">
                <h3>اقتراحات ذكية</h3>
                <div id="smartColorSuggestions">
                    <!-- اقتراحات الألوان الذكية -->
                </div>
            </div>
            
            <div class="feedback-section">
                <h3>فحص الوصولية</h3>
                <div id="accessibilityCheck">
                    <!-- فحص التباين والوصولية -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    loadTrendColors2025();
    updateSmartColorSuggestions();
}

// إغلاق مساعد الألوان
function closeColorAssistant() {
    const panel = document.getElementById('colorAssistantPanel');
    if (panel) {
        panel.remove();
    }
}

// تحميل ألوان الاتجاه 2025
function loadTrendColors2025() {
    if (!window.aiAssistant) return;
    
    const trendColorsContainer = document.getElementById('trendColors2025');
    if (!trendColorsContainer) return;
    
    window.aiAssistant.colorTrends2025.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'trend-color';
        colorDiv.style.background = color.hex;
        colorDiv.setAttribute('data-name', color.name);
        colorDiv.title = `${color.name} - ${color.category}`;
        
        colorDiv.addEventListener('click', () => {
            applyTrendColor(color.hex);
        });
        
        trendColorsContainer.appendChild(colorDiv);
    });
}

// تطبيق لون الاتجاه
function applyTrendColor(color) {
    document.getElementById('primaryColor').value = color;
    updateColorsEnhanced();
}

// تحديث اقتراحات الألوان الذكية
function updateSmartColorSuggestions() {
    if (!window.aiAssistant) return;
    
    const currentScreen = window.previewEngine?.currentScreen || 'splash';
    const appType = document.getElementById('appCategory')?.value || 'productivity';
    
    const suggestions = window.aiAssistant.suggestColorsForApp(appType);
    const suggestionsContainer = document.getElementById('smartColorSuggestions');
    
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = `
        <div class="color-suggestions">
            ${suggestions.trendColors.map(color => `
                <div class="color-suggestion" 
                     style="background: ${color.hex}" 
                     data-name="${color.name}"
                     onclick="applyTrendColor('${color.hex}')">
                </div>
            `).join('')}
        </div>
        <div class="suggestion-info">
            <p><strong>المود المقترح:</strong> ${suggestions.mood}</p>
            <p><strong>الحركات المناسبة:</strong> ${suggestions.animations.join(', ')}</p>
        </div>
    `;
}

// اقتراح ألوان للفئة
function suggestColorsForCategory() {
    const category = document.getElementById('appCategory').value;
    if (!category || !window.aiAssistant) return;
    
    console.log('Suggesting colors for category:', category);
    
    const suggestions = window.aiAssistant.suggestColorsForApp(category);
    const suggestionsContainer = document.getElementById('colorSuggestions');
    
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';
    
    // إنشاء اقتراحات الألوان
    [suggestions.primary, suggestions.secondary, suggestions.accent].forEach((color, index) => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-suggestion';
        colorDiv.style.background = color;
        colorDiv.setAttribute('data-name', ['أساسي', 'ثانوي', 'مميز'][index]);
        
        colorDiv.addEventListener('click', () => {
            // تطبيق اللون المختار
            const primaryColorInput = document.getElementById('primaryColor');
            if (primaryColorInput) {
                primaryColorInput.value = color;
            }
            
            // تحديث الثيم
            if (window.themeEngine) {
                window.themeEngine.updatePrimaryColor(color);
                window.themeEngine.applyCSSVariables();
            }
            
            // إعادة رسم الشاشة
            if (window.previewEngine) {
                setTimeout(() => {
                    window.previewEngine.renderScreen();
                }, 100);
            }
            
            // تحديث التحديد المرئي
            document.querySelectorAll('.color-suggestion').forEach(el => el.classList.remove('selected'));
            colorDiv.classList.add('selected');
            
            console.log('Applied color:', color);
        });
        
        suggestionsContainer.appendChild(colorDiv);
    });
    
    // تحديث المود والحركات
    const moodSelect = document.getElementById('mood');
    if (moodSelect && suggestions.mood) {
        moodSelect.value = suggestions.mood;
        updateMood();
    }
    
    const animationSelect = document.getElementById('animationStyle');
    if (animationSelect && suggestions.animations && suggestions.animations.length > 0) {
        // اختيار أول حركة مناسبة
        const availableAnimations = ['fade-slide', 'scale-reveal', 'staggered', 'bounce'];
        const matchingAnimation = suggestions.animations.find(anim => availableAnimations.includes(anim));
        if (matchingAnimation) {
            animationSelect.value = matchingAnimation;
            updateAnimation();
        }
    }
}

// تبديل لوحة تحليل التصميم
function toggleDesignFeedback() {
    let panel = document.getElementById('designFeedbackPanel');
    
    if (panel) {
        panel.remove();
        return;
    }
    
    panel = document.createElement('div');
    panel.className = 'design-feedback-panel open';
    panel.id = 'designFeedbackPanel';
    
    panel.innerHTML = `
        <div class="feedback-header">
            <h3>💡 تحليل التصميم</h3>
            <button class="feedback-close" onclick="toggleDesignFeedback()">×</button>
        </div>
        <div class="feedback-content">
            <div class="feedback-section">
                <h3>نقاط القوة</h3>
                <div id="designStrengths">
                    <!-- نقاط القوة -->
                </div>
            </div>
            
            <div class="feedback-section">
                <h3>اقتراحات التحسين</h3>
                <div id="improvementSuggestions">
                    <!-- اقتراحات التحسين -->
                </div>
            </div>
            
            <div class="feedback-section">
                <h3>فحص الوصولية</h3>
                <div id="accessibilityReport">
                    <!-- تقرير الوصولية -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    updateDesignAnalysis();
}

// تحديث تحليل التصميم
function updateDesignAnalysis() {
    if (!window.aiAssistant || !window.themeEngine || !window.previewEngine) return;
    
    const currentScreen = window.previewEngine.currentScreen;
    const colors = window.themeEngine.colorScheme;
    const animations = [window.motionEngine?.currentAnimation || 'fade-slide'];
    const layout = { cardCount: 3 }; // مثال
    
    const analysis = window.aiAssistant.analyzeDesign(currentScreen, colors, animations, layout);
    
    // تحديث نقاط القوة
    const strengthsContainer = document.getElementById('designStrengths');
    if (strengthsContainer && analysis.strengths) {
        strengthsContainer.innerHTML = analysis.strengths.map(strength => 
            `<div class="strength-item">${strength}</div>`
        ).join('');
    }
    
    // تحديث اقتراحات التحسين
    const suggestionsContainer = document.getElementById('improvementSuggestions');
    if (suggestionsContainer && analysis.suggestions) {
        suggestionsContainer.innerHTML = analysis.suggestions.map(suggestion => `
            <div class="suggestion-item ${suggestion.severity}">
                <div class="suggestion-message">${suggestion.message}</div>
                <div class="suggestion-solution">${suggestion.solution}</div>
            </div>
        `).join('');
    }
    
    // تحديث تقرير الوصولية
    const accessibilityContainer = document.getElementById('accessibilityReport');
    if (accessibilityContainer && colors.primary && colors.onPrimary) {
        const contrastCheck = window.aiAssistant.checkColorContrast(colors.onPrimary, colors.primary);
        accessibilityContainer.innerHTML = `
            <div class="contrast-result">
                <span>تباين النص الأساسي:</span>
                <span class="contrast-ratio">${contrastCheck.ratio.toFixed(2)}:1</span>
            </div>
            <div class="contrast-rating ${contrastCheck.passAAA ? 'excellent' : contrastCheck.passAA ? 'good' : 'poor'}">
                ${contrastCheck.rating}
            </div>
        `;
    }
    
    // تحديث النقاط في الواجهة الرئيسية
    const scoreElement = document.getElementById('designScore');
    if (scoreElement) {
        scoreElement.textContent = analysis.score + '/100';
    }
}

// تحديث فحص التباين
function updateContrastCheck() {
    if (!window.aiAssistant || !window.themeEngine) return;
    
    const colors = window.themeEngine.colorScheme;
    const contrastContainer = document.getElementById('contrastCheck');
    
    if (!contrastContainer || !colors.primary || !colors.onPrimary) return;
    
    const contrastCheck = window.aiAssistant.checkColorContrast(colors.onPrimary, colors.primary);
    
    contrastContainer.innerHTML = `
        <div class="contrast-result">
            <span class="contrast-label">تباين النص:</span>
            <span class="contrast-ratio">${contrastCheck.ratio.toFixed(2)}:1</span>
        </div>
        <div class="contrast-rating ${contrastCheck.passAAA ? 'excellent' : contrastCheck.passAA ? 'good' : 'poor'}">
            ${contrastCheck.rating}
        </div>
        ${!contrastCheck.passAA ? '<div class="contrast-warning">⚠️ التباين ضعيف - قد يصعب قراءة النص</div>' : ''}
    `;
}

// تحديث اقتراحات التصميم في الواجهة الرئيسية
function updateDesignSuggestionsUI() {
    if (!window.aiAssistant) return;
    
    const suggestionsContainer = document.getElementById('designSuggestions');
    if (!suggestionsContainer) return;
    
    // الحصول على اقتراحات سريعة
    const currentDesign = {
        screenType: window.previewEngine?.currentScreen || 'splash',
        colors: window.themeEngine?.colorScheme || {},
        animations: [window.motionEngine?.currentAnimation || 'fade-slide'],
        layout: { cardCount: 3 }
    };
    
    const suggestions = window.aiAssistant.getSuggestions(currentDesign);
    
    if (suggestions.length === 0) {
        suggestionsContainer.innerHTML = '<div class="no-suggestions">✅ التصميم يبدو رائعاً!</div>';
        return;
    }
    
    suggestionsContainer.innerHTML = suggestions.slice(0, 3).map(suggestion => `
        <div class="suggestion-item ${suggestion.severity}">
            <div class="suggestion-message">${suggestion.message}</div>
        </div>
    `).join('');
}

// تحديث محسن للألوان مع التحليل
function updateColorsEnhancedWithAnalysis() {
    updateColorsEnhanced();
    
    // تأخير قصير للسماح بتطبيق الألوان
    setTimeout(() => {
        updateContrastCheck();
        updateDesignSuggestionsUI();
        
        // تحديث لوحة التحليل إذا كانت مفتوحة
        if (document.getElementById('designFeedbackPanel')) {
            updateDesignAnalysis();
        }
    }, 100);
}

// تحديث محسن للمود مع التحليل
function updateMoodEnhancedWithAnalysis() {
    updateMoodEnhanced();
    
    setTimeout(() => {
        updateContrastCheck();
        updateDesignSuggestionsUI();
    }, 100);
}

// تحديث محسن للحركة مع التحليل
function updateAnimationEnhancedWithAnalysis() {
    updateAnimationEnhanced();
    
    setTimeout(() => {
        updateDesignSuggestionsUI();
    }, 100);
}

// تحديث تلقائي للتحليل عند تغيير الشاشة
function updateScreenWithAnalysis() {
    updateScreen();
    
    setTimeout(() => {
        updateContrastCheck();
        updateDesignSuggestionsUI();
        
        if (document.getElementById('designFeedbackPanel')) {
            updateDesignAnalysis();
        }
    }, 200);
}

// تصدير محسن مع خيارات متقدمة
function exportProjectEnhanced() {
    console.log('Starting enhanced export...');
    
    // إظهار مؤشر التحميل
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        const originalText = exportBtn.textContent;
        exportBtn.textContent = 'جاري التصدير...';
        exportBtn.disabled = true;
        
        // تأخير قصير لإظهار التحميل
        setTimeout(() => {
            if (window.exportEngine) {
                window.exportEngine.exportProject();
            } else {
                console.log('Export engine not available, using basic export');
                // تصدير أساسي
                const projectData = {
                    screenType: window.previewEngine?.currentScreen || 'splash',
                    theme: window.themeEngine?.getColorSchemeForExport() || {},
                    animation: window.motionEngine?.getAnimationSettings() || {},
                    timestamp: new Date().toISOString()
                };
                
                const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'motion-android-project.json';
                a.click();
                URL.revokeObjectURL(url);
            }
            
            // إعادة تعيين الزر
            setTimeout(() => {
                exportBtn.textContent = originalText;
                exportBtn.disabled = false;
                
                // إظهار رسالة نجاح
                if (typeof showSuccessMessage === 'function') {
                    showSuccessMessage('تم تصدير المشروع بنجاح!');
                } else {
                    alert('تم تصدير المشروع بنجاح!');
                }
            }, 1000);
        }, 500);
    }
}

// عرض خيارات التصدير
function showExportOptions() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'exportOverlay';
    
    overlay.innerHTML = `
        <div class="export-options show">
            <h3>خيارات التصدير المتقدمة</h3>
            
            <div class="export-format-grid">
                <div class="export-format" data-format="compose" onclick="selectExportFormat(this)">
                    <div class="export-format-icon">📱</div>
                    <div class="export-format-name">Jetpack Compose</div>
                    <div class="export-format-desc">Android Studio جاهز</div>
                </div>
                
                <div class="export-format" data-format="tokens" onclick="selectExportFormat(this)">
                    <div class="export-format-icon">🎨</div>
                    <div class="export-format-name">Design Tokens</div>
                    <div class="export-format-desc">JSON + CSS Variables</div>
                </div>
                
                <div class="export-format" data-format="swift" onclick="selectExportFormat(this)">
                    <div class="export-format-icon">🍎</div>
                    <div class="export-format-name">SwiftUI</div>
                    <div class="export-format-desc">iOS Development</div>
                </div>
                
                <div class="export-format" data-format="flutter" onclick="selectExportFormat(this)">
                    <div class="export-format-icon">🦋</div>
                    <div class="export-format-name">Flutter</div>
                    <div class="export-format-desc">Cross Platform</div>
                </div>
            </div>
            
            <div class="export-actions">
                <button class="export-cancel" onclick="closeExportOptions()">إلغاء</button>
                <button class="export-confirm" onclick="confirmExport()">تصدير</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// تحديد تنسيق التصدير
function selectExportFormat(element) {
    document.querySelectorAll('.export-format').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

// تأكيد التصدير
function confirmExport() {
    const selectedFormat = document.querySelector('.export-format.selected');
    if (!selectedFormat) {
        alert('يرجى اختيار تنسيق التصدير');
        return;
    }
    
    const format = selectedFormat.getAttribute('data-format');
    closeExportOptions();
    
    // عرض مؤشر التحميل
    showLoadingOverlay('جاري تصدير المشروع...');
    
    setTimeout(() => {
        performExport(format);
        hideLoadingOverlay();
        showSuccessMessage('تم تصدير المشروع بنجاح!');
    }, 2000);
}

// تنفيذ التصدير
function performExport(format) {
    switch(format) {
        case 'compose':
            exportProjectEnhanced();
            break;
        case 'tokens':
            exportDesignTokens();
            break;
        case 'swift':
            exportSwiftUI();
            break;
        case 'flutter':
            exportFlutter();
            break;
    }
}

// تصدير Design Tokens
function exportDesignTokens() {
    if (!window.tokensEngine) return;
    
    // تحديث الرموز من الثيم الحالي
    if (window.themeEngine) {
        window.tokensEngine.updateColorsFromTheme(window.themeEngine.colorScheme);
    }
    
    const zip = new JSZip();
    
    // إضافة ملفات الرموز
    zip.file('tokens.json', window.tokensEngine.exportAsJSON());
    zip.file('tokens.css', window.tokensEngine.exportAsCSS());
    zip.file('tokens-android.xml', window.tokensEngine.exportAsAndroidXML());
    zip.file('tokens-compose.kt', window.tokensEngine.exportAsCompose());
    
    // تنزيل الملف
    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'design-tokens.zip';
        link.click();
    });
}

// تصدير SwiftUI
function exportSwiftUI() {
    if (!window.tokensEngine) return;
    
    const swiftCode = window.tokensEngine.exportAsSwift();
    
    const blob = new Blob([swiftCode], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'DesignTokens.swift';
    link.click();
}

// تصدير Flutter
function exportFlutter() {
    // سيتم تطويره لاحقاً
    alert('تصدير Flutter قريباً!');
}

// إغلاق خيارات التصدير
function closeExportOptions() {
    const overlay = document.getElementById('exportOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// عرض مؤشر التحميل
function showLoadingOverlay(message) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';
    
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// إخفاء مؤشر التحميل
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// تحديث الدوال الموجودة لتشمل التحليل
if (typeof updateColors !== 'undefined') {
    updateColors = updateColorsEnhancedWithAnalysis;
}
if (typeof updateMood !== 'undefined') {
    updateMood = updateMoodEnhancedWithAnalysis;
}
if (typeof updateAnimation !== 'undefined') {
    updateAnimation = updateAnimationEnhancedWithAnalysis;
}
if (typeof updateScreen !== 'undefined') {
    updateScreen = updateScreenWithAnalysis;
}

// تهيئة التحليل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تأخير قصير للسماح بتحميل جميع المحركات
    setTimeout(() => {
        updateContrastCheck();
        updateDesignSuggestionsUI();
    }, 1000);
});
// التأكد من توفر جميع الدوال عالمياً
window.updateScreen = updateScreen;
window.selectPreset = selectPreset;
window.updateColors = updateColors;
window.updateMood = updateMood;
window.updateAnimation = updateAnimation;
window.toggleTheme = toggleTheme;
window.suggestColorsForCategory = suggestColorsForCategory;
window.openMotionStudio = openMotionStudio;
window.openColorAssistant = openColorAssistant;
window.exportProjectEnhanced = exportProjectEnhanced;

console.log('All global functions registered successfully');