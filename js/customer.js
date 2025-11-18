// ============================================
// Customer Portal JavaScript
// ============================================

const CustomerPortal = {
    user: {
        name: 'Ananya Roy',
        email: 'ananya@example.com',
        tier: 'Rasik',
        swarPoints: 3250,
        totalSpent: 12500,
        visits: 24,
        badges: [
            { name: 'First Sip', icon: 'fa-coffee', earned: '2024-10-15' },
            { name: 'Sudhin Devotee', icon: 'fa-music', earned: '2024-11-01' },
            { name: 'Conversation Starter', icon: 'fa-comments', earned: '2024-11-10' },
            { name: 'Morning Raga', icon: 'fa-sun', earned: '2024-11-15' }
        ]
    },
    
    cart: [],
    currentSection: 'dashboard',
    
    init() {
        this.loadUserData();
        this.renderDashboard();
        this.setupNavigation();
        this.setupEventListeners();
    },
    
    loadUserData() {
        const saved = localStorage.getItem('goldenHuesCustomer');
        if (saved) {
            this.user = { ...this.user, ...JSON.parse(saved) };
        }
    },
    
    saveUserData() {
        localStorage.setItem('goldenHuesCustomer', JSON.stringify(this.user));
    },
    
    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });
    },
    
    showSection(section) {
        document.querySelectorAll('.section-content').forEach(s => {
            s.classList.remove('active');
        });
        
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-section="${section}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
        
        this.currentSection = section;
        
        switch(section) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'menu':
                this.renderMenu();
                break;
            case 'quiz':
                this.renderQuiz();
                break;
            case 'rewards':
                this.renderRewards();
                break;
        }
    },
    
    renderDashboard() {
        const tierProgress = this.calculateTierProgress();
        const nextTierPoints = this.getNextTierPoints();
        
        document.getElementById('userName').textContent = this.user.name;
        document.getElementById('userNameTitle').textContent = this.user.name.split(' ')[0];
        document.getElementById('userTier').textContent = this.user.tier;
        document.getElementById('swarPoints').textContent = this.user.swarPoints.toLocaleString();
        document.getElementById('totalVisits').textContent = this.user.visits;
        document.getElementById('totalSpent').textContent = `₹${this.user.totalSpent.toLocaleString()}`;
        document.getElementById('badgeCount').textContent = this.user.badges.length;
        
        const progressBar = document.getElementById('tierProgress');
        const progressText = document.getElementById('tierProgressText');
        if (progressBar && progressText) {
            setTimeout(() => {
                progressBar.style.width = `${tierProgress}%`;
            }, 100);
            progressText.textContent = `${this.user.swarPoints} / ${nextTierPoints} points to next tier`;
        }
        
        this.renderBadges();
    },
    
    calculateTierProgress() {
        const tierThresholds = {
            'Shrotā': 0,
            'Rasik': 5000,
            'Kalakar': 12000,
            'Guru': 25000,
            'Legend': 50000
        };
        
        const currentThreshold = tierThresholds[this.user.tier];
        const nextTier = this.getNextTier();
        const nextThreshold = tierThresholds[nextTier];
        
        if (nextTier === 'Legend' && this.user.tier === 'Legend') {
            return 100;
        }
        
        const progress = ((this.user.swarPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
        return Math.min(100, Math.max(0, progress));
    },
    
    getNextTier() {
        const tiers = ['Shrotā', 'Rasik', 'Kalakar', 'Guru', 'Legend'];
        const currentIndex = tiers.indexOf(this.user.tier);
        return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : 'Legend';
    },
    
    getNextTierPoints() {
        const tierPoints = {
            'Shrotā': 5000,
            'Rasik': 12000,
            'Kalakar': 25000,
            'Guru': 50000,
            'Legend': 50000
        };
        return tierPoints[this.getNextTier()];
    },
    
    renderBadges() {
        const container = document.getElementById('badgesContainer');
        if (!container) return;
        
        container.innerHTML = this.user.badges.map(badge => `
            <div class="badge-item" title="${badge.name} - Earned on ${badge.earned}">
                <div class="badge-icon">
                    <i class="fas ${badge.icon}"></i>
                </div>
                <div class="badge-name">${badge.name}</div>
            </div>
        `).join('');
    },
    
    renderMenu() {
        const menuItems = this.getMenuItems();
        const container = document.getElementById('menuItemsContainer');
        
        if (!container) return;
        
        container.innerHTML = menuItems.map(item => `
            <div class="menu-item-card" data-category="${item.category}">
                <div class="menu-item-image">
                    <i class="${item.icon}"></i>
                </div>
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p class="menu-item-desc">${item.description}</p>
                    <p class="menu-item-song">♪ ${item.song}</p>
                    <div class="menu-item-footer">
                        <span class="menu-item-price">₹${item.price}</span>
                        <button class="btn-small btn-primary" onclick="CustomerPortal.addToCart(${item.id})">
                            <i class="fas fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.setupMenuFilters();
    },
    
    setupMenuFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                const items = document.querySelectorAll('.menu-item-card');
                
                items.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    },
    
    getMenuItems() {
        return [
            { id: 1, name: 'Ei Poth Espresso', price: 180, icon: 'fas fa-coffee', 
              description: 'Rich espresso journey with caramel notes', 
              song: 'Ei Poth Jodi Na Shesh Hoy', category: 'hot' },
            { id: 2, name: 'Phire Aye Latte', price: 220, icon: 'fas fa-mug-hot', 
              description: 'Cold brew that brings you back', 
              song: 'Phire Aye Chole Aye', category: 'cold' },
            { id: 3, name: 'Hemanta Brishti', price: 150, icon: 'fas fa-glass-whiskey', 
              description: 'Monsoon iced tea with lemongrass', 
              song: 'Autumn Rains Collection', category: 'cold' },
            { id: 4, name: 'Madhur Dhwani', price: 200, icon: 'fas fa-cocktail', 
              description: 'Sweet harmony latte with vanilla', 
              song: 'Madhur Dhwani Bajao', category: 'hot' },
            { id: 5, name: 'Golden Era Cheesecake', price: 180, icon: 'fas fa-birthday-cake', 
              description: 'Creamy cheesecake with vintage charm', 
              song: 'Dessert Collection', category: 'dessert' },
            { id: 6, name: 'Nostalgia Brownies', price: 120, icon: 'fas fa-cookie', 
              description: 'Warm chocolate brownies', 
              song: 'Sweet Memories', category: 'dessert' }
        ];
    },
    
    addToCart(itemId) {
        const item = this.getMenuItems().find(i => i.id === itemId);
        const existingItem = this.cart.find(i => i.id === itemId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }
        
        this.updateCartUI();
        showNotification(`${item.name} added to cart!`, 'success');
    },
    
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = itemCount;
            cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    },
    
    showCart() {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar) {
            sidebar.classList.add('active');
            this.renderCartItems();
        }
    },
    
    closeCart() {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    },
    
    renderCartItems() {
        const container = document.getElementById('cartItems');
        const totalEl = document.getElementById('cartTotal');
        
        if (!container) return;
        
        if (this.cart.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6c757d;">Your cart is empty</p>';
            if (totalEl) totalEl.textContent = '₹0';
            return;
        }
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        container.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item">
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity}</p>
                <button onclick="CustomerPortal.removeFromCart(${index})">Remove</button>
            </div>
        `).join('');
        
        if (totalEl) totalEl.textContent = `₹${total}`;
    },
    
    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.updateCartUI();
        this.renderCartItems();
    },
    
    checkout() {
        if (this.cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.user.swarPoints += total;
        this.user.totalSpent += total;
        this.user.visits++;
        
        showNotification(`Order placed! You earned ${total} Swar Points!`, 'success');
        
        this.cart = [];
        this.updateCartUI();
        this.closeCart();
        this.saveUserData();
        this.renderDashboard();
    },
    
    renderQuiz() {
        const quizContainer = document.getElementById('quizContainer');
        if (!quizContainer) return;
        
        const dailyQuestion = this.getDailyQuestion();
        
        quizContainer.innerHTML = `
            <div class="quiz-daily">
                <h3>Daily Question</h3>
                <p class="quiz-question">${dailyQuestion.question}</p>
                <div class="quiz-options">
                    ${dailyQuestion.options.map((opt, idx) => `
                        <button class="quiz-option" onclick="CustomerPortal.checkAnswer(${idx}, ${dailyQuestion.correct})">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                <p class="quiz-reward"><i class="fas fa-trophy"></i> Win 25-100 Swar Points!</p>
            </div>
        `;
    },
    
    getDailyQuestion() {
        const questions = [
            {
                question: "In which year did Sudhin Dasgupta compose 'Ei Poth Jodi Na Shesh Hoy'?",
                options: ["1955", "1958", "1962", "1965"],
                correct: 1
            },
            {
                question: "Which singer was most frequently associated with Sudhin Dasgupta's compositions?",
                options: ["Hemanta Mukherjee", "Manna Dey", "Kishore Kumar", "Sandhya Mukherjee"],
                correct: 0
            },
            {
                question: "How many films did Sudhin Dasgupta compose music for?",
                options: ["50+", "75+", "100+", "150+"],
                correct: 2
            }
        ];
        
        const today = new Date().getDay();
        return questions[today % questions.length];
    },
    
    checkAnswer(selected, correct) {
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(opt => opt.disabled = true);
        
        if (selected === correct) {
            options[selected].classList.add('correct');
            const points = 100;
            this.user.swarPoints += points;
            showNotification(`Correct! +${points} Swar Points`, 'success');
        } else {
            options[selected].classList.add('incorrect');
            options[correct].classList.add('correct');
            showNotification('Incorrect! Try again tomorrow.', 'error');
        }
        
        this.saveUserData();
        setTimeout(() => this.renderDashboard(), 1500);
    },
    
    renderRewards() {
        const rewardsContainer = document.getElementById('rewardsContainer');
        if (!rewardsContainer) return;
        
        const rewards = [
            { points: 1000, name: 'Free Coffee (Any Size)', icon: 'fa-coffee' },
            { points: 2000, name: 'Free Dessert + Coffee', icon: 'fa-birthday-cake' },
            { points: 3500, name: 'Free Meal for Two', icon: 'fa-utensils' },
            { points: 5000, name: '20% Off Meeting Zone', icon: 'fa-percentage' },
            { points: 10000, name: 'Golden Era Vinyl Record', icon: 'fa-record-vinyl' }
        ];
        
        rewardsContainer.innerHTML = rewards.map(reward => `
            <div class="reward-card ${this.user.swarPoints >= reward.points ? 'available' : 'locked'}">
                <div class="reward-icon">
                    <i class="fas ${reward.icon}"></i>
                </div>
                <h3>${reward.name}</h3>
                <p class="reward-points">${reward.points.toLocaleString()} points</p>
                ${this.user.swarPoints >= reward.points ? 
                    '<button class="btn-primary" onclick="CustomerPortal.redeemReward(' + reward.points + ')">Redeem</button>' : 
                    `<p class="points-needed">Need ${(reward.points - this.user.swarPoints).toLocaleString()} more points</p>`
                }
            </div>
        `).join('');
    },
    
    redeemReward(points) {
        if (this.user.swarPoints >= points) {
            this.user.swarPoints -= points;
            showNotification('Reward redeemed successfully!', 'success');
            this.saveUserData();
            this.renderDashboard();
            this.renderRewards();
        }
    },
    
    setupEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    window.location.href = 'index.html';
                }
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CustomerPortal.init();
});
