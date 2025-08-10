document.addEventListener('DOMContentLoaded', function() {
    
    // ===============================================
    // SIDEBAR TOGGLE FOR MOBILE
    // ===============================================
    const sidebarToggler = document.getElementById('sidebar-toggler');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggler && sidebar) {
        sidebarToggler.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // ===============================================
    // COLLAPSE ARROW ROTATION
    // ===============================================
    const collapseElements = document.querySelectorAll('[data-bs-toggle="collapse"]');
    
    collapseElements.forEach(element => {
        const targetId = element.getAttribute('data-bs-target');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.addEventListener('show.bs.collapse', function() {
                const arrow = element.querySelector('.arrow-icon');
                if (arrow) {
                    arrow.style.transform = 'rotate(180deg)';
                }
            });
            
            targetElement.addEventListener('hide.bs.collapse', function() {
                const arrow = element.querySelector('.arrow-icon');
                if (arrow) {
                    arrow.style.transform = 'rotate(0deg)';
                }
            });
        }
    });

    // ===============================================
    // OPACITY SLIDERS
    // ===============================================
    const opacitySliders = document.querySelectorAll('.opacity-slider');
    
    opacitySliders.forEach(slider => {
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        
        if (valueDisplay) {
            // Update display when slider changes
            slider.addEventListener('input', function() {
                valueDisplay.textContent = this.value + '%';
            });
            
            // Set initial value
            valueDisplay.textContent = slider.value + '%';
        }
    });

    // ===============================================
    // TOGGLE BUTTONS (ON/OFF)
    // ===============================================
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const container = this.parentElement;
            const allButtons = container.querySelectorAll('.toggle-btn');
            
            // Remove active class from all buttons in this container
            allButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // ===============================================
    // IMAGE UPLOAD PLACEHOLDERS
    // ===============================================
    const imagePlaceholders = document.querySelectorAll('.image-placeholder');
    
    imagePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        alert('حجم الملف كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت.');
                        return;
                    }
                    
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                        alert('يرجى اختيار ملف صورة صحيح.');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        placeholder.innerHTML = `
                            <img src="${e.target.result}" 
                                 alt="Uploaded Image" 
                                 style="max-width: 100%; max-height: 200px; border-radius: 8px; object-fit: cover;">
                            <p style="margin-top: 10px; font-size: 12px; color: #6c757d;">اضغط لتغيير الصورة</p>
                        `;
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            fileInput.click();
        });
        
        // Add hover effect
        placeholder.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--primary-color)';
            this.style.backgroundColor = '#f0f8f3';
        });
        
        placeholder.addEventListener('mouseleave', function() {
            this.style.borderColor = 'var(--border-color)';
            this.style.backgroundColor = 'var(--light-gray)';
        });
    });

    // ===============================================
    // SAVE CHANGES BUTTON
    // ===============================================
    const saveButtons = document.querySelectorAll('.save-changes-btn');
    
    saveButtons.forEach(saveButton => {
        saveButton.addEventListener('click', function() {
            // Prevent multiple clicks
            if (this.disabled) return;
            
            // Add loading state
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
            this.disabled = true;
            
            // Simulate save operation
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> تم الحفظ بنجاح';
                this.style.backgroundColor = 'var(--success-color)';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                    this.style.backgroundColor = 'var(--primary-color)';
                }, 2000);
            }, 1500);
        });
    });

    // ===============================================
    // ACTION BUTTONS (VIEW, EDIT, DELETE)
    // ===============================================
    const actionButtons = document.querySelectorAll('.action-btn-icon');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const action = this.classList.contains('view-btn') ? 'عرض' :
                          this.classList.contains('edit-btn') ? 'تعديل' :
                          this.classList.contains('delete-btn') ? 'حذف' : 'إجراء';
            
            if (action === 'حذف') {
                if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
                    // Add delete animation
                    this.closest('.page-item').style.opacity = '0.5';
                    this.closest('.page-item').style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        alert('تم الحذف بنجاح');
                        // Here you would typically remove the element or refresh data
                    }, 300);
                }
            } else {
                alert(`تم النقر على زر ${action}`);
            }
            
            // Visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // ===============================================
    // ADD PAGE BUTTON
    // ===============================================
    const addPageButtons = document.querySelectorAll('.add-page-btn');
    
    addPageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pageName = prompt('أدخل اسم الصفحة الجديدة:');
            if (pageName && pageName.trim()) {
                alert(`تم إضافة صفحة "${pageName.trim()}" بنجاح`);
                // Here you would typically add the new page to the list
            }
        });
    });

    // ===============================================
    // SET MAIN PAGE BUTTON
    // ===============================================
    const setMainButtons = document.querySelectorAll('.set-main-btn');
    
    setMainButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (confirm('هل تريد تعيين هذه الصفحة كصفحة رئيسية؟')) {
                // Add success animation
                this.innerHTML = '<i class="fas fa-check"></i> تم التعيين';
                this.style.backgroundColor = 'var(--success-color)';
                
                setTimeout(() => {
                    this.textContent = 'تعيين كصفحة رئيسية';
                    this.style.backgroundColor = 'var(--light-green)';
                }, 2000);
            }
        });
    });

    // ===============================================
    // FORM VALIDATION
    // ===============================================
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--error-color)';
                this.style.boxShadow = '0 0 0 0.2rem rgba(231, 76, 60, 0.25)';
            } else {
                this.style.borderColor = 'var(--border-color)';
                this.style.boxShadow = 'none';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
            this.style.boxShadow = '0 0 0 0.2rem rgba(76, 175, 80, 0.25)';
        });
    });

    // ===============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ===============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===============================================
    // KEYBOARD SHORTCUTS
    // ===============================================
    document.addEventListener('keydown', function(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            const saveButton = document.querySelector('.save-changes-btn');
            if (saveButton && !saveButton.disabled) {
                saveButton.click();
            }
        }
        
        // Escape to close any open modals or collapses
        if (e.key === 'Escape') {
            const openCollapses = document.querySelectorAll('.collapse.show');
            openCollapses.forEach(collapse => {
                const bsCollapse = new bootstrap.Collapse(collapse, {
                    toggle: false
                });
                bsCollapse.hide();
            });
        }
    });

    // ===============================================
    // INITIALIZE TOOLTIPS (if Bootstrap tooltips are needed)
    // ===============================================
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // ===============================================
    // AUTO-SAVE FUNCTIONALITY (Optional)
    // ===============================================
    let autoSaveTimeout;
    const autoSaveInputs = document.querySelectorAll('.form-control');
    
    autoSaveInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            
            // Show auto-save indicator
            const indicator = document.createElement('span');
            indicator.textContent = '●';
            indicator.style.color = 'orange';
            indicator.style.marginLeft = '5px';
            indicator.className = 'auto-save-indicator';
            
            // Remove existing indicator
            const existingIndicator = this.parentElement.querySelector('.auto-save-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            this.parentElement.appendChild(indicator);
            
            // Auto-save after 3 seconds of no typing
            autoSaveTimeout = setTimeout(() => {
                indicator.textContent = '✓';
                indicator.style.color = 'green';
                
                setTimeout(() => {
                    indicator.remove();
                }, 2000);
            }, 3000);
        });
    });

    console.log('Dashboard with Collapse initialized successfully!');
});


