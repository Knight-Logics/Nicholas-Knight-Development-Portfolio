/**
 * Knight Logics E-commerce Management System
 * Professional Online Store Management Application
 */

class EcommerceManagementSystem {
  constructor() {
    // Application State
    this.state = {
      currentSection: 'dashboard',
      products: [],
      orders: [],
      customers: [],
      inventory: [],
      analytics: {},
      isLoading: false,
      user: {
        name: 'Nicholas Knight',
        role: 'Store Manager',
        company: 'Knight Logics',
        id: 1
      }
    };
    
    // Configuration
    this.config = {
      currency: 'USD',
      orderStatuses: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      productCategories: ['electronics', 'clothing', 'books', 'home'],
      customerSegments: ['vip', 'regular', 'new']
    };
    
    // Initialize application
    this.init();
  }
  
  async init() {
    console.log('🚀 Initializing Knight Logics E-commerce Management System...');
    
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
    
    console.log('✅ E-commerce Management System initialized successfully!');
  }
  
  initializeDOMElements() {
    // Navigation elements
    this.navLinks = document.querySelectorAll('.sidebar .nav-link');
    this.contentSections = document.querySelectorAll('.content-section');
    
    // Dashboard elements
    this.totalRevenueEl = document.getElementById('totalRevenue');
    this.totalOrdersEl = document.getElementById('totalOrders');
    this.totalProductsEl = document.getElementById('totalProducts');
    this.totalCustomersEl = document.getElementById('totalCustomers');
    this.topProductsListEl = document.getElementById('topProductsList');
    this.recentOrdersListEl = document.getElementById('recentOrdersList');
    this.inventoryAlertsListEl = document.getElementById('inventoryAlertsList');
    this.alertCountEl = document.getElementById('alertCount');
    
    // Chart canvases
    this.salesChartEl = document.getElementById('salesChart');
    this.customerActivityChartEl = document.getElementById('customerActivityChart');
    this.revenueTrendsChartEl = document.getElementById('revenueTrendsChart');
    this.productPerformanceChartEl = document.getElementById('productPerformanceChart');
    this.customerAcquisitionChartEl = document.getElementById('customerAcquisitionChart');
    
    // Action buttons
    this.quickAddBtn = document.getElementById('quickAddBtn');
    this.addProductBtn = document.getElementById('addProductBtn');
    this.processOrderBtn = document.getElementById('processOrderBtn');
    this.updateInventoryBtn = document.getElementById('updateInventoryBtn');
    this.exportReportBtn = document.getElementById('exportReportBtn');
    this.notificationsBtn = document.getElementById('notificationsBtn');
    
    // Search
    this.globalSearch = document.getElementById('globalSearch');
    
    // Section containers
    this.productsGrid = document.getElementById('productsGrid');
    this.inventoryTableBody = document.getElementById('inventoryTableBody');
    this.ordersContainer = document.getElementById('ordersContainer');
    this.customersGrid = document.getElementById('customersGrid');
    
    // Analytics KPIs
    this.avgOrderValueEl = document.getElementById('avgOrderValue');
    this.conversionRateEl = document.getElementById('conversionRate');
    this.customerRetentionEl = document.getElementById('customerRetention');
    this.profitMarginEl = document.getElementById('profitMargin');
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
    this.addProductBtn?.addEventListener('click', () => this.showAddProductModal());
    this.processOrderBtn?.addEventListener('click', () => this.showProcessOrderModal());
    this.updateInventoryBtn?.addEventListener('click', () => this.showInventoryModal());
    this.exportReportBtn?.addEventListener('click', () => this.exportReport());
    
    // Search functionality
    this.globalSearch?.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });
    
    // Notifications
    this.notificationsBtn?.addEventListener('click', () => {
      this.showNotifications();
    });
    
    // View toggles
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const viewType = btn.dataset.view;
        this.toggleView(viewType, btn);
      });
    });
    
    // Status filters
    document.querySelectorAll('.status-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterOrders(btn.dataset.status);
        document.querySelectorAll('.status-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }
  
  async loadSampleData() {
    // Sample customers
    this.state.customers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY 10001',
        segment: 'vip',
        totalOrders: 15,
        totalSpent: 5250.00,
        lastOrder: new Date('2024-09-20'),
        joined: new Date('2023-08-15')
      },
      {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 987-6543',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        segment: 'regular',
        totalOrders: 8,
        totalSpent: 2100.00,
        lastOrder: new Date('2024-09-18'),
        joined: new Date('2024-01-22')
      },
      {
        id: 3,
        firstName: 'Mike',
        lastName: 'Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 456-7890',
        address: '789 Pine St, Chicago, IL 60601',
        segment: 'regular',
        totalOrders: 5,
        totalSpent: 1350.00,
        lastOrder: new Date('2024-09-15'),
        joined: new Date('2024-03-10')
      },
      {
        id: 4,
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@email.com',
        phone: '+1 (555) 234-5678',
        address: '321 Elm St, Miami, FL 33101',
        segment: 'new',
        totalOrders: 2,
        totalSpent: 450.00,
        lastOrder: new Date('2024-09-22'),
        joined: new Date('2024-09-01')
      }
    ];
    
    // Sample products
    this.state.products = [
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
        category: 'electronics',
        price: 199.99,
        cost: 89.99,
        sku: 'WBH-001',
        stock: 45,
        minStock: 10,
        status: 'active',
        sales: 156,
        revenue: 31198.44,
        rating: 4.8,
        created: new Date('2024-06-15')
      },
      {
        id: 2,
        name: 'Premium Cotton T-Shirt',
        description: 'Comfortable 100% organic cotton t-shirt in multiple colors',
        category: 'clothing',
        price: 29.99,
        cost: 12.99,
        sku: 'PCT-002',
        stock: 120,
        minStock: 25,
        status: 'active',
        sales: 234,
        revenue: 7017.66,
        rating: 4.6,
        created: new Date('2024-07-01')
      },
      {
        id: 3,
        name: 'JavaScript Programming Guide',
        description: 'Comprehensive guide to modern JavaScript development',
        category: 'books',
        price: 39.99,
        cost: 15.99,
        sku: 'JPG-003',
        stock: 67,
        minStock: 15,
        status: 'active',
        sales: 89,
        revenue: 3559.11,
        rating: 4.9,
        created: new Date('2024-05-20')
      },
      {
        id: 4,
        name: 'Smart Home Security Camera',
        description: '1080p HD wireless security camera with night vision',
        category: 'electronics',
        price: 129.99,
        cost: 55.99,
        sku: 'SHSC-004',
        stock: 8,
        minStock: 10,
        status: 'active',
        sales: 78,
        revenue: 10139.22,
        rating: 4.4,
        created: new Date('2024-08-10')
      },
      {
        id: 5,
        name: 'Ceramic Coffee Mug Set',
        description: 'Set of 4 handcrafted ceramic coffee mugs',
        category: 'home',
        price: 49.99,
        cost: 22.99,
        sku: 'CCMS-005',
        stock: 35,
        minStock: 12,
        status: 'active',
        sales: 67,
        revenue: 3349.33,
        rating: 4.7,
        created: new Date('2024-07-25')
      },
      {
        id: 6,
        name: 'Fitness Resistance Bands',
        description: 'Professional resistance bands set for home workouts',
        category: 'home',
        price: 24.99,
        cost: 9.99,
        sku: 'FRB-006',
        stock: 0,
        minStock: 20,
        status: 'active',
        sales: 145,
        revenue: 3623.55,
        rating: 4.5,
        created: new Date('2024-06-30')
      }
    ];
    
    // Sample orders
    this.state.orders = [
      {
        id: 1001,
        customerId: 1,
        customer: 'John Smith',
        status: 'delivered',
        total: 229.98,
        items: [
          { productId: 1, name: 'Wireless Bluetooth Headphones', quantity: 1, price: 199.99 },
          { productId: 2, name: 'Premium Cotton T-Shirt', quantity: 1, price: 29.99 }
        ],
        date: new Date('2024-09-20'),
        shippingAddress: '123 Main St, New York, NY 10001'
      },
      {
        id: 1002,
        customerId: 2,
        customer: 'Sarah Johnson',
        status: 'shipped',
        total: 169.97,
        items: [
          { productId: 4, name: 'Smart Home Security Camera', quantity: 1, price: 129.99 },
          { productId: 3, name: 'JavaScript Programming Guide', quantity: 1, price: 39.99 }
        ],
        date: new Date('2024-09-18'),
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90001'
      },
      {
        id: 1003,
        customerId: 3,
        customer: 'Mike Chen',
        status: 'processing',
        total: 99.97,
        items: [
          { productId: 2, name: 'Premium Cotton T-Shirt', quantity: 2, price: 29.99 },
          { productId: 3, name: 'JavaScript Programming Guide', quantity: 1, price: 39.99 }
        ],
        date: new Date('2024-09-22'),
        shippingAddress: '789 Pine St, Chicago, IL 60601'
      },
      {
        id: 1004,
        customerId: 4,
        customer: 'Emily Davis',
        status: 'pending',
        total: 79.98,
        items: [
          { productId: 2, name: 'Premium Cotton T-Shirt', quantity: 1, price: 29.99 },
          { productId: 5, name: 'Ceramic Coffee Mug Set', quantity: 1, price: 49.99 }
        ],
        date: new Date('2024-09-23'),
        shippingAddress: '321 Elm St, Miami, FL 33101'
      },
      {
        id: 1005,
        customerId: 1,
        customer: 'John Smith',
        status: 'delivered',
        total: 154.97,
        items: [
          { productId: 4, name: 'Smart Home Security Camera', quantity: 1, price: 129.99 },
          { productId: 6, name: 'Fitness Resistance Bands', quantity: 1, price: 24.99 }
        ],
        date: new Date('2024-09-15'),
        shippingAddress: '123 Main St, New York, NY 10001'
      }
    ];
    
    // Calculate inventory data
    this.state.inventory = this.state.products.map(product => ({
      ...product,
      reserved: Math.floor(Math.random() * 5),
      available: product.stock - Math.floor(Math.random() * 5),
      stockStatus: this.getStockStatus(product.stock, product.minStock)
    }));
    
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
      case 'products':
        this.loadProductsSection();
        break;
      case 'inventory':
        this.loadInventorySection();
        break;
      case 'orders':
        this.loadOrdersSection();
        break;
      case 'customers':
        this.loadCustomersSection();
        break;
      case 'analytics':
        this.loadAnalyticsSection();
        break;
    }
  }
  
  updateDashboard() {
    this.updateStatistics();
    this.updateTopProducts();
    this.updateRecentOrders();
    this.updateInventoryAlerts();
    this.updateCharts();
  }
  
  updateStatistics() {
    const stats = this.calculateStatistics();
    
    // Update stat cards with animation
    this.animateValue(this.totalRevenueEl, 0, stats.totalRevenue, 1200, true);
    this.animateValue(this.totalOrdersEl, 0, stats.totalOrders, 800);
    this.animateValue(this.totalProductsEl, 0, stats.totalProducts, 600);
    this.animateValue(this.totalCustomersEl, 0, stats.totalCustomers, 1000);
  }
  
  calculateStatistics() {
    const totalRevenue = this.state.orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = this.state.orders.length;
    const totalProducts = this.state.products.filter(p => p.stock > 0).length;
    const totalCustomers = this.state.customers.length;
    
    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers
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
  
  updateTopProducts() {
    if (!this.topProductsListEl) return;
    
    const topProducts = this.state.products
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    
    this.topProductsListEl.innerHTML = topProducts
      .map((product, index) => `
        <div class="top-product-item">
          <div class="product-rank">${index + 1}</div>
          <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-sales">${product.sales} sold</div>
          </div>
          <div class="product-revenue">${this.formatCurrency(product.revenue)}</div>
        </div>
      `).join('');
  }
  
  updateRecentOrders() {
    if (!this.recentOrdersListEl) return;
    
    const recentOrders = this.state.orders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    this.recentOrdersListEl.innerHTML = recentOrders
      .map(order => `
        <div class="order-item">
          <div class="order-info">
            <div class="order-id">#${order.id}</div>
            <div class="order-customer">${order.customer}</div>
          </div>
          <div class="order-details">
            <div class="order-amount">${this.formatCurrency(order.total)}</div>
            <span class="order-status ${order.status}">${order.status}</span>
          </div>
        </div>
      `).join('');
  }
  
  updateInventoryAlerts() {
    if (!this.inventoryAlertsListEl || !this.alertCountEl) return;
    
    const lowStockProducts = this.state.products.filter(product => 
      product.stock <= product.minStock
    );
    
    this.alertCountEl.textContent = lowStockProducts.length;
    
    this.inventoryAlertsListEl.innerHTML = lowStockProducts.length > 0 
      ? lowStockProducts.map(product => `
          <div class="alert-item">
            <div class="alert-info">
              <div class="alert-title">${product.name}</div>
              <div class="alert-message">
                ${product.stock === 0 ? 'Out of stock' : `Low stock: ${product.stock} remaining`}
              </div>
            </div>
            <div class="alert-action">
              <button class="btn btn-sm btn-primary" onclick="window.ecommerceSystem.restockProduct(${product.id})">
                Restock
              </button>
            </div>
          </div>
        `).join('')
      : '<div class="no-alerts">No inventory alerts</div>';
  }
  
  initializeCharts() {
    this.initializeSalesChart();
    this.initializeCustomerActivityChart();
  }
  
  initializeSalesChart() {
    if (!this.salesChartEl) return;
    
    const ctx = this.salesChartEl.getContext('2d');
    
    // Generate last 30 days sales data
    const salesData = this.generateSalesData();
    
    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: salesData.labels,
        datasets: [{
          label: 'Daily Sales',
          data: salesData.data,
          borderColor: '#f39c12',
          backgroundColor: 'rgba(243, 156, 18, 0.1)',
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
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }
  
  initializeCustomerActivityChart() {
    if (!this.customerActivityChartEl) return;
    
    const ctx = this.customerActivityChartEl.getContext('2d');
    
    const activityData = {
      labels: ['New Visitors', 'Returning Customers', 'Purchases', 'Reviews'],
      data: [150, 89, 67, 23]
    };
    
    this.customerActivityChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: activityData.labels,
        datasets: [{
          data: activityData.data,
          backgroundColor: [
            '#f39c12',
            '#e67e22',
            '#27ae60',
            '#3498db'
          ],
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
  
  generateSalesData() {
    const labels = [];
    const data = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.getDate().toString());
      
      // Generate realistic sales data
      const baseSales = 500;
      const variance = (Math.random() - 0.5) * 300;
      data.push(Math.max(100, baseSales + variance));
    }
    
    return { labels, data };
  }
  
  loadProductsSection() {
    if (!this.productsGrid) return;
    
    this.productsGrid.innerHTML = this.state.products.map(product => `
      <div class="product-card" onclick="window.ecommerceSystem.viewProduct(${product.id})">
        <div class="product-image">
          <i class="fas fa-${this.getProductIcon(product.category)}"></i>
        </div>
        <div class="product-info">
          <div class="product-title">${product.name}</div>
          <div class="product-price">${this.formatCurrency(product.price)}</div>
          <div class="product-stock">
            ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
          <div class="product-sales">${product.sales} sold</div>
        </div>
      </div>
    `).join('');
  }
  
  getProductIcon(category) {
    const icons = {
      'electronics': 'laptop',
      'clothing': 'tshirt',
      'books': 'book',
      'home': 'home'
    };
    return icons[category] || 'box';
  }
  
  loadInventorySection() {
    if (!this.inventoryTableBody) return;
    
    // Update inventory overview
    const totalStockValue = this.state.products.reduce((sum, product) => 
      sum + (product.stock * product.cost), 0);
    const lowStockItems = this.state.products.filter(p => 
      p.stock > 0 && p.stock <= p.minStock).length;
    const outOfStockItems = this.state.products.filter(p => p.stock === 0).length;
    
    document.getElementById('totalStockValue').textContent = this.formatCurrency(totalStockValue);
    document.getElementById('lowStockItems').textContent = lowStockItems;
    document.getElementById('outOfStockItems').textContent = outOfStockItems;
    
    // Update inventory table
    this.inventoryTableBody.innerHTML = this.state.inventory.map(item => `
      <tr>
        <td>
          <div class="product-cell">
            <strong>${item.name}</strong>
            <br><small>${item.description}</small>
          </div>
        </td>
        <td>${item.sku}</td>
        <td>${item.category}</td>
        <td>${item.stock}</td>
        <td>${item.reserved}</td>
        <td>${item.available}</td>
        <td>${item.minStock}</td>
        <td>
          <span class="stock-status ${item.stockStatus}">
            ${item.stockStatus.replace('-', ' ')}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="window.ecommerceSystem.adjustStock(${item.id})">
            Adjust
          </button>
        </td>
      </tr>
    `).join('');
  }
  
  getStockStatus(stock, minStock) {
    if (stock === 0) return 'out-of-stock';
    if (stock <= minStock) return 'low-stock';
    return 'in-stock';
  }
  
  loadOrdersSection() {
    this.updateOrderStats();
    this.loadOrdersList();
  }
  
  updateOrderStats() {
    const ordersByStatus = this.config.orderStatuses.reduce((acc, status) => {
      acc[status] = this.state.orders.filter(order => order.status === status).length;
      return acc;
    }, {});
    
    document.getElementById('pendingOrders').textContent = ordersByStatus.pending || 0;
    document.getElementById('processingOrders').textContent = ordersByStatus.processing || 0;
    document.getElementById('shippedOrders').textContent = ordersByStatus.shipped || 0;
    document.getElementById('deliveredOrders').textContent = ordersByStatus.delivered || 0;
  }
  
  loadOrdersList() {
    if (!this.ordersContainer) return;
    
    const sortedOrders = this.state.orders
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    this.ordersContainer.innerHTML = sortedOrders.map(order => `
      <div class="order-card" onclick="window.ecommerceSystem.viewOrder(${order.id})">
        <div class="order-header">
          <div class="order-id">#${order.id}</div>
          <span class="order-status ${order.status}">${order.status}</span>
        </div>
        <div class="order-customer">
          <i class="fas fa-user"></i>
          ${order.customer}
        </div>
        <div class="order-items">
          <i class="fas fa-box"></i>
          ${order.items.length} item${order.items.length !== 1 ? 's' : ''}
        </div>
        <div class="order-total">
          <strong>${this.formatCurrency(order.total)}</strong>
        </div>
        <div class="order-date">
          ${this.formatDate(order.date)}
        </div>
      </div>
    `).join('');
  }
  
  filterOrders(status) {
    const filteredOrders = status === 'all' 
      ? this.state.orders 
      : this.state.orders.filter(order => order.status === status);
    
    // Update orders display with filtered results
    this.displayFilteredOrders(filteredOrders);
  }
  
  displayFilteredOrders(orders) {
    if (!this.ordersContainer) return;
    
    this.ordersContainer.innerHTML = orders.map(order => `
      <div class="order-card" onclick="window.ecommerceSystem.viewOrder(${order.id})">
        <div class="order-header">
          <div class="order-id">#${order.id}</div>
          <span class="order-status ${order.status}">${order.status}</span>
        </div>
        <div class="order-customer">
          <i class="fas fa-user"></i>
          ${order.customer}
        </div>
        <div class="order-items">
          <i class="fas fa-box"></i>
          ${order.items.length} item${order.items.length !== 1 ? 's' : ''}
        </div>
        <div class="order-total">
          <strong>${this.formatCurrency(order.total)}</strong>
        </div>
        <div class="order-date">
          ${this.formatDate(order.date)}
        </div>
      </div>
    `).join('');
  }
  
  loadCustomersSection() {
    this.updateCustomerSegments();
    this.loadCustomersGrid();
  }
  
  updateCustomerSegments() {
    const vipCustomers = this.state.customers.filter(c => c.segment === 'vip').length;
    const regularCustomers = this.state.customers.filter(c => c.segment === 'regular').length;
    const newCustomers = this.state.customers.filter(c => c.segment === 'new').length;
    
    document.getElementById('vipCustomers').textContent = vipCustomers;
    document.getElementById('regularCustomers').textContent = regularCustomers;
    document.getElementById('newCustomers').textContent = newCustomers;
  }
  
  loadCustomersGrid() {
    if (!this.customersGrid) return;
    
    this.customersGrid.innerHTML = this.state.customers.map(customer => `
      <div class="customer-card" onclick="window.ecommerceSystem.viewCustomer(${customer.id})">
        <div class="customer-header">
          <div class="customer-avatar">${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}</div>
          <div class="customer-info">
            <h3>${customer.firstName} ${customer.lastName}</h3>
            <p>${customer.email}</p>
            <p><span class="customer-segment ${customer.segment}">${customer.segment.toUpperCase()}</span></p>
          </div>
        </div>
        <div class="customer-stats">
          <div class="customer-stat">
            <span class="stat-value">${customer.totalOrders}</span>
            <span class="stat-label">Orders</span>
          </div>
          <div class="customer-stat">
            <span class="stat-value">${this.formatCurrency(customer.totalSpent)}</span>
            <span class="stat-label">Total Spent</span>
          </div>
          <div class="customer-stat">
            <span class="stat-value">${this.formatTimeAgo(customer.lastOrder)}</span>
            <span class="stat-label">Last Order</span>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  // Utility methods
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.config.currency
    }).format(amount);
  }
  
  formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
  
  showNotifications() {
    const notifications = [
      {
        type: 'warning',
        title: 'Low Stock Alert',
        message: 'Smart Home Security Camera is running low (8 remaining)',
        time: '5 minutes ago'
      },
      {
        type: 'success',
        title: 'New Order',
        message: 'Order #1006 received from John Smith ($199.99)',
        time: '15 minutes ago'
      },
      {
        type: 'info',
        title: 'Product Review',
        message: 'New 5-star review for Wireless Bluetooth Headphones',
        time: '1 hour ago'
      },
      {
        type: 'error',
        title: 'Out of Stock',
        message: 'Fitness Resistance Bands is now out of stock',
        time: '2 hours ago'
      },
      {
        type: 'success',
        title: 'Payment Processed',
        message: 'Payment of $169.97 processed for Order #1002',
        time: '3 hours ago'
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
    
    this.showModal('Store Notifications', content);
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
      <div class="modal-overlay" onclick="window.ecommerceSystem.closeModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="window.ecommerceSystem.closeModal()">
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
  
  restockProduct(productId) {
    const product = this.state.products.find(p => p.id === productId);
    if (product) {
      product.stock += 50; // Add 50 units
      this.showToast('Success', `${product.name} restocked with 50 units`, 'success');
      
      if (this.state.currentSection === 'inventory') {
        this.loadInventorySection();
      }
      if (this.state.currentSection === 'dashboard') {
        this.updateInventoryAlerts();
      }
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.ecommerceSystem = new EcommerceManagementSystem();
});

// Export for global access
window.EcommerceManagementSystem = EcommerceManagementSystem;