class SldsCalendar {
    constructor() {
        moment.locale('en');

        this.currentMoment = moment().startOf('month');
        this.dayLabels = this.getDayHeaderData();
        this.selectedDate = '';
        this.format = 'YYYY-MM-DD';
    }

    renderPreviousMonth() {
        this.getPreviousMonth();
        this.renderCalendar();
    }

    renderNextMonth() {
        this.getNextMonth();
        this.renderCalendar();
    }

    renderToday() {
        this.getToday();
        this.renderCalendar();
    }

    renderCalendar() {
        let calendar =
            `<div class="slds-datepicker slds-dropdown slds-dropdown--left slds-hide" aria-hidden="false">
                ${this.getCalendarFilterHTML()}
                <table class="datepicker__month" role="grid" aria-labelledby="month">
                    ${this.getCalendarTheadHTML()}
                    <tfoot>
                        ${this.getTodayButtonHTML()}
                    </tfoot>
                    ${this.getCalendarTbodyHTML()}
                </table>
            </div>`;

        return calendar;
    }

    getCalendarFilterHTML() {
        let filters =
            `<div class="slds-datepicker__filter slds-grid">
                <div class="slds-datepicker__filter--month slds-grid slds-grid--align-spread slds-grow">
                    <div class="slds-align-middle">
                        <button class="slds-button slds-button--icon-container sldsjs-datepicker-previous">
                            <svg aria-hidden="true" class="slds-button__icon">
                                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>
                            </svg>
                            <span class="slds-assistive-text">Previous Month</span>
                        </button>
                    </div>
                    <h2 class="slds-align-middle" aria-live="assertive" aria-atomic="true">
                        <span class="sldsjs-month">${this.currentMoment.format('MMMM')}</span>
                        <span class="sldsjs-year-label">${this.currentMoment.format('YYYY')}</span>
                    </h2>
                    <div class="slds-align-middle">
                        <button class="slds-button slds-button--icon-container sldsjs-datepicker-next">
                            <svg aria-hidden="true" class="slds-button__icon">
                                <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>
                            </svg>
                            <span class="slds-assistive-text">Next Month</span>
                        </button>
                    </div>
                </div>
                <div class="slds-shrink-none">
                    <label class="slds-assistive-text">Pick a Year</label>
                    <div class="slds-select_container">
                        <select class="slds-select sldsjs-year">
                            ${this.renderCalendarFilterOptions()}
                        </select>
                    </div>
                </div>
            </div>`;

        return filters;
    }

    renderCalendarFilterOptions() {
        let options = this.getYearOptionsData();
        let html = '';

        options.forEach((item) => {
            html +=
                `<option value="${item.value}"${+this.currentMoment.format('YYYY') === item.value ? 'selected' : ''}>${item.label}</option>`;
        });

        return html;
    }

    getCalendarTheadHTML() {
        let headings = this.getDayHeaderData();
        let html = '';

        headings.forEach((item) => {
            html +=
                `<th scope="col">
                <abbr title="${item.full}">${item.short}</abbr>
            </th>`;
        });

        let thead =
            `<thead>
                <tr>
                    ${html}
                </tr>
            </thead>`;

        return thead;
    }

    getCalendarTbodyHTML() {
        let data = this.getCalendarMonthData();
        let html = '';

        data.forEach(item => {
            html +=
                `<tr>
                    ${this.renderCalendarTds(item.days)}
                </tr>`;
        });

        let template =
            `<tbody>
                ${html}
            </tbody>`;

        return template;
    }

    getTodayButtonHTML() {
        let template =
            `<tr>
            <td colspan="7" role="gridcell">
                <a role="button" class="slds-show--inline-block slds-p-bottom--x-small sldsjs-today">Today</a>
            </td>
        </tr>`;

        return template;
    }

    renderCalendarTds(data) {
        let html = '';

        data.forEach(item => {
            html +=
                `<td class="${item.isToday ? 'slds-is-today' : ''}${item.isCurrentMonth ? ' ' : 'slds-disabled-text'}" role="gridcell" aria-selected="false" data-date="${item.date}" data-label="${item.label}">
                <span class="slds-day" data-date="${item.date}">${item.day}</span>
            </td>`;
        });

        return html;
    }

    getYearOptionsData() {
        let thisYear = this.currentMoment.format('YYYY');
        let options = [{
            label: +thisYear - 1,
            value: +thisYear - 1
        }, {
            label: +thisYear,
            value: +thisYear
        }, {
            label: +thisYear + 1,
            value: +thisYear + 1
        }];

        return options;
    }

    getDayHeaderData() {
        let ret = [];
        let thisMoment = moment(this.currentMoment).startOf('week');

        for (let i = 0; i < 7; i++) {
            ret.push({
                full: thisMoment.format('dddd'),
                short: thisMoment.format('ddd')
            });

            thisMoment.add(1, 'day');
        }

        return ret;
    }

    getCalendarMonthData(date = this.currentMoment) {
        this.currentMoment = moment(date);

        let now = moment(date);
        let later = moment(date);
        let nextMonth = moment(date).add(1, 'month');
        let startOfDays = moment(date).startOf('week');
        let startOfWeek = now.startOf('week');
        let endOfWeek = later.startOf('week').add(6, 'days');
        let totalWeeks = Math.abs(now.diff(nextMonth, 'weeks'));
        let ret = [];

        for (let i = 0; i <= totalWeeks; i++) {
            ret.push({
                currentMonth: moment(date).format('MMMM'),
                currentYear: moment(date).format('YYYY'),
                startMonth: startOfWeek.format('M'),
                startYear: startOfWeek.format('YYYY'),
                startDay: startOfWeek.format('D'),
                endDay: endOfWeek.format('D'),
                endMonth: endOfWeek.format('M'),
                endYear: endOfWeek.format('YYYY'),
                days: this._getWeekDays(moment(date), moment(), startOfDays)
            });

            startOfWeek.add(7, 'days');
            endOfWeek.add(7, 'days');
        }

        return ret;
    }

