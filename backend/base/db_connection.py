import psycopg2
from psycopg2.extras import DictCursor
conn  = psycopg2.connect(
    host="localhost",
    user = "postgres",
    password = "admin",
    port = "5432",
    dbname = "todo"
)

if conn:
    print("Подключено")

cursor = conn.cursor(cursor_factory=DictCursor)
cursor.execute("SELECT * FROM users;")
rows = cursor.fetchall()
print(rows)
for row in rows:
    print(row['name'])