import { Products } from './products.tsx';
import React, { useEffect, useState } from 'react';
import { Cart } from './carts.tsx';
import { CartObj } from './objects.ts';

export default function App() {
    const [loggedIn, setLoggedIn] = useState(true);
    const [cart, setCart] = useState(new CartObj());
    useEffect(() => {
        setCart(new CartObj());
    }, [loggedIn]);
    let loginCheckInterval;
    useEffect(() => {
        let login_check = () => {
            fetch('/api/user/check').then((resp) => {
                setLoggedIn(resp.ok);
            });

            loginCheckInterval = setTimeout(login_check, 15 * 1000);
        };
        login_check();
        return () => {
            clearInterval(loginCheckInterval!);
        };
    }, []);
    return (
        <>
            <div id="side">
                {loggedIn ? (
                    <Cart
                        cart={cart}
                        setCart={setCart}
                        setLoggedIn={setLoggedIn}
                    />
                ) : (
                    <LoginBar setLoggedIn={setLoggedIn} />
                )}
            </div>

            <Body loggedIn={loggedIn} cart={cart} setCart={setCart} />
        </>
    );
}
function LoginBar({
    setLoggedIn,
}: {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <div id="login-bar">
            <h3>Logged out</h3>
            <form
                onSubmit={async function processLogin(e) {
                    e.preventDefault();
                    let email = document.getElementById(
                        'email'
                    )! as HTMLInputElement;
                    let password = document.getElementById(
                        'password'
                    )! as HTMLInputElement;
                    await fetch(
                        '/api/user/login?' +
                            new URLSearchParams({
                                email: email.value,
                                password: password.value,
                            })
                    ).then((resp) => {
                        setLoggedIn(resp.ok);
                    });
                }}
            >
                <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                />
                <input
                    id="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
function Body({
    loggedIn,
    cart,
    setCart,
}: {
    loggedIn: boolean;
    cart: CartObj;
    setCart: React.Dispatch<React.SetStateAction<CartObj>>;
}) {
    return (
        <div id="body">
            <Products cart={cart} setCart={setCart} loggedIn={loggedIn} />
        </div>
    );
}
