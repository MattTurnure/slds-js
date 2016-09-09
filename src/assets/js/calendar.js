class SldsCalendar {
    constructor() {
        moment.locale('en');

        this.defaultMoment = moment().startOf('month');
        this.currentMoment = moment();
        this.dayLabels = this.getDayLabels();
    }

    renderCalendar() {
        let calendar =
            `<div class="slds-datepicker slds-dropdown slds-dropdown--left" aria-hidden="false">
                ${this.renderCalendarFilters()}
                <table class="datepicker__month" role="grid" aria-labelledby="month">
                    ${this.renderCalendarThead()}
                    ${this.renderCalendarTbody()}
                </table>
            </div>`;

        return calendar;
    }

    renderCalendarFilters() {
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
                    <h2 id="month" class="slds-align-middle" aria-live="assertive" aria-atomic="true">${this.currentMoment.format('MMMM')}</h2>
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
                    <label class="slds-assistive-text" for="year">Pick a Year</label>
                    <div class="slds-select_container">
                        <select id="year" class="slds-select">
                            ${this.renderCalendarFilterOptions()}
                        </select>
                    </div>
                </div>
            </div>`;

        return filters;
    }

    renderCalendarFilterOptions() {
        let options = this.getYearOptions();
        let html = '';

        options.forEach((item) => {
            html +=
                `<option value="${item.value}"${+this.defaultMoment.format('YYYY') === item.value ? 'selected' : ''}>${item.label}</option>`;
        });

        return html;
    }

    renderCalendarThead() {
        let headings = this.getDayLabels();
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

    renderCalendarTbody() {
        let data = this.getCalendarMonth();
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
                <tr>
                    <td colspan="7" role="gridcell">
                        <a href="#" class="slds-show--inline-block slds-p-bottom--x-small">Today</a>
                    </td>
                </tr>
            </tbody>`;

        return template;
    }

    renderCalendarTds(data) {
        let html = '';

        data.forEach(item => {
            html +=
                `<td class="${item.isToday ? 'slds-is-today' : ''}${item.isCurrentMonth ? ' ' : 'slds-disabled-text'}" role="gridcell" aria-selected="false" data-date="${item.date}" data-label="${item.label}">
                <span class="slds-day">${item.day}</span>
            </td>`;
        });

        return html;
    }

    getYearOptions() {
        let thisYear = this.defaultMoment.format('YYYY');
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

    getDayLabels() {
        let ret = [];
        let thisMoment = moment(this.defaultMoment).startOf('week');

        for (let i = 0; i < 7; i++) {
            ret.push({
                full: thisMoment.format('dddd'),
                short: thisMoment.format('ddd')
            });

            thisMoment.add(1, 'day');
        }

        return ret;
    }

    getCalendarMonth(date = this.defaultMoment) {
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
                days: this._getWeekDays(moment(date).format('M'), moment().date(), startOfDays)
            });

            startOfWeek.add(7, 'days');
            endOfWeek.add(7, 'days');
        }

        return ret;
    }

    getNextMonth() {
        return this.getCalendarMonth(this.currentMoment.add(1, 'month'));
    }

    getPreviousMonth() {
        return this.getCalendarMonth(this.currentMoment.subtract(1, 'month'));
    }

    _getWeekDays(currentMonth, thisDay, startMoment = moment()) {
        let weekDays = [];

        for (let i = 0; i < 7; i++) {
            weekDays.push({
                label: this.dayLabels[i].full,
                day: +startMoment.format('D'),
                date: startMoment.format('YYYY-MM-DD'),
                isCurrentMonth: startMoment.format('M') === currentMonth,
                isToday: +startMoment.format('D') === thisDay
            });
            startMoment = startMoment.add(1, 'day');
        }

        return weekDays;
    }
}
