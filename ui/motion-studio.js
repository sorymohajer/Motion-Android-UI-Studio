// Motion Studio JavaScript
class MotionStudio {
    constructor() {
        this.selectedElement = null;
        this.timeline = {
            duration: 2000, // 2 seconds
            currentTime: 0,
            isPlaying: false,
            zoom: 1,
            tracks: []
        };
        
        this.history = {
            states: [],
            currentIndex: -1,
            maxStates: 50
        };
        
        this.elements = new Map();
        this.keyframes = new Map();
        this.presets = new Map();
        
        this.playbackSpeed = 1;
        this.isLooping = false;
        this.showGrid = false;
        this.showGuides = false;
        
        this.initializeStudio();
        this.loadPresets();
        this.setupEventListeners();
    }

    // تهيئة الاستوديو
    initializeStudio() {
        // تحميل الحالة من localStorage إذا كانت متوفرة
        this.loadStudioState();
        
        this.initializeTimeline();
        this.initializeElements();
        this.initializeProperties();
        this.saveState();
    }

    // تحميل حالة الاستوديو من localStorage
    loadStudioState() {
        try {
            const savedState = localStorage.getItem('studioState');
            if (savedState) {
                const state = JSON.parse(savedState);
                console.log('Loading studio state:', state);
                
                // تطبيق الحالة المحفوظة
                if (state.theme && window.themeEngine) {
                    window.themeEngine.currentPreset = state.theme.preset;
                    window.themeEngine.primaryColor = state.theme.primaryColor;
                    window.themeEngine.mood = state.theme.mood;
                    if (state.theme.colorScheme) {
                        window.themeEngine.colorScheme = state.theme.colorScheme;
                    }
                    window.themeEngine.applyCSSVariables();
                }
                
                if (state.animation && window.motionEngine) {
                    window.motionEngine.currentAnimation = state.animation.type;
                    window.motionEngine.animationDuration = state.animation.duration;
                    window.motionEngine.animationEasing = state.animation.easing;
                }
                
                // تحديث واجهة المستخدم
                this.updateUIFromState(state);
            }
        } catch (error) {
            console.error('Error loading studio state:', error);
        }
    }

    // تحديث واجهة المستخدم من الحالة المحفوظة
    updateUIFromState(state) {
        // تحديث عنوان الصفحة
        if (state.screenType) {
            const screenNames = {
                'splash': 'Splash Screen',
                'login': 'Login Screen', 
                'home': 'Home Screen',
                'onboarding': 'Onboarding',
                'settings': 'Settings Screen'
            };
            
            const headerTitle = document.querySelector('.motion-studio-header h1');
            if (headerTitle) {
                headerTitle.textContent = `Motion Studio - ${screenNames[state.screenType] || state.screenType}`;
            }
        }
        
        // تحديث عناصر المعاينة بناءً على نوع الشاشة
        this.updatePreviewElements(state.screenType, state.screenData);
    }

    // تحديث عناصر المعاينة
    updatePreviewElements(screenType, screenData) {
        const element1 = document.getElementById('element1');
        const element2 = document.getElementById('element2');
        const element3 = document.getElementById('element3');
        
        if (!element1 || !element2 || !element3) return;
        
        switch(screenType) {
            case 'splash':
                element1.querySelector('.element-content').textContent = screenData?.splash?.logoText || 'Logo';
                element2.querySelector('.element-content').textContent = screenData?.splash?.appName || 'عنوان التطبيق';
                element3.querySelector('.element-content').textContent = screenData?.splash?.tagline || 'وصف التطبيق';
                break;
            case 'login':
                element1.querySelector('.element-content').textContent = '🔐';
                element2.querySelector('.element-content').textContent = screenData?.login?.title || 'تسجيل الدخول';
                element3.querySelector('.element-content').textContent = 'نموذج تسجيل الدخول';
                break;
            case 'home':
                element1.querySelector('.element-content').textContent = '🏠';
                element2.querySelector('.element-content').textContent = screenData?.home?.title || 'الرئيسية';
                element3.querySelector('.element-content').textContent = screenData?.home?.welcomeText || 'مرحباً بك';
                break;
            case 'onboarding':
                element1.querySelector('.element-content').textContent = '👋';
                element2.querySelector('.element-content').textContent = 'مرحباً';
                element3.querySelector('.element-content').textContent = 'اكتشف ميزات التطبيق';
                break;
            case 'settings':
                element1.querySelector('.element-content').textContent = '⚙️';
                element2.querySelector('.element-content').textContent = screenData?.settings?.title || 'الإعدادات';
                element3.querySelector('.element-content').textContent = 'إعدادات التطبيق';
                break;
        }
    }

