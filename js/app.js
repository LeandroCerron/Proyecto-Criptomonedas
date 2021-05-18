const criptocurrenciesSelect = document.querySelector('#criptocurrencies');
const currencySelect = document.querySelector('#currency');
const result = document.querySelector('#resultado');
const form = document.querySelector('#formulario'); 

const searchObj = {
    currency: '',
    criptocurrencies: ''
}

const getCryptocurrencies = criptocurrencies => new Promise( resolve => {
    resolve(criptocurrencies);
});

document.addEventListener('DOMContentLoaded', () => {
    consultCryptocurrencies();
    form.addEventListener('submit', submitForm);
    criptocurrenciesSelect.addEventListener('change', readValue);
    currencySelect.addEventListener('change', readValue);
});

async function consultCryptocurrencies(){
    const url= 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try { 
        const answer = await fetch(url);
        const result = await answer.json();
        const criptocurrencies = await getCryptocurrencies(result.Data);
        SelecCriptocurrencies(criptocurrencies); 
    } catch (error) {
        console.log(error);
    }
}

function SelecCriptocurrencies(criptocurrencies){
    criptocurrencies.forEach( cripto => {
        const { CoinInfo: { FullName, Name }/* RAW: { USD: { PRICE, HIGH24HOUR } }*/ } = cripto;
        
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptocurrenciesSelect.appendChild(option);
    })
}

function readValue(e){
    searchObj[e.target.name] = e.target.value;
}

function submitForm(e){
    e.preventDefault();
    const { currency, criptocurrencies } = searchObj;
    validateFieldForm(currency, criptocurrencies);
}

function validateFieldForm(currency, criptocurrencies){
    if(currency === '' || criptocurrencies === ''){        
        showAlert('All fields in the form must be completed');
    }else{
        //consultar la API con los resultados
        consultAPI();
    }
}

function showAlert(message){
    cleanHTML();
    const existingError = document.querySelector('.existingError');
    if (!existingError) {
        const divMessage = document.createElement('p');
        divMessage.classList.add('error', 'existingError');
        divMessage.textContent = message;

        form.appendChild(divMessage);
        setTimeout(() => {
            divMessage.remove();
        }, 3000);   
    }
}

async function consultAPI(){
    const { currency, criptocurrencies } = searchObj;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptocurrencies}&tsyms=${currency}`;

    showSpinner();

    try {
        const answer = await fetch(url);
        const quotation = await answer.json();
        showQuotationHTML(quotation.DISPLAY[criptocurrencies][currency]);
    } catch (error) {
        console.log(error);
    }
}

function showQuotationHTML(quotation){
    cleanHTML();
    const { CHANGEPCT24HOUR, HIGHDAY, LOWDAY, PRICE, LASTUPDATE } = quotation;

    const price = document.createElement('p');
    price.classList.add('precio');
    price.innerHTML = `The price is: <span>${PRICE}</span>`;
    
    const highday = document.createElement('p');
    highday.innerHTML = `The highest price of the day: <span>${HIGHDAY}</span>`;

    const lowday = document.createElement('p');
    lowday.innerHTML = `The lowest price of the day: <span>${LOWDAY}</span>`;

    const changePct24Hour = document.createElement('p');
    changePct24Hour.innerHTML = `Variation of the last 24 hours: <span>${CHANGEPCT24HOUR}%</span>`;

    const lastUpdate = document.createElement('p');
    lastUpdate.innerHTML = `Last update: <span>${LASTUPDATE}</span>`;

    result.appendChild(price);
    result.appendChild(highday);
    result.appendChild(lowday);
    result.appendChild(changePct24Hour);
    result.appendChild(lastUpdate);
}

function cleanHTML(){
    while(result.firstChild){
        result.removeChild(result.firstChild);
    }
}

function showSpinner(){
    cleanHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    result.appendChild(spinner);
}