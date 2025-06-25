let currentSection='dashboard';document.addEventListener('DOMContentLoaded',()=>{setViewMode(localStorage.getItem('dashboardViewMode')||'grid');(()=>{handleResponsiveSidebar();window.addEventListener('resize',handleResponsiveSidebar)})();initializeNavigation();initializeModals();initializeQuickActions();initializeForms();initializeSearch();initializeUserDropdown();loadSection('dashboard');console.log('Charts initialized');updateDateTime();setInterval(updateDateTime,60000)});const handleResponsiveSidebar=()=>document.querySelector('.sidebar')?.classList.toggle('mobile',window.innerWidth<=768)

const initializeNavigation=()=>document.querySelectorAll('.nav-item').forEach(i=>i.addEventListener('click',function(e){e.preventDefault();const s=this.getAttribute('data-section');if(s){loadSection(s);document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));this.classList.add('active');if(window.innerWidth<=768)document.querySelector('.sidebar')?.classList.remove('show')}}))

const loadSection=s=>{currentSection=s;document.querySelectorAll('.section-content').forEach(e=>e.style.display='none');const el=document.getElementById(s)||document.getElementById('dashboard');if(el)el.style.display='block';updateHeaderTitle(s);refreshSectionData(s)}

const updateHeaderTitle=s=>{const titles={'dashboard':'Dashboard','operations':'Operations','health-monitor':'Health Monitor','health-records':'Health Records','inventory':'Inventory','supply-management':'Supply Management','finance':'Finance','analytics':'Analytics','my-investment':'My Investment','settings':'Settings','financial-analytics':'Financial Analytics','banking':'Banking','market-intelligence':'Market Intelligence','sales-customers':'Sales & Customers','resource-optimization':'Resources','overview':'Dashboard','performance':'Dashboard','activity-log':'Dashboard'},mainSections={'resource-management':'operations','health-records':'health-monitor','financial-analytics':'finance','banking':'finance','market-intelligence':'analytics','sales-customers':'my-investment','resource-optimization':'my-investment','overview':'dashboard','performance':'dashboard','activity-log':'dashboard'},m=mainSections[s]||s,el=document.getElementById('currentSectionSidebar');if(el)el.textContent=titles[m]||'Dashboard';document.querySelectorAll('.dropdown-item').forEach(i=>i.classList.toggle('active',i.getAttribute('data-section')===m));updateSubNavigation(m)}

const updateSubNavigation=m=>{document.querySelectorAll('.sub-nav-section').forEach(s=>s.style.display='none');const el=document.getElementById(m+'-nav');if(el)el.style.display='block';document.querySelectorAll('.sub-nav-section .nav-item').forEach(i=>i.classList.toggle('active',i.getAttribute('data-section')===currentSection))}

const refreshSectionData=s=>({'dashboard':updateDashboardStats,'health':loadHealthRecords,'feed':updateFeedInventory,'financial':updateFinancialSummary,'reports':generateReports}[s]||function(){})()

const initializeModals=()=>{document.querySelectorAll('.modal-overlay').forEach(m=>m.addEventListener('click',function(e){if(e.target===this)closeModal(this.id)}));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllForms()})},openModal=id=>{const m=document.getElementById(id);if(m){m.style.display='flex';document.body.style.overflow='hidden'}},closeModal=id=>{const m=document.getElementById(id);if(m){m.style.display='none';document.body.style.overflow='';const f=m.querySelector('form');if(f)f.reset()}},closeAllForms=()=>{document.querySelectorAll('.modal-overlay').forEach(m=>m.style.display='none');document.body.style.overflow=''}

const initializeForms=()=>[['expenseForm',saveExpense],['revenueForm',saveRevenue],['healthRecordForm',saveHealthRecord]].forEach(([id,fn])=>{const f=document.getElementById(id);if(f)f.addEventListener('submit',e=>{e.preventDefault();fn()})})

