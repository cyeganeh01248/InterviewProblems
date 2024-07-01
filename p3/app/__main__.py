from sqlite3 import connect

from flask import Flask, Response, redirect, render_template, request, session

app = Flask(__name__)

app.secret_key = b"IcCcqLIyoMW4R4UdAH1EmpwBG4F-dKgO"


@app.get("/")
def index() -> Response:
    db = connect("app.db")
    cur = db.cursor()
    cur.execute(
        "SELECT username, text FROM comments ORDER BY cid "
    )
    comments = cur.fetchall()
    resp = Response(
        render_template(
            "index.html",
            comments=comments,
            username=session.get("username"),
        )
    )
    return resp


@app.post("/login")
def login() -> Response:
    session["username"] = request.form["username"]
    return redirect("/")


@app.post("/logout")
def logout() -> Response:
    session.clear()
    return redirect("/")


@app.post("/comment")
def add_comment() -> Response:
    db = connect("app.db")
    cur = db.cursor()

    if session.get('username'):
        cur.execute(
            "INSERT INTO comments (username, text) VALUES (?, ?)",
            (session['username'], request.form.get("comment")),
        )
    db.commit()
    return redirect("/")


@app.get("/search")
def search_comments() -> tuple[list[list[str]], int]:
    db = connect("app.db")
    cur = db.cursor()
    if len(request.args.get("q", "")) < 3:
        return [], 200
    try:
        cur.execute(
            f'select username, text from comments WHERE ('
            f"  text like '{request.args.get('q', '')}%' OR "
            f" username like '%{request.args.get('q', '')}%' "
            f')'
        )
        results = cur.fetchall()
        return results, 200
    except:
        return [], 400


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )
