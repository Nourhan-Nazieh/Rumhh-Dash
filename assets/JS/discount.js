document.addEventListener('DOMContentLoaded', function() {

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