const saveExpense=()=>{try{const f=new FormData(document.getElementById('expenseForm')),a=parseFloat(f.get('amount'));if(!f.get('date')||!f.get('category')||!a||a<=0){showNotification('Please fill all required fields with valid data','error');return}const e={date:f.get('date'),category:f.get('category'),amount:a,description:f.get('description')||'',timestamp:new Date().toISOString()};try{let x=JSON.parse(localStorage.getItem('expenses')||'[]');x.push(e);localStorage.setItem('expenses',JSON.stringify(x))}catch(e){showNotification('Storage error. Please try again.','error');return}showNotification('Expense saved successfully','success');closeModal('expenseModal');updateFinancialSummary()}catch(e){console.error('Error saving expense:',e);showNotification('An error occurred. Please try again.','error')}}

const saveRevenue=()=>{const f=new FormData(document.getElementById('revenueForm')),r={date:f.get('date'),source:f.get('source'),amount:parseFloat(f.get('amount')),description:f.get('description'),timestamp:new Date().toISOString()};let x=JSON.parse(localStorage.getItem('revenues')||'[]');x.push(r);localStorage.setItem('revenues',JSON.stringify(x));showNotification('Revenue saved successfully','success');closeModal('revenueModal');updateFinancialSummary()}

const saveHealthRecord=()=>{const f=new FormData(document.getElementById('healthRecordForm')),h={itemId:f.get('itemId'),date:f.get('date'),type:f.get('recordType'),veterinarian:f.get('veterinarian'),diagnosis:f.get('diagnosis'),treatment:f.get('treatment'),medications:f.get('medications'),followUp:f.get('followUp'),cost:parseFloat(f.get('cost')||0),timestamp:new Date().toISOString()};let r=JSON.parse(localStorage.getItem('records')||'[]');r.push(h);localStorage.setItem('records',JSON.stringify(r));showNotification('Record saved successfully','success');closeModal('healthRecordModal');loadHealthRecords()}

const updateDashboardStats=()=>{[['totalItems','150'],['avgMetric','85%'],['growthRate','+12.5%'],['stockLevel','5 days']].forEach(([i,v])=>updateElement(i,v));[['healthProgress',85],['feedProgress',60],['financeProgress',70]].forEach(([i,p])=>updateProgressBar(i,p))},updateElement=(i,v)=>{const e=document.getElementById(i);if(e)e.textContent=v},updateProgressBar=(i,p)=>{const b=document.getElementById(i);if(b){b.style.width=p+'%';b.setAttribute('aria-valuenow',p)}}

const updateFinancialSummary=()=>{const e=JSON.parse(localStorage.getItem('expenses')||'[]'),r=JSON.parse(localStorage.getItem('revenues')||'[]'),te=e.reduce((s,e)=>s+e.amount,0),tr=r.reduce((s,r)=>s+r.amount,0);[['totalExpenses',te],['totalRevenues',tr],['netProfit',tr-te]].forEach(([i,v])=>updateElement(i,formatCurrency(v)))},updateFeedInventory=()=>{const i=['Type A','Type B','Type C'].map(t=>({type:t,current:Math.floor(Math.random()*1000)+100,daily:Math.floor(Math.random()*50)+10,daysRemaining:Math.floor(Math.random()*20)+5})),t=document.querySelector('#supply tbody');if(t)t.innerHTML=i.map(i=>`<tr><td>${i.type}</td><td>${i.current} units</td><td>${i.daily} units</td><td>${i.daysRemaining} days</td><td><span class="badge ${i.daysRemaining<7?'badge-danger':'badge-success'}">${i.daysRemaining<7?'Low':'Sufficient'}</span></td></tr>`).join('')}

