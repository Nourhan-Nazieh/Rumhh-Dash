// ==========Section Order - المنتجات
  const picker = new Litepicker({
    element: document.getElementById('calendarPicker'),
    singleMode: false,
    lang: 'ar',
    format: 'DD-MM-YYYY',
    tooltipText: {
      one: 'يوم',
      other: 'أيام'
    },
    dropdowns: {
      minYear: 2020,
      maxYear: 2030,
      months: true,
      years: true
    }
  });


  // Product category
  document.addEventListener('DOMContentLoaded', function() {
    // Find the uploader elements on the page
    const imageUploader = document.getElementById('imageUploader');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const uploaderContent = imageUploader ? imageUploader.querySelector('.uploader-content') : null;

    // Check if all elements exist before adding event listeners
    if (imageUploader && fileInput && imagePreview && uploaderContent) {
        
        // Trigger file input click when the container is clicked
        imageUploader.addEventListener('click', () => {
            fileInput.click();
        });

        // Handle file selection
        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Set the src of the preview image
                    imagePreview.src = e.target.result;
                    // Show the preview image
                    imagePreview.style.display = 'block';
                    // Hide the placeholder content (icon and text)
                    uploaderContent.style.display = 'none';
                }
                
                // Read the file as a data URL
                reader.readAsDataURL(file);
            }
        });
    }
});
// ADD Product
/* ===== JavaScript for Categories Management Dashboard ===== */

// ===== Document Ready Function =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Categories Management Dashboard Loaded Successfully');
    
    // تهيئة جميع الوظائف
    initializeEventListeners();
    initializeImageUpload();
    initializeTooltips();
    initializeCategoryInteractions();
    initializeResponsiveFeatures();
});

// ===== Event Listeners Initialization =====
function initializeEventListeners() {
    // زر إضافة فئة جديدة
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', handleAddCategory);
    }
    
    // أزرار البحث والتصفية
    const searchBtn = document.querySelector('.btn-outline-primary');
    const filterBtn = document.querySelector('.btn-outline-secondary');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    if (filterBtn) {
        filterBtn.addEventListener('click', handleFilter);
    }
    
    // شريط البحث العلوي
    const searchInput = document.querySelector('.form-control[placeholder="البحث..."]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // أزرار تعديل وحذف الفئات
    const editButtons = document.querySelectorAll('.category-actions .btn-outline-primary');
    const deleteButtons = document.querySelectorAll('.category-actions .btn-outline-danger');
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', handleEditCategory);
    });
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', handleDeleteCategory);
    });
    
    // روابط التصفح (Pagination)
    const paginationLinks = document.querySelectorAll('.page-link');
    paginationLinks.forEach(link => {
        link.addEventListener('click', handlePagination);
    });
    
    // روابط القائمة الجانبية
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', handleSidebarNavigation);
    });
}

// ===== Image Upload Functions =====

/**
 * تهيئة وظائف رفع الصورة
 */
function initializeImageUpload() {
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('categoryImage');
    const previewImage = document.getElementById('previewImage');
    
    if (!imageUploadArea || !imageInput || !previewImage) return;
    
    // النقر على منطقة الرفع
    imageUploadArea.addEventListener('click', function() {
        imageInput.click();
    });
    
    // تغيير الملف
    imageInput.addEventListener('change', function(e) {
        handleImageSelect(e.target.files[0]);
    });
    
    // السحب والإفلات
    imageUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        imageUploadArea.classList.add('drag-over');
    });
    
    imageUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        imageUploadArea.classList.remove('drag-over');
    });
    
    imageUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        imageUploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageSelect(files[0]);
        }
    });
}

/**
 * معالجة اختيار الصورة
 */
