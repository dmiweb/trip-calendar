import "./calendar.css";
import moment from "moment";
moment.locale("ru");

export default class Calendar {
  constructor(bindElement, checkCorrectDate) {
    this.bindElement = bindElement;
    this._checkCorrectDate = checkCorrectDate;

    this.currentDay = Number(moment().format("D"));
    this.currentMonth = Number(moment().format("M"));
    this.currentYear = Number(moment().format("YYYY"));

    this.date = {
      day: this.currentDay,
      month: this.currentMonth,
      year: this.currentYear,
    };

    this.nextMon = this.nextMon.bind(this);
    this.previousMon = this.previousMon.bind(this);
    this.selectDate = this.selectDate.bind(this);
    this.removeCalendar = this.removeCalendar.bind(this);
  }

  createCalendar(month, year) {
    month = this.date.month;
    year = this.date.year;

    let d = moment(year + "." + month, "YYYY.M")._d;

    let calendar = `
                <table class="calendar">
                  <caption>
                    <span class="back"><</span>
                    <span class="month-year">${moment(month, "M").format(
                      "MMMM"
                    )} ${year}</span>
                    <span class="next">></span>
                  </caption>
                  <tr>
                    <th>Пн</th>
                    <th>Вт</th>
                    <th>Ср</th>
                    <th>Чт</th>
                    <th>Пт</th>
                    <th>Сб</th>
                    <th>Вс</th>
                  </tr>
                  <tr>
                `;

    for (let i = 0; i < this.getDay(d); i++) {
      calendar += "<td></td>";
    }

    while (+moment(d).format("M") === month) {
      calendar += '<td class="day">' + moment(d).format("D") + "</td>";

      if (this.getDay(d) % 7 === 6) {
        calendar += "</tr><tr>";
      }

      d = moment(d).add(1, "days")._d;
    }

    if (this.getDay(d) !== 0) {
      for (let i = this.getDay(d); i < 7; i++) {
        calendar += "<td></td>";
      }
    }

    calendar += "</tr></table>";

    document.body.insertAdjacentHTML("beforeEnd", calendar);

    const days = document.querySelectorAll(".day");

    days.forEach((day) => {
      if (
        +day.textContent < this.currentDay &&
        this.date.month === this.currentMonth &&
        this.date.year === this.currentYear
      ) {
        day.classList.add("disable");
      }

      if (
        +day.textContent === this.currentDay &&
        this.date.month === this.currentMonth &&
        this.date.year === this.currentYear
      ) {
        day.classList.add("current-day");
      }

      if (
        moment(
          `${day.textContent}.${this.date.month}.${this.date.year}`,
          "D.MM.YYYY"
        ).isSame(moment(this.bindElement.value, "DD.MM.YYYY"))
      ) {
        day.classList.add("select-day");
      }
    });

    if (
      this.date.month === this.currentMonth &&
      this.date.year === this.currentYear
    ) {
      document.querySelector(".back").classList.add("disable");
    }

    document.querySelector(".next").addEventListener("click", this.nextMon);
    document.querySelector(".back").addEventListener("click", this.previousMon);
    document
      .querySelector(".calendar")
      .addEventListener("click", this.selectDate);
  }

  getDay(date) {
    let day = moment(date).day();
    if (day === 0) day = 7;
    return day - 1;
  }

  bindCalendar() {
    const { top, left } = this.bindElement.getBoundingClientRect();
    document.querySelector(".calendar").style.top =
      top + this.bindElement.offsetHeight + "px";
    document.querySelector(".calendar").style.left = left + "px";
  }

  nextMon() {
    this.removeCalendar();

    if (this.date.month < 12) {
      this.date.month = this.date.month + 1;
    } else {
      this.date.month = 1;
      this.date.year = this.date.year + 1;
    }

    this.createCalendar(this.date.month, this.date.year);
    this.bindCalendar();
  }

  previousMon() {
    if (
      this.date.month === this.currentMonth &&
      this.date.year === this.currentYear
    )
      return;

    this.removeCalendar();

    if (this.date.month > 1) {
      this.date.month = this.date.month - 1;
    } else {
      this.date.month = 12;
      this.date.year = this.date.year - 1;
    }

    this.createCalendar(this.date.month, this.date.year);
    this.bindCalendar();
  }

  selectDate(e) {
    const selectDay = e.target;
    const selectDate = `${selectDay.textContent}.${this.date.month}.${this.date.year}`;

    if (selectDay.classList.contains("day")) {
      if (selectDay.classList.contains("disable")) return;

      this.bindElement.value = moment(selectDate, "D.M.YYYY").format(
        "DD.MM.YYYY"
      );

      this.removeCalendar();
      this._checkCorrectDate();
    }
  }

  removeCalendar() {
    if (document.querySelector(".calendar"))
      document.querySelector(".calendar").remove();
  }
}
