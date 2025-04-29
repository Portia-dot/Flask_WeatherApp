from flask import Flask, render_template, request, redirect
from data import DataManager
from google_gen_ai import get_weather_summary
from cache import load_cache_file, save_cache_file


app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def home():
    data_manager = DataManager()
    tile_url = data_manager.get_precipitation_tile_url()
    cached_data = load_cache_file()

    if cached_data:
        return render_template('index.html', **cached_data['data'])

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

    #24 hour data

    twenty_four_hour_data = data_manager.get_24_hours_data()

    if not weather:
        return redirect('/error')
    pay_load = {
        'city_info': city_info,
        'weather': weather,
        'tile_url': tile_url,
        'weather_ai': weather_ai,
        'hourly': twenty_four_hour_data,
    }

    save_cache_file(pay_load, 'cache_weather.json')
    return render_template('index.html', **pay_load)


@app.route('/error')
def error():
    return render_template('error.html')

@app.route('/map')
def open_map():
    return 'Working on the map'
if __name__ == '__main__':
    app.run(debug=True)
