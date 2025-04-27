# Weather App UI

A modern weather app homepage UI similar to the Windows Weather app, implemented using HTML, CSS, and Flask.

## Features

- **Dark Mode Theme**: Deep blue background with yellow accents
- **Responsive Design**: Scales between 768px and 1080px width
- **Top Bar**: Location name, current temperature, weather condition, and search box
- **Middle Section**:
  - Left panel: Current weather info (temperature, feels like, air quality, humidity, wind, UV index, pressure, visibility, dew point)
  - Center panel: Map showing precipitation / live weather
  - Right panel: Information box
- **Tabs Section**: Categories like Overview, Precipitation, Wind, Air Quality, Humidity, Cloud cover
- **Forecast Section**: 7-day forecast cards with toggle for Chart vs List views
- **Hourly Graph**: Temperature trend visualization

## Screenshots

(Screenshots would be added here after running the application)

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
pip install flask
```

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
├── static/                 # Static files
│   ├── css/                # CSS files
│   │   └── style.css       # Main stylesheet
│   └── images/             # Image files (icons, etc.)
└── templates/              # HTML templates
    └── index.html          # Main page template
```

## Future Enhancements

- Integration with a weather API to display real weather data
- Adding more interactive features
- Implementing the chart/list toggle functionality
- Adding user preferences (location, temperature units, etc.)
- Implementing a responsive map with real precipitation data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the Windows Weather app
- Weather icons from Font Awesome