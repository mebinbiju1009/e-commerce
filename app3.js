const express = require("express");

const app = express();
app.use(express.json());

let products = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Mobile", price: 20000 },
  { id: 3, name: "Headphones", price: 2000 }
];

let cart = [];

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>E-Commerce Store</title>
    <style>
      body{
        font-family:Arial;
        max-width:900px;
        margin:auto;
        padding:20px;
        background:#f4f4f4;
      }

      .product{
        background:white;
        padding:10px;
        margin:10px 0;
        border-radius:5px;
      }

      button{
        padding:8px;
        cursor:pointer;
      }

      #cart{
        background:white;
        padding:15px;
        margin-top:20px;
      }
    </style>
  </head>

  <body>

    <h1>Online Store</h1>

    <h2>Products</h2>

    <div id="products"></div>

    <div id="cart">
      <h2>Shopping Cart</h2>
      <div id="cartItems"></div>

      <button onclick="checkout()">
        Checkout
      </button>
    </div>

<script>

function loadProducts(){

fetch('/products')
.then(res=>res.json())
.then(data=>{

document.getElementById('products').innerHTML =
data.map(p => \`
<div class="product">
<h3>\${p.name}</h3>
<p>₹\${p.price}</p>

<button onclick="addToCart(\${p.id})">
Add To Cart
</button>

</div>
\`).join('');

});
}

function loadCart(){

fetch('/cart')
.then(res=>res.json())
.then(data=>{

document.getElementById('cartItems').innerHTML =
data.map(item => \`
<p>\${item.name} - ₹\${item.price}</p>
\`).join('');

});
}

function addToCart(id){

fetch('/cart/'+id,{
method:'POST'
})
.then(()=>{
loadCart();
});

}

function checkout(){

fetch('/checkout',{
method:'POST'
})
.then(res=>res.json())
.then(data=>{
alert(data.message);
loadCart();
});

}

loadProducts();
loadCart();

</script>

  </body>
  </html>
  `);
});

// Products API
app.get("/products", (req, res) => {
  res.json(products);
});

// Cart API
app.get("/cart", (req, res) => {
  res.json(cart);
});

// Add To Cart
app.post("/cart/:id", (req, res) => {
  const product = products.find(
    p => p.id == req.params.id
  );

  if(product){
    cart.push(product);
  }

  res.json({ message: "Added to cart" });
});

// Checkout
app.post("/checkout", (req, res) => {
  cart = [];
  res.json({
    message: "Order placed successfully!"
  });
});

app.listen(3000, () => {
  console.log(
    "Server running at http://localhost:3000"
  );
});