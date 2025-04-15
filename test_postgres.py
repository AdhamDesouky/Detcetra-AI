import psycopg2

def test_connection():
    try:
        conn = psycopg2.connect(
            dbname="mammo_db",
            user="postgres",
            password="postgres",
            host="localhost",
            port="5432"
        )
        print("Successfully connected to PostgreSQL!")
        conn.close()
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")

if __name__ == "__main__":
    test_connection() 