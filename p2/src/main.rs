fn main() {
    for i in 0..200 {
        let t = match foo(i) {
            Ok(r_n) => r_n.to_string(),
            Err(_) => "err".to_string(),
        };
        println!("foo({i}): {t}");
    }
    println!();
    for i in 0..200 {
        let t = match fizz(i) {
            Ok(r_n) => r_n.to_string(),
            Err(_) => "err".to_string(),
        };
        println!("fizz({i}): {t}")
    }
}

fn foo(n: u8) -> Result<u128, ()> {
    if n > 185 {
        return Err(());
    }
    let [mut bar, mut baz] = [0, 1];
    for i in 0..n {
        [bar, baz] = [baz, bar + baz];
    }
    return Ok(bar);
}

fn fizz(n: u8) -> Result<u128, ()> {
    if n > 34 {
        return Err(());
    }
    return if n <= 1 {
        Ok(1)
    } else {
        match fizz(n - 1) {
            Ok(t) => Ok(t * (n as u128)),
            Err(_) => Err(()),
        }
    }
}
