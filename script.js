const dropdown = document.querySelectorAll(".dropdownclass select");
const defaultdropd1 = document.querySelector("#YourDropdown");
const defaultdropd2 = document.querySelector("#OutputDropdown");
const yourimg = document.querySelector("#yourimg");
const outputimg = document.querySelector("#outputimg");
const yourDropdown = document.querySelector("#YourDropdown");
const OutputDropdown = document.querySelector("#OutputDropdown");
const input = document.querySelector("#yourinput");
const btn = document.querySelector("#convert");
const swapBtn = document.querySelector("#swap");
const display = document.querySelector("#outputdisplayer");
const rateDisplay = document.querySelector("#rateDisplay");
const rateStatus = document.querySelector("#rateStatus");
const fromCodeLabel = document.querySelector("#fromCodeLabel");
const toCodeLabel = document.querySelector("#toCodeLabel");
const fromDetails = document.querySelector("#fromDetails");
const toDetails = document.querySelector("#toDetails");

const API_KEY = "082f73d35e94ac3667538e22";

const currencyNames = {
  AED: "UAE Dirham", AFN: "Afghan Afghani", ALL: "Albanian Lek", AMD: "Armenian Dram",
  ANG: "Netherlands Antillean Guilder", AOA: "Angolan Kwanza", ARS: "Argentine Peso",
  AUD: "Australian Dollar", AZN: "Azerbaijani Manat", BDT: "Bangladeshi Taka",
  BGN: "Bulgarian Lev", BHD: "Bahraini Dinar", BIF: "Burundian Franc", BND: "Brunei Dollar",
  BOB: "Bolivian Boliviano", BRL: "Brazilian Real", BWP: "Botswana Pula", BYR: "Belarusian Ruble",
  CAD: "Canadian Dollar", CHF: "Swiss Franc", CLP: "Chilean Peso", CNY: "Chinese Yuan",
  COP: "Colombian Peso", CRC: "Costa Rican Colón", CZK: "Czech Koruna", DKK: "Danish Krone",
  DOP: "Dominican Peso", DZD: "Algerian Dinar", EGP: "Egyptian Pound", EUR: "Euro",
  FJD: "Fijian Dollar", GBP: "British Pound", GEL: "Georgian Lari", GHS: "Ghanaian Cedi",
  HKD: "Hong Kong Dollar", HRK: "Croatian Kuna", HUF: "Hungarian Forint", IDR: "Indonesian Rupiah",
  ILS: "Israeli New Shekel", INR: "Indian Rupee", IQD: "Iraqi Dinar", IRR: "Iranian Rial",
  ISK: "Icelandic Króna", JMD: "Jamaican Dollar", JPY: "Japanese Yen", KES: "Kenyan Shilling",
  KRW: "South Korean Won", KWD: "Kuwaiti Dinar", KZT: "Kazakhstani Tenge", LKR: "Sri Lankan Rupee",
  MAD: "Moroccan Dirham", MXN: "Mexican Peso", MYR: "Malaysian Ringgit", NGN: "Nigerian Naira",
  NOK: "Norwegian Krone", NPR: "Nepalese Rupee", NZD: "New Zealand Dollar", OMR: "Omani Rial",
  PEN: "Peruvian Sol", PHP: "Philippine Peso", PKR: "Pakistani Rupee", PLN: "Polish Złoty",
  QAR: "Qatari Riyal", RON: "Romanian Leu", RUB: "Russian Ruble", SAR: "Saudi Riyal",
  SEK: "Swedish Krona", SGD: "Singapore Dollar", THB: "Thai Baht", TRY: "Turkish Lira",
  TWD: "New Taiwan Dollar", TZS: "Tanzanian Shilling", UAH: "Ukrainian Hryvnia", UGX: "Ugandan Shilling",
  USD: "United States Dollar", UYU: "Uruguayan Peso", VND: "Vietnamese Dong", VUV: "Vanuatu Vatu",
  XAF: "Central African CFA Franc", XCD: "East Caribbean Dollar", XOF: "West African CFA Franc",
  ZAR: "South African Rand", ZMW: "Zambian Kwacha", ZWD: "Zimbabwean Dollar"
};

let toCountry = "INR";
let fromCountry = "USD";
let currentRate = null;

