let buttons1 = document.querySelectorAll(".wrapper1 button");
let buttons2 = document.querySelectorAll(".wrapper2 button");
let input1 = document.querySelector(".input1 input");
let input2 = document.querySelector(".input2 input");
let inputInfo1 = document.querySelector(".input-info1");
let inputInfo2 = document.querySelector(".input-info2");

let fromCurrency = "RUB";
let toCurrency = "USD";
let lastInput = "input1";

function updateInputValue(input) {
    let value = input.value;
    value = value.replace(/[^0-9,\.]/g, '');
    if (value.includes(',')) {
        value = value.replace(',', '.');
    }
    input.value = value;
}


function setupButtonGroup(buttons, setCurrencyCallback) {
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            setCurrencyCallback(btn.textContent);
        });
    });
}

let isConverting = false;

function convertCurrency() {
    if (fromCurrency === toCurrency) {
        input2.value = input1.value;
        inputInfo1.textContent = `1 ${fromCurrency} = 1 ${fromCurrency}`;
        inputInfo2.textContent = `1 ${toCurrency} = 1 ${toCurrency}`;
        return;
    }
    if (isConverting) return;
    isConverting = true;

    let amount = parseFloat(input1.value.replace(",", "."));
    if (isNaN(amount)) {
        input2.value = "";
        isConverting = false;
        return;
    }

    fetch(`https://v6.exchangerate-api.com/v6/ea56ee079232b55d83f4035c/latest/${fromCurrency}`)
        .then(res => res.json())
        .then(data => {
            let rate = data.conversion_rates[toCurrency];
            input2.value = (amount * rate).toFixed(2);
            inputInfo1.textContent = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
            inputInfo2.textContent = `1 ${toCurrency} = ${(1 / rate).toFixed(4)} ${fromCurrency}`;
        })
        .finally(() => {
            isConverting = false;
        });
}

function convertCurrency1() {
    if (fromCurrency === toCurrency) {
        input1.value = input2.value;
        inputInfo1.textContent = `1 ${fromCurrency} = 1 ${fromCurrency}`;
        inputInfo2.textContent = `1 ${toCurrency} = 1 ${toCurrency}`;
        return;
    }
    if (isConverting) return;
    isConverting = true;

    let amount = parseFloat(input2.value.replace(",", "."));
    if (isNaN(amount)) {
        input1.value = "";
        isConverting = false;
        return;
    }

    fetch(`https://v6.exchangerate-api.com/v6/ea56ee079232b55d83f4035c/latest/${toCurrency}`)
        .then(res => res.json())
        .then(data => {
            let rate = data.conversion_rates[fromCurrency];
            input1.value = (amount * rate).toFixed(2);
            inputInfo2.textContent = `1 ${toCurrency} = ${rate} ${fromCurrency}`;
            inputInfo1.textContent = `1 ${fromCurrency} = ${(1 / rate).toFixed(4)} ${toCurrency}`;
        })
        .finally(() => {
            isConverting = false;
        });
}

function initializeConversion() {
    if (fromCurrency === toCurrency) {
        inputInfo1.textContent = `1 ${fromCurrency} = 1 ${fromCurrency}`;
        inputInfo2.textContent = `1 ${toCurrency} = 1 ${toCurrency}`;
        return;
    }

    fetch(`https://v6.exchangerate-api.com/v6/ea56ee079232b55d83f4035c/latest/${fromCurrency}`)
        .then(res => res.json())
        .then(data => {
            let rate = data.conversion_rates[toCurrency];
            inputInfo1.textContent = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
            inputInfo2.textContent = `1 ${toCurrency} = ${(1 / rate).toFixed(4)} ${fromCurrency}`;
        });
}

setupButtonGroup(buttons1, val => {
    fromCurrency = val;
    if (lastInput === "input1") convertCurrency();
    else convertCurrency1();
    initializeConversion();
});

setupButtonGroup(buttons2, val => {
    toCurrency = val;
    if (lastInput === "input1") convertCurrency();
    else convertCurrency1();
    initializeConversion();
});

input1.addEventListener("input", () => {
    updateInputValue(input1);
    lastInput = "input1";
    convertCurrency();
});

input2.addEventListener("input", () => {
    updateInputValue(input2);
    lastInput = "input2";
    convertCurrency1();
});

initializeConversion();

const networkWarning = document.getElementById("network-warning");

function checkInternetConnection() {
    if (!navigator.onLine) {
        networkWarning.style.display = "block";
    } else {
        networkWarning.style.display = "none";
        if (lastInput === "input1") {
            convertCurrency();
        } else {
            convertCurrency1();
        }
    }
}

checkInternetConnection();

window.addEventListener("online", checkInternetConnection);
window.addEventListener("offline", checkInternetConnection);

const burgerMenu = document.querySelector('.burger-menu');
const container = document.querySelector('.container');

burgerMenu.addEventListener('click', () => {
    container.classList.toggle('show-menu');
});
