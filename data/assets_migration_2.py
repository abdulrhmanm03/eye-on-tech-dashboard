import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("sqlite:///app.db")

df = pd.read_excel("Assets_table.xlsx")
df.insert(0, "id", range(1, len(df) + 1))
df.columns = (
    df.columns
    .str.replace("*", "", regex=False)    # remove asterisks
    .str.strip()                          # trim leading/trailing spaces
    .str.replace(r"\s+", " ", regex=True) # reduce multiple spaces to one
)

date_columns = ['maintenance_expiry', 'last_service', 'next_service']
for col in date_columns:
    df[col] = pd.to_datetime(df[col], errors='coerce').dt.strftime('%Y-%m-%d')

df["production_year"] = df["production_year"].astype(str).str.extract(r"(\d{4})")

df['serial_number'] = df['serial_number'].apply(lambda x: str(int(x)) if pd.notna(x) and float(x).is_integer() else str(x))

df.to_sql("assets", con=engine, if_exists="replace", index=False)

