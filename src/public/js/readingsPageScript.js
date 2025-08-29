const socket = io();

const chartDiv = document.getElementById('chart-data');
// const labels = JSON.parse(chartDiv.dataset.labels); // không cần nữa vì đã tạo api lấy data
// const tempData = JSON.parse(chartDiv.dataset.temp);
// const humData = JSON.parse(chartDiv.dataset.hum);
const deviceId = Number(chartDiv.dataset.deviceid);

let labels = [];
let tempData = [];
let humData = [];
let lightData = [];
let noiseData = [];

// Hàm load dữ liệu ban đầu từ API JSON
async function loadReadings() {
    const res = await fetch(`/api/v1/readings/${deviceId}`);
    const data = await res.json();

    // data là mảng readings từ server
    labels = data.map(r => r.ts).reverse();
    tempData = data.map(r => r.temperature).reverse();
    humData = data.map(r => r.humidity).reverse();
    lightData = data.map(r => r.light).reverse();
    noiseData = data.map(r => r.noise).reverse();

    initChart();
    initTable(data);
    updateAlert();
}

function initChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: '🌡️ Nhiệt độ (°C)',
                    data: tempData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: '💧 Độ ẩm (%)',
                    data: humData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: '💡 Ánh sáng',
                    data: lightData,
                    borderColor: 'rgba(255, 206, 86, 1)',     // vàng
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    fill: false,
                    tension: 0.3,
                    yAxisID: 'y1'  // vẽ trên trục phụ
                },
                {
                    label: '🔊 Tiếng ồn',
                    data: noiseData,
                    borderColor: 'rgba(75, 192, 192, 1)',     // xanh ngọc
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.3,
                    yAxisID: 'y1'  // vẽ trên trục phụ
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'minute', tooltipFormat: 'HH:mm:ss' },
                    title: { display: true, text: 'Thời gian' }
                },
                y: {
                    position: 'left',
                    title: { display: true, text: 'Nhiệt độ / Độ ẩm' }
                },
                y1: {
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Ánh sáng / Tiếng ồn' }
                }
            }
        }
    });
}

function initTable(data) {
    const table = document.querySelector("table");
    data.forEach(r => {
        const row = table.insertRow(-1);
        row.innerHTML = `
        <td>${r.ts}</td>
        <td>${r.temperature}</td>
        <td>${r.humidity}</td>
        <td>${r.light}</td>
        <td>${r.noise}</td>
      `;
    });
}

// Kiểm tra ngưỡng và hiển thị cảnh báo
function updateAlert() {
    const alertBox = document.getElementById("alert-box");
    if (!alertBox) return;

    const lastTemp = tempData[tempData.length - 1];
    const lastHum = humData[humData.length - 1];

    if (lastTemp == null || lastHum == null) {
        alertBox.textContent = ""; // chưa có dữ liệu
        return;
    }

    if (lastTemp > 30) {
        alertBox.innerHTML = `
    <div class="alert alert-danger" role="alert">
      ⚠️ Nhiệt độ quá cao: ${lastTemp}°C
    </div>`;
    } else if (lastHum < 30) {
        alertBox.innerHTML = `
    <div class="alert alert-warning" role="alert">
      ⚠️ Độ ẩm thấp: ${lastHum}%
    </div>`;
    } else {
        alertBox.innerHTML = "";
    }

}

socket.on('new-reading', (data) => {
    console.log("Dữ liệu mới:", data);

    if (data.device_id === deviceId) {
        // update mảng dữ liệu
        labels.push(data.ts);
        tempData.push(data.temperature);
        humData.push(data.humidity);
        lightData.push(data.light);
        noiseData.push(data.noise);

        // xóa đi dữ liệu đầu
        labels.shift();
        tempData.shift();
        humData.shift();
        lightData.shift();
        noiseData.shift();

        // update chart
        window.myChart.update();

        // update bảng
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

    }
});

// Gọi hàm load khi trang vừa mở
loadReadings();


