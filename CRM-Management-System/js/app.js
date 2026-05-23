/**
 * Knight Logics CRM Management System
 * Professional Customer Relationship Management Application
 */

class CRMManagementSystem {
  constructor() {
    // Application State
    this.state = {
      currentSection: 'dashboard',
      contacts: [],
      deals: [],
      companies: [],
      activities: [],
      isLoading: false,
      user: {
        name: 'Nicholas Knight',
        role: 'Sales Manager',
        company: 'Knight Logics'
      }
    };
    
    // Configuration
    this.config = {
      currency: 'USD',
      pipelineStages: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
      activityTypes: ['Call', 'Email', 'Meeting', 'Task', 'Note'],
      contactStatuses: ['lead', 'prospect', 'customer'],
      leadSources: ['website', 'referral', 'social', 'email', 'phone', 'event']
    };
    
    // Initialize application
    this.init();
  }
  
  async init() {
    console.log('🚀 Initializing Knight Logics CRM System...');
    
    // Show loading screen
    this.showLoadingScreen();
    
    // Load sample data
    await this.loadSampleData();
    
    // Initialize DOM elements
    this.initializeDOMElements();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize charts
    this.initializeCharts();
    
    // Hide loading screen and show app
    setTimeout(() => {
      this.hideLoadingScreen();
      this.updateDashboard();
    }, 2000);
    
    console.log('✅ CRM System initialized successfully!');
  }
  
  initializeDOMElements() {
    // Navigation elements
    this.navLinks = document.querySelectorAll('.sidebar .nav-link');
    this.contentSections = document.querySelectorAll('.content-section');
    
    // Dashboard elements
    this.totalRevenueEl = document.getElementById('totalRevenue');
    this.activeDealsEl = document.getElementById('activeDeals');
    this.totalContactsEl = document.getElementById('totalContacts');
    this.conversionRateEl = document.getElementById('conversionRate');
    this.recentActivitiesEl = document.getElementById('recentActivitiesList');
    this.topPerformersEl = document.getElementById('topPerformersList');
    
    // Chart canvases
    this.pipelineChartCanvas = document.getElementById('pipelineChart');
    this.conversionChartCanvas = document.getElementById('conversionChart');
    
    // Action buttons
    this.quickAddBtn = document.getElementById('quickAddBtn');
    this.addContactBtn = document.getElementById('addContactBtn');
    this.addDealBtn = document.getElementById('addDealBtn');
    this.scheduleActivityBtn = document.getElementById('scheduleActivityBtn');
    this.notificationsBtn = document.getElementById('notificationsBtn');
    
    // Search
    this.globalSearch = document.getElementById('globalSearch');
    
    // Section containers
    this.contactsGrid = document.getElementById('contactsGrid');
    this.pipelineStages = document.getElementById('pipelineStages');
    this.companiesGrid = document.getElementById('companiesGrid');
    this.activitiesTimeline = document.getElementById('activitiesTimeline');
  }
  
