// ============================================
// The Golden Hues - Main JavaScript
// ============================================

// Global state management
const GoldenHues = {
    currentUser: null,
    swarPoints: 0,
    tier: 'Shrotā',
    badges: [],
    
    init() {
        this.setupEventListeners();
        this.animateStats();
        this.loadUserData();
    },
    
    setupEventListeners() {
        // Modal controls
        const modal = document.getElementById('loginModal');
        const loginBtn = document.getElementById('loginBtn');
        const getStartedBtn = document.getElementById('getStartedBtn');
        const closeBtn = document.querySelector('.close');
        
        if (loginBtn) {
            loginBtn.onclick = () => modal.style.display = 'block';
        }
        
        if (getStartedBtn) {
            getStartedBtn.onclick = () => modal.style.display = 'block';
        }
        
        if (closeBtn) {
            closeBtn.onclick = () => modal.style.display = 'none';
        }
        
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
        
        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger) {
            hamburger.onclick = () => {
                navLinks.classList.toggle('active');
            };
        }
        
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        if (navLinks && navLinks.classList.contains('active')) {
                            navLinks.classList.remove('active');
                        }
                    }
                }
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.main-nav');
            if (nav) {
                if (window.scrollY > 100) {
                    nav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                } else {
                    nav.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
            }
        });
    },
    
    animateStats() {
        const memberCountElement = document.getElementById('memberCount');
        if (memberCountElement) {
            this.animateNumber(memberCountElement, 0, 2847, 2000);
        }
    },
    
    animateNumber(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    },
    
    loadUserData() {
        const userData = localStorage.getItem('goldenHuesUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    },
    
    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('goldenHuesUser', JSON.stringify(this.currentUser));
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    GoldenHues.init();
});

// Utility function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-family: 'Poppins', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
