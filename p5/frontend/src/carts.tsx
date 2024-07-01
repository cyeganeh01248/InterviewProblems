import { CartObj, ProductObj } from './objects.ts';
import { getRandomColor, shadeColor, prng } from './tools.ts';
import React, { useState } from 'react';

export function Cart({
    cart,
    setCart,
    setLoggedIn,
}: {
    cart: CartObj;
    setCart: React.Dispatch<React.SetStateAction<CartObj>>;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [showCheckout, setShowCheckout] = useState(false);
    let count = new Map<ProductObj, number>();
    let total = 0;
    for (const item of cart.items) {
        count.set(item, (count.get(item) || 0) + 1);
        total += item.price;
    }
    let rng = prng(932);
    let content;
    if (cart.items.length === 0) {
        content = <div id="cart-items">None</div>;
    } else {
        content = (
            <>
                <div id="cart-items">
                    {Array.from(count.entries()).map(
                        ([product, quantity], i) => {
                            let color = getRandomColor(rng);
                            return (
                                <div
                                    className="cart-item"
                                    style={{
                                        background: color,
                                        color: shadeColor(color, 0.2),
                                    }}
                                    key={i}
                                    onClick={() => {
                                        for (
                                            let j = 0;
                                            j < cart.items.length;
                                            j++
                                        ) {
                                            if (cart.items[j] === product) {
                                                let newCart = new CartObj(
                                                    cart.items
                                                        .slice(0, j)
                                                        .concat(
                                                            cart.items.slice(
                                                                j + 1,
                                                                cart.items
                                                                    .length
                                                            )
                                                        )
                                                );
                                                setCart(newCart);
                                            }
                                        }
                                    }}
                                >
                                    {product.product_name}:<br />
                                    {quantity}
                                </div>
                            );
                        }
                    )}
                </div>
                <h3>Total {(total / 100).toFixed(2)}</h3>
                {showCheckout ? (
                    <Checkout
                        count={count}
                        setCart={setCart}
                        setShowCheckout={setShowCheckout}
                    />
                ) : (
                    <button
                        onClick={() => {
                            setShowCheckout(true);
                        }}
                    >
                        Checkout
                    </button>
                )}
                <button
                    onClick={() => {
                        setCart(new CartObj());
                        setShowCheckout(false);
                    }}
                >
                    Clear Cart
                </button>
            </>
        );
    }
    return (
        <div id="cart">
            <h3>Logged in</h3>
            <button
                onClick={() => {
                    fetch('/api/user/logout', { method: 'POST' }).then(
                        (resp) => {
                            if (resp.ok) {
                                setLoggedIn(false);
                            }
                        }
                    );
                }}
            >
                Log out
            </button>
            <hr />
            <h2>Cart</h2>
            {content}
        </div>
    );
}

function Checkout({
    count,
    setCart,
    setShowCheckout,
}: {
    count: Map<ProductObj, number>;
    setCart: React.Dispatch<React.SetStateAction<CartObj>>;
    setShowCheckout: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [cc, setCc] = useState('');
    return (
        <div id="checkout">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!/^\d{15,16}$/.test(cc)) return;
                    let outCart = {} as any;
                    for (const [product, quantity] of count.entries()) {
                        outCart[product.id] = quantity;
                    }

                    fetch('/api/checkout', {
                        method: 'POST',
                        body: JSON.stringify({
                            count: outCart,
                            cc,
                        }),
                    }).then((resp) => {
                        if (resp.ok) {
                            setCart(new CartObj());
                            setShowCheckout(false);
                        }
                    });
                }}
            >
                <label>
                    Credit Card:{' '}
                    <input
                        type="text"
                        name="credit-card"
                        value={cc}
                        onChange={(e) => {
                            if (!/^\d{0,16}$/.test(e.target.value)) return;
                            setCc(e.target.value);
                        }}
                    />
                </label>
                <button>Submit Checkout</button>
            </form>
        </div>
    );
}
