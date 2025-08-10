//========================ADD Iem2===================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- متغيرات عامة ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggler = document.getElementById('sidebar-toggler');
    const optionInput = document.getElementById('optionInput');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const optionSelect = document.getElementById('optionSelect');
    const optionValueInput = document.getElementById('optionValueInput');
    const addValueBtn = document.getElementById('addValueBtn');
    const colorTags = document.getElementById('colorTags');
    const productPrice = document.getElementById('productPrice');
    const discountPrice = document.getElementById('discountPrice');
    const mainUpload = document.getElementById('mainUpload');
    const mainFileInput = document.getElementById('mainFileInput');
    const thumbnailUploads = document.querySelectorAll('.thumbnail-upload');
    const productName = document.getElementById('productName');
    const productDescription = document.getElementById('productDescription');
    const productCategory = document.getElementById('productCategory');
    const submitBtn = document.getElementById('submitBtn');
    const imageModal = document.getElementById('imageModal');
    const previewImage = document.getElementById('previewImage');
    const closeModal = document.getElementById('closeModal');
    const confirmImage = document.getElementById('confirmImage');
    const cancelImage = document.getElementById('cancelImage');
    const successNotification = document.getElementById('successNotification');
    
    let currentUploadTarget = null;
    let uploadedImages = {
        main: null,
        thumbnails: [null, null, null]
    };
    
    // --- 1. وظائف الشريط الجانبي ---
    
    // تبديل الشريط الجانبي للموبايل
    if (sidebarToggler) {
        sidebarToggler.addEventListener('click', function() {
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
                    opacity: 0;
                    transition: opacity 0.3s;
                `;
                document.body.appendChild(overlay);
                
                // إغلاق الشريط الجانبي عند النقر على الخلفية
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('show');
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 300);
                });
            }
            
            if (sidebar.classList.contains('show')) {
                overlay.style.opacity = '1';
            } else {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }
        });
    }
    
    // --- 2. إدارة الخيارات والقيم ---
    
    // إضافة خيار جديد
    if (addOptionBtn && optionInput) {
        addOptionBtn.addEventListener('click', function() {
            const optionValue = optionInput.value.trim();
            if (optionValue) {
                // إضافة الخيار إلى القائمة المنسدلة
                const option = document.createElement('option');
                option.value = optionValue.toLowerCase().replace(/\s+/g, '_');
                option.textContent = optionValue;
                optionSelect.appendChild(option);
                
                // مسح الحقل
                optionInput.value = '';
                
                // تأثير بصري
                addOptionBtn.classList.add('pulse');
                setTimeout(() => addOptionBtn.classList.remove('pulse'), 500);
                
                showNotification('تم إضافة الخيار بنجاح!', 'success');
            } else {
                optionInput.classList.add('shake');
                setTimeout(() => optionInput.classList.remove('shake'), 500);
                showNotification('يرجى إدخال اسم الخيار', 'error');
            }
        });
        
        // إضافة خيار عند الضغط على Enter
        optionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addOptionBtn.click();
            }
        });
    }
    
    // إضافة قيمة للخيار
    if (addValueBtn && optionValueInput) {
        addValueBtn.addEventListener('click', function() {
            const valueText = optionValueInput.value.trim();
            if (valueText) {
                // تقسيم القيم بالفواصل
                const values = valueText.split(',').map(v => v.trim()).filter(v => v);
                
                values.forEach(value => {
                    addTag(value);
                });
                
                // مسح الحقل
                optionValueInput.value = '';
                
                // تأثير بصري
                addValueBtn.classList.add('pulse');
                setTimeout(() => addValueBtn.classList.remove('pulse'), 500);
                
                showNotification(`تم إضافة ${values.length} قيمة بنجاح!`, 'success');
            } else {
                optionValueInput.classList.add('shake');
                setTimeout(() => optionValueInput.classList.remove('shake'), 500);
                showNotification('يرجى إدخال قيمة الخيار', 'error');
            }
        });
        
        // إضافة قيمة عند الضغط على Enter
        optionValueInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addValueBtn.click();
            }
        });
    }
    
    // إضافة تاج جديد
    function addTag(text) {
        if (!colorTags) return;
        
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${text} <i class="fas fa-times"></i>`;
        
        // إضافة مستمع الحذف
        tag.querySelector('i').addEventListener('click', function() {
            tag.classList.add('shake');
            setTimeout(() => tag.remove(), 300);
        });
        
        colorTags.appendChild(tag);
        
        // تأثير الظهور
        setTimeout(() => tag.classList.add('pulse'), 100);
    }
    
    // حذف التاجز الموجودة مسبقاً
    document.querySelectorAll('.tag i').forEach(icon => {
        icon.addEventListener('click', function() {
            const tag = this.parentElement;
            tag.classList.add('shake');
            setTimeout(() => tag.remove(), 300);
        });
    });
    
    // --- 3. التحقق من الأسعار ---
    
    if (productPrice && discountPrice) {
        // التحقق من سعر الخصم
        function validatePrices() {
            const originalPrice = parseFloat(productPrice.value) || 0;
            const discountPriceValue = parseFloat(discountPrice.value) || 0;
            
            if (discountPriceValue > 0 && discountPriceValue >= originalPrice) {
                discountPrice.classList.add('shake');
                setTimeout(() => discountPrice.classList.remove('shake'), 500);
                showNotification('سعر الخصم يجب أن يكون أقل من السعر الأصلي', 'error');
                return false;
            }
            
            return true;
        }
        
        productPrice.addEventListener('input', validatePrices);
        discountPrice.addEventListener('input', validatePrices);
        
        // تنسيق الأرقام
        [productPrice, discountPrice].forEach(input => {
            input.addEventListener('input', function() {
                // إزالة الأحرف غير الرقمية
                this.value = this.value.replace(/[^\d.]/g, '');
                
                // منع أكثر من نقطة عشرية واحدة
                const parts = this.value.split('.');
                if (parts.length > 2) {
                    this.value = parts[0] + '.' + parts.slice(1).join('');
                }
            });
        });
    }
    
    // --- 4. رفع الصور ---
    
    // الصورة الرئيسية
    if (mainUpload && mainFileInput) {
        mainUpload.addEventListener('click', function() {
            mainFileInput.click();
        });
        
        mainFileInput.addEventListener('change', function(e) {
            if (e.target.files[0]) {
                currentUploadTarget = { type: 'main', element: mainUpload };
                showImagePreview(e.target.files[0]);
            }
        });
    }
    
    // الصور المصغرة
    thumbnailUploads.forEach((thumbnail, index) => {
        const fileInput = thumbnail.querySelector('input[type="file"]');
        
        thumbnail.addEventListener('click', function() {
            if (fileInput) {
                fileInput.click();
            } else {
                // إنشاء input جديد إذا لم يكن موجوداً
                const newInput = document.createElement('input');
                newInput.type = 'file';
                newInput.accept = 'image/*';
                newInput.style.display = 'none';
                thumbnail.appendChild(newInput);
                
                newInput.addEventListener('change', function(e) {
                    if (e.target.files[0]) {
                        currentUploadTarget = { type: 'thumbnail', element: thumbnail, index: index };
                        showImagePreview(e.target.files[0]);
                    }
                });
                
                newInput.click();
            }
        });
        
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                if (e.target.files[0]) {
                    currentUploadTarget = { type: 'thumbnail', element: thumbnail, index: index };
                    showImagePreview(e.target.files[0]);
                }
            });
        }
    });
    
    // عرض معاينة الصورة
    function showImagePreview(file) {
        if (!file.type.startsWith('image/')) {
            showNotification('يرجى اختيار ملف صورة صالح', 'error');
            return;
        }
        
        // التحقق من حجم الملف (5MB كحد أقصى)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('حجم الصورة كبير جداً. الحد الأقصى 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            if (previewImage && imageModal) {
                previewImage.src = e.target.result;
                imageModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        };
        reader.readAsDataURL(file);
    }
    
    // تأكيد الصورة
    if (confirmImage) {
        confirmImage.addEventListener('click', function() {
            if (currentUploadTarget && previewImage && previewImage.src) {
                const img = document.createElement('img');
                img.src = previewImage.src;
                img.className = 'uploaded-image';
                img.alt = 'صورة المنتج';
                
                // إضافة تأثير التحميل
                currentUploadTarget.element.classList.add('loading');
                
                setTimeout(() => {
                    currentUploadTarget.element.innerHTML = '';
                    currentUploadTarget.element.appendChild(img);
                    currentUploadTarget.element.classList.remove('loading');
                    currentUploadTarget.element.classList.add('has-image');
                    
                    // حفظ الصورة في المتغير
                    if (currentUploadTarget.type === 'main') {
                        uploadedImages.main = previewImage.src;
                    } else {
                        uploadedImages.thumbnails[currentUploadTarget.index] = previewImage.src;
                    }
                    
                    // إضافة زر الحذف
                    const deleteBtn = document.createElement('div');
                    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteBtn.className = 'delete-image-btn';
                    deleteBtn.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        background: rgba(231, 76, 60, 0.9);
                        color: white;
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 12px;
                        opacity: 0;
                        transition: opacity 0.3s;
                    `;
                    
                    currentUploadTarget.element.style.position = 'relative';
                    currentUploadTarget.element.appendChild(deleteBtn);
                    
                    // إظهار زر الحذف عند التمرير
                    currentUploadTarget.element.addEventListener('mouseenter', () => {
                        deleteBtn.style.opacity = '1';
                    });
                    
                    currentUploadTarget.element.addEventListener('mouseleave', () => {
                        deleteBtn.style.opacity = '0';
                    });
                    
                    // وظيفة الحذف
                    deleteBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        
                        // حذف الصورة من المتغير
                        if (currentUploadTarget.type === 'main') {
                            uploadedImages.main = null;
                        } else {
                            uploadedImages.thumbnails[currentUploadTarget.index] = null;
                        }
                        
                        currentUploadTarget.element.innerHTML = '<i class="fas fa-plus"></i>';
                        currentUploadTarget.element.classList.remove('has-image');
                        currentUploadTarget.element.style.position = '';
                        
                        // إعادة إضافة input للصور المصغرة
                        if (currentUploadTarget.type === 'thumbnail') {
                            const newInput = document.createElement('input');
                            newInput.type = 'file';
                            newInput.accept = 'image/*';
                            newInput.style.display = 'none';
                            currentUploadTarget.element.appendChild(newInput);
                            
                            newInput.addEventListener('change', function(e) {
                                if (e.target.files[0]) {
                                    currentUploadTarget = { 
                                        type: 'thumbnail', 
                                        element: currentUploadTarget.element, 
                                        index: currentUploadTarget.index 
                                    };
                                    showImagePreview(e.target.files[0]);
                                }
                            });
                        }
                        
                        validateForm();
                    });
                    
                    closeImageModal();
                    showNotification('تم رفع الصورة بنجاح!', 'success');
                    validateForm();
                }, 1000);
            }
        });
    }
    
    // إلغاء الصورة
    if (cancelImage) cancelImage.addEventListener('click', closeImageModal);
    if (closeModal) closeModal.addEventListener('click', closeImageModal);
    
    // إغلاق النافذة عند النقر خارجها
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeImageModal();
            }
        });
    }
    
    function closeImageModal() {
        if (imageModal && previewImage) {
            imageModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            previewImage.src = '';
            currentUploadTarget = null;
        }
    }
    
    // --- 5. التحقق من صحة النموذج ---
    
    const requiredFields = [productName, productDescription, productCategory, productPrice]
        .filter(field => field !== null);
    
    // التحقق في الوقت الفعلي
    requiredFields.forEach(field => {
        field.addEventListener('input', validateForm);
        field.addEventListener('blur', validateField);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        if (!value) {
            field.classList.add('shake');
            setTimeout(() => field.classList.remove('shake'), 500);
            return false;
        }
        
        return true;
    }
    
    function validateForm() {
        const isFieldsValid = requiredFields.every(field => field.value.trim() !== '');
        const hasMainImage = uploadedImages.main !== null;
        const isPricesValid = validatePrices();
        
        const isValid = isFieldsValid && hasMainImage && isPricesValid;
        
        if (submitBtn) {
            submitBtn.disabled = !isValid;
            
            if (isValid) {
                submitBtn.classList.remove('pulse');
            } else {
                submitBtn.classList.add('pulse');
            }
        }
        
        return isValid;
    }
    
    // --- 6. إرسال النموذج ---
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                showNotification('يرجى ملء جميع الحقول المطلوبة ورفع صورة رئيسية', 'error');
                return;
            }
            
            // جمع بيانات النموذج
            const formData = {
                name: productName.value.trim(),
                description: productDescription.value.trim(),
                category: productCategory.value,
                price: parseFloat(productPrice.value) || 0,
                discountPrice: parseFloat(discountPrice.value) || 0,
                images: uploadedImages,
                tags: Array.from(colorTags.querySelectorAll('.tag')).map(tag => 
                    tag.textContent.replace('×', '').trim()
                ),
                options: {
                    selectedOption: optionSelect.value,
                    customOptions: Array.from(optionSelect.options)
                        .filter(opt => opt.value && opt.value !== '')
                        .map(opt => ({ value: opt.value, text: opt.textContent }))
                }
            };
            
            // تأثير التحميل
            this.classList.add('loading');
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';
            
            // محاكاة الإرسال
            setTimeout(() => {
                this.classList.remove('loading');
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-check"></i> تم بنجاح!';
                this.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                
                showNotification('تم إضافة المنتج بنجاح!', 'success');
                
                // طباعة البيانات في الكونسول للمطور
                console.log('بيانات المنتج:', formData);
                
                // إعادة تعيين النموذج بعد 3 ثوان
                setTimeout(() => {
                    resetForm();
                }, 3000);
            }, 2000);
        });
    }
    
    // --- 7. وظائف مساعدة ---
    
    // إعادة تعيين النموذج
    function resetForm() {
        // مسح الحقول
        requiredFields.forEach(field => {
            field.value = '';
        });
        
        if (optionInput) optionInput.value = '';
        if (optionValueInput) optionValueInput.value = '';
        
        // إعادة تعيين القائمة المنسدلة
        if (optionSelect) {
            optionSelect.innerHTML = `
                <option value="">الوان</option>
                <option value="colors">الألوان</option>
                <option value="sizes">المقاسات</option>
                <option value="materials">المواد</option>
            `;
        }
        
        // مسح التاجز
        if (colorTags) {
            colorTags.innerHTML = `
                <span class="tag">اللون <i class="fas fa-times"></i></span>
                <span class="tag">احمر <i class="fas fa-times"></i></span>
                <span class="tag">اسود <i class="fas fa-times"></i></span>
            `;
        }
        
        // إعادة إضافة مستمعات الحذف للتاجز الافتراضية
        document.querySelectorAll('.tag i').forEach(icon => {
            icon.addEventListener('click', function() {
                const tag = this.parentElement;
                tag.classList.add('shake');
                setTimeout(() => tag.remove(), 300);
            });
        });
        
        // مسح الصور
        uploadedImages = {
            main: null,
            thumbnails: [null, null, null]
        };
        
        document.querySelectorAll('.has-image').forEach(element => {
            if (element.classList.contains('thumbnail-upload')) {
                element.innerHTML = '<i class="fas fa-plus"></i><input type="file" accept="image/*" style="display: none;">';
            } else {
                element.innerHTML = '<div class="upload-content"><i class="fas fa-cloud-upload-alt upload-icon"></i><p class="upload-text">اضغط لاضافة صورة</p></div>';
            }
            element.classList.remove('has-image');
        });
        
        // إعادة تعيين الزر
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-plus"></i><span>اضافة المنتج</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        }
        
        validateForm();
    }
    
    // عرض الإشعارات
    function showNotification(message, type = 'info') {
        // إزالة الإشعارات الموجودة
        document.querySelectorAll('.notification').forEach(notif => {
            if (notif.id !== 'successNotification') {
                notif.remove();
            }
        });
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        // ألوان الإشعارات
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 4 ثوان
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // --- 8. تحسينات إضافية ---
    
    // تحسين البحث
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            // يمكن إضافة منطق البحث هنا
            console.log('البحث عن:', query);
        });
    }
    
    // تحسين القائمة المنسدلة للملف الشخصي
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) {
        profileDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            // يمكن إضافة منطق إضافي هنا
        });
    }
    
    // تحسين الاستجابة للشاشة
    function handleResize() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('show');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) overlay.remove();
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // إضافة CSS للحركات الإضافية
    const additionalStyles = `
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
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .sidebar-overlay {
            display: block !important;
        }
        
        @media (max-width: 992px) {
            .sidebar.show {
                transform: translateX(0) !important;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
    
    // --- 9. تهيئة أولية ---
    
    // التحقق الأولي من النموذج
    validateForm();
    
    // إضافة مستمعات للحقول المطلوبة
    requiredFields.forEach(field => {
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('shake');
            }
        });
    });
    
    // تحسين تجربة المستخدم للأسعار
    [productPrice, discountPrice].forEach(input => {
        if (input) {
            input.addEventListener('focus', function() {
                this.select();
            });
        }
    });
    
    // رسالة في الكونسول
    console.log('🎨 صفحة إضافة المنتج جاهزة للاستخدام!');
    console.log('✨ الميزات المتاحة:');
    console.log('- شريط جانبي تفاعلي');
    console.log('- إضافة وحذف الخيارات والقيم');
    console.log('- رفع الصور مع المعاينة');
    console.log('- التحقق من صحة البيانات');
    console.log('- تصميم متجاوب');
    console.log('- إشعارات ذكية');
    console.log('- تحقق من الأسعار');
});


//========================ADD Iem===================
document.addEventListener('DOMContentLoaded', function() {
    
    // --- متغيرات عامة ---
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggler = document.getElementById('sidebar-toggler');
    const colorPicker = document.getElementById('colorPicker');
    const colorStrip = document.getElementById('colorStrip');
    const colorNameInput = document.getElementById('colorName');
    const colorCodeInput = document.getElementById('colorCode');
    const colorTags = document.getElementById('colorTags');
    const sizeTags = document.getElementById('sizeTags');
    const productSizeInput = document.getElementById('productSize');
    const mainUpload = document.getElementById('mainUpload');
    const mainFileInput = document.getElementById('mainFileInput');
    const thumbnailUploads = document.querySelectorAll('.thumbnail-upload');
    const submitBtn = document.getElementById('submitBtn');
    const imageModal = document.getElementById('imageModal');
    const previewImage = document.getElementById('previewImage');
    const closeModal = document.getElementById('closeModal');
    const confirmImage = document.getElementById('confirmImage');
    const cancelImage = document.getElementById('cancelImage');
    
    let currentUploadTarget = null;
    let selectedColor = '#ff4444';
    
  
    // --- 2. وظائف لوحة الألوان ---
    // تحريك مؤشر اللون
    if (colorStrip && colorPicker) {
        colorStrip.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            
            // تحديد موقع المؤشر
            colorPicker.style.right = `${Math.max(0, Math.min(percentage, 100))}%`;
            
            // حساب اللون المحدد
            selectedColor = getColorAtPosition(percentage);
            if (colorCodeInput) colorCodeInput.value = selectedColor;
            
            // تحديث اسم اللون تلقائياً
            updateColorName(selectedColor);
            
            // تأثير بصري
            colorPicker.classList.add('pulse');
            setTimeout(() => colorPicker.classList.remove('pulse'), 500);
        });
        
        // سحب مؤشر اللون
        let isDragging = false;
        
        colorPicker.addEventListener('mousedown', function(e) {
            isDragging = true;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const rect = colorStrip.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min((x / rect.width) * 100, 100));
            
            colorPicker.style.right = `${percentage}%`;
            selectedColor = getColorAtPosition(percentage);
            if (colorCodeInput) colorCodeInput.value = selectedColor;
            updateColorName(selectedColor);
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }
    
    // حساب اللون حسب الموقع
    function getColorAtPosition(percentage) {
        const colors = [
            { pos: 0, color: [255, 68, 68] },
            { pos: 10, color: [255, 136, 68] },
            { pos: 20, color: [255, 255, 68] },
            { pos: 30, color: [136, 255, 68] },
            { pos: 40, color: [68, 255, 136] },
            { pos: 50, color: [68, 255, 255] },
            { pos: 60, color: [68, 136, 255] },
            { pos: 70, color: [136, 68, 255] },
            { pos: 80, color: [255, 68, 255] },
            { pos: 90, color: [255, 68, 136] },
            { pos: 100, color: [255, 68, 68] }
        ];
        
        // العثور على اللونين المجاورين
        let color1 = colors[0];
        let color2 = colors[1];
        
        for (let i = 0; i < colors.length - 1; i++) {
            if (percentage >= colors[i].pos && percentage <= colors[i + 1].pos) {
                color1 = colors[i];
                color2 = colors[i + 1];
                break;
            }
        }
        
        // حساب التدرج
        const ratio = (percentage - color1.pos) / (color2.pos - color1.pos);
        const r = Math.round(color1.color[0] + (color2.color[0] - color1.color[0]) * ratio);
        const g = Math.round(color1.color[1] + (color2.color[1] - color1.color[1]) * ratio);
        const b = Math.round(color1.color[2] + (color2.color[2] - color1.color[2]) * ratio);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // تحديث اسم اللون
    function updateColorName(colorCode) {
        const colorNames = {
            '#ff4444': 'أحمر',
            '#ff8844': 'برتقالي',
            '#ffff44': 'أصفر',
            '#88ff44': 'أخضر فاتح',
            '#44ff88': 'أخضر',
            '#44ffff': 'سماوي',
            '#4488ff': 'أزرق',
            '#8844ff': 'بنفسجي',
            '#ff44ff': 'وردي',
            '#ff4488': 'أحمر وردي'
        };
        
        // البحث عن أقرب لون
        let closestColor = '';
        let minDistance = Infinity;
        
        Object.keys(colorNames).forEach(color => {
            const distance = getColorDistance(colorCode, color);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = colorNames[color];
            }
        });
        
        if (closestColor && colorNameInput && !colorNameInput.value) {
            colorNameInput.value = closestColor;
        }
    }
    
    // حساب المسافة بين لونين
    function getColorDistance(color1, color2) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return Infinity;
        
        return Math.sqrt(
            Math.pow(rgb1.r - rgb2.r, 2) +
            Math.pow(rgb1.g - rgb2.g, 2) +
            Math.pow(rgb1.b - rgb2.b, 2)
        );
    }
    
    // تحويل hex إلى RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    // --- 3. إدارة التاجز (Tags) ---
    
    // إضافة تاج لون عند الضغط على Enter
    if (colorNameInput) {
        colorNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                addColorTag(this.value.trim());
                this.value = '';
            }
        });
    }
    
    // إضافة تاج مقاس عند الضغط على Enter
    if (productSizeInput) {
        productSizeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                const sizes = this.value.split(',').map(s => s.trim()).filter(s => s);
                sizes.forEach(size => addSizeTag(size));
                this.value = '';
            }
        });
    }
    
    // إضافة تاج لون
    function addColorTag(colorName) {
        if (!colorTags) return;
        
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${colorName} <i class="fas fa-times"></i>`;
        tag.style.background = `linear-gradient(135deg, ${selectedColor}, ${adjustBrightness(selectedColor, -20)})`;
        
        // إضافة مستمع الحذف
        tag.querySelector('i').addEventListener('click', function() {
            tag.classList.add('shake');
            setTimeout(() => tag.remove(), 300);
        });
        
        colorTags.appendChild(tag);
        
        // تأثير الظهور
        setTimeout(() => tag.classList.add('pulse'), 100);
    }
    
    // إضافة تاج مقاس
    function addSizeTag(sizeName) {
        if (!sizeTags) return;
        
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${sizeName} <i class="fas fa-times"></i>`;
        
        // إضافة مستمع الحذف
        tag.querySelector('i').addEventListener('click', function() {
            tag.classList.add('shake');
            setTimeout(() => tag.remove(), 300);
        });
        
        sizeTags.appendChild(tag);
        
        // تأثير الظهور
        setTimeout(() => tag.classList.add('pulse'), 100);
    }
    
    // تعديل سطوع اللون
    function adjustBrightness(hex, percent) {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        
        const adjust = (color) => {
            const adjusted = color + (color * percent / 100);
            return Math.max(0, Math.min(255, Math.round(adjusted)));
        };
        
        const newR = adjust(rgb.r).toString(16).padStart(2, '0');
        const newG = adjust(rgb.g).toString(16).padStart(2, '0');
        const newB = adjust(rgb.b).toString(16).padStart(2, '0');
        
        return `#${newR}${newG}${newB}`;
    }
    
    // حذف التاجز الموجودة مسبقاً
    document.querySelectorAll('.tag i').forEach(icon => {
        icon.addEventListener('click', function() {
            const tag = this.parentElement;
            tag.classList.add('shake');
            setTimeout(() => tag.remove(), 300);
        });
    });
    
    // --- 4. رفع الصور ---
    
    // الصورة الرئيسية
    if (mainUpload && mainFileInput) {
        mainUpload.addEventListener('click', function() {
            mainFileInput.click();
        });
        
        mainFileInput.addEventListener('change', function(e) {
            if (e.target.files[0]) {
                currentUploadTarget = mainUpload;
                showImagePreview(e.target.files[0]);
            }
        });
    }
    
    // الصور المصغرة
    thumbnailUploads.forEach(thumbnail => {
        const fileInput = thumbnail.querySelector('input[type="file"]');
        
        thumbnail.addEventListener('click', function() {
            if (fileInput) fileInput.click();
        });
        
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                if (e.target.files[0]) {
                    currentUploadTarget = thumbnail;
                    showImagePreview(e.target.files[0]);
                }
            });
        }
    });
    
    // عرض معاينة الصورة
    function showImagePreview(file) {
        if (!file.type.startsWith('image/')) {
            showNotification('يرجى اختيار ملف صورة صالح', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            if (previewImage && imageModal) {
                previewImage.src = e.target.result;
                imageModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        };
        reader.readAsDataURL(file);
    }
    
    // تأكيد الصورة
    if (confirmImage) {
        confirmImage.addEventListener('click', function() {
            if (currentUploadTarget && previewImage && previewImage.src) {
                const img = document.createElement('img');
                img.src = previewImage.src;
                img.className = 'uploaded-image';
                img.alt = 'صورة المنتج';
                
                // إضافة تأثير التحميل
                currentUploadTarget.classList.add('loading');
                
                setTimeout(() => {
                    currentUploadTarget.innerHTML = '';
                    currentUploadTarget.appendChild(img);
                    currentUploadTarget.classList.remove('loading');
                    currentUploadTarget.classList.add('has-image');
                    
                    // إضافة زر الحذف
                    const deleteBtn = document.createElement('div');
                    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteBtn.className = 'delete-image-btn';
                    deleteBtn.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        background: rgba(231, 76, 60, 0.9);
                        color: white;
                        width: 25px;
                        height: 25px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 12px;
                        opacity: 0;
                        transition: opacity 0.3s;
                    `;
                    
                    currentUploadTarget.style.position = 'relative';
                    currentUploadTarget.appendChild(deleteBtn);
                    
                    // إظهار زر الحذف عند التمرير
                    currentUploadTarget.addEventListener('mouseenter', () => {
                        deleteBtn.style.opacity = '1';
                    });
                    
                    currentUploadTarget.addEventListener('mouseleave', () => {
                        deleteBtn.style.opacity = '0';
                    });
                    
                    // وظيفة الحذف
                    deleteBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        currentUploadTarget.innerHTML = '<i class="fas fa-plus"></i>';
                        currentUploadTarget.classList.remove('has-image');
                        currentUploadTarget.style.position = '';
                        
                        // إعادة إضافة input للصور المصغرة
                        if (currentUploadTarget.classList.contains('thumbnail-upload')) {
                            const newInput = document.createElement('input');
                            newInput.type = 'file';
                            newInput.accept = 'image/*';
                            newInput.style.display = 'none';
                            currentUploadTarget.appendChild(newInput);
                            
                            newInput.addEventListener('change', function(e) {
                                if (e.target.files[0]) {
                                    currentUploadTarget = currentUploadTarget;
                                    showImagePreview(e.target.files[0]);
                                }
                            });
                        } else {
                            // للصورة الرئيسية
                            const uploadContent = document.createElement('div');
                            uploadContent.className = 'upload-content';
                            uploadContent.innerHTML = `
                                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                <p class="upload-text">اضغط لاضافة صورة</p>
                            `;
                            currentUploadTarget.appendChild(uploadContent);
                        }
                    });
                    
                    closeImageModal();
                    showNotification('تم رفع الصورة بنجاح!', 'success');
                }, 1000);
            }
        });
    }
    
    // إلغاء الصورة
    if (cancelImage) cancelImage.addEventListener('click', closeImageModal);
    if (closeModal) closeModal.addEventListener('click', closeImageModal);
    
    // إغلاق النافذة عند النقر خارجها
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeImageModal();
            }
        });
    }
    
    function closeImageModal() {
        if (imageModal && previewImage) {
            imageModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            previewImage.src = '';
            currentUploadTarget = null;
        }
    }
    
    // --- 5. التحقق من صحة النموذج ---
    
    const requiredFields = [
        document.getElementById('productName'),
        document.getElementById('productDescription'),
        document.getElementById('productCategory'),
        document.getElementById('productPrice')
    ].filter(field => field !== null);
    
    // التحقق في الوقت الفعلي
    requiredFields.forEach(field => {
        field.addEventListener('input', validateForm);
        field.addEventListener('blur', validateField);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        if (!value) {
            field.classList.add('shake');
            setTimeout(() => field.classList.remove('shake'), 500);
            return false;
        }
        
        return true;
    }
    
    function validateForm() {
        const isValid = requiredFields.every(field => field.value.trim() !== '');
        if (submitBtn) {
            submitBtn.disabled = !isValid;
            
            if (isValid) {
                submitBtn.classList.remove('pulse');
            } else {
                submitBtn.classList.add('pulse');
            }
        }
        
        return isValid;
    }
    
    // --- 6. إرسال النموذج ---
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            // تأثير التحميل
            this.classList.add('loading');
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';
            
            // محاكاة الإرسال
            setTimeout(() => {
                this.classList.remove('loading');
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-check"></i> تم بنجاح!';
                this.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                
                showNotification('تم إضافة المنتج بنجاح!', 'success');
                
                // إعادة تعيين النموذج بعد 3 ثوان
                setTimeout(() => {
                    resetForm();
                }, 3000);
            }, 2000);
        });
    }
    
    // --- 7. وظائف مساعدة ---
    
    // إعادة تعيين النموذج
    function resetForm() {
        // مسح الحقول
        requiredFields.forEach(field => {
            field.value = '';
        });
        
        if (colorNameInput) colorNameInput.value = '';
        if (colorCodeInput) colorCodeInput.value = '#ff4444';
        if (productSizeInput) productSizeInput.value = '';
        
        // مسح التاجز
        if (colorTags) {
            colorTags.innerHTML = '<span class="tag">احمر <i class="fas fa-times"></i></span><span class="tag">اصفر <i class="fas fa-times"></i></span>';
        }
        if (sizeTags) {
            sizeTags.innerHTML = '<span class="tag">M <i class="fas fa-times"></i></span><span class="tag">S <i class="fas fa-times"></i></span>';
        }
        
        // إعادة إضافة مستمعات الحذف للتاجز الافتراضية
        document.querySelectorAll('.tag i').forEach(icon => {
            icon.addEventListener('click', function() {
                const tag = this.parentElement;
                tag.classList.add('shake');
                setTimeout(() => tag.remove(), 300);
            });
        });
        
        // مسح الصور
        document.querySelectorAll('.has-image').forEach(element => {
            if (element.classList.contains('thumbnail-upload')) {
                element.innerHTML = '<i class="fas fa-plus"></i><input type="file" accept="image/*" style="display: none;">';
            } else {
                element.innerHTML = '<div class="upload-content"><i class="fas fa-cloud-upload-alt upload-icon"></i><p class="upload-text">اضغط لاضافة صورة</p></div>';
            }
            element.classList.remove('has-image');
        });
        
        // إعادة تعيين الزر
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-plus"></i> اضافة المنتج';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        }
        
        // إعادة تعيين مؤشر اللون
        if (colorPicker) colorPicker.style.right = '10px';
        selectedColor = '#ff4444';
        
        validateForm();
    }
    
    // عرض الإشعارات
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        `;
        
        // ألوان الإشعارات
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 4 ثوان
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // --- 8. تحسينات إضافية ---
    
    // تحسين البحث
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            // يمكن إضافة منطق البحث هنا
            console.log('البحث عن:', query);
        });
    }
    
    // تحسين القائمة المنسدلة للملف الشخصي
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) {
        profileDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            // يمكن إضافة منطق إضافي هنا
        });
    }
    
    // تحسين الاستجابة للشاشة
    function handleResize() {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('show');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) overlay.remove();
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // إضافة CSS للحركات الإضافية
    const additionalStyles = `
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
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .sidebar-overlay {
            display: block !important;
        }
        
        @media (max-width: 992px) {
            .sidebar.show {
                transform: translateX(0) !important;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
    
    // --- 9. تهيئة أولية ---
    
    // تعيين اللون الافتراضي
    if (colorCodeInput) colorCodeInput.value = selectedColor;
    updateColorName(selectedColor);
    
    // التحقق الأولي من النموذج
    validateForm();
    
    // رسالة في الكونسول
    console.log('🎨 لوحة التحكم جاهزة للاستخدام!');
    console.log('✨ الميزات المتاحة:');
    console.log('- شريط جانبي تفاعلي');
    console.log('- اختيار الألوان التفاعلي');
    console.log('- إضافة وحذف التاجز');
    console.log('- رفع الصور مع المعاينة');
    console.log('- التحقق من صحة البيانات');
    console.log('- تصميم متجاوب');
    console.log('- إشعارات ذكية');
});



  setInterval(() => {
    document.querySelectorAll('.dynamic-thumbnail').forEach(thumbnail => {
      const items = thumbnail.querySelectorAll('.toggle-item');
      items.forEach(el => el.classList.toggle('visible'));
      items.forEach(el => el.classList.toggle('hidden'));
    });
  }, 3000);