// Device Preview Engine - محرك معاينة الأجهزة المتقدم
class DevicePreviewEngine {
    constructor() {
        this.devices = {
            'pixel-7': {
                name: 'Google Pixel 7',
                width: 412,
                height: 915,
                pixelRatio: 2.625,
                userAgent: 'Android 13',
                features: ['fingerprint', 'face-unlock', 'wireless-charging']
            },
            'pixel-fold': {
                name: 'Google Pixel Fold',
                width: 673,
                height: 841,
                pixelRatio: 2.5,
                userAgent: 'Android 13',
                features: ['foldable', 'dual-screen', 'stylus'],
                foldedWidth: 316,
                foldedHeight: 684
            },
            'galaxy-s24': {
                name: 'Samsung Galaxy S24',
                width: 384,
                height: 854,
                pixelRatio: 3,
                userAgent: 'Android 14',
                features: ['s-pen', 'wireless-charging', 'water-resistant']
            },
            'iphone-15-pro': {
                name: 'iPhone 15 Pro',
                width: 393,
                height: 852,
                pixelRatio: 3,
                userAgent: 'iOS 17',
                features: ['face-id', 'wireless-charging', 'magsafe']
            },
            'ipad-pro': {
                name: 'iPad Pro 12.9"',
                width: 1024,
                height: 1366,
                pixelRatio: 2,
                userAgent: 'iPadOS 17',
                features: ['apple-pencil', 'magic-keyboard', 'face-id']
            },
            'surface-duo': {
                name: 'Microsoft Surface Duo',
                width: 720,
                height: 1800,
                pixelRatio: 2.5,
                userAgent: 'Android 12',
                features: ['dual-screen', 'stylus', 'hinge'],
                dualScreen: true
            }
        };
        
        this.currentDevice = 'pixel-7';
        this.currentOrientation = 'portrait';
        this.isInteractive = true;
        this.showDeviceFrame = true;
        this.simulateTouch = true;
        
        this.touchPoints = [];
        this.gestureRecognizer = new GestureRecognizer();
        
        this.initializeDevicePreview();
    }

    // تهيئة معاينة الأجهزة
    initializeDevicePreview() {
        this.createDeviceSelector();
        this.createOrientationToggle();
        this.createInteractionControls();
        this.setupTouchSimulation();
    }

    // إنشاء محدد الأجهزة
    createDeviceSelector() {
        const controlsPanel = document.querySelector('.controls-panel');
        if (!controlsPanel) return;

        const deviceSection = document.createElement('div');
        deviceSection.className = 'control-section';
        deviceSection.innerHTML = `
            <h3>معاينة الجهاز</h3>
            <select id="deviceSelector" onchange="devicePreview.changeDevice(this.value)">
                ${Object.entries(this.devices).map(([key, device]) => 
                    `<option value="${key}" ${key === this.currentDevice ? 'selected' : ''}>${device.name}</option>`
                ).join('')}
            </select>
            
            <div class="device-controls">
                <button class="device-control-btn" onclick="devicePreview.toggleOrientation()">
                    <span id="orientation-icon">📱</span>
                    <span id="orientation-text">Portrait</span>
                </button>
                
                <button class="device-control-btn" onclick="devicePreview.toggleFrame()">
                    <span>🖼️</span>
                    إطار الجهاز
                </button>
                
                <button class="device-control-btn" onclick="devicePreview.toggleInteraction()">
                    <span>👆</span>
                    <span id="interaction-text">تفاعلي</span>
                </button>
            </div>
            
            <div class="device-info" id="device-info">
                <!-- معلومات الجهاز -->
            </div>
        `;
        
        // إدراج قبل قسم المحتوى
        const contentSection = controlsPanel.querySelector('.control-section:last-child');
        controlsPanel.insertBefore(deviceSection, contentSection);
        
        this.updateDeviceInfo();
    }

    // إنشاء تبديل الاتجاه
    createOrientationToggle() {
        // تم إنشاؤه في createDeviceSelector
    }

