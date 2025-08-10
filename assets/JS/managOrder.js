document.addEventListener("DOMContentLoaded", () => {
    // --- Sidebar Toggle for Mobile (from previous review) ---
    // ...

    // --- Responsive Table Data Labels (from previous review) ---
    // ...

    // --- Litepicker Initialization for Orders Page ---
    const pickerInput = document.getElementById('calendarPicker');
    if (pickerInput) {
        new Litepicker({
            element: pickerInput,
            singleMode: false,
            format: 'DD MMMM YYYY',
            lang: 'ar-SA', // Arabic language
            setup: (picker) => {
                picker.on('selected', (date1, date2) => {
                    // Handle date range selection
                });
            }
        });
    }
});
