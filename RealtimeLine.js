

window.electronAPI.handlecontroller((event, registerValues) => {
    updateValue3 = registerValues[3];
    updateValue4 = registerValues[4];
    updateValue5 = registerValues[5];
});

const chartCanvas = document.getElementById('LineChart');

//setup block
const data = {
    datasets: [
        {
            data: [],
            borderColor: '#FFD700',
            backgroundColor: '#FFD700',
            borderWidth: 2
        },
        {
            data: [],
            borderColor: '#00FF7F',
            backgroundColor: '#00FF7F',
            borderWidth: 2
        },
        {
            data: [],
            borderColor: '#1E90FF',
            backgroundColor: '#1E90FF',
            borderWidth: 2
        }
    ]
};

// config block
const config = {
    type: 'line',
    data,
    options: {
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    onRefresh: chart => {
                        chart.data.datasets.forEach((dataset, index) => {
                             // Replace with your desired updateValue
                            let y;
                            if (index === 0) {
                                y = updateValue3;
                            } else if (index === 1) {
                                y = updateValue4;
                            } else if (index === 2) {
                                y = updateValue5;
                            }
                            dataset.data.push({
                                x: Date.now(),
                                y
                            });
                        });
                    },
                    delay: 2000
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(201, 203, 207, 0.1)'
                }
            }
        },
        plugins: {
            legend: {
                position:'bottom',
                display: true, // Set to true to display the legend
                labels: {
                    font: {
                        size: 14 // Adjust the font size for the legend labels
                    }
                }
            },
            tooltip: {
                enabled: true
            }
        },
        animation: {
            duration: 1000
        },
        maintainAspectRatio: false,
        responsive: true
    }
};

// render init block
const liveChart = new Chart(chartCanvas, config);
