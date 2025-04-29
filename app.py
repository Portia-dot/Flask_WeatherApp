from flask import Flask, render_template, request, redirect
from data import DataManager
from google_gen_ai import get_weather_summary
import time

#Global Cache

cached_data = None
last_updated = 0
CACHE_DURATION = 3 * 3000

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def home():
    global cached_data, last_updated
    now = time.time()

    if cached_data is None or (now - last_updated) > CACHE_DURATION:
        data_manager = DataManager()
        tile_url =  data_manager.get_precipitation_tile_url()

        # city_info = None
        # weather = None
        if request.method == 'POST':
            city = request.form.get('user_search')
            data_manager.city_name = city

        weather, hourly = data_manager.get_weather_by_city(city_name=data_manager.city_name)
        if not hourly:
            return redirect('/error')
        weather_ai =  get_weather_summary(hourly)
            #City Info
        city_info = {
                'city': data_manager.city_name,
                'state': data_manager.state,
                'country': data_manager.country,
                'lat': data_manager.lat,
                'lon': data_manager.lon,
            }
        if not weather:
            return redirect('/error')
        return render_template('index.html', city_info=city_info, weather=weather, tile_url=tile_url, weather_ai=weather_ai)
    return None


@app.route('/error')
def error():
    return render_template('error.html')

@app.route('/map')
def open_map():
    return 'Working on the map'
if __name__ == '__main__':
    app.run(debug=True)
