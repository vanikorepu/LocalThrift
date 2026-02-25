const express = require('express');
const http = require('http');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const { Server } = require('socket.io');
const Stripe = require('stripe');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

// ── Stripe ────────────────────────────────────────────────────────────────────
// Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in your environment or .env file
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
const stripe = new Stripe(STRIPE_SECRET_KEY);

// ── JWT ───────────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'localthrift_jwt_secret_2024';
const SALT_ROUNDS = 10;

// ── Storage paths ─────────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── SQLite Database ───────────────────────────────────────────────────────────
const db = new Database(path.join(DATA_DIR, 'localthrift.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    price TEXT,
    size TEXT,
    brand TEXT,
    usage TEXT,
    category INTEGER,
    meeting INTEGER,
    images TEXT DEFAULT '[]',
    sold INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (seller_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    PRIMARY KEY (user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
  );
`);

// ── Helpers ───────────────────────────────────────────────────────────────────
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const safeUser = u => ({ _id: u.id, name: u.name, email: u.email, phone: u.phone });

const parseProduct = p => ({ ...p, _id: p.id, images: JSON.parse(p.images || '[]') });

// ── Multer ────────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// ════════════════════════════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════════════════════════════

// POST /users/register
app.post('/users/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email))
    return res.json({ message: 'Email already registered' });
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const id = newId();
  db.prepare('INSERT INTO users (id, name, email, password_hash, phone) VALUES (?, ?, ?, ?, ?)').run(id, name, email, password_hash, phone);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: safeUser(user), token });
});

// POST /users/login
app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: safeUser(user), token });
});

// GET /users/:id
app.get('/users/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.json({ message: 'User not found' });
  res.json({ user: safeUser(user) });
});

// PUT /users/:id
app.put('/users/:id', (req, res) => {
  const { name, email, phone } = req.body;
  const result = db.prepare('UPDATE users SET name=?, email=?, phone=? WHERE id=?').run(name, email, phone, req.params.id);
  if (!result.changes) return res.json({ message: 'User not found' });
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  res.json({ user: safeUser(user) });
});

// ════════════════════════════════════════════════════════════════════════════
// PRODUCTS  (specific routes MUST come before /product/:id)
// ════════════════════════════════════════════════════════════════════════════

// GET /product/image/:uri  — serve uploaded photo
app.get('/product/image/:uri', (req, res) => {
  const file = path.join(UPLOADS_DIR, req.params.uri);
  if (fs.existsSync(file)) return res.sendFile(file);
  res.status(404).json({ message: 'Image not found' });
});

// GET /product/user/:id  — seller's own products
app.get('/product/user/:id', (req, res) => {
  const products = db.prepare('SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC').all(req.params.id).map(parseProduct);
  res.json({ products });
});

// GET /product/category/:category/user/:user_id  — browse by category (exclude own + sold)
app.get('/product/category/:category/user/:user_id', (req, res) => {
  const products = db.prepare('SELECT * FROM products WHERE category = ? AND seller_id != ? AND sold = 0 ORDER BY created_at DESC').all(Number(req.params.category), req.params.user_id).map(parseProduct);
  res.json({ products });
});

// POST /product/:user_id  — create listing
app.post('/product/:user_id', upload.any(), (req, res) => {
  const { price, size, brand, usage, category, meeting, images } = req.body;
  const id = newId();
  db.prepare('INSERT INTO products (id, seller_id, price, size, brand, usage, category, meeting, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, req.params.user_id, price, size, brand, usage, Number(category), Number(meeting), images || '[]');
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.json({ product: parseProduct(product) });
});

// PUT /product/:id  — edit listing
app.put('/product/:id', upload.any(), (req, res) => {
  const { price, size, brand, usage, category, meeting, images } = req.body;
  db.prepare('UPDATE products SET price=?, size=?, brand=?, usage=?, category=?, meeting=?, images=? WHERE id=?').run(price, size, brand, usage, Number(category), Number(meeting), images || '[]', req.params.id);
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.json({ message: 'Not found' });
  res.json({ product: parseProduct(product) });
});

// DELETE /product/:id  — mark as sold / remove
app.delete('/product/:id', (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// GET /product/:id  — single product detail
app.get('/product/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.json({ message: 'Not found' });
  res.json({ product: parseProduct(product) });
});

// ════════════════════════════════════════════════════════════════════════════
// CART
// ════════════════════════════════════════════════════════════════════════════

// PUT /cart/:product_id/user/:user_id  — add to cart
app.put('/cart/:product_id/user/:user_id', (req, res) => {
  db.prepare('INSERT OR IGNORE INTO cart_items (user_id, product_id) VALUES (?, ?)').run(req.params.user_id, req.params.product_id);
  res.json({ success: true });
});

// DELETE /cart/:product_id/user/:user_id  — remove from cart
app.delete('/cart/:product_id/user/:user_id', (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?').run(req.params.user_id, req.params.product_id);
  res.json({ success: true });
});

// GET /cart/:user_id  — get cart grouped by seller
app.get('/cart/:user_id', (req, res) => {
  const ids = db.prepare('SELECT product_id FROM cart_items WHERE user_id = ?').all(req.params.user_id).map(r => r.product_id);

  const bySeller = {};
  for (const id of ids) {
    const p = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!p) continue;
    const parsed = parseProduct(p);
    if (!bySeller[p.seller_id]) bySeller[p.seller_id] = [];
    bySeller[p.seller_id].push(parsed);
  }

  const cart = Object.entries(bySeller).map(([sellerId, sellerProducts]) => {
    const seller = db.prepare('SELECT * FROM users WHERE id = ?').get(sellerId) || {};
    return { phone: seller.phone || '', email: seller.email || '', seller_id: sellerId, products: sellerProducts };
  });

  res.json({ cart });
});

// ════════════════════════════════════════════════════════════════════════════
// CHAT ROOMS
// ════════════════════════════════════════════════════════════════════════════

// POST /rooms  — get or create a room for buyer+seller+product
app.post('/rooms', (req, res) => {
  const { buyer_id, seller_id, product_id } = req.body;
  let room = db.prepare('SELECT * FROM rooms WHERE buyer_id = ? AND seller_id = ? AND product_id = ?').get(buyer_id, seller_id, product_id);
  if (!room) {
    const id = newId();
    db.prepare('INSERT INTO rooms (id, buyer_id, seller_id, product_id) VALUES (?, ?, ?, ?)').run(id, buyer_id, seller_id, product_id);
    room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(id);
  }
  res.json({ room });
});

// GET /rooms/user/:user_id  — all rooms for this user with enriched data
app.get('/rooms/user/:user_id', (req, res) => {
  const rooms = db.prepare('SELECT * FROM rooms WHERE buyer_id = ? OR seller_id = ? ORDER BY created_at DESC').all(req.params.user_id, req.params.user_id);
  const enriched = rooms.map(room => {
    const other_id = room.buyer_id === req.params.user_id ? room.seller_id : room.buyer_id;
    const other = db.prepare('SELECT * FROM users WHERE id = ?').get(other_id) || {};
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(room.product_id);
    const lastMsg = db.prepare('SELECT * FROM messages WHERE room_id = ? ORDER BY created_at DESC LIMIT 1').get(room.id);
    return {
      ...room,
      other_name: other.name || 'Unknown',
      product_brand: product ? product.brand : '',
      product_images: product ? JSON.parse(product.images || '[]') : [],
      last_message: lastMsg ? lastMsg.text : '',
    };
  });
  res.json({ rooms: enriched });
});

// GET /rooms/:room_id/messages  — message history
app.get('/rooms/:room_id/messages', (req, res) => {
  const messages = db.prepare('SELECT * FROM messages WHERE room_id = ? ORDER BY created_at ASC').all(req.params.room_id);
  res.json({ messages });
});

// ════════════════════════════════════════════════════════════════════════════
// PAYMENTS (Stripe)
// ════════════════════════════════════════════════════════════════════════════

// POST /payments/intent  — create a PaymentIntent
app.post('/payments/intent', async (req, res) => {
  const { amount } = req.body; // amount in dollars
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // dollars → cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret, publishableKey: STRIPE_PUBLISHABLE_KEY });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /payments/confirm  — mark products as sold, clear from cart
app.post('/payments/confirm', (req, res) => {
  const { product_ids, user_id } = req.body;
  for (const id of product_ids) {
    db.prepare('UPDATE products SET sold = 1 WHERE id = ?').run(id);
    db.prepare('DELETE FROM cart_items WHERE product_id = ?').run(id);
  }
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════════════════════
// SOCKET.IO — Real-time Chat
// ════════════════════════════════════════════════════════════════════════════

io.on('connection', socket => {
  socket.on('join_room', roomId => {
    socket.join(roomId);
  });

  socket.on('send_message', ({ room_id, sender_id, text }) => {
    const id = newId();
    const created_at = Math.floor(Date.now() / 1000);
    db.prepare('INSERT INTO messages (id, room_id, sender_id, text, created_at) VALUES (?, ?, ?, ?, ?)').run(id, room_id, sender_id, text, created_at);
    io.to(room_id).emit('new_message', { id, room_id, sender_id, text, created_at: created_at * 1000 });
  });
});

// ════════════════════════════════════════════════════════════════════════════
const PORT = 3000;
server.listen(PORT, () =>
  console.log(`LocalThrift server running at http://localhost:${PORT}`)
);
