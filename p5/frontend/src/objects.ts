export class CartObj {
    public items: ProductObj[];
    constructor(items: ProductObj[] = []) {
        this.items = items;
    }
    addItem(item: ProductObj) {
        this.items.push(item);
    }
}
export class ProductObj {
    id: number;
    product_name: string;
    price: number;
    stock: number;
    warehouse: number;
    constructor(
        id: number,
        product_name: string,
        price: number,
        stock: number,
        warehouse: number
    ) {
        this.id = id;
        this.product_name = product_name;
        this.price = price;
        this.stock = stock;
        this.warehouse = warehouse;
    }
}
