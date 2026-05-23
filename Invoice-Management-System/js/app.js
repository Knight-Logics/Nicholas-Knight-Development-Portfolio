/**
 * Knight Logics Invoice Management System
 * Professional JavaScript Application with Full Business Features
 */

class InvoiceManagementSystem {
  constructor() {
    // Application State
    this.state = {
      currentSection: 'dashboard',
      invoices: [],
      clients: [],
      payments: [],
      isLoading: false,
      user: {
        name: 'Nicholas Knight',
        role: 'Administrator',
        company: 'Knight Logics'
      }
    };
    
    // Configuration
    this.config = {
      currency: 'USD',
      taxRate: 0.08,
      invoiceNumberPrefix: 'KL',
      paymentTerms: 30
    };
    
    // Initialize application
    this.init();
  }
  
  async init() {
    console.log('🚀 Initializing Knight Logics Invoice Management System...');
    
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
    
    console.log('✅ Application initialized successfully!');
  }
  
  initializeDOMElements() {
    // Navigation elements
    this.navLinks = document.querySelectorAll('.sidebar .nav-link');
    this.contentSections = document.querySelectorAll('.content-section');
    
    // Dashboard elements
    this.totalRevenueEl = document.getElementById('totalRevenue');
    this.totalInvoicesEl = document.getElementById('totalInvoices');
    this.pendingAmountEl = document.getElementById('pendingAmount');
    this.totalClientsEl = document.getElementById('totalClients');
    this.recentInvoicesEl = document.getElementById('recentInvoicesList');
    
    // Chart canvases
    this.revenueChartCanvas = document.getElementById('revenueChart');
    this.paymentStatusChartCanvas = document.getElementById('paymentStatusChart');
    
    // Action buttons
    this.quickCreateBtn = document.getElementById('quickCreateBtn');
    this.createInvoiceBtn = document.getElementById('createInvoiceBtn');
    this.notificationsBtn = document.getElementById('notificationsBtn');
    
    // Search
    this.globalSearch = document.getElementById('globalSearch');
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
    this.quickCreateBtn?.addEventListener('click', () => this.navigateToSection('create'));
    this.createInvoiceBtn?.addEventListener('click', () => this.navigateToSection('create'));
    
    // Dashboard quick actions
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleQuickAction(action);
      });
    });
    
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
    // Sample clients
    this.state.clients = [
      {
        id: 1,
        name: 'Acme Corporation',
        email: 'billing@acme.corp',
        address: '123 Business St, Suite 100\nNew York, NY 10001',
        phone: '+1 (555) 123-4567',
        created: new Date('2024-01-15'),
        totalInvoiced: 45000
      },
      {
        id: 2,
        name: 'TechStart Inc.',
        email: 'finance@techstart.com',
        address: '456 Innovation Ave\nSan Francisco, CA 94105',
        phone: '+1 (555) 987-6543',
        created: new Date('2024-02-20'),
        totalInvoiced: 32000
      },
      {
        id: 3,
        name: 'Global Enterprises',
        email: 'accounts@globalent.com',
        address: '789 Corporate Blvd\nChicago, IL 60601',
        phone: '+1 (555) 456-7890',
        created: new Date('2024-03-10'),
        totalInvoiced: 67500
      },
      {
        id: 4,
        name: 'Digital Solutions LLC',
        email: 'billing@digitalsol.com',
        address: '321 Tech Park Dr\nAustin, TX 78701',
        phone: '+1 (555) 234-5678',
        created: new Date('2024-04-05'),
        totalInvoiced: 28900
      }
    ];
    
    // Sample invoices
    this.state.invoices = [
      {
        id: 1,
        number: 'KL-2024-001',
        clientId: 1,
        client: 'Acme Corporation',
        amount: 15000,
        status: 'paid',
        dueDate: new Date('2024-08-15'),
        issueDate: new Date('2024-07-15'),
        paidDate: new Date('2024-08-10'),
        items: [
          { description: 'Web Development Services', quantity: 1, rate: 12000, amount: 12000 },
          { description: 'SEO Optimization', quantity: 1, rate: 3000, amount: 3000 }
        ]
      },
      {
        id: 2,
        number: 'KL-2024-002',
        clientId: 2,
        client: 'TechStart Inc.',
        amount: 8500,
        status: 'pending',
        dueDate: new Date('2024-09-20'),
        issueDate: new Date('2024-08-20'),
        items: [
          { description: 'Mobile App Development', quantity: 1, rate: 8500, amount: 8500 }
        ]
      },
      {
        id: 3,
        number: 'KL-2024-003',
        clientId: 3,
        client: 'Global Enterprises',
        amount: 22000,
        status: 'overdue',
        dueDate: new Date('2024-08-30'),
        issueDate: new Date('2024-07-30'),
        items: [
          { description: 'E-commerce Platform', quantity: 1, rate: 20000, amount: 20000 },
          { description: 'Payment Integration', quantity: 1, rate: 2000, amount: 2000 }
        ]
      },
      {
        id: 4,
        number: 'KL-2024-004',
        clientId: 4,
        client: 'Digital Solutions LLC',
        amount: 6200,
        status: 'pending',
        dueDate: new Date('2024-10-01'),
        issueDate: new Date('2024-09-01'),
        items: [
          { description: 'Database Optimization', quantity: 1, rate: 6200, amount: 6200 }
        ]
      },
      {
        id: 5,
        number: 'KL-2024-005',
        clientId: 1,
        client: 'Acme Corporation',
        amount: 9800,
        status: 'paid',
        dueDate: new Date('2024-09-10'),
        issueDate: new Date('2024-08-10'),
        paidDate: new Date('2024-09-05'),
        items: [
          { description: 'Security Audit', quantity: 1, rate: 5000, amount: 5000 },
          { description: 'Performance Optimization', quantity: 1, rate: 4800, amount: 4800 }
        ]
      }
    ];
    
    // Sample payments
    this.state.payments = [
      {
        id: 1,
        invoiceId: 1,
        amount: 15000,
        date: new Date('2024-08-10'),
        method: 'Bank Transfer',
        reference: 'TXN-001-2024'
      },
      {
        id: 2,
        invoiceId: 5,
        amount: 9800,
        date: new Date('2024-09-05'),
        method: 'Credit Card',
        reference: 'TXN-002-2024'
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
      case 'invoices':
        this.loadInvoicesSection();
        break;
      case 'clients':
        this.loadClientsSection();
        break;
      case 'create':
        this.loadCreateInvoiceSection();
        break;
      case 'reports':
        this.loadReportsSection();
        break;
    }
  }
  
  loadInvoicesSection() {
    const tableBody = document.getElementById('invoicesTableBody');
    const clientFilter = document.getElementById('clientFilter');
    
    if (!tableBody) return;
    
    // Populate client filter
    if (clientFilter) {
      clientFilter.innerHTML = '<option value="">All Clients</option>' +
        this.state.clients.map(client => 
          `<option value="${client.id}">${client.name}</option>`
        ).join('');
    }
    
    // Populate invoices table
    tableBody.innerHTML = this.state.invoices
      .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
      .map(invoice => `
        <tr>
          <td><strong>${invoice.number}</strong></td>
          <td>${invoice.client}</td>
          <td><strong>${this.formatCurrency(invoice.amount)}</strong></td>
          <td><span class="status-${invoice.status}">${invoice.status}</span></td>
          <td>${this.formatDate(invoice.dueDate)}</td>
          <td>
            <button class="action-btn" onclick="window.invoiceSystem.viewInvoice(${invoice.id})">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn" onclick="window.invoiceSystem.editInvoice(${invoice.id})">
              <i class="fas fa-edit"></i>
            </button>
            ${invoice.status !== 'paid' ? `
              <button class="action-btn primary" onclick="window.invoiceSystem.recordPaymentForInvoice(${invoice.id})">
                <i class="fas fa-dollar-sign"></i>
              </button>
            ` : ''}
          </td>
        </tr>
      `).join('');
  }
  
  loadClientsSection() {
    const clientsGrid = document.getElementById('clientsGrid');
    
    if (!clientsGrid) return;
    
    clientsGrid.innerHTML = this.state.clients.map(client => {
      const clientInvoices = this.state.invoices.filter(inv => inv.clientId === client.id);
      const totalInvoices = clientInvoices.length;
      const paidInvoices = clientInvoices.filter(inv => inv.status === 'paid').length;
      
      return `
        <div class="client-card">
          <div class="client-header">
            <div class="client-avatar">${client.name.charAt(0)}</div>
            <div class="client-info">
              <h3>${client.name}</h3>
              <p>${client.email}</p>
            </div>
          </div>
          <div class="client-details">
            <p><i class="fas fa-phone"></i> ${client.phone || 'N/A'}</p>
            <p><i class="fas fa-calendar"></i> Client since ${this.formatDate(client.created)}</p>
          </div>
          <div class="client-stats">
            <div class="client-stat">
              <span class="client-stat-value">${totalInvoices}</span>
              <span class="client-stat-label">Invoices</span>
            </div>
            <div class="client-stat">
              <span class="client-stat-value">${this.formatCurrency(client.totalInvoiced)}</span>
              <span class="client-stat-label">Total Billed</span>
            </div>
            <div class="client-stat">
              <span class="client-stat-value">${Math.round((paidInvoices / totalInvoices) * 100) || 0}%</span>
              <span class="client-stat-label">Payment Rate</span>
            </div>
          </div>
          <div class="client-actions" style="margin-top: var(--spacing-lg); display: flex; gap: var(--spacing-sm);">
            <button class="action-btn" onclick="window.invoiceSystem.editClient(${client.id})">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="action-btn primary" onclick="window.invoiceSystem.createInvoiceForClient(${client.id})">
              <i class="fas fa-plus"></i> New Invoice
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
  
  loadCreateInvoiceSection() {
    const invoiceNumberEl = document.getElementById('invoiceNumber');
    const invoiceDateEl = document.getElementById('invoiceDate');
    const dueDateEl = document.getElementById('dueDate');
    const clientSelectEl = document.getElementById('clientSelect');
    const addItemBtn = document.getElementById('addItemBtn');
    
    if (!invoiceNumberEl) return;
    
    // Set invoice number
    const nextNumber = this.generateInvoiceNumber();
    invoiceNumberEl.value = nextNumber;
    
    // Set default dates
    const today = new Date();
    const dueDate = new Date(today.getTime() + (this.config.paymentTerms * 24 * 60 * 60 * 1000));
    
    invoiceDateEl.value = today.toISOString().split('T')[0];
    dueDateEl.value = dueDate.toISOString().split('T')[0];
    
    // Populate clients dropdown
    if (clientSelectEl) {
      clientSelectEl.innerHTML = '<option value="">Select a client</option>' +
        this.state.clients.map(client => 
          `<option value="${client.id}">${client.name}</option>`
        ).join('');
    }
    
    // Add item button event
    if (addItemBtn) {
      addItemBtn.onclick = () => this.addInvoiceItem();
    }
    
    // Add initial item
    this.addInvoiceItem();
  }
  
  loadReportsSection() {
    // Update summary statistics
    this.updateReportSummary();
    
    // Initialize additional charts
    this.initializeReportCharts();
  }
  
  generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const nextNum = this.state.invoices.length + 1;
    return `${this.config.invoiceNumberPrefix}-${year}-${String(nextNum).padStart(3, '0')}`;
  }
  
  addInvoiceItem() {
    const itemsContainer = document.getElementById('invoiceItems');
    if (!itemsContainer) return;
    
    const itemId = Date.now();
    const itemHtml = `
      <div class="invoice-item-row" data-item-id="${itemId}">
        <input type="text" class="item-input" placeholder="Description" name="description">
        <input type="number" class="item-input" placeholder="1" name="quantity" min="1" value="1">
        <input type="number" class="item-input" placeholder="0.00" name="rate" min="0" step="0.01">
        <span class="item-amount">$0.00</span>
        <button type="button" class="remove-item-btn" onclick="window.invoiceSystem.removeInvoiceItem('${itemId}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    itemsContainer.insertAdjacentHTML('beforeend', itemHtml);
    
    // Add event listeners for calculation
    const newItem = itemsContainer.querySelector(`[data-item-id="${itemId}"]`);
    const quantityInput = newItem.querySelector('input[name="quantity"]');
    const rateInput = newItem.querySelector('input[name="rate"]');
    
    [quantityInput, rateInput].forEach(input => {
      input.addEventListener('input', () => this.calculateInvoiceTotals());
    });
  }
  
  removeInvoiceItem(itemId) {
    const item = document.querySelector(`[data-item-id="${itemId}"]`);
    if (item) {
      item.remove();
      this.calculateInvoiceTotals();
    }
  }
  
  calculateInvoiceTotals() {
    const items = document.querySelectorAll('.invoice-item-row');
    let subtotal = 0;
    
    items.forEach(item => {
      const quantity = parseFloat(item.querySelector('input[name="quantity"]').value) || 0;
      const rate = parseFloat(item.querySelector('input[name="rate"]').value) || 0;
      const amount = quantity * rate;
      
      item.querySelector('.item-amount').textContent = this.formatCurrency(amount);
      subtotal += amount;
    });
    
    const tax = subtotal * this.config.taxRate;
    const total = subtotal + tax;
    
    document.getElementById('subtotalAmount').textContent = this.formatCurrency(subtotal);
    document.getElementById('taxAmount').textContent = this.formatCurrency(tax);
    document.getElementById('totalAmount').textContent = this.formatCurrency(total);
  }
  
  updateReportSummary() {
    const avgInvoiceValue = this.state.invoices.reduce((sum, inv) => sum + inv.amount, 0) / this.state.invoices.length || 0;
    
    // Calculate average payment time
    const paidInvoices = this.state.invoices.filter(inv => inv.status === 'paid');
    const avgPaymentTime = paidInvoices.reduce((sum, inv) => {
      const issueDate = new Date(inv.issueDate);
      const paidDate = new Date(inv.paidDate);
      return sum + Math.ceil((paidDate - issueDate) / (1000 * 60 * 60 * 24));
    }, 0) / paidInvoices.length || 0;
    
    // Calculate collection rate
    const totalValue = this.state.invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const collectedValue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const collectionRate = (collectedValue / totalValue) * 100 || 0;
    
    // Update UI
    const avgInvoiceEl = document.getElementById('avgInvoiceValue');
    const avgPaymentEl = document.getElementById('avgPaymentTime');
    const collectionRateEl = document.getElementById('collectionRate');
    
    if (avgInvoiceEl) avgInvoiceEl.textContent = this.formatCurrency(avgInvoiceValue);
    if (avgPaymentEl) avgPaymentEl.textContent = `${Math.round(avgPaymentTime)} days`;
    if (collectionRateEl) collectionRateEl.textContent = `${Math.round(collectionRate)}%`;
  }
  
  initializeReportCharts() {
    this.initializeRevenueAnalysisChart();
    this.initializeClientPerformanceChart();
    this.initializePaymentTrendsChart();
  }
  
  initializeRevenueAnalysisChart() {
    const canvas = document.getElementById('revenueAnalysisChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Generate monthly revenue data
    const monthlyData = this.generateMonthlyRevenueData();
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthlyData.labels,
        datasets: [{
          label: 'Monthly Revenue',
          data: monthlyData.data,
          backgroundColor: 'rgba(128, 0, 32, 0.6)',
          borderColor: '#cc2936',
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
              color: '#ecf0f1'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ecf0f1',
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
  
  initializeClientPerformanceChart() {
    const canvas = document.getElementById('clientPerformanceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Calculate client revenues
    const clientData = this.state.clients.map(client => ({
      name: client.name,
      revenue: this.state.invoices
        .filter(inv => inv.clientId === client.id && inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0)
    })).sort((a, b) => b.revenue - a.revenue);
    
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: clientData.map(client => client.name),
        datasets: [{
          data: clientData.map(client => client.revenue),
          backgroundColor: [
            '#cc2936',
            '#800020',
            '#a61e1e',
            '#ffc107',
            '#6c757d'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#ecf0f1'
            }
          }
        }
      }
    });
  }
  
  initializePaymentTrendsChart() {
    const canvas = document.getElementById('paymentTrendsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Generate payment trends data
    const trendsData = this.generatePaymentTrendsData();
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: trendsData.labels,
        datasets: [
          {
            label: 'On Time',
            data: trendsData.onTime,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            fill: true
          },
          {
            label: 'Late',
            data: trendsData.late,
            borderColor: '#ffc107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ecf0f1'
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ecf0f1'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ecf0f1'
            }
          }
        }
      }
    });
  }
  
  generateMonthlyRevenueData() {
    const months = [];
    const data = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      months.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
      
      // Calculate revenue for this month
      const monthRevenue = this.state.invoices
        .filter(inv => {
          const invoiceDate = new Date(inv.issueDate);
          return invoiceDate.getMonth() === date.getMonth() && 
                 invoiceDate.getFullYear() === date.getFullYear() &&
                 inv.status === 'paid';
        })
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      data.push(monthRevenue);
    }
    
    return { labels: months, data: data };
  }
  
  generatePaymentTrendsData() {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const onTime = [85, 78, 92, 88, 95, 82];
    const late = [15, 22, 8, 12, 5, 18];
    
    return { labels, onTime, late };
  }
  
  // Invoice actions
  viewInvoice(invoiceId) {
    const invoice = this.state.invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      this.showInvoiceDetails(invoice);
    }
  }
  
  editInvoice(invoiceId) {
    const invoice = this.state.invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      this.navigateToSection('create');
      // TODO: Populate form with invoice data
    }
  }
  
  recordPaymentForInvoice(invoiceId) {
    const invoice = this.state.invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      this.showRecordPaymentModal();
      // Pre-select the invoice
      setTimeout(() => {
        const invoiceSelect = document.getElementById('paymentInvoice');
        if (invoiceSelect) {
          invoiceSelect.value = invoiceId;
          const event = new Event('change');
          invoiceSelect.dispatchEvent(event);
        }
      }, 100);
    }
  }
  
  // Client actions
  editClient(clientId) {
    const client = this.state.clients.find(c => c.id === clientId);
    if (client) {
      this.showEditClientModal(client);
    }
  }
  
  createInvoiceForClient(clientId) {
    this.navigateToSection('create');
    // Pre-select the client
    setTimeout(() => {
      const clientSelect = document.getElementById('clientSelect');
      if (clientSelect) {
        clientSelect.value = clientId;
      }
    }, 100);
  }
  
  showInvoiceDetails(invoice) {
    const content = `
      <div class="invoice-details">
        <div class="invoice-header">
          <h3>Invoice ${invoice.number}</h3>
          <span class="status-${invoice.status}">${invoice.status}</span>
        </div>
        <div class="invoice-info">
          <p><strong>Client:</strong> ${invoice.client}</p>
          <p><strong>Amount:</strong> ${this.formatCurrency(invoice.amount)}</p>
          <p><strong>Issue Date:</strong> ${this.formatDate(invoice.issueDate)}</p>
          <p><strong>Due Date:</strong> ${this.formatDate(invoice.dueDate)}</p>
          ${invoice.paidDate ? `<p><strong>Paid Date:</strong> ${this.formatDate(invoice.paidDate)}</p>` : ''}
        </div>
        <div class="invoice-items">
          <h4>Items</h4>
          ${invoice.items.map(item => `
            <div class="item-row">
              <span>${item.description}</span>
              <span>${item.quantity} × ${this.formatCurrency(item.rate)} = ${this.formatCurrency(item.amount)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    this.showModal('Invoice Details', content);
  }
  
  showEditClientModal(client) {
    const form = `
      <form id="editClientForm">
        <div class="form-group">
          <label for="editClientName">Client Name</label>
          <input type="text" id="editClientName" name="name" value="${client.name}" required>
        </div>
        <div class="form-group">
          <label for="editClientEmail">Email</label>
          <input type="email" id="editClientEmail" name="email" value="${client.email}" required>
        </div>
        <div class="form-group">
          <label for="editClientPhone">Phone</label>
          <input type="tel" id="editClientPhone" name="phone" value="${client.phone || ''}">
        </div>
        <div class="form-group">
          <label for="editClientAddress">Address</label>
          <textarea id="editClientAddress" name="address" rows="3">${client.address || ''}</textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline" onclick="window.invoiceSystem.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Update Client</button>
        </div>
      </form>
    `;
    
    this.showModal('Edit Client', form);
    
    // Handle form submission
    document.getElementById('editClientForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.updateClient(client.id, new FormData(e.target));
    });
  }
  
  updateClient(clientId, formData) {
    const client = this.state.clients.find(c => c.id === clientId);
    if (client) {
      client.name = formData.get('name');
      client.email = formData.get('email');
      client.phone = formData.get('phone');
      client.address = formData.get('address');
      
      this.closeModal();
      this.showToast('Success', `Client "${client.name}" updated successfully!`, 'success');
      
      // Refresh current section if it's clients
      if (this.state.currentSection === 'clients') {
        this.loadClientsSection();
      }
    }
  }
  
  updateDashboard() {
    this.updateStatistics();
    this.updateRecentInvoices();
    this.updateCharts();
  }
  
  updateStatistics() {
    const stats = this.calculateStatistics();
    
    // Update stat cards with animation
    this.animateValue(this.totalRevenueEl, 0, stats.totalRevenue, 1000, true);
    this.animateValue(this.totalInvoicesEl, 0, stats.totalInvoices, 800);
    this.animateValue(this.pendingAmountEl, 0, stats.pendingAmount, 1200, true);
    this.animateValue(this.totalClientsEl, 0, stats.totalClients, 600);
  }
  
  calculateStatistics() {
    const paidInvoices = this.state.invoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = this.state.invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue');
    
    return {
      totalRevenue: paidInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      totalInvoices: this.state.invoices.length,
      pendingAmount: pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      totalClients: this.state.clients.length
    };
  }
  
  animateValue(element, start, end, duration, isCurrency = false) {
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
        element.textContent = value.toLocaleString();
      }
    }, 16);
  }
  
  updateRecentInvoices() {
    if (!this.recentInvoicesEl) return;
    
    const recentInvoices = this.state.invoices
      .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
      .slice(0, 5);
    
    this.recentInvoicesEl.innerHTML = recentInvoices
      .map(invoice => `
        <div class="invoice-item">
          <div class="invoice-info">
            <div class="invoice-number">${invoice.number}</div>
            <div class="invoice-client">${invoice.client}</div>
          </div>
          <div class="invoice-amount">${this.formatCurrency(invoice.amount)}</div>
          <div class="invoice-status status-${invoice.status}">${invoice.status}</div>
        </div>
      `).join('');
  }
  
  initializeCharts() {
    this.initializeRevenueChart();
    this.initializePaymentStatusChart();
  }
  
  initializeRevenueChart() {
    if (!this.revenueChartCanvas) return;
    
    const ctx = this.revenueChartCanvas.getContext('2d');
    
    // Generate sample data for the last 6 months
    const months = [];
    const revenueData = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(date.toLocaleDateString('en-US', { month: 'short' }));
      
      // Generate realistic revenue data
      const baseRevenue = 15000;
      const variance = (Math.random() - 0.5) * 10000;
      revenueData.push(Math.max(5000, baseRevenue + variance));
    }
    
    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Revenue',
          data: revenueData,
          borderColor: '#cc2936',
          backgroundColor: 'rgba(204, 41, 54, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#cc2936',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6
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
              color: '#ecf0f1'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ecf0f1',
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
  
  initializePaymentStatusChart() {
    if (!this.paymentStatusChartCanvas) return;
    
    const ctx = this.paymentStatusChartCanvas.getContext('2d');
    
    const paidCount = this.state.invoices.filter(inv => inv.status === 'paid').length;
    const pendingCount = this.state.invoices.filter(inv => inv.status === 'pending').length;
    const overdueCount = this.state.invoices.filter(inv => inv.status === 'overdue').length;
    
    this.paymentStatusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Paid', 'Pending', 'Overdue'],
        datasets: [{
          data: [paidCount, pendingCount, overdueCount],
          backgroundColor: ['#28a745', '#ffc107', '#cc2936'],
          borderWidth: 0
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
        cutout: '60%'
      }
    });
  }
  
  updateCharts() {
    if (this.revenueChart) {
      this.revenueChart.update();
    }
    
    if (this.paymentStatusChart) {
      // Update payment status chart data
      const paidCount = this.state.invoices.filter(inv => inv.status === 'paid').length;
      const pendingCount = this.state.invoices.filter(inv => inv.status === 'pending').length;
      const overdueCount = this.state.invoices.filter(inv => inv.status === 'overdue').length;
      
      this.paymentStatusChart.data.datasets[0].data = [paidCount, pendingCount, overdueCount];
      this.paymentStatusChart.update();
    }
  }
  
  handleQuickAction(action) {
    switch (action) {
      case 'create-invoice':
        this.navigateToSection('create');
        break;
      case 'add-client':
        this.showAddClientModal();
        break;
      case 'record-payment':
        this.showRecordPaymentModal();
        break;
      case 'send-reminder':
        this.showSendReminderModal();
        break;
    }
  }
  
  handleSearch(query) {
    if (!query.trim()) return;
    
    console.log(`🔍 Searching for: ${query}`);
    
    // Implement search functionality across invoices and clients
    const results = {
      invoices: this.state.invoices.filter(inv => 
        inv.number.toLowerCase().includes(query.toLowerCase()) ||
        inv.client.toLowerCase().includes(query.toLowerCase())
      ),
      clients: this.state.clients.filter(client =>
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.email.toLowerCase().includes(query.toLowerCase())
      )
    };
    
    this.showSearchResults(results);
  }
  
  showSearchResults(results) {
    // Implement search results display
    console.log('Search results:', results);
  }
  
  showNotifications() {
    // Sample notifications
    const notifications = [
      {
        type: 'warning',
        title: 'Overdue Invoice',
        message: 'Invoice KL-2024-003 is 5 days overdue',
        time: '2 hours ago'
      },
      {
        type: 'success',
        title: 'Payment Received',
        message: 'Payment of $9,800 received from Acme Corporation',
        time: '1 day ago'
      },
      {
        type: 'info',
        title: 'New Client Added',
        message: 'Digital Solutions LLC has been added as a new client',
        time: '3 days ago'
      }
    ];
    
    this.showModal('Notifications', this.renderNotifications(notifications));
  }
  
  renderNotifications(notifications) {
    return `
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
  }
  
  showAddClientModal() {
    const form = `
      <form id="addClientForm">
        <div class="form-group">
          <label for="clientName">Client Name</label>
          <input type="text" id="clientName" name="name" required>
        </div>
        <div class="form-group">
          <label for="clientEmail">Email</label>
          <input type="email" id="clientEmail" name="email" required>
        </div>
        <div class="form-group">
          <label for="clientPhone">Phone</label>
          <input type="tel" id="clientPhone" name="phone">
        </div>
        <div class="form-group">
          <label for="clientAddress">Address</label>
          <textarea id="clientAddress" name="address" rows="3"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline" onclick="window.invoiceSystem.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Add Client</button>
        </div>
      </form>
    `;
    
    this.showModal('Add New Client', form);
    
    // Handle form submission
    document.getElementById('addClientForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addNewClient(new FormData(e.target));
    });
  }
  
  addNewClient(formData) {
    const newClient = {
      id: this.state.clients.length + 1,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      created: new Date(),
      totalInvoiced: 0
    };
    
    this.state.clients.push(newClient);
    this.closeModal();
    this.showToast('Success', `Client "${newClient.name}" added successfully!`, 'success');
  }
  
  showRecordPaymentModal() {
    const unpaidInvoices = this.state.invoices.filter(inv => inv.status !== 'paid');
    
    const form = `
      <form id="recordPaymentForm">
        <div class="form-group">
          <label for="paymentInvoice">Invoice</label>
          <select id="paymentInvoice" name="invoiceId" required>
            <option value="">Select an invoice</option>
            ${unpaidInvoices.map(inv => `
              <option value="${inv.id}">${inv.number} - ${inv.client} (${this.formatCurrency(inv.amount)})</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="paymentAmount">Amount</label>
          <input type="number" id="paymentAmount" name="amount" step="0.01" required>
        </div>
        <div class="form-group">
          <label for="paymentMethod">Payment Method</label>
          <select id="paymentMethod" name="method" required>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Check">Check</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        <div class="form-group">
          <label for="paymentReference">Reference</label>
          <input type="text" id="paymentReference" name="reference" placeholder="Transaction reference">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline" onclick="window.invoiceSystem.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Record Payment</button>
        </div>
      </form>
    `;
    
    this.showModal('Record Payment', form);
    
    // Handle invoice selection
    document.getElementById('paymentInvoice').addEventListener('change', (e) => {
      const invoiceId = parseInt(e.target.value);
      const invoice = this.state.invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        document.getElementById('paymentAmount').value = invoice.amount;
      }
    });
    
    // Handle form submission
    document.getElementById('recordPaymentForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.recordPayment(new FormData(e.target));
    });
  }
  
  recordPayment(formData) {
    const payment = {
      id: this.state.payments.length + 1,
      invoiceId: parseInt(formData.get('invoiceId')),
      amount: parseFloat(formData.get('amount')),
      method: formData.get('method'),
      reference: formData.get('reference'),
      date: new Date()
    };
    
    this.state.payments.push(payment);
    
    // Update invoice status
    const invoice = this.state.invoices.find(inv => inv.id === payment.invoiceId);
    if (invoice) {
      invoice.status = 'paid';
      invoice.paidDate = payment.date;
    }
    
    this.closeModal();
    this.showToast('Success', `Payment of ${this.formatCurrency(payment.amount)} recorded successfully!`, 'success');
    this.updateDashboard();
  }
  
  showSendReminderModal() {
    const overdueInvoices = this.state.invoices.filter(inv => 
      inv.status === 'pending' || inv.status === 'overdue'
    );
    
    const form = `
      <form id="sendReminderForm">
        <div class="form-group">
          <label for="reminderInvoice">Invoice</label>
          <select id="reminderInvoice" name="invoiceId" required>
            <option value="">Select an invoice</option>
            ${overdueInvoices.map(inv => `
              <option value="${inv.id}">${inv.number} - ${inv.client} (${this.formatCurrency(inv.amount)})</option>
            `).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="reminderTemplate">Template</label>
          <select id="reminderTemplate" name="template" required>
            <option value="gentle">Gentle Reminder</option>
            <option value="urgent">Urgent Notice</option>
            <option value="final">Final Notice</option>
          </select>
        </div>
        <div class="form-group">
          <label for="reminderMessage">Custom Message</label>
          <textarea id="reminderMessage" name="message" rows="4" placeholder="Add a personal message (optional)"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline" onclick="window.invoiceSystem.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Send Reminder</button>
        </div>
      </form>
    `;
    
    this.showModal('Send Payment Reminder', form);
    
    // Handle form submission
    document.getElementById('sendReminderForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendReminder(new FormData(e.target));
    });
  }
  
  sendReminder(formData) {
    const invoiceId = parseInt(formData.get('invoiceId'));
    const invoice = this.state.invoices.find(inv => inv.id === invoiceId);
    
    if (invoice) {
      this.closeModal();
      this.showToast('Success', `Payment reminder sent to ${invoice.client}!`, 'success');
    }
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
      <div class="modal-overlay" onclick="window.invoiceSystem.closeModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="window.invoiceSystem.closeModal()">
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
    
    // Add modal styles if not present
    if (!document.getElementById('modalStyles')) {
      const modalStyles = document.createElement('style');
      modalStyles.id = 'modalStyles';
      modalStyles.textContent = `
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .modal.show {
          opacity: 1;
        }
        
        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .modal-content {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius-lg);
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          transform: translateY(-20px);
          transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
          transform: translateY(0);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-xl);
          border-bottom: 1px solid var(--glass-border);
        }
        
        .modal-header h3 {
          margin: 0;
          color: var(--light-color);
        }
        
        .modal-close {
          background: none;
          border: none;
          color: var(--light-color);
          font-size: var(--font-size-lg);
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius);
          transition: var(--transition-fast);
        }
        
        .modal-close:hover {
          background: var(--glass-bg);
        }
        
        .modal-body {
          padding: var(--spacing-xl);
        }
        
        .form-group {
          margin-bottom: var(--spacing-lg);
        }
        
        .form-group label {
          display: block;
          margin-bottom: var(--spacing-sm);
          color: var(--light-color);
          font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: var(--spacing-md);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius);
          color: var(--light-color);
          font-family: var(--font-family);
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--secondary-color);
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
        
        .form-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
          margin-top: var(--spacing-xl);
        }
        
        .notifications-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .notification-item {
          padding: var(--spacing-lg);
          border-left: 4px solid var(--secondary-color);
          background: var(--glass-bg);
          margin-bottom: var(--spacing-md);
          border-radius: var(--border-radius);
        }
        
        .notification-item.warning {
          border-color: var(--warning-color);
        }
        
        .notification-item.success {
          border-color: var(--success-color);
        }
        
        .notification-item.info {
          border-color: var(--info-color);
        }
        
        .notification-content h4 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--light-color);
        }
        
        .notification-content p {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--muted-color);
        }
        
        .notification-content small {
          color: var(--muted-color);
          font-size: var(--font-size-xs);
        }
      `;
      document.head.appendChild(modalStyles);
    }
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
    
    // Add toast styles if not present
    if (!document.getElementById('toastStyles')) {
      const toastStyles = document.createElement('style');
      toastStyles.id = 'toastStyles';
      toastStyles.textContent = `
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: var(--border-radius);
          padding: var(--spacing-lg);
          color: var(--light-color);
          z-index: 10001;
          min-width: 300px;
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-md);
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }
        
        .toast.show {
          transform: translateX(0);
        }
        
        .toast-success {
          border-left: 4px solid var(--success-color);
        }
        
        .toast-warning {
          border-left: 4px solid var(--warning-color);
        }
        
        .toast-error {
          border-left: 4px solid var(--accent-color);
        }
        
        .toast-info {
          border-left: 4px solid var(--info-color);
        }
        
        .toast-content {
          flex: 1;
        }
        
        .toast-content strong {
          display: block;
          margin-bottom: var(--spacing-xs);
        }
        
        .toast-content p {
          margin: 0;
          font-size: var(--font-size-sm);
          opacity: 0.9;
        }
        
        .toast-close {
          background: none;
          border: none;
          color: var(--light-color);
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: var(--border-radius);
          transition: var(--transition-fast);
        }
        
        .toast-close:hover {
          background: var(--glass-bg);
        }
      `;
      document.head.appendChild(toastStyles);
    }
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
  
  formatCurrency(amount) {
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
  
  // Export functionality
  exportData(type) {
    switch (type) {
      case 'invoices':
        this.exportInvoices();
        break;
      case 'clients':
        this.exportClients();
        break;
      case 'payments':
        this.exportPayments();
        break;
    }
  }
  
  exportInvoices() {
    const csvContent = this.arrayToCsv([
      ['Invoice Number', 'Client', 'Amount', 'Status', 'Issue Date', 'Due Date'],
      ...this.state.invoices.map(inv => [
        inv.number,
        inv.client,
        inv.amount,
        inv.status,
        this.formatDate(inv.issueDate),
        this.formatDate(inv.dueDate)
      ])
    ]);
    
    this.downloadCsv(csvContent, 'invoices.csv');
  }
  
  arrayToCsv(data) {
    return data.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }
  
  downloadCsv(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.invoiceSystem = new InvoiceManagementSystem();
});

// Export for global access
window.InvoiceManagementSystem = InvoiceManagementSystem;