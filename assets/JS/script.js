document.addEventListener("DOMContentLoaded", () => {
    // --- Sidebar Toggle for Mobile ---
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

    // --- Responsive Table Data Labels ---
    const table = document.querySelector('.orders-table');
    if (table) {
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (headers[index] && headers[index].trim() !== '') {
                    cell.setAttribute('data-label', headers[index]);
                }
            });
        });
    }

    // --- ApexCharts Initializations ---

    // 1. الرسم البياني الخطي: إجمالي الطلبات شهريًا
    var monthlyOrdersOptions = {
        series: [{ name: 'الطلبات', data: [42, 55, 30, 60, 45, 75, 90] }],
        chart: { height: 300, type: 'bar', toolbar: { show: false } },
        colors: ['#aed581'],
        plotOptions: { bar: { columnWidth: '15%', borderRadius: 5, distributed: true } },
        dataLabels: { enabled: false },
        legend: { show: false },
        xaxis: {
            categories: ['مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر'],
            labels: { style: { fontFamily: 'Cairo, sans-serif', fontWeight: 600 } }
        },
        yaxis: { show: false },
        grid: { show: false },
    };
    new ApexCharts(document.querySelector("#monthlyOrdersChart"), monthlyOrdersOptions).render();

    // 2. الرسم البياني الدائري: عمليات الدفع
    var paymentMethodsOptions = {
        series: [30, 35, 20, 15],
        chart: { height: 300, type: 'donut' },
        plotOptions: { pie: { donut: { size: '75%', labels: { show: true, total: { show: false } } } } },
        colors: ['#0d47a1', '#4caf50', '#212121', '#d32f2f'],
        labels: ['Visa', 'تحويل بنكي', 'Apple Pay', 'MasterCard'],
        dataLabels: {
            enabled: true,
            formatter: (val, opts) => opts.w.config.series[opts.seriesIndex] + '%',
            style: { fontFamily: 'Cairo, sans-serif', fontWeight: 'bold' },
            dropShadow: { enabled: false }
        },
        legend: { position: 'bottom', fontFamily: 'Cairo, sans-serif' },
        tooltip: { y: { formatter: (val) => val + "%" } }
    };
    new ApexCharts(document.querySelector("#paymentMethodsChart"), paymentMethodsOptions).render();

    // 3. الرسم البياني الأفقي: عمليات التوصيل
    var deliveryMethodsOptions = {
        series: [{ data: [55, 30, 15] }],
        chart: { type: 'bar', height: 250, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, barHeight: '20%', borderRadius: 10, distributed: true } },
        colors: ['#f44336', '#00bcd4', '#ffc107'],
        dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: { colors: ['#000'], fontFamily: 'Cairo, sans-serif', fontWeight: 'bold' },
            formatter: (val) => val + '%',
            offsetX: 10
        },
        xaxis: { categories: ['ارامكس', 'سبل', 'DHL'], labels: { show: false } },
        yaxis: { labels: { style: { fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' } } },
        grid: { show: false },
        tooltip: { enabled: false }
    };
    new ApexCharts(document.querySelector("#deliveryMethodsChart"), deliveryMethodsOptions).render();

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
