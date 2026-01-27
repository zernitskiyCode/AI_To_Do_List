import psycopg2
from psycopg2.extras import DictCursor
import os
import dotenv
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        cursor_factory=DictCursor

    )
def test():
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    print(dbname)
    print(user)
    print(password)
    print(host)
    print(dbname)







# conn  = psycopg2.connect(
#     host="",
#     user = "",
#     password = "",
#     port = "",
#     dbname = ""
# )

# if conn:
#     print("Подключено")

# cursor = conn.cursor(cursor_factory=DictCursor)
# cursor.execute("SELECT * FROM users;")
# rows = cursor.fetchall()
# print(rows)
# for row in rows:
#     print(row['name'])