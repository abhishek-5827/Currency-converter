const BASE_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("#exchangeBtn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


// Add currencies to dropdowns
for (let select of dropdowns) {

    for (let currCode in countryList) {

        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        // Default FROM = USD
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        }

        // Default TO = INR
        if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    // Change flag when currency changes
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}


// Update flag
const updateFlag = (element) => {

    let currCode = element.value;

    let countryCode = countryList[currCode];

    let newSrc =
        `https://flagsapi.com/${countryCode}/flat/64.png`;

    let img =
        element.parentElement.querySelector("img");

    img.src = newSrc;
};


// Update exchange rate
const updateExchangeRate = async () => {

    let amountInput =
        document.querySelector(".amount input");

    let amtVal = Number(amountInput.value);

    // If amount is empty or invalid
    if (!amtVal || amtVal < 1) {

        amtVal = 1;
        amountInput.value = 1;
    }

    let from = fromCurr.value.toLowerCase();
    let to = toCurr.value.toLowerCase();

    try {

        // Current API format:
        // /currencies/usd.json

        const URL =
            `${BASE_URL}/${from}.json`;

        console.log("API URL:", URL);

        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        let data = await response.json();

        console.log("API Response:", data);

        // Example:
        // data.usd.inr

        let rate = data[from][to];

        if (!rate) {
            throw new Error("Exchange rate not found");
        }

        let finalAmount = amtVal * rate;

        msg.innerText =
            `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

    } catch (error) {

        console.error("Currency conversion error:", error);

        // Fallback API
        try {

            const fallbackURL =
                `https://latest.currency-api.pages.dev/v1/currencies/${from}.json`;

            console.log("Trying fallback:", fallbackURL);

            let response = await fetch(fallbackURL);

            if (!response.ok) {
                throw new Error("Fallback API failed");
            }

            let data = await response.json();

            let rate = data[from][to];

            let finalAmount = amtVal * rate;

            msg.innerText =
                `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

        } catch (fallbackError) {

            console.error("Fallback error:", fallbackError);

            msg.innerText =
                "Unable to get exchange rate. Please try again.";
        }
    }
};


// Button click
btn.addEventListener("click", () => {

    updateExchangeRate();

});


// Page load
window.addEventListener("load", () => {

    updateFlag(fromCurr);
    updateFlag(toCurr);

    updateExchangeRate();

});