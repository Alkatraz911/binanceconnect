const ctx = document.querySelector("#myChart");

const getData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

const dataArr = getData("http://localhost:3000/aggTrades/BTC-USDT/1H");
dataArr.then((data) => {
  const labels = [];
  data.forEach((element) => {
    labels.push(Object.values(element)[0]);
  });

  const delta = [];
  data.forEach((element) => {
    delta.push(Object.values(element)[1]);
  });
  const dat = {
    labels: labels,
    datasets: [
      {
        label: "My First Dataset",
        data: delta,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  const config = {
    type: "line",
    data: dat,
  };
  const myChart = new Chart(ctx, config);
});
