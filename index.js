import fetch from 'node-fetch'


let URL = "https://data.binance.com/api/v3/aggTrades?symbol=BTCUSDT&limit=1000"



const load = async () =>  {
    let response = await fetch(URL)
   return response.json();
}

load().then((data) => {
    let marketBuy = 0;
    let limitBuy = 0;
    
    data.forEach((element) => {
        if(element.m === true) {
            marketBuy += Number(element.q)
        } else {
            limitBuy += Number(element.q);
        }
        console.log(
            element.a,
          `${new Date(element.T).toDateString()} ${new Date(
            element.T
          ).toTimeString()}`
        );   
    });
    console.log(marketBuy-limitBuy)
})