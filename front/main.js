const ctx = document.querySelector("#myChart");
let chart = null;

const getData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

let baseUrl = "http://10.8.0.4:4000/delta/"
const dataArr = getData(baseUrl + 'BTC');

const render = (data) => {
  data.then((data) => {
    const labels = [];
    data.forEach((element) => {
      labels.push(Object.values(element)[3]);
    });
  
    const delta = [];
    data.forEach((element) => {
      delta.push(Object.values(element)[4]);
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


render(dataArr)

document.querySelector('.button-container').addEventListener('click', (e) => {
  chart.destroy()
  chart = render(getData(baseUrl+e.target.textContent))
})


