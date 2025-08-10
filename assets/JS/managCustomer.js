/**
 * Customer Management Dashboard - Enhanced JavaScript
 * Responsive and Accessible Customer Management System
 */

// ================== GLOBAL VARIABLES ================== //
let customers = [];
let filteredCustomers = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentFilters = {};

// ================== DOM ELEMENTS ================== //
const elements = {
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarToggler: document.getElementById('sidebarToggler'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    
    // Search
    searchInput: document.getElementById('searchInput'),
    
    // Table
    customersTable: document.getElementById('customersTable'),
    customersTableBody: document.getElementById('customersTableBody'),
    entriesSelect: document.getElementById('entriesSelect'),
    pagination: document.getElementById('pagination'),
    paginationInfo: document.getElementById('paginationInfo'),
    
    // Buttons
    filterBtn: document.getElementById('filterBtn'),
    addCustomerBtn: document.getElementById('addCustomerBtn'),
    saveCustomerBtn: document.getElementById('saveCustomerBtn'),
    applyFilterBtn: document.getElementById('applyFilterBtn'),
    clearFilterBtn: document.getElementById('clearFilterBtn'),
    
    // Modals
    addCustomerModal: document.getElementById('addCustomerModal'),
    filterModal: document.getElementById('filterModal'),
    
    // Forms
    addCustomerForm: document.getElementById('addCustomerForm'),
    filterForm: document.getElementById('filterForm'),
    
    // Notifications
    notificationContainer: document.getElementById('notificationContainer'),
    
    // Loading
    loadingOverlay: document.getElementById('loadingOverlay')
};

// ================== SAMPLE DATA ================== //
const sampleCustomers = [
    {
        id: 1,
        name: 'مدير',
        email: 'mahmoud190@yahoo.com',
        phone: '+966501234567',
        status: 'active',
        service: 'محدود خدمة العملاء',
        avatar: '../assets/images/saudi.jpg',
        joinDate: '2024-01-15',
        lastActivity: '2024-01-20'
    },
    {
        id: 2,
        name: 'مدير مواقع',
        email: 'manager@example.com',
        phone: '+966507654321',
        status: 'inactive',
        service: 'محدود خدمة العملاء',
        avatar: '../assets/images/saudi.jpg',
        joinDate: '2024-01-10',
        lastActivity: '2024-01-18'
    },
    {
        id: 3,
        name: 'عميل',
        email: 'client1@example.com',
        phone: '+966509876543',
        status: 'active',
        service: 'محدود خدمة العملاء',
        avatar: '../assets/images/saudi.jpg',
        joinDate: '2024-01-12',
        lastActivity: '2024-01-19'
    },
    {
        id: 4,
        name: 'عميل متميز',
        email: 'premium@example.com',
        phone: '+966502468135',
        status: 'pending',
        service: 'خدمة العملاء المتميزة',
        avatar: '../assets/images/saudi.jpg',
        joinDate: '2024-01-08',
        lastActivity: '2024-01-17'
    },
    {
        id: 5,
        name: 'مطور ويب',
        email: 'developer@example.com',
        phone: '+966503691472',
        status: 'active',
        service: 'محدود خدمة العملاء',
        avatar: '../assets/images/saudi.jpg',
        joinDate: '2024-01-05',
        lastActivity: '2024-01-21'
    },
    {
        id: 6,
        name: 'مصمم جرافيك',
        email: 'designer@example.com',
        phone: '+966508529637',
        status: 'inactive',
        service: 'محدود خدمة العملاء',
        avatar: '../assets/images/saudi.jpg',
        joinDate: '2024-01-03',
        lastActivity: '2024-01-16'
    },
    {
        id: 7,
        name: 'مسوق رقمي',
        email: 'marketer@example.com',
        phone: '+966504173958',
        status: 'active',
        service: 'خدمة العملاء المتميزة',
        avatar: '../assets/images/saudi.jpg',
        joinDate: '2024-01-01',
        lastActivity: '2024-01-20'
    },
    {
        id: 8,
        name: 'محاسب',
        email: 'accountant@example.com',
        phone: '+966506284719',
        status: 'pending',
        service: 'محدود خدمة العملاء',
        avatar: '../assets/images/saudi.jpg',
        joinDate: '2023-12-28',
        lastActivity: '2024-01-15'
    },
    {
        id: 9,
        name: 'مستشار تقني',
        email: 'consultant@example.com',
        phone: '+966507395184',
        status: 'active',
        service: 'خدمة العملاء المتميزة',
        avatar: '../assets/images/saudi.jpg',
        joinDate: '2023-12-25',
        lastActivity: '2024-01-19'
    },
    {
        id: 10,
        name: 'مدير مشروع',
        email: 'pm@example.com',
        phone: '+966505162738',
        status: 'inactive',
        service: 'محدود خدمة العملاء',
        avatar: '../assets/images/saudi.jpg',
        joinDate: '2023-12-20',
        lastActivity: '2024-01-14'
    }
];

// ================== UTILITY FUNCTIONS ================== //

/**
 * Debounce function to limit function calls
 */
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

/**
 * Format date to Arabic locale
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (Saudi format)
 */
function isValidPhone(phone) {
    const phoneRegex = /^(\+966|0)?[5][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Sanitize HTML to prevent XSS
 */
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// ================== NOTIFICATION SYSTEM ================== //

/**
 * Show notification
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${iconMap[type]}" aria-hidden="true"></i>
        </div>
        <div class="notification-content">
            <div class="notification-message">${sanitizeHTML(message)}</div>
        </div>
        <button class="notification-close" type="button" aria-label="إغلاق الإشعار">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
    `;
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Add to container
    elements.notificationContainer.appendChild(notification);
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
    
    return notification;
}

/**
 * Remove notification
 */
function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// ================== LOADING SYSTEM ================== //

/**
 * Show loading overlay
 */
function showLoading() {
    elements.loadingOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    elements.loadingOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

// ================== SIDEBAR FUNCTIONALITY ================== //

/**
 * Toggle sidebar on mobile
 */
function toggleSidebar() {
    const isOpen = elements.sidebar.classList.contains('show');
    
    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

/**
 * Open sidebar
 */
function openSidebar() {
    elements.sidebar.classList.add('show');
    elements.sidebarOverlay.classList.add('show');
    elements.sidebarToggler.setAttribute('aria-expanded', 'true');
    
    // Focus management
    const firstLink = elements.sidebar.querySelector('.nav-link');
    if (firstLink) {
        firstLink.focus();
    }
    
    // Trap focus within sidebar
    trapFocus(elements.sidebar);
}

/**
 * Close sidebar
 */
function closeSidebar() {
    elements.sidebar.classList.remove('show');
    elements.sidebarOverlay.classList.remove('show');
    elements.sidebarToggler.setAttribute('aria-expanded', 'false');
    
    // Return focus to toggle button
    elements.sidebarToggler.focus();
}

/**
 * Trap focus within element
 */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
        
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });
}

// ================== SEARCH FUNCTIONALITY ================== //

/**
 * Search customers
 */
function searchCustomers(query) {
    if (!query.trim()) {
        filteredCustomers = [...customers];
    } else {
        const searchTerm = query.toLowerCase().trim();
        filteredCustomers = customers.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.phone.includes(searchTerm) ||
            customer.service.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    renderTable();
    updatePagination();
}

// ================== TABLE FUNCTIONALITY ================== //

/**
 * Render customers table
 */
function renderTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    if (pageCustomers.length === 0) {
        renderEmptyState();
        return;
    }
    
    const tableHTML = pageCustomers.map(customer => `
        <tr class="customer-row" data-customer-id="${customer.id}">
            <td data-label="الصورة">
                <div class="customer-avatar">
                    <img src="${customer.avatar}" 
                         alt="صورة ${sanitizeHTML(customer.name)}" 
                         onerror="this.src='../assets/images/default-avatar.png'">
                </div>
            </td>
            <td data-label="الحالة">
                <span class="status-badge status-${customer.status}">
                    ${getStatusText(customer.status)}
                </span>
            </td>
            <td data-label="اسم المستخدم" class="customer-name">
                ${sanitizeHTML(customer.name)}
            </td>
            <td data-label="البريد الإلكتروني" class="customer-email">
                ${sanitizeHTML(customer.email)}
            </td>
            <td data-label="نوع الخدمة" class="customer-service">
                ${sanitizeHTML(customer.service)}
            </td>
            <td data-label="الإجراءات">
                <div class="action-buttons">
                    <button class="btn-action btn-edit" 
                            type="button"
                            title="تعديل ${sanitizeHTML(customer.name)}"
                            aria-label="تعديل ${sanitizeHTML(customer.name)}"
                            onclick="editCustomer(${customer.id})">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                    </button>
                    <button class="btn-action btn-delete" 
                            type="button"
                            title="حذف ${sanitizeHTML(customer.name)}"
                            aria-label="حذف ${sanitizeHTML(customer.name)}"
                            onclick="deleteCustomer(${customer.id})">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    elements.customersTableBody.innerHTML = tableHTML;
    
    // Add row click handlers
    const rows = elements.customersTableBody.querySelectorAll('.customer-row');
    rows.forEach(row => {
        row.addEventListener('click', (e) => {
            if (!e.target.closest('.action-buttons')) {
                const customerId = parseInt(row.dataset.customerId);
                viewCustomerDetails(customerId);
            }
        });
        
        // Add keyboard navigation
        row.setAttribute('tabindex', '0');
        row.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!e.target.closest('.action-buttons')) {
                    const customerId = parseInt(row.dataset.customerId);
                    viewCustomerDetails(customerId);
                }
            }
        });
    });
    
    updatePaginationInfo();
}

/**
 * Render empty state
 */
function renderEmptyState() {
    elements.customersTableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-5">
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-users" aria-hidden="true"></i>
                    </div>
                    <h3 class="empty-state-title">لا توجد عملاء</h3>
                    <p class="empty-state-message">
                        ${Object.keys(currentFilters).length > 0 || elements.searchInput?.value 
                            ? 'لم يتم العثور على عملاء مطابقين لمعايير البحث'
                            : 'لم يتم إضافة أي عملاء بعد'}
                    </p>
                    <button class="empty-state-action" onclick="clearFiltersAndSearch()">
                        <i class="fas fa-plus me-2" aria-hidden="true"></i>
                        إضافة عميل جديد
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Get status text in Arabic
 */
function getStatusText(status) {
    const statusMap = {
        active: 'نشط',
        inactive: 'غير نشط',
        pending: 'معلق'
    };
    return statusMap[status] || status;
}

/**
 * Update pagination info
 */
function updatePaginationInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredCustomers.length);
    const total = filteredCustomers.length;
    
    elements.paginationInfo.textContent = `عرض ${startIndex} إلى ${endIndex} من ${total} عنصر`;
}

/**
 * Update pagination controls
 */
function updatePagination() {
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" 
               href="#" 
               onclick="changePage(${currentPage - 1})"
               aria-label="الصفحة السابقة"
               ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(1)">1</a>
            </li>
        `;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" 
                   href="#" 
                   onclick="changePage(${i})"
                   ${i === currentPage ? 'aria-current="page"' : ''}>${i}</a>
            </li>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a>
            </li>
        `;
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" 
               href="#" 
               onclick="changePage(${currentPage + 1})"
               aria-label="الصفحة التالية"
               ${currentPage === totalPages ? 'tabindex="-1" aria-disabled="true"' : ''}>
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
    
    elements.pagination.innerHTML = paginationHTML;
}

/**
 * Change page
 */
function changePage(page) {
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    
    if (page < 1 || page > totalPages) {
        return;
    }
    
    currentPage = page;
    renderTable();
    updatePagination();
    
    // Scroll to top of table
    elements.customersTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Change items per page
 */
function changeItemsPerPage(newItemsPerPage) {
    itemsPerPage = parseInt(newItemsPerPage);
    currentPage = 1;
    renderTable();
    updatePagination();
}

// ================== CUSTOMER MANAGEMENT ================== //

/**
 * Add new customer
 */
function addCustomer(customerData) {
    const newCustomer = {
        id: generateId(),
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone || '',
        status: customerData.status || 'active',
        service: customerData.service || 'محدود خدمة العملاء',
        avatar: customerData.avatar || '../assets/images/default-avatar.png',
        joinDate: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0]
    };
    
    customers.unshift(newCustomer);
    applyFilters();
    showNotification('تم إضافة العميل بنجاح', 'success');
    
    // Update stats
    updateStats();
}

/**
 * Edit customer
 */
function editCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        showNotification('لم يتم العثور على العميل', 'error');
        return;
    }
    
    // Populate form with customer data
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerStatus').value = customer.status;
    document.getElementById('customerService').value = customer.service;
    
    // Store customer ID for update
    elements.addCustomerForm.dataset.editingId = customerId;
    
    // Change modal title
    document.getElementById('addCustomerModalLabel').textContent = 'تعديل العميل';
    elements.saveCustomerBtn.innerHTML = '<span class="btn-text">حفظ التعديلات</span><span class="btn-spinner d-none"><i class="fas fa-spinner fa-spin"></i></span>';
    
    // Show modal
    const modal = new bootstrap.Modal(elements.addCustomerModal);
    modal.show();
}

/**
 * Delete customer
 */
function deleteCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        showNotification('لم يتم العثور على العميل', 'error');
        return;
    }
    
    if (confirm(`هل أنت متأكد من حذف العميل "${customer.name}"؟`)) {
        customers = customers.filter(c => c.id !== customerId);
        applyFilters();
        showNotification('تم حذف العميل بنجاح', 'success');
        
        // Update stats
        updateStats();
    }
}

/**
 * View customer details
 */
function viewCustomerDetails(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        showNotification('لم يتم العثور على العميل', 'error');
        return;
    }
    
    // Create and show customer details modal
    const detailsHTML = `
        <div class="modal fade" id="customerDetailsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">تفاصيل العميل</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4 text-center mb-3">
                                <img src="${customer.avatar}" 
                                     alt="صورة ${customer.name}" 
                                     class="rounded-circle mb-3"
                                     style="width: 120px; height: 120px; object-fit: cover;">
                                <h4>${customer.name}</h4>
                                <span class="status-badge status-${customer.status}">
                                    ${getStatusText(customer.status)}
                                </span>
                            </div>
                            <div class="col-md-8">
                                <div class="row mb-3">
                                    <div class="col-sm-4"><strong>البريد الإلكتروني:</strong></div>
                                    <div class="col-sm-8">${customer.email}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-4"><strong>رقم الهاتف:</strong></div>
                                    <div class="col-sm-8">${customer.phone || 'غير محدد'}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-4"><strong>نوع الخدمة:</strong></div>
                                    <div class="col-sm-8">${customer.service}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-4"><strong>تاريخ الانضمام:</strong></div>
                                    <div class="col-sm-8">${formatDate(customer.joinDate)}</div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-sm-4"><strong>آخر نشاط:</strong></div>
                                    <div class="col-sm-8">${formatDate(customer.lastActivity)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
                        <button type="button" class="btn btn-primary" onclick="editCustomer(${customer.id}); bootstrap.Modal.getInstance(document.getElementById('customerDetailsModal')).hide();">تعديل</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing details modal
    const existingModal = document.getElementById('customerDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', detailsHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('customerDetailsModal'));
    modal.show();
    
    // Remove modal from DOM when hidden
    document.getElementById('customerDetailsModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// ================== FILTER FUNCTIONALITY ================== //

/**
 * Apply filters
 */
function applyFilters() {
    filteredCustomers = customers.filter(customer => {
        // Search filter
        const searchQuery = elements.searchInput?.value?.toLowerCase().trim() || '';
        const matchesSearch = !searchQuery || 
            customer.name.toLowerCase().includes(searchQuery) ||
            customer.email.toLowerCase().includes(searchQuery) ||
            customer.phone.includes(searchQuery) ||
            customer.service.toLowerCase().includes(searchQuery);
        
        // Status filter
        const statusFilter = currentFilters.status;
        const matchesStatus = !statusFilter || customer.status === statusFilter;
        
        // Service filter
        const serviceFilter = currentFilters.service?.toLowerCase().trim();
        const matchesService = !serviceFilter || 
            customer.service.toLowerCase().includes(serviceFilter);
        
        // Date filters
        const dateFromFilter = currentFilters.dateFrom;
        const dateToFilter = currentFilters.dateTo;
        const customerDate = new Date(customer.joinDate);
        
        const matchesDateFrom = !dateFromFilter || customerDate >= new Date(dateFromFilter);
        const matchesDateTo = !dateToFilter || customerDate <= new Date(dateToFilter);
        
        return matchesSearch && matchesStatus && matchesService && matchesDateFrom && matchesDateTo;
    });
    
    currentPage = 1;
    renderTable();
    updatePagination();
}

/**
 * Clear filters and search
 */
function clearFiltersAndSearch() {
    // Clear search
    if (elements.searchInput) {
        elements.searchInput.value = '';
    }
    
    // Clear filters
    currentFilters = {};
    
    // Reset filter form
    if (elements.filterForm) {
        elements.filterForm.reset();
    }
    
    // Apply filters
    applyFilters();
    
    showNotification('تم مسح جميع المرشحات', 'info');
}

// ================== FORM VALIDATION ================== //

/**
 * Validate customer form
 */
function validateCustomerForm(formData) {
    const errors = [];
    
    // Name validation
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('اسم العميل يجب أن يكون على الأقل حرفين');
    }
    
    // Email validation
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('يرجى إدخال بريد إلكتروني صحيح');
    }
    
    // Check for duplicate email (excluding current customer if editing)
    const editingId = elements.addCustomerForm.dataset.editingId;
    const existingCustomer = customers.find(c => 
        c.email.toLowerCase() === formData.email.toLowerCase() && 
        c.id.toString() !== editingId
    );
    
    if (existingCustomer) {
        errors.push('البريد الإلكتروني مستخدم بالفعل');
    }
    
    // Phone validation (optional)
    if (formData.phone && !isValidPhone(formData.phone)) {
        errors.push('رقم الهاتف غير صحيح (يجب أن يكون رقم سعودي)');
    }
    
    return errors;
}

/**
 * Show form validation errors
 */
function showFormErrors(errors) {
    // Clear previous errors
    const errorElements = elements.addCustomerForm.querySelectorAll('.invalid-feedback');
    errorElements.forEach(el => el.style.display = 'none');
    
    const inputs = elements.addCustomerForm.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('is-invalid'));
    
    // Show new errors
    errors.forEach(error => {
        if (error.includes('اسم')) {
            const nameInput = document.getElementById('customerName');
            nameInput.classList.add('is-invalid');
            nameInput.nextElementSibling.textContent = error;
            nameInput.nextElementSibling.style.display = 'block';
        } else if (error.includes('بريد')) {
            const emailInput = document.getElementById('customerEmail');
            emailInput.classList.add('is-invalid');
            emailInput.nextElementSibling.textContent = error;
            emailInput.nextElementSibling.style.display = 'block';
        } else if (error.includes('هاتف')) {
            const phoneInput = document.getElementById('customerPhone');
            phoneInput.classList.add('is-invalid');
            // Add invalid feedback element if it doesn't exist
            let feedback = phoneInput.nextElementSibling;
            if (!feedback || !feedback.classList.contains('invalid-feedback')) {
                feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                phoneInput.parentNode.appendChild(feedback);
            }
            feedback.textContent = error;
            feedback.style.display = 'block';
        }
    });
}

// ================== STATS UPDATE ================== //

/**
 * Update dashboard stats
 */
function updateStats() {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const premiumCustomers = customers.filter(c => c.service.includes('متميز')).length;
    const recentCustomers = customers.filter(c => {
        const joinDate = new Date(c.joinDate);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return joinDate >= weekAgo;
    }).length;
    
    // Update stat cards
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = totalCustomers;
        statNumbers[1].textContent = activeCustomers;
        statNumbers[2].textContent = premiumCustomers;
        statNumbers[3].textContent = recentCustomers;
    }
}

// ================== EVENT HANDLERS ================== //

/**
 * Handle logout
 */
function handleLogout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        showLoading();
        
        // Simulate logout process
        setTimeout(() => {
            hideLoading();
            showNotification('تم تسجيل الخروج بنجاح', 'success');
            // Redirect to login page
            // window.location.href = '/login.html';
        }, 1000);
    }
}

