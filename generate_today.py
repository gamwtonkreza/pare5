import datetime
import pandas as pd
import random
import json

# reroller file
with open('reroller.txt', 'r') as f:
    reroller = int(f.read())

with open('reroller.txt', 'w') as f:
    f.write(str(reroller + 1))
    
# initialize random machine with today_id
random.seed(reroller)

def get_countries_by_year(year):
    """
    Returns a dictionary of country names and their codes valid for the specified year.
    Uses standard English country names without year ranges in the final output.
    
    Args:
        year (int): The year for which to get valid country codes
        
    Returns:
        dict: A dictionary with clean country names as keys and country codes as values
    """
    country_code_to_emoji = {
        4: "🇦🇫", 8: "🇦🇱", 12: "🇩🇿", 16: "🇦🇸", 20: "🇦🇩",
        24: "🇦🇴", 28: "🇦🇬", 31: "🇦🇿", 32: "🇦🇷", 36: "🇦🇺",
        40: "🇦🇹", 44: "🇧🇸", 48: "🇧🇭", 50: "🇧🇩", 51: "🇦🇲",
        52: "🇧🇧", 56: "🇧🇪", 58: "🇧🇪", 60: "🇧🇲", 64: "🇧🇹",
        68: "🇧🇴", 70: "🇧🇦", 72: "🇧🇼", 76: "🇧🇷", 84: "🇧🇿",
        86: "🇮🇴", 90: "🇸🇧", 92: "🇻🇬", 96: "🇧🇳", 100: "🇧🇬",
        104: "🇲🇲", 108: "🇧🇮", 112: "🇧🇾", 116: "🇰🇭", 120: "🇨🇲",
        124: "🇨🇦", 132: "🇨🇻", 136: "🇰🇾", 140: "🇨🇫", 144: "🇱🇰",
        148: "🇹🇩", 152: "🇨🇱", 156: "🇨🇳", 162: "🇨🇽", 166: "🇨🇨",
        170: "🇨🇴", 174: "🇰🇲", 175: "🇾🇹", 178: "🇨🇬", 180: "🇨🇩",
        184: "🇨🇰", 188: "🇨🇷", 191: "🇭🇷", 192: "🇨🇺", 196: "🇨🇾",
        200: "🇨🇿", 203: "🇨🇿", 204: "🇧🇯", 208: "🇩🇰", 212: "🇩🇲",
        214: "🇩🇴", 218: "🇪🇨", 222: "🇸🇻", 226: "🇬🇶", 231: "🇪🇹",
        232: "🇪🇷", 233: "🇪🇪", 238: "🇫🇰", 242: "🇫🇯", 246: "🇫🇮",
        251: "🇫🇷", 258: "🇵🇫", 260: "🇹🇫", 262: "🇩🇯", 266: "🇬🇦",
        268: "🇬🇪", 270: "🇬🇲", 275: "🇵🇸", 276: "🇩🇪", 278: "🇩🇪",
        280: "🇩🇪", 288: "🇬🇭", 292: "🇬🇮", 296: "🇰🇮", 300: "🇬🇷",
        304: "🇬🇱", 308: "🇬🇩", 316: "🇬🇺", 320: "🇬🇹", 324: "🇬🇳",
        328: "🇬🇾", 332: "🇭🇹", 340: "🇭🇳", 344: "🇭🇰", 348: "🇭🇺",
        352: "🇮🇸", 360: "🇮🇩", 364: "🇮🇷", 368: "🇮🇶", 372: "🇮🇪",
        376: "🇮🇱", 380: "🇮🇹", 384: "🇨🇮", 388: "🇯🇲", 392: "🇯🇵",
        398: "🇰🇿", 400: "🇯🇴", 404: "🇰🇪", 408: "🇰🇵", 410: "🇰🇷",
        414: "🇰🇼", 417: "🇰🇬", 418: "🇱🇦", 422: "🇱🇧", 426: "🇱🇸",
        428: "🇱🇻", 430: "🇱🇷", 434: "🇱🇾", 440: "🇱🇹", 442: "🇱🇺",
        446: "🇲🇴", 450: "🇲🇬", 454: "🇲🇼", 458: "🇲🇾", 462: "🇲🇻",
        466: "🇲🇱", 470: "🇲🇹", 478: "🇲🇷", 480: "🇲🇺", 484: "🇲🇽",
        490: "🇹🇼", 496: "🇲🇳", 498: "🇲🇩", 499: "🇲🇪", 500: "🇲🇸",
        504: "🇲🇦", 508: "🇲🇿", 512: "🇴🇲", 516: "🇳🇦", 520: "🇳🇷",
        524: "🇳🇵", 528: "🇳🇱", 530: "🇦🇳", 531: "🇨🇼", 533: "🇦🇼",
        534: "🇸🇽", 535: "🇧🇶", 540: "🇳🇨", 548: "🇻🇺", 554: "🇳🇿",
        558: "🇳🇮", 562: "🇳🇪", 566: "🇳🇬", 570: "🇳🇺", 574: "🇳🇫",
        579: "🇳🇴", 580: "🇲🇵", 583: "🇫🇲", 584: "🇲🇭", 585: "🇵🇼",
        586: "🇵🇰", 591: "🇵🇦", 598: "🇵🇬", 600: "🇵🇾", 604: "🇵🇪",
        608: "🇵🇭", 612: "🇵🇳", 616: "🇵🇱", 620: "🇵🇹", 624: "🇬🇼",
        626: "🇹🇱", 634: "🇶🇦", 642: "🇷🇴", 643: "🇷🇺", 646: "🇷🇼",
        652: "🇧🇱", 654: "🇸🇭", 659: "🇰🇳", 660: "🇦🇮", 662: "🇱🇨",
        666: "🇵🇲", 670: "🇻🇨", 674: "🇸🇲", 678: "🇸🇹", 682: "🇸🇦",
        686: "🇸🇳", 688: "🇷🇸", 690: "🇸🇨", 694: "🇸🇱", 697: "🇪🇺",
        699: "🇮🇳", 702: "🇸🇬", 703: "🇸🇰", 704: "🇻🇳", 705: "🇸🇮",
        706: "🇸🇴", 710: "🇿🇦", 711: "🇿🇦", 716: "🇿🇼", 724: "🇪🇸",
        728: "🇸🇸", 729: "🇸🇩", 736: "🇸🇩", 740: "🇸🇷", 748: "🇸🇿",
        752: "🇸🇪", 757: "🇨🇭", 760: "🇸🇾", 762: "🇹🇯", 764: "🇹🇭",
        768: "🇹🇬", 772: "🇹🇰", 776: "🇹🇴", 780: "🇹🇹", 784: "🇦🇪",
        788: "🇹🇳", 792: "🇹🇷", 795: "🇹🇲", 796: "🇹🇨", 798: "🇹🇻",
        800: "🇺🇬", 804: "🇺🇦", 807: "🇲🇰", 810: "🇷🇺", 818: "🇪🇬",
        826: "🇬🇧", 834: "🇹🇿", 842: "🇺🇸", 849: "🇺🇲", 854: "🇧🇫",
        858: "🇺🇾", 860: "🇺🇿", 862: "🇻🇪", 876: "🇼🇫", 882: "🇼🇸",
        887: "🇾🇪", 891: "🇷🇸", 894: "🇿🇲"
    }

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
        "Mauritania": 478, "Mauritius": 480, "Mexico": 484, "Taiwan": 490, 
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


    country_code_to_emoji = {
        k: v for k, v in country_code_to_emoji.items() 
        if k in valid_countries.values()
    }

    return (valid_countries, country_code_to_emoji)

