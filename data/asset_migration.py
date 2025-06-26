import pandas as pd 
import sqlite3

df = pd.read_csv('assets_data.csv')
conn = sqlite3.connect("app.db")
cursor = conn.cursor()

# List of columns in CSV
columns = list(df.columns)

# Create placeholders for SQLite insert e.g. (?, ?, ?)
placeholders = ', '.join(['?'] * len(columns))

# Compose INSERT query
query = f"INSERT INTO assets ({', '.join(columns)}) VALUES ({placeholders})"

# Convert DataFrame rows to list of tuples for executemany
values = [tuple(row) for row in df.to_numpy()]

# Insert rows into table
cursor.executemany(query, values)

conn.commit()
conn.close()