    // تهيئة الخط الزمني
    initializeTimeline() {
        const timeMarkers = document.getElementById('timeMarkers');
        const timelineTracks = document.getElementById('timelineTracks');
        
        // إنشاء علامات الوقت
        for (let i = 0; i <= 20; i++) {
            const marker = document.createElement('div');
            marker.className = 'time-marker';
            marker.style.left = (i * 50) + 'px';
            marker.setAttribute('data-time', (i * 0.1).toFixed(1) + 's');
            timeMarkers.appendChild(marker);
        }
        
        // إنشاء مسارات العناصر
        const elements = ['splash-logo', 'splash-title', 'splash-subtitle'];
        elements.forEach((elementId, index) => {
            const track = this.createTrack(elementId, `العنصر ${index + 1}`);
            timelineTracks.appendChild(track);
            this.timeline.tracks.push({
                id: elementId,
                element: track,
                keyframes: []
            });
        });
    }

    // إنشاء مسار
    createTrack(elementId, label) {
        const track = document.createElement('div');
        track.className = 'timeline-track';
        track.setAttribute('data-element', elementId);
        
        const trackLabel = document.createElement('div');
        trackLabel.className = 'track-label';
        trackLabel.textContent = label;
        
        const trackContent = document.createElement('div');
        trackContent.className = 'track-content';
        
        track.appendChild(trackLabel);
        track.appendChild(trackContent);
        
        // إضافة keyframe افتراضي
        this.addKeyframe(elementId, 0, {
            x: 0, y: 0, scale: 1, rotation: 0, opacity: 1
        });
        
        return track;
    }

