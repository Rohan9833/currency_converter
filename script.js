const Base_URL = "https://v6.exchangerate-api.com/v6/082f73d35e94ac3667538e22/pair/USD/INR";

const dropdown = document.querySelectorAll(".dropdownclass select");
const defaultdropd1 = document.querySelector("#YourDropdown");
const defaultdropd2 = document.querySelector("#OutputDropdown");
let yourimg = document.querySelector("#yourimg");
let outpurimg = document.querySelector("#outputimg");
const yourDropdown = document.querySelector("#YourDropdown");
const OutputDropdown = document.querySelector("#OutputDropdown");
const input = document.querySelector("#yourinput");
const btn = document.querySelector("#convert");
let fromcurr = document.querySelector(".from select")
let tocurr = document.querySelector(".to select");
const display = document.querySelector("#outputdisplayer");
let toCountry;
let fromCountry;









for (const [key,value] of Object.entries(countryList)) {
    const option1 = document.createElement("option");
    option1.value = value;
    option1.textContent = key;
    defaultdropd1.appendChild(option1);
    if(key === "USD"){
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

// Dropdown event listeners
defaultdropd1.addEventListener("change", changeflag);
defaultdropd2.addEventListener("change", changeflag);

// Set the initial selected countries on page load
function setInitialCountries() {
  const selectedOption = yourDropdown.options[yourDropdown.selectedIndex];
  fromCountry = selectedOption.textContent;
  const selectedoption2 = OutputDropdown.options[OutputDropdown.selectedIndex];
  toCountry = selectedoption2.textContent;

  console.log(`Initial selected: ${fromCountry} to ${toCountry}`);
  // Call exchange function with default values
  exchange(fromCountry, toCountry);
}

setInitialCountries(); // Call it to set initial values






function changeflag(event){
  let currcode = event.target.value;
  // console.log(currcode, event.target.id);
  if (event.target.id === "YourDropdown") {
    yourimg.src = "https://flagsapi.com/"+currcode+"/flat/64.png";
  } else if (event.target.id === "OutputDropdown") {
    outputimg.src = `https://flagsapi.com/${currcode}/flat/64.png`;
  }

  // getting the country name for exchange of input
  const selectedOption = yourDropdown.options[yourDropdown.selectedIndex];
  fromCountry = selectedOption.textContent;
  console.log(`Country selected in YourDropdown: ${fromCountry}`);
  // getting the country name for exchange of output
  const selectedoption2 = OutputDropdown.options[OutputDropdown.selectedIndex];
  toCountry = selectedoption2.textContent;
  console.log(`Country selected in OutputDropdown: ${toCountry}`);
  exchange(fromCountry,toCountry);
}

// fetch rate by api
async function exchange(fromCountry, toCountry) {
  // console.log(fromCountry, "from", toCountry, "to");
  const url = `https://v6.exchangerate-api.com/v6/082f73d35e94ac3667538e22/pair/${fromCountry}/${toCountry}`;
  let response = await fetch(url);

  let data = await response.json();
  let rate = data.conversion_rate;
  console.log(rate,"rateee");
  return rate;
}


async function buttonfunction(event){
  // if(!fromCountry|| !toCountry){
  //   alert("please select both country");
  //   return;
  // }

  if(input.value<1|| input.value === ""){
    input.value = 1;

  }

   const exchangeRate = await exchange(fromCountry, toCountry);
   console.log(input.value)
   finalamount = exchangeRate * input.value;
   if (exchangeRate) {
     console.log(`Exchange rate from ${fromCountry} to ${toCountry}: ${exchangeRate}`);
     display.innerText =finalamount;
   } else {
     alert("Failed to fetch exchange rate. Please try again.");
   }
}



btn.addEventListener("click" ,buttonfunction);









