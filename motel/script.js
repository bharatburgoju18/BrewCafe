document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuCategories = document.querySelectorAll('.menu-category');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const ctaBtn = document.querySelector('.cta-btn');
    const orderBtn = document.querySelector('.order-btn');
    
    // Cart elements
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Cart state
    let cart = [];
    let cartTotalAmount = 0;

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            menuCategories.forEach(category => {
                category.classList.remove('active');
                if (category.id === targetCategory) {
                    category.classList.add('active');
                }
            });
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            const menuSection = document.getElementById('menu');
            const offsetTop = menuSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    }

    if (orderBtn) {
        orderBtn.addEventListener('click', function() {
            const menuSection = document.getElementById('menu');
            const offsetTop = menuSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    }

    // Cart functionality
    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems === 0) {
            cartCount.classList.add('hidden');
        } else {
            cartCount.classList.remove('hidden');
        }
        
        cartTotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${cartTotalAmount.toFixed(2)}`;
        
        renderCartItems();
    }
    
    function addToCart(itemData) {
        const existingItem = cart.find(item => item.name === itemData.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...itemData,
                quantity: 1
            });
        }
        
        updateCartUI();
        showOrderConfirmation(itemData);
    }
    
    function removeFromCart(itemName) {
        cart = cart.filter(item => item.name !== itemName);
        updateCartUI();
    }
    
    function updateQuantity(itemName, newQuantity) {
        if (newQuantity <= 0) {
            removeFromCart(itemName);
            return;
        }
        
        const item = cart.find(item => item.name === itemName);
        if (item) {
            item.quantity = newQuantity;
            updateCartUI();
        }
    }
    
    function renderCartItems() {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <p class="empty-cart-subtitle">Add some delicious items to get started!</p>
                </div>
            `;
            checkoutBtn.disabled = true;
            return;
        }
        
        checkoutBtn.disabled = false;
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" />
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item" onclick="removeFromCart('${item.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Make functions global for onclick handlers
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;
    
    // Cart event listeners
    cartBtn.addEventListener('click', function() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    cartOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
    
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        alert(`Thank you for your order! Total: $${cartTotalAmount.toFixed(2)}\\n\\nItems:\\n${cart.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\\n')}`);
        
        // Clear cart after checkout
        cart = [];
        updateCartUI();
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                
                const itemName = this.querySelector('h4').textContent;
                const itemPriceText = this.querySelector('.price').textContent;
                const itemPrice = parseFloat(itemPriceText.replace('$', ''));
                const itemImage = this.querySelector('img').src;
                
                const itemData = {
                    name: itemName,
                    price: itemPrice,
                    image: itemImage
                };
                
                addToCart(itemData);
            }, 150);
        });
    });

    function showOrderConfirmation(itemData) {
        const notification = document.createElement('div');
        notification.className = 'order-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${itemData.name} added to cart ($${itemData.price.toFixed(2)})</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #d4a574, #b8935f);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 1003;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Initialize cart
    updateCartUI();

    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(44, 24, 16, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #2c1810 0%, #4a2c20 100%)';
            header.style.backdropFilter = 'none';
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.menu-item, .feature, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const coffeeParticles = document.querySelector('.coffee-cup');
    if (coffeeParticles) {
        coffeeParticles.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05) rotate(2deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        coffeeParticles.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
});