function handleImageSelect(file) {
    if (!file) return;
    
    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
        showNotification('يرجى اختيار ملف صورة صالح', 'warning');
        return;
    }
    
    // التحقق من حجم الملف (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت', 'warning');
        return;
    }
    
    // قراءة الملف وعرض المعاينة
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUploadArea = document.getElementById('imageUploadArea');
        const previewImage = document.getElementById('previewImage');
        const uploadPlaceholder = document.querySelector('.upload-placeholder');
        
        previewImage.src = e.target.result;
        previewImage.classList.remove('d-none');
        uploadPlaceholder.style.display = 'none';
        imageUploadArea.classList.add('has-image');
        
        showNotification('تم رفع الصورة بنجاح', 'success');
    };
    
    reader.readAsDataURL(file);
}

/**
 * إزالة الصورة المحددة
 */
function removeSelectedImage() {
    const imageUploadArea = document.getElementById('imageUploadArea');
    const previewImage = document.getElementById('previewImage');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const imageInput = document.getElementById('categoryImage');
    
    previewImage.src = '';
    previewImage.classList.add('d-none');
    uploadPlaceholder.style.display = 'flex';
    imageUploadArea.classList.remove('has-image');
    imageInput.value = '';
}

// ==============================imges-Uploded======================
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. تفعيل رفع الصور ---
    const mainImageUploader = document.querySelector('.main-image-uploader');
    const thumbUploader = document.querySelectorAll('.thumb-uploader');

    // إنشاء input وهمي لاختيار الملفات
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    // عند الضغط على مربع الصورة الرئيسي
    mainImageUploader.addEventListener('click', () => fileInput.click());
    
    // عند الضغط على مربعات الصور المصغرة
    thumbUploader.forEach(thumb => {
        thumb.addEventListener('click', () => fileInput.click());
    });

    // عند اختيار صورة
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // سنضع الصورة المختارة في أول مربع فارغ نجده
                const targetUploader = document.querySelector('.main-image-uploader:not(.has-image)') || document.querySelector('.thumb-uploader:not(.has-image)');
                if (targetUploader) {
                    targetUploader.innerHTML = `<img src="${e.target.result}" alt="preview">`;
                    targetUploader.classList.add('has-image');
                    targetUploader.style.padding = '0'; // لإزالة الحشو الداخلي بعد وضع الصورة
                } else {
                    alert("لقد قمت بملء جميع أماكن الصور.");
                }
            };
            reader.readAsDataURL(file);
        }
    });


    // --- 2. إضافة الخيارات و Tags ---
    const addOptionBtn = document.querySelector('.input-with-button .btn-gray');
    const optionInput = document.querySelector('.input-with-button input[placeholder*="المقاس"]');
    const tagsContainer = document.querySelector('.tags');

    addOptionBtn.addEventListener('click', () => {
        const optionText = optionInput.value.trim();
        if (optionText) {
            addTag(optionText);
            optionInput.value = ''; // تفريغ الحقل بعد الإضافة
        }
    });
    
    // دالة لإضافة Tag جديد
    function addTag(text) {
        const tag = document.createElement('span');
        tag.classList.add('tag');
        tag.innerHTML = `${text} <i class="fas fa-times"></i>`;
        tagsContainer.appendChild(tag);
    }

    // --- 3. حذف الـ Tags ---
    tagsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('fa-times')) {
            event.target.parentElement.remove();
        }
    });
    
    // إضافة Tags افتراضية كما في التصميم
    addTag('اللون');
    addTag('احمر');
    addTag('اسود');


    // --- 4. تفعيل لوحة الألوان (Color Palette) ---
    const colorSelectBtn = document.querySelector('.btn-green-light');
    
    // إنشاء لوحة الألوان
    const colorPalette = document.createElement('div');
    colorPalette.classList.add('color-palette');
    const colors = ['#FF0000', '#0000FF', '#008000', '#FFFF00', '#FFA500', '#800080', '#000000', '#FFFFFF'];
    colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        colorBox.style.backgroundColor = color;
        colorBox.dataset.color = color;
        colorPalette.appendChild(colorBox);
    });
    
    // إخفاء اللوحة بشكل افتراضي
    colorPalette.style.display = 'none';
    document.getElementById('form-sidebar').appendChild(colorPalette);

    // إظهار/إخفاء اللوحة عند الضغط
    colorSelectBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // لمنع إغلاقها فورًا
        const isVisible = colorPalette.style.display === 'block';
        colorPalette.style.display = isVisible ? 'none' : 'block';
    });

    // اختيار لون من اللوحة
    colorPalette.addEventListener('click', function(event) {
        if (event.target.classList.contains('color-box')) {
            const selectedColor = event.target.dataset.color;
            const colorName = getColorName(selectedColor); // دالة بسيطة لترجمة الكود للون
            addTag(colorName);
            colorPalette.style.display = 'none'; // إخفاء اللوحة بعد الاختيار
        }
    });

    // إخفاء اللوحة عند الضغط في أي مكان آخر
    document.addEventListener('click', () => {
        colorPalette.style.display = 'none';
    });

    // دالة بسيطة لتحويل كود اللون إلى اسم (يمكن توسيعها)
    function getColorName(hex) {
        const colorMap = {
            '#FF0000': 'أحمر', '#0000FF': 'أزرق', '#008000': 'أخضر',
            '#FFFF00': 'أصفر', '#FFA500': 'برتقالي', '#800080': 'بنفسجي',
            '#000000': 'أسود', '#FFFFFF': 'أبيض'
        };
        return colorMap[hex.toUpperCase()] || hex;
    }
});

