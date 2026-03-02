// ===== CART STATE =====
let cart = [];

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.getElementById('heroParticles');
  const colors = ['rgba(198,40,40,0.6)', 'rgba(244,196,48,0.4)', 'rgba(255,255,255,0.2)', 'rgba(239,83,80,0.5)'];
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 15;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      background:${color};
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    container.appendChild(p);
  }
}
createParticles();

// ===== CART FUNCTIONS =====
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartTotalEl = document.getElementById('cartTotal');

function openCartSidebar() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('show');
}
function closeCartSidebar() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('show');
}
cartBtn.addEventListener('click', openCartSidebar);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1, id: Date.now() });
  }
  updateCartUI();
  showToast(`✅ تم إضافة "${name}" للسلة`);
  cartBtn.classList.add('bounce');
  setTimeout(() => cartBtn.classList.remove('bounce'), 600);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  cartCount.textContent = totalItems;
  cartCount.classList.toggle('show', totalItems > 0);

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>سلتك فارغة</p></div>`;
    cartFooter.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name} ${item.qty > 1 ? `<span style="color:var(--gray)">×${item.qty}</span>` : ''}</div>
          <div class="cart-item-price">${(item.price * item.qty).toFixed(2)} JD</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join('');
    cartFooter.style.display = 'block';
    cartTotalEl.textContent = totalPrice.toFixed(2);
  }
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===== MENU FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.menu-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeCardIn 0.4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Inject keyframe for card filter animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeCardIn {
    from { opacity:0; transform: scale(0.9) translateY(10px); }
    to { opacity:1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ===== CONTACT FORM =====
function submitForm(e) {
  e.preventDefault();
  showToast('✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
  e.target.reset();
}

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--red-light)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => activeObserver.observe(s));

// ===== WINDOW RESIZE: close mobile menu =====
window.addEventListener('resize', () => {
  if (window.innerWidth > 968) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});