    // إنشاء عناصر التحكم في التفاعل
    createInteractionControls() {
        const previewPanel = document.querySelector('.preview-panel');
        if (!previewPanel) return;

        const interactionOverlay = document.createElement('div');
        interactionOverlay.id = 'interaction-overlay';
        interactionOverlay.className = 'interaction-overlay';
        interactionOverlay.innerHTML = `
            <div class="interaction-controls">
                <button onclick="devicePreview.simulateGesture('tap')" title="محاكاة نقرة">👆</button>
                <button onclick="devicePreview.simulateGesture('swipe')" title="محاكاة سحب">👈</button>
                <button onclick="devicePreview.simulateGesture('pinch')" title="محاكاة قرص">🤏</button>
                <button onclick="devicePreview.simulateGesture('long-press')" title="محاكاة ضغط طويل">⏱️</button>
            </div>
            
            <div class="touch-indicators" id="touch-indicators">
                <!-- مؤشرات اللمس -->
            </div>
        `;
        
        previewPanel.appendChild(interactionOverlay);
    }

    // إعداد محاكاة اللمس
    setupTouchSimulation() {
        const phoneScreen = document.getElementById('phoneScreen');
        if (!phoneScreen) return;

        phoneScreen.addEventListener('mousedown', (e) => this.handleTouchStart(e));
        phoneScreen.addEventListener('mousemove', (e) => this.handleTouchMove(e));
        phoneScreen.addEventListener('mouseup', (e) => this.handleTouchEnd(e));
        phoneScreen.addEventListener('mouseleave', (e) => this.handleTouchEnd(e));
        
        // دعم اللمس الحقيقي
        phoneScreen.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        phoneScreen.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        phoneScreen.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    // تغيير الجهاز
    changeDevice(deviceKey) {
        if (!this.devices[deviceKey]) return;
        
        this.currentDevice = deviceKey;
        this.updateDevicePreview();
        this.updateDeviceInfo();
        
        // إعادة تطبيق التخطيط
        if (window.layoutEngine) {
            window.layoutEngine.setDevice(deviceKey);
        }
    }

    // تبديل الاتجاه
    toggleOrientation() {
        this.currentOrientation = this.currentOrientation === 'portrait' ? 'landscape' : 'portrait';
        this.updateDevicePreview();
        
        const orientationIcon = document.getElementById('orientation-icon');
        const orientationText = document.getElementById('orientation-text');
        
        if (orientationIcon && orientationText) {
            if (this.currentOrientation === 'landscape') {
                orientationIcon.textContent = '📱';
                orientationText.textContent = 'Landscape';
            } else {
                orientationIcon.textContent = '📱';
                orientationText.textContent = 'Portrait';
            }
        }
        
        // تحديث محرك التخطيط
        if (window.layoutEngine) {
            window.layoutEngine.setOrientation(this.currentOrientation);
        }
    }

    // تبديل إطار الجهاز
    toggleFrame() {
        this.showDeviceFrame = !this.showDeviceFrame;
        this.updateDevicePreview();
    }

    // تبديل التفاعل
    toggleInteraction() {
        this.isInteractive = !this.isInteractive;
        
        const interactionText = document.getElementById('interaction-text');
        if (interactionText) {
            interactionText.textContent = this.isInteractive ? 'تفاعلي' : 'ثابت';
        }
        
        const interactionOverlay = document.getElementById('interaction-overlay');
        if (interactionOverlay) {
            interactionOverlay.style.display = this.isInteractive ? 'block' : 'none';
        }
    }

    // تحديث معاينة الجهاز
    updateDevicePreview() {
        const device = this.devices[this.currentDevice];
        const phoneMockup = document.querySelector('.phone-mockup');
        const phoneScreen = document.getElementById('phoneScreen');
        
        if (!phoneMockup || !phoneScreen || !device) return;

        // حساب الأبعاد
        let width = device.width;
        let height = device.height;
        
        if (this.currentOrientation === 'landscape') {
            [width, height] = [height, width];
        }
        
        // تطبيق المقياس
        const scale = this.calculateOptimalScale(width, height);
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;
        
        // تحديث أبعاد الإطار
        if (this.showDeviceFrame) {
            phoneMockup.style.width = (scaledWidth + 40) + 'px';
            phoneMockup.style.height = (scaledHeight + 40) + 'px';
            phoneMockup.style.padding = '20px';
            phoneMockup.style.background = this.getDeviceFrameColor();
            phoneMockup.style.borderRadius = this.getDeviceFrameRadius();
        } else {
            phoneMockup.style.width = scaledWidth + 'px';
            phoneMockup.style.height = scaledHeight + 'px';
            phoneMockup.style.padding = '0';
            phoneMockup.style.background = 'transparent';
            phoneMockup.style.borderRadius = '0';
        }
        
        // تحديث أبعاد الشاشة
        phoneScreen.style.width = scaledWidth + 'px';
        phoneScreen.style.height = scaledHeight + 'px';
        
        // إضافة كلاسات الجهاز
        phoneScreen.className = `phone-screen device-${this.currentDevice} orientation-${this.currentOrientation}`;
        
        // تحديث معلومات الجهاز
        this.updateDeviceLabel();
        
        // تطبيق خصائص الجهاز
        this.applyDeviceSpecificStyles();
    }

    // حساب المقياس الأمثل
    calculateOptimalScale(width, height) {
        const containerWidth = 400;
        const containerHeight = 700;
        
        const scaleX = containerWidth / width;
        const scaleY = containerHeight / height;
        
        return Math.min(scaleX, scaleY, 1);
    }

    // الحصول على لون إطار الجهاز
    getDeviceFrameColor() {
        const device = this.devices[this.currentDevice];
        
        if (device.userAgent.includes('iOS')) {
            return '#1d1d1f'; // لون iPhone
        } else if (device.name.includes('Pixel')) {
            return '#202124'; // لون Pixel
        } else if (device.name.includes('Galaxy')) {
            return '#1a1a1a'; // لون Samsung
        }
        
        return '#333'; // افتراضي
    }

    // الحصول على انحناء إطار الجهاز
    getDeviceFrameRadius() {
        const device = this.devices[this.currentDevice];
        
        if (device.userAgent.includes('iOS')) {
            return '25px'; // انحناء iPhone
        } else if (device.features?.includes('foldable')) {
            return '15px'; // انحناء الأجهزة القابلة للطي
        }
        
        return '20px'; // افتراضي
    }

    // تحديث تسمية الجهاز
    updateDeviceLabel() {
        const device = this.devices[this.currentDevice];
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
        
        const orientationText = this.currentOrientation === 'portrait' ? 'عمودي' : 'أفقي';
        deviceLabel.innerHTML = `
            <div class="device-name">${device.name}</div>
            <div class="device-specs">${device.width}×${device.height} • ${orientationText}</div>
        `;
    }

    // تحديث معلومات الجهاز
    updateDeviceInfo() {
        const device = this.devices[this.currentDevice];
        const deviceInfo = document.getElementById('device-info');
        
        if (!deviceInfo) return;
        
        deviceInfo.innerHTML = `
            <div class="device-spec">
                <strong>الدقة:</strong> ${device.width}×${device.height}
            </div>
            <div class="device-spec">
                <strong>نسبة البكسل:</strong> ${device.pixelRatio}x
            </div>
            <div class="device-spec">
                <strong>النظام:</strong> ${device.userAgent}
            </div>
            <div class="device-features">
                <strong>الميزات:</strong>
                ${device.features?.map(feature => `<span class="feature-tag">${this.translateFeature(feature)}</span>`).join('') || 'لا توجد'}
            </div>
        `;
    }

    // ترجمة الميزات
    translateFeature(feature) {
        const translations = {
            'fingerprint': 'بصمة الإصبع',
            'face-unlock': 'فتح بالوجه',
            'wireless-charging': 'شحن لاسلكي',
            'foldable': 'قابل للطي',
            'dual-screen': 'شاشة مزدوجة',
            'stylus': 'قلم رقمي',
            's-pen': 'S Pen',
            'water-resistant': 'مقاوم للماء',
            'face-id': 'Face ID',
            'magsafe': 'MagSafe',
            'apple-pencil': 'Apple Pencil',
            'magic-keyboard': 'Magic Keyboard',
            'hinge': 'مفصلة'
        };
        
        return translations[feature] || feature;
    }

    // تطبيق أنماط خاصة بالجهاز
    applyDeviceSpecificStyles() {
        const device = this.devices[this.currentDevice];
        const phoneScreen = document.getElementById('phoneScreen');
        
        if (!phoneScreen) return;
        
        // إزالة الأنماط السابقة
        phoneScreen.classList.remove('ios-device', 'android-device', 'foldable-device');
        
        // إضافة أنماط جديدة
        if (device.userAgent.includes('iOS')) {
            phoneScreen.classList.add('ios-device');
        } else {
            phoneScreen.classList.add('android-device');
        }
        
        if (device.features?.includes('foldable')) {
            phoneScreen.classList.add('foldable-device');
        }
        
        // تطبيق خصائص خاصة
        if (device.name.includes('Fold') && this.currentOrientation === 'landscape') {
            this.applyFoldableLayout();
        }
    }

    // تطبيق تخطيط الأجهزة القابلة للطي
    applyFoldableLayout() {
        const phoneScreen = document.getElementById('phoneScreen');
        if (!phoneScreen) return;
        
        // إضافة خط الطي
        let foldLine = phoneScreen.querySelector('.fold-line');
        if (!foldLine) {
            foldLine = document.createElement('div');
            foldLine.className = 'fold-line';
            phoneScreen.appendChild(foldLine);
        }
        
        // تطبيق تخطيط الشاشة المزدوجة
        const content = phoneScreen.querySelector('.phone-screen > div');
        if (content) {
            content.style.display = 'grid';
            content.style.gridTemplateColumns = '1fr 2px 1fr';
            content.style.gap = '0';
        }
    }

    // معالجة بداية اللمس
    handleTouchStart(e) {
        if (!this.isInteractive) return;
        
        e.preventDefault();
        const touch = this.getTouchPoint(e);
        this.touchPoints.push(touch);
        
        this.createTouchIndicator(touch);
        this.gestureRecognizer.start(touch);
    }

    // معالجة حركة اللمس
    handleTouchMove(e) {
        if (!this.isInteractive || this.touchPoints.length === 0) return;
        
        e.preventDefault();
        const touch = this.getTouchPoint(e);
        
        // تحديث آخر نقطة لمس
        this.touchPoints[this.touchPoints.length - 1] = touch;
        
        this.updateTouchIndicator(touch);
        this.gestureRecognizer.move(touch);
    }

    // معالجة نهاية اللمس
    handleTouchEnd(e) {
        if (!this.isInteractive) return;
        
        e.preventDefault();
        
        const gesture = this.gestureRecognizer.end();
        this.handleGesture(gesture);
        
        this.removeTouchIndicators();
        this.touchPoints = [];
    }

    // الحصول على نقطة اللمس
    getTouchPoint(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
        const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
            timestamp: Date.now()
        };
    }

