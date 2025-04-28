from flask import Flask, render_template, request, redirect
from data import DataManager



app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def home():

    data_manager = DataManager()
    tile_url =  data_manager.get_precipitation_tile_url()

    # city_info = None
    # weather = None
    if request.method == 'POST':
        city = request.form.get('user_search')
        data_manager.city_name = city
    # else:
    #     data_manager.city_name = data_manager.city_name

    weather = data_manager.get_weather_by_city(city_name=data_manager.city_name)

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
    print(weather)
    return render_template('index.html', city_info=city_info, weather=weather, tile_url=tile_url)


@app.route('/error')
def error():
    return render_template('error.html')
if __name__ == '__main__':
    app.run(debug=True)