for (const [key, value] of Object.entries(countryList)) {
  const option1 = document.createElement("option");
  option1.value = value;
  option1.textContent = key;
  defaultdropd1.appendChild(option1);

  if (key === "USD") {
    option1.selected = true;
  }

  const option2 = document.createElement("option");
  option2.value = value;
  option2.textContent = key;
  defaultdropd2.appendChild(option2);

  if (key === "INR") {
    option2.selected = true;
  }
}

function getCurrencyName(code) {
  return currencyNames[code] || code;
}

function updatePanelUI() {
  const fromCode = yourDropdown.options[yourDropdown.selectedIndex].textContent;
  const toCode = OutputDropdown.options[OutputDropdown.selectedIndex].textContent;

  fromCountry = fromCode;
  toCountry = toCode;

  fromCodeLabel.textContent = fromCode;
  toCodeLabel.textContent = toCode;
  fromDetails.textContent = getCurrencyName(fromCode);
  toDetails.textContent = getCurrencyName(toCode);
}

function updateFlag(event) {
  const currcode = event.target.value;
  const flagUrl = "https://flagsapi.com/" + currcode + "/flat/64.png";

  if (event.target.id === "YourDropdown") {
    yourimg.src = flagUrl;
    yourimg.alt = fromCountry + " flag";
  } else {
    outputimg.src = flagUrl;
    outputimg.alt = toCountry + " flag";
  }

  updatePanelUI();
  loadRate();
}

async function exchange(fromCurrency, toCurrency) {
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to fetch exchange rate.");
  }

  const data = await response.json();

  if (data.result !== "success" || !data.conversion_rate) {
    throw new Error(data["error-type"] || "Exchange rate unavailable.");
  }

  return data.conversion_rate;
}

function formatAmount(amount) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(amount);
}

async function loadRate() {
  updatePanelUI();
  rateStatus.textContent = "Fetching…";
  rateStatus.style.color = "#a69dff";

  try {
    currentRate = await exchange(fromCountry, toCountry);
    rateDisplay.textContent = `1 ${fromCountry} = ${formatAmount(currentRate)} ${toCountry}`;
    rateStatus.textContent = "Rate ready";
    rateStatus.style.color = "#63d8bf";

    if (input.value && Number(input.value) > 0) {
      display.textContent = formatAmount(Number(input.value) * currentRate);
    }
  } catch (error) {
    currentRate = null;
    rateDisplay.textContent = `1 ${fromCountry} = — ${toCountry}`;
    rateStatus.textContent = "Unavailable";
    rateStatus.style.color = "#ff8585";
    display.textContent = "—";
    console.error(error);
  }
}

async function buttonfunction() {
  const amount = Number(input.value);

  if (!amount || amount < 0) {
    input.value = 1;
  }

  btn.disabled = true;
  btn.querySelector("span:first-child").textContent = "Converting…";
  rateStatus.textContent = "Updating…";

  try {
    const exchangeRate = await exchange(fromCountry, toCountry);
    currentRate = exchangeRate;

    const finalAmount = exchangeRate * Number(input.value || 1);
    display.textContent = formatAmount(finalAmount);
    rateDisplay.textContent = `1 ${fromCountry} = ${formatAmount(exchangeRate)} ${toCountry}`;
    rateStatus.textContent = "Updated just now";
    rateStatus.style.color = "#63d8bf";
  } catch (error) {
    display.textContent = "—";
    rateStatus.textContent = "Try again";
    rateStatus.style.color = "#ff8585";
    console.error(error);
  } finally {
    btn.disabled = false;
    btn.querySelector("span:first-child").textContent = "Convert currency";
  }
}

function swapCurrencies() {
  const fromValue = yourDropdown.value;
  const toValue = OutputDropdown.value;

  yourDropdown.value = toValue;
  OutputDropdown.value = fromValue;

  yourimg.src = `https://flagsapi.com/${OutputDropdown.value}/flat/64.png`;
  outputimg.src = `https://flagsapi.com/${yourDropdown.value}/flat/64.png`;

  updatePanelUI();
  display.textContent = "—";
  loadRate();
}

defaultdropd1.addEventListener("change", updateFlag);
defaultdropd2.addEventListener("change", updateFlag);
swapBtn.addEventListener("click", swapCurrencies);
btn.addEventListener("click", buttonfunction);

input.addEventListener("input", () => {
  if (!currentRate || !input.value || Number(input.value) < 0) {
    display.textContent = "—";
    return;
  }

  display.textContent = formatAmount(Number(input.value) * currentRate);
});

updatePanelUI();
loadRate();