const loadHealthRecords=()=>{const r=JSON.parse(localStorage.getItem('records')||'[]'),t=document.querySelector('#health tbody');if(t&&r.length>0)t.innerHTML=r.slice(-10).reverse().map(r=>`<tr><td>${r.itemId||r.sheepId}</td><td>${formatDate(r.date)}</td><td>${r.type}</td><td>${r.diagnosis}</td><td>${r.treatment}</td><td>${formatCurrency(r.cost)}</td></tr>`).join('')},generateReports=()=>console.log('Generating reports...')

const formatCurrency=a=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(a),formatDate=d=>new Intl.DateTimeFormat('en-US').format(new Date(d)),updateDateTime=()=>{const e=document.getElementById('currentDateTime');if(e)e.textContent=new Intl.DateTimeFormat('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date())},showNotification=(m,t='info')=>{const n=document.createElement('div');n.className=`notification notification-${t}`;n.textContent=m;document.body.appendChild(n);setTimeout(()=>n.classList.add('show'),10);setTimeout(()=>{n.classList.remove('show');setTimeout(()=>n.remove(),300)},3000)}

Object.assign(window,{loadSection,openModal,closeModal,closeAllForms,saveExpense,saveRevenue,saveHealthRecord,showNotification});

// Filter Panel - Placeholder function
function toggleFilterPanel() {
    // Filter functionality removed - icon kept for UI consistency
    console.log('Filter panel clicked');
}

// Refresh Dashboard
function refreshDashboard() {
    const refreshBtn = event.currentTarget;
    const icon = refreshBtn.querySelector('svg');
    icon.style.animation = 'spin 1s linear';
    
    showNotification('Refreshing dashboard data...', 'info');
    
    // Simulate refresh
    setTimeout(() => {
        icon.style.animation = '';
        updateDashboardStats();
        showNotification('Dashboard refreshed successfully', 'success');
    }, 1500);
}

// Widget Management
function showAddModal(type) {
    if (type === 'widget') {
        showWidgetSelector();
    } else {
        // Show generic add modal
        openModal('expense-modal');
    }
}

function showWidgetSelector() {
    const modal = document.createElement('div');
    modal.className = 'form-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="form-modal" style="display: block; max-width: 600px;">
            <h3>Add Widget</h3>
            <div class="widget-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0;">
                <div class="widget-option" onclick="addWidget('kpi')" style="padding: 20px; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s;">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 8px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <div style="font-size: 13px; font-weight: 500;">KPI Card</div>
                </div>
                <div class="widget-option" onclick="addWidget('chart')" style="padding: 20px; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s;">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 8px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                    </svg>
                    <div style="font-size: 13px; font-weight: 500;">Chart</div>
                </div>
                <div class="widget-option" onclick="addWidget('table')" style="padding: 20px; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s;">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 8px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <div style="font-size: 13px; font-weight: 500;">Data Table</div>
                </div>
                <div class="widget-option" onclick="addWidget('feed')" style="padding: 20px; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s;">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 8px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div style="font-size: 13px; font-weight: 500;">Activity Feed</div>
                </div>
                <div class="widget-option" onclick="addWidget('calendar')" style="padding: 20px; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s;">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 8px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <div style="font-size: 13px; font-weight: 500;">Calendar</div>
                </div>
                <div class="widget-option" onclick="addWidget('custom')" style="padding: 20px; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s;">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 8px;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                    </svg>
                    <div style="font-size: 13px; font-weight: 500;">Custom</div>
                </div>
            </div>
            <div class="form-actions">
                <button class="button" onclick="this.closest('.form-overlay').remove()">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function addWidget(type) {
    showNotification(`Adding ${type} widget...`, 'info');
    document.querySelector('.form-overlay').remove();
    
    // In a real implementation, this would add the widget to the dashboard
    setTimeout(() => {
        showNotification('Widget added successfully', 'success');
    }, 1000);
}

// Settings Panel
function openSettings() {
    const overlay = document.createElement('div');
    overlay.className = 'settings-overlay';
    overlay.style.display = 'block';
    
    const panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.style.display = 'block';
    panel.innerHTML = `
        <div class="settings-header">
            <h2>Dashboard Settings</h2>
            <button class="icon-button" onclick="closeSettings()">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <div class="settings-tabs">
            <div class="settings-tab active" onclick="showSettingsTab('general')">General</div>
            <div class="settings-tab" onclick="showSettingsTab('appearance')">Appearance</div>
            <div class="settings-tab" onclick="showSettingsTab('data')">Data & Privacy</div>
            <div class="settings-tab" onclick="showSettingsTab('notifications')">Notifications</div>
        </div>
        <div class="settings-content" id="settings-content">
            <div class="settings-group">
                <h3>Language & Region</h3>
                <div class="setting-item">
                    <span class="setting-label">Language</span>
                    <select class="small-select">
                        <option>English</option>
                        <option>Arabic</option>
                        <option>Spanish</option>
                        <option>French</option>
                    </select>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Date Format</span>
                    <select class="small-select">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
            <div class="settings-group">
                <h3>Dashboard Preferences</h3>
                <div class="setting-item">
                    <span class="setting-label">Auto-refresh data</span>
                    <label class="toggle-switch">
                        <input type="checkbox" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Refresh interval</span>
                    <select class="small-select">
                        <option>30 seconds</option>
                        <option>1 minute</option>
                        <option>5 minutes</option>
                        <option>10 minutes</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="form-actions" style="padding: 20px; border-top: 1px solid var(--border);">
            <button class="button button-primary" onclick="saveSettings()">Save Changes</button>
            <button class="button" onclick="closeSettings()">Cancel</button>
        </div>
    `;
    
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeSettings();
        }
    });
}

