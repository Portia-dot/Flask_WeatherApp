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


class DataManager:
    def __init__(self):
        self.open_weather_api = None
        self.geo_coding_url = None
        self.city_name = None
        self.weather_data = None
        self.api_key = api_key
        self.lat = None
        self.lon = None
        self.exclude = 'current'
        self.state = None
        self.country = None

    def fetch_geocoding_data(self):
        self.geo_coding_url = f'http://api.openweathermap.org/geo/1.0/direct?q={self.city_name}&limit={1}&appid={self.api_key}'
        response = fetch_data(self.geo_coding_url)
        if not response:
            return None, None
        try:
            self.lat = response[0]['lat']
            self.lon = response[0]['lon']
            self.state = response[0]['state'] if 'state' in response[0] else None
            self.country = response[0]['country']
        except (IndexError, KeyError):
            return None, None, None, None
        return self.lat, self.lon, self.state, self.country


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

    def get_weather_by_city(self, city_name):
        self.city_name = city_name
        lat_lon = self.fetch_geocoding_data()
        if not lat_lon :
            return None
        self.fetch_weather_data()
        return self.weather_data
