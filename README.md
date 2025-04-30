# Weather App UI

A modern weather app homepage UI similar to the Windows Weather app, implemented using HTML, CSS, and Flask.

## Features

- **Dark Mode Theme**: Deep blue background with yellow accents
- **Responsive Design**: Scales between 768px and 1080px width
- **Top Bar**: Location name, current temperature, weather condition, and search box
- **Middle Section**:
  - Left panel: Current weather info (temperature, feels like, air quality, humidity, wind, UV index, pressure, visibility, dew point)
  - Center panel: Interactive map showing precipitation / live weather
  - Right panel: AI-generated weather summary
- **Weather Charts**: Interactive charts for temperature, precipitation, wind, air quality, humidity, and cloud cover
- **Toggle Views**: Switch between chart and list views for detailed hourly forecasts
- **7-Day Forecast**: Dynamic forecast cards with weather icons based on conditions
- **Real-time Data**: Integration with OpenWeatherMap API for accurate weather information
- **Caching System**: Local caching to reduce API calls and improve performance

## Screenshots

![Weather App Screenshot 1](static/images/Screenshot%202025-04-29%20173336.png)
*Main weather dashboard showing current conditions and forecast*

![Weather App Screenshot 2](static/images/Screenshot%202025-04-29%20173349.png)
*Detailed weather information with charts*

![Weather App Screenshot 3](static/images/Screenshot%202025-04-29%20173454.png)
*7-day forecast view with weather conditions*



## Getting Started

### Prerequisites

- Python 3.6 or higher
- Flask

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Navigate to the project directory
```
cd WeatherApp
```

3. Create and activate a virtual environment (optional but recommended)
```
python -m venv .venv
.venv\Scripts\activate  # On Windows
source .venv/bin/activate  # On macOS/Linux
```

4. Install the required packages
```
pip install flask python-dotenv requests
```

5. Set up environment variables
Create a `.env` file in the project root with the following content:
```
openweather_api=your_openweathermap_api_key
```
Replace `your_openweathermap_api_key` with your actual OpenWeatherMap API key.

### Running the Application

1. Run the Flask application
```
python app.py
```

2. Open your web browser and navigate to `http://127.0.0.1:5000/`

## Project Structure

```
WeatherApp/
├── app.py                  # Flask application
├── data.py                 # Weather data management
├── cache.py                # Caching system
├── google_gen_ai.py        # AI weather summary generation
├── .env                    # Environment variables (API keys)
├── cache_weather.json      # Cached weather data
├── static/                 # Static files
│   ├── css/                # CSS files
│   │   └── style.css       # Main stylesheet
│   ├── js/                 # JavaScript files
│   │   └── app.js          # Main JavaScript file
│   └── images/             # Image files and screenshots
└── templates/              # HTML templates
    ├── index.html          # Main page template
    └── error.html          # Error page template
```

## Future Enhancements

- User accounts for saving favorite locations
- Dark/light theme toggle
- Weather alerts and notifications
- Historical weather data visualization
- Additional weather data sources for comparison
- Mobile app version using a framework like React Native
- Voice commands for hands-free operation
- Weather-based recommendations (clothing, activities, etc.)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the Windows Weather app
- Weather icons from Font Awesome
