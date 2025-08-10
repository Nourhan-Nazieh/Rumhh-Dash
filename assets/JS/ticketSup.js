// Support Tickets JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the support tickets system
    initializeSupportTickets();
});

function initializeSupportTickets() {
    // Tab switching functionality
    initializeTabs();
    
    // Form handling
    initializeTicketForm();
    
    // Table actions
    initializeTableActions();
    
    // Pagination
    initializePagination();
    
    // Sidebar toggle for mobile
    initializeSidebar();
    
    // Search functionality
    initializeSearch();
}

// Tab Switching
function initializeTabs() {
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabItems.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Ticket Form Handling
function initializeTicketForm() {
    const ticketForm = document.querySelector('.ticket-form');
    
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const ticketData = {
                number: document.getElementById('ticket-number').value,
                subject: document.getElementById('support-subject').value,
                department: document.getElementById('support-department').value,
                description: document.getElementById('problem-description').value
            };
            
            // Validate form
            if (validateTicketForm(ticketData)) {
                submitTicket(ticketData);
            }
        });
        
        // Real-time validation
        const formInputs = ticketForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Form Validation
function validateTicketForm(data) {
    let isValid = true;
    const errors = {};
    
    // Validate ticket number
    if (!data.number || data.number.trim() === '') {
        errors.ticketNumber = 'رقم التذكرة مطلوب';
        isValid = false;
    }
    
    // Validate subject
    if (!data.subject || data.subject.trim() === '') {
        errors.subject = 'موضوع الدعم مطلوب';
        isValid = false;
    }
    
    // Validate department
    if (!data.department || data.department === '') {
        errors.department = 'يجب اختيار قسم الدعم';
        isValid = false;
    }
    
    // Validate description
    if (!data.description || data.description.trim() === '') {
        errors.description = 'وصف المشكلة مطلوب';
        isValid = false;
    } else if (data.description.trim().length < 10) {
        errors.description = 'وصف المشكلة يجب أن يكون أكثر من 10 أحرف';
        isValid = false;
    }
    
    // Display errors
    if (!isValid) {
        displayFormErrors(errors);
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (field.id) {
        case 'ticket-number':
            if (!value) {
                errorMessage = 'رقم التذكرة مطلوب';
                isValid = false;
            }
            break;
        case 'support-subject':
            if (!value) {
                errorMessage = 'موضوع الدعم مطلوب';
                isValid = false;
            }
            break;
        case 'support-department':
            if (!value) {
                errorMessage = 'يجب اختيار قسم الدعم';
                isValid = false;
            }
            break;
        case 'problem-description':
            if (!value) {
                errorMessage = 'وصف المشكلة مطلوب';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'وصف المشكلة يجب أن يكون أكثر من 10 أحرف';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('.form-control').forEach(field => field.classList.remove('error'));
    
    // Show new errors
    Object.keys(errors).forEach(fieldName => {
        let fieldId = '';
        switch (fieldName) {
            case 'ticketNumber':
                fieldId = 'ticket-number';
                break;
            case 'subject':
                fieldId = 'support-subject';
                break;
            case 'department':
                fieldId = 'support-department';
                break;
            case 'description':
                fieldId = 'problem-description';
                break;
        }
        
        const field = document.getElementById(fieldId);
        if (field) {
            showFieldError(field, errors[fieldName]);
        }
    });
}

// Submit Ticket
function submitTicket(ticketData) {
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'جاري الإرسال...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Show success message
        showNotification('تم إضافة التذكرة بنجاح!', 'success');
        
        // Reset form
        document.querySelector('.ticket-form').reset();
        
        // Add new ticket to table (simulation)
        addTicketToTable(ticketData);
        
    }, 2000);
}

// Add ticket to table
function addTicketToTable(ticketData) {
    const tableBody = document.querySelector('.tickets-table tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>
            <div class="ticket-info">
                <span class="ticket-number">${ticketData.number}</span>
                <span class="ticket-type">${ticketData.subject}</span>
            </div>
        </td>
        <td>
            <span class="status-badge status-active">نشط الان</span>
        </td>
        <td>${new Date().toLocaleDateString('ar-EG')}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-action btn-edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    // Add animation
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(20px)';
    tableBody.insertBefore(newRow, tableBody.firstChild);
    
    // Animate in
    setTimeout(() => {
        newRow.style.transition = 'all 0.3s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 100);
    
    // Re-initialize table actions for new row
    initializeTableActions();
}

// Table Actions
function initializeTableActions() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            editTicket(row);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            deleteTicket(row);
        });
    });
}

