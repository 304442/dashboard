let currentSection='dashboard';

document.addEventListener('DOMContentLoaded',()=>{
    console.log('DOM loaded, starting initialization...');
    
    try {
        setViewMode(localStorage.getItem('dashboardViewMode')||'grid');
        handleResponsiveSidebar();
        window.addEventListener('resize',handleResponsiveSidebar);
        initializeNavigation();
        initializeModals();
        initializeQuickActions();
        initializeForms();
        initializeSearch();
        initializeUserDropdown();
        loadSection('overview');
        updateDateTime();
        setInterval(updateDateTime,60000);
        console.log('All initialization completed successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

const handleResponsiveSidebar=()=>document.querySelector('.sidebar')?.classList.toggle('mobile',window.innerWidth<=768);

const initializeNavigation=()=>{
    document.querySelectorAll('.nav-item').forEach(i=>i.replaceWith(i.cloneNode(true)));
    document.querySelectorAll('.nav-item').forEach(i=>i.addEventListener('click',function(e){
        e.preventDefault();
        const s=this.getAttribute('data-section');
        if(s){
            loadSection(s);
            document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
            this.classList.add('active');
            if(window.innerWidth<=768)document.querySelector('.sidebar')?.classList.remove('show');
        }
    }));
};

const loadSection=s=>{
    currentSection=s;
    document.querySelectorAll('.section-content').forEach(e=>e.style.display='none');
    const el=document.getElementById(s)||document.getElementById('dashboard');
    if(el)el.style.display='block';
    updateHeaderTitle(s);
    refreshSectionData(s);
};

const updateHeaderTitle=s=>{
    const titles={'dashboard':'Dashboard','overview':'Dashboard Overview','performance':'Performance','activity-log':'Activity Log'};
    const headerTitle=document.querySelector('.header-title');
    if(headerTitle)headerTitle.textContent=titles[s]||'Dashboard';
};

const refreshSectionData=s=>({
    'dashboard':updateDashboardStats,
    'health':loadHealthRecords,
    'feed':updateFeedInventory,
    'financial':updateFinancialSummary,
    'reports':generateReports
}[s]||function(){})();

function initializeUserDropdown() {
    console.log('🔧 Initializing user dropdown...');
    
    const toggle = document.getElementById('userDropdownToggle');
    const dropdown = document.getElementById('userDropdown');
    
    console.log('Toggle element:', toggle);
    console.log('Dropdown element:', dropdown);
    
    if (!toggle || !dropdown) {
        console.error('❌ Missing dropdown elements!', {toggle: !!toggle, dropdown: !!dropdown});
        return;
    }
    
    toggle.onclick = function(e) {
        console.log('🖱️ Dropdown clicked!');
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('open');
        console.log('📋 Classes after toggle:', dropdown.className);
    };
    
    document.onclick = function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    };
    
    console.log('✅ Dropdown initialized successfully');
}

// Minimal required functions
function setViewMode(mode) { /* stub */ }
function initializeModals() { /* stub */ }
function initializeQuickActions() { /* stub */ }
function initializeForms() { /* stub */ }
function initializeSearch() { /* stub */ }
function updateDashboardStats() { /* stub */ }
function loadHealthRecords() { /* stub */ }
function updateFeedInventory() { /* stub */ }
function updateFinancialSummary() { /* stub */ }
function generateReports() { /* stub */ }
function updateDateTime() { /* stub */ }

function openUserProfile() {
    console.log('Opening user profile...');
}

function showLogoutConfirm() {
    console.log('Showing logout confirmation...');
}