function closeSettings() {
    const overlay = document.querySelector('.settings-overlay');
    if (overlay) overlay.remove();
}

function showSettingsTab(tab) {
    // Update active tab
    document.querySelectorAll('.settings-tab').forEach(t => {
        t.classList.toggle('active', t.textContent.toLowerCase() === tab);
    });
    
    // Update content based on tab
    const content = document.getElementById('settings-content');
    if (!content) return;
    
    switch(tab) {
        case 'appearance':
            content.innerHTML = `
                <div class="settings-group">
                    <h3>Theme</h3>
                    <div class="setting-item">
                        <span class="setting-label">Color theme</span>
                        <span class="setting-value">Default theme</span>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">Compact mode</span>
                        <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div class="settings-group">
                    <h3>Layout</h3>
                    <div class="setting-item">
                        <span class="setting-label">Sidebar position</span>
                        <select class="small-select">
                            <option>Left</option>
                            <option>Right</option>
                        </select>
                    </div>
                </div>
            `;
            break;
        case 'data':
            content.innerHTML = `
                <div class="settings-group">
                    <h3>Data Management</h3>
                    <div class="setting-item">
                        <span class="setting-label">Clear cache</span>
                        <button class="button button-small">Clear</button>
                    </div>
                </div>
                <div class="settings-group">
                    <h3>Privacy</h3>
                    <div class="setting-item">
                        <span class="setting-label">Share analytics data</span>
                        <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            `;
            break;
        case 'notifications':
            content.innerHTML = `
                <div class="settings-group">
                    <h3>Notification Preferences</h3>
                    <div class="setting-item">
                        <span class="setting-label">Enable notifications</span>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">Email notifications</span>
                        <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">Push notifications</span>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div class="settings-group">
                    <h3>Alert Types</h3>
                    <div class="setting-item">
                        <span class="setting-label">Critical alerts</span>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">Performance alerts</span>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">Update notifications</span>
                        <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            `;
            break;
    }
    
}

function saveSettings() {
    showNotification('Settings saved successfully', 'success');
    closeSettings();
}

