// Knight Logics Employee Management System
// Professional HR Management Application with Purple/Violet Theme

class EmployeeManagementSystem {
    constructor() {
        this.employees = [];
        this.departments = [];
        this.payrollData = [];
        this.attendanceData = [];
        this.performanceData = [];
        this.benefitsData = [];
        this.reports = [];
        
        this.init();
    }
    
    init() {
        this.injectSiteChrome();
        this.setupNoticeBanner();
        this.showLoadingScreen();
        this.generateSampleData();
        this.setupEventListeners();
        this.hideLoadingScreen();
        this.initializeCharts();
        this.updateDashboardStats();
        this.populateEmployeeGrid();
        this.populatePayrollTable();
        this.updateAttendanceStats();
        this.populatePerformanceData();
        this.populateBenefitsData();
        this.populateReportsData();
    }

    async injectSiteChrome() {
        try {
            const headerEl = document.getElementById('siteHeader');
            const footerEl = document.getElementById('siteFooter');
            if (headerEl) {
                const h = await fetch('../header.html', { cache: 'no-store' });
                if (h.ok) headerEl.innerHTML = await h.text();
            }
            if (footerEl) {
                const f = await fetch('../footer.html', { cache: 'no-store' });
                if (f.ok) footerEl.innerHTML = await f.text();
                footerEl.style.display = 'block';
            }
            document.body.classList.add('has-site-header');
        } catch (e) {
            // ignore
        }
    }

