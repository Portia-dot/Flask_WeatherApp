import json
import os
import time

#Global Cache

cached_data = None
last_updated = 0
CACHE_DURATION = 3 * 3000
CACHE_FILE_NAME = 'cache_weather.json'


def load_cache_file():
    if os.path.exists(CACHE_FILE_NAME):
        with open(CACHE_FILE_NAME, 'r') as file:
            try:
                data = json.load(file)
                if time.time() - data['last_updated'] < CACHE_DURATION:
                    return data
            except json.JSONDecodeError:
                print('Error Decoding JSON in cache file')
                pass
            except KeyError:
                print('Key Error in cache file')
                pass
    return None

def save_cache_file(data, name):
    data_to_cache = {
        'last_updated': time.time(),
        'data': data,
    }
    with open(name, 'w') as file:
        json.dump(data_to_cache, file)