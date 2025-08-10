// Tax and Delivery Page JavaScript

// Sample data for shipping and tax
const shippingData = [
    { id: 1, name: 'منطقة القاهرة', country: 'مصر', area: 'القاهرة' },
    { id: 2, name: 'منطقة الجيزة', country: 'مصر', area: 'الجيزة' },
    { id: 3, name: 'منطقة الإسكندرية', country: 'مصر', area: 'الإسكندرية' }
];

const taxData = [
    { id: 1, name: 'ضريبة القيمة المضافة', country: 'مصر', rate: 14 },
    { id: 2, name: 'ضريبة الخدمات', country: 'مصر', rate: 10 },
    { id: 3, name: 'ضريبة التوصيل', country: 'السعودية', rate: 5 }
];

// Current active section
let currentSection = 'shipping';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeTaxDeliveryPage();
    setupEventListeners();
    populateShippingTable();
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
    // Section tabs functionality
    const shippingTab = document.getElementById('shippingTab');
    const taxTab = document.getElementById('taxTab');
    
    if (shippingTab && taxTab) {
        shippingTab.addEventListener('click', function() {
            switchToSection('shipping');
        });
        
        taxTab.addEventListener('click', function() {
            switchToSection('tax');
        });
    }

    // Form submissions
    const shippingForm = document.getElementById('shippingForm');
    const taxForm = document.getElementById('taxForm');
    
    if (shippingForm) {
        shippingForm.addEventListener('submit', handleShippingFormSubmission);
    }
    
    if (taxForm) {
        taxForm.addEventListener('submit', handleTaxFormSubmission);
    }

    // Delete and edit buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-outline-danger')) {
            handleDeleteAction(e);
        }
        
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

// Switch between sections
function switchToSection(section) {
    const shippingTab = document.getElementById('shippingTab');
    const taxTab = document.getElementById('taxTab');
    const shippingContent = document.getElementById('shippingContent');
    const taxContent = document.getElementById('taxContent');
    
    // Update tabs
    if (section === 'shipping') {
        shippingTab.classList.add('btn-success', 'active');
        shippingTab.classList.remove('btn-outline-success');
        taxTab.classList.add('btn-outline-success');
        taxTab.classList.remove('btn-success', 'active');
        
        // Show shipping content, hide tax content
        shippingContent.classList.remove('d-none');
        taxContent.classList.add('d-none');
        
        currentSection = 'shipping';
    } else {
        taxTab.classList.add('btn-success', 'active');
        taxTab.classList.remove('btn-outline-success');
        shippingTab.classList.add('btn-outline-success');
        shippingTab.classList.remove('btn-success', 'active');
        
        // Show tax content, hide shipping content
        taxContent.classList.remove('d-none');
        shippingContent.classList.add('d-none');
        
        currentSection = 'tax';
    }
    
    // Add animation effect
    const activeTab = section === 'shipping' ? shippingTab : taxTab;
    activeTab.style.transform = 'scale(1.05)';
    setTimeout(() => {
        activeTab.style.transform = 'scale(1)';
    }, 200);
}

// Handle shipping form submission
function handleShippingFormSubmission(e) {
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
        // Add new row to shipping table
        const newShippingItem = {
            id: shippingData.length + 1,
            name: shippingName,
            country: shippingCountry,
            area: shippingArea
        };
        
        shippingData.push(newShippingItem);
        populateShippingTable();
        
        // Reset form
        e.target.reset();
        
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('تم إضافة منطقة الشحن بنجاح!', 'success');
        
        // Add animation to new row
        const newRow = document.querySelector('#shippingTable tbody tr:last-child');
        if (newRow) {
            newRow.style.animation = 'slideInUp 0.5s ease-out';
        }
    }, 1500);
}