// ================== INITIALIZATION ================== //

/**
 * Initialize the application
 */
function initializeApp() {
    // Load sample data
    customers = [...sampleCustomers];
    filteredCustomers = [...customers];
    
    // Render initial table
    renderTable();
    updatePagination();
    updateStats();
    
    // Setup event listeners
    setupEventListeners();
    
    // Hide loading overlay
    hideLoading();
    
    // showNotification('تم تحميل لوحة التحكم بنجاح', 'success', 3000);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Sidebar toggle
    if (elements.sidebarToggler) {
        elements.sidebarToggler.addEventListener('click', toggleSidebar);
    }
    
    // Sidebar overlay
    if (elements.sidebarOverlay) {
        elements.sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Search functionality
    if (elements.searchInput) {
        const debouncedSearch = debounce((e) => {
            searchCustomers(e.target.value);
        }, 300);
        
        elements.searchInput.addEventListener('input', debouncedSearch);
        elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.target.value = '';
                searchCustomers('');
            }
        });
    }
    
    // Items per page
    if (elements.entriesSelect) {
        elements.entriesSelect.addEventListener('change', (e) => {
            changeItemsPerPage(e.target.value);
        });
    }
    
    // Filter button
    if (elements.filterBtn) {
        elements.filterBtn.addEventListener('click', () => {
            const modal = new bootstrap.Modal(elements.filterModal);
            modal.show();
        });
    }
    
    // Add customer button
    if (elements.addCustomerBtn) {
        elements.addCustomerBtn.addEventListener('click', () => {
            // Reset form
            elements.addCustomerForm.reset();
            delete elements.addCustomerForm.dataset.editingId;
            
            // Reset modal title
            document.getElementById('addCustomerModalLabel').textContent = 'اضافة عميل جديد';
            elements.saveCustomerBtn.innerHTML = '<span class="btn-text">حفظ العميل</span><span class="btn-spinner d-none"><i class="fas fa-spinner fa-spin"></i></span>';
            
            // Clear validation errors
            const inputs = elements.addCustomerForm.querySelectorAll('.form-control');
            inputs.forEach(input => input.classList.remove('is-invalid', 'is-valid'));
            
            const feedbacks = elements.addCustomerForm.querySelectorAll('.invalid-feedback');
            feedbacks.forEach(feedback => feedback.style.display = 'none');
            
            // Show modal
            const modal = new bootstrap.Modal(elements.addCustomerModal);
            modal.show();
        });
    }
    
    // Save customer button
    if (elements.saveCustomerBtn) {
        elements.saveCustomerBtn.addEventListener('click', async () => {
            const formData = new FormData(elements.addCustomerForm);
            const customerData = {
                name: formData.get('customerName')?.trim(),
                email: formData.get('customerEmail')?.trim(),
                phone: formData.get('customerPhone')?.trim(),
                status: formData.get('customerStatus'),
                service: formData.get('customerService')?.trim()
            };
            
            // Validate form
            const errors = validateCustomerForm(customerData);
            if (errors.length > 0) {
                showFormErrors(errors);
                return;
            }
            
            // Show loading state
            elements.saveCustomerBtn.classList.add('loading');
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const editingId = elements.addCustomerForm.dataset.editingId;
                
                if (editingId) {
                    // Update existing customer
                    const customerIndex = customers.findIndex(c => c.id.toString() === editingId);
                    if (customerIndex !== -1) {
                        customers[customerIndex] = {
                            ...customers[customerIndex],
                            ...customerData,
                            lastActivity: new Date().toISOString().split('T')[0]
                        };
                        showNotification('تم تحديث العميل بنجاح', 'success');
                    }
                } else {
                    // Add new customer
                    addCustomer(customerData);
                }
                
                // Hide modal
                const modal = bootstrap.Modal.getInstance(elements.addCustomerModal);
                modal.hide();
                
                // Refresh table
                applyFilters();
                
            } catch (error) {
                showNotification('حدث خطأ أثناء حفظ العميل', 'error');
            } finally {
                // Hide loading state
                elements.saveCustomerBtn.classList.remove('loading');
            }
        });
    }
    
    // Apply filter button
    if (elements.applyFilterBtn) {
        elements.applyFilterBtn.addEventListener('click', () => {
            const formData = new FormData(elements.filterForm);
            
            currentFilters = {
                status: formData.get('filterStatus') || '',
                service: formData.get('filterService') || '',
                dateFrom: formData.get('filterDateFrom') || '',
                dateTo: formData.get('filterDateTo') || ''
            };
            
            applyFilters();
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(elements.filterModal);
            modal.hide();
            
            showNotification('تم تطبيق المرشحات', 'info');
        });
    }
    
    // Clear filter button
    if (elements.clearFilterBtn) {
        elements.clearFilterBtn.addEventListener('click', () => {
            clearFiltersAndSearch();
            
            // Hide modal
            const modal = bootstrap.Modal.getInstance(elements.filterModal);
            modal.hide();
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (elements.searchInput) {
                elements.searchInput.focus();
            }
        }
        
        // Ctrl/Cmd + N for new customer
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            if (elements.addCustomerBtn) {
                elements.addCustomerBtn.click();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        // Close sidebar on desktop
        if (window.innerWidth >= 992) {
            closeSidebar();
        }
    }, 250));
    
    // Handle form submission
    if (elements.addCustomerForm) {
        elements.addCustomerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            elements.saveCustomerBtn.click();
        });
    }
    
    if (elements.filterForm) {
        elements.filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            elements.applyFilterBtn.click();
        });
    }
    
    // Real-time form validation
    const formInputs = elements.addCustomerForm?.querySelectorAll('.form-control');
    formInputs?.forEach(input => {
        input.addEventListener('blur', () => {
            validateSingleField(input);
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validateSingleField(input);
            }
        });
    });
}