function editTicket(row) {
    const ticketNumber = row.querySelector('.ticket-number').textContent;
    showNotification(`تعديل التذكرة رقم ${ticketNumber}`, 'info');
    
    // Here you would typically open an edit modal or navigate to edit page
    console.log('Edit ticket:', ticketNumber);
}

function deleteTicket(row) {
    const ticketNumber = row.querySelector('.ticket-number').textContent;
    
    if (confirm(`هل أنت متأكد من حذف التذكرة رقم ${ticketNumber}؟`)) {
        // Add delete animation
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(100px)';
        
        setTimeout(() => {
            row.remove();
            showNotification('تم حذف التذكرة بنجاح', 'success');
        }, 300);
    }
}
// Pagination
function initializePagination() {
    const pageButtons = document.querySelectorAll('.page-btn');
    
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('page-prev')) {
                navigatePage('prev');
            } else if (this.classList.contains('page-next')) {
                navigatePage('next');
            } else if (!this.classList.contains('page-active')) {
                const pageNumber = this.textContent;
                navigatePage(pageNumber);
            }
        });
    });
}

// function navigatePage(page) {
//     // Remove active class from all page buttons
//     document.querySelectorAll('.page-btn').forEach(btn => {
//         btn.classList.remove('page-active');
//     });
    
//     // Add loading state to table
//     const tableContainer = document.querySelector('.tickets-table-container');
//     tableContainer.classList.add('loading');
    
//     // Simulate page loading
//     setTimeout(() => {
//         tableContainer.classList.remove('loading');
        
//         if (page !== 'prev' && page !== 'next') {
//             // Find and activate the clicked page button
//             const targetBtn = Array.from(document.querySelectorAll('.page-btn')).find(btn => 
//                 btn.textContent === page && !btn.classList.contains('page-prev') && !btn.classList.contains('page-next')
//             );
//             if (targetBtn) {
//                 targetBtn.classList.add('page-active');
//             }
//         }
        
//         showNotification(`تم الانتقال إلى الصفحة ${page}`, 'info');
//     }, 500);
// }

// // Sidebar Toggle
// function initializeSidebar() {
//     const sidebarToggle = document.querySelector('.sidebar-toggle');
//     const sidebar = document.querySelector('.sidebar');
    
//     if (sidebarToggle && sidebar) {
//         sidebarToggle.addEventListener('click', function() {
//             sidebar.classList.toggle('open');
//         });
        
//         // Close sidebar when clicking outside on mobile
//         document.addEventListener('click', function(e) {
//             if (window.innerWidth <= 992) {
//                 if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
//                     sidebar.classList.remove('open');
//                 }
//             }
//         });
//     }
// }

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            searchTimeout = setTimeout(() => {
                if (query.length > 0) {
                    performSearch(query);
                } else {
                    clearSearch();
                }
            }, 300);
        });
    }
}

function performSearch(query) {
    const tableRows = document.querySelectorAll('.tickets-table tbody tr');
    let visibleCount = 0;
    
    tableRows.forEach(row => {
        const ticketNumber = row.querySelector('.ticket-number').textContent.toLowerCase();
        const ticketType = row.querySelector('.ticket-type').textContent.toLowerCase();
        const searchQuery = query.toLowerCase();
        
        if (ticketNumber.includes(searchQuery) || ticketType.includes(searchQuery)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show search results count
    showNotification(`تم العثور على ${visibleCount} نتيجة`, 'info');
}

function clearSearch() {
    const tableRows = document.querySelectorAll('.tickets-table tbody tr');
    tableRows.forEach(row => {
        row.style.display = '';
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#212529';
            break;
        default:
            notification.style.backgroundColor = '#17a2b8';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

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

// Auto-save form data
function initializeAutoSave() {
    const form = document.querySelector('.ticket-form');
    if (form) {
        const inputs = form.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                saveFormData();
            }, 500));
        });
    }
}