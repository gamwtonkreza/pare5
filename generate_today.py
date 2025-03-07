import datetime
import pandas as pd
import random
import json

# reroller
reroller = 13

def get_countries_by_year(year):
    """
    Returns a dictionary of country names and their codes valid for the specified year.
    Uses standard English country names without year ranges in the final output.
    
    Args:
        year (int): The year for which to get valid country codes
        
    Returns:
        dict: A dictionary with clean country names as keys and country codes as values
    """
    # Base dictionary of all countries and codes with English names
    all_countries = {
        "Afghanistan": 4, "Albania": 8, "Algeria": 12, "American Samoa": 16, "Andorra": 20, 
        "Angola": 24, "Antigua and Barbuda": 28, "Azerbaijan": 31, "Argentina": 32, 
        "Australia": 36, "Austria": 40, "Bahamas": 44, "Bahrain": 48, "Bangladesh": 50, 
        "Armenia": 51, "Barbados": 52, "Belgium": 56, "Belgium-Luxembourg (...1998)": 58, 
        "Bermuda": 60, "Bhutan": 64, "Bolivia": 68, 
        "Bosnia and Herzegovina": 70, "Botswana": 72, "Brazil": 76, "Belize": 84, 
        "British Indian Ocean Territory": 86, "Solomon Islands": 90, "British Virgin Islands": 92, 
        "Brunei": 96, "Bulgaria": 100, "Myanmar": 104, "Burundi": 108, 
        "Belarus": 112, "Cambodia": 116, "Cameroon": 120, "Canada": 124, "Cape Verde": 132, 
        "Cayman Islands": 136, "Central African Republic": 140, "Sri Lanka": 144, "Chad": 148, 
        "Chile": 152, "China": 156, "Christmas Island": 162, "Cocos Islands": 166, 
        "Colombia": 170, "Comoros": 174, "Mayotte": 175, "Congo": 178, 
        "Democratic Republic of the Congo": 180, "Cook Islands": 184, "Costa Rica": 188, "Croatia": 191, 
        "Cuba": 192, "Cyprus": 196, "Czechoslovakia (...1992)": 200, "Czech Republic": 203, 
        "Benin": 204, "Denmark": 208, "Dominica": 212, "Dominican Republic": 214, 
        "Ecuador": 218, "El Salvador": 222, "Equatorial Guinea": 226, "Ethiopia": 231, 
        "Eritrea": 232, "Estonia": 233, "Falkland Islands": 238, "Fiji": 242, 
        "Finland": 246, "France": 251, "French Polynesia": 258, "French Southern Antarctic Territories": 260, 
        "Djibouti": 262, "Gabon": 266, "Georgia": 268, "Gambia": 270, "Palestine": 275, 
        "Germany": 276, "East Germany (...1990)": 278, "West Germany (...1990)": 280, 
        "Ghana": 288, "Gibraltar": 292, "Kiribati": 296, "Greece": 300, "Greenland": 304, 
        "Grenada": 308, "Guam": 316, "Guatemala": 320, "Guinea": 324, "Guyana": 328, 
        "Haiti": 332, "Honduras": 340, "Hong Kong": 344, "Hungary": 348, 
        "Iceland": 352, "Indonesia": 360, "Iran": 364, "Iraq": 368, "Ireland": 372, 
        "Israel": 376, "Italy": 380, "Ivory Coast": 384, "Jamaica": 388, "Japan": 392, 
        "Kazakhstan": 398, "Jordan": 400, "Kenya": 404, "North Korea": 408, 
        "South Korea": 410, "Kuwait": 414, "Kyrgyzstan": 417, "Laos": 418, 
        "Lebanon": 422, "Lesotho": 426, "Latvia": 428, "Liberia": 430, "Libya": 434, 
        "Lithuania": 440, "Luxembourg": 442, "Macau": 446, "Madagascar": 450, 
        "Malawi": 454, "Malaysia": 458, "Maldives": 462, "Mali": 466, "Malta": 470, 
        "Mauritania": 478, "Mauritius": 480, "Mexico": 484, "Other Asia, nes": 490, 
        "Mongolia": 496, "Moldova": 498, "Montenegro": 499, "Montserrat": 500, 
        "Morocco": 504, "Mozambique": 508, "Oman": 512, "Namibia": 516, "Nauru": 520, 
        "Nepal": 524, "Netherlands": 528, "Netherlands Antilles (...2010)": 530, 
        "Curacao": 531, "Aruba": 533, "Saint Maarten": 534, "Bonaire": 535, 
        "New Caledonia": 540, "Vanuatu": 548, "New Zealand": 554, "Nicaragua": 558, 
        "Niger": 562, "Nigeria": 566, "Niue": 570, "Norfolk Island": 574, "Norway": 579, 
        "Northern Mariana Islands": 580, "Micronesia": 583, "Marshall Islands": 584, "Palau": 585, 
        "Pakistan": 586, "Panama": 591, "Papua New Guinea": 598, "Paraguay": 600, 
        "Peru": 604, "Philippines": 608, "Pitcairn": 612, "Poland": 616, "Portugal": 620, 
        "Guinea-Bissau": 624, "East Timor": 626, "Qatar": 634, "Romania": 642, 
        "Russia": 643, "Rwanda": 646, "Saint Barthélemy": 652, 
        "Saint Helena": 654, "Saint Kitts and Nevis": 659, "Anguilla": 660, 
        "Saint Lucia": 662, "Saint Pierre and Miquelon": 666, 
        "Saint Vincent and the Grenadines": 670, "San Marino": 674, 
        "Sao Tome and Principe": 678, "Saudi Arabia": 682, "Senegal": 686, "Serbia": 688, 
        "Seychelles": 690, "Sierra Leone": 694, "Europe EFTA, nes": 697, "India": 699, 
        "Singapore": 702, "Slovakia": 703, "Vietnam": 704, "Slovenia": 705, 
        "Somalia": 706, "South Africa": 710, "Southern African Customs Union (...1999)": 711, 
        "Zimbabwe": 716, "Spain": 724, "South Sudan": 728, "Sudan": 729, 
        "Sudan (...2011)": 736, "Suriname": 740, "Swaziland": 748, "Sweden": 752, 
        "Switzerland": 757, "Syria": 760, "Tajikistan": 762, "Thailand": 764, 
        "Togo": 768, "Tokelau": 772, "Tonga": 776, "Trinidad and Tobago": 780, 
        "United Arab Emirates": 784, "Tunisia": 788, "Turkey": 792, "Turkmenistan": 795, 
        "Turks and Caicos Islands": 796, "Tuvalu": 798, "Uganda": 800, "Ukraine": 804, 
        "Macedonia": 807, "USSR (...1990)": 810, "Egypt": 818, "United Kingdom": 826, 
        "Tanzania": 834, "USA": 842, "US Misc. Pacific Islands": 849, 
        "Burkina Faso": 854, "Uruguay": 858, "Uzbekistan": 860, "Venezuela": 862, 
        "Wallis and Futuna": 876, "Samoa": 882, "Yemen": 887, 
        "Serbia and Montenegro (...2005)": 891, "Zambia": 894
    }
    
    # Creating a valid countries dictionary for the specified year
    valid_countries = {}
    
    # Clean country name function
    def clean_name(name):
        return name.split(" (...")[0]  # Remove the year range part if present
    
    # Process each country based on year ranges
    for country, code in all_countries.items():
        # Extract year information from country name if present
        if "(...1990)" in country:
            if year <= 1990:
                valid_countries[clean_name(country)] = code
        elif "(...1992)" in country:
            if year <= 1992:
                valid_countries[clean_name(country)] = code
        elif "(...1998)" in country:
            if year <= 1998:
                valid_countries[clean_name(country)] = code
        elif "(...1999)" in country:
            if year <= 1999:
                valid_countries[clean_name(country)] = code
        elif "(...2005)" in country:
            if year <= 2005:
                valid_countries[clean_name(country)] = code
        elif "(...2010)" in country:
            if year <= 2010:
                valid_countries[clean_name(country)] = code
        elif "(...2011)" in country:
            if year <= 2011:
                valid_countries[clean_name(country)] = code
        elif country == "East Germany (...1990)":
            if year <= 1990:
                valid_countries["East Germany"] = code
        elif country == "West Germany (...1990)":
            if year <= 1990:
                valid_countries["West Germany"] = code
        else:
            # Special cases based on historical contexts
            # USSR existed until 1991
            if country == "USSR (...1990)":
                if year <= 1990:
                    valid_countries["USSR"] = code
            # Belarus, Ukraine, etc. became independent after USSR dissolution
            elif country in ["Belarus", "Ukraine", "Kazakhstan", "Armenia", "Azerbaijan", 
                            "Estonia", "Georgia", "Kyrgyzstan", "Latvia", "Lithuania", 
                            "Moldova", "Tajikistan", "Turkmenistan", "Uzbekistan"]:
                if year >= 1991:
                    valid_countries[country] = code
            # Czechoslovakia split in 1993
            elif country == "Czechoslovakia (...1992)":
                if year <= 1992:
                    valid_countries["Czechoslovakia"] = code
            # Czech Republic and Slovakia formed in 1993
            elif country in ["Czech Republic", "Slovakia"]:
                if year >= 1993:
                    valid_countries[country] = code
            # Germany unified in 1990
            elif country == "Germany":
                if year >= 1991:
                    valid_countries[country] = code
            # Yugoslavia breakup started in 1991
            elif country in ["Croatia", "Slovenia", "Bosnia and Herzegovina", "Macedonia"]:
                if year >= 1991:
                    valid_countries[country] = code
            # Serbia and Montenegro existed from 1992 to 2006
            elif country == "Serbia and Montenegro (...2005)":
                if 1992 <= year <= 2005:
                    valid_countries["Serbia and Montenegro"] = code
            # Serbia and Montenegro became separate countries in 2006
            elif country in ["Serbia", "Montenegro"]:
                if year >= 2006:
                    valid_countries[country] = code
            # South Sudan became independent in 2011
            elif country == "South Sudan":
                if year >= 2011:
                    valid_countries[country] = code
            # Sudan before South Sudan's independence
            elif country == "Sudan (...2011)":
                if year <= 2011:
                    valid_countries["Sudan"] = code
            # Sudan after South Sudan's independence
            elif country == "Sudan":
                if year >= 2011:
                    valid_countries[country] = code
            # Netherlands Antilles dissolved in 2010
            elif country == "Netherlands Antilles (...2010)":
                if year <= 2010:
                    valid_countries["Netherlands Antilles"] = code
            # Constituent countries after Netherlands Antilles dissolution
            elif country in ["Curacao", "Saint Maarten", "Bonaire"]:
                if year >= 2010:
                    valid_countries[country] = code
            # For all other countries without specific year constraints
            else:
                valid_countries[country] = code
    
    return valid_countries
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
country_codes = get_countries_by_year(year)
# country_codes = pd.read_csv('CSV_DATA/country_codes.csv')
# country_codes_json = {row.country_name:row.country_code
#     for row in country_codes.itertuples()
#     }

# with open("country_names.json", 'w') as f:
#     f.write(json.dumps(country_codes_json))

exports = exports[exports['product_code'] == product_code].drop(columns=['product_code'])

sum_of_top_5 = float(exports.sort_values(by='value')['value'][-5:].sum())

# make df from country_codes
country_codes = pd.DataFrame.from_dict(country_codes, orient='index', columns=['country_code']).reset_index()
country_codes.columns = ['country_name', 'country_code']

e = exports.merge(country_codes, on='country_code')

e.sort_values(by='value', inplace=True, ascending=False)

today_json = {
    "product_name": product_name,
    "year": year,
    "sum_of_top_5": sum_of_top_5,
    "country_codes": get_countries_by_year(year),
    "exporters": [
        { "country_code": row.country_code, "value" : row.value }
        for row in e.itertuples()
    ]
}

with open('today.json', 'w') as f:
    f.write(json.dumps(today_json, indent=4))
