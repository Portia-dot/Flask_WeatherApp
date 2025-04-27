from flask import Flask, render_template, request, redirect
from data import DataManager

data_manager = DataManager()

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def home():
    city_info = None
    weather = None
    if request.method == 'POST':
        city = request.form.get('user_search')
        weather = data_manager.get_weather_by_city(city_name= city)

        #City Info
        city_info = {
            'city': data_manager.city_name,
            'state': data_manager.state,
            'country': data_manager.country
        }
        if not weather:
            return redirect('/error')
        print(weather)
    return render_template('index.html', city_info=city_info, weather=weather)


@app.route('/error')
def error():
    return render_template('error.html')
if __name__ == '__main__':
    app.run(debug=True)
