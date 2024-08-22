import puppeteer from "puppeteer";
import { fork } from "child_process";
import moment from "moment";
moment.locale("ru");

jest.setTimeout(50000);

describe("test widget search ticket", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:9000";

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      headless: true,
      slowMo: 100
    });

    [page] = await browser.pages();

    await page.setViewport({ width: 1280, height: 800 });
  });

  test("testing widget calendar", async () => {
    await page.goto(baseUrl);

    await page.waitForSelector(".form-search-ticket");

    const selectDateInput = await page.$(".select-date__input-one");
    await selectDateInput.click();

    await page.waitForSelector(".calendar");
    await page.waitForSelector(".back.disable");
    await page.waitForSelector(".next");

    await page.click('.next');
    await page.click('.next');

    const testDateNext = moment().add(2, 'month').format("MMMM YYYY")
    const monthElementNext = await page.$(".month-year");
    const monthValueNext = await (await monthElementNext.getProperty("textContent")).jsonValue();
    const resultNext = moment(monthValueNext, "MMMM YYYY").format("MMMM YYYY");

    await expect(resultNext).toEqual(testDateNext);

    await page.click('.back');
    await page.click('.back');
    await page.click('.back');

    const testDateBack = moment().format("MMMM YYYY")
    const monthElementBack = await page.$(".month-year");
    const monthValueBack = await (await monthElementBack.getProperty("textContent")).jsonValue();
    const resultBack = moment(monthValueBack, "MMMM YYYY").format("MMMM YYYY");

    await expect(resultBack).toEqual(testDateBack);
  
    const days = await page.$$(".day");
    const i = Number(moment().format("D") - 1);

    await days[i].click();
    await selectDateInput.click();
    await page.waitForSelector(".calendar .day.current-day.select-day");
  });

  test("testing single date selection", async () => {
    await page.goto(baseUrl);
    await page.waitForSelector(".select-date__input-one");

    const selectDateInput = await page.$(".select-date__input-one");
    await selectDateInput.click();

    await page.waitForSelector(".calendar");

    const days = await page.$$(".day");
    const i = Number(moment().format("D") - 1);
    await days[i].click();

    const result = await (await selectDateInput.getProperty("value")).jsonValue();
    await expect(result).toEqual(moment().format("DD.MM.YYYY"));
  });

  test("testing the selection of departure and arrival dates", async () => {
    await page.goto(baseUrl);

    const checkboxTwoDates = await page.$(".option-arrival__custom-checkbox");
    await checkboxTwoDates.click()

    await page.waitForSelector(".select-date__departure");
    await page.waitForSelector(".select-date__arrival");

    const departureInput = await page.$(".select-date__departure");
    const arrivalInput = await page.$(".select-date__arrival");

    await departureInput.click()

    const daysDeparture = await page.$$(".day");
    const i = Number(moment().format("D") - 1);

    await daysDeparture[i].click();

    const resultDeparture = await (await departureInput.getProperty("value")).jsonValue();
    await expect(resultDeparture).toEqual(moment().format("DD.MM.YYYY"));

    await arrivalInput.click()
    const daysArrival = await page.$$(".day");
    await daysArrival[i].click();

    const resultArrival = await (await arrivalInput.getProperty("value")).jsonValue();
    await expect(resultArrival).toEqual(moment().format("DD.MM.YYYY"));
  });

  test("test show error select arrival date earlier departure date", async () => {
    await page.goto(baseUrl);

    const checkboxTwoDates = await page.$(".option-arrival__custom-checkbox");
    await checkboxTwoDates.click()

    await page.waitForSelector(".select-date__departure");
    await page.waitForSelector(".select-date__arrival");

    const departureInput = await page.$(".select-date__departure");
    const arrivalInput = await page.$(".select-date__arrival");

    await departureInput.click()
    const daysDeparture = await page.$$(".day");
    const i = Number(moment().format("D"));
    await daysDeparture[i].click();

    await arrivalInput.click()
    const daysArrival = await page.$$(".day");
    const j = Number(moment().format("D") - 1);
    await daysArrival[j].click();

    await page.waitForSelector(".error-date");
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test("should add do something", async () => {
    await page.goto(baseUrl);
  });
});
