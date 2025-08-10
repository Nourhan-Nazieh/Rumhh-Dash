// انتظر حتى يتم تحميل جميع عناصر الصفحة
document.addEventListener('DOMContentLoaded', function() {

    // ================== Sidebar Toggle Logic ==================
    const sidebarToggler = document.getElementById('sidebar-toggler');
    const sidebar = document.querySelector('.sidebar'); // استخدام querySelector أفضل للوصول للكلاس

    // تأكد من وجود الزر والشريط الجانبي قبل إضافة أي وظائف
    if (sidebarToggler && sidebar) {
        
        // 1. عند الضغط على زر القائمة (Hamburger)
        sidebarToggler.addEventListener('click', function(event) {
            // امنع انتشار الإيفنت حتى لا يتم إغلاق الشريط فورًا بواسطة المستمع الآخر
            event.stopPropagation(); 
            sidebar.classList.toggle('show');
        });

        // 2. عند الضغط في أي مكان في الصفحة (لإغلاق الشريط الجانبي)
        document.addEventListener('click', function(event) {
            // تحقق إذا كان الشريط الجانبي ظاهرًا، وأن النقرة لم تكن على الشريط نفسه
            const isClickInsideSidebar = sidebar.contains(event.target);

            if (sidebar.classList.contains('show') && !isClickInsideSidebar) {
                sidebar.classList.remove('show');
            }
        });
    }

    // ================== Chart.js Initialization ==================
    const ctx = document.getElementById('couponChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['نشط', 'مستخدم', 'منتهي'],
                datasets: [{ 
                    data: [65, 25, 10], 
                    backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'], 
                    borderWidth: 0 
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                cutout: '70%', 
                plugins: { 
                    legend: { 
                        display: true, 
                        position: 'bottom' 
                    } 
                } 
            }
        });
    }
});
