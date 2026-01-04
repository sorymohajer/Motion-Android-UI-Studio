// Component Marketplace JavaScript
class ComponentMarketplace {
    constructor() {
        this.items = [];
        this.filteredItems = [];
        this.currentCategory = 'all';
        this.currentView = 'grid';
        this.currentSort = 'popular';
        this.selectedItem = null;
        
        this.filters = {
            category: 'all',
            appTypes: [],
            ratings: [],
            search: ''
        };
        
        this.loadItems();
        this.initializeUI();
    }

    // تحميل العناصر
    async loadItems() {
        try {
            // تحميل القوالب
            const templatesResponse = await fetch('../presets/templates.json');
            const templates = await templatesResponse.json();
            
            // تحويل القوالب إلى عناصر
            Object.entries(templates).forEach(([key, template]) => {
                this.items.push({
                    id: key,
                    type: 'template',
                    title: template.name,
                    description: template.description,
                    category: template.category,
                    preview: this.getTemplatePreview(template),
                    rating: this.generateRating(),
                    downloads: this.generateDownloads(),
                    features: template.features || [],
                    screens: template.screens || [],
                    colors: template.colors || {},
                    data: template,
                    isFeatured: Math.random() > 0.7
                });
            });
            
            // إضافة مكونات إضافية
            this.addAdditionalComponents();
            
            // تطبيق الفلاتر الأولية
            this.applyFilters();
            this.renderItems();
            this.updateCounts();
            
        } catch (error) {
            console.error('Error loading items:', error);
            this.showError('فشل في تحميل العناصر');
        }
    }

    // إضافة مكونات إضافية
    addAdditionalComponents() {
        const additionalComponents = [
            {
                id: 'modern-button',
                type: 'component',
                title: 'Modern Button',
                description: 'زر حديث مع تأثيرات متقدمة',
                category: 'ui-components',
                preview: '🔘',
                rating: 4.8,
                downloads: 1250,
                features: ['Ripple Effect', 'Multiple Styles', 'Accessibility'],
                isFeatured: true
            },
            {
                id: 'animated-card',
                type: 'component',
                title: 'Animated Card',
                description: 'بطاقة متحركة مع تأثيرات جميلة',
                category: 'ui-components',
                preview: '🃏',
                rating: 4.6,
                downloads: 890,
                features: ['Hover Effects', 'Customizable', 'Responsive'],
                isFeatured: false
            },
            {
                id: 'loading-spinner',
                type: 'component',
                title: 'Loading Spinner',
                description: 'مؤشر تحميل أنيق ومتحرك',
                category: 'ui-components',
                preview: '⏳',
                rating: 4.9,
                downloads: 2100,
                features: ['Multiple Styles', 'Customizable Colors', 'Smooth Animation'],
                isFeatured: true
            },
            {
                id: 'gradient-background',
                type: 'component',
                title: 'Gradient Background',
                description: 'خلفيات متدرجة احترافية',
                category: 'backgrounds',
                preview: '🌈',
                rating: 4.7,
                downloads: 1560,
                features: ['Multiple Gradients', 'Animated', 'Easy to Use'],
                isFeatured: false
            },
            {
                id: 'splash-animation',
                type: 'animation',
                title: 'Splash Animation Pack',
                description: 'مجموعة حركات لشاشة البداية',
                category: 'animations',
                preview: '✨',
                rating: 4.9,
                downloads: 3200,
                features: ['10 Animations', 'Customizable', 'High Performance'],
                isFeatured: true
            },
            {
                id: 'page-transitions',
                type: 'animation',
                title: 'Page Transitions',
                description: 'انتقالات سلسة بين الصفحات',
                category: 'animations',
                preview: '🔄',
                rating: 4.5,
                downloads: 980,
                features: ['Smooth Transitions', 'Multiple Effects', 'Easy Integration'],
                isFeatured: false
            }
        ];
        
        this.items.push(...additionalComponents);
    }

