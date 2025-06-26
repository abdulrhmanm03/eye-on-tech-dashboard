import pandas as pd
import sqlite3
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

df = pd.read_csv('users_data.csv')
# Remove duplicate usernames, keeping the first occurrence
df = df.drop_duplicates(subset='username').reset_index(drop=True)
conn = sqlite3.connect('app.db')
cursor = conn.cursor()

def hash_password(password):
    return pwd_context.hash(password)

# Loop through each row and insert into both tables
for _, row in df.iterrows():
    username = row['username']
    phone = row['phone']
    password_hash = hash_password('1234')
    
    # Insert user into users table
    cursor.execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        (username, password_hash, 'client')
    )
    user_id = cursor.lastrowid  # Get the ID of the inserted user
    
    # Insert phone into point_of_contacts table
    cursor.execute(
        "INSERT INTO point_of_contacts (user_id, type, value) VALUES (?, ?, ?)",
        (user_id, 'phone', phone)
    )

# Commit and close
conn.commit()
conn.close()
