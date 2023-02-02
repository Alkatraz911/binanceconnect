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
      if (hours === 1) {
        labels.push(element.hour)
      } else {
        if (element.hour.split('').length > 2) {
          Number(element.hour.split('')[0] + element.hour.split('')[1]) % hours === 0 ? labels.push(element.hour) : null;
        } else {
          Number(element.hour.split('')[0]) % hours === 0 ? labels.push(element.hour) : null;
        }
      }

    });

    const delta = [];
    data.forEach((element, index) => {
      if (hours === 1) {
        delta.push(element.delta);
      } else {
        if (element.hour.split('').length > 2) {
          if (Number(element.hour.split('')[0] + element.hour.split('')[1]) % hours === 0) {
            let delt = 0

            for (let i = 1; i <= hours; i++) {
              
              if (index - i > 0) {
                delt += data[index - i].delta
              } 
            }

            delta.push(delt)
          }
        } else {
          if (Number(element.hour.split('')[0]) % hours === 0) {
            let delt = 0
            for (let i = 1; i <= hours; i++) {
              if (index - i > 0) 
              delt += data[index - i].delta
            }
            delta.push(delt)
          }
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


