/* --- VARIABLES --- */
let cart = [];
const modal = document.getElementById('orderModal');
const closeBtn = document.getElementById('closeModal');
const orderNavBtn = document.querySelector('.order-link');

/* --- 1. SIZE SELECTION --- */
document.querySelectorAll('.price-group').forEach(group => {
    group.addEventListener('click', function () {
        const card = this.closest('.menu-item-card');
        card.querySelectorAll('.price-group').forEach(g => g.classList.remove('selected'));
        this.classList.add('selected');
    });
});

/* --- UPDATED 1. & 2. ADD TO CART LOGIC --- */
document.querySelectorAll('.cart-icon-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.menu-item-card');
        const name = card.querySelector('.name').innerText;

        // CHECK IF SIZE IS SELECTED
        const selectedGroup = card.querySelector('.price-group.selected');

        if (!selectedGroup) {
            // Shake effect or alert if no size is chosen
            card.classList.add('shake-error');
            setTimeout(() => card.classList.remove('shake-error'), 500);
            alert("Please select a size first!");
            return;
        }

        const sizeName = selectedGroup.querySelector('.size-label').innerText;
        const priceVal = parseFloat(selectedGroup.querySelector('.price-val').innerText.replace(/[^0-9.]/g, ''));

        const existingItem = cart.find(item => item.name === name && item.size === sizeName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, size: sizeName, price: priceVal, quantity: 1 });
        }

        // GREEN FEEDBACK STATE
        const originalHTML = button.innerHTML;
        button.classList.add('success-green');
        button.innerHTML = '✓';

        setTimeout(() => {
            button.classList.remove('success-green');
            button.innerHTML = originalHTML;
        }, 1000);
    });
});

/* --- UPDATED 3. RENDER MODAL WITH QUANTITY CONTROLS --- */
function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');

    if (cart.length === 0) {
        container.innerHTML = `<p style="color: var(--gray); text-align: center;">Your tray is empty.</p>`;
        totalEl.innerText = "₱0.00";
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += (item.price * item.quantity);
        container.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-size-tag">${item.size}</span>
                    <div class="cart-item-price">₱${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                
                <div class="qty-control-wrapper">
                    <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                </div>

                <button class="remove-item-btn" onclick="deleteItem(${index})">✕</button>
            </div>
        `;
    });

    animateValue(totalEl, 0, total, 500);
}

/* --- NEW HELPER FUNCTIONS FOR MODAL --- */
function updateQty(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }
    renderCart();
}

function deleteItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// Update the animateValue to use Pesos instead of Dollars
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = "₱" + (progress * (end - start) + start).toLocaleString(undefined, { minimumFractionDigits: 2 });
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

/* --- 4. MODAL CONTROLS & CLICK OUTSIDE --- */
orderNavBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    renderCart();
});

closeBtn.addEventListener('click', () => modal.classList.remove('active'));

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

/* --- 5. HELPERS --- */
function removeItem(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    renderCart();
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = "₱" + (progress * (end - start) + start).toFixed(2);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

/* --- UPDATED: CONFIRM ORDER LOGIC (REPLACED WHATSAPP) --- */
const confirmOrderBtn = document.getElementById('confirm-order-btn');

if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your tray is empty!");
            return;
        }

        const totalAmount = document.getElementById('cart-total-price').innerText;

        // 1. Clear the tray data
        cart = [];

        // 2. Show Success Screen inside the modal
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div class="success-screen">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--primary); margin-bottom: 20px; display: block;"></i>
                <h2 style="letter-spacing: 2px; color: white; margin-bottom: 10px;">ORDER PLACED!</h2>
                <p style="color: var(--gray); margin-bottom: 20px;">Your total of ${totalAmount} has been recorded.<br>Thank you for choosing Usual DVO!</p>
                <button onclick="location.reload()" class="tab-btn confirm-btn" style="width: 100%;">DONE</button>
            </div>
        `;
    });
}

/* --- NEW: BACK TO MENU BUTTON LOGIC --- */
document.getElementById('back-to-menu-btn').addEventListener('click', () => {
    modal.classList.remove('active'); // Close the modal
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' }); // Scroll to menu
});

/* --- 6. TABS & OBSERVER (Unchanged) --- */
function openCategory(evt, categoryName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("category-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    const targetCat = document.getElementById(categoryName);
    if (targetCat) {
        targetCat.style.display = "block";
        setTimeout(() => targetCat.classList.add("active"), 10);
        // Force reset to page 1 and update indicator
        changePage(categoryName, 1);
    }
    evt.currentTarget.classList.add("active");
}

function changePage(category, pageNum) {
    // 1. Hide all pages in this category and show the target page
    const pages = document.querySelectorAll(`.${category}-p`);
    pages.forEach(p => {
        p.classList.remove('active');
        p.style.display = "none"; // Ensure hidden pages don't take space
    });

    const targetPage = document.getElementById(`${category}-p${pageNum}`);
    if (targetPage) {
        targetPage.style.display = "block";
        // Small timeout to allow the transition/display to register
        setTimeout(() => targetPage.classList.add('active'), 10);

        // 2. Update the Page Indicator Text
        const categoryContainer = document.getElementById(category);
        const indicator = categoryContainer.querySelector('.page-indicator');
        const totalPages = pages.length;

        if (indicator) {
            indicator.innerText = `Page ${pageNum} of ${totalPages}`;
        }
    }
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('appear');
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* --- HAMBURGER MENU LOGIC --- */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

// Toggle Menu Open/Close
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Change icon from Bars to X
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close menu when a link is clicked
navItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

/* ... (Your existing cart and intersection observer logic) ... */