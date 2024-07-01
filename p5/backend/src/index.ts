#!/usr/bin/env bun
import express from 'express';

import * as tools from './tools.ts';
import index from './index.html' with { type: 'text' };
import styles from './styles.css' with { type: 'text' };
import bundle from './bundle.js' with { type: 'text' };
import cookieParser from 'cookie-parser';
import { Cache } from 'file-system-cache';
import * as sqlite from 'bun:sqlite';
import { createHash } from 'crypto';

const db = new sqlite.Database('./db.sqlite');

const cache = new Cache({
    basePath: '.cache',
    ns: 'p3',
    hash: 'md5',
    ttl: 60 * 60 * 4,
});

const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ type: '*/*' }));
app.use(function (req, res, next) {
    if (req.cookies.session && cache.getSync(req.cookies.session)) {
        req.user = cache.getSync(req.cookies.session);
        if (req.path !== '/api/user/check')
            cache.setSync(req.cookies.session, req.user);
    } else {
        res.clearCookie('session');
    }
    next();
});
app.use(function (req, res, next) {
    next();
    console.log(req.method, req.path, res.statusCode);
});

app.get('/', (req, res) => {
    res.send(index);
});

app.get('/assets/styles.css', (req, res) => {
    res.type('css').send(styles);
});

app.get('/assets/bundle.js', (req, res) => {
    res.type('js').send(bundle);
});

app.get('/api', (req, res) => {
    console.log(req.user);
    res.send(new tools.APIResponse('Hello World!'));
});

app.get('/api/user/check', (req, res) => {
    if (req.user) res.status(200).send(new tools.APIResponse('Success!'));
    else res.status(401).send(new tools.APIResponse('Failure!'));
});

app.get('/api/user/login', (req, res) => {
    if (
        typeof req.query.email !== 'string' ||
        typeof req.query.password !== 'string'
    )
        res.status(401).send(new tools.APIResponse('Invalid Login'));
    let email = req.query.email as string;
    let password = createHash('md5')
        .update(req.query.password as string)
        .digest('hex');

    let results = db
        .prepare(
            'SELECT id, created_at, email, role FROM users WHERE email = ? AND password = ?'
        )
        .get(email, password) as tools.User | undefined;

    if (results) {
        let cnt = cache.getSync('cnt', 44000) as number;
        console.log(cnt);
        results.session = cnt + '';
        cache.setSync(cnt + '', results);
        cache.setSync('cnt', cnt + 1);
        res.cookie('session', cnt).send(
            new tools.APIResponse('Successful Login')
        );
    } else {
        res.status(401).send(new tools.APIResponse('Invalid Login'));
    }
});

app.post('/api/user/logout', async (req, res) => {
    if (req.user) {
        await cache.remove(req.user.session!);
    }
    res.clearCookie('session').send(new tools.APIResponse('Successful Logout'));
});

app.get('/api/products', (req, res) => {
    if (
        req.query.search &&
        typeof req.query.search === 'string' &&
        req.query.search.length >= 1
    ) {
        console.log(
            `SELECT id FROM products WHERE product_name LIKE '%${req.query.search}%'`
        );
        try {
            res.send(
                db
                    .prepare(
                        `SELECT id FROM products WHERE product_name LIKE '%${req.query.search}%'`
                    )
                    .all()
            );
        } catch (err) {
            res.status(500).send([]);
        }
    } else {
        res.send(db.prepare('SELECT id FROM products').all());
    }
});
app.get('/api/product/:id', (req, res) => {
    console.log(req.params.id);
    res.send(
        db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
    );
});

app.post('/api/checkout', (req, res) => {
    let checkoutData: { count: object; cc: string } = req.body;
    let total = 0;
    let stockUpdate = db.transaction(() => {
        for (const [id, count] of Object.entries(checkoutData.count)) {
            let { stock, price } = db
                .prepare('SELECT stock, price FROM products WHERE id = ?')
                .get(id) as { stock: number; price: number };
            stock -= count;
            if (stock < 0) {
                throw new Error();
            }
            total += count * price;
            db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(
                stock,
                id
            );
        }
        return 1;
    });
    let r: number | undefined;
    try {
        r = stockUpdate();
        res.send(new tools.APIResponse('Successful Checkout'));
    } catch (e) {
        r = undefined;
        res.status(400).send(new tools.APIResponse('Failed Checkout'));
    }
    console.log(r);
});

app.listen(3000, () => {
    console.log('Server started on port 3000!');
});
