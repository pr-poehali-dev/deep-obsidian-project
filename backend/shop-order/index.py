import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Оформление заказа: создаёт заказ из корзины, списывает остатки."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'method not allowed'})}

    headers = event.get('headers') or {}
    session_id = headers.get('X-Session-Id') or headers.get('x-session-id')
    if not session_id:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'session_id required'})}

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    email = body.get('email', '').strip()
    phone = body.get('phone', '').strip()
    address = body.get('address', '').strip()
    comment = body.get('comment', '').strip()

    if not name or not email:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'name and email required'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("""
        SELECT ci.product_id, ci.quantity, p.name, p.price, p.stock_left
        FROM cart_items ci
        JOIN products p ON p.id = ci.product_id
        WHERE ci.session_id = %s
    """, (session_id,))
    cart = cur.fetchall()

    if not cart:
        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'cart is empty'})}

    for item in cart:
        stock_left = item[4]
        if stock_left is not None and item[1] > stock_left:
            cur.close(); conn.close()
            return {'statusCode': 409, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': f'not enough stock for {item[2]}', 'stock_left': stock_left})}

    total = sum(item[1] * item[3] for item in cart)

    cur.execute("""
        INSERT INTO orders (session_id, name, email, phone, address, comment, total)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (session_id, name, email, phone, address, comment, total))
    order_id = cur.fetchone()[0]

    for item in cart:
        product_id, quantity, pname, price, stock_left = item
        cur.execute("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (%s, %s, %s, %s)",
                    (order_id, product_id, quantity, price))
        if stock_left is not None:
            cur.execute("UPDATE products SET stock_left = stock_left - %s WHERE id = %s", (quantity, product_id))

    cur.execute("DELETE FROM cart_items WHERE session_id = %s", (session_id,))
    conn.commit()
    cur.close(); conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True, 'order_id': order_id, 'total': total})
    }
