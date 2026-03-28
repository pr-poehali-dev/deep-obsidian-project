import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Возвращает список товаров магазина с остатками."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("""
        SELECT id, name, price, tag, description, stock_limit, stock_left, image_url
        FROM products
        WHERE is_active = TRUE
        ORDER BY id
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    products = []
    for row in rows:
        products.append({
            'id': row[0],
            'name': row[1],
            'price': row[2],
            'tag': row[3],
            'description': row[4],
            'stock_limit': row[5],
            'stock_left': row[6],
            'image_url': row[7],
        })

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'products': products})
    }
