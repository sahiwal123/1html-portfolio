document.addEventListener('DOMContentLoaded', () => {
    const menu = [
        { id: 1, name: 'Pizza', price: 12.99, image: 'images/pizza.jpg' },
        { id: 2, name: 'Burger', price: 8.99, image: 'images/burger.jpg' },
        { id: 3, name: 'Pasta', price: 10.99, image: 'images/pasta.jpg' }
    ];

    const menuContainer = document.querySelector('#menu .row');
    const cartContainer = document.querySelector('#cart-items');
    const totalPriceElement = document.querySelector('#total-price');
    let cart = [];

    function renderMenu() {
        menuContainer.innerHTML = '';
        menu.forEach(item => {
            const div = document.createElement('div');
            div.className = 'col-md-4 mb-4';
            div.innerHTML = `
                <div class="card">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">$${item.price.toFixed(2)}</p>
                        <button class="btn btn-primary add-to-cart" data-id="${item.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            menuContainer.appendChild(div);
        });
    }

    function renderCart() {
        cartContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'col-md-12 mb-4';
            div.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">$${item.price.toFixed(2)} x ${item.quantity}</p>
                        <button class="btn btn-danger remove-from-cart" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
            cartContainer.appendChild(div);
            total += item.price * item.quantity;
        });
        totalPriceElement.textContent = total.toFixed(2);
    }

    function updateCart(itemId, action) {
        const item = menu.find(item => item.id == itemId);
        if (action === 'add') {
            if (cart.find(cartItem => cartItem.id == itemId)) {
                cart = cart.map(cartItem => cartItem.id == itemId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
            } else {
                cart.push({ ...item, quantity: 1 });
            }
        } else if (action === 'remove') {
            cart = cart.filter(cartItem => cartItem.id != itemId);
        }
        renderCart();
    }

    menuContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const itemId = event.target.dataset.id;
            updateCart(itemId, 'add');
        }
    });

    cartContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const itemId = event.target.dataset.id;
            updateCart(itemId, 'remove');
        }
    });

    document.querySelector('#checkout').addEventListener('click', () => {
        $('#paymentModal').modal('show');
    });

    renderMenu();
});
