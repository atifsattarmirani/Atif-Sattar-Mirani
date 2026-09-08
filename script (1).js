const products = [
  {id:1,name:"Classic Black Chronograph",price:149.99,category:"Men",rating:4.8,badge:"Best Seller",visual:"visual-men"},
  {id:2,name:"Elegant Rose Gold",price:129.99,category:"Women",rating:4.6,badge:"New",visual:"visual-women"},
  {id:3,name:"Smart Pro Series",price:399.99,category:"Smart",rating:4.9,badge:"Popular",visual:"visual-smart"},
  {id:4,name:"Luxury Gold Chronograph",price:549.99,category:"Luxury",rating:4.7,badge:"Luxury",visual:"visual-luxury"},
  {id:5,name:"Silver Classic",price:179.99,category:"Men",rating:4.5,badge:"",visual:"visual-men"},
  {id:6,name:"Pearl Dial Watch",price:159.99,category:"Women",rating:4.7,badge:"New",visual:"visual-women"},
  {id:7,name:"Smart Sport X",price:289.99,category:"Smart",rating:4.6,badge:"",visual:"visual-smart"},
  {id:8,name:"Heritage Gold",price:699.99,category:"Luxury",rating:4.9,badge:"Premium",visual:"visual-luxury"}
];

let cart = JSON.parse(localStorage.getItem("timestyleCart") || "[]");
let selectedCategory = "All";

const grid = document.getElementById("productsGrid");
const search = document.getElementById("search");
const sort = document.getElementById("sort");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const panel = document.getElementById("cartPanel");
const toast = document.getElementById("toast");

function renderProducts(){
  const term = search.value.trim().toLowerCase();
  let list = products.filter(p => (selectedCategory === "All" || p.category === selectedCategory) && p.name.toLowerCase().includes(term));
  if(sort.value === "low") list.sort((a,b)=>a.price-b.price);
  if(sort.value === "high") list.sort((a,b)=>b.price-a.price);
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-visual ${p.visual}">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <div class="watch"><div class="face"></div><div class="hand"></div></div>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="stars">★★★★★ <span style="color:var(--muted)">(${p.rating})</span></div>
        <button class="add" onclick="addToCart(${p.id})">🛒 Add to Cart</button>
      </div>
    </article>`).join("");
  document.getElementById("noResults").hidden = list.length > 0;
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  cart.push(p);
  localStorage.setItem("timestyleCart", JSON.stringify(cart));
  updateCart();
  toast.textContent = `${p.name} added to cart`;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1600);
}

function removeFromCart(index){
  cart.splice(index,1);
  localStorage.setItem("timestyleCart", JSON.stringify(cart));
  updateCart();
}

function updateCart(){
  cartCount.textContent = cart.length;
  cartItems.innerHTML = cart.length ? cart.map((p,i)=>`
    <div class="cart-item">
      <div><strong>${p.name}</strong><small>$${p.price.toFixed(2)}</small></div>
      <button class="remove" onclick="removeFromCart(${i})">Remove</button>
    </div>`).join("") : `<p style="color:var(--muted);padding:25px 0">Your cart is empty.</p>`;
  cartTotal.textContent = "$" + cart.reduce((sum,p)=>sum+p.price,0).toFixed(2);
}

search.addEventListener("input", renderProducts);
sort.addEventListener("change", renderProducts);

document.querySelectorAll(".category-card").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    selectedCategory = btn.dataset.category;
    document.getElementById("products").scrollIntoView({behavior:"smooth"});
    renderProducts();
  });
});

document.getElementById("cartBtn").addEventListener("click", ()=>{panel.classList.add("open");panel.setAttribute("aria-hidden","false")});
document.getElementById("closeCart").addEventListener("click", ()=>{panel.classList.remove("open");panel.setAttribute("aria-hidden","true")});
document.getElementById("checkoutBtn").addEventListener("click", ()=>alert("Demo checkout — connect a real payment system for production use."));

document.getElementById("themeBtn").addEventListener("click", ()=>{
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  document.documentElement.setAttribute("data-theme", dark ? "light" : "dark");
  document.getElementById("themeBtn").textContent = dark ? "☾" : "☀";
  localStorage.setItem("timestyleTheme", dark ? "light" : "dark");
});

if(localStorage.getItem("timestyleTheme")==="dark"){
  document.documentElement.setAttribute("data-theme","dark");
  document.getElementById("themeBtn").textContent="☀";
}

document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));

updateCart();
renderProducts();