// ===== Category Management Functions =====

/**
 * وظيفة إضافة فئة جديدة
 */
function handleAddCategory(event) {
    event.preventDefault();
    
    // الحصول على البيانات من النموذج
    const categoryName = document.getElementById('categoryName').value.trim();
    const categoryDescription = document.getElementById('categoryDescription').value.trim();
    const categoryClassification = document.getElementById('categoryClassification').value;
    const imageInput = document.getElementById('categoryImage');
    
    // التحقق من صحة البيانات
    if (!categoryName) {
        showNotification('يرجى إدخال اسم الفئة', 'warning');
        document.getElementById('categoryName').focus();
        return;
    }
    
    if (!categoryClassification) {
        showNotification('يرجى اختيار تصنيف الفئة', 'warning');
        document.getElementById('categoryClassification').focus();
        return;
    }
    
    // إضافة تأثير التحميل
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> جاري الإضافة...';
    button.disabled = true;
    
    // محاكاة عملية الإضافة
    setTimeout(() => {
        // إنشاء فئة جديدة
        const newCategory = {
            name: categoryName,
            description: categoryDescription || 'بدون وصف',
            classification: categoryClassification,
            image: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : 'https://via.placeholder.com/80x80/e9ecef/6c757d?text=' + encodeURIComponent(categoryName.charAt(0))
        };
        
        // إضافة الفئة للشبكة
        addCategoryToGrid(newCategory);
        
        // مسح النموذج
        clearCategoryForm();
        
        // استعادة النص الأصلي
        button.innerHTML = originalText;
        button.disabled = false;
        
        // عرض رسالة نجاح
        showNotification(`تم إضافة الفئة "${categoryName}" بنجاح!`, 'success');
    }, 2000);
    
    console.log('Add Category:', { categoryName, categoryDescription, categoryClassification });
}

/**
 * إضافة فئة جديدة للشبكة
 */
