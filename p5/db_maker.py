#!/opt/homebrew/bin/python3
from sqlite3 import connect, IntegrityError
from random import randrange
from os import remove
from hashlib import md5
from secrets import token_hex
from datetime import datetime


while datetime.now().second % 5 != 0:
    pass

db = connect("./dist/db.sqlite")
cur = db.cursor()


cur.execute("drop table if exists users")
cur.execute(
    """
    create table `users` (
        `id` integer not null primary key autoincrement,
        `created_at` DATETIME not null default CURRENT_TIMESTAMP,
        `email` TEXT not null,
        `password` TEXT not null,
        `role` TEXT not null default 'user'
    )
    """
)
admin_pass = 'iloveyoubabe'
print(admin_pass)
user_data = [
    ("admin@admin.com", admin_pass, 'admin'),
    ("chris@gmail.com", "password123", 'user'),
]
for email, password, role in user_data:
    cur.execute(
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
        (email, md5(password.encode()).hexdigest(), role),
    )

cur.execute('drop table if exists warehouses')
cur.execute(
    """
    CREATE TABLE `warehouses` (
        `id` INTEGER not null primary key autoincrement,
        `created_at` DATETIME not null default CURRENT_TIMESTAMP,
        `name` TEXT not null,
        `location` TEXT not null
    )
    """,
)
warehouse_data = [
    ("main", "potomac"),
    ("veggies", "north potomac"),
    ("exotic", "gaithersburg"),
]
for warehouse, location in warehouse_data:
    cur.execute(
        "INSERT INTO warehouses (name, location) VALUES (?, ?)",
        [warehouse, location],
    )

cur.execute('drop table if exists products')
cur.execute(
    """
    CREATE TABLE `products` (
        `id` integer not null primary key autoincrement,
        `created_at` datetime not null default CURRENT_TIMESTAMP,
        `product_name` Text not null,
        `price` INTEGER not null,
        `stock` INTEGER not null,
        `warehouse` INTEGER not null
    )
    """
)
product_data = [
    ("Peach", 3),
    ("Chili pepper", 2),
    ("Cranberry", 1),
    ("White sapote", 3),
    ("Lychee", 1),
    ("Buddha's hand", 1),
    ("Japanese plum", 1),
    ("Lulo", 1),
    ("Plumcot", 3),
    ("Quince", 3),
    ("Sarguelas", 3),
    ("Kaffir lime", 1),
    ("Raisin", 1),
    ("Coconut", 1),
    ("Citron", 1),
    ("Tangelo", 3),
    ("Goji berry", 1),
    ("Soursop", 3),
    ("Currant", 1),
    ("Squash", 2),
    ("Magellan Barberry", 1),
    ("Sapodilla", 3),
    ("Huckleberry", 1),
    ("Grewia asiatica", 1),
    ("Jambul", 1),
    ("Star apple", 3),
    ("Feijoa", 1),
    ("Ximenia", 3),
    ("Araza", 1),
    ("Marionberry", 1),
    ("Lanzones", 1),
    ("Kumquat", 1),
    ("Cempedak", 1),
    ("Mamey apple", 1),
    ("Pea", 2),
    ("Aratiles", 1),
    ("Damson", 1),
    ("Pomegranate", 3),
    ("Sapote", 3),
    ("Breadfruit", 1),
    ("Pomelo", 3),
    ("Durian", 1),
    ("Mamey Sapote", 1),
    ("Akebi", 1),
    ("Sloe", 3),
    ("Avocado", 1),
    ("Fig", 1),
    ("Santol", 3),
    ("Mango", 1),
    ("Rose apple", 3),
    ("Tomato", 2),
    ("White currant", 3),
    ("Strawberry", 3),
    ("Jackfruit", 1),
    ("Salmonberry", 3),
    ("Mangosteen", 1),
    ("Black sapote", 1),
    ("Pineapple", 3),
    ("Macopa", 1),
    ("Finger Lime", 1),
    ("Tamarillo", 3),
    ("Galia melon", 1),
    ("Redcurrant", 3),
    ("Catmon", 1),
    ("African Cherry Orange", 1),
    ("Lime", 1),
    ("Satsuma", 3),
    ("Raspberry", 3),
    ("Cherimoya", 1),
    ("Loquat", 1),
    ("Gooseberry", 1),
    ("Cloudberry", 1),
    ("Bell pepper", 2),
    ("Apricot", 1),
    ("Pawpaw", 3),
    ("Apple", 1),
    ("Zucchini", 2),
    ("Corn kernel", 2),
    ("Mandarine", 1),
    ("Jujube", 1),
    ("Canistel", 1),
    ("Monstera deliciosa", 1),
    ("Plantain", 3),
    ("Kiwano", 1),
    ("Nectarine", 1),
    ("Honeydew", 1),
    ("Grape", 1),
    ("Yuzu", 3),
    ("Juniper berry", 1),
    ("Persimmon", 3),
    ("Acerola", 1),
    ("American Mayapple", 1),
    ("Miracle fruit", 1),
    ("Tayberry", 3),
    ("Star fruit", 3),
    ("Grapefruit", 1),
    ("Suriname cherry", 3),
    ("Tamarind", 3),
    ("Kiwifruit", 1),
    ("Rambutan", 3),
    ("Lemon", 1),
    ("Loganberry", 1),
    ("Blackcurrant", 1),
    ("Cherry", 1),
    ("Momordica fruit", 1),
    ("Crab apple", 1),
    ("Watermelon", 1),
    ("Muskmelon", 1),
    ("Pumpkin", 2),
    ("Boysenberry", 1),
    ("Jostaberry", 1),
    ("Prune", 3),
    ("Orange", 1),
    ("Cactus pear", 1),
    ("Medlar", 1),
    ("Coco de mer", 1),
    ("Blueberry", 1),
    ("Bilberry", 1),
    ("Pear", 3),
    ("Honeyberry", 1),
    ("Mouse melon", 1),
    ("Banana", 1),
    ("Ugli fruit", 3),
    ("Pineberry", 3),
    ("Olive", 2),
    ("Clementine", 1),
    ("Blackberry", 1),
    ("Cucumber", 2),
    ("Nance", 1),
    ("Mulberry", 1),
    ("Hala fruit", 1),
    ("Chico fruit", 1),
    ("Passionfruit", 1),
    ("Date", 1),
    ("Jalapeño", 2),
    ("Gac", 1),
    ("Sugar apple", 3),
    ("Blood orange", 1),
    ("Salak", 3),
    ("Papaya", 1),
    ("Ackee", 1),
    ("Haws", 1),
    ("Jabuticaba", 1),
    ("Tangerine", 1),
    ("Carolina reaper", 2),
    ("Plum", 3),
    ("Dragonfruit", 1),
    ("Longan", 1),
    ("Salal berry", 3),
    ("Melon", 1),
    ("Abiu", 1),
    ("Elderberry", 1),
    ("Guava", 1),
    ("Thimbleberry", 3),
    ("Eggplant", 2),
    ("Cantaloupe", 1),
]
for product, warehouse in product_data:
    cur.execute(
        "INSERT INTO products (product_name, price, stock, warehouse) VALUES (?, ?, ?, ?)",
        [product, randrange(50, 1000), randrange(20, 120), warehouse],
    )
db.commit()
