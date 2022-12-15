async function getSearchedStock() {
    let stockTicker = JSON.parse(sessionStorage.searchedStock)[0]['value'];
    console.log(stockTicker);
    
    let stockProfile = await callAPIForStockProfile(stockTicker);
    console.log(stockProfile);
    
    if(typeof stockProfile !== 'undefined' && Object.keys(stockProfile['assetProfile']).length !== 0 && stockProfile['assetProfile'].constructor === Object) {
        console.log("available");
        displayStockProfile(stockProfile);
        storeStockTickerAndPriceInSessionStorage(stockProfile);
    }
    else {
        console.log("not available");
        alertUserOfFalseStock();
    }
    
    $("#spinner-container").addClass("hide-content");
}

async function callAPIForStockProfile(stockTicker) {
    let url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile?symbol=" + stockTicker;
    console.log(url);
    
    try {
        const options = {
        	method: 'GET',
        	headers: {
        		'X-RapidAPI-Key': '4ae8272633msh96f000cec9d8311p14d2cfjsnad7c57c46a55',
        		'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        	}
        };
        let response = await fetch(url, options);
        return await response.json();
    }
    catch(error) {
        console.log(error);
    }
}

function displayStockProfile(stockProfile) {
    $("#company-name").html(stockProfile['quoteType']['shortName']);
    $("#current-price").html("$" + stockProfile['price']['regularMarketPrice']['fmt'] + " per share");
    $("#website").html(stockProfile['assetProfile']['website']);
    $("#website").attr('href', stockProfile['assetProfile']['website']);
    $("#address").html(stockProfile['assetProfile']['address1']);
    $("#phone").html(stockProfile['assetProfile']['phone']);
    $("#business-summary").html(stockProfile['assetProfile']['longBusinessSummary']);
    $("#company-and-purchase-details").removeClass("hide-content");
}

function storeStockTickerAndPriceInSessionStorage(stockProfile) {
    console.log(stockProfile);
    
    let stockSymbolAndPrice = {
        symbol: stockProfile['symbol'],
        openingPrice: stockProfile['price']['regularMarketOpen']['fmt'],
        price: stockProfile['price']['regularMarketPrice']['fmt'],
        sector: stockProfile['assetProfile']['sector']
    }
    
    console.log(stockSymbolAndPrice);
    
    sessionStorage.setItem("stockValuation", JSON.stringify(stockSymbolAndPrice));
    
    console.log("Symbol from session");
    console.log(JSON.parse(sessionStorage.stockValuation)['symbol']);
    
    console.log("Opening Price from session");
    console.log(JSON.parse(sessionStorage.stockValuation)['openingPrice']);
    
    console.log("Price from session")
    console.log(JSON.parse(sessionStorage.stockValuation)['price']);
    
    console.log("Sector from session")
    console.log(JSON.parse(sessionStorage.stockValuation)['sector']);
}

function alertUserOfFalseStock() {
    $("#nonexistent-alert").html("The stock ticker you searched with doesn't exist! (" + JSON.parse(sessionStorage.searchedStock)[0]['value'] + ")");
    $("#stock-search-fail-alert").removeClass("hide-content");
}

function processStockPurchase() {
    sessionStorage.setItem("buyOrSell", JSON.stringify(true));
    location.href = "../html/trade.html";
}

function logOut() {
    sessionStorage.clear();
    location.href = "../html/index.html";
}