import FormSearchTiket from "./components/form-search-ticket/form-search-ticket";
import Calendar from "./components/calendar/calendar";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("body");

  const form = new FormSearchTiket(container);
  form.bindToDOM();

  const oneDateInput = document.querySelector(".select-date__input-one");
  const dateDepartureInput = document.querySelector(".select-date__departure");
  const dateArrivalInput = document.querySelector(".select-date__arrival");

  const calendarOneDate = new Calendar(oneDateInput, form.checkCorrectDate);
  const calendarDepartureDate = new Calendar(
    dateDepartureInput,
    form.checkCorrectDate
  );
  const calendarArrivalDate = new Calendar(
    dateArrivalInput,
    form.checkCorrectDate
  );

  oneDateInput.addEventListener("click", () => {
    calendarOneDate.createCalendar();
    calendarOneDate.bindCalendar();
  });

  dateDepartureInput.addEventListener("click", () => {
    calendarDepartureDate.createCalendar();
    calendarDepartureDate.bindCalendar();
  });

  dateArrivalInput.addEventListener("click", () => {
    calendarArrivalDate.createCalendar();
    calendarArrivalDate.bindCalendar();
  });
});