    // إنشاء مؤشر اللمس
    createTouchIndicator(touch) {
        const indicator = document.createElement('div');
        indicator.className = 'touch-indicator';
        indicator.style.cssText = `
            position: absolute;
            left: ${touch.x - 15}px;
            top: ${touch.y - 15}px;
            width: 30px;
            height: 30px;
            border: 2px solid #2196F3;
            border-radius: 50%;
            background: rgba(33, 150, 243, 0.2);
            pointer-events: none;
            z-index: 1000;
            animation: touchRipple 0.3s ease-out;
        `;
        
        const touchIndicators = document.getElementById('touch-indicators');
        if (touchIndicators) {
            touchIndicators.appendChild(indicator);
        }
    }

    // تحديث مؤشر اللمس
    updateTouchIndicator(touch) {
        const indicators = document.querySelectorAll('.touch-indicator');
        const lastIndicator = indicators[indicators.length - 1];
        
        if (lastIndicator) {
            lastIndicator.style.left = (touch.x - 15) + 'px';
            lastIndicator.style.top = (touch.y - 15) + 'px';
        }
    }

    // إزالة مؤشرات اللمس
    removeTouchIndicators() {
        const indicators = document.querySelectorAll('.touch-indicator');
        indicators.forEach(indicator => {
            indicator.style.animation = 'touchFadeOut 0.2s ease-out forwards';
            setTimeout(() => indicator.remove(), 200);
        });
    }