/**
 * Validate single form field
 */
function validateSingleField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (input.id) {
        case 'customerName':
            if (!value || value.length < 2) {
                isValid = false;
                errorMessage = 'اسم العميل يجب أن يكون على الأقل حرفين';
            }
            break;
            
        case 'customerEmail':
            if (!value || !isValidEmail(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
            } else {
                // Check for duplicate
                const editingId = elements.addCustomerForm.dataset.editingId;
                const existingCustomer = customers.find(c => 
                    c.email.toLowerCase() === value.toLowerCase() && 
                    c.id.toString() !== editingId
                );
                
                if (existingCustomer) {
                    isValid = false;
                    errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                }
            }
            break;
            
        case 'customerPhone':
            if (value && !isValidPhone(value)) {
                isValid = false;
                errorMessage = 'رقم الهاتف غير صحيح (يجب أن يكون رقم سعودي)';
            }
            break;
    }
    
    // Update field validation state
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.style.display = 'none';
        }
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        let feedback = input.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.parentNode.appendChild(feedback);
        }
        feedback.textContent = errorMessage;
        feedback.style.display = 'block';
    }
    
    return isValid;
}

// ================== GLOBAL FUNCTIONS ================== //
// Make functions available globally for onclick handlers
window.changePage = changePage;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.clearFiltersAndSearch = clearFiltersAndSearch;
window.handleLogout = handleLogout;

// ================== APP STARTUP ================== //

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Refresh data when page becomes visible
        updateStats();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    showNotification('تم استعادة الاتصال بالإنترنت', 'success');
});

window.addEventListener('offline', () => {
    showNotification('تم فقدان الاتصال بالإنترنت', 'warning');
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        if (loadTime > 3000) {
            console.warn('Page load time is slow');
        }
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    showNotification('حدث خطأ غير متوقع', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('حدث خطأ في معالجة البيانات', 'error');
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        customers,
        addCustomer,
        editCustomer,
        deleteCustomer,
        searchCustomers,
        applyFilters,
        validateCustomerForm,
        isValidEmail,
        isValidPhone
    };
}

