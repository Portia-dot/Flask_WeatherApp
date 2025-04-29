document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    const chartContainers = document.querySelectorAll('.weather-forecast-chart');
    const listView = document.querySelector('.forecast-list-view');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Hide all charts
            chartContainers.forEach(chart => chart.classList.remove('active'));

            // Show the corresponding chart based on tab index
            const tabText = this.textContent.trim().toLowerCase();

            // Hide list view and show charts container
            listView.style.display = 'none';
            document.querySelector('.forecast-charts-container').style.display = 'block';

            // Show the appropriate chart based on the tab text
            if (tabText === 'overview') {
                document.getElementById('overview-chart').classList.add('active');
            } else if (tabText === 'precipitation') {
                document.getElementById('precipitation-chart').classList.add('active');
            } else if (tabText === 'wind') {
                document.getElementById('wind-chart').classList.add('active');
            } else if (tabText === 'air quality') {
                document.getElementById('air-quality-chart').classList.add('active');
            } else if (tabText === 'humidity') {
                document.getElementById('humidity-chart').classList.add('active');
            } else if (tabText === 'cloud cover') {
                document.getElementById('cloud-cover-chart').classList.add('active');
            }
        });
    });

    // Toggle buttons for Chart/List view
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const forecastChartsContainer = document.querySelector('.forecast-charts-container');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const viewType = this.textContent.trim().toLowerCase();

            if (viewType === 'chart') {
                forecastChartsContainer.style.display = 'block';
                listView.style.display = 'none';
            } else if (viewType === 'list') {
                forecastChartsContainer.style.display = 'none';
                listView.style.display = 'block';

                // Generate list items if they don't exist
                if (listView.querySelector('.forecast-list-container').children.length === 0) {
                    generateForecastListItems();
                }
            }
        });
    });

    // Initialize all charts
    initTemperatureChart();
    initPrecipitationChart();
    initWindChart();
    initAirQualityChart();
    initHumidityChart();
    initCloudCoverChart();

    // Initialize map
    initMap();
});

// Common functions
function generateTimeLabels() {
    const labels = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = 0; i < 13; i++) {
        const hour = (currentHour + i * 2) % 24;
        const formattedHour = i === 0 ? 'Now' : `${hour}:00`;
        labels.push(formattedHour);
    }

    return labels;
}




function addWeatherIcons(container, icons, values, unit = '') {
    // Create container for icons
    const iconContainer = document.createElement('div');
    iconContainer.className = 'weather-icons-container';

    // Add icons
    icons.forEach((icon, index) => {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'weather-icon';

        const iconElement = document.createElement('i');
        iconElement.className = `fas fa-${icon}`;

        const valueLabel = document.createElement('div');
        valueLabel.className = 'temp-label';
        valueLabel.textContent = `${values[index]}${unit}`;

        iconWrapper.appendChild(iconElement);
        iconWrapper.appendChild(valueLabel);
        iconContainer.appendChild(iconWrapper);
    });

    container.appendChild(iconContainer);
}

function addNowIndicator(container) {
    // Create indicator line
    const indicator = document.createElement('div');
    indicator.className = 'now-indicator';

    // Create "Now" label
    const label = document.createElement('div');
    label.className = 'now-label';
    label.textContent = 'Now';

    container.appendChild(indicator);
    container.appendChild(label);
}

// Function to generate forecast list items
function generateForecastListItems() {
    const listContainer = document.querySelector('.forecast-list-container');
    const timeLabels = generateTimeLabels();

    // Hardcoded temperature data
    const temperatureData = [22.5, 24.1, 25.7, 26.3, 25.8, 24.2, 22.9, 21.5, 20.1, 19.3, 18.7, 18.2, 17.9];

    // Hardcoded weather icons based on temperature
    const weatherIcons = ['sun', 'sun', 'sun', 'cloud-sun', 'cloud-sun', 'cloud', 'cloud', 'cloud-rain', 'cloud-rain', 'cloud-showers-heavy', 'cloud-showers-heavy', 'cloud', 'cloud'];

    // Clear existing items
    listContainer.innerHTML = '';

    // Create list items
    timeLabels.forEach((time, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'forecast-list-item';

        const timeElement = document.createElement('div');
        timeElement.className = 'forecast-list-time';
        timeElement.textContent = time;

        const iconElement = document.createElement('div');
        iconElement.className = 'forecast-list-icon';
        const icon = document.createElement('i');
        icon.className = `fas fa-${weatherIcons[index]}`;
        iconElement.appendChild(icon);

        const tempElement = document.createElement('div');
        tempElement.className = 'forecast-list-temp';
        tempElement.textContent = `${temperatureData[index]}°C`;

        listItem.appendChild(timeElement);
        listItem.appendChild(iconElement);
        listItem.appendChild(tempElement);

        listContainer.appendChild(listItem);
    });
}