    // معالجة الإيماءة
    handleGesture(gesture) {
        if (!gesture) return;
        
        console.log('Gesture detected:', gesture);
        
        // تطبيق تأثيرات بناءً على الإيماءة
        switch (gesture.type) {
            case 'tap':
                this.handleTap(gesture);
                break;
            case 'swipe':
                this.handleSwipe(gesture);
                break;
            case 'long-press':
                this.handleLongPress(gesture);
                break;
        }
    }

    // معالجة النقر
    handleTap(gesture) {
        // إضافة تأثير ripple
        if (window.motionEngine) {
            const element = document.elementFromPoint(gesture.startX, gesture.startY);
            if (element) {
                window.motionEngine.animateButton(element, 'ripple');
            }
        }
    }

    // معالجة السحب
    handleSwipe(gesture) {
        // تطبيق انتقال الصفحة إذا كان مناسباً
        if (gesture.direction === 'left' && window.previewEngine?.currentScreen === 'onboarding') {
            // محاكاة الانتقال للصفحة التالية
            this.simulatePageTransition('next');
        } else if (gesture.direction === 'right' && window.previewEngine?.currentScreen === 'onboarding') {
            // محاكاة الانتقال للصفحة السابقة
            this.simulatePageTransition('prev');
        }
    }

    // معالجة الضغط الطويل
    handleLongPress(gesture) {
        // إظهار قائمة سياقية أو تأثير خاص
        this.showContextualFeedback(gesture);
    }

