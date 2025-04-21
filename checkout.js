// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Proceed to checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            document.getElementById('cart-items-container').style.display = 'none';
            document.getElementById('delivery-section').style.display = 'block';
        });
    }
    
    // Proceed to payment button
    const proceedToPaymentBtn = document.getElementById('proceed-to-payment');
    if (proceedToPaymentBtn) {
        proceedToPaymentBtn.addEventListener('click', function() {
            if (validateDeliveryForm()) {
                document.getElementById('delivery-section').style.display = 'none';
                document.getElementById('payment-section').style.display = 'block';
            }
        });
    }
    
    // Payment method selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('active');
                document.getElementById(`${opt.dataset.method}-form`).style.display = 'none';
            });
            
            this.classList.add('active');
            document.querySelector(`input[name="paymentMethod"][id="${this.querySelector('input').id}"]`).checked = true;
            
            const formId = `${this.dataset.method}-form`;
            const formElement = document.getElementById(formId);
            if (formElement) {
                formElement.style.display = 'block';
            }
        });
    });
    
    // Place order button
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            if (validatePaymentForm()) {
                processOrder();
            }
        });
    }
});

// Validate delivery form
function validateDeliveryForm() {
    const form = document.getElementById('delivery-form');
    const requiredFields = ['full-name', 'email', 'phone', 'address', 'city', 'zip', 'country'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            element.classList.add('is-invalid');
            isValid = false;
        } else {
            element.classList.remove('is-invalid');
        }
    });
    
    // Validate email format
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    }
    
    return isValid;
}

// Validate payment form
function validatePaymentForm() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
    let isValid = true;
    
    if (selectedMethod === 'creditCard') {
        const cardNumber = document.getElementById('card-number');
        const expiryDate = document.getElementById('expiry-date');
        const cvv = document.getElementById('cvv');
        const cardName = document.getElementById('card-name');
        
        if (!cardNumber.value.trim() || !/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ''))) {
            cardNumber.classList.add('is-invalid');
            isValid = false;
        } else {
            cardNumber.classList.remove('is-invalid');
        }
        
        if (!expiryDate.value.trim() || !/^\d{2}\/\d{2}$/.test(expiryDate.value)) {
            expiryDate.classList.add('is-invalid');
            isValid = false;
        } else {
            expiryDate.classList.remove('is-invalid');
        }
        
        if (!cvv.value.trim() || !/^\d{3,4}$/.test(cvv.value)) {
            cvv.classList.add('is-invalid');
            isValid = false;
        } else {
            cvv.classList.remove('is-invalid');
        }
        
        if (!cardName.value.trim()) {
            cardName.classList.add('is-invalid');
            isValid = false;
        } else {
            cardName.classList.remove('is-invalid');
        }
    } else if (selectedMethod === 'upi') {
        const upiId = document.getElementById('upi-id');
        if (!upiId.value.trim() || !/^[\w.-]+@[\w]+$/.test(upiId.value)) {
            upiId.classList.add('is-invalid');
            isValid = false;
        } else {
            upiId.classList.remove('is-invalid');
        }
    }
    
    return isValid;
}

// Process order
function processOrder() {
    // In a real application, you would send this data to your server
    const cart = JSON.parse(localStorage.getItem('cart'));
    const deliveryInfo = {
        name: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value
    };
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
    const paymentInfo = {};
    
    if (paymentMethod === 'creditCard') {
        paymentInfo.cardNumber = document.getElementById('card-number').value;
        paymentInfo.expiry = document.getElementById('expiry-date').value;
        // In a real app, you wouldn't store the CVV
    } else if (paymentMethod === 'upi') {
        paymentInfo.upiId = document.getElementById('upi-id').value;
    }
    
    // Create order object
    const order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: cart,
        delivery: deliveryInfo,
        payment: {
            method: paymentMethod,
            ...paymentInfo
        },
        status: 'processing'
    };
    
    // Save order to localStorage (in a real app, send to server)
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCounter();
    
    // Redirect to thank you page
    window.location.href = 'thank-you.html';
}