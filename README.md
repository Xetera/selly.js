# selly.js
A simple selly API wrapper



### Getting started
```js
const selly = require('selly.js');

const api = selly("your@email.here", "your-api-key-here");

api.getProducts().then(products => console.log(products));
```


### Available methods
```
getCoupons(): Promise<Coupon[]>
getCoupon(id): Promise<Coupon>
createCoupon(couponObject): Promise<Coupon>
updateCoupon(id, couponObject): Promise<Coupon>

getOrders(): Promise<Order[]>
getOrder(id): Promise<Order>

getProducts(): Promise<Product[]>
getProduct(id): Promise<Product>
createProduct(productObject): Promise<Product>
updateProduct(id, productObject): Promise<Product>
deleteProduct(id): Promise<void>

getProductGroups(): Promise<Product[]>
getProductGroup(id): Promise<Product>

getQueries(): Promise<Query[]>
getQuery(id): Promise<Query>

createPayment(paymentObject): Promise<Payment>
deletePayment(id): Promise<{ status: true }>
```

###### Note: Not supporting pagination yet because I'm lazy