    // محاكاة انتقال الصفحة
    simulatePageTransition(direction) {
        const phoneScreen = document.getElementById('phoneScreen');
        if (!phoneScreen) return;
        
        phoneScreen.style.transform = direction === 'next' ? 'translateX(-10px)' : 'translateX(10px)';
        phoneScreen.style.transition = 'transform 0.2s ease-out';
        
        setTimeout(() => {
            phoneScreen.style.transform = '';
            phoneScreen.style.transition = '';
        }, 200);
    }

    // إظهار تعليقات سياقية
    showContextualFeedback(gesture) {
        const feedback = document.createElement('div');
        feedback.className = 'contextual-feedback';
        feedback.textContent = 'ضغط طويل';
        feedback.style.cssText = `
            position: absolute;
            left: ${gesture.startX}px;
            top: ${gesture.startY - 40}px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1001;
            animation: fadeInOut 1.5s ease-out forwards;
        `;
        
        const phoneScreen = document.getElementById('phoneScreen');
        if (phoneScreen) {
            phoneScreen.appendChild(feedback);
            setTimeout(() => feedback.remove(), 1500);
        }
    }

    // محاكاة إيماءة
    simulateGesture(gestureType) {
        const phoneScreen = document.getElementById('phoneScreen');
        if (!phoneScreen) return;
        
        const rect = phoneScreen.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        switch (gestureType) {
            case 'tap':
                this.simulateTap(centerX, centerY);
                break;
            case 'swipe':
                this.simulateSwipe(centerX, centerY);
                break;
            case 'pinch':
                this.simulatePinch(centerX, centerY);
                break;
            case 'long-press':
                this.simulateLongPress(centerX, centerY);
                break;
        }
    }

    // محاكاة نقرة
    simulateTap(x, y) {
        this.createTouchIndicator({ x, y });
        setTimeout(() => this.removeTouchIndicators(), 300);
        
        // تشغيل تأثير على العنصر المستهدف
        const element = document.elementFromPoint(x, y);
        if (element && window.motionEngine) {
            window.motionEngine.animateButton(element, 'press');
        }
    }

    // محاكاة سحب
    simulateSwipe(startX, startY) {
        const endX = startX - 100;
        const steps = 10;
        const stepX = (endX - startX) / steps;
        
        for (let i = 0; i <= steps; i++) {
            setTimeout(() => {
                const x = startX + (stepX * i);
                this.createTouchIndicator({ x, y: startY });
                
                if (i === steps) {
                    setTimeout(() => this.removeTouchIndicators(), 100);
                }
            }, i * 20);
        }
    }

    // محاكاة قرص
    simulatePinch(centerX, centerY) {
        // إنشاء نقطتي لمس تتحركان للداخل
        const distance = 50;
        
        for (let i = 0; i <= 10; i++) {
            setTimeout(() => {
                const currentDistance = distance - (i * 4);
                this.createTouchIndicator({ x: centerX - currentDistance, y: centerY });
                this.createTouchIndicator({ x: centerX + currentDistance, y: centerY });
                
                if (i === 10) {
                    setTimeout(() => this.removeTouchIndicators(), 100);
                }
            }, i * 30);
        }
    }

    // محاكاة ضغط طويل
    simulateLongPress(x, y) {
        this.createTouchIndicator({ x, y });
        
        // إضافة مؤشر تقدم
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'long-press-progress';
        progressIndicator.style.cssText = `
            position: absolute;
            left: ${x - 20}px;
            top: ${y - 20}px;
            width: 40px;
            height: 40px;
            border: 3px solid transparent;
            border-top: 3px solid #2196F3;
            border-radius: 50%;
            animation: longPressProgress 1s linear forwards;
            pointer-events: none;
            z-index: 1001;
        `;
        
        const phoneScreen = document.getElementById('phoneScreen');
        if (phoneScreen) {
            phoneScreen.appendChild(progressIndicator);
        }
        
        setTimeout(() => {
            this.removeTouchIndicators();
            progressIndicator.remove();
            this.showContextualFeedback({ startX: x, startY: y });
        }, 1000);
    }

