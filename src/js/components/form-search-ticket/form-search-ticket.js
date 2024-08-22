import "./form-search-ticket.css";
import moment from "moment";

export default class FormSearchTiket {
  constructor(parentEl) {
    this.parentEl = parentEl;

    this.switchDateMode = this.switchDateMode.bind(this);
    this.checkCorrectDate = this.checkCorrectDate.bind(this);
    this.onAttributeHandler = this.onAttributeHandler.bind(this);
  }

  static get markup() {
    return `
            <div class="container">
              <form class="form-search-ticket">
                <h1 class="form-search-ticket__title">Поиск билетов</h1>

                  <div class="select-location-wrap">
                    <label class="select-location">
                        <span class="select-location__title">Откуда:</span>
                        <input type="text" class="select-location__input select-location__departure" required>
                    </label>

                    <div class="sync-tikets-btn"></div>
                    </div>

                    <label class="select-location">
                    <span class="select-location__title">Куда:</span>
                    <input type="text" class="select-location__input select-location__arrival" required>
                    </label>

                    <div class="selected-age-container">
                    <div class="select-age">
                        <span class="select-age__title">Взрослые:</span>
                        <div class="select-age__control">
                        <div class="select-age__dec-btn">-</div>
                        <div class="select-age__count-passenger">0</div>
                        <div class="select-age__inc-btn">+</div>
                        </div>
                    </div>

                    <div class="select-age">
                        <span class="select-age__title">Дети до 10 лет:</span>
                        <div class="select-age__control">
                        <div class="select-age__dec-btn">-</div>
                        <div class="select-age__count-passenger">0</div>
                        <div class="select-age__inc-btn">+</div>
                        </div>
                    </div>

                    <div class="select-age">
                        <span class="select-age__title">Дети до 5 лет:</span>
                        <div class="select-age__control">
                        <div class="select-age__dec-btn">-</div>
                        <div class="select-age__count-passenger">0</div>
                        <div class="select-age__inc-btn">+</div>
                        </div>
                    </div>
                    
                    <div class="select-age">
                      <span class="select-age__title">Туда и обратно:</span>
                      <label class="option-arrival">
                        <input type="checkbox" class="option-arrival__checkbox" />
                        <span class="option-arrival__custom-checkbox"></span>
                      </label>
                    </div>
                    </div>

                    <div class="select-date select-date__one-date">
                    <label class="select-date__container">
                        <span class="select-date__title">Дата:</span>
                        <input type="text" class="select-date__input select-date__input-one" placeholder="Выбрать дату">
                    </label>
                    </div>

                    <div class="select-date select-date__two-date">
                    <label class="select-date__container">
                        <span class="select-date__title">Туда:</span>
                        <input type="text" class="select-date__input select-date__departure" placeholder="Дата туда">
                    </label>
                    <label class="select-date__container">
                        <span class="select-date__title">Обратно:</span>
                        <input type="text" class="select-date__input select-date__arrival" placeholder="Дата обратно">
                    </label>
                    </div>

                    <button class="form-search__btn-submit">Найти билеты</button>
                </form>
            </div>
                 `;
  }

  static get selector() {
    return ".form-search-ticket";
  }

  static get checkboxSelector() {
    return ".option-arrival__checkbox";
  }

  static get elemOneDateSelector() {
    return ".select-date__one-date";
  }

  static get selectOneDateSelector() {
    return ".select-date__input-one";
  }

  static get elemTwoDateSelector() {
    return ".select-date__two-date";
  }

  static get selectDateDepartureSelector() {
    return ".select-date__departure";
  }

  static get selectDateArrivalSelector() {
    return ".select-date__arrival";
  }

  bindToDOM() {
    this.parentEl.innerHTML = FormSearchTiket.markup;

    this.element = this.parentEl.querySelector(FormSearchTiket.selector);
    this.checkbox = this.element.querySelector(
      FormSearchTiket.checkboxSelector
    );
    this.elemOneDate = this.element.querySelector(
      FormSearchTiket.elemOneDateSelector
    );
    this.selectOneDateInput = this.elemOneDate.querySelector(
      FormSearchTiket.selectOneDateSelector
    );
    this.elemTwoDate = this.element.querySelector(
      FormSearchTiket.elemTwoDateSelector
    );
    this.selectDateDepartureInput = this.elemTwoDate.querySelector(
      FormSearchTiket.selectDateDepartureSelector
    );
    this.selectDateArrivalInput = this.elemTwoDate.querySelector(
      FormSearchTiket.selectDateArrivalSelector
    );

    this.checkbox.addEventListener("change", this.switchDateMode);
    this.element.addEventListener("focus", this.onAttributeHandler, true);
  }

  switchDateMode() {
    if (this.checkbox.checked) {
      this.elemOneDate.style.display = "none";
      this.elemTwoDate.style.display = "flex";
    } else {
      this.elemOneDate.style.display = "block";
      this.elemTwoDate.style.display = "none";
    }
  }

  onAttributeHandler(e) {
    const focusElement = e.target;
    let blurElement = null;

    focusElement.removeAttribute("placeholder");

    if (focusElement.classList.contains("select-date__input")) {
      focusElement.addEventListener(
        "blur",
        (e) => {
          blurElement = e.target;
        },
        true
      );

      document.addEventListener(
        "click",
        (e) => {
          const calendar = document.querySelector(".calendar");
          const errorDateMessage = document.querySelector(".error-date");

          if (!e.target.closest(".calendar")) {
            if (calendar) calendar.remove();

            focusElement.removeAttribute("placeholder");

            if (blurElement === this.selectOneDateInput) {
              blurElement.setAttribute("placeholder", "Выбрать дату");
            }
            if (blurElement === this.selectDateDepartureInput) {
              blurElement.setAttribute("placeholder", "Дата туда");
            }
            if (
              blurElement === this.selectDateArrivalInput &&
              !errorDateMessage
            ) {
              blurElement.setAttribute("placeholder", "Дата обратно");
            }
          }
        },
        true
      );
    }
  }

  checkCorrectDate() {
    if (document.querySelector(".option-arrival__checkbox").checked) {
      const departureDate = moment(
        this.selectDateDepartureInput.value,
        "DD.MM.YYYY"
      );
      const arrivalDate = moment(
        this.selectDateArrivalInput.value,
        "DD.MM.YYYY"
      );

      if (departureDate && arrivalDate) {
        if (arrivalDate.isBefore(departureDate)) {
          this.selectDateArrivalInput.value = "";
          this.selectDateArrivalInput.style.outline = "2px solid red";

          if (!document.querySelector(".error-date")) {
            this.elemTwoDate.insertAdjacentHTML(
              "beforeEnd",
              '<span class="error-date">Дата прибытия не может быть раньше даты отправления!</span>'
            );
          }

          const { top, right } =
            this.selectDateArrivalInput.getBoundingClientRect();
          const popover = document.querySelector(".error-date");

          popover.style.top =
            top +
            this.selectDateArrivalInput.offsetHeight / 2 -
            popover.offsetHeight / 2 +
            "px";
          popover.style.left = right + 5 + "px";

          return;
        } else {
          this.selectDateArrivalInput.style.outline = "none";
          if (document.querySelector(".error-date"))
            document.querySelector(".error-date").remove();
        }
      }
    }
  }
}