// Export/Import functionality
function showExportModal() {
    const modal = document.createElement('div');
    modal.className = 'form-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="form-modal" style="display: block;">
            <h3>Export Data</h3>
            <div class="export-options" style="margin: 20px 0;">
                <div class="export-option" onclick="exportData('csv')">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Export as CSV</span>
                </div>
                <div class="export-option" onclick="exportData('xlsx')">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <span>Export as Excel</span>
                </div>
                <div class="export-option" onclick="exportData('pdf')">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <span>Export as PDF</span>
                </div>
                <div class="export-option" onclick="exportData('json')">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    <span>Export as JSON</span>
                </div>
            </div>
            <div class="form-actions">
                <button class="button" onclick="this.closest('.form-overlay').remove()">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showImportModal() {
    const modal = document.createElement('div');
    modal.className = 'form-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="form-modal" style="display: block;">
            <h3>Import Data</h3>
            <div style="margin: 20px 0; text-align: center;">
                <div style="border: 2px dashed var(--border); border-radius: 8px; padding: 40px; background: var(--bg-secondary);">
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 16px; opacity: 0.5;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p style="margin-bottom: 8px;">Drop files here or click to browse</p>
                    <p style="font-size: 11px; color: var(--text-secondary);">Supports CSV, Excel, JSON files</p>
                    <input type="file" style="display: none;" accept=".csv,.xlsx,.json" onchange="handleFileImport(this)">
                    <button class="button button-small" style="margin-top: 12px;" onclick="this.previousElementSibling.click()">
                        Browse Files
                    </button>
                </div>
            </div>
            <div class="form-actions">
                <button class="button" onclick="this.closest('.form-overlay').remove()">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function exportData(format) {
    showNotification(`Exporting data as ${format.toUpperCase()}...`, 'info');
    document.querySelector('.form-overlay').remove();
    
    // Simulate export
    setTimeout(() => {
        showNotification(`Data exported successfully as ${format.toUpperCase()}`, 'success');
    }, 1500);
}

function handleFileImport(input) {
    const file = input.files[0];
    if (file) {
        showNotification(`Importing ${file.name}...`, 'info');
        document.querySelector('.form-overlay').remove();
        
        // Simulate import
        setTimeout(() => {
            showNotification('Data imported successfully', 'success');
            refreshDashboard();
        }, 2000);
    }
}

// Notification Center
function openNotificationCenter() {
    const modal = document.createElement('div');
    modal.className = 'form-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="form-modal" style="display: block; max-width: 400px;">
            <h3>Notifications</h3>
            <div style="margin: 20px 0;">
                <div class="activity-item">
                    <div class="activity-indicator green"></div>
                    <div class="activity-content">
                        <div class="activity-title">System Update Available</div>
                        <div class="activity-meta">2 hours ago</div>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-indicator orange"></div>
                    <div class="activity-content">
                        <div class="activity-title">Low Feed Stock Alert</div>
                        <div class="activity-meta">5 hours ago</div>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-indicator blue"></div>
                    <div class="activity-content">
                        <div class="activity-title">Weekly Report Generated</div>
                        <div class="activity-meta">Yesterday</div>
                    </div>
                </div>
            </div>
            <div class="form-actions">
                <button class="button button-small" onclick="clearNotifications()">Clear All</button>
                <button class="button" onclick="this.closest('.form-overlay').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function clearNotifications() {
    document.getElementById('notificationCount').textContent = '0';
    document.getElementById('notificationCount').style.display = 'none';
    showNotification('Notifications cleared', 'success');
}

// View Mode Management
function setViewMode(mode) {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', 
            (mode === 'grid' && btn.title === 'Grid View') ||
            (mode === 'list' && btn.title === 'List View')
        );
    });
    
    // Apply view mode to dashboard
    const dashboard = document.querySelector('.dashboard-grid');
    if (dashboard) {
        dashboard.classList.toggle('list-view', mode === 'list');
    }
    
    localStorage.setItem('dashboardViewMode', mode);
}

// Initialize view mode on load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial view mode
    const savedViewMode = localStorage.getItem('dashboardViewMode') || 'grid';
    setViewMode(savedViewMode);
});

