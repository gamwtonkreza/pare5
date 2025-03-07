import datetime
import pandas as pd
import random
import json

# reroller
reroller = 12

# unique id for each day
def today_id() -> int:
    today = datetime.date.today()
    day = today.day + 1
    month = today.month
    year = today.year

    return reroller*year*10000 + month*100 + day

def acceptable_name(name: str) -> bool:
    print(product_name)
    return len(name) < 30

# read CSV_DATA/product_codes.csv
product_codes = pd.read_csv('CSV_DATA/product_codes.csv')

# initialize random machine with today_id
random.seed(today_id())

year = random.randint(1995, 2000)
while True:
    idx = random.randint(0, len(product_codes))
    product_code, product_name = product_codes.iloc[idx]
    if acceptable_name(product_name):
        break

# exports = pd.read_csv('CSV_DATA/exports.csv')
exports_full = pd.read_csv('CSV_DATA/exports_full.csv')
exports = exports_full[exports_full['year'] == year]
country_codes = pd.read_csv('CSV_DATA/country_codes.csv')
# country_codes_json = [row.country_name
#     for row in country_codes.itertuples()
#     ]

# with open("country_names.json", 'w') as f:
#     f.write(json.dumps(country_codes_json))

exports = exports[exports['product_code'] == product_code].drop(columns=['product_code'])

sum_of_top_5 = float(exports.sort_values(by='value')['value'][-5:].sum())

e = exports.merge(country_codes, on='country_code')

e.sort_values(by='value', inplace=True, ascending=False)

today_json = {
    "product_name": product_name,
    "year": year,
    "sum_of_top_5": sum_of_top_5,
    "exporters": [
        { "name": row.country_name, "value" : row.value }
        for row in e.itertuples()
    ]
}

with open('today.json', 'w') as f:
    f.write(json.dumps(today_json, indent=4))
