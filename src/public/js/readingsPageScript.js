const socket = io();

const chartDiv = document.getElementById('chart-data');
const labels = JSON.parse(chartDiv.dataset.labels);
const tempData = JSON.parse(chartDiv.dataset.temp);
const humData = JSON.parse(chartDiv.dataset.hum);
const deviceId = Number(chartDiv.dataset.deviceid);

const ctx = document.getElementById('chart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels.reverse(),
        datasets: [
            {
                label: 'Độ ẩm (%)',
                data: humData.reverse(),
                borderColor: 'blue',
                fill: false
            },
            {
                label: 'Nhiệt độ (°C)',
                data: tempData.reverse(),
                borderColor: 'red',
                fill: false,
                tension: 0.3
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    tooltipFormat: 'HH:mm:ss'
                },
                title: { display: true, text: 'Thời gian' }
            },
            y: {
                title: { display: true, text: 'Giá trị' }
            }
        }
    }
});

socket.on('new-reading', (data) => {
    console.log("Dữ liệu mới:", data);

    if (data.device_id === deviceId) {
        // update mảng dữ liệu
        labels.push(data.ts);
        tempData.push(data.temperature);
        humData.push(data.humidity);

        // xóa đi dữ liệu đầu
        labels.shift();
        tempData.shift();
        humData.shift();

        // vẽ bảng
        const table = document.querySelector("table");
        const row = table.insertRow(1);
        row.innerHTML = `
                    <td>${data.ts}</td>
                    <td>${data.temperature}</td>
                    <td>${data.humidity}</td>
                    <td>${data.light}</td>
                    <td>${data.noise}</td>
                `;
        table.deleteRow(table.rows.length - 1); // xóa row cuối

        // ve chart       
        myChart.update();
    }
});