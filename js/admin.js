// Admin Dashboard JavaScript
const AdminDashboard = {
    init() {
        this.setupNavigation();
        this.initCharts();
        this.loadData();
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
        document.getElementById(section)?.classList.add('active');
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
    },
    
    initCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Revenue (₹)',
                        data: [15000, 18000, 16500, 21000, 19500, 25000, 22000],
                        borderColor: '#D4AF37',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
        
        // Order Distribution Chart
        const orderCtx = document.getElementById('orderChart');
        if (orderCtx) {
            new Chart(orderCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Hot Drinks', 'Cold Drinks', 'Desserts', 'Others'],
                    datasets: [{
                        data: [45, 30, 20, 5],
                        backgroundColor: ['#D4AF37', '#16213E', '#8B2635', '#E8D5C4']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    },
    
    loadData() {
        console.log('Admin dashboard data loaded');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AdminDashboard.init();
});
