let currentSection = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeNavigation();
        initializeUserDropdown();
        loadSection('overview');
        console.log('Dashboard initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

const initializeNavigation = () => {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                loadSection(section);
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
};

const loadSection = (section) => {
    currentSection = section;
    document.querySelectorAll('.section-content').forEach(el => el.style.display = 'none');
    const element = document.getElementById(section) || document.getElementById('dashboard');
    if (element) element.style.display = 'block';
    updateHeaderTitle(section);
};

const updateHeaderTitle = (section) => {
    const titles = {
        'dashboard': 'Dashboard',
        'overview': 'Dashboard Overview', 
        'performance': 'Performance',
        'activity-log': 'Activity Log'
    };
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) headerTitle.textContent = titles[section] || 'Dashboard';
};

function initializeUserDropdown() {
    const toggle = document.getElementById('userDropdownToggle');
    const dropdown = document.getElementById('userDropdown');
    
    if (!toggle || !dropdown) return;
    
    toggle.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('open');
    };
    
    document.onclick = function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    };
}

// Placeholder functions for onclick handlers
function openUserProfile() { console.log('Opening user profile...'); }
function showLogoutConfirm() { console.log('Showing logout confirmation...'); }
function toggleFilterPanel() { console.log('Toggle filter panel'); }
function refreshDashboard() { console.log('Refreshing dashboard...'); }
function openNotificationCenter() { console.log('Opening notification center...'); }
function closeAllForms() { console.log('Closing all forms...'); }