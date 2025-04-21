// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Update cart counter in navbar
    updateCartCounter();
    
    // Load cart items if on cart page
    if (document.getElementById('cart-items-container')) {
        loadCartItems();
    }
    
    // Add event listeners for "Add to Cart" buttons on product pages
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').dataset.price);
            const productImg = productCard.querySelector('.product-img').src;
            
            addToCart(productId, productName, productPrice, productImg);
        });
    });
});

// Add product to cart
function addToCart(id, name, price, img) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            img: img,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    
    // Show success message
    alert(`${name} has been added to your cart!`);
}

// Remove product from cart
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    loadCartItems();
}

// Update product quantity in cart
function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) return;
    
    let cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity = parseInt(newQuantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        updateOrderSummary();
    }
}

// Update cart counter in navbar
function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (counter) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        counter.textContent = totalItems > 0 ? totalItems : '';
    }
}

// Load cart items on cart page
function loadCartItems() {
    const container = document.getElementById('cart-items-container');
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <img src="images/empty-cart.png" alt="Empty Cart">
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet</p>
                <a href="index.html" class="btn btn-primary" style="background-color: #ff77a8; border: none;">Continue Shopping</a>
            </div>
        `;
        document.getElementById('checkout-btn').style.display = 'none';
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="row cart-item align-items-center" data-id="${item.id}">
                <div class="col-md-2">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                </div>
                <div class="col-md-4">
                    <h5>${item.name}</h5>
                    <p class="mb-0">₹${item.price}</p>
                </div>
                <div class="col-md-3">
                    <div class="d-flex align-items-center">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input mx-2" value="${item.quantity}" min="1" onchange="updateQuantity('${item.id}', this.value)">
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="col-md-2 text-end">
                    <p class="mb-0 fw-bold">₹${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="col-md-1 text-end">
                    <span class="remove-item" onclick="removeFromCart('${item.id}')">×</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    updateOrderSummary();
    
    // Show checkout button if it was hidden
    document.getElementById('checkout-btn').style.display = 'block';
}

// Update order summary
function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50; // Fixed shipping cost
    const tax = subtotal * 0.05; // 5% tax
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${(subtotal + shipping + tax).toFixed(2)}`;
}