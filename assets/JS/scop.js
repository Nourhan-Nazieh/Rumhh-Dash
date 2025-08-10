// ================== GLOBAL VARIABLES ==================
let currentTab = 'hosting';

// ================== DOM ELEMENTS ==================
const sidebarToggler = document.getElementById('sidebar-toggler');
const sidebar = document.getElementById('sidebar');
const headerTabs = document.querySelectorAll('.header-tab');
const upgradeButtons = document.querySelectorAll('.btn-upgrade');
const activeButtons = document.querySelectorAll('.btn-active');

// ================== INITIALIZATION ==================
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeHostingCards();
});

// ================== EVENT LISTENERS ==================
function initializeEventListeners() {
    // Sidebar toggle for mobile
    if (sidebarToggler) {
        sidebarToggler.addEventListener('click', toggleSidebar);
    }

    // Header tabs
    headerTabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });

    // Upgrade buttons
    upgradeButtons.forEach(button => {
        button.addEventListener('click', handleUpgradeClick);
    });

    // Active buttons
    activeButtons.forEach(button => {
        button.addEventListener('click', handleActiveClick);
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 991) {
            if (!sidebar.contains(e.target) && !sidebarToggler.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', handleWindowResize);
}

// ================== SIDEBAR FUNCTIONS ==================
function toggleSidebar() {
    sidebar.classList.toggle('show');
}

function handleWindowResize() {
    if (window.innerWidth > 991) {
        sidebar.classList.remove('show');
    }
}

// ================== TAB FUNCTIONS ==================
function handleTabClick(e) {
    const clickedTab = e.target.closest('.header-tab');
    const tabType = clickedTab.getAttribute('data-tab');
    
    // Update active tab
    headerTabs.forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');
    
    // Update current tab
    currentTab = tabType;
    
    // Show notification (optional)
    showNotification(`تم التبديل إلى قسم ${tabType === 'domains' ? 'المجالات' : 'المواقع الإلكترونية'}`, 'info');
}

// ================== HOSTING CARD FUNCTIONS ==================
function initializeHostingCards() {
    // Add hover effects and animations
    const hostingCards = document.querySelectorAll('.hosting-card');
    
    hostingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function handleUpgradeClick(e) {
    const button = e.target.closest('.btn-upgrade');
    const hostingId = button.getAttribute('data-hosting');
    const currentText = button.textContent.trim();
    
    if (currentText === 'ايقاف') {
        // Change to activate
        button.innerHTML = '<i class="fas fa-play"></i> تشغيل';
        button.classList.remove('btn-outline');
        button.classList.add('btn-success');
        
        // Update the active button
        const activeButton = button.parentElement.querySelector('.btn-active');
        activeButton.innerHTML = '<i class="fas fa-pause"></i> متوقفة';
        activeButton.classList.remove('btn-danger');
        activeButton.classList.add('btn-outline');
        
        showNotification('تم إيقاف الاستضافة بنجاح', 'warning');
        
    } else if (currentText === 'تشغيل') {
        // Change to deactivate
        button.innerHTML = '<i class="fas fa-info-circle"></i> ايقاف';
        button.classList.remove('btn-danger');
        button.classList.add('btn-outline');
        
        // Update the active button
        const activeButton = button.parentElement.querySelector('.btn-active');
        activeButton.innerHTML = '<i class="fas fa-check"></i> نشطة';
        activeButton.classList.remove('btn-outline');
        activeButton.classList.add('btn-success');
        
        showNotification('تم تشغيل الاستضافة بنجاح', 'success');
    }
}

function handleActiveClick(e) {
    const button = e.target.closest('.btn-active');
    const currentText = button.textContent.trim();
    
    if (currentText === 'نشطة') {
        showNotification('الاستضافة نشطة حالياً', 'info');
    } else if (currentText === 'متوقفة') {
        showNotification('الاستضافة متوقفة حالياً', 'warning');
    }
}

// ================== NOTIFICATION FUNCTIONS ==================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ================== UTILITY FUNCTIONS ==================
function animateButton(button, duration = 200) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, duration);
}

// Add click animation to all buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn')) {
        const button = e.target.closest('.btn');
        animateButton(button);
    }
});

// ================== KEYBOARD SHORTCUTS ==================
document.addEventListener('keydown', function(e) {
    // Alt + D for Domains tab
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        const domainsTab = document.querySelector('[data-tab="domains"]');
        if (domainsTab) {
            domainsTab.click();
        }
    }
    
    // Alt + H for Hosting tab
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        const hostingTab = document.querySelector('[data-tab="hosting"]');
        if (hostingTab) {
            hostingTab.click();
        }
    }
    
    // Escape to close sidebar on mobile
    if (e.key === 'Escape' && window.innerWidth <= 991) {
        sidebar.classList.remove('show');
    }
});

