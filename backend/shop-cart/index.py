import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Управление корзиной: получить, добавить, изменить кол-во, удалить товар."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = event.get('headers') or {}
    session_id = headers.get('X-Session-Id') or headers.get('x-session-id')
    if not session_id:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'session_id required'})}

    method = event.get('httpMethod')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if method == 'GET':
        cur.execute("""
            SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.tag, p.stock_left
            FROM cart_items ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.session_id = %s
            ORDER BY ci.created_at
        """, (session_id,))
        rows = cur.fetchall()
        items = [{'id': r[0], 'product_id': r[1], 'quantity': r[2], 'name': r[3], 'price': r[4], 'tag': r[5], 'stock_left': r[6]} for r in rows]
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, 'body': json.dumps({'items': items})}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        product_id = body.get('product_id')
        quantity = body.get('quantity', 1)

        cur.execute("SELECT stock_left FROM products WHERE id = %s AND is_active = TRUE", (product_id,))
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 404, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'product not found'})}

        stock_left = row[0]
        if stock_left is not None and quantity > stock_left:
            cur.close(); conn.close()
            return {'statusCode': 409, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'not enough stock', 'stock_left': stock_left})}

        cur.execute("""
            INSERT INTO cart_items (session_id, product_id, quantity)
            VALUES (%s, %s, %s)
            ON CONFLICT (session_id, product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
        """, (session_id, product_id, quantity))
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

    if method == 'DELETE':
        body = json.loads(event.get('body') or '{}')
        product_id = body.get('product_id')
        if product_id:
            cur.execute("DELETE FROM cart_items WHERE session_id = %s AND product_id = %s", (session_id, product_id))
        else:
            cur.execute("DELETE FROM cart_items WHERE session_id = %s", (session_id,))
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'ok': True})}

    cur.close(); conn.close()
    return {'statusCode': 405, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'method not allowed'})}