    getToday() {
        this.currentMoment = moment().startOf('month');
        return this.getCalendarMonthData();
    }

    getNextMonth() {
        return this.getCalendarMonthData(this.currentMoment.add(1, 'month'));
    }

    getPreviousMonth() {
        return this.getCalendarMonthData(this.currentMoment.subtract(1, 'month'));
    }

    _getWeekDays(currentDate, thisMoment, startMoment = moment()) {
        let weekDays = [];

        for (let i = 0; i < 7; i++) {
            weekDays.push({
                label: this.dayLabels[i].full,
                day: +startMoment.format('D'),
                date: startMoment.format('YYYY-MM-DD'),
                isCurrentMonth: startMoment.format('M') === currentDate.format('M'),
                isToday: startMoment.format('YYYY-MM-DD') === thisMoment.format('YYYY-MM-DD')
            });
            startMoment = startMoment.add(1, 'day');
        }

        return weekDays;
    }

    updateCalendar(container) {
        let select = container.querySelector('.sldsjs-year');

        container.querySelector('.sldsjs-month').innerHTML = this.currentMoment.format('MMMM');
        container.querySelector('.sldsjs-year-label').innerHTML = this.currentMoment.format('YYYY');
        container.querySelector('tbody').innerHTML = this.getCalendarTbodyHTML();

        console.info('select.options', select.options);

        select.value = this.currentMoment.format('YYYY');
    }

    toggleDatepicker(datepicker) {
        if (datepicker.classList.contains('slds-hide')) {
            this.showDatepicker(datepicker);
        } else {
            this.hideDatepicker(datepicker);
        }
    }

    showDatepicker(datepicker) {
        datepicker.classList.remove('slds-hide');
    }

    hideDatepicker(datepicker) {
        datepicker.classList.add('slds-hide');
    }

    removeActiveStates(container) {
        container.querySelectorAll('.slds-is-selected').forEach(item => {
            item.classList.remove('slds-is-selected');
        });
    }
}

// Instantiate
(() => {
    let datepickers = document.querySelectorAll('.sldsjs-datepicker');

    let initializeDatepicker = container => {
        let datepicker = new SldsCalendar();

        // render calendar
        container.innerHTML += datepicker.renderCalendar();

        let datepickerInput = container.querySelector('.sldsjs-datepicker');
        let datepickerCalendar = container.querySelector('.slds-datepicker');
        let prevBtn = container.querySelector('.sldsjs-datepicker-previous');
        let nextBtn = container.querySelector('.sldsjs-datepicker-next');
        let yearBtn = container.querySelector('.sldsjs-year');

        // add event listeners
        prevBtn.addEventListener('click', () => {
            datepicker.renderPreviousMonth();

            // update calendar month, year, and tbody
            datepicker.updateCalendar(container);
        });

        nextBtn.addEventListener('click', () => {
            datepicker.renderNextMonth();

            // update calendar month, year, and tbody
            datepicker.updateCalendar(container);
        });

        yearBtn.addEventListener('change', function () {
            // set to selected year
            datepicker.currentMoment.year(this.value);

            // update calendar month, year, and tbody
            datepicker.updateCalendar(container);
        });

        // delegate events
        container.addEventListener('click', e => {
            if (e.target.nodeName.toLowerCase() === 'td') {
                // remove current states
                datepicker.removeActiveStates(container);

                e.target.classList.add('slds-is-selected');
                datepicker.selectedDate = e.target.getAttribute('data-date');

                // close datepicker
                datepicker.hideDatepicker(datepickerCalendar);
            }

            if (e.target.classList.contains('slds-day')) {
                // remove current states
                datepicker.removeActiveStates(container);

                e.target.parentNode.classList.add('slds-is-selected');
                datepicker.selectedDate = e.target.parentNode.getAttribute('data-date');

                // close datepicker
                datepicker.hideDatepicker(datepickerCalendar);
            }

            // update date input with selected date
            datepickerInput.value = datepicker.selectedDate;
        });

        datepickerInput.addEventListener('focus', () => {
            datepicker.showDatepicker(datepickerCalendar);
        });

        datepickerInput.addEventListener('keyup', () => {
            datepicker.selectedDate = container.querySelector('.sldsjs-datepicker').value;
        });

        if (container.querySelector('.sldsjs-today')) {
            container.querySelector('.sldsjs-today').addEventListener('click', e => {
                e.preventDefault();

                // update calendar to today and select the date
                datepicker.renderToday();

                // update calendar month, year, and tbody
                datepicker.updateCalendar(container);

                // update date input value with today's date
                datepicker.selectedDate = moment().format(datepicker.format);
                datepickerInput.value = datepicker.selectedDate;

                // add active state to this date
                container.querySelector('.slds-is-today ').classList.add('slds-is-selected');

                // close datepicker
                datepicker.hideDatepicker(datepickerCalendar);
            });
        }

        // TODO: close date picker if you click on anywhere but the datepicker calendar area
    };

    datepickers.forEach(item => {
        initializeDatepicker(item.parentNode);
    });
})();
