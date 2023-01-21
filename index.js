const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 
app.use(cookieSession({
    keys: ['thiswillencryptthecookie']
}));

app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});