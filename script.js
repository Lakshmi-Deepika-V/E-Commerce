const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");
const sortSelect = document.getElementById("sortSelect");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const chartCanvas = document.getElementById("cartChart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCategoryFilter() {
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}
updateCategoryFilter();

function displayProducts(filtered = products) {
  productsContainer.innerHTML = "";
  filtered.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <p>Rating: ${product.rating} ⭐</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productsContainer.appendChild(div);
  });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  renderChart();
}

function displayCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x ${item.qty}
      <button onclick="removeFromCart(${item.id})">❌</button>
    `;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total.toFixed(2);
}

function filterAndDisplay() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const maxPrice = +priceFilter.value;
  let result = products.filter(p =>
    p.name.toLowerCase().includes(search) &&
    (category === "" || p.category === category) &&
    p.price <= maxPrice
  );
  const sort = sortSelect.value;
  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  displayProducts(result);
}

searchInput.addEventListener("input", filterAndDisplay);
categoryFilter.addEventListener("change", filterAndDisplay);
priceFilter.addEventListener("input", () => {
  priceValue.textContent = priceFilter.value;
  filterAndDisplay();
});
sortSelect.addEventListener("change", filterAndDisplay);

let chart;
function renderChart() {
  const ctx = chartCanvas.getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: cart.map(i => i.name),
      datasets: [{
        label: "Qty in Cart",
        data: cart.map(i => i.qty),
        backgroundColor: "rgba(52, 152, 219, 0.7)"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Initial load
displayProducts();
displayCart();
renderChart();