function addCategoryToGrid(category) {
    const categoriesGrid = document.getElementById('categoriesGrid');
    
    const categoryHTML = `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="category-item">
                <div class="category-image">
                    <img src="${category.image}" alt="${category.name}" class="img-fluid">
                </div>
                <div class="category-info">
                    <h6 class="category-name">${category.name}</h6>
                    <p class="category-description">${category.description}</p>
                    <div class="category-stats">
                        <span class="badge bg-primary">3×1</span>
                        <span class="text-muted small">${getClassificationText(category.classification)}</span>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="btn btn-sm btn-outline-primary" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    categoriesGrid.insertAdjacentHTML('afterbegin', categoryHTML);
    
    // إضافة مستمعي الأحداث للأزرار الجديدة
    const newCategoryItem = categoriesGrid.firstElementChild;
    const editBtn = newCategoryItem.querySelector('.btn-outline-primary');
    const deleteBtn = newCategoryItem.querySelector('.btn-outline-danger');
    
    editBtn.addEventListener('click', handleEditCategory);
    deleteBtn.addEventListener('click', handleDeleteCategory);
}

/**
 * مسح نموذج إضافة الفئة
 */
function clearCategoryForm() {
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryDescription').value = '';
    document.getElementById('categoryClassification').value = '';
    removeSelectedImage();
}

/**
 * الحصول على نص التصنيف
 */
function getClassificationText(classification) {
    const classifications = {
        'main': 'رئيسي',
        'sub': 'فرعي',
        'special': 'خاص'
    };
    return classifications[classification] || 'فرعي';
}

/**
 * وظيفة تعديل الفئة
 */
function handleEditCategory(event) {
    event.preventDefault();
    
    const categoryItem = event.target.closest('.category-item');
    const categoryName = categoryItem.querySelector('.category-name').textContent;
    
    // إضافة تأثير التحديد
    categoryItem.style.backgroundColor = '#e8f5e8';
    categoryItem.style.transform = 'scale(1.02)';
    
    setTimeout(() => {
        categoryItem.style.backgroundColor = '';
        categoryItem.style.transform = '';
        showNotification(`تم فتح صفحة تعديل الفئة: ${categoryName}`, 'info');
    }, 1000);
    
    console.log('Edit category:', categoryName);
}

/**
 * وظيفة حذف الفئة
 */
function handleDeleteCategory(event) {
    event.preventDefault();
    
    const categoryItem = event.target.closest('.category-item');
    const categoryName = categoryItem.querySelector('.category-name').textContent;
    
    // تأكيد الحذف
    if (!confirm(`هل أنت متأكد من حذف الفئة "${categoryName}"؟`)) {
        return;
    }
    
    // إضافة تأثير الحذف
    categoryItem.style.transition = 'all 0.5s ease';
    categoryItem.style.opacity = '0.5';
    categoryItem.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        categoryItem.closest('.col-md-6').remove();
        showNotification(`تم حذف الفئة: ${categoryName}`, 'success');
    }, 500);
    
    console.log('Delete category:', categoryName);
}

// ===== Search and Filter Functions =====

/**
 * وظيفة البحث
 */
function handleSearch(event) {
    if (event) event.preventDefault();
    
    const searchInput = document.querySelector('.form-control[placeholder="البحث..."]');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    if (searchTerm === '') {
        showNotification('يرجى إدخال كلمة البحث', 'warning');
        return;
    }
    
    // تطبيق البحث على الفئات
    filterCategories(searchTerm);
    
    showNotification(`تم البحث عن: ${searchTerm}`, 'info');
    console.log('Search for:', searchTerm);
}

/**
 * وظيفة البحث المباشر أثناء الكتابة
 */
function handleSearchInput(event) {
    const searchTerm = event.target.value.trim();
    
    // البحث المباشر بعد 500ms من التوقف عن الكتابة
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        if (searchTerm.length >= 2) {
            filterCategories(searchTerm);
        } else if (searchTerm.length === 0) {
            // إظهار جميع الفئات عند مسح البحث
            showAllCategories();
        }
    }, 500);
}

/**
 * وظيفة التصفية
 */
function handleFilter(event) {
    event.preventDefault();
    
    // يمكن إضافة نافذة منبثقة للتصفية المتقدمة
    showNotification('ميزة التصفية المتقدمة قيد التطوير', 'info');
    
    console.log('Filter categories');
}

/**
 * تصفية الفئات حسب النص
 */
function filterCategories(searchTerm) {
    const categoryItems = document.querySelectorAll('.category-item');
    let visibleCount = 0;
    
    categoryItems.forEach(item => {
        const categoryName = item.querySelector('.category-name').textContent.toLowerCase();
        const categoryDescription = item.querySelector('.category-description').textContent.toLowerCase();
        const isVisible = categoryName.includes(searchTerm.toLowerCase()) || 
                         categoryDescription.includes(searchTerm.toLowerCase());
        
        const parentCol = item.closest('.col-md-6');
        if (isVisible) {
            parentCol.style.display = '';
            visibleCount++;
        } else {
            parentCol.style.display = 'none';
        }
    });
    
    // عرض رسالة إذا لم توجد نتائج
    if (visibleCount === 0) {
        showNotification('لم يتم العثور على فئات مطابقة', 'warning');
    }
}

/**
 * إظهار جميع الفئات
 */
function showAllCategories() {
    const categoryColumns = document.querySelectorAll('#categoriesGrid .col-md-6');
    categoryColumns.forEach(col => {
        col.style.display = '';
    });
}


// ===== Responsive Features =====

/**
 * تهيئة الميزات المتجاوبة
 */
function initializeResponsiveFeatures() {
    // إضافة زر القائمة للشاشات الصغيرة
    addMobileMenuButton();
    
    // مراقبة تغيير حجم الشاشة
    window.addEventListener('resize', handleWindowResize);
    
    // التحقق من حجم الشاشة عند التحميل
    handleWindowResize();
}

/**
 * إضافة زر القائمة للشاشات الصغيرة
 */
function addMobileMenuButton() {
    const navbar = document.querySelector('.navbar .container-fluid');
    
    // التحقق من وجود الزر مسبقاً
    if (document.querySelector('.mobile-menu-btn')) return;
    
    // إنشاء زر القائمة
    const menuButton = document.createElement('button');
    menuButton.className = 'btn btn-outline-secondary d-lg-none mobile-menu-btn';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    menuButton.style.order = '-1';
    
    // إضافة الزر إلى الـ navbar
    navbar.insertBefore(menuButton, navbar.firstChild);
    
    // إضافة وظيفة النقر
    menuButton.addEventListener('click', toggleMobileSidebar);
}

/**
 * تبديل القائمة الجانبية في الشاشات الصغيرة
 */
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
    
    // إضافة overlay للخلفية
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
            display: none;
        `;
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('show');
            overlay.style.display = 'none';
        });
    }
    
    if (sidebar.classList.contains('show')) {
        overlay.style.display = 'block';
    } else {
        overlay.style.display = 'none';
    }
}

