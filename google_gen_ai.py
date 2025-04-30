import os
from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.environ.get('google_api_key')

client = genai.Client(api_key=api_key)


def get_weather_summary(content):
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=f'Summarize the next 4 hours\' weather details in a concise and informative report. Format it like this example: "Expect partly cloudy skies and a consistent temperature around 13-14°C. Winds will be light to moderate. Feels like temperatures will be slightly cooler at 11-13°C. No rain is expected. A light jacket is recommended for added comfort." Make it suitable for the \'Weather Report\' '
                     f'section of a website. The style should be short and easy to read, focusing on what to expect in the coming hours. Include '
                     f'information about sky conditions, temperature ranges, wind conditions, feels-like temperatures, precipitation expectations, and clothing recommendations based on the weather conditions, but do not break it down '
                     f'hour by hour. Keep it as a clear and practical summary.{content}'
        )
        return response.text
    except Exception as e:
        print(e)
        return 'There was an error loading the weather report. Please try again later.'