  setupEventListeners() {
    // Navigation
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        this.navigateToSection(section);
      });
    });
    
    // Quick actions
    this.quickAddBtn?.addEventListener('click', () => this.showQuickAddMenu());
    this.addContactBtn?.addEventListener('click', () => this.showAddContactModal());
    this.addDealBtn?.addEventListener('click', () => this.showAddDealModal());
    this.scheduleActivityBtn?.addEventListener('click', () => this.showScheduleActivityModal());
    
    // Search functionality
    this.globalSearch?.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });
    
    // Notifications
    this.notificationsBtn?.addEventListener('click', () => {
      this.showNotifications();
    });
  }
  
  async loadSampleData() {
    // Sample companies
    this.state.companies = [
      {
        id: 1,
        name: 'TechStart Solutions',
        industry: 'Technology',
        website: 'techstart.com',
        employees: 50,
        revenue: 2500000,
        address: '123 Innovation Drive, San Francisco, CA',
        phone: '+1 (555) 123-4567',
        created: new Date('2024-01-15')
      },
      {
        id: 2,
        name: 'Global Manufacturing Inc.',
        industry: 'Manufacturing',
        website: 'globalmanufacturing.com',
        employees: 200,
        revenue: 15000000,
        address: '456 Industrial Blvd, Detroit, MI',
        phone: '+1 (555) 987-6543',
        created: new Date('2024-02-20')
      },
      {
        id: 3,
        name: 'Digital Marketing Pro',
        industry: 'Marketing',
        website: 'digitalmarketingpro.com',
        employees: 25,
        revenue: 1200000,
        address: '789 Creative St, Austin, TX',
        phone: '+1 (555) 456-7890',
        created: new Date('2024-03-10')
      },
      {
        id: 4,
        name: 'Healthcare Innovations',
        industry: 'Healthcare',
        website: 'healthcareinnovations.com',
        employees: 150,
        revenue: 8500000,
        address: '321 Medical Center Dr, Boston, MA',
        phone: '+1 (555) 234-5678',
        created: new Date('2024-04-05')
      }
    ];
    
    // Sample contacts
    this.state.contacts = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@techstart.com',
        phone: '+1 (555) 123-4567',
        title: 'CEO',
        companyId: 1,
        company: 'TechStart Solutions',
        status: 'customer',
        source: 'website',
        created: new Date('2024-01-15'),
        lastActivity: new Date('2024-09-20'),
        value: 85000
      },
      {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@globalmanufacturing.com',
        phone: '+1 (555) 987-6543',
        title: 'CTO',
        companyId: 2,
        company: 'Global Manufacturing Inc.',
        status: 'prospect',
        source: 'referral',
        created: new Date('2024-02-20'),
        lastActivity: new Date('2024-09-22'),
        value: 150000
      },
      {
        id: 3,
        firstName: 'Mike',
        lastName: 'Chen',
        email: 'mike.chen@digitalmarketingpro.com',
        phone: '+1 (555) 456-7890',
        title: 'Marketing Director',
        companyId: 3,
        company: 'Digital Marketing Pro',
        status: 'lead',
        source: 'social',
        created: new Date('2024-03-10'),
        lastActivity: new Date('2024-09-21'),
        value: 45000
      },
      {
        id: 4,
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@healthcareinnovations.com',
        phone: '+1 (555) 234-5678',
        title: 'VP of Operations',
        companyId: 4,
        company: 'Healthcare Innovations',
        status: 'prospect',
        source: 'email',
        created: new Date('2024-04-05'),
        lastActivity: new Date('2024-09-19'),
        value: 200000
      },
      {
        id: 5,
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@techstart.com',
        phone: '+1 (555) 345-6789',
        title: 'VP of Engineering',
        companyId: 1,
        company: 'TechStart Solutions',
        status: 'customer',
        source: 'referral',
        created: new Date('2024-05-12'),
        lastActivity: new Date('2024-09-23'),
        value: 120000
      }
    ];
    
    // Sample deals
    this.state.deals = [
      {
        id: 1,
        title: 'Enterprise CRM Implementation',
        contactId: 1,
        contact: 'John Smith',
        companyId: 1,
        company: 'TechStart Solutions',
        value: 85000,
        stage: 'Negotiation',
        probability: 75,
        expectedClose: new Date('2024-10-15'),
        created: new Date('2024-08-01'),
        source: 'website'
      },
      {
        id: 2,
        title: 'Manufacturing Process Automation',
        contactId: 2,
        contact: 'Sarah Johnson',
        companyId: 2,
        company: 'Global Manufacturing Inc.',
        value: 150000,
        stage: 'Proposal',
        probability: 60,
        expectedClose: new Date('2024-11-30'),
        created: new Date('2024-07-15'),
        source: 'referral'
      },
      {
        id: 3,
        title: 'Digital Marketing Platform',
        contactId: 3,
        contact: 'Mike Chen',
        companyId: 3,
        company: 'Digital Marketing Pro',
        value: 45000,
        stage: 'Qualified',
        probability: 40,
        expectedClose: new Date('2024-12-15'),
        created: new Date('2024-08-20'),
        source: 'social'
      },
      {
        id: 4,
        title: 'Healthcare Data Analytics',
        contactId: 4,
        contact: 'Emily Rodriguez',
        companyId: 4,
        company: 'Healthcare Innovations',
        value: 200000,
        stage: 'Proposal',
        probability: 65,
        expectedClose: new Date('2024-11-15'),
        created: new Date('2024-07-30'),
        source: 'email'
      },
      {
        id: 5,
        title: 'Cloud Migration Services',
        contactId: 5,
        contact: 'David Wilson',
        companyId: 1,
        company: 'TechStart Solutions',
        value: 120000,
        stage: 'Closed Won',
        probability: 100,
        expectedClose: new Date('2024-09-15'),
        created: new Date('2024-06-01'),
        source: 'referral'
      }
    ];
    
    // Sample activities
    this.state.activities = [
      {
        id: 1,
        type: 'Call',
        title: 'Discovery Call with John Smith',
        description: 'Discussed CRM requirements and implementation timeline',
        contactId: 1,
        contact: 'John Smith',
        dealId: 1,
        date: new Date('2024-09-20'),
        duration: 45,
        outcome: 'Positive - Moving to next stage'
      },
      {
        id: 2,
        type: 'Meeting',
        title: 'Product Demo for Sarah Johnson',
        description: 'Demonstrated manufacturing automation features',
        contactId: 2,
        contact: 'Sarah Johnson',
        dealId: 2,
        date: new Date('2024-09-22'),
        duration: 60,
        outcome: 'Scheduled follow-up meeting'
      },
      {
        id: 3,
        type: 'Email',
        title: 'Follow-up with Mike Chen',
        description: 'Sent detailed proposal and pricing information',
        contactId: 3,
        contact: 'Mike Chen',
        dealId: 3,
        date: new Date('2024-09-21'),
        duration: 15,
        outcome: 'Awaiting response'
      },
      {
        id: 4,
        type: 'Task',
        title: 'Prepare contract for Emily Rodriguez',
        description: 'Draft contract terms for healthcare analytics project',
        contactId: 4,
        contact: 'Emily Rodriguez',
        dealId: 4,
        date: new Date('2024-09-19'),
        duration: 30,
        outcome: 'Contract ready for review'
      }
    ];
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (loadingScreen && appContainer) {
      loadingScreen.classList.remove('hidden');
      appContainer.classList.remove('loaded');
    }
  }
  
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (loadingScreen && appContainer) {
      loadingScreen.classList.add('hidden');
      appContainer.classList.add('loaded');
    }
  }
  
  navigateToSection(sectionName) {
    // Update navigation
    this.navLinks.forEach(link => {
      link.parentElement.classList.remove('active');
      if (link.dataset.section === sectionName) {
        link.parentElement.classList.add('active');
      }
    });
    
    // Show content section
    this.contentSections.forEach(section => {
      section.classList.remove('active');
      if (section.id === `${sectionName}-section`) {
        section.classList.add('active');
      }
    });
    
    this.state.currentSection = sectionName;
    
    // Load section-specific data
    this.loadSectionData(sectionName);
    
    console.log(`📍 Navigated to: ${sectionName}`);
  }
  
  loadSectionData(section) {
    switch (section) {
      case 'dashboard':
        this.updateDashboard();
        break;
      case 'contacts':
        this.loadContactsSection();
        break;
      case 'deals':
        this.loadDealsSection();
        break;
      case 'companies':
        this.loadCompaniesSection();
        break;
      case 'activities':
        this.loadActivitiesSection();
        break;
      case 'reports':
        this.loadReportsSection();
        break;
    }
  }
  
  updateDashboard() {
    this.updateStatistics();
    this.updateRecentActivities();
    this.updateTopPerformers();
    this.updateCharts();
  }
  
  updateStatistics() {
    const stats = this.calculateStatistics();
    
    // Update stat cards with animation
    this.animateValue(this.totalRevenueEl, 0, stats.totalRevenue, 1000, true);
    this.animateValue(this.activeDealsEl, 0, stats.activeDeals, 800);
    this.animateValue(this.totalContactsEl, 0, stats.totalContacts, 600);
    this.animateValue(this.conversionRateEl, 0, stats.conversionRate, 1200, false, '%');
  }
  
  calculateStatistics() {
    const closedDeals = this.state.deals.filter(deal => deal.stage === 'Closed Won');
    const activeDeals = this.state.deals.filter(deal => !deal.stage.includes('Closed'));
    
    const totalRevenue = closedDeals.reduce((sum, deal) => sum + deal.value, 0);
    const totalDealsCreated = this.state.deals.length;
    const conversionRate = totalDealsCreated > 0 ? Math.round((closedDeals.length / totalDealsCreated) * 100) : 0;
    
    return {
      totalRevenue: totalRevenue,
      activeDeals: activeDeals.length,
      totalContacts: this.state.contacts.length,
      conversionRate: conversionRate
    };
  }
  
  animateValue(element, start, end, duration, isCurrency = false, suffix = '') {
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      
      const value = Math.round(current);
      if (isCurrency) {
        element.textContent = this.formatCurrency(value);
      } else {
        element.textContent = value.toLocaleString() + suffix;
      }
    }, 16);
  }
  
  updateRecentActivities() {
    if (!this.recentActivitiesEl) return;
    
    const recentActivities = this.state.activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    this.recentActivitiesEl.innerHTML = recentActivities
      .map(activity => `
        <div class="activity-item">
          <div class="activity-info">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-details">${activity.contact} - ${activity.type}</div>
          </div>
          <div class="activity-time">${this.formatTimeAgo(activity.date)}</div>
        </div>
      `).join('');
  }
  
  updateTopPerformers() {
    if (!this.topPerformersEl) return;
    
    // Calculate performer metrics (simplified)
    const performers = [
      { name: 'Nicholas Knight', metric: 'Revenue', value: '$285K' },
      { name: 'Sarah Davis', metric: 'Deals Closed', value: '12' },
      { name: 'Mike Johnson', metric: 'New Contacts', value: '34' },
      { name: 'Emily Chen', metric: 'Activities', value: '67' }
    ];
    
    this.topPerformersEl.innerHTML = performers
      .map(performer => `
        <div class="performer-item">
          <div class="performer-avatar">${performer.name.charAt(0)}</div>
          <div class="performer-info">
            <div class="performer-name">${performer.name}</div>
            <div class="performer-metric">${performer.metric}</div>
          </div>
          <div class="performer-value">${performer.value}</div>
        </div>
      `).join('');
  }
  
  initializeCharts() {
    this.initializePipelineChart();
    this.initializeConversionChart();
  }
  
  initializePipelineChart() {
    if (!this.pipelineChartCanvas) return;
    
    const ctx = this.pipelineChartCanvas.getContext('2d');
    
    // Calculate deals by stage
    const stageData = this.config.pipelineStages.map(stage => {
      const stageDeals = this.state.deals.filter(deal => deal.stage === stage);
      return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    });
    
    this.pipelineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.config.pipelineStages,
        datasets: [{
          label: 'Deal Value',
          data: stageData,
          backgroundColor: 'rgba(44, 90, 160, 0.6)',
          borderColor: '#2c5aa0',
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#f8f9fa'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#f8f9fa',
              callback: function(value) {
                return '$' + (value / 1000) + 'K';
              }
            }
          }
        }
      }
    });
  }
  
  initializeConversionChart() {
    if (!this.conversionChartCanvas) return;
    
    const ctx = this.conversionChartCanvas.getContext('2d');
    
    // Calculate conversion funnel data
    const funnelData = [
      this.state.contacts.length,
      this.state.deals.length,
      this.state.deals.filter(deal => ['Proposal', 'Negotiation', 'Closed Won'].includes(deal.stage)).length,
      this.state.deals.filter(deal => deal.stage === 'Closed Won').length
    ];
    
    this.conversionChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Contacts', 'Opportunities', 'Qualified', 'Closed'],
        datasets: [{
          data: funnelData,
          backgroundColor: ['#2c5aa0', '#e67e22', '#f39c12', '#27ae60'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#f8f9fa'
            }
          }
        },
        cutout: '60%'
      }
    });
  }
  
  loadContactsSection() {
    if (!this.contactsGrid) return;
    
    this.contactsGrid.innerHTML = this.state.contacts.map(contact => `
      <div class="contact-card">
        <div class="contact-header">
          <div class="contact-avatar">${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}</div>
          <div class="contact-info">
            <h3>${contact.firstName} ${contact.lastName}</h3>
            <p>${contact.title} at ${contact.company}</p>
          </div>
        </div>
        <div class="contact-details">
          <p><i class="fas fa-envelope"></i> ${contact.email}</p>
          <p><i class="fas fa-phone"></i> ${contact.phone}</p>
          <p><i class="fas fa-source"></i> Source: ${contact.source}</p>
        </div>
        <div class="contact-meta">
          <span class="contact-status status-${contact.status}">${contact.status}</span>
          <div class="contact-actions" style="margin-top: var(--spacing-md);">
            <button class="btn btn-outline btn-sm" onclick="window.crmSystem.viewContact(${contact.id})">
              <i class="fas fa-eye"></i> View
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.crmSystem.createDealForContact(${contact.id})">
              <i class="fas fa-handshake"></i> Create Deal
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  loadDealsSection() {
    if (!this.pipelineStages) return;
    
    this.pipelineStages.innerHTML = this.config.pipelineStages.map(stage => {
      const stageDeals = this.state.deals.filter(deal => deal.stage === stage);
      const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
      
      return `
        <div class="pipeline-stage">
          <div class="stage-header">
            <div class="stage-title">${stage}</div>
            <div class="stage-count">${stageDeals.length}</div>
          </div>
          <div class="stage-value">${this.formatCurrency(stageValue)}</div>
          <div class="deals-list">
            ${stageDeals.map(deal => `
              <div class="deal-card" onclick="window.crmSystem.viewDeal(${deal.id})">
                <div class="deal-title">${deal.title}</div>
                <div class="deal-value">${this.formatCurrency(deal.value)}</div>
                <div class="deal-contact">${deal.contact} - ${deal.company}</div>
                <div class="deal-probability">${deal.probability}% probability</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }
  
  loadCompaniesSection() {
    if (!this.companiesGrid) return;
    
    this.companiesGrid.innerHTML = this.state.companies.map(company => {
      const companyContacts = this.state.contacts.filter(contact => contact.companyId === company.id);
      const companyDeals = this.state.deals.filter(deal => deal.companyId === company.id);
      const companyRevenue = companyDeals.filter(deal => deal.stage === 'Closed Won')
        .reduce((sum, deal) => sum + deal.value, 0);
      
      return `
        <div class="company-card">
          <div class="company-header">
            <div class="company-logo">${company.name.charAt(0)}</div>
            <div class="company-info">
              <h3>${company.name}</h3>
              <p>${company.industry} • ${company.employees} employees</p>
              <p><i class="fas fa-globe"></i> ${company.website}</p>
            </div>
          </div>
          <div class="company-stats">
            <div class="company-stat">
              <span class="company-stat-value">${companyContacts.length}</span>
              <span class="company-stat-label">Contacts</span>
            </div>
            <div class="company-stat">
              <span class="company-stat-value">${companyDeals.length}</span>
              <span class="company-stat-label">Deals</span>
            </div>
            <div class="company-stat">
              <span class="company-stat-value">${this.formatCurrency(companyRevenue, true)}</span>
              <span class="company-stat-label">Revenue</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  loadActivitiesSection() {
    if (!this.activitiesTimeline) return;
    
    const sortedActivities = this.state.activities
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    this.activitiesTimeline.innerHTML = sortedActivities.map(activity => `
      <div class="timeline-item">
        <div class="timeline-icon">
          <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">${activity.title}</div>
          <div class="timeline-description">${activity.description}</div>
          <div class="timeline-meta">
            <span><i class="fas fa-user"></i> ${activity.contact}</span>
            <span><i class="fas fa-calendar"></i> ${this.formatDate(activity.date)}</span>
            <span><i class="fas fa-clock"></i> ${activity.duration} minutes</span>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  getActivityIcon(type) {
    const icons = {
      'Call': 'phone',
      'Email': 'envelope',
      'Meeting': 'users',
      'Task': 'tasks',
      'Note': 'sticky-note'
    };
    return icons[type] || 'calendar';
  }
  
  loadReportsSection() {
    // Initialize additional report charts
    this.initializeReportCharts();
    this.updateKPIs();
  }
  
  initializeReportCharts() {
    // Sales Performance Chart
    const salesCanvas = document.getElementById('salesPerformanceChart');
    if (salesCanvas) {
      const ctx = salesCanvas.getContext('2d');
      
      const monthlyData = this.generateMonthlySalesData();
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthlyData.labels,
          datasets: [{
            label: 'Sales Revenue',
            data: monthlyData.data,
            borderColor: '#2c5aa0',
            backgroundColor: 'rgba(44, 90, 160, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#f8f9fa'
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#f8f9fa' }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: {
                color: '#f8f9fa',
                callback: function(value) {
                  return '$' + (value / 1000) + 'K';
                }
              }
            }
          }
        }
      });
    }
    
    // Lead Sources Chart
    const sourcesCanvas = document.getElementById('leadSourcesChart');
    if (sourcesCanvas) {
      const ctx = sourcesCanvas.getContext('2d');
      
      const sourceData = this.calculateLeadSources();
      
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: sourceData.labels,
          datasets: [{
            data: sourceData.data,
            backgroundColor: ['#2c5aa0', '#e67e22', '#27ae60', '#f39c12', '#3498db']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#f8f9fa'
              }
            }
          }
        }
      });
    }
  }
  
  generateMonthlySalesData() {
    const months = [];
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toLocaleDateString('en-US', { month: 'short' }));
      
      // Generate realistic sales data
      const baseSales = 50000;
      const variance = (Math.random() - 0.5) * 30000;
      data.push(Math.max(20000, baseSales + variance));
    }
    
    return { labels: months, data: data };
  }
  
  calculateLeadSources() {
    const sources = {};
    this.state.contacts.forEach(contact => {
      sources[contact.source] = (sources[contact.source] || 0) + 1;
    });
    
    return {
      labels: Object.keys(sources),
      data: Object.values(sources)
    };
  }
  
  updateKPIs() {
    const closedDeals = this.state.deals.filter(deal => deal.stage === 'Closed Won');
    const avgDealSize = closedDeals.length > 0 
      ? closedDeals.reduce((sum, deal) => sum + deal.value, 0) / closedDeals.length 
      : 0;
    
    // Calculate average sales cycle (simplified)
    const avgSalesCycle = 45; // days
    const avgResponseTime = 4; // hours
    const customerLTV = avgDealSize * 2.5; // simplified calculation
    
    document.getElementById('avgDealSize').textContent = this.formatCurrency(avgDealSize);
    document.getElementById('salesCycleLength').textContent = `${avgSalesCycle} days`;
    document.getElementById('leadResponseTime').textContent = `${avgResponseTime} hours`;
    document.getElementById('customerLTV').textContent = this.formatCurrency(customerLTV);
  }
  
  // Modal and form handling methods
  showAddContactModal() {
    const form = `
      <form id="addContactForm">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" required>
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" required>
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" name="phone">
          </div>
          <div class="form-group">
            <label for="title">Job Title</label>
            <input type="text" id="title" name="title">
          </div>
        </div>
        <div class="form-group">
          <label for="company">Company</label>
          <select id="company" name="companyId">
            <option value="">Select a company</option>
            ${this.state.companies.map(company => 
              `<option value="${company.id}">${company.name}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" name="status" required>
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div class="form-group">
            <label for="source">Source</label>
            <select id="source" name="source">
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social">Social Media</option>
              <option value="email">Email Campaign</option>
              <option value="phone">Phone</option>
              <option value="event">Event</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline" onclick="window.crmSystem.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Contact</button>
        </div>
      </form>
    `;
    
    this.showModal('Add New Contact', form);
    
    document.getElementById('addContactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addNewContact(new FormData(e.target));
    });
  }
  
  addNewContact(formData) {
    const company = this.state.companies.find(c => c.id === parseInt(formData.get('companyId')));
    
    const newContact = {
      id: this.state.contacts.length + 1,
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      title: formData.get('title'),
      companyId: parseInt(formData.get('companyId')),
      company: company ? company.name : '',
      status: formData.get('status'),
      source: formData.get('source'),
      created: new Date(),
      lastActivity: new Date(),
      value: 0
    };
    
    this.state.contacts.push(newContact);
    this.closeModal();
    this.showToast('Success', `Contact "${newContact.firstName} ${newContact.lastName}" added successfully!`, 'success');
    
    if (this.state.currentSection === 'contacts') {
      this.loadContactsSection();
    }
  }
  
  // Utility methods
  formatCurrency(amount, abbreviated = false) {
    if (abbreviated && amount >= 1000) {
      return '$' + (amount / 1000).toFixed(0) + 'K';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.config.currency
    }).format(amount);
  }
  
  formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }
  
  formatTimeAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }
  
  showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('globalModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'globalModal';
      modal.className = 'modal';
      document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
      <div class="modal-overlay" onclick="window.crmSystem.closeModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="window.crmSystem.closeModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
  }
  
  closeModal() {
    const modal = document.getElementById('globalModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  }
  
  showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <strong>${title}</strong>
        <p>${message}</p>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
  
  showNotifications() {
    const notifications = [
      {
        type: 'info',
        title: 'New Lead',
        message: 'John Doe from ABC Corp submitted a contact form',
        time: '5 minutes ago'
      },
      {
        type: 'success',
        title: 'Deal Closed',
        message: 'Healthcare Analytics deal closed for $200,000',
        time: '2 hours ago'
      },
      {
        type: 'warning',
        title: 'Follow-up Due',
        message: 'Follow up with Sarah Johnson scheduled for today',
        time: '4 hours ago'
      }
    ];
    
    const content = `
      <div class="notifications-list">
        ${notifications.map(notif => `
          <div class="notification-item ${notif.type}">
            <div class="notification-content">
              <h4>${notif.title}</h4>
              <p>${notif.message}</p>
              <small>${notif.time}</small>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    this.showModal('Notifications', content);
  }
  
  updateCharts() {
    if (this.pipelineChart) {
      // Update pipeline chart data
      const stageData = this.config.pipelineStages.map(stage => {
        const stageDeals = this.state.deals.filter(deal => deal.stage === stage);
        return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
      });
      
      this.pipelineChart.data.datasets[0].data = stageData;
      this.pipelineChart.update();
    }
    
    if (this.conversionChart) {
      // Update conversion chart data
      const funnelData = [
        this.state.contacts.length,
        this.state.deals.length,
        this.state.deals.filter(deal => ['Proposal', 'Negotiation', 'Closed Won'].includes(deal.stage)).length,
        this.state.deals.filter(deal => deal.stage === 'Closed Won').length
      ];
      
      this.conversionChart.data.datasets[0].data = funnelData;
      this.conversionChart.update();
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.crmSystem = new CRMManagementSystem();
});

// Export for global access
window.CRMManagementSystem = CRMManagementSystem;