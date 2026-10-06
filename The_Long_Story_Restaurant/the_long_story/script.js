const menuItems = [
  {id:1,name:"Crispy Chicken",category:"starters",price:329,desc:"Golden, crisp chicken with a house-made glaze.",rating:"4.8",image:"images/signature-dish.png"},
  {id:2,name:"Paneer Tikka",category:"starters",price:279,desc:"Charred paneer, peppers and aromatic spices.",rating:"4.7"},
  {id:3,name:"Butter Chicken",category:"indian",price:349,desc:"Tender chicken in a rich, silky tomato gravy.",rating:"4.9"},
  {id:4,name:"Chicken Biryani",category:"indian",price:299,desc:"Fragrant basmati rice, chicken and warm spices.",rating:"4.8"},
  {id:5,name:"Paneer Butter Masala",category:"indian",price:289,desc:"Soft paneer in a creamy tomato-based sauce.",rating:"4.7"},
  {id:6,name:"Chicken Hakka Noodles",category:"asian",price:279,desc:"Wok-tossed noodles with chicken and vegetables.",rating:"4.6"},
  {id:7,name:"Thai Green Curry",category:"asian",price:319,desc:"Creamy coconut curry with fragrant Thai herbs.",rating:"4.8"},
  {id:8,name:"Alfredo Pasta",category:"italian",price:299,desc:"Creamy parmesan sauce with perfectly cooked pasta.",rating:"4.7"},
  {id:9,name:"Margherita Pizza",category:"italian",price:289,desc:"Tomato, mozzarella and basil on a crisp base.",rating:"4.6"},
  {id:10,name:"Chocolate Brownie",category:"desserts",price:199,desc:"Warm chocolate brownie served with vanilla cream.",rating:"4.9"},
  {id:11,name:"Classic Tiramisu",category:"desserts",price:229,desc:"Coffee-soaked layers with mascarpone cream.",rating:"4.8"},
  {id:12,name:"Strawberry Fizz",category:"drinks",price:169,desc:"A refreshing sparkling berry cooler.",rating:"4.6"}
];

let cart = JSON.parse(localStorage.getItem("tlsCart") || "[]");

function renderMenu(category="all"){
  const grid=document.getElementById("menuGrid");
  const items=category==="all"?menuItems:menuItems.filter(i=>i.category===category);
  grid.innerHTML=items.map(item=>`
    <article class="food-card">
      <div class="food-card-img">
        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : `<div class="food-placeholder">${item.name}</div>`}
      </div>
      <div class="food-info">
        <div class="food-top"><h3 class="food-name">${item.name}</h3><span class="food-price">₹${item.price}</span></div>
        <p class="food-desc">${item.desc}</p>
        <div class="food-bottom"><span class="rating">★ ${item.rating}</span><button class="add-btn" onclick="addToCart(${item.id})">Add to cart</button></div>
      </div>
    </article>`).join("");
}

function addToCart(id){
  const item=menuItems.find(i=>i.id===id);
  const existing=cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({...item,qty:1});
  saveCart();
  openCart();
}

function changeQty(id,delta){
  const item=cart.find(i=>i.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0)cart=cart.filter(i=>i.id!==id);
  saveCart();
}

function saveCart(){
  localStorage.setItem("tlsCart",JSON.stringify(cart));
  renderCart();
  document.getElementById("cartCount").textContent=cart.reduce((sum,i)=>sum+i.qty,0);
}

function renderCart(){
  const box=document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML='<div style="padding:50px 0;text-align:center;color:#817b71;font-size:13px">Your cart is waiting for a good story.</div>';
  }else{
    box.innerHTML=cart.map(i=>`
      <div class="cart-row">
        <div><h4>${i.name}</h4><p>₹${i.price} each</p></div>
        <div class="qty"><button onclick="changeQty(${i.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${i.id},1)">+</button></div>
      </div>`).join("");
  }
  const subtotal=cart.reduce((sum,i)=>sum+i.price*i.qty,0);
  const tax=subtotal*.05;
  document.getElementById("subtotal").textContent=`₹${subtotal.toFixed(0)}`;
  document.getElementById("tax").textContent=`₹${tax.toFixed(0)}`;
  document.getElementById("total").textContent=`₹${(subtotal+tax).toFixed(0)}`;
}

function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("backdrop").classList.add("open");renderCart()}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("backdrop").classList.remove("open")}
function checkout(){
  if(!cart.length){alert("Your cart is empty. Add something delicious first.");return}
  alert("Checkout demo: your order has been prepared successfully!");
}
function scrollToMenu(){document.getElementById("menu").scrollIntoView({behavior:"smooth"})}
function toggleNav(){document.querySelector(".nav nav").classList.toggle("mobile-open")}

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderMenu(btn.dataset.category);
  });
});

document.getElementById("reservationForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("guestName").value.trim();
  const date=document.getElementById("bookingDate").value;
  const time=document.getElementById("bookingTime").value;
  document.getElementById("reservationMessage").textContent=
    `Thank you, ${name}. Your table request for ${date} at ${time} has been received.`;
  e.target.reset();
});

document.getElementById("bookingDate").min=new Date().toISOString().split("T")[0];
renderMenu();
saveCart();