// Precipitation Chart
function initPrecipitationChart() {
    const ctx = document.getElementById('precipitationChart').getContext('2d');
    const chartContainer = document.getElementById('precipitation-chart').querySelector('.chart-container');
    const timeLabels = generateTimeLabels();

    // Hardcoded precipitation data (0-100%)
    const precipitationData = [10, 15, 25, 45, 65, 70, 55, 40, 30, 20, 15, 10, 5];

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 119, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 119, 255, 0.1)');

    const chartConfig = {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Precipitation (%)',
                data: precipitationData,
                borderColor: '#0077ff',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#0077ff',
                pointBorderColor: '#0077ff',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(22, 27, 34, 0.9)',
                    titleColor: '#f0f6fc',
                    bodyColor: '#f0f6fc',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Precipitation: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: { size: 12 }
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: { size: 12 },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    };

    const precipitationChart = new Chart(ctx, chartConfig);

    // Add icons based on precipitation values
    const icons = precipitationData.map(value => {
        if (value < 20) return 'sun';
        if (value < 40) return 'cloud-sun';
        if (value < 60) return 'cloud';
        if (value < 80) return 'cloud-rain';
        return 'cloud-showers-heavy';
    });

    addWeatherIcons(chartContainer, icons, precipitationData, '%');
    addNowIndicator(chartContainer);
}

// Wind Chart
function initWindChart() {
    const ctx = document.getElementById('windChart').getContext('2d');
    const chartContainer = document.getElementById('wind-chart').querySelector('.chart-container');
    const timeLabels = generateTimeLabels();

    // Hardcoded wind data (0-50 km/h)
    const windData = [15, 18, 22, 25, 30, 35, 32, 28, 25, 20, 18, 15, 12];

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 200, 100, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 200, 100, 0.1)');

    const chartConfig = {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Wind Speed (km/h)',
                data: windData,
                borderColor: '#00c864',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#00c864',
                pointBorderColor: '#00c864',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(22, 27, 34, 0.9)',
                    titleColor: '#f0f6fc',
                    bodyColor: '#f0f6fc',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Wind Speed: ${context.parsed.y} km/h`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: { size: 12 }
                    }
                },
                y: {
                    min: 0,
                    max: 50,
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: { size: 12 },
                        callback: function(value) {
                            return value + ' km/h';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    };

    const windChart = new Chart(ctx, chartConfig);

    // Add wind icons
    const icons = windData.map(value => 'wind');

    addWeatherIcons(chartContainer, icons, windData, ' km/h');
    addNowIndicator(chartContainer);
}

// Air Quality Chart
function initAirQualityChart() {
    const ctx = document.getElementById('airQualityChart').getContext('2d');
    const chartContainer = document.getElementById('air-quality-chart').querySelector('.chart-container');
    const timeLabels = generateTimeLabels();

    // Hardcoded air quality data (1-5, where 1 is good and 5 is very poor)
    const airQualityData = [1.5, 1.8, 2.2, 2.5, 3.0, 3.2, 2.8, 2.5, 2.2, 2.0, 1.8, 1.5, 1.3];

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(255, 99, 132, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 99, 132, 0.1)');

    const chartConfig = {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Air Quality Index',
                data: airQualityData,
                borderColor: '#ff6384',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#ff6384',
                pointBorderColor: '#ff6384',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(22, 27, 34, 0.9)',
                    titleColor: '#f0f6fc',
                    bodyColor: '#f0f6fc',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            let quality = 'Unknown';
                            if (value <= 1) quality = 'Good';
                            else if (value <= 2) quality = 'Fair';
                            else if (value <= 3) quality = 'Moderate';
                            else if (value <= 4) quality = 'Poor';
                            else quality = 'Very Poor';
                            return `Air Quality: ${quality} (${value})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: { size: 12 }
                    }
                },
                y: {
                    min: 1,
                    max: 5,
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: { size: 12 },
                        callback: function(value) {
                            let quality = 'Unknown';
                            if (value <= 1) quality = 'Good';
                            else if (value <= 2) quality = 'Fair';
                            else if (value <= 3) quality = 'Moderate';
                            else if (value <= 4) quality = 'Poor';
                            else quality = 'Very Poor';
                            return quality;
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    };

    const airQualityChart = new Chart(ctx, chartConfig);

    // Add icons based on air quality values
    const icons = airQualityData.map(value => {
        if (value <= 1) return 'smile';
        if (value <= 2) return 'meh';
        if (value <= 3) return 'meh';
        if (value <= 4) return 'frown';
        return 'dizzy';
    });

    addWeatherIcons(chartContainer, icons, airQualityData, '');
    addNowIndicator(chartContainer);
}