    // الحصول على معاينة القالب
    getTemplatePreview(template) {
        const icons = {
            'ecommerce': '🛍️',
            'social': '💬',
            'productivity': '✅',
            'finance': '💰',
            'health': '❤️',
            'education': '📚',
            'gaming': '🎮',
            'music': '🎵',
            'travel': '✈️',
            'news': '📰'
        };
        
        return icons[template.category] || '📱';
    }

    // توليد تقييم عشوائي
    generateRating() {
        return Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 - 5.0
    }

    // توليد عدد تحميلات عشوائي
    generateDownloads() {
        return Math.floor(Math.random() * 5000) + 100;
    }

    // تهيئة واجهة المستخدم
    initializeUI() {
        this.updateResultsCount();
        this.renderFeaturedItems();
        this.renderTemplates();
        this.renderComponents();
    }

    // تطبيق الفلاتر
    applyFilters() {
        this.filteredItems = this.items.filter(item => {
            // فلتر الفئة
            if (this.filters.category !== 'all') {
                if (this.filters.category === 'templates' && item.type !== 'template') return false;
                if (this.filters.category === 'screens' && item.type !== 'screen') return false;
                if (this.filters.category === 'components' && item.type !== 'component') return false;
                if (this.filters.category === 'animations' && item.type !== 'animation') return false;
            }
            
            // فلتر نوع التطبيق
            if (this.filters.appTypes.length > 0) {
                if (!this.filters.appTypes.includes(item.category)) return false;
            }
            
            // فلتر التقييم
            if (this.filters.ratings.length > 0) {
                const minRating = Math.min(...this.filters.ratings);
                if (item.rating < minRating) return false;
            }
            
            // فلتر البحث
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                if (!item.title.toLowerCase().includes(searchTerm) && 
                    !item.description.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        // ترتيب النتائج
        this.sortItems();
    }

    // ترتيب العناصر
    sortItems() {
        this.filteredItems.sort((a, b) => {
            switch (this.currentSort) {
                case 'popular':
                    return b.downloads - a.downloads;
                case 'newest':
                    return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
                case 'rating':
                    return b.rating - a.rating;
                case 'downloads':
                    return b.downloads - a.downloads;
                case 'name':
                    return a.title.localeCompare(b.title, 'ar');
                default:
                    return 0;
            }
        });
    }

    // رسم العناصر
    renderItems() {
        const itemsGrid = document.getElementById('itemsGrid');
        if (!itemsGrid) return;
        
        if (this.filteredItems.length === 0) {
            itemsGrid.innerHTML = this.getEmptyState();
            return;
        }
        
        itemsGrid.className = `items-grid ${this.currentView}-view`;
        itemsGrid.innerHTML = this.filteredItems.map(item => this.createItemHTML(item)).join('');
        
        // إضافة مستمعي الأحداث
        this.attachItemEventListeners();
    }

    // رسم العناصر المميزة
    renderFeaturedItems() {
        const featuredGrid = document.getElementById('featuredGrid');
        if (!featuredGrid) return;
        
        const featuredItems = this.items.filter(item => item.isFeatured).slice(0, 3);
        featuredGrid.innerHTML = featuredItems.map(item => this.createFeaturedItemHTML(item)).join('');
        
        // إضافة مستمعي الأحداث
        featuredGrid.querySelectorAll('.featured-item').forEach((element, index) => {
            element.addEventListener('click', () => this.showItemDetails(featuredItems[index]));
        });
    }

    // رسم القوالب
    renderTemplates() {
        const templatesGrid = document.getElementById('templatesGrid');
        if (!templatesGrid) return;
        
        const templates = this.items.filter(item => item.type === 'template').slice(0, 6);
        templatesGrid.innerHTML = templates.map(item => this.createTemplateItemHTML(item)).join('');
        
        // إضافة مستمعي الأحداث
        templatesGrid.querySelectorAll('.template-item').forEach((element, index) => {
            element.addEventListener('click', () => this.showItemDetails(templates[index]));
        });
    }

    // رسم المكونات
    renderComponents() {
        const componentsGrid = document.getElementById('componentsGrid');
        if (!componentsGrid) return;
        
        const components = this.items.filter(item => item.type === 'component').slice(0, 8);
        componentsGrid.innerHTML = components.map(item => this.createComponentItemHTML(item)).join('');
        
        // إضافة مستمعي الأحداث
        componentsGrid.querySelectorAll('.component-item').forEach((element, index) => {
            element.addEventListener('click', () => this.showItemDetails(components[index]));
        });
    }

    // إنشاء HTML للعنصر
    createItemHTML(item) {
        return `
            <div class="marketplace-item" data-id="${item.id}">
                <div class="item-preview">
                    ${item.preview}
                </div>
                <div class="item-info">
                    <div class="item-title">${item.title}</div>
                    <div class="item-description">${item.description}</div>
                    ${item.features ? `
                        <div class="item-tags">
                            ${item.features.slice(0, 3).map(feature => `<span class="item-tag">${feature}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="item-meta">
                        <div class="item-rating">
                            <span class="stars">${this.getStarsHTML(item.rating)}</span>
                            <span class="rating-count">(${Math.floor(item.rating * 100)})</span>
                        </div>
                        <div class="item-downloads">${this.formatNumber(item.downloads)} تحميل</div>
                    </div>
                </div>
            </div>
        `;
    }

    // إنشاء HTML للعنصر المميز
    createFeaturedItemHTML(item) {
        return `
            <div class="featured-item" data-id="${item.id}">
                <div class="item-preview">
                    <div style="font-size: 64px;">${item.preview}</div>
                </div>
                <div class="item-info">
                    <div class="item-title">${item.title}</div>
                    <div class="item-description">${item.description}</div>
                    <div class="item-meta">
                        <div class="item-rating">
                            <span class="stars">${this.getStarsHTML(item.rating)}</span>
                        </div>
                        <div class="item-downloads">${this.formatNumber(item.downloads)} تحميل</div>
                    </div>
                </div>
            </div>
        `;
    }

    // إنشاء HTML لعنصر القالب
    createTemplateItemHTML(item) {
        return `
            <div class="template-item" data-id="${item.id}">
                <div class="item-preview">
                    ${item.preview}
                </div>
                <div class="item-info">
                    <div class="item-title">${item.title}</div>
                    <div class="item-description">${item.description}</div>
                    ${item.features ? `
                        <div class="item-tags">
                            ${item.features.slice(0, 3).map(feature => `<span class="item-tag">${feature}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="item-meta">
                        <div class="item-rating">
                            <span class="stars">${this.getStarsHTML(item.rating)}</span>
                        </div>
                        <div class="item-downloads">${this.formatNumber(item.downloads)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // إنشاء HTML لعنصر المكون
    createComponentItemHTML(item) {
        return `
            <div class="component-item" data-id="${item.id}">
                <div class="item-preview">
                    ${item.preview}
                </div>
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description}</div>
            </div>
        `;
    }

    // الحصول على HTML للنجوم
    getStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '⭐';
        }
        
        if (hasHalfStar) {
            starsHTML += '⭐';
        }
        
        return starsHTML;
    }

    // تنسيق الأرقام
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // الحصول على حالة فارغة
    getEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-title">لم يتم العثور على نتائج</div>
                <div class="empty-state-description">جرب تغيير معايير البحث أو الفلاتر</div>
            </div>
        `;
    }

    // إضافة مستمعي الأحداث للعناصر
    attachItemEventListeners() {
        document.querySelectorAll('.marketplace-item').forEach(element => {
            element.addEventListener('click', () => {
                const itemId = element.getAttribute('data-id');
                const item = this.items.find(i => i.id === itemId);
                if (item) {
                    this.showItemDetails(item);
                }
            });
        });
    }

    // عرض تفاصيل العنصر
    showItemDetails(item) {
        this.selectedItem = item;
        
        // تحديث محتوى النافذة المنبثقة
        document.getElementById('modalTitle').textContent = item.title;
        document.getElementById('modalRating').textContent = this.getStarsHTML(item.rating);
        document.getElementById('modalRatingCount').textContent = `(${Math.floor(item.rating * 100)})`;
        document.getElementById('modalDownloads').textContent = `${this.formatNumber(item.downloads)} تحميل`;
        document.getElementById('modalCategory').textContent = this.getCategoryName(item.category);
        document.getElementById('modalDescription').textContent = item.description;
        
        // تحديث المعاينة
        const modalPreview = document.getElementById('modalPreview');
        modalPreview.innerHTML = `<div style="font-size: 64px;">${item.preview}</div>`;
        
        // تحديث الميزات
        const modalFeatures = document.getElementById('modalFeatures');
        if (item.features && item.features.length > 0) {
            modalFeatures.innerHTML = `
                <h4>الميزات:</h4>
                <ul>
                    ${item.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            `;
        } else {
            modalFeatures.innerHTML = '';
        }
        
        // تحديث المواصفات التقنية
        const modalTechSpecs = document.getElementById('modalTechSpecs');
        const techSpecs = this.getTechSpecs(item);
        if (techSpecs.length > 0) {
            modalTechSpecs.innerHTML = `
                <h4>المواصفات التقنية:</h4>
                <ul>
                    ${techSpecs.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
            `;
        } else {
            modalTechSpecs.innerHTML = '';
        }
        
        // عرض النافذة المنبثقة
        document.getElementById('itemModal').classList.add('show');
    }

    // الحصول على اسم الفئة
    getCategoryName(category) {
        const categoryNames = {
            'ecommerce': 'تجارة إلكترونية',
            'social': 'تواصل اجتماعي',
            'productivity': 'إنتاجية',
            'finance': 'مالية',
            'health': 'صحة',
            'education': 'تعليم',
            'gaming': 'ألعاب',
            'music': 'موسيقى',
            'travel': 'سفر',
            'news': 'أخبار',
            'ui-components': 'مكونات واجهة',
            'backgrounds': 'خلفيات',
            'animations': 'حركات'
        };
        
        return categoryNames[category] || category;
    }

    // الحصول على المواصفات التقنية
    getTechSpecs(item) {
        const specs = [];
        
        if (item.type === 'template') {
            specs.push(`عدد الشاشات: ${item.screens?.length || 0}`);
            specs.push('متوافق مع: Jetpack Compose');
            specs.push('الحد الأدنى: Android API 21');
        } else if (item.type === 'component') {
            specs.push('متوافق مع: Jetpack Compose');
            specs.push('قابل للتخصيص: نعم');
            specs.push('يدعم الثيمات: نعم');
        } else if (item.type === 'animation') {
            specs.push('مدة الحركة: قابلة للتخصيص');
            specs.push('نوع الحركة: CSS/Compose');
            specs.push('الأداء: محسن');
        }
        
        return specs;
    }

    // إغلاق النافذة المنبثقة
    closeItemModal() {
        document.getElementById('itemModal').classList.remove('show');
        this.selectedItem = null;
    }

    // معاينة العنصر
    previewItem() {
        if (!this.selectedItem) return;
        
        // فتح معاينة في نافذة جديدة أو تبديل للاستوديو
        if (this.selectedItem.type === 'template') {
            this.applyTemplate(this.selectedItem);
        } else {
            alert('معاينة ' + this.selectedItem.title);
        }
    }

    // استخدام العنصر
    useItem() {
        if (!this.selectedItem) return;
        
        if (this.selectedItem.type === 'template') {
            this.applyTemplate(this.selectedItem);
        } else {
            alert('تم إضافة ' + this.selectedItem.title + ' إلى مشروعك');
        }
        
        this.closeItemModal();
    }

    // تحميل العنصر
    downloadItem() {
        if (!this.selectedItem) return;
        
        // محاكاة التحميل
        const item = this.selectedItem;
        
        if (item.type === 'template') {
            this.downloadTemplate(item);
        } else {
            this.downloadComponent(item);
        }
        
        // تحديث عدد التحميلات
        item.downloads++;
        this.closeItemModal();
    }

    // تطبيق القالب
    applyTemplate(template) {
        // حفظ بيانات القالب في localStorage
        localStorage.setItem('selectedTemplate', JSON.stringify(template));
        
        // الانتقال للاستوديو
        window.location.href = '../studio.html?template=' + template.id;
    }

    // تحميل القالب
    downloadTemplate(template) {
        const templateData = {
            ...template.data,
            metadata: {
                name: template.title,
                description: template.description,
                version: '1.0.0',
                author: 'Motion Android UI Studio',
                createdAt: new Date().toISOString()
            }
        };
        
        const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.id}-template.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // تحميل المكون
    downloadComponent(component) {
        // محاكاة تحميل المكون
        alert(`تم تحميل ${component.title} بنجاح!`);
    }

    // تحديث عدد النتائج
    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${this.filteredItems.length} عنصر`;
        }
    }

    // تحديث عدادات الفئات
    updateCounts() {
        const counts = {
            all: this.items.length,
            templates: this.items.filter(item => item.type === 'template').length,
            screens: this.items.filter(item => item.type === 'screen').length,
            components: this.items.filter(item => item.type === 'component').length,
            animations: this.items.filter(item => item.type === 'animation').length
        };
        
        Object.entries(counts).forEach(([category, count]) => {
            const countElement = document.getElementById(`count${category.charAt(0).toUpperCase() + category.slice(1)}`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }

    // عرض خطأ
    showError(message) {
        const itemsGrid = document.getElementById('itemsGrid');
        if (itemsGrid) {
            itemsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <div class="empty-state-title">حدث خطأ</div>
                    <div class="empty-state-description">${message}</div>
                </div>
            `;
        }
    }
}

// دوال عامة للاستخدام في HTML
function filterByCategory(category) {
    if (!window.marketplace) return;
    
    // تحديث الأزرار
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // تطبيق الفلتر
    window.marketplace.filters.category = category;
    window.marketplace.applyFilters();
    window.marketplace.renderItems();
    window.marketplace.updateResultsCount();
}

function filterByAppType() {
    if (!window.marketplace) return;
    
    const checkboxes = document.querySelectorAll('.app-type-list input[type="checkbox"]:checked');
    window.marketplace.filters.appTypes = Array.from(checkboxes).map(cb => cb.value);
    
    window.marketplace.applyFilters();
    window.marketplace.renderItems();
    window.marketplace.updateResultsCount();
}

function filterByRating() {
    if (!window.marketplace) return;
    
    const checkboxes = document.querySelectorAll('.rating-filter input[type="checkbox"]:checked');
    window.marketplace.filters.ratings = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    window.marketplace.applyFilters();
    window.marketplace.renderItems();
    window.marketplace.updateResultsCount();
}

function sortComponents() {
    if (!window.marketplace) return;
    
    const sortBy = document.getElementById('sortBy').value;
    window.marketplace.currentSort = sortBy;
    
    window.marketplace.applyFilters();
    window.marketplace.renderItems();
}

function toggleView(view) {
    if (!window.marketplace) return;
    
    // تحديث الأزرار
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    // تطبيق العرض
    window.marketplace.currentView = view;
    window.marketplace.renderItems();
}

function searchComponents() {
    if (!window.marketplace) return;
    
    const searchInput = document.getElementById('searchInput');
    window.marketplace.filters.search = searchInput.value;
    
    window.marketplace.applyFilters();
    window.marketplace.renderItems();
    window.marketplace.updateResultsCount();
}

function closeItemModal() {
    if (window.marketplace) {
        window.marketplace.closeItemModal();
    }
}

function previewItem() {
    if (window.marketplace) {
        window.marketplace.previewItem();
    }
}

function useItem() {
    if (window.marketplace) {
        window.marketplace.useItem();
    }
}

function downloadItem() {
    if (window.marketplace) {
        window.marketplace.downloadItem();
    }
}

// تهيئة السوق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.marketplace = new ComponentMarketplace();
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    document.getElementById('itemModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeItemModal();
        }
    });
});