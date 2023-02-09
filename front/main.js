const ctx = document.querySelector("#myChart");
let chart = null;

const getData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

const countDelta = (el, tmfr) => {



}

const changeTmfr = (el, tmfr) => {
  if (el.hour.split('').length > 2) {
    Number(el.hour.split('')[0] + el.hour.split('')[1]) % tmfr === 0 ? el.hour : null;
  } else {
    Number(el.hour.split('')[0]) % tmfr === 0 ? el.hour : null;
  }

}

let baseUrl = "http://10.8.0.4:4000/delta/"
const dataArr = getData(baseUrl + 'BTC');

const renderChart = (data, tmfr) => {

  let hours = Number(tmfr.split('-')[0])

  data.then((data) => {

    const labels = [];

    data.forEach((element) => {
      let date = new Date(Number(element.ts)).toLocaleDateString()
      let elementHour = new Date(Number(element.ts)).getHours()
      if (hours === 1) {
        
        if(elementHour === 0) {
          labels.push(date + ' ' + elementHour)
        } else {
          labels.push(elementHour)
        }
        
      } else {

          if(element.hour === '0H') {
            elementHour % hours === 0 ? labels.push(date + ' ' + elementHour) : null;
            
          } else {
            elementHour % hours === 0 ? labels.push(elementHour) : null;
          }
          
        }
    });

    const delta = [];
    data.forEach((element, index) => {
      let elementHour = new Date(Number(element.ts)).getHours()
      if (hours === 1) {
        delta.push(element.delta);
      } else {

          if (elementHour % hours === 0) {
            let delt = element.delta
            

            for (let i = 1; i < hours; i++) {
              let el = data[index-i]
              if (el) {
                let timeToCompare = new Date(Number(el.ts)).getHours()
                if (elementHour - timeToCompare <= hours) {
                  delt += data[index - i].delta           
                } else {
                  delt += 0
                }
              } else {
                delt = data[index].delta
              }
            }
            delta.push(delt)
          }
      }
    });

    const dat = {
      labels: labels,
      datasets: [
        {
          label: "Delta",
          data: delta,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
    


    const config = {
      type: "bar",
      data: dat,
      options: {
        backgroundColor: 'rgb(238, 75, 43)'
      }
    };

    chart = new Chart(ctx, config);

  });
}


renderChart(dataArr, '1-H')

document.querySelector('.button-container').addEventListener('click', (e) => {
  chart.destroy()
  chart = renderChart(getData(baseUrl + 'BTC'), e.target.textContent)
})


