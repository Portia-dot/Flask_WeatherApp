from flask import Flask, render_template, request
from data import DataManager

data_manager = DataManager()

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        city = request.form.get('user_search')
        weather = data_manager.get_weather_by_city(city_name= city)
        return render_template('index.html', city=city, weather=weather)
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