    // تهيئة العناصر
    initializeElements() {
        const previewElements = document.querySelectorAll('.preview-element');
        
        previewElements.forEach(element => {
            const elementId = element.getAttribute('data-element');
            
            this.elements.set(elementId, {
                element: element,
                initialState: this.getElementState(element),
                currentState: this.getElementState(element),
                keyframes: new Map()
            });
            
            // إضافة مستمع النقر
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectElement(elementId);
            });
        });
        
        // إلغاء التحديد عند النقر خارج العناصر
        document.getElementById('previewStage').addEventListener('click', () => {
            this.selectElement(null);
        });
    }

    // تهيئة خصائص العنصر
    initializeProperties() {
        // تحديث قيم الخصائص
        this.updatePropertyValues();
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // مستمعي لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case ' ':
                        e.preventDefault();
                        this.togglePlayback();
                        break;
                }
            }
        });
        
        // مستمع تغيير حجم النافذة
        window.addEventListener('resize', () => {
            this.updateTimeline();
        });
    }

    // تحديد عنصر
    selectElement(elementId) {
        // إزالة التحديد السابق
        document.querySelectorAll('.preview-element').forEach(el => {
            el.classList.remove('selected');
        });
        
        if (elementId) {
            const element = this.elements.get(elementId);
            if (element) {
                element.element.classList.add('selected');
                this.selectedElement = elementId;
                this.updateSelectedElementInfo();
                this.updatePropertyValues();
            }
        } else {
            this.selectedElement = null;
            this.updateSelectedElementInfo();
        }
    }

    // تحديث معلومات العنصر المحدد
    updateSelectedElementInfo() {
        const selectedElementDiv = document.getElementById('selectedElement');
        
        if (this.selectedElement) {
            const elementNames = {
                'splash-logo': 'شعار التطبيق',
                'splash-title': 'عنوان التطبيق',
                'splash-subtitle': 'وصف التطبيق'
            };
            selectedElementDiv.textContent = elementNames[this.selectedElement] || this.selectedElement;
        } else {
            selectedElementDiv.textContent = 'لم يتم تحديد عنصر';
        }
    }

    // الحصول على حالة العنصر
    getElementState(element) {
        const style = getComputedStyle(element);
        const transform = style.transform;
        
        // استخراج قيم التحويل
        let x = 0, y = 0, scale = 1, rotation = 0;
        
        if (transform && transform !== 'none') {
            const matrix = transform.match(/matrix.*\((.+)\)/);
            if (matrix) {
                const values = matrix[1].split(', ').map(parseFloat);
                x = values[4] || 0;
                y = values[5] || 0;
                scale = Math.sqrt(values[0] * values[0] + values[1] * values[1]);
                rotation = Math.atan2(values[1], values[0]) * (180 / Math.PI);
            }
        }
        
        return {
            x: x,
            y: y,
            scale: scale,
            rotation: rotation,
            opacity: parseFloat(style.opacity) || 1
        };
    }

    // تطبيق حالة على العنصر
    applyStateToElement(elementId, state, duration = 0) {
        const elementData = this.elements.get(elementId);
        if (!elementData) return;
        
        const element = elementData.element;
        
        if (duration > 0) {
            element.style.transition = `all ${duration}ms ease-out`;
        } else {
            element.style.transition = '';
        }
        
        element.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale}) rotate(${state.rotation}deg)`;
        element.style.opacity = state.opacity;
        
        // تحديث الحالة الحالية
        elementData.currentState = { ...state };
        
        // إزالة الانتقال بعد الانتهاء
        if (duration > 0) {
            setTimeout(() => {
                element.style.transition = '';
            }, duration);
        }
    }

    // تحديث خاصية
    updateProperty(property, value) {
        if (!this.selectedElement) return;
        
        const elementData = this.elements.get(this.selectedElement);
        if (!elementData) return;
        
        const newState = { ...elementData.currentState };
        newState[property] = parseFloat(value);
        
        this.applyStateToElement(this.selectedElement, newState);
        this.updatePropertyValues();
        
        // حفظ الحالة للتراجع
        this.saveState();
    }

    // تحديث قيم الخصائص في الواجهة
    updatePropertyValues() {
        if (!this.selectedElement) return;
        
        const elementData = this.elements.get(this.selectedElement);
        if (!elementData) return;
        
        const state = elementData.currentState;
        
        // تحديث المنزلقات
        const positionX = document.getElementById('positionX');
        const positionY = document.getElementById('positionY');
        const scale = document.getElementById('scale');
        const rotation = document.getElementById('rotation');
        const opacity = document.getElementById('opacity');
        const duration = document.getElementById('duration');
        const delay = document.getElementById('delay');
        
        if (positionX) positionX.value = state.x;
        if (positionY) positionY.value = state.y;
        if (scale) scale.value = state.scale;
        if (rotation) rotation.value = state.rotation;
        if (opacity) opacity.value = state.opacity;
        
        // تحديث النصوص
        const positionXValue = document.getElementById('positionXValue');
        const positionYValue = document.getElementById('positionYValue');
        const scaleValue = document.getElementById('scaleValue');
        const rotationValue = document.getElementById('rotationValue');
        const opacityValue = document.getElementById('opacityValue');
        const durationValue = document.getElementById('durationValue');
        const delayValue = document.getElementById('delayValue');
        
        if (positionXValue) positionXValue.textContent = Math.round(state.x) + 'px';
        if (positionYValue) positionYValue.textContent = Math.round(state.y) + 'px';
        if (scaleValue) scaleValue.textContent = state.scale.toFixed(1);
        if (rotationValue) rotationValue.textContent = Math.round(state.rotation) + '°';
        if (opacityValue) opacityValue.textContent = Math.round(state.opacity * 100) + '%';
        
        // تحديث قيم التوقيت
        if (duration && durationValue) {
            durationValue.textContent = duration.value + 's';
        }
        if (delay && delayValue) {
            delayValue.textContent = delay.value + 's';
        }
    }

    // إضافة keyframe
    addKeyframe(elementId, time, state) {
        const track = this.timeline.tracks.find(t => t.id === elementId);
        if (!track) return;
        
        const keyframe = {
            time: time,
            state: { ...state },
            element: this.createKeyframeElement(time)
        };
        
        track.keyframes.push(keyframe);
        track.element.querySelector('.track-content').appendChild(keyframe.element);
        
        // ترتيب keyframes حسب الوقت
        track.keyframes.sort((a, b) => a.time - b.time);
        
        return keyframe;
    }

    // إنشاء عنصر keyframe
    createKeyframeElement(time) {
        const keyframe = document.createElement('div');
        keyframe.className = 'keyframe';
        keyframe.style.left = (time * 500) + 'px'; // 500px = 1 second
        
        keyframe.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectKeyframe(keyframe);
        });
        
        return keyframe;
    }

    // تحديد keyframe
    selectKeyframe(keyframeElement) {
        document.querySelectorAll('.keyframe').forEach(kf => {
            kf.classList.remove('selected');
        });
        
        keyframeElement.classList.add('selected');
    }

    // تشغيل الأنيميشن
    play() {
        if (this.timeline.isPlaying) return;
        
        this.timeline.isPlaying = true;
        this.timeline.startTime = Date.now() - this.timeline.currentTime;
        
        this.animationLoop();
    }

    // إيقاف الأنيميشن
    pause() {
        this.timeline.isPlaying = false;
    }

    // إعادة تعيين الأنيميشن
    reset() {
        this.timeline.isPlaying = false;
        this.timeline.currentTime = 0;
        this.updatePlayhead();
        
        // إعادة العناصر لحالتها الأولية
        this.elements.forEach((elementData, elementId) => {
            this.applyStateToElement(elementId, elementData.initialState);
        });
        
        // إعادة تعيين الخصائص في الواجهة
        this.updatePropertyValues();
    }

    // إعادة تعيين المعاينة
    resetPreview() {
        this.reset();
        
        // إعادة تعيين جميع المنزلقات للقيم الافتراضية
        const inputs = document.querySelectorAll('#propertiesContent input[type="range"]');
        inputs.forEach(input => {
            switch(input.id) {
                case 'positionX':
                case 'positionY':
                case 'rotation':
                case 'delay':
                    input.value = 0;
                    break;
                case 'scale':
                case 'opacity':
                    input.value = 1;
                    break;
                case 'duration':
                    input.value = 0.3;
                    break;
            }
        });
        
        // تحديث النصوص
        this.updatePropertyValues();
        
        // إلغاء تحديد العناصر
        this.selectElement(null);
        
        // مسح جميع keyframes المخصصة
        this.timeline.tracks.forEach(track => {
            // الاحتفاظ بـ keyframe الأول فقط
            const firstKeyframe = track.keyframes[0];
            track.keyframes.forEach(kf => {
                if (kf !== firstKeyframe) {
                    kf.element.remove();
                }
            });
            track.keyframes = firstKeyframe ? [firstKeyframe] : [];
        });
        
        this.saveState();
    }

    // تبديل التشغيل
    togglePlayback() {
        if (this.timeline.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    // حلقة الأنيميشن
    animationLoop() {
        if (!this.timeline.isPlaying) return;
        
        const elapsed = (Date.now() - this.timeline.startTime) * this.playbackSpeed;
        this.timeline.currentTime = elapsed;
        
        if (this.timeline.currentTime >= this.timeline.duration) {
            if (this.isLooping) {
                this.timeline.currentTime = 0;
                this.timeline.startTime = Date.now();
            } else {
                this.timeline.isPlaying = false;
                this.timeline.currentTime = this.timeline.duration;
            }
        }
        
        this.updateAnimation();
        this.updatePlayhead();
        this.updateTimeDisplay();
        
        if (this.timeline.isPlaying) {
            requestAnimationFrame(() => this.animationLoop());
        }
    }

    // تحديث الأنيميشن
    updateAnimation() {
        this.elements.forEach((elementData, elementId) => {
            const track = this.timeline.tracks.find(t => t.id === elementId);
            if (!track || track.keyframes.length === 0) return;
            
            const state = this.interpolateState(track.keyframes, this.timeline.currentTime);
            this.applyStateToElement(elementId, state);
        });
    }

    // استيفاء الحالة بين keyframes
    interpolateState(keyframes, currentTime) {
        if (keyframes.length === 0) return {};
        if (keyframes.length === 1) return keyframes[0].state;
        
        // العثور على keyframes المحيطة
        let prevKeyframe = keyframes[0];
        let nextKeyframe = keyframes[keyframes.length - 1];
        
        for (let i = 0; i < keyframes.length - 1; i++) {
            if (currentTime >= keyframes[i].time && currentTime <= keyframes[i + 1].time) {
                prevKeyframe = keyframes[i];
                nextKeyframe = keyframes[i + 1];
                break;
            }
        }
        
        if (currentTime <= prevKeyframe.time) return prevKeyframe.state;
        if (currentTime >= nextKeyframe.time) return nextKeyframe.state;
        
        // حساب نسبة الاستيفاء
        const progress = (currentTime - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
        const easedProgress = this.applyEasing(progress, 'ease-out');
        
        // استيفاء كل خاصية
        const interpolatedState = {};
        Object.keys(prevKeyframe.state).forEach(key => {
            const startValue = prevKeyframe.state[key];
            const endValue = nextKeyframe.state[key];
            interpolatedState[key] = startValue + (endValue - startValue) * easedProgress;
        });
        
        return interpolatedState;
    }

    // تطبيق منحنى التسارع
    applyEasing(progress, easing) {
        switch (easing) {
            case 'linear':
                return progress;
            case 'ease-in':
                return progress * progress;
            case 'ease-out':
                return 1 - Math.pow(1 - progress, 2);
            case 'ease-in-out':
                return progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            case 'bounce':
                const n1 = 7.5625;
                const d1 = 2.75;
                if (progress < 1 / d1) {
                    return n1 * progress * progress;
                } else if (progress < 2 / d1) {
                    return n1 * (progress -= 1.5 / d1) * progress + 0.75;
                } else if (progress < 2.5 / d1) {
                    return n1 * (progress -= 2.25 / d1) * progress + 0.9375;
                } else {
                    return n1 * (progress -= 2.625 / d1) * progress + 0.984375;
                }
            default:
                return progress;
        }
    }

    // تحديث مؤشر التشغيل
    updatePlayhead() {
        const playhead = document.getElementById('playhead');
        const progress = this.timeline.currentTime / this.timeline.duration;
        playhead.style.left = (progress * 1000) + 'px'; // 1000px = timeline width
    }

    // تحديث عرض الوقت
    updateTimeDisplay() {
        const currentTimeSpan = document.getElementById('currentTime');
        const totalDurationSpan = document.getElementById('totalDuration');
        
        currentTimeSpan.textContent = (this.timeline.currentTime / 1000).toFixed(1) + 's';
        totalDurationSpan.textContent = (this.timeline.duration / 1000).toFixed(1) + 's';
    }

    // تعيين منحنى التسارع
    setEasing(button) {
        document.querySelectorAll('.easing-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        const easing = button.getAttribute('data-easing');
        this.drawEasingCurve(easing);
    }

    // تعيين منحنى مخصص
    setCustomEasing(value) {
        // تطبيق منحنى مخصص
        console.log('Custom easing:', value);
    }

    // رسم منحنى التسارع
    drawEasingCurve(easing) {
        const canvas = document.getElementById('easingCanvas');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // رسم الشبكة
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 4; i++) {
            const x = (i / 4) * canvas.width;
            const y = (i / 4) * canvas.height;
            
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // رسم المنحنى
        ctx.strokeStyle = '#6200EE';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i <= 100; i++) {
            const progress = i / 100;
            const easedProgress = this.applyEasing(progress, easing);
            
            const x = progress * canvas.width;
            const y = canvas.height - (easedProgress * canvas.height);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }

    // تحميل الإعدادات المسبقة
    loadPresets() {
        // حركات الدخول
        this.presets.set('fadeIn', {
            name: 'Fade In',
            keyframes: [
                { time: 0, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 0 } },
                { time: 300, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } }
            ]
        });
        
        this.presets.set('slideInUp', {
            name: 'Slide In Up',
            keyframes: [
                { time: 0, state: { x: 0, y: 30, scale: 1, rotation: 0, opacity: 0 } },
                { time: 300, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } }
            ]
        });
        
        this.presets.set('scaleIn', {
            name: 'Scale In',
            keyframes: [
                { time: 0, state: { x: 0, y: 0, scale: 0.8, rotation: 0, opacity: 0 } },
                { time: 300, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } }
            ]
        });
        
        this.presets.set('bounceIn', {
            name: 'Bounce In',
            keyframes: [
                { time: 0, state: { x: 0, y: -20, scale: 0.9, rotation: 0, opacity: 0 } },
                { time: 150, state: { x: 0, y: 5, scale: 1.05, rotation: 0, opacity: 0.8 } },
                { time: 300, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } }
            ]
        });
        
        // حركات الخروج
        this.presets.set('fadeOut', {
            name: 'Fade Out',
            keyframes: [
                { time: 0, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 300, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 0 } }
            ]
        });
        
        this.presets.set('slideOutDown', {
            name: 'Slide Out Down',
            keyframes: [
                { time: 0, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 300, state: { x: 0, y: 30, scale: 1, rotation: 0, opacity: 0 } }
            ]
        });
        
        this.presets.set('scaleOut', {
            name: 'Scale Out',
            keyframes: [
                { time: 0, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 300, state: { x: 0, y: 0, scale: 0.8, rotation: 0, opacity: 0 } }
            ]
        });
        
        this.presets.set('bounceOut', {
            name: 'Bounce Out',
            keyframes: [
                { time: 0, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 150, state: { x: 0, y: -5, scale: 1.05, rotation: 0, opacity: 0.8 } },
                { time: 300, state: { x: 0, y: 20, scale: 0.9, rotation: 0, opacity: 0 } }
            ]
        });
        
        // حركات خاصة
        this.presets.set('pulse', {
            name: 'Pulse',
            keyframes: [
                { time: 0, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 150, state: { x: 0, y: 0, scale: 1.1, rotation: 0, opacity: 1 } },
                { time: 300, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } }
            ]
        });
        
        this.presets.set('shake', {
            name: 'Shake',
            keyframes: [
                { time: 0, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 50, state: { x: -5, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 100, state: { x: 5, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 150, state: { x: -5, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 200, state: { x: 5, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 250, state: { x: -2, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 300, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } }
            ]
        });
        
        this.presets.set('flip', {
            name: 'Flip',
            keyframes: [
                { time: 0, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 150, state: { x: 0, y: 0, scale: 0.8, rotation: 90, opacity: 0.8 } },
                { time: 300, state: { x: 0, y: 0, scale: 1, rotation: 180, opacity: 1 } }
            ]
        });
        
        this.presets.set('rubber', {
            name: 'Rubber',
            keyframes: [
                { time: 0, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } },
                { time: 100, state: { x: 0, y: 0, scale: 1.25, rotation: 0, opacity: 1 } },
                { time: 150, state: { x: 0, y: 0, scale: 0.75, rotation: 0, opacity: 1 } },
                { time: 200, state: { x: 0, y: 0, scale: 1.15, rotation: 0, opacity: 1 } },
                { time: 250, state: { x: 0, y: 0, scale: 0.95, rotation: 0, opacity: 1 } },
                { time: 300, state: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } }
            ]
        });
    }

    // تطبيق إعداد مسبق
    applyPreset(presetId) {
        if (!this.selectedElement) {
            alert('يرجى تحديد عنصر أولاً');
            return;
        }
        
        const preset = this.presets.get(presetId);
        if (!preset) return;
        
        const track = this.timeline.tracks.find(t => t.id === this.selectedElement);
        if (!track) return;
        
        // إضافة تأثير بصري للتحديد
        const presetItems = document.querySelectorAll('.preset-item');
        presetItems.forEach(item => item.classList.remove('selected'));
        
        const selectedPresetItem = document.querySelector(`[onclick*="${presetId}"]`);
        if (selectedPresetItem) {
            selectedPresetItem.classList.add('selected');
        }
        
        // مسح keyframes الحالية
        track.keyframes.forEach(kf => kf.element.remove());
        track.keyframes = [];
        
        // إضافة keyframes الجديدة
        preset.keyframes.forEach(kf => {
            this.addKeyframe(this.selectedElement, kf.time, kf.state);
        });
        
        // تطبيق الحركة فوراً للمعاينة
        setTimeout(() => {
            this.play();
        }, 100);
        
        this.saveState();
    }

    // تشغيل جميع العناصر
    playAll() {
        this.reset();
        setTimeout(() => this.play(), 100);
    }

    // تصدير الحركة
    exportMotion() {
        const motionData = {
            duration: this.timeline.duration,
            elements: {}
        };
        
        this.timeline.tracks.forEach(track => {
            motionData.elements[track.id] = {
                keyframes: track.keyframes.map(kf => ({
                    time: kf.time,
                    state: kf.state
                }))
            };
        });
        
        // حفظ التغييرات في localStorage للعودة إلى studio.html
        this.saveChangesToStudio(motionData);
        
        // تنزيل كملف JSON
        const blob = new Blob([JSON.stringify(motionData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'motion-animation.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // حفظ التغييرات للعودة إلى studio.html
    saveChangesToStudio(motionData) {
        try {
            const currentState = JSON.parse(localStorage.getItem('studioState') || '{}');
            
            // تحديث بيانات الحركة
            currentState.motionData = motionData;
            currentState.lastModified = Date.now();
            
            // حفظ الحالة المحدثة
            localStorage.setItem('studioState', JSON.stringify(currentState));
            console.log('Saved changes to studio:', currentState);
            
            // إظهار رسالة نجاح
            this.showSuccessMessage('تم حفظ التغييرات! يمكنك العودة إلى الاستوديو الرئيسي.');
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    }

    // إظهار رسالة نجاح
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1500;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // حفظ الحالة للتراجع
    saveState() {
        const state = {
            elements: {},
            timeline: { ...this.timeline }
        };
        
        this.elements.forEach((elementData, elementId) => {
            state.elements[elementId] = {
                currentState: { ...elementData.currentState }
            };
        });
        
        // إضافة للتاريخ
        this.history.currentIndex++;
        this.history.states.splice(this.history.currentIndex);
        this.history.states.push(state);
        
        // الحد من عدد الحالات المحفوظة
        if (this.history.states.length > this.history.maxStates) {
            this.history.states.shift();
            this.history.currentIndex--;
        }
    }

    // تراجع
    undo() {
        if (this.history.currentIndex > 0) {
            this.history.currentIndex--;
            this.restoreState(this.history.states[this.history.currentIndex]);
        }
    }

    // إعادة
    redo() {
        if (this.history.currentIndex < this.history.states.length - 1) {
            this.history.currentIndex++;
            this.restoreState(this.history.states[this.history.currentIndex]);
        }
    }

    // استعادة الحالة
    restoreState(state) {
        Object.entries(state.elements).forEach(([elementId, elementData]) => {
            this.applyStateToElement(elementId, elementData.currentState);
        });
        
        this.updatePropertyValues();
    }

    // تبديل الشبكة
    toggleGrid() {
        this.showGrid = !this.showGrid;
        const gridOverlay = document.getElementById('gridOverlay');
        gridOverlay.classList.toggle('visible', this.showGrid);
    }

    // تبديل الأدلة
    toggleGuides() {
        this.showGuides = !this.showGuides;
        // تطبيق منطق الأدلة
    }

    // تعيين سرعة التشغيل
    setPlaybackSpeed(speed) {
        this.playbackSpeed = parseFloat(speed);
    }

    // تبديل التكرار
    toggleLoop(enabled) {
        this.isLooping = enabled;
    }

    // تكبير الخط الزمني
    zoomIn() {
        this.timeline.zoom = Math.min(this.timeline.zoom * 1.2, 5);
        this.updateTimeline();
    }

    // تصغير الخط الزمني
    zoomOut() {
        this.timeline.zoom = Math.max(this.timeline.zoom / 1.2, 0.2);
        this.updateTimeline();
    }

    // تحديث الخط الزمني
    updateTimeline() {
        const zoomLevel = document.getElementById('zoomLevel');
        zoomLevel.textContent = Math.round(this.timeline.zoom * 100) + '%';
        
        // تحديث مواضع keyframes
        this.timeline.tracks.forEach(track => {
            track.keyframes.forEach(kf => {
                kf.element.style.left = (kf.time * 500 * this.timeline.zoom) + 'px';
            });
        });
    }

    // إعادة تعيين المعاينة
    resetPreview() {
        this.reset();
    }

    // حفظ إعداد مسبق
    savePreset() {
        if (!this.selectedElement) {
            alert('يرجى تحديد عنصر أولاً');
            return;
        }
        
        const name = prompt('اسم الإعداد المسبق:');
        if (!name) return;
        
        const track = this.timeline.tracks.find(t => t.id === this.selectedElement);
        if (!track) return;
        
        const preset = {
            name: name,
            keyframes: track.keyframes.map(kf => ({
                time: kf.time,
                state: { ...kf.state }
            }))
        };
        
        this.presets.set(name.toLowerCase().replace(/\s+/g, '-'), preset);
        
        // إضافة للواجهة
        this.addPresetToUI(name.toLowerCase().replace(/\s+/g, '-'), preset);
    }

    // إضافة إعداد مسبق للواجهة
    addPresetToUI(presetId, preset) {
        const customCategory = document.querySelector('.preset-category:last-child .preset-grid');
        
        const presetItem = document.createElement('div');
        presetItem.className = 'preset-item';
        presetItem.onclick = () => this.applyPreset(presetId);
        
        presetItem.innerHTML = `
            <div class="preset-preview">⭐</div>
            <span>${preset.name}</span>
        `;
        
        customCategory.appendChild(presetItem);
    }
}

// تهيئة الاستوديو عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.motionStudio = new MotionStudio();
});
