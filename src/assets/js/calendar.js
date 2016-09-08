class SldsCalendar {
    constructor() {
        this.currentYear = (new Date()).getFullYear();
        this.today = new Date('1/1/' + this.currentYear);
        this.defaultMoment = moment(this.today.valueOf());
        this.currentMoment = {};
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
                days: this._getWeekDays(startOfDays)
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

    _getWeekDays(startMoment = moment()) {
        let weekDays = [];

        for (let i = 0; i < 7; i++) {
            weekDays.push(startMoment.format('D'));
            startMoment = startMoment.add(1, 'day');
        }

        return weekDays;
    }
}
