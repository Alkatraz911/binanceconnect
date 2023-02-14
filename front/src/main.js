import 'bootstrap/dist/css/bootstrap.min.css';

const ctx = document.querySelector("#myChart");
let chart = null;

const getData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};


let baseUrl = "https://coolmining.site/delta/"



const renderChart = (tmfr) => {

  const data = getData(`${baseUrl}BTC/${tmfr}`);
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

          if(elementHour === 0) {
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


renderChart('1-H')

document.querySelector('.button-container').addEventListener('click', (e) => {
  chart.destroy()
  chart = renderChart(e.target.textContent)
})


