// Tax and Delivery Page JavaScript

// Sample data for the tax table
const taxData = [
    { id: 1, name: 'منطقة القاهرة', country: 'مصر', area: 'القاهرة' },
    { id: 2, name: 'منطقة الجيزة', country: 'مصر', area: 'الجيزة' },
    { id: 3, name: 'منطقة الإسكندرية', country: 'مصر', area: 'الإسكندرية' },
    { id: 4, name: 'منطقة الرياض', country: 'السعودية', area: 'الرياض' },
    { id: 5, name: 'منطقة جدة', country: 'السعودية', area: 'جدة' }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeTaxDeliveryPage();
    setupEventListeners();
    populateTaxTable();
    addAnimations();
});

// Initialize the tax and delivery page
function initializeTaxDeliveryPage() {
    console.log('Tax and Delivery page initialized');
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in');
    });
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    const shippingForm = document.querySelector('form');
    if (shippingForm) {
        shippingForm.addEventListener('submit', handleFormSubmission);
    }

    // Store tabs functionality
    const tab1 = document.getElementById('tab1');
    const tab2 = document.getElementById('tab2');
    
    if (tab1 && tab2) {
        tab1.addEventListener('click', function() {
            switchTab(tab1, tab2);
        });
        
        tab2.addEventListener('click', function() {
            switchTab(tab2, tab1);
        });
    }

    // Delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-outline-danger')) {
            handleDeleteAction(e);
        }
    });

    // Edit buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-outline-info')) {
            handleEditAction(e);
        }
    });

    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const formData = new FormData(e.target);
    
    // Add loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Get form values
    const shippingName = document.getElementById('shippingName').value;
    const shippingCountry = document.getElementById('shippingCountry').value;
    const shippingArea = document.getElementById('shippingArea').value;
    
    // Validate form
    if (!shippingName || !shippingCountry || !shippingArea) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'danger');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        // Add new row to table
        const newTaxItem = {
            id: taxData.length + 1,
            name: shippingName,
            country: shippingCountry,
            area: shippingArea
        };
        
        taxData.push(newTaxItem);
        populateTaxTable();
        
        // Reset form
        e.target.reset();
        
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('تم إضافة المنطقة بنجاح!', 'success');
        
        // Add animation to new row
        const newRow = document.querySelector('.table tbody tr:last-child');
        if (newRow) {
            newRow.style.animation = 'slideInUp 0.5s ease-out';
        }
    }, 1500);
}

// Switch between tabs
function switchTab(activeTab, inactiveTab) {
    activeTab.classList.add('btn-success');
    activeTab.classList.remove('btn-outline-success');
    inactiveTab.classList.add('btn-outline-success');
    inactiveTab.classList.remove('btn-success');
    
    // Add animation effect
    activeTab.style.transform = 'scale(1.05)';
    setTimeout(() => {
        activeTab.style.transform = 'scale(1)';
    }, 200);
}

// Handle delete action
function handleDeleteAction(e) {
    e.preventDefault();
    
    const row = e.target.closest('tr');
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    
    // Show confirmation
    if (confirm('هل أنت متأكد من حذف هذه المنطقة؟')) {
        // Add fade-out animation
        row.style.animation = 'fadeOut 0.5s ease-out';
        
        setTimeout(() => {
            // Remove from data array
            taxData.splice(rowIndex, 1);
            
            // Refresh table
            populateTaxTable();
            
            // Show success message
            showNotification('تم حذف المنطقة بنجاح!', 'success');
        }, 500);
    }
}

// Handle edit action
function handleEditAction(e) {
    e.preventDefault();
    
    const row = e.target.closest('tr');
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    const taxItem = taxData[rowIndex];
    
    // Fill form with existing data
    document.getElementById('shippingName').value = taxItem.name;
    document.getElementById('shippingCountry').value = taxItem.country;
    document.getElementById('shippingArea').value = taxItem.area;
    
    // Scroll to form
    document.querySelector('form').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
    
    // Highlight form
    const formCard = document.querySelector('form').closest('.dashboard-card');
    formCard.style.boxShadow = '0 0 20px rgba(40, 167, 69, 0.3)';
    setTimeout(() => {
        formCard.style.boxShadow = '';
    }, 2000);
    
    // Remove item from array (will be re-added when form is submitted)
    taxData.splice(rowIndex, 1);
    populateTaxTable();
    
    showNotification('تم تحميل البيانات للتعديل', 'info');
}

// Populate tax table
function populateTaxTable() {
    const tableBody = document.querySelector('#taxTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    taxData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.1}s`;
        row.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>${item.country}</td>
            <td>${item.area}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-outline-info" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add animations
function addAnimations() {
    // Animate form inputs on focus
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Animate buttons on hover
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Animate table rows on hover
    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
    });
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification-alert');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed notification-alert`;
    notification.style.cssText = `
        top: 20px;
        left: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        border-radius: 12px;
        animation: slideInLeft 0.5s ease-out;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutLeft 0.5s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 4000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutLeft {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Form validation
function validateForm() {
    const inputs = document.querySelectorAll('.form-control, .form-select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.style.borderColor = '#dc3545';
            input.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
            isValid = false;
            
            // Remove error styling on input
            input.addEventListener('input', function() {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }, { once: true });
        }
    });
    
    return isValid;
}

// Search functionality for table
function searchTable(searchTerm) {
    const rows = document.querySelectorAll('#taxTable tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
            row.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            row.style.display = 'none';
        }
    });
}

// Export table data
function exportTableData() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "الاسم,البلد,المنطقة\n"
        + taxData.map(item => `${item.name},${item.country},${item.area}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tax_delivery_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('تم تصدير البيانات بنجاح!', 'success');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + S to save form
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // ESC to close notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification-alert');
        notifications.forEach(notification => notification.remove());
    }
});

console.log('Tax and Delivery page JavaScript loaded successfully!');