/**
 * التعامل مع تغيير حجم الشاشة
 */
function handleWindowResize() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (window.innerWidth >= 992) {
        // إخفاء القائمة المحمولة في الشاشات الكبيرة
        sidebar.classList.remove('show');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
}

// ===== Category Interactions =====

/**
 * تهيئة تفاعلات الفئات
 */
function initializeCategoryInteractions() {
    // إضافة تأثيرات التحويم للصور
    const categoryImages = document.querySelectorAll('.category-image img');
    categoryImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.zIndex = '10';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });
        
        // إضافة وظيفة النقر لعرض الصورة بحجم أكبر
        img.addEventListener('click', function() {
            showImageModal(this.src, this.alt);
        });
    });
    
    // إضافة تأثيرات للبطاقات
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== Utility Functions =====

/**
 * وظيفة عرض الإشعارات
 */
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        min-width: 300px;
        text-align: center;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // إضافة الإشعار للصفحة
    document.body.appendChild(notification);
    
    // إزالة الإشعار تلقائياً بعد 3 ثوان
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

/**
 * تهيئة التلميحات (Tooltips)
 */
function initializeTooltips() {
    // إضافة تلميحات للأزرار
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        if (!btn.title && btn.querySelector('i')) {
            const icon = btn.querySelector('i');
            if (icon.classList.contains('fa-edit')) {
                btn.title = 'تعديل الفئة';
            } else if (icon.classList.contains('fa-trash')) {
                btn.title = 'حذف الفئة';
            } else if (icon.classList.contains('fa-plus')) {
                btn.title = 'إضافة فئة جديدة';
            } else if (icon.classList.contains('fa-search')) {
                btn.title = 'البحث في الفئات';
            } else if (icon.classList.contains('fa-filter')) {
                btn.title = 'تصفية الفئات';
            }
        }
    });
}

