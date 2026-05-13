const express = require('express');
const { Pool } = require('pg');
const cors = require("cors");
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'digital_store',
    password: '', // ӨЗІҢІЗДІҢ PostgreSQL пароліңізді жазыңыз
    port: 5432,
});

// ========== API ENDPOINTS ==========

// 1. Тауарларды алу
app.get("/products", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// 2. Тіркелу
app.post("/users", async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    try {
        const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
            [email, hashedPassword, first_name, last_name]
        );
        res.json({ user: newUser.rows[0] });
    } catch (err) { 
        res.status(500).json({ error: "Server error" }); 
    }
});

// 3. Логин
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            const { password, ...userWithoutPassword } = user;
            res.json({ user: userWithoutPassword });
        } else {
            res.status(401).json({ error: "Invalid password" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Себетті алу
app.get("/cart/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT cart.id, products.item, products.price, products.img 
             FROM cart 
             JOIN products ON cart.product_id = products.id 
             WHERE cart.user_id = $1`, 
            [user_id]
        );
        res.json(result.rows);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// 5. Себетке қосу
app.post("/cart", async (req, res) => {
    const { user_id, product_id } = req.body;
    try {
        await pool.query('INSERT INTO cart (user_id, product_id) VALUES ($1, $2)', [user_id, product_id]);
        res.json({ message: "Added to cart" });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// 6. Себеттен өшіру
app.delete("/cart/:id", async (req, res) => {
    try {
        await pool.query('DELETE FROM cart WHERE id = $1', [req.params.id]);
        res.json({ message: "Deleted from cart" });
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// 7. Checkout (сатып алу)
app.post("/checkout", async (req, res) => {
    const { user_id, total_price, shipping_details } = req.body;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total_amount, status, shipping_address, created_at) 
             VALUES ($1, $2, $3, $4, NOW()) 
             RETURNING id`,
            [user_id, Number(total_price), 'pending', shipping_details?.address || null]
        );
        
        await client.query('DELETE FROM cart WHERE user_id = $1', [user_id]);
        await client.query('COMMIT');
        
        res.json({ success: true, message: "Order placed", orderId: orderResult.rows[0].id });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ success: false, error: err.message });
    } finally {
        client.release();
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});