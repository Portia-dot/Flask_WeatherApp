import os
from datetime import datetime
from dotenv import load_dotenv
import requests

load_dotenv()
api_key = os.environ.get("openweather_api")

# Function to fetch data from an API endpoint with error handling
def fetch_data(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return None
    except ValueError as e:
        print(f"Error parsing data: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None


# Function to convert temperature from Kelvin to Celsius
def convert_kelvin_to_celsius(kelvin_temp):
    return round(kelvin_temp - 273.15, 2)

# Function to convert wind speed from meters per second to kilometers per hour
def wind_speed_to_kph(m_s):
    return round(m_s * 3.6)

# Function to convert visibility from meters to kilometers
def visibility_to_km(m):
    return round(m / 1000, 2)

# Function to map cloud coverage percentage to descriptive labels
def map_cloud_percentage_to_label(clouds):
    if clouds <= 10:
        return 'Clear'
    elif clouds <= 30:
        return 'Few clouds'
    elif clouds <= 50:
        return 'Scattered clouds'
    elif clouds <= 70:
        return 'Broken clouds'
    elif clouds <= 80:
        return 'Overcast clouds'
    else:
        return None


# Class to manage weather data retrieval and processing from OpenWeatherMap API
class DataManager:
    # Initialize the DataManager with a default city name
    def __init__(self, city_name = 'Montreal'):
        self.open_weather_api = None
        self.geo_coding_url = None
        self.city_name = city_name
        self.weather_data = None
        self.api_key = api_key
        self.lat = None
        self.lon = None
        self.state = None
        self.country = None
        self.air_pollution_data = None
        # self.get_weather_by_city(self.city_name)
        self.layer_name = 'precipitation_new'
        self.hourly_data = []
        self.two_days_data = []
        self.seven_days_data = []


    # Method to fetch geographic coordinates for a city name
    def fetch_geocoding_data(self):
        self.geo_coding_url = f'http://api.openweathermap.org/geo/1.0/direct?q={self.city_name}&limit={1}&appid={self.api_key}'
        response = fetch_data(self.geo_coding_url)
        if not response:
            return None, None
        try:
            self.city_name = response[0]['name']
            self.lat = response[0]['lat']
            self.lon = response[0]['lon']
            self.state = response[0].get('state')
            self.country = response[0]['country']
        except (IndexError, KeyError):
            return None, None, None, None, None
        return self.city_name, self.lat, self.lon, self.state, self.country


    # Method to fetch weather data using latitude and longitude
    def fetch_weather_data(self):
        self.open_weather_api =  f'https://api.openweathermap.org/data/3.0/onecall?lat={self.lat}&lon={self.lon}&appid={self.api_key}'
        response = fetch_data(self.open_weather_api)
        if not response:
            return None
        try:
            self.weather_data = response
        except (IndexError, KeyError):
            return None
        return self.weather_data

    # Method to fetch air pollution data for the current location
    def get_air_pollution(self):
        api_url = f'http://api.openweathermap.org/data/2.5/air_pollution?lat={self.lat}&lon={self.lon}&appid={self.api_key}'
        response = fetch_data(api_url)
        if not response:
            return None
        try:
            air_pollution_data = response['list'][0]
        except (IndexError, KeyError):
            return None
        return air_pollution_data

    # Method to generate URL for precipitation map tiles
    def get_precipitation_tile_url(self):
        return f"https://tile.openweathermap.org/map/{self.layer_name}/{{z}}/{{x}}/{{y}}.png?appid={api_key}"

    # Method to get weather data for a specific city
    def get_weather_by_city(self, city_name):
        self.city_name = city_name
        lat_lon = self.fetch_geocoding_data()
        if not lat_lon or not self.lat or not self.lon :
            return None
        self.weather_data = self.fetch_weather_data()
        self.air_pollution_data = self.get_air_pollution()
        return self.get_current_weather(), self.get_hourly_weather()



    # Method to get hourly weather forecast for the next 4 hours
    def get_hourly_weather(self):
        if not self.weather_data:
            return None
        report = self.weather_data['hourly'][:4]
        four_hours_report = self.weather_data_returns(report, self.hourly_data)
        return four_hours_report

    # Method to get weather data for the next 24 hours (not implemented)
    def get_24_hours_data(self):
        if not self.weather_data:
            return None
        report = self.weather_data['hourly'][:24]
        two_day_report = self.weather_data_returns(report, self.two_days_data)
        return two_day_report

    # Method to get weather data for the next 7 days
    def get_seven_days(self):
        if not self.weather_data:
            return None
        report = self.weather_data['daily'][:7]
        for day in report:
            day_of_week = datetime.fromtimestamp(day['dt']).strftime('%a')
            self.seven_days_data.append({
                'timestamp': day_of_week,
                'temperature_high': round(convert_kelvin_to_celsius(day['temp']['max'])),
                'temperature_low': round(convert_kelvin_to_celsius(day['temp']['min'])),
                'humidity': day['humidity'],
            })
        return {
            'daily_data':self.seven_days_data,
        }
    # Method to process and format weather data for display
    def weather_data_returns(self, time_report, data_list_name = None):

        for report in time_report:
                data_list_name.append({
                    'timestamp': report['dt'],
                    'temperature': round(convert_kelvin_to_celsius(report['temp'])),
                    'humidity': report['humidity'],
                    'dew_point': round(convert_kelvin_to_celsius(report['dew_point'])),
                    'pressure': report['pressure'],
                    'wind': wind_speed_to_kph(report['wind_speed']),
                    'feels_like': round(convert_kelvin_to_celsius(report['feels_like'])),
                    'visibility': round(visibility_to_km(report['visibility'])),
                    'uvi': round(report['uvi']),
                    'clouds': map_cloud_percentage_to_label(report['clouds']),
                    'air_quality': self.get_current_air_quality(),
                })
        return {
            'hourly_data':data_list_name,
        }


    # Method to get and format current weather conditions
    def get_current_weather(self):
        if not self.weather_data:
            return None
        return {
            'temperature': round(convert_kelvin_to_celsius(self.weather_data['current']['temp'])),
            'humidity': self.weather_data['current']['humidity'],
            'dew_point': round(convert_kelvin_to_celsius(self.weather_data['current']['dew_point'])),
            'pressure': self.weather_data['current']['pressure'],
            'wind': wind_speed_to_kph(self.weather_data['current']['wind_speed']),
            'feels_like': round(convert_kelvin_to_celsius(self.weather_data['current']['feels_like'])),
            'visibility': round(visibility_to_km(self.weather_data['current']['visibility'])),
            'air_quality': self.get_current_air_quality(),
            'clouds': map_cloud_percentage_to_label(self.weather_data['current']['clouds']),
            'uvi': round(self.weather_data['daily'][0]['uvi']),

        }
    # Method to get current air quality index
    def get_current_air_quality(self):
        if not self.air_pollution_data:
            return None
        return {
            'air_quality': self.air_pollution_data['main']['aqi']
        }


