import os

from dotenv import load_dotenv
import requests

load_dotenv()
api_key = os.environ.get("openweather_api")

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


def convert_kelvin_to_celsius(kelvin_temp):
    return round(kelvin_temp - 273.15, 2)

def wind_speed_to_kph(m_s):
    return round(m_s * 3.6)

def visibility_to_km(m):
    return round(m / 1000, 2)

class DataManager:
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
        self.get_weather_by_city(self.city_name)

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

    def get_weather_by_city(self, city_name):
        print(f'Called', city_name, 'for weather data')
        self.city_name = city_name
        lat_lon = self.fetch_geocoding_data()
        if not lat_lon or not self.lat or not self.lon :
            return None
        self.weather_data = self.fetch_weather_data()
        self.air_pollution_data = self.get_air_pollution()
        return self.get_current_weather()

    def get_current_weather(self):
        if not self.weather_data:
            return None
        return {
            'temperature': convert_kelvin_to_celsius(self.weather_data['current']['temp']),
            'humidity': self.weather_data['current']['humidity'],
            'dew_point': convert_kelvin_to_celsius(self.weather_data['current']['dew_point']),
            'pressure': self.weather_data['current']['pressure'],
            'wind': wind_speed_to_kph(self.weather_data['current']['wind_speed']),
            'feels_like': convert_kelvin_to_celsius(self.weather_data['current']['feels_like']),
            'visibility': visibility_to_km(self.weather_data['current']['visibility']),
            'air_quality': self.get_current_air_quality(),
            'clouds': self.weather_data['current']['clouds'],
            'uvi': self.weather_data['daily'][0]['uvi'],


        }
    def get_current_air_quality(self):
        if not self.air_pollution_data:
            return None
        return {
            'air_quality': self.air_pollution_data['main']['aqi']
        }