    setupNoticeBanner() {
        const banner = document.getElementById('demoBanner');
        const closeBtn = document.getElementById('demoBannerClose');
        if (!banner) return;
        const dismissed = localStorage.getItem('emsDemoBannerDismissed') === '1';
        if (dismissed) banner.style.display = 'none';
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                banner.style.display = 'none';
                localStorage.setItem('emsDemoBannerDismissed', '1');
            });
        }
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const appContainer = document.getElementById('appContainer');
        
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            if (appContainer) {
                appContainer.classList.add('loaded');
            }
        }, 2000);
    }
    
    generateSampleData() {
        // Sample Departments
        this.departments = [
            { id: 1, name: 'Engineering', manager: 'Sarah Johnson', employeeCount: 15, budget: 2500000 },
            { id: 2, name: 'Sales', manager: 'Michael Chen', employeeCount: 12, budget: 1800000 },
            { id: 3, name: 'Marketing', manager: 'Emily Davis', employeeCount: 8, budget: 1200000 },
            { id: 4, name: 'Human Resources', manager: 'Nicholas Knight', employeeCount: 4, budget: 600000 },
            { id: 5, name: 'Finance', manager: 'Robert Wilson', employeeCount: 6, budget: 900000 }
        ];
        
        // Sample Employees
        this.employees = [
            {
                id: 1, name: 'Sarah Johnson', title: 'Engineering Manager', department: 'Engineering',
                email: 'sarah.johnson@knightlogics.com', phone: '(555) 123-4567',
                salary: 125000, status: 'active', joinDate: '2022-01-15',
                avatar: 'SJ', performance: 4.8, attendance: 96
            },
            {
                id: 2, name: 'Michael Chen', title: 'Sales Director', department: 'Sales',
                email: 'michael.chen@knightlogics.com', phone: '(555) 234-5678',
                salary: 110000, status: 'active', joinDate: '2021-08-20',
                avatar: 'MC', performance: 4.6, attendance: 94
            },
            {
                id: 3, name: 'Emily Davis', title: 'Marketing Manager', department: 'Marketing',
                email: 'emily.davis@knightlogics.com', phone: '(555) 345-6789',
                salary: 95000, status: 'active', joinDate: '2022-03-10',
                avatar: 'ED', performance: 4.7, attendance: 98
            },
            {
                id: 4, name: 'Nicholas Knight', title: 'HR Director', department: 'Human Resources',
                email: 'nicholas.knight@knightlogics.com', phone: '(555) 456-7890',
                salary: 115000, status: 'active', joinDate: '2020-11-05',
                avatar: 'NK', performance: 4.9, attendance: 99
            },
            {
                id: 5, name: 'Robert Wilson', title: 'Finance Manager', department: 'Finance',
                email: 'robert.wilson@knightlogics.com', phone: '(555) 567-8901',
                salary: 105000, status: 'active', joinDate: '2021-05-18',
                avatar: 'RW', performance: 4.5, attendance: 95
            },
            {
                id: 6, name: 'Jessica Liu', title: 'Senior Developer', department: 'Engineering',
                email: 'jessica.liu@knightlogics.com', phone: '(555) 678-9012',
                salary: 95000, status: 'active', joinDate: '2022-07-01',
                avatar: 'JL', performance: 4.6, attendance: 97
            },
            {
                id: 7, name: 'David Thompson', title: 'Sales Representative', department: 'Sales',
                email: 'david.thompson@knightlogics.com', phone: '(555) 789-0123',
                salary: 65000, status: 'active', joinDate: '2023-02-14',
                avatar: 'DT', performance: 4.3, attendance: 92
            },
            {
                id: 8, name: 'Amanda Rodriguez', title: 'Marketing Specialist', department: 'Marketing',
                email: 'amanda.rodriguez@knightlogics.com', phone: '(555) 890-1234',
                salary: 58000, status: 'active', joinDate: '2023-01-20',
                avatar: 'AR', performance: 4.4, attendance: 96
            },
            {
                id: 9, name: 'Kevin Park', title: 'Software Engineer', department: 'Engineering',
                email: 'kevin.park@knightlogics.com', phone: '(555) 901-2345',
                salary: 85000, status: 'on-leave', joinDate: '2022-09-12',
                avatar: 'KP', performance: 4.5, attendance: 89
            },
            {
                id: 10, name: 'Lisa Chang', title: 'Accountant', department: 'Finance',
                email: 'lisa.chang@knightlogics.com', phone: '(555) 012-3456',
                salary: 62000, status: 'active', joinDate: '2023-04-03',
                avatar: 'LC', performance: 4.2, attendance: 94
            }
        ];
        
        // Generate Payroll Data
        this.payrollData = this.employees.map(employee => ({
            employeeId: employee.id,
            grossPay: employee.salary / 12,
            deductions: (employee.salary / 12) * 0.25, // 25% for taxes and benefits
            netPay: (employee.salary / 12) * 0.75,
            taxes: (employee.salary / 12) * 0.18,
            status: Math.random() > 0.8 ? 'pending' : 'processed'
        }));
        
        // Generate Attendance Data
        this.attendanceData = this.employees.map(employee => ({
            employeeId: employee.id,
            daysPresent: Math.floor(Math.random() * 3) + 20, // 20-22 days
            daysAbsent: Math.floor(Math.random() * 2),
            daysLate: Math.floor(Math.random() * 3),
            hoursWorked: Math.floor(Math.random() * 20) + 160 // 160-180 hours
        }));
        
        // Generate Performance Data
        this.performanceData = this.employees.map(employee => ({
            employeeId: employee.id,
            score: employee.performance,
            goals: Math.floor(Math.random() * 3) + 3, // 3-5 goals
            completed: Math.floor(Math.random() * 2) + 2, // 2-3 completed
            lastReview: this.getRandomDate(2024, 2025)
        }));
        
        // Generate Benefits Data
        this.benefitsData = [
            { name: 'Health Insurance', enrolled: 42, total: 45, cost: 350 },
            { name: '401(k) Retirement', enrolled: 41, total: 45, cost: 0 },
            { name: 'Dental Coverage', enrolled: 38, total: 45, cost: 45 },
            { name: 'Vision Coverage', enrolled: 35, total: 45, cost: 25 },
            { name: 'Life Insurance', enrolled: 40, total: 45, cost: 15 },
            { name: 'Paid Time Off', enrolled: 45, total: 45, cost: 0 }
        ];
        
        // Generate Reports Data
        this.reports = [
            { id: 1, name: 'Monthly Headcount Report', type: 'headcount', date: '2024-09-01', size: '2.3 MB' },
            { id: 2, name: 'Payroll Summary Q3 2024', type: 'payroll', date: '2024-09-15', size: '1.8 MB' },
            { id: 3, name: 'Attendance Analysis', type: 'attendance', date: '2024-09-20', size: '1.2 MB' },
            { id: 4, name: 'Performance Review Cycle', type: 'performance', date: '2024-09-10', size: '3.1 MB' },
            { id: 5, name: 'Benefits Enrollment Report', type: 'benefits', date: '2024-09-05', size: '945 KB' }
        ];
    }
    
    getRandomDate(startYear, endYear) {
        const start = new Date(startYear, 0, 1);
        const end = new Date(endYear, 0, 1);
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(link.dataset.section);
            });
        });
        
        // Search functionality
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                this.handleGlobalSearch(e.target.value);
            });
        }
        
        // Quick actions
        this.setupQuickActions();
        
        // Employee filters
        this.setupEmployeeFilters();
        
        // View toggles
        this.setupViewToggles();
    }
    
    navigateToSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`)?.closest('.nav-item');
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }
    
    setupQuickActions() {
        const addEmployeeBtn = document.getElementById('addEmployeeBtn');
        if (addEmployeeBtn) {
            addEmployeeBtn.addEventListener('click', () => this.showAddEmployeeModal());
        }
        
        const processPayrollBtn = document.getElementById('processPayrollBtn');
        if (processPayrollBtn) {
            processPayrollBtn.addEventListener('click', () => this.processPayroll());
        }
        
        const clockInOutBtn = document.getElementById('clockInOutBtn');
        if (clockInOutBtn) {
            clockInOutBtn.addEventListener('click', () => this.showClockModal());
        }
        
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => this.showReportModal());
        }
    }
    
    setupEmployeeFilters() {
        const departmentFilter = document.getElementById('departmentFilter');
        const statusFilter = document.getElementById('statusFilter');
        const employeeSearch = document.getElementById('employeeSearch');
        
        [departmentFilter, statusFilter, employeeSearch].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.filterEmployees());
                filter.addEventListener('input', () => this.filterEmployees());
            }
        });
    }
    
    setupViewToggles() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.toggleEmployeeView(btn.dataset.view);
            });
        });
    }
    
    updateDashboardStats() {
        // Total Employees
        const totalEmployees = document.getElementById('totalEmployees');
        if (totalEmployees) {
            this.animateValue(totalEmployees, 0, this.employees.length, 1500);
        }
        
        // Monthly Payroll
        const monthlyPayroll = document.getElementById('monthlyPayroll');
        if (monthlyPayroll) {
            const totalPayroll = this.payrollData.reduce((sum, p) => sum + p.grossPay, 0);
            this.animateValue(monthlyPayroll, 0, totalPayroll, 2000, true);
        }
        
        // Attendance Rate
        const attendanceRate = document.getElementById('attendanceRate');
        if (attendanceRate) {
            const avgAttendance = this.employees.reduce((sum, e) => sum + e.attendance, 0) / this.employees.length;
            this.animateValue(attendanceRate, 0, avgAttendance, 1800, false, '%');
        }
        
        // Average Performance
        const avgPerformance = document.getElementById('avgPerformance');
        if (avgPerformance) {
            const avgPerf = this.employees.reduce((sum, e) => sum + e.performance, 0) / this.employees.length;
            this.animateValue(avgPerformance, 0, avgPerf, 2200, false, '', 1);
        }
        
        // Populate recent activities
        this.populateRecentActivities();
        
        // Populate upcoming events
        this.populateUpcomingEvents();
    }
    
    animateValue(element, start, end, duration, currency = false, suffix = '', decimals = 0) {
        const startTimestamp = performance.now();
        const step = (timestamp) => {
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = progress * (end - start) + start;
            
            let displayValue;
            if (currency) {
                displayValue = '$' + Math.floor(current).toLocaleString();
            } else if (decimals > 0) {
                displayValue = current.toFixed(decimals);
            } else {
                displayValue = Math.floor(current).toString();
            }
            
            element.textContent = displayValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }
    
    populateRecentActivities() {
        const activitiesList = document.getElementById('recentActivitiesList');
        if (!activitiesList) return;
        
        const activities = [
            { icon: 'fas fa-user-plus', title: 'New employee onboarded: Amanda Rodriguez', time: '2 hours ago' },
            { icon: 'fas fa-calendar-check', title: 'Performance review completed for Kevin Park', time: '4 hours ago' },
            { icon: 'fas fa-money-check-alt', title: 'Payroll processed for September 2024', time: '1 day ago' },
            { icon: 'fas fa-clock', title: 'Attendance report generated', time: '2 days ago' },
            { icon: 'fas fa-shield-alt', title: 'Benefits enrollment updated for Q4', time: '3 days ago' }
        ];
        
        activitiesList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }
    
    populateUpcomingEvents() {
        const eventsList = document.getElementById('upcomingEventsList');
        if (!eventsList) return;
        
        const events = [
            { icon: 'fas fa-users', title: 'All-Hands Meeting', time: 'Tomorrow, 10:00 AM' },
            { icon: 'fas fa-graduation-cap', title: 'Leadership Training Workshop', time: 'Oct 2, 2:00 PM' },
            { icon: 'fas fa-birthday-cake', title: 'Company Anniversary Celebration', time: 'Oct 5, 6:00 PM' },
            { icon: 'fas fa-chart-line', title: 'Q3 Performance Reviews Due', time: 'Oct 10, EOD' },
            { icon: 'fas fa-handshake', title: 'New Hire Orientation', time: 'Oct 15, 9:00 AM' }
        ];
        
        eventsList.innerHTML = events.map(event => `
            <div class="event-item">
                <div class="event-icon">
                    <i class="${event.icon}"></i>
                </div>
                <div class="event-content">
                    <div class="event-title">${event.title}</div>
                    <div class="event-time">${event.time}</div>
                </div>
            </div>
        `).join('');
    }
    
    initializeCharts() {
        this.initDepartmentChart();
        this.initPerformanceTrendChart();
        this.initPayrollChart();
        this.initPerformanceDistributionChart();
        this.initBenefitsEnrollmentChart();
    }
    
    initDepartmentChart() {
        const ctx = document.getElementById('departmentChart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.departments.map(d => d.name),
                datasets: [{
                    data: this.departments.map(d => d.employeeCount),
                    backgroundColor: [
                        '#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#ddd6fe'
                    ],
                    borderColor: '#1a1a2e',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }
    
    initPerformanceTrendChart() {
        const ctx = document.getElementById('performanceTrendChart');
        if (!ctx) return;
        
        const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
        const data = [4.2, 4.3, 4.5, 4.4, 4.6, 4.5];
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Avg Performance Score',
                    data: data,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 3.5,
                        max: 5,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }
    
    initPayrollChart() {
        const ctx = document.getElementById('payrollChart');
        if (!ctx) return;
        
        const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
        const grossPay = [420000, 435000, 448000, 452000, 467000, 475000];
        const netPay = [315000, 326000, 336000, 339000, 350000, 356000];
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Gross Pay',
                        data: grossPay,
                        backgroundColor: '#6366f1',
                        borderRadius: 4
                    },
                    {
                        label: 'Net Pay',
                        data: netPay,
                        backgroundColor: '#8b5cf6',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#94a3b8',
                            callback: function(value) {
                                return '$' + (value / 1000) + 'K';
                            }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }
    
    initPerformanceDistributionChart() {
        const ctx = document.getElementById('performanceDistributionChart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Excellent (4.5-5.0)', 'Good (4.0-4.4)', 'Average (3.5-3.9)', 'Below Avg (3.0-3.4)'],
                datasets: [{
                    data: [6, 3, 1, 0],
                    backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ef4444'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    initBenefitsEnrollmentChart() {
        const ctx = document.getElementById('benefitsEnrollmentChart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.benefitsData.map(b => b.name),
                datasets: [{
                    label: 'Enrollment %',
                    data: this.benefitsData.map(b => (b.enrolled / b.total * 100)),
                    backgroundColor: '#6366f1',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#94a3b8',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }
    
    populateEmployeeGrid() {
        const employeesGrid = document.getElementById('employeesGrid');
        if (!employeesGrid) return;
        
        const employeeCards = this.employees.map(employee => `
            <div class="employee-card" data-employee-id="${employee.id}">
                <div class="employee-avatar" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                    ${employee.avatar}
                </div>
                <div class="employee-name">${employee.name}</div>
                <div class="employee-title">${employee.title}</div>
                <div class="employee-department">${employee.department}</div>
                <div class="employee-actions">
                    <button class="employee-action-btn" onclick="hrSystem.viewEmployee(${employee.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="employee-action-btn" onclick="hrSystem.editEmployee(${employee.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="employee-action-btn" onclick="hrSystem.employeePayroll(${employee.id})" title="Payroll">
                        <i class="fas fa-dollar-sign"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        employeesGrid.innerHTML = employeeCards;
    }
    
    populatePayrollTable() {
        const payrollTableBody = document.getElementById('payrollTableBody');
        if (!payrollTableBody) return;
        
        const payrollRows = this.employees.map(employee => {
            const payroll = this.payrollData.find(p => p.employeeId === employee.id);
            const statusClass = payroll.status === 'processed' ? 'processed' : 'pending';
            
            return `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div class="employee-avatar" style="width: 32px; height: 32px; font-size: 12px; background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                                ${employee.avatar}
                            </div>
                            <div>
                                <div style="font-weight: 500; color: #ffffff;">${employee.name}</div>
                                <div style="font-size: 12px; color: #94a3b8;">${employee.title}</div>
                            </div>
                        </div>
                    </td>
                    <td>${employee.department}</td>
                    <td>$${payroll.grossPay.toLocaleString()}</td>
                    <td>$${payroll.deductions.toLocaleString()}</td>
                    <td>$${payroll.netPay.toLocaleString()}</td>
                    <td><span class="status-badge ${statusClass}">${payroll.status}</span></td>
                    <td>
                        <button class="employee-action-btn" onclick="hrSystem.viewPayslip(${employee.id})">
                            <i class="fas fa-file-pdf"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        
        payrollTableBody.innerHTML = payrollRows;
        
        // Update payroll overview
        this.updatePayrollOverview();
    }
    
    updatePayrollOverview() {
        const totalGrossPay = document.getElementById('totalGrossPay');
        const totalDeductions = document.getElementById('totalDeductions');
        const totalNetPay = document.getElementById('totalNetPay');
        const payrollTaxes = document.getElementById('payrollTaxes');
        
        const totals = this.payrollData.reduce((acc, p) => {
            acc.gross += p.grossPay;
            acc.deductions += p.deductions;
            acc.net += p.netPay;
            acc.taxes += p.taxes;
            return acc;
        }, { gross: 0, deductions: 0, net: 0, taxes: 0 });
        
        if (totalGrossPay) totalGrossPay.textContent = '$' + Math.floor(totals.gross).toLocaleString();
        if (totalDeductions) totalDeductions.textContent = '$' + Math.floor(totals.deductions).toLocaleString();
        if (totalNetPay) totalNetPay.textContent = '$' + Math.floor(totals.net).toLocaleString();
        if (payrollTaxes) payrollTaxes.textContent = '$' + Math.floor(totals.taxes).toLocaleString();
    }
    
    updateAttendanceStats() {
        const presentToday = document.getElementById('presentToday');
        const absentToday = document.getElementById('absentToday');
        const lateToday = document.getElementById('lateToday');
        const onLeave = document.getElementById('onLeave');
        
        // Simulate today's attendance
        const activeEmployees = this.employees.filter(e => e.status === 'active');
        const present = Math.floor(activeEmployees.length * 0.95);
        const absent = Math.floor(activeEmployees.length * 0.02);
        const late = Math.floor(activeEmployees.length * 0.03);
        const leave = this.employees.filter(e => e.status === 'on-leave').length;
        
        if (presentToday) presentToday.textContent = present;
        if (absentToday) absentToday.textContent = absent;
        if (lateToday) lateToday.textContent = late;
        if (onLeave) onLeave.textContent = leave;
        
        this.generateAttendanceCalendar();
    }
    
    generateAttendanceCalendar() {
        const calendarGrid = document.getElementById('attendanceCalendarGrid');
        if (!calendarGrid) return;
        
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const daysInMonth = 30; // September has 30 days
        
        let calendarHTML = '';
        
        // Add day headers
        daysOfWeek.forEach(day => {
            calendarHTML += `<div class="calendar-day" style="font-weight: 600; background: var(--bg-tertiary);">${day}</div>`;
        });
        
        // Add calendar days with random attendance status
        for (let day = 1; day <= daysInMonth; day++) {
            const random = Math.random();
            let statusClass = 'present';
            
            if (random < 0.05) statusClass = 'absent';
            else if (random < 0.1) statusClass = 'late';
            
            calendarHTML += `<div class="calendar-day ${statusClass}">${day}</div>`;
        }
        
        calendarGrid.innerHTML = calendarHTML;
    }
    
    populatePerformanceData() {
        const topPerformersList = document.getElementById('topPerformersList');
        if (!topPerformersList) return;
        
        // Sort employees by performance score
        const topPerformers = [...this.employees]
            .sort((a, b) => b.performance - a.performance)
            .slice(0, 5);
        
        const performersHTML = topPerformers.map((employee, index) => `
            <div class="top-performer">
                <div class="performer-rank">${index + 1}</div>
                <div class="performer-info">
                    <div class="performer-name">${employee.name}</div>
                    <div class="performer-department">${employee.department}</div>
                </div>
                <div class="performer-score">${employee.performance.toFixed(1)}</div>
            </div>
        `).join('');
        
        topPerformersList.innerHTML = performersHTML;
        
        this.populatePerformanceReviews();
    }
    
    populatePerformanceReviews() {
        const performanceReviewsList = document.getElementById('performanceReviewsList');
        if (!performanceReviewsList) return;
        
        const reviews = this.employees.slice(0, 6).map(employee => {
            const performance = this.performanceData.find(p => p.employeeId === employee.id);
            let scoreClass = 'excellent';
            
            if (employee.performance < 4.0) scoreClass = 'average';
            else if (employee.performance < 4.5) scoreClass = 'good';
            
            return `
                <div class="review-item">
                    <div>
                        <div class="review-employee">${employee.name}</div>
                        <div class="review-date">${performance.lastReview.toLocaleDateString()}</div>
                    </div>
                    <div class="review-score ${scoreClass}">${employee.performance.toFixed(1)}</div>
                </div>
            `;
        }).join('');
        
        performanceReviewsList.innerHTML = reviews;
    }
    
    populateBenefitsData() {
        // Benefits overview is already populated in generateSampleData
        // The chart is handled in initBenefitsEnrollmentChart
    }
    
    populateReportsData() {
        const recentReportsList = document.getElementById('recentReportsList');
        if (!recentReportsList) return;
        
        const reportsHTML = this.reports.map(report => `
            <div class="report-item">
                <div class="report-info">
                    <div class="report-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="report-details">
                        <div class="report-name">${report.name}</div>
                        <div class="report-date">${report.date} • ${report.size}</div>
                    </div>
                </div>
                <button class="report-download" onclick="hrSystem.downloadReport(${report.id})">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `).join('');
        
        recentReportsList.innerHTML = reportsHTML;
    }
    
    // Employee Management Methods
    viewEmployee(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        if (employee) {
            alert(`Viewing details for ${employee.name}\n\nTitle: ${employee.title}\nDepartment: ${employee.department}\nEmail: ${employee.email}\nPhone: ${employee.phone}\nSalary: $${employee.salary.toLocaleString()}\nJoin Date: ${employee.joinDate}\nStatus: ${employee.status}`);
        }
    }
    
    editEmployee(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        if (employee) {
            alert(`Edit employee functionality would open a modal form for ${employee.name}`);
        }
    }
    
    employeePayroll(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        const payroll = this.payrollData.find(p => p.employeeId === employeeId);
        if (employee && payroll) {
            alert(`Payroll details for ${employee.name}:\n\nGross Pay: $${payroll.grossPay.toLocaleString()}\nDeductions: $${payroll.deductions.toLocaleString()}\nNet Pay: $${payroll.netPay.toLocaleString()}\nStatus: ${payroll.status}`);
        }
    }
    
    viewPayslip(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        if (employee) {
            alert(`Generating payslip PDF for ${employee.name}...`);
        }
    }
    
    // Filter and Search Methods
    filterEmployees() {
        const departmentFilter = document.getElementById('departmentFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const searchTerm = document.getElementById('employeeSearch')?.value.toLowerCase() || '';
        
        let filteredEmployees = this.employees;
        
        if (departmentFilter) {
            filteredEmployees = filteredEmployees.filter(e => e.department.toLowerCase() === departmentFilter);
        }
        
        if (statusFilter) {
            filteredEmployees = filteredEmployees.filter(e => e.status === statusFilter);
        }
        
        if (searchTerm) {
            filteredEmployees = filteredEmployees.filter(e => 
                e.name.toLowerCase().includes(searchTerm) ||
                e.title.toLowerCase().includes(searchTerm) ||
                e.department.toLowerCase().includes(searchTerm) ||
                e.email.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderFilteredEmployees(filteredEmployees);
    }
    
    renderFilteredEmployees(employees) {
        const employeesGrid = document.getElementById('employeesGrid');
        if (!employeesGrid) return;
        
        const employeeCards = employees.map(employee => `
            <div class="employee-card" data-employee-id="${employee.id}">
                <div class="employee-avatar" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                    ${employee.avatar}
                </div>
                <div class="employee-name">${employee.name}</div>
                <div class="employee-title">${employee.title}</div>
                <div class="employee-department">${employee.department}</div>
                <div class="employee-actions">
                    <button class="employee-action-btn" onclick="hrSystem.viewEmployee(${employee.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="employee-action-btn" onclick="hrSystem.editEmployee(${employee.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="employee-action-btn" onclick="hrSystem.employeePayroll(${employee.id})" title="Payroll">
                        <i class="fas fa-dollar-sign"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        employeesGrid.innerHTML = employeeCards || '<p style="text-align: center; color: #94a3b8;">No employees found matching your criteria.</p>';
    }
    
    handleGlobalSearch(searchTerm) {
        if (searchTerm.length < 2) return;
        
        searchTerm = searchTerm.toLowerCase();
        
        // Search across different data types
        const results = {
            employees: this.employees.filter(e => 
                e.name.toLowerCase().includes(searchTerm) ||
                e.title.toLowerCase().includes(searchTerm) ||
                e.department.toLowerCase().includes(searchTerm)
            ),
            reports: this.reports.filter(r => 
                r.name.toLowerCase().includes(searchTerm) ||
                r.type.toLowerCase().includes(searchTerm)
            )
        };
        
        console.log('Search results:', results);
        // In a real app, you'd show search results in a dropdown or modal
    }
    
    toggleEmployeeView(viewType) {
        const employeesGrid = document.getElementById('employeesGrid');
        if (!employeesGrid) return;
        
        if (viewType === 'list') {
            employeesGrid.style.display = 'block';
            employeesGrid.innerHTML = this.generateEmployeeListView();
        } else {
            employeesGrid.style.display = 'grid';
            this.populateEmployeeGrid();
        }
    }
    
    generateEmployeeListView() {
        return `
            <div class="employee-list-view" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl); overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: var(--bg-tertiary);">
                            <th style="padding: 16px; text-align: left; font-weight: 600; color: var(--text-primary);">Employee</th>
                            <th style="padding: 16px; text-align: left; font-weight: 600; color: var(--text-primary);">Department</th>
                            <th style="padding: 16px; text-align: left; font-weight: 600; color: var(--text-primary);">Status</th>
                            <th style="padding: 16px; text-align: left; font-weight: 600; color: var(--text-primary);">Performance</th>
                            <th style="padding: 16px; text-align: left; font-weight: 600; color: var(--text-primary);">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.employees.map(employee => `
                            <tr style="border-bottom: 1px solid var(--border-light);">
                                <td style="padding: 16px;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                                            ${employee.avatar}
                                        </div>
                                        <div>
                                            <div style="font-weight: 500; color: var(--text-primary);">${employee.name}</div>
                                            <div style="font-size: 14px; color: var(--text-muted);">${employee.title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style="padding: 16px; color: var(--text-secondary);">${employee.department}</td>
                                <td style="padding: 16px;">
                                    <span class="status-badge ${employee.status === 'active' ? 'processed' : employee.status === 'on-leave' ? 'pending' : 'failed'}">${employee.status}</span>
                                </td>
                                <td style="padding: 16px; color: var(--primary-color); font-weight: 500;">${employee.performance.toFixed(1)}</td>
                                <td style="padding: 16px;">
                                    <div style="display: flex; gap: 8px;">
                                        <button class="employee-action-btn" onclick="hrSystem.viewEmployee(${employee.id})" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="employee-action-btn" onclick="hrSystem.editEmployee(${employee.id})" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Quick Action Methods
    showAddEmployeeModal() {
        alert('Add Employee Modal would open here with a comprehensive form including:\n\n- Personal Information\n- Job Details\n- Department Assignment\n- Salary Information\n- Benefits Enrollment\n- Document Upload');
    }
    
    processPayroll() {
        alert('Processing payroll for all employees...\n\nThis would:\n- Calculate gross pay\n- Apply deductions and taxes\n- Generate payslips\n- Update payroll status\n- Send notifications');
    }
    
    showClockModal() {
        alert('Clock In/Out Modal would open here with:\n\n- Current time display\n- Employee selection\n- Clock in/out buttons\n- Recent time entries\n- Break time tracking');
    }
    
    showReportModal() {
        alert('Generate Report Modal would open here with options for:\n\n- Report type selection\n- Date range picker\n- Department filters\n- Output format (PDF, Excel, CSV)\n- Email delivery options');
    }
    
    // Report Generation Methods
    generateReport(reportType) {
        const reportNames = {
            headcount: 'Headcount Report',
            payroll: 'Payroll Report',
            attendance: 'Attendance Report',
            performance: 'Performance Report',
            turnover: 'Turnover Report',
            benefits: 'Benefits Report'
        };
        
        const reportName = reportNames[reportType] || 'Custom Report';
        alert(`Generating ${reportName}...\n\nThis would create a comprehensive report with:\n- Data visualization\n- Detailed analytics\n- Export options\n- Scheduled delivery`);
    }
    
    downloadReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (report) {
            alert(`Downloading ${report.name}...\n\nFile size: ${report.size}\nGenerated: ${report.date}`);
        }
    }
}

// Initialize the Employee Management System
window.addEventListener('DOMContentLoaded', () => {
    window.hrSystem = new EmployeeManagementSystem();
});