# unique id for each day
def today_id() -> int:
    today = datetime.date.today()
    day = today.day
    month = today.month
    year = today.year

    return year*10000 + month*100 + day

def acceptable_name(name: str) -> bool:
    # print(product_name)
    return len(name) < 25
    # return "flowers" in name.lower() or "rose" in name.lower()

# read CSV_DATA/product_codes.csv
product_codes = pd.read_csv('CSV_DATA/product_codes.csv')

year = random.randint(1995, 2023)
print("Year:", year)
exports_full = pd.read_csv('CSV_DATA/exports_full.csv')

# no_foniades = datetime.date.today().weekday() in [5, 6, 0, 4]

def get_suggestions_for_year(year):

    exports = exports_full[exports_full['year'] == year]
    (country_codes, _) = get_countries_by_year(year)

    # make df from country_codes
    country_codes = pd.DataFrame.from_dict(country_codes, orient='index', columns=['country_code']).reset_index()
    country_codes.columns = ['country_name', 'country_code']

    e_original = exports.merge(country_codes, on='country_code')

    days_list = []

    option = None

    no_foniades = random.choice([True, False])

    for idx in random.sample(range(len(product_codes)), len(product_codes)):

        e = e_original.copy()

        removed = {"USA", "Germany", "China"}

        product_code, product_name = product_codes.iloc[idx]

        current = e[e["product_code"] == product_code]

        top5_countries = current.sort_values(by='value', ascending=False)[:5]["country_name"].values

        if no_foniades:
            if removed.issubset(top5_countries):
                continue

            # remove from current
            current = current[~current["country_name"].isin(removed)]

        if not acceptable_name(product_name):
            continue

        if no_foniades:
            print("No foniades")


        sum_of_top_5 = float(current.sort_values(by='value')['value'][-5:].sum())

        if sum_of_top_5 < 10_000:
            continue

        # Ask user if they want to keep this product
        print("Product:", product_name)

        choice = input("Keep? ( [enter] = yes, n = no , y = change year, s = stop) ")

        no_foniades_current = no_foniades

        match choice:
            case "y":
                option = "year"
            case "n":
                continue
            case "s":
                option = "stop"
                break
            case "":
                no_foniades = not no_foniades
                pass
            case _:
                print("Invalid choice")

        current = current.sort_values(by='value', ascending=False)

        (country_codes_filtered, emoji) = get_countries_by_year(year)

        # # remove usa germany china from country_codes
        if no_foniades_current:
            for country_name in removed:
                country_code = country_codes_filtered.pop(country_name, None)
                if country_code is not None:
                    emoji.pop(country_code, None)

        day_json = {
            "product_name": product_name,
            "is_no_foniades": no_foniades_current,
            "year": year,
            "sum_of_top_5": sum_of_top_5,
            "country_codes": country_codes_filtered,
            "emojis": emoji,
            "exporters": [
                { "country_code": row.country_code, "value" : row.value }
                for row in current.itertuples()
            ]
        }

        days_list.append(day_json)

    return (days_list, option)

total = {
    "today_day_of_year": datetime.date.today().timetuple().tm_yday,
    "games": []
}

if __name__ == "__main__":
    while True:
        print("Year:", year)
        (games_for_year, state) = get_suggestions_for_year(year)
        # if year_games is string

        total["games"].extend(games_for_year)

        if state == "year":
            year = random.randint(1995, 2023)
        elif state == "stop":
            break

    # write to file
    with open('total.json', 'w') as f:
        f.write(json.dumps(total, indent=4))



