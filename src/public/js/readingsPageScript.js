const socket = io();

const chartDiv = document.getElementById('chart-data');
// const labels = JSON.parse(chartDiv.dataset.labels); // không cần nữa vì đã tạo api lấy data
// const tempData = JSON.parse(chartDiv.dataset.temp);
// const humData = JSON.parse(chartDiv.dataset.hum);
const deviceId = Number(chartDiv.dataset.deviceid);

let labels = [];
let tempData = [];
let humData = [];

// Hàm load dữ liệu ban đầu từ API JSON
async function loadReadings() {
    const res = await fetch(`/api/v1/readings/${deviceId}`);
    const data = await res.json();

    // data là mảng readings từ server
    labels = data.map(r => r.ts).reverse();
    tempData = data.map(r => r.temperature).reverse();
    humData = data.map(r => r.humidity).reverse();

    initChart();
    initTable(data);
    updateAlert();
}

function initChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Độ ẩm (%)',
                    data: humData,
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'Nhiệt độ (°C)',
                    data: tempData,
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

    // Hiển thị giá trị cuối (nếu bạn muốn thấy luôn)
    // alertBox.textContent = `${lastTemp}`;

    if (lastTemp > 30) {
        alertBox.innerHTML = `<p style="color:red;">⚠️ Cảnh báo: Nhiệt độ quá cao (${lastTemp}°C)</p>`;
    } else if (lastHum < 30) {
        alertBox.innerHTML = `<p style="color:orange;">⚠️ Cảnh báo: Độ ẩm thấp (${lastHum}%)</p>`;
    } else {
        alertBox.innerHTML = ""; // không cảnh báo
    }
}

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