// Quick Actions
function initializeQuickActions() {
    // Add expense button
    const addExpenseBtn = document.querySelector('[onclick="showAddExpense()"]');
    if (addExpenseBtn) {
        addExpenseBtn.onclick = function() {
            openModal('expense-modal');
        };
    }
    
    // Add revenue button
    const addRevenueBtn = document.querySelector('[onclick="showAddRevenue()"]');
    if (addRevenueBtn) {
        addRevenueBtn.onclick = function() {
            openModal('revenue-modal');
        };
    }
    
    // Add health record button
    const addHealthBtn = document.querySelector('[onclick="showAddHealthRecord()"]');
    if (addHealthBtn) {
        addHealthBtn.onclick = function() {
            openModal('health-record-modal');
        };
    }
}

// Override functions for compatibility
window.showAddExpense = () => openModal('expense-modal');
window.showAddRevenue = () => openModal('revenue-modal');
window.showAddHealthRecord = () => openModal('health-record-modal');

// User Dropdown Functions
function initializeUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    if (!userDropdown) return;
    
    // Toggle dropdown on click
    userDropdown.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
            if (dropdown !== userDropdown) {
                dropdown.classList.remove('open');
            }
        });
        
        // Toggle user dropdown
        userDropdown.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userDropdown.contains(e.target)) {
            userDropdown.classList.remove('open');
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            userDropdown.classList.remove('open');
        }
    });
}

function openUserProfile() {
    const modal = document.createElement('div');
    modal.className = 'form-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="form-modal" style="display: block; max-width: 400px;">
            <h3>User Profile</h3>
            <div style="margin: 20px 0;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div class="user-avatar" style="width: 80px; height: 80px; font-size: 32px; margin: 0 auto 12px;">US</div>
                    <h4>User</h4>
                    <p style="color: var(--text-secondary); font-size: 13px;">user@example.com</p>
                </div>
                <div class="form-group">
                    <label class="form-label">Display Name</label>
                    <input type="text" class="form-input" value="User" placeholder="Enter display name">
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" value="user@example.com" placeholder="Enter email">
                </div>
                <div class="form-group">
                    <label class="form-label">Role</label>
                    <input type="text" class="form-input" value="Administrator" readonly>
                </div>
            </div>
            <div class="form-actions">
                <button class="button button-primary" onclick="saveProfile(); this.closest('.form-overlay').remove();">Save Changes</button>
                <button class="button" onclick="this.closest('.form-overlay').remove()">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close user dropdown
    document.getElementById('userDropdown')?.classList.remove('open');
}

function saveProfile() {
    showNotification('Profile updated successfully', 'success');
}

function showLogoutConfirm() {
    const modal = document.createElement('div');
    modal.className = 'form-overlay';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="form-modal" style="display: block; max-width: 300px; text-align: center;">
            <h3>Sign Out</h3>
            <p style="margin: 20px 0; color: var(--text-secondary);">Are you sure you want to sign out?</p>
            <div class="form-actions">
                <button class="button button-primary" onclick="performLogout()">Sign Out</button>
                <button class="button" onclick="this.closest('.form-overlay').remove()">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close user dropdown
    document.getElementById('userDropdown')?.classList.remove('open');
}

function performLogout() {
    showNotification('Signing out...', 'info');
    
    // Clear any stored data (optional)
    // localStorage.clear();
    
    // In a real app, this would redirect to login page
    setTimeout(() => {
        showNotification('Signed out successfully', 'success');
        document.querySelector('.form-overlay')?.remove();
    }, 1000);
}