// Humidity Chart
function initHumidityChart() {
    const ctx = document.getElementById('humidityChart').getContext('2d');
    const chartContainer = document.getElementById('humidity-chart').querySelector('.chart-container');
    const timeLabels = generateTimeLabels();

    // Hardcoded humidity data (30-100%)
    const humidityData = [65, 70, 75, 80, 85, 80, 75, 70, 65, 60, 55, 50, 45];

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(54, 162, 235, 0.7)');
    gradient.addColorStop(1, 'rgba(54, 162, 235, 0.1)');

    const chartConfig = {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Humidity (%)',
                data: humidityData,
                borderColor: '#36a2eb',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#36a2eb',
                pointBorderColor: '#36a2eb',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(22, 27, 34, 0.9)',
                    titleColor: '#f0f6fc',
                    bodyColor: '#f0f6fc',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Humidity: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: { size: 12 }
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: { size: 12 },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    };

    const humidityChart = new Chart(ctx, chartConfig);

    // Add icons based on humidity values
    const icons = humidityData.map(value => {
        if (value < 40) return 'sun';
        if (value < 60) return 'cloud-sun';
        if (value < 80) return 'cloud';
        return 'tint';
    });

    addWeatherIcons(chartContainer, icons, humidityData, '%');
    addNowIndicator(chartContainer);
}

// Cloud Cover Chart
function initCloudCoverChart() {
    const ctx = document.getElementById('cloudCoverChart').getContext('2d');
    const chartContainer = document.getElementById('cloud-cover-chart').querySelector('.chart-container');
    const timeLabels = generateTimeLabels();

    // Hardcoded cloud cover data (0-100%)
    const cloudCoverData = [20, 30, 45, 60, 75, 85, 70, 55, 40, 30, 25, 20, 15];

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(153, 102, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(153, 102, 255, 0.1)');

    const chartConfig = {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Cloud Cover (%)',
                data: cloudCoverData,
                borderColor: '#9966ff',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#9966ff',
                pointBorderColor: '#9966ff',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(22, 27, 34, 0.9)',
                    titleColor: '#f0f6fc',
                    bodyColor: '#f0f6fc',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Cloud Cover: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: { size: 12 }
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#8b949e',
                        font: { size: 12 },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    };

    const cloudCoverChart = new Chart(ctx, chartConfig);

    // Add icons based on cloud cover values
    const icons = cloudCoverData.map(value => {
        if (value < 20) return 'sun';
        if (value < 40) return 'cloud-sun';
        if (value < 70) return 'cloud';
        if (value < 90) return 'cloud-rain';
        return 'cloud-showers-heavy';
    });

    addWeatherIcons(chartContainer, icons, cloudCoverData, '%');
    addNowIndicator(chartContainer);
}

// Map initialization
function initMap() {
    // Fix map display issue by triggering a resize event after the map is loaded
    setTimeout(function() {
        if (window.map) {
            window.map.invalidateSize();
        }
    }, 100);
}
