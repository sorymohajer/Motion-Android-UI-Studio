// Motion Engine - محرك الحركات والأنيميشن
class MotionEngine {
    constructor() {
        this.currentAnimation = 'fade-slide';
        this.animationDuration = 300;
        this.animationEasing = 'ease-out';
        this.staggerDelay = 100;
    }

    // تطبيق الأنيميشن على العناصر
    applyAnimation(elements, animationType = null) {
        const animation = animationType || this.currentAnimation;
        
        if (!Array.isArray(elements)) {
            elements = [elements];
        }

        elements.forEach((element, index) => {
            if (!element) return;
            
            // إزالة الأنيميشن السابق
            element.style.animation = '';
            element.classList.remove('animated');
            
            // تطبيق الأنيميشن الجديد
            setTimeout(() => {
                this.applyAnimationStyle(element, animation, index);
            }, 50);
        });
    }

    applyAnimationStyle(element, animation, index = 0) {
        const delay = index * this.staggerDelay;
        
        switch(animation) {
            case 'fade-slide':
                this.fadeSlideAnimation(element, delay);
                break;
            case 'scale-reveal':
                this.scaleRevealAnimation(element, delay);
                break;
            case 'staggered':
                this.staggeredAnimation(element, delay);
                break;
            case 'bounce':
                this.bounceAnimation(element, delay);
                break;
        }
    }

    fadeSlideAnimation(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all ${this.animationDuration}ms ${this.animationEasing}`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add('animated');
        }, delay);
    }

    scaleRevealAnimation(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = `all ${this.animationDuration}ms ${this.animationEasing}`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
            element.classList.add('animated');
        }, delay);
    }

    staggeredAnimation(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
        element.style.transition = `all ${this.animationDuration}ms ${this.animationEasing}`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
            element.classList.add('animated');
        }, delay);
    }

    bounceAnimation(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px) scale(0.9)';
        element.style.transition = `all ${this.animationDuration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
            element.classList.add('animated');
        }, delay);
    }

    // أنيميشن الأزرار
    animateButton(button, type = 'press') {
        if (!button) return;
        
        switch(type) {
            case 'press':
                this.buttonPressAnimation(button);
                break;
            case 'ripple':
                this.buttonRippleAnimation(button);
                break;
            case 'glow':
                this.buttonGlowAnimation(button);
                break;
        }
    }

    buttonPressAnimation(button) {
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 150ms ease-out';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    buttonRippleAnimation(button) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    buttonGlowAnimation(button) {
        button.style.boxShadow = '0 0 20px rgba(98, 0, 238, 0.6)';
        button.style.transition = 'box-shadow 300ms ease-out';
        
        setTimeout(() => {
            button.style.boxShadow = '';
        }, 300);
    }

    // أنيميشن الصفحات
    pageTransition(fromPage, toPage, direction = 'forward') {
        if (!fromPage || !toPage) return;
        
        const duration = 400;
        
        if (direction === 'forward') {
            // الصفحة الحالية تخرج لليسار
            fromPage.style.transform = 'translateX(-100%)';
            fromPage.style.transition = `transform ${duration}ms ease-in-out`;
            
            // الصفحة الجديدة تدخل من اليمين
            toPage.style.transform = 'translateX(100%)';
            toPage.style.display = 'block';
            
            setTimeout(() => {
                toPage.style.transform = 'translateX(0)';
                toPage.style.transition = `transform ${duration}ms ease-in-out`;
            }, 50);
        } else {
            // الصفحة الحالية تخرج لليمين
            fromPage.style.transform = 'translateX(100%)';
            fromPage.style.transition = `transform ${duration}ms ease-in-out`;
            
            // الصفحة الجديدة تدخل من اليسار
            toPage.style.transform = 'translateX(-100%)';
            toPage.style.display = 'block';
            
            setTimeout(() => {
                toPage.style.transform = 'translateX(0)';
                toPage.style.transition = `transform ${duration}ms ease-in-out`;
            }, 50);
        }
        
        setTimeout(() => {
            fromPage.style.display = 'none';
            fromPage.style.transform = '';
            fromPage.style.transition = '';
            toPage.style.transition = '';
        }, duration + 100);
    }

    // أنيميشن Splash Screen
    splashAnimation(logoElement, backgroundElement) {
        if (!logoElement) return;
        
        // أنيميشن الخلفية
        if (backgroundElement) {
            backgroundElement.style.opacity = '0';
            backgroundElement.style.transition = 'opacity 800ms ease-in';
            
            setTimeout(() => {
                backgroundElement.style.opacity = '1';
            }, 100);
        }
        
        // أنيميشن اللوجو
        logoElement.style.opacity = '0';
        logoElement.style.transform = 'scale(0.5)';
        logoElement.style.transition = 'all 1000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        setTimeout(() => {
            logoElement.style.opacity = '1';
            logoElement.style.transform = 'scale(1)';
        }, 300);
        
        // تأثير النبض
        setTimeout(() => {
            logoElement.style.animation = 'pulse 2s infinite';
        }, 1300);
    }

    // تحديث نوع الأنيميشن
    updateAnimationType(type) {
        this.currentAnimation = type;
    }

    // الحصول على إعدادات الأنيميشن للتصدير
    getAnimationSettings() {
        return {
            type: this.currentAnimation,
            duration: this.animationDuration,
            easing: this.animationEasing,
            staggerDelay: this.staggerDelay
        };
    }

    // توليد كود Jetpack Compose للأنيميشن
    generateComposeAnimationCode() {
        const animations = {
            'fade-slide': `
// Fade + Slide Animation
val fadeSlideTransition = slideInVertically(
    initialOffsetY = { it / 3 },
    animationSpec = tween(durationMillis = ${this.animationDuration})
) + fadeIn(animationSpec = tween(durationMillis = ${this.animationDuration}))`,
            
            'scale-reveal': `
// Scale Reveal Animation
val scaleRevealTransition = scaleIn(
    initialScale = 0.8f,
    animationSpec = tween(durationMillis = ${this.animationDuration})
) + fadeIn(animationSpec = tween(durationMillis = ${this.animationDuration}))`,
            
            'staggered': `
// Staggered Animation
val staggeredTransition = slideInHorizontally(
    initialOffsetX = { -it / 4 },
    animationSpec = tween(durationMillis = ${this.animationDuration}, delayMillis = ${this.staggerDelay})
) + fadeIn(animationSpec = tween(durationMillis = ${this.animationDuration}, delayMillis = ${this.staggerDelay}))`,
            
            'bounce': `
// Bounce Animation
val bounceTransition = slideInVertically(
    initialOffsetY = { -it / 4 },
    animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy)
) + scaleIn(
    initialScale = 0.9f,
    animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy)
)`
        };
        
        return animations[this.currentAnimation] || animations['fade-slide'];
    }
}

// إضافة CSS للأنيميشن
const animationCSS = `
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 600ms linear;
    pointer-events: none;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.animated {
    animation-fill-mode: both;
}
`;

// إضافة CSS للصفحة
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// إنشاء مثيل عام
window.motionEngine = new MotionEngine();