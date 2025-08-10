// ================== APP INITIALIZATION ==================
document.addEventListener('DOMContentLoaded', () => {
    const app = new DashboardApp();
    app.init();
});


// ================== MAIN DASHBOARD CLASS ==================
class DashboardApp {
    constructor() {
        // Store references to DOM elements to avoid repeated queries
        this.elements = {
            sidebar: document.getElementById('sidebar'),
            sidebarToggle: document.getElementById('sidebarToggle'),
            productsList: document.getElementById('productsList'),
            shippingCompanies: document.getElementById('shippingCompanies'),
            socialMedia: document.getElementById('socialMedia'),
            ordersTableBody: document.getElementById('ordersTableBody'),
            downloadBtn: document.querySelector('.download-btn'),
        };
        // Chart instances
        this.charts = {};
    }

    // --- INITIALIZATION ---
    init() {
        if (!this.elements.sidebar) {
            console.error('Dashboard essential elements not found. Aborting initialization.');
            return;
        }
        this.setupEventListeners();
        this.populateUI();
        this.initCharts();
        console.log('Dashboard initialized successfully!');
    }

    // --- EVENT LISTENERS ---
    setupEventListeners() {
        // Sidebar Toggle
        this.elements.sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.elements.sidebar.classList.toggle('show');
        });

        // Close sidebar on outside click
        document.addEventListener('click', (e) => {
            if (this.elements.sidebar.classList.contains('show') && !this.elements.sidebar.contains(e.target)) {
                this.elements.sidebar.classList.remove('show');
            }
        });
        
        // Download Button
        this.elements.downloadBtn.addEventListener('click', this.handleDownload.bind(this));
        
        // Responsive charts
        window.addEventListener('resize', () => this.updateAllCharts());
    }

    // --- UI POPULATION ---
    populateUI() {
        this.populateList(this.elements.productsList, dashboardData.products, this.createProductItemHTML);
        this.populateList(this.elements.shippingCompanies, dashboardData.shippingCompanies, this.createShippingCompanyHTML);
        this.populateList(this.elements.socialMedia, dashboardData.socialMedia, this.createSocialItemHTML);
        this.populateList(this.elements.ordersTableBody, dashboardData.ordersTable, this.createOrderRowHTML);
        this.animateProgressBars();
    }

    populateList(container, data, htmlFactory) {
        if (!container) return;
        container.innerHTML = data.map(htmlFactory).join('');
    }

    // --- HTML FACTORIES ---
    createProductItemHTML(product) {
        return `
            <div class="product-item">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-sales">${product.sales}</div>
                </div>
            </div>`;
    }

    createShippingCompanyHTML(company) {
        return `
            <div class="company-item">
                <div>
                    <div class="company-name">${company.name}</div>
                    <div class="company-orders">${company.orders} طلب • ${company.status}</div>
                </div>
                <div class="text-end">
                    <div class="company-total">${company.total}</div>
                    <div class="company-percentage text-success">${company.percentage}%</div>
                </div>
            </div>`;
    }

    createSocialItemHTML(social) {
        const socialClass = social.name.toLowerCase().includes('فيسبوك') ? 'facebook' : social.name.toLowerCase().includes('اكس') ? 'twitter' : 'instagram';
        return `
            <div class="social-item">
                <div class="social-icon ${socialClass}">${social.icon}</div>
                <div class="social-content flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="social-name">${social.name}</span>
                        <span class="social-percentage fw-bold">${social.percentage}%</span>
                    </div>
                    <div class="progress-bar-custom">
                        <div class="progress-fill" style="width: 0%; background-color: ${social.color};" data-width="${social.percentage}%"></div>
                    </div>
                </div>
            </div>`;
    }

    createOrderRowHTML(order) {
        return `
            <tr>
                <td><strong>${order.customerName}</strong></td>
                <td><span class="badge bg-light text-dark">${order.ordersCount}</span></td>
                <td>${order.products}</td>
                <td><span class="badge bg-success-light text-success">${order.completedOrders}</span></td>
                <td><strong class="text-dark">${order.paidAmount}</strong></td>
                <td><span class="badge bg-danger-light text-danger">${order.pendingOrders}</span></td>
            </tr>`;
    }
    
    // --- CHARTS ---
    initCharts() {
        this.charts.customers = this.createDonutChart('customersChart', dashboardData.customers);
        this.charts.profits = this.createDonutChart('profitsChart', dashboardData.profits);
        this.charts.orders = this.createDonutChart('ordersChart', dashboardData.orders);
        this.charts.sales = this.createSalesBarChart('salesChart', dashboardData.sales);
    }

    createDonutChart(canvasId, data) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [data.total, 100 - data.total],
                    backgroundColor: data.colors,
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                animation: { animateRotate: true, duration: 1500 }
            }
        });
    }

    createSalesBarChart(canvasId, data) {
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.name),
                datasets: [
                    { label: 'احمر', data: data.map(item => item.red), backgroundColor: '#dc3545', borderRadius: 6 },
                    { label: 'ازرق', data: data.map(item => item.blue), backgroundColor: '#007bff', borderRadius: 6 },
                    { label: 'اخضر', data: data.map(item => item.green), backgroundColor: '#28a745', borderRadius: 6 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, grid: { color: '#f0f0f0' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
    
    updateAllCharts() {
        for (const chart in this.charts) {
            this.charts[chart]?.update();
        }
    }

    // --- ANIMATIONS & ACTIONS ---
    animateProgressBars() {
        setTimeout(() => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                bar.style.width = bar.dataset.width || '0%';
            });
        }, 500);
    }

    handleDownload(event) {
        const button = event.currentTarget;
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
            this.showNotification('تم تحميل التقرير بنجاح!', 'success');
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `top: 20px; left: 20px; z-index: 9999; box-shadow: 0 4px 15px rgba(0,0,0,0.2);`;
        notification.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// ================== SAMPLE DATA OBJECT ==================
const dashboardData = {
    customers: { total: 85, colors: ['#28a745', '#e9ecef'] },
    profits: { total: 15, colors: ['#dc3545', '#e9ecef'] },
    orders: { total: 85, colors: ['#007bff', '#e9ecef'] },
    sales: [
        { name: 'يناير', red: 70, blue: 50, green: 80 },
        { name: 'فبراير', red: 30, blue: 40, green: 60 },
        { name: 'مارس', red: 40, blue: 60, green: 50 },
        { name: 'ابريل', red: 20, blue: 30, green: 25 },
        { name: 'مايو', red: 50, blue: 70, green: 90 },
        { name: 'يونيو', red: 60, blue: 80, green: 70 }
    ],
    products: [
        { name: 'حذاء رياضي رجالي', sales: '120 مبيعة', image: '../assets/images/shoes (1).png' },
        { name: 'حذاء رياضي نسائي', sales: '95 مبيعة', image: '../assets/images/shoes (2).png'  },
        { name: 'حذاء كاجوال', sales: '87 مبيعة', image: '../assets/images/shoes (3).png'  }
    ],
    shippingCompanies: [
        { name: 'Aramex', orders: 150, total: '15,000 ريال', percentage: 35, status: 'نشط' },
        { name: 'DHL', orders: 120, total: '12,000 ريال', percentage: 28, status: 'نشط' },
        { name: 'SMSA', orders: 100, total: '10,000 ريال', percentage: 23, status: 'نشط' }
    ],
    socialMedia: [
        { name: 'فيسبوك', percentage: 35, color: '#1877f2', icon: 'f' },
        { name: 'منصة اكس', percentage: 25, color: '#000000', icon: 'X' },
        { name: 'انستغرام', percentage: 40, color: '#e4405f', icon: 'IG' }
    ],
    ordersTable: [
        { customerName: 'محمود احمد', ordersCount: 3, products: 'حذاء نايك', completedOrders: 1, paidAmount: '1050 ريال', pendingOrders: 1 },
        { customerName: 'علي حسن', ordersCount: 5, products: 'حذاء اديداس', completedOrders: 4, paidAmount: '2500 ريال', pendingOrders: 1 },
        { customerName: 'فاطمة الزهراء', ordersCount: 2, products: 'حذاء بوما', completedOrders: 2, paidAmount: '800 ريال', pendingOrders: 0 }
    ]
};
