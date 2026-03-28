
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  price INTEGER NOT NULL,
  tag VARCHAR(50),
  description TEXT,
  stock_limit INTEGER,
  stock_left INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  comment TEXT,
  total INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL
);

INSERT INTO products (name, price, tag, description, stock_limit, stock_left, is_active) VALUES
  ('VOID HOODIE', 4900, 'ЛИМИТ', 'Худи из коллекции VOID SERIES 2026. Тёмный оверсайз, вышивка на спине.', 30, 7, TRUE),
  ('SIGNAL TEE', 2400, 'НОВОЕ', 'Футболка SIGNAL. Плотный хлопок, принт фронт и бэк.', NULL, NULL, TRUE),
  ('CHROME CAP', 1800, NULL, 'Кепка CHROME. Вышитый логотип, регулируемый ремешок.', NULL, NULL, TRUE),
  ('DISORDER PACK', 7200, 'КОМПЛЕКТ', 'Сет: худи + футболка + кепка. Выгода 900 ₽.', 15, 4, TRUE);