/**
 * عرض الصورة في نافذة منبثقة
 */
function showImageModal(src, alt) {
    // إنشاء النافذة المنبثقة
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${alt}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="${src}" alt="${alt}" class="img-fluid">
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // عرض النافذة
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // إزالة النافذة عند الإغلاق
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

// ===== Form Validation =====

/**
 * التحقق من صحة النموذج
 */
function validateCategoryForm() {
    const categoryName = document.getElementById('categoryName').value.trim();
    const categoryClassification = document.getElementById('categoryClassification').value;
    
    const errors = [];
    
    if (!categoryName) {
        errors.push('اسم الفئة مطلوب');
    } else if (categoryName.length < 2) {
        errors.push('اسم الفئة يجب أن يكون أكثر من حرفين');
    }
    
    if (!categoryClassification) {
        errors.push('تصنيف الفئة مطلوب');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ===== Error Handling =====


/**
 * التعامل مع الأخطاء غير المعالجة
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    showNotification('حدث خطأ في الاتصال. يرجى التحقق من الاتصال بالإنترنت.', 'warning');
});

// ===== Console Welcome Message =====
console.log(`
🎉 مرحباً بك في لوحة تحكم إدارة الفئات
📂 تم تحميل جميع الوظائف بنجاح
🚀 جاهز للاستخدام!

الميزات المتاحة:
- إضافة فئات جديدة مع رفع الصور
- تعديل وحذف الفئات الموجودة
- البحث والتصفية
- تصميم متجاوب

المطور: مساعد ذكي متخصص
التاريخ: ${new Date().toLocaleDateString('ar-EG')}
`);

// ===== Export for Module Usage (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleAddCategory,
        handleEditCategory,
        handleDeleteCategory,
        handleImageSelect,
        showNotification
    };
}



// ========== Product Management JavaScript ==========

document.addEventListener('DOMContentLoaded', function() {
    // Initialize category management functionality
    initializeCategoryManagement();
    initializeSidebar();
    initializeSearch();
});

// ========== Category Management Functions ==========
function initializeCategoryManagement() {
    // Category image upload functionality
    const categoryImageUpload = document.getElementById('categoryImageUploadArea');
    const categoryImageInput = document.getElementById('categoryImage');
    
    if (categoryImageUpload && categoryImageInput) {
        // Click to upload
        categoryImageUpload.addEventListener('click', function() {
            categoryImageInput.click();
        });
        
        // Drag and drop functionality
        categoryImageUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#10b981';
            this.style.backgroundColor = '#f0fdf4';
        });
        
        categoryImageUpload.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#d1d5db';
            this.style.backgroundColor = '#f9fafb';
        });
        
        categoryImageUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#d1d5db';
            this.style.backgroundColor = '#f9fafb';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleCategoryImageUpload(files[0]);
            }
        });
        
        // File input change
        categoryImageInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleCategoryImageUpload(e.target.files[0]);
            }
        });
    }
    
    // Category form submission
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCategorySubmission();
        });
    }
    
    // Category action buttons
    initializeCategoryActions();
}

function handleCategoryImageUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('يرجى اختيار ملف صورة صالح', 'error');
        return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('حجم الملف يجب أن يكون أقل من 10 ميجابايت', 'error');
        return;
    }
    
    // Create file reader
    const reader = new FileReader();
    reader.onload = function(e) {
        const uploadArea = document.getElementById('categoryImageUploadArea');
        uploadArea.innerHTML = `
            <img src="${e.target.result}" alt="صورة الفئة" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
            <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px;">
                تم الرفع بنجاح
            </div>
        `;
        uploadArea.classList.add('has-image');
        showNotification('تم رفع الصورة بنجاح', 'success');
    };
    reader.readAsDataURL(file);
}

function handleCategorySubmission() {
    // Get form data
    const categoryName = document.getElementById('categoryName').value.trim();
    const categoryDescription = document.getElementById('categoryDescription').value.trim();
    const categoryClassification = document.getElementById('categoryClassification').value.trim();
    
    // Validate required fields
    if (!categoryName) {
        showNotification('يرجى إدخال اسم الفئة', 'error');
        return;
    }
    
    if (!categoryClassification) {
        showNotification('يرجى اختيار تصنيف الفئة', 'error');
        return;
    }
    
    // Simulate category creation
    const newCategory = {
        id: Date.now(),
        name: categoryName,
        description: categoryDescription,
        classification: categoryClassification,
        products: 0,
        image: null // Would contain uploaded image data
    };
    
    // Add to categories list (simulation)
    addCategoryToList(newCategory);
    
    // Reset form
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryImageUploadArea').innerHTML = `
        <div class="upload-placeholder">
            <i class="fa-solid fa-image fa-3x mb-3"></i>
            <p>اضغط هنا لرفع صورة</p>
        </div>
    `;
    document.getElementById('categoryImageUploadArea').classList.remove('has-image');
    
    showNotification('تم إضافة الفئة بنجاح', 'success');
}

function addCategoryToList(category) {
    // This would typically add the category to the actual list
    // For demo purposes, we'll just show a success message
    console.log('تم إضافة فئة جديدة:', category);
}

function initializeCategoryActions() {
    // Edit buttons
    document.querySelectorAll('.category-actions .btn-outline-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryItem = this.closest('.category-item');
            const categoryName = categoryItem.querySelector('.category-title').textContent;
            showNotification(`تعديل الفئة: ${categoryName}`, 'info');
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.category-actions .btn-outline-danger').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryItem = this.closest('.category-item');
            const categoryName = categoryItem.querySelector('.category-title').textContent;
            
            if (confirm(`هل أنت متأكد من حذف الفئة "${categoryName}"؟`)) {
                categoryItem.remove();
                showNotification(`تم حذف الفئة: ${categoryName}`, 'success');
            }
        });
    });
}

// ========== Sidebar Functions ==========
function initializeSidebar() {
    // Mobile sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            if (overlay) {
                overlay.classList.toggle('show');
            }
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });
    }
    
    // Sidebar menu items
    const menuItems = document.querySelectorAll('.sidebar-menu .nav-link');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

// ========== Search Functions ==========
function initializeSearch() {
    const searchInput = document.querySelector('.navbar-search input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterCategories(searchTerm);
        });
    }
}

function filterCategories(searchTerm) {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        const categoryName = item.querySelector('.category-title').textContent.toLowerCase();
        if (categoryName.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// ========== Notification System ==========
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
    }
}

// ========== Animation Styles ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

//===========================PRODUCT(3)===================================
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. تفعيل رفع الصور ---
    const mainImageUploader = document.querySelector('.main-image-uploader');
    const thumbUploader = document.querySelectorAll('.thumb-uploader');

    // إنشاء input وهمي لاختيار الملفات
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    // عند الضغط على مربع الصورة الرئيسي
    mainImageUploader.addEventListener('click', () => fileInput.click());
    
    // عند الضغط على مربعات الصور المصغرة
    thumbUploader.forEach(thumb => {
        thumb.addEventListener('click', () => fileInput.click());
    });

    // عند اختيار صورة
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // سنضع الصورة المختارة في أول مربع فارغ نجده
                const targetUploader = document.querySelector('.main-image-uploader:not(.has-image)') || document.querySelector('.thumb-uploader:not(.has-image)');
                if (targetUploader) {
                    targetUploader.innerHTML = `<img src="${e.target.result}" alt="preview">`;
                    targetUploader.classList.add('has-image');
                    targetUploader.style.padding = '0'; // لإزالة الحشو الداخلي بعد وضع الصورة
                } else {
                    alert("لقد قمت بملء جميع أماكن الصور.");
                }
            };
            reader.readAsDataURL(file);
        }
    });


    // --- 2. إضافة الخيارات و Tags ---
    const addOptionBtn = document.querySelector('.input-with-button .btn-gray');
    const optionInput = document.querySelector('.input-with-button input[placeholder*="المقاس"]');
    const tagsContainer = document.querySelector('.tags');

    addOptionBtn.addEventListener('click', () => {
        const optionText = optionInput.value.trim();
        if (optionText) {
            addTag(optionText);
            optionInput.value = ''; // تفريغ الحقل بعد الإضافة
        }
    });
    
    // دالة لإضافة Tag جديد
    function addTag(text) {
        const tag = document.createElement('span');
        tag.classList.add('tag');
        tag.innerHTML = `${text} <i class="fas fa-times"></i>`;
        tagsContainer.appendChild(tag);
    }

    // --- 3. حذف الـ Tags ---
    tagsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('fa-times')) {
            event.target.parentElement.remove();
        }
    });
    
    // إضافة Tags افتراضية كما في التصميم
    addTag('اللون');
    addTag('احمر');
    addTag('اسود');


    // --- 4. تفعيل لوحة الألوان (Color Palette) ---
    const colorSelectBtn = document.querySelector('.btn-green-light');
    
    // إنشاء لوحة الألوان
    const colorPalette = document.createElement('div');
    colorPalette.classList.add('color-palette');
    const colors = ['#FF0000', '#0000FF', '#008000', '#FFFF00', '#FFA500', '#800080', '#000000', '#FFFFFF'];
    colors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.classList.add('color-box');
        colorBox.style.backgroundColor = color;
        colorBox.dataset.color = color;
        colorPalette.appendChild(colorBox);
    });
    
    // إخفاء اللوحة بشكل افتراضي
    colorPalette.style.display = 'none';
    document.getElementById('form-sidebar').appendChild(colorPalette);

    // إظهار/إخفاء اللوحة عند الضغط
    colorSelectBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // لمنع إغلاقها فورًا
        const isVisible = colorPalette.style.display === 'block';
        colorPalette.style.display = isVisible ? 'none' : 'block';
    });

    // اختيار لون من اللوحة
    colorPalette.addEventListener('click', function(event) {
        if (event.target.classList.contains('color-box')) {
            const selectedColor = event.target.dataset.color;
            const colorName = getColorName(selectedColor); // دالة بسيطة لترجمة الكود للون
            addTag(colorName);
            colorPalette.style.display = 'none'; // إخفاء اللوحة بعد الاختيار
        }
    });

    // إخفاء اللوحة عند الضغط في أي مكان آخر
    document.addEventListener('click', () => {
        colorPalette.style.display = 'none';
    });

    // دالة بسيطة لتحويل كود اللون إلى اسم (يمكن توسيعها)
    function getColorName(hex) {
        const colorMap = {
            '#FF0000': 'أحمر', '#0000FF': 'أزرق', '#008000': 'أخضر',
            '#FFFF00': 'أصفر', '#FFA500': 'برتقالي', '#800080': 'بنفسجي',
            '#000000': 'أسود', '#FFFFFF': 'أبيض'
        };
        return colorMap[hex.toUpperCase()] || hex;
    }
});