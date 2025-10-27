// Account Settings JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeTabs();
    initializeFormValidation();
    initializeFileUpload();
    initializeProfileImage();
    initializeSearch();
    initializeSidebar();
    initializeNotifications();
});

// Tab Switching Functionality - FIXED
function initializeTabs() {
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');

    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabItems.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Add animation effect
                targetContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                targetContent.style.opacity = '0';
                targetContent.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    targetContent.style.opacity = '1';
                    targetContent.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    });
}

// Form Validation
function initializeFormValidation() {
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldId = field.id;
    
    // Remove existing validation classes
    field.classList.remove('success', 'error');
    
    // Basic validation rules
    let isValid = true;
    
    if (fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    } else if (fieldType === 'tel') {
        const phoneRegex = /^[0-9]{10,15}$/;
        isValid = phoneRegex.test(value.replace(/\s/g, ''));
    } else if (fieldId === 'name') {
        isValid = value.length >= 2;
    }
    
    // Apply validation styling
    if (value && isValid) {
        field.classList.add('success');
        showFieldSuccess(field);
    } else if (value && !isValid) {
        field.classList.add('error');
        showFieldError(field, getErrorMessage(fieldId, fieldType));
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '4px';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function showFieldSuccess(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function getErrorMessage(fieldId, fieldType) {
    const messages = {
        'name': 'يجب أن يحتوي الاسم على حرفين على الأقل',
        'email': 'يرجى إدخال بريد إلكتروني صحيح',
        'phone': 'يرجى إدخال رقم هاتف صحيح'
    };
    
    return messages[fieldId] || messages[fieldType] || 'يرجى إدخال قيمة صحيحة';
}

// File Upload Functionality - FIXED AND ACTIVE
function initializeFileUpload() {
    const uploadBtn = document.getElementById('btn-upload');
    const fileInput = document.getElementById('file-upload-input');
    
    if (uploadBtn && fileInput) {
        // Click upload button to trigger file input
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                handleFileUpload(files);
            }
        });
    }
}

function handleFileUpload(files) {
    const uploadBtn = document.getElementById('btn-upload');
    const fileNote = document.getElementById('file-note');
    
    if (files.length > 0) {
        // Show loading state
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        uploadBtn.disabled = true;
        
        // Simulate upload process
        setTimeout(() => {
            uploadBtn.innerHTML = '<i class="fas fa-check"></i> تم التحميل';
            uploadBtn.style.backgroundColor = '#28a745';
            
            // Update file note with uploaded file names
            const fileNames = files.map(file => file.name).join(', ');
            fileNote.textContent = `تم تحميل: ${fileNames}`;
            fileNote.style.color = '#28a745';
            fileNote.style.fontWeight = '600';
            
            // Show success notification
            showNotification('تم تحميل الملفات بنجاح', 'success');
            
            // Reset after 3 seconds
            setTimeout(() => {
                uploadBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> تحميل';
                uploadBtn.disabled = false;
                uploadBtn.style.backgroundColor = '#28a745';
            }, 3000);
        }, 2000);
    }
}

// Profile Image Functionality - FIXED AND ACTIVE
function initializeProfileImage() {
    const editBtn = document.getElementById('edit-profile-btn');
    const fileInput = document.getElementById('profile-image-input');
    const profileImg = document.getElementById('profile-img');
    
    if (editBtn && fileInput && profileImg) {
        // Click edit button to trigger file input
        editBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Handle image selection
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                handleProfileImageUpload(file);
            } else if (file) {
                showNotification('يرجى اختيار ملف صورة صحيح', 'error');
            }
        });
    }
}

function handleProfileImageUpload(file) {
    const profileImg = document.getElementById('profile-img');
    const editBtn = document.getElementById('edit-profile-btn');
    
    // Show loading state
    editBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    editBtn.disabled = true;
    
    // Create file reader
    const reader = new FileReader();
    reader.onload = function(e) {
        // Update profile image with smooth transition
        profileImg.style.opacity = '0.5';
        
        setTimeout(() => {
            profileImg.src = e.target.result;
            profileImg.style.opacity = '1';
            
            // Show success state
            editBtn.innerHTML = '<i class="fas fa-check"></i>';
            editBtn.style.backgroundColor = '#28a745';
            
            // Show notification
            showNotification('تم تحديث الصورة الشخصية بنجاح', 'success');
            
            // Reset after 2 seconds
            setTimeout(() => {
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBtn.style.backgroundColor = '#28a745';
                editBtn.disabled = false;
            }, 2000);
        }, 300);
    };
    
    reader.onerror = function() {
        showNotification('حدث خطأ أثناء تحميل الصورة', 'error');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.disabled = false;
    };
    
    reader.readAsDataURL(file);
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
        
        // Real-time search suggestions
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                showSearchSuggestions(query);
            } else {
                hideSearchSuggestions();
            }
        });
    }
}

function performSearch(query) {
    if (query.trim()) {
        showNotification(`البحث عن: ${query}`, 'info');
        // Here you would typically send the search request to your backend
        console.log('Searching for:', query);
    }
}

function showSearchSuggestions(query) {
    // This would typically fetch suggestions from your backend
    const suggestions = [
        'إعدادات الحساب',
        'إدارة المنتجات',
        'إدارة الطلبات',
        'تقارير المبيعات'
    ].filter(item => item.includes(query));
    
    // Create suggestions dropdown (simplified implementation)
    console.log('Search suggestions:', suggestions);
}

function hideSearchSuggestions() {
    // Hide suggestions dropdown
    console.log('Hiding search suggestions');
}

// Sidebar Functionality
function initializeSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && sidebar) {
            if (!sidebar.contains(e.target) && !e.target.closest('.sidebar-toggle')) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// Notification System
function initializeNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 90px;
            left: 20px;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const container = document.querySelector('.notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.className = 'notification';
    notification.style.cssText = `
        background-color: ${colors[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(-100%);
        transition: all 0.3s ease;
        pointer-events: auto;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <i class="fas fa-times" style="margin-right: auto; opacity: 0.7;"></i>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Manual remove on click
    notification.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(-100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Form Auto-save Functionality
function initializeAutoSave() {
    const formInputs = document.querySelectorAll('.form-control');
    let saveTimeout;
    
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                autoSaveForm();
            }, 2000); // Auto-save after 2 seconds of inactivity
        });
    });
}

function autoSaveForm() {
    const formData = new FormData();
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        if (input.value.trim()) {
            formData.append(input.id, input.value);
        }
    });
    
    // Here you would send the data to your backend
    console.log('Auto-saving form data...');
    showNotification('تم حفظ البيانات تلقائياً', 'success');
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        autoSaveForm();
    }
    
    // Escape to close notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            removeNotification(notification);
        });
    }
});

// Initialize auto-save when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoSave();
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance Monitoring
function logPerformance(label) {
    if (performance && performance.mark) {
        performance.mark(label);
        console.log(`Performance mark: ${label}`);
    }
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', function() {
    logPerformance('account-settings-loaded');
});

window.addEventListener('load', function() {
    logPerformance('account-settings-fully-loaded');
});