// ===============================================
/* <!--START: (13) إدارة القائمة السفلية كولابس Footer Menu Management Section--> */
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    const draggables = document.querySelectorAll('.widget-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('drag-over');
            const afterElement = getDragAfterElement(zone, e.clientY);
            const dragging = document.querySelector('.dragging');
            if (dragging) {
                if (afterElement == null) {
                    zone.appendChild(dragging);
                } else {
                    zone.insertBefore(dragging, afterElement);
                }
            }
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            // Here you would handle creating the new "dropped-widget" element
            // For this example, we just move the item.
            // In a real app, you'd clone or create a new element with settings.
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.widget-item:not(.dragging), .dropped-widget:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});

// ====================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 600, // Animation duration in milliseconds
        once: true,    // Whether animation should happen only once
        offset: 50,    // Offset (in px) from the original trigger point
    });

    // --- Sidebar Toggle (should be in your main script.js) ---
    const sidebarToggler = document.getElementById('sidebar-toggler');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebarToggler && sidebar && overlay) {
        sidebarToggler.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        });
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });
    }

    // --- Collapse Arrow Rotation ---
    const collapseElements = document.querySelectorAll('.setting-item[data-bs-toggle="collapse"]');
    collapseElements.forEach(element => {
        const targetId = element.getAttribute('data-bs-target');
        if (!targetId) return;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.addEventListener('show.bs.collapse', function() {
                element.classList.add('expanded');
            });
            
            targetElement.addEventListener('hide.bs.collapse', function() {
                element.classList.remove('expanded');
            });
        }
    });

    // --- Drag and Drop for Footer Widgets ---
    // ... (Your existing drag and drop JS code) ...

    // ... (All other JS code for this page) ...

    console.log('Design Store page initialized with animations.');
});