// Export enhanced functions
window.toggleFilterPanel = toggleFilterPanel;
window.refreshDashboard = refreshDashboard;
window.showAddModal = showAddModal;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.showSettingsTab = showSettingsTab;
window.showExportModal = showExportModal;
window.showImportModal = showImportModal;
window.openNotificationCenter = openNotificationCenter;
window.setViewMode = setViewMode;
window.addWidget = addWidget;
window.exportData = exportData;
window.handleFileImport = handleFileImport;
window.clearNotifications = clearNotifications;
window.saveSettings = saveSettings;
window.openUserProfile = openUserProfile;
window.showLogoutConfirm = showLogoutConfirm;
window.performLogout = performLogout;
window.saveProfile = saveProfile;

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('dashboardSearch');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.toLowerCase().trim();
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    // Keyboard shortcut (Ctrl/Cmd + K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });
}

function performSearch(query) {
    if (!query) {
        // Clear search results
        clearSearchHighlights();
        return;
    }
    
    // Search in current section
    const currentContent = document.querySelector('.content');
    if (!currentContent) return;
    
    // Clear previous highlights
    clearSearchHighlights();
    
    // Search in text content
    searchInElement(currentContent, query);
    
    // Search in navigation items
    const navItems = document.querySelectorAll('.nav-item span');
    navItems.forEach(item => {
        if (item.textContent.toLowerCase().includes(query)) {
            item.parentElement.style.backgroundColor = 'var(--warning-light)';
        }
    });
}

function searchInElement(element, query) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    const matches = [];
    
    while (node = walker.nextNode()) {
        if (node.nodeValue && node.nodeValue.toLowerCase().includes(query)) {
            const parent = node.parentElement;
            if (parent && !parent.classList.contains('search-highlight')) {
                matches.push({ node, parent });
            }
        }
    }
    
    // Highlight matches
    matches.forEach(({ node, parent }) => {
        const text = node.nodeValue;
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
        
        const span = document.createElement('span');
        span.innerHTML = highlightedText;
        parent.replaceChild(span, node);
    });
    
    // Scroll to first match
    const firstMatch = document.querySelector('.search-highlight');
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function clearSearchHighlights() {
    // Remove text highlights
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    });
    
    // Reset nav item backgrounds
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (!item.classList.contains('active')) {
            item.style.backgroundColor = '';
        }
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Dropdown functionality
function initializeDropdown() {
    // Initialize sidebar dropdown
    const sidebarDropdown = document.getElementById('sectionDropdownSidebar');
    const sidebarToggle = document.getElementById('dropdownToggleSidebar');
    
    if (sidebarDropdown && sidebarToggle) {
        setupDropdown(sidebarDropdown, sidebarToggle, 'currentSectionSidebar');
    }
}

function setupDropdown(dropdown, toggle, textElementId) {
    const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
    
    // Toggle dropdown
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown.open').forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
        });
        
        dropdown.classList.toggle('open');
    });
    
    // Handle dropdown item clicks
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            // Update active state across all dropdowns
            document.querySelectorAll('.dropdown-item').forEach(i => {
                if (i.getAttribute('data-section') === section) {
                    i.classList.add('active');
                } else {
                    i.classList.remove('active');
                }
            });
            
            // Update dropdown text
            const sectionName = this.querySelector('span').textContent;
            if (textElementId) {
                const textElement = document.getElementById(textElementId);
                if (textElement) textElement.textContent = sectionName;
            }
            
            // Close dropdown
            dropdown.classList.remove('open');
            
            // Load section
            loadSection(section);
            
            // Update sidebar navigation to match
            const sidebarItems = document.querySelectorAll('.nav-item');
            sidebarItems.forEach(navItem => {
                if (navItem.getAttribute('data-section') === section) {
                    navItem.classList.add('active');
                } else {
                    navItem.classList.remove('active');
                }
            });
        });
    });
    
    // Close dropdown when clicking outside (except for sidebar dropdown)
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            // Don't close sidebar dropdown when clicking inside sidebar
            if (dropdown.id === 'sectionDropdownSidebar' && 
                e.target.closest('.sidebar')) {
                return;
            }
            dropdown.classList.remove('open');
        }
    });
    
    // Close dropdown on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdown.classList.remove('open');
        }
    });
}