    // تصدير إعدادات الجهاز
    exportDeviceSettings() {
        return {
            device: this.currentDevice,
            orientation: this.currentOrientation,
            showFrame: this.showDeviceFrame,
            interactive: this.isInteractive,
            simulateTouch: this.simulateTouch
        };
    }
}

// فئة التعرف على الإيماءات
class GestureRecognizer {
    constructor() {
        this.startPoint = null;
        this.startTime = null;
        this.isLongPress = false;
        this.longPressTimer = null;
    }

    start(point) {
        this.startPoint = point;
        this.startTime = point.timestamp;
        this.isLongPress = false;
        
        // بدء مؤقت الضغط الطويل
        this.longPressTimer = setTimeout(() => {
            this.isLongPress = true;
        }, 500);
    }

    move(point) {
        // إلغاء الضغط الطويل إذا تحرك المستخدم كثيراً
        if (this.startPoint) {
            const distance = Math.sqrt(
                Math.pow(point.x - this.startPoint.x, 2) + 
                Math.pow(point.y - this.startPoint.y, 2)
            );
            
            if (distance > 10) {
                clearTimeout(this.longPressTimer);
                this.isLongPress = false;
            }
        }
    }

    end() {
        clearTimeout(this.longPressTimer);
        
        if (!this.startPoint) return null;
        
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        if (this.isLongPress) {
            return {
                type: 'long-press',
                startX: this.startPoint.x,
                startY: this.startPoint.y,
                duration: duration
            };
        }
        
        if (duration < 200) {
            return {
                type: 'tap',
                startX: this.startPoint.x,
                startY: this.startPoint.y,
                duration: duration
            };
        }
        
        // تحديد اتجاه السحب
        const deltaX = this.startPoint.x - this.startPoint.x; // سيتم تحديثه في move
        const deltaY = this.startPoint.y - this.startPoint.y;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
            return {
                type: 'swipe',
                direction: deltaX > 0 ? 'right' : 'left',
                startX: this.startPoint.x,
                startY: this.startPoint.y,
                distance: Math.abs(deltaX),
                duration: duration
            };
        }
        
        return null;
    }
}

// إضافة أنماط CSS للأجهزة والتفاعل
const devicePreviewCSS = `
.device-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 15px;
}

.device-control-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease;
}

.device-control-btn:hover {
    border-color: #6200EE;
    background: #f8f5ff;
}

.device-control-btn span:first-child {
    font-size: 14px;
}

.device-info {
    margin-top: 15px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 12px;
}

.device-spec {
    margin-bottom: 6px;
}

.device-features {
    margin-top: 8px;
}

.feature-tag {
    display: inline-block;
    background: #e3f2fd;
    color: #1976d2;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    margin: 2px 4px 2px 0;
}

.device-label {
    text-align: center;
    margin-bottom: 15px;
}

.device-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.device-specs {
    font-size: 12px;
    color: #666;
}

.interaction-overlay {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;
}

.interaction-controls {
    display: flex;
    gap: 8px;
    background: rgba(255, 255, 255, 0.9);
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.interaction-controls button {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s ease;
}

.interaction-controls button:hover {
    background: rgba(98, 0, 238, 0.1);
}

.touch-indicators {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.fold-line {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, transparent, #333 50%, transparent);
    transform: translateX(-50%);
    z-index: 10;
}

.ios-device {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.android-device {
    font-family: Roboto, 'Segoe UI', sans-serif;
}

.foldable-device.orientation-landscape {
    border-left: 1px solid #333;
    border-right: 1px solid #333;
}

@keyframes touchRipple {
    0% {
        transform: scale(0.5);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 0.7;
    }
}

@keyframes touchFadeOut {
    to {
        opacity: 0;
        transform: scale(1.2);
    }
}

@keyframes longPressProgress {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes fadeInOut {
    0%, 100% {
        opacity: 0;
        transform: translateY(10px);
    }
    20%, 80% {
        opacity: 1;
        transform: translateY(0);
    }
}

.contextual-feedback {
    animation: fadeInOut 1.5s ease-out forwards;
}
`;

// إضافة CSS للصفحة
const deviceStyle = document.createElement('style');
deviceStyle.textContent = devicePreviewCSS;
document.head.appendChild(deviceStyle);

// إنشاء مثيل عام
window.devicePreview = new DevicePreviewEngine();