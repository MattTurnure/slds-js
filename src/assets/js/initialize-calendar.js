(() => {
    let datepickers = document.querySelectorAll('.sldsjs-datepicker');
    let datepicker;

    let renderDatepicker = (container) => {
        datepicker = new SldsCalendar();
        container.innerHTML += datepicker.renderCalendar();
    };

    datepickers.forEach(item => {
        renderDatepicker(item.parentNode);
    });
})();
