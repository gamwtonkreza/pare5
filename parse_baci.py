import json

# List of files:
# BACI_HS22_Y2022_V202501.csv  product_codes_HS22_V202501.csv
# BACI_HS22_Y2023_V202501.csv  country_codes_V202501.csv

# List of Variables:
# t: year
# i: exporter
# j: importer
# k: product
# v: value
# q: quantity

import pandas as pd

# years from 1995 to 2023
# empty dataframe
export_data = pd.DataFrame()

for year in range(1995, 2024):
    # Load the data
    # t, i, j, k, v, q
    data = pd.read_csv(f'./BACI_HS92_V202501/BACI_HS92_Y{year}_V202501.csv')

    # drop the importer column
    data = data.drop(columns=['j'])

    # sum the value and q columns for the same i, k, t
    data = data.groupby(['i', 'k', 't']).sum().reset_index()

    # append to the export_data dataframe
    export_data = export_data._append(data)

# rename the columns
export_data = export_data.rename(columns={'i': 'country_code', 'k': 'product_code', 't': 'year', 'v': 'value', 'q': 'quantity'})

# write to csv
export_data.to_csv('CSV_DATA/exports_full.csv', index=False)







# Load the product codes
# code, description
product_codes = pd.read_csv('BACI_HS22_V202501/product_codes_HS22_V202501.csv')
# rename code to product_code
product_codes = product_codes.rename(columns={'code': 'product_code'})
# write to csv
product_codes.to_csv('CSV_DATA/product_codes.csv', index=False)


# Load the country codes
# country_code, country_name, country_iso2, country_iso3
country_codes = pd.read_csv('BACI_HS22_V202501/country_codes_V202501.csv')
country_codes['country_code'] = country_codes['country_code']
country_codes = country_codes.drop(columns=['country_iso2', 'country_iso3'])
country_codes.to_csv('CSV_DATA/country_codes.csv', index=False)

folder = 'CSV_DATA'
# remove t and q columns
df = df.drop(columns=['t', 'q'])

# split into two dataframes, one for exports and one for imports
# rename i to exporter, j to importer, k to product, v to value
df = df.rename(columns={'i': 'exporter', 'j': 'importer', 'k': 'product', 'v': 'value'})

# split into two dataframes, one for exports and one for imports
exports = df.copy()

# group by product and exporter and sum the values, drop importer
exports = exports.groupby(['product', 'exporter']).sum().reset_index()

exports = exports.drop(columns=['importer'])
exports = exports.rename(columns={'exporter': 'country_code'})


# group by product and importer and sum the values, drop exporter

imports = df.copy()
imports = imports.groupby(['product', 'importer']).sum().reset_index()
imports = imports.drop(columns=['exporter'])
imports = imports.rename(columns={'importer': 'country_code'})

exports.to_csv(f'{folder}/exports.csv', index=False)
imports.to_csv(f'{folder}/imports.csv', index=False)