// Handle tax form submission
function handleTaxFormSubmission(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Add loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Get form values
    const taxName = document.getElementById('taxName').value;
    const taxRate = document.getElementById('taxRate').value;
    
    // Validate form
    if (!taxName || !taxRate) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'danger');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        return;
    }
    
    if (taxRate < 0 || taxRate > 100) {
        showNotification('نسبة الضريبة يجب أن تكون بين 0 و 100', 'danger');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        // Add new tax item
        const newTaxItem = {
            id: taxData.length + 1,
            name: taxName,
            country: 'مصر', // Default country
            rate: parseFloat(taxRate)
        };
        
        taxData.push(newTaxItem);
        populateTaxTable();
        
        // Reset form
        e.target.reset();
        
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('تم إضافة الضريبة بنجاح!', 'success');
        
        // Add animation to new row
        const newRow = document.querySelector('#taxTable tbody tr:last-child');
        if (newRow) {
            newRow.style.animation = 'slideInUp 0.5s ease-out';
        }
    }, 1500);
}

// Handle delete action
function handleDeleteAction(e) {
    e.preventDefault();
    
    const row = e.target.closest('tr');
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    const isShippingTable = e.target.closest('#shippingTable');
    
    const itemType = isShippingTable ? 'منطقة الشحن' : 'الضريبة';
    
    // Show confirmation
    if (confirm(`هل أنت متأكد من حذف ${itemType}؟`)) {
        // Add fade-out animation
        row.style.animation = 'fadeOut 0.5s ease-out';
        
        setTimeout(() => {
            // Remove from data array
            if (isShippingTable) {
                shippingData.splice(rowIndex, 1);
                populateShippingTable();
            } else {
                taxData.splice(rowIndex, 1);
                populateTaxTable();
            }
            
            // Show success message
            showNotification(`تم حذف ${itemType} بنجاح!`, 'success');
        }, 500);
    }
}

// Handle edit action
function handleEditAction(e) {
    e.preventDefault();
    
    const row = e.target.closest('tr');
    const rowIndex = Array.from(row.parentNode.children).indexOf(row);
    const isShippingTable = e.target.closest('#shippingTable');
    
    if (isShippingTable) {
        const shippingItem = shippingData[rowIndex];
        
        // Fill shipping form with existing data
        document.getElementById('shippingName').value = shippingItem.name;
        document.getElementById('shippingCountry').value = shippingItem.country;
        document.getElementById('shippingArea').value = shippingItem.area;
        
        // Switch to shipping section if not already there
        if (currentSection !== 'shipping') {
            switchToSection('shipping');
        }
        
        // Remove item from array (will be re-added when form is submitted)
        shippingData.splice(rowIndex, 1);
        populateShippingTable();
        
        showNotification('تم تحميل بيانات منطقة الشحن للتعديل', 'info');
    } else {
        const taxItem = taxData[rowIndex];
        
        // Fill tax form with existing data
        document.getElementById('taxName').value = taxItem.name;
        document.getElementById('taxRate').value = taxItem.rate;
        
        // Switch to tax section if not already there
        if (currentSection !== 'tax') {
            switchToSection('tax');
        }
        
        // Remove item from array (will be re-added when form is submitted)
        taxData.splice(rowIndex, 1);
        populateTaxTable();
        
        showNotification('تم تحميل بيانات الضريبة للتعديل', 'info');
    }
    
    // Scroll to form
    const activeForm = currentSection === 'shipping' ? 
        document.getElementById('shippingForm') : 
        document.getElementById('taxForm');
    
    activeForm.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
    
    // Highlight form
    const formCard = activeForm.closest('.dashboard-card');
    formCard.style.boxShadow = '0 0 20px rgba(40, 167, 69, 0.3)';
    setTimeout(() => {
        formCard.style.boxShadow = '';
    }, 2000);
}

// Populate shipping table
function populateShippingTable() {
    const tableBody = document.querySelector('#shippingTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    shippingData.forEach((item, index) => {
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
            <td>${item.rate}</td>
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + S to save form
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const activeForm = currentSection === 'shipping' ? 
            document.getElementById('shippingForm') : 
            document.getElementById('taxForm');
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // ESC to close notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification-alert');
        notifications.forEach(notification => notification.remove());
    }
    
    // Tab switching with Alt + 1/2
    if (e.altKey && e.key === '1') {
        e.preventDefault();
        switchToSection('shipping');
    }
    
    if (e.altKey && e.key === '2') {
        e.preventDefault();
        switchToSection('tax');
    }
});

console.log('Tax and Delivery page JavaScript loaded successfully!');

