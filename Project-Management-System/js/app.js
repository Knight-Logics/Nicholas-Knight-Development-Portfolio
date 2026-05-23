/**
 * Knight Logics Project Management System
 * Professional Project and Task Management Application
 */

class ProjectManagementSystem {
  constructor() {
    // Application State
    this.state = {
      currentSection: 'dashboard',
      projects: [],
      tasks: [],
      teamMembers: [],
      timeEntries: [],
      activities: [],
      currentTimer: null,
      isLoading: false,
      user: {
        name: 'Nicholas Knight',
        role: 'Project Manager',
        company: 'Knight Logics',
        id: 1
      }
    };
    
    // Configuration
    this.config = {
      taskStatuses: ['todo', 'in-progress', 'review', 'done'],
      projectStatuses: ['planning', 'active', 'on-hold', 'completed'],
      priorities: ['low', 'medium', 'high'],
      roles: ['Project Manager', 'Developer', 'Designer', 'QA Tester', 'Client']
    };
    
    // Timer state
    this.timer = {
      isRunning: false,
      startTime: null,
      elapsed: 0,
      taskId: null,
      interval: null
    };
    
    // Initialize application
    this.init();
  }
  
  async init() {
    console.log('🚀 Initializing Knight Logics Project Management System...');
    
    // Show loading screen
    this.showLoadingScreen();
    
    // Load sample data
    await this.loadSampleData();
    
    // Initialize DOM elements
    this.initializeDOMElements();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize sortable kanban
    this.initializeSortable();
    
    // Initialize charts
    this.initializeCharts();
    
    // Hide loading screen and show app
    setTimeout(() => {
      this.hideLoadingScreen();
      this.updateDashboard();
    }, 2000);
    
    console.log('✅ Project Management System initialized successfully!');
  }
  
  initializeDOMElements() {
    // Navigation elements
    this.navLinks = document.querySelectorAll('.sidebar .nav-link');
    this.contentSections = document.querySelectorAll('.content-section');
    
    // Dashboard elements
    this.totalProjectsEl = document.getElementById('totalProjects');
    this.completedTasksEl = document.getElementById('completedTasks');
    this.teamMembersEl = document.getElementById('teamMembers');
    this.hoursLoggedEl = document.getElementById('hoursLogged');
    this.recentActivitiesEl = document.getElementById('recentActivitiesList');
    this.upcomingDeadlinesEl = document.getElementById('upcomingDeadlinesList');
    this.teamPerformanceEl = document.getElementById('teamPerformanceList');
    
    // Chart canvases
    this.projectProgressChart = document.getElementById('projectProgressChart');
    this.taskDistributionChart = document.getElementById('taskDistributionChart');
    this.timelineChart = document.getElementById('timelineChart');
    
    // Action buttons
    this.quickAddBtn = document.getElementById('quickAddBtn');
    this.createProjectBtn = document.getElementById('createProjectBtn');
    this.createTaskBtn = document.getElementById('createTaskBtn');
    this.startTimerBtn = document.getElementById('startTimerBtn');
    this.scheduleTaskBtn = document.getElementById('scheduleTaskBtn');
    this.notificationsBtn = document.getElementById('notificationsBtn');
    
    // Search
    this.globalSearch = document.getElementById('globalSearch');
    
    // Section containers
    this.projectsContainer = document.getElementById('projectsContainer');
    this.kanbanBoard = document.getElementById('kanbanBoard');
    this.calendarGrid = document.getElementById('calendarGrid');
    this.teamGrid = document.getElementById('teamGrid');
    this.timeEntriesList = document.getElementById('timeEntriesList');
    
    // Timer elements
    this.currentTime = document.getElementById('currentTime');
    this.currentTask = document.getElementById('currentTask');
    this.pauseTimerBtn = document.getElementById('pauseTimerBtn');
    this.stopTimerBtn = document.getElementById('stopTimerBtn');
    this.startTrackingBtn = document.getElementById('startTrackingBtn');
    
    // Kanban columns
    this.todoTasks = document.getElementById('todoTasks');
    this.progressTasks = document.getElementById('progressTasks');
    this.reviewTasks = document.getElementById('reviewTasks');
    this.doneTasks = document.getElementById('doneTasks');
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
    this.createProjectBtn?.addEventListener('click', () => this.showCreateProjectModal());
    this.createTaskBtn?.addEventListener('click', () => this.showCreateTaskModal());
    this.startTimerBtn?.addEventListener('click', () => this.showStartTimerModal());
    this.scheduleTaskBtn?.addEventListener('click', () => this.showScheduleTaskModal());
    
    // Timer controls
    this.startTrackingBtn?.addEventListener('click', () => this.showStartTimerModal());
    this.pauseTimerBtn?.addEventListener('click', () => this.pauseTimer());
    this.stopTimerBtn?.addEventListener('click', () => this.stopTimer());
    
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
  }
  
  async loadSampleData() {
    // Sample team members
    this.state.teamMembers = [
      {
        id: 1,
        name: 'Nicholas Knight',
        role: 'Project Manager',
        email: 'nicholas@knightlogics.com',
        avatar: 'NK',
        status: 'active',
        tasksAssigned: 8,
        tasksCompleted: 12,
        efficiency: 95
      },
      {
        id: 2,
        name: 'Sarah Davis',
        role: 'Senior Developer',
        email: 'sarah@knightlogics.com',
        avatar: 'SD',
        status: 'active',
        tasksAssigned: 6,
        tasksCompleted: 18,
        efficiency: 89
      },
      {
        id: 3,
        name: 'Mike Johnson',
        role: 'UI/UX Designer',
        email: 'mike@knightlogics.com',
        avatar: 'MJ',
        status: 'active',
        tasksAssigned: 4,
        tasksCompleted: 15,
        efficiency: 92
      },
      {
        id: 4,
        name: 'Emily Chen',
        role: 'QA Tester',
        email: 'emily@knightlogics.com',
        avatar: 'EC',
        status: 'active',
        tasksAssigned: 5,
        tasksCompleted: 10,
        efficiency: 87
      },
      {
        id: 5,
        name: 'David Wilson',
        role: 'Developer',
        email: 'david@knightlogics.com',
        avatar: 'DW',
        status: 'active',
        tasksAssigned: 7,
        tasksCompleted: 14,
        efficiency: 91
      }
    ];
    
    // Sample projects
    this.state.projects = [
      {
        id: 1,
        title: 'E-Commerce Platform Redesign',
        description: 'Complete redesign of the client\'s e-commerce platform with modern UI/UX',
        status: 'active',
        priority: 'high',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-11-30'),
        budget: 85000,
        progress: 65,
        teamMembers: [1, 2, 3],
        tasks: [1, 2, 3, 4, 5],
        client: 'TechStart Solutions'
      },
      {
        id: 2,
        title: 'Manufacturing Process Automation',
        description: 'Automate manufacturing workflows and implement real-time monitoring',
        status: 'active',
        priority: 'high',
        startDate: new Date('2024-08-15'),
        endDate: new Date('2024-12-15'),
        budget: 120000,
        progress: 40,
        teamMembers: [1, 2, 4, 5],
        tasks: [6, 7, 8, 9],
        client: 'Global Manufacturing Inc.'
      },
      {
        id: 3,
        title: 'Digital Marketing Dashboard',
        description: 'Create comprehensive analytics dashboard for marketing campaigns',
        status: 'planning',
        priority: 'medium',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-31'),
        budget: 45000,
        progress: 15,
        teamMembers: [1, 3],
        tasks: [10, 11],
        client: 'Digital Marketing Pro'
      },
      {
        id: 4,
        title: 'Healthcare Data Analytics',
        description: 'Advanced analytics platform for healthcare data visualization',
        status: 'completed',
        priority: 'high',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-09-15'),
        budget: 95000,
        progress: 100,
        teamMembers: [1, 2, 4, 5],
        tasks: [12, 13, 14, 15],
        client: 'Healthcare Innovations'
      }
    ];
    
    // Sample tasks
    this.state.tasks = [
      // E-Commerce Platform tasks
      {
        id: 1,
        title: 'User Interface Design',
        description: 'Create modern, responsive UI designs for all pages',
        status: 'done',
        priority: 'high',
        projectId: 1,
        assigneeId: 3,
        assignee: 'Mike Johnson',
        dueDate: new Date('2024-10-01'),
        estimatedHours: 40,
        actualHours: 38,
        tags: ['design', 'ui']
      },
      {
        id: 2,
        title: 'Frontend Development',
        description: 'Implement responsive frontend using React.js',
        status: 'in-progress',
        priority: 'high',
        projectId: 1,
        assigneeId: 2,
        assignee: 'Sarah Davis',
        dueDate: new Date('2024-10-15'),
        estimatedHours: 60,
        actualHours: 35,
        tags: ['development', 'frontend']
      },
      {
        id: 3,
        title: 'Payment Integration',
        description: 'Integrate multiple payment gateways',
        status: 'review',
        priority: 'high',
        projectId: 1,
        assigneeId: 5,
        assignee: 'David Wilson',
        dueDate: new Date('2024-10-20'),
        estimatedHours: 25,
        actualHours: 28,
        tags: ['integration', 'payment']
      },
      {
        id: 4,
        title: 'User Testing',
        description: 'Conduct comprehensive user testing and QA',
        status: 'todo',
        priority: 'medium',
        projectId: 1,
        assigneeId: 4,
        assignee: 'Emily Chen',
        dueDate: new Date('2024-10-25'),
        estimatedHours: 30,
        actualHours: 0,
        tags: ['testing', 'qa']
      },
      {
        id: 5,
        title: 'Performance Optimization',
        description: 'Optimize site performance and loading times',
        status: 'todo',
        priority: 'medium',
        projectId: 1,
        assigneeId: 2,
        assignee: 'Sarah Davis',
        dueDate: new Date('2024-11-05'),
        estimatedHours: 20,
        actualHours: 0,
        tags: ['optimization', 'performance']
      },
      // Manufacturing Process tasks
      {
        id: 6,
        title: 'System Architecture Design',
        description: 'Design scalable system architecture',
        status: 'done',
        priority: 'high',
        projectId: 2,
        assigneeId: 1,
        assignee: 'Nicholas Knight',
        dueDate: new Date('2024-09-15'),
        estimatedHours: 35,
        actualHours: 32,
        tags: ['architecture', 'design']
      },
      {
        id: 7,
        title: 'Sensor Integration',
        description: 'Integrate IoT sensors for real-time monitoring',
        status: 'in-progress',
        priority: 'high',
        projectId: 2,
        assigneeId: 5,
        assignee: 'David Wilson',
        dueDate: new Date('2024-10-30'),
        estimatedHours: 45,
        actualHours: 20,
        tags: ['iot', 'integration']
      },
      {
        id: 8,
        title: 'Dashboard Development',
        description: 'Create monitoring dashboard with real-time data',
        status: 'todo',
        priority: 'medium',
        projectId: 2,
        assigneeId: 2,
        assignee: 'Sarah Davis',
        dueDate: new Date('2024-11-15'),
        estimatedHours: 40,
        actualHours: 0,
        tags: ['dashboard', 'frontend']
      },
      {
        id: 9,
        title: 'Process Testing',
        description: 'Test automated processes and workflows',
        status: 'todo',
        priority: 'high',
        projectId: 2,
        assigneeId: 4,
        assignee: 'Emily Chen',
        dueDate: new Date('2024-12-01'),
        estimatedHours: 25,
        actualHours: 0,
        tags: ['testing', 'automation']
      },
      // Digital Marketing Dashboard tasks
      {
        id: 10,
        title: 'Requirements Analysis',
        description: 'Analyze client requirements and create specifications',
        status: 'in-progress',
        priority: 'high',
        projectId: 3,
        assigneeId: 1,
        assignee: 'Nicholas Knight',
        dueDate: new Date('2024-10-10'),
        estimatedHours: 20,
        actualHours: 12,
        tags: ['analysis', 'requirements']
      },
      {
        id: 11,
        title: 'Wireframe Creation',
        description: 'Create detailed wireframes for dashboard layouts',
        status: 'todo',
        priority: 'medium',
        projectId: 3,
        assigneeId: 3,
        assignee: 'Mike Johnson',
        dueDate: new Date('2024-10-20'),
        estimatedHours: 15,
        actualHours: 0,
        tags: ['design', 'wireframes']
      },
      // Healthcare Analytics tasks (completed project)
      {
        id: 12,
        title: 'Data Pipeline Development',
        description: 'Build robust data processing pipeline',
        status: 'done',
        priority: 'high',
        projectId: 4,
        assigneeId: 2,
        assignee: 'Sarah Davis',
        dueDate: new Date('2024-07-15'),
        estimatedHours: 50,
        actualHours: 48,
        tags: ['data', 'pipeline']
      },
      {
        id: 13,
        title: 'Analytics Dashboard',
        description: 'Create comprehensive analytics dashboard',
        status: 'done',
        priority: 'high',
        projectId: 4,
        assigneeId: 3,
        assignee: 'Mike Johnson',
        dueDate: new Date('2024-08-15'),
        estimatedHours: 45,
        actualHours: 43,
        tags: ['analytics', 'dashboard']
      },
      {
        id: 14,
        title: 'Security Implementation',
        description: 'Implement HIPAA-compliant security measures',
        status: 'done',
        priority: 'high',
        projectId: 4,
        assigneeId: 5,
        assignee: 'David Wilson',
        dueDate: new Date('2024-08-30'),
        estimatedHours: 30,
        actualHours: 35,
        tags: ['security', 'compliance']
      },
      {
        id: 15,
        title: 'Final Testing & Deployment',
        description: 'Comprehensive testing and production deployment',
        status: 'done',
        priority: 'high',
        projectId: 4,
        assigneeId: 4,
        assignee: 'Emily Chen',
        dueDate: new Date('2024-09-15'),
        estimatedHours: 25,
        actualHours: 22,
        tags: ['testing', 'deployment']
      }
    ];
    
    // Sample time entries
    this.state.timeEntries = [
      {
        id: 1,
        taskId: 2,
        task: 'Frontend Development',
        projectId: 1,
        project: 'E-Commerce Platform Redesign',
        userId: 2,
        user: 'Sarah Davis',
        date: new Date('2024-09-23'),
        startTime: '09:00',
        endTime: '12:00',
        duration: 3,
        description: 'Implemented product catalog components'
      },
      {
        id: 2,
        taskId: 3,
        task: 'Payment Integration',
        projectId: 1,
        project: 'E-Commerce Platform Redesign',
        userId: 5,
        user: 'David Wilson',
        date: new Date('2024-09-23'),
        startTime: '13:00',
        endTime: '17:00',
        duration: 4,
        description: 'Integrated Stripe payment gateway'
      },
      {
        id: 3,
        taskId: 7,
        task: 'Sensor Integration',
        projectId: 2,
        project: 'Manufacturing Process Automation',
        userId: 5,
        user: 'David Wilson',
        date: new Date('2024-09-22'),
        startTime: '10:00',
        endTime: '15:00',
        duration: 5,
        description: 'Configured temperature and pressure sensors'
      },
      {
        id: 4,
        taskId: 10,
        task: 'Requirements Analysis',
        projectId: 3,
        project: 'Digital Marketing Dashboard',
        userId: 1,
        user: 'Nicholas Knight',
        date: new Date('2024-09-21'),
        startTime: '14:00',
        endTime: '18:00',
        duration: 4,
        description: 'Met with client to gather detailed requirements'
      }
    ];
    
    // Sample activities
    this.state.activities = [
      {
        id: 1,
        type: 'task_completed',
        title: 'User Interface Design completed',
        description: 'Mike Johnson completed the UI design for E-Commerce Platform',
        userId: 3,
        user: 'Mike Johnson',
        taskId: 1,
        projectId: 1,
        timestamp: new Date('2024-09-23T14:30:00')
      },
      {
        id: 2,
        type: 'task_started',
        title: 'Frontend Development started',
        description: 'Sarah Davis started working on frontend implementation',
        userId: 2,
        user: 'Sarah Davis',
        taskId: 2,
        projectId: 1,
        timestamp: new Date('2024-09-23T09:00:00')
      },
      {
        id: 3,
        type: 'project_created',
        title: 'New project created',
        description: 'Digital Marketing Dashboard project was created',
        userId: 1,
        user: 'Nicholas Knight',
        projectId: 3,
        timestamp: new Date('2024-09-22T16:00:00')
      },
      {
        id: 4,
        type: 'time_logged',
        title: 'Time logged',
        description: 'David Wilson logged 5 hours on Sensor Integration',
        userId: 5,
        user: 'David Wilson',
        taskId: 7,
        projectId: 2,
        timestamp: new Date('2024-09-22T15:00:00')
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
      case 'projects':
        this.loadProjectsSection();
        break;
      case 'tasks':
        this.loadTasksSection();
        break;
      case 'calendar':
        this.loadCalendarSection();
        break;
      case 'team':
        this.loadTeamSection();
        break;
      case 'time-tracking':
        this.loadTimeTrackingSection();
        break;
      case 'reports':
        this.loadReportsSection();
        break;
    }
  }
  
  updateDashboard() {
    this.updateStatistics();
    this.updateRecentActivities();
    this.updateUpcomingDeadlines();
    this.updateTeamPerformance();
    this.updateCharts();
  }
  
  updateStatistics() {
    const stats = this.calculateStatistics();
    
    // Update stat cards with animation
    this.animateValue(this.totalProjectsEl, 0, stats.totalProjects, 800);
    this.animateValue(this.completedTasksEl, 0, stats.completedTasks, 1000);
    this.animateValue(this.teamMembersEl, 0, stats.teamMembers, 600);
    this.animateValue(this.hoursLoggedEl, 0, stats.hoursLogged, 1200);
  }
  
  calculateStatistics() {
    const activeProjects = this.state.projects.filter(project => 
      project.status === 'active' || project.status === 'planning'
    ).length;
    
    const completedTasks = this.state.tasks.filter(task => task.status === 'done').length;
    
    const thisWeekEntries = this.state.timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return entryDate >= weekStart;
    });
    
    const hoursThisWeek = thisWeekEntries.reduce((sum, entry) => sum + entry.duration, 0);
    
    return {
      totalProjects: activeProjects,
      completedTasks: completedTasks,
      teamMembers: this.state.teamMembers.length,
      hoursLogged: hoursThisWeek
    };
  }
  
  animateValue(element, start, end, duration) {
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
      
      element.textContent = Math.round(current);
    }, 16);
  }
  
  updateRecentActivities() {
    if (!this.recentActivitiesEl) return;
    
    const recentActivities = this.state.activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
    
    this.recentActivitiesEl.innerHTML = recentActivities
      .map(activity => `
        <div class="activity-item">
          <div class="activity-info">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-details">${activity.user} - ${activity.description}</div>
          </div>
          <div class="activity-time">${this.formatTimeAgo(activity.timestamp)}</div>
        </div>
      `).join('');
  }
  
  updateUpcomingDeadlines() {
    if (!this.upcomingDeadlinesEl) return;
    
    const upcomingTasks = this.state.tasks
      .filter(task => task.status !== 'done' && task.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
    
    this.upcomingDeadlinesEl.innerHTML = upcomingTasks
      .map(task => `
        <div class="deadline-item">
          <div class="deadline-info">
            <div class="deadline-title">${task.title}</div>
            <div class="deadline-project">${this.getProjectById(task.projectId)?.title}</div>
          </div>
          <div class="deadline-date ${this.getDeadlineUrgency(task.dueDate)}">
            ${this.formatDate(task.dueDate)}
          </div>
        </div>
      `).join('');
  }
  
  updateTeamPerformance() {
    if (!this.teamPerformanceEl) return;
    
    this.teamPerformanceEl.innerHTML = this.state.teamMembers
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 4)
      .map(member => `
        <div class="performance-item">
          <div class="performance-avatar">${member.avatar}</div>
          <div class="performance-info">
            <div class="performance-name">${member.name}</div>
            <div class="performance-role">${member.role}</div>
          </div>
          <div class="performance-metric">${member.efficiency}%</div>
        </div>
      `).join('');
  }
  
  initializeCharts() {
    this.initializeProjectProgressChart();
    this.initializeTaskDistributionChart();
    this.initializeTimelineChart();
  }
  
  initializeProjectProgressChart() {
    if (!this.projectProgressChart) return;
    
    const ctx = this.projectProgressChart.getContext('2d');
    
    const projectData = this.state.projects.map(project => ({
      label: project.title,
      progress: project.progress
    }));
    
    this.progressChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: projectData.map(p => p.label),
        datasets: [{
          data: projectData.map(p => p.progress),
          backgroundColor: [
            '#27ae60',
            '#3498db', 
            '#f39c12',
            '#e74c3c',
            '#9b59b6'
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
              color: '#f8f9fa',
              font: { size: 12 }
            }
          }
        },
        cutout: '60%'
      }
    });
  }
  
  initializeTaskDistributionChart() {
    if (!this.taskDistributionChart) return;
    
    const ctx = this.taskDistributionChart.getContext('2d');
    
    const tasksByStatus = this.config.taskStatuses.map(status => ({
      status: status,
      count: this.state.tasks.filter(task => task.status === status).length
    }));
    
    this.taskChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: tasksByStatus.map(s => s.status.replace('-', ' ').toUpperCase()),
        datasets: [{
          label: 'Tasks',
          data: tasksByStatus.map(s => s.count),
          backgroundColor: '#27ae60',
          borderColor: '#1e7e4b',
          borderWidth: 2,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#f8f9fa' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#f8f9fa' }
          }
        }
      }
    });
  }
  
  initializeTimelineChart() {
    if (!this.timelineChart) return;
    
    const ctx = this.timelineChart.getContext('2d');
    
    // Generate timeline data for the past 7 days
    const timelineData = this.generateTimelineData();
    
    this.timeline = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timelineData.labels,
        datasets: [
          {
            label: 'Hours Logged',
            data: timelineData.hours,
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Tasks Completed',
            data: timelineData.tasks,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#f8f9fa' }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#f8f9fa' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#f8f9fa' }
          }
        }
      }
    });
  }
  
  generateTimelineData() {
    const days = [];
    const hours = [];
    const tasks = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      
      // Generate realistic data
      hours.push(Math.floor(Math.random() * 8) + 2);
      tasks.push(Math.floor(Math.random() * 5) + 1);
    }
    
    return { labels: days, hours, tasks };
  }
  
  loadProjectsSection() {
    if (!this.projectsContainer) return;
    
    this.projectsContainer.innerHTML = this.state.projects.map(project => {
      const progress = project.progress;
      const teamMemberNames = project.teamMembers
        .map(id => this.state.teamMembers.find(m => m.id === id)?.name)
        .filter(name => name)
        .join(', ');
      
      return `
        <div class="project-card" onclick="window.pmSystem.viewProject(${project.id})">
          <div class="project-header">
            <div>
              <div class="project-title">${project.title}</div>
              <div class="project-client">${project.client}</div>
            </div>
            <span class="project-status ${project.status}">${project.status.replace('-', ' ')}</span>
          </div>
          <div class="project-description">${project.description}</div>
          <div class="project-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <span class="progress-text">${progress}%</span>
          </div>
          <div class="project-meta">
            <div class="project-budget">Budget: ${this.formatCurrency(project.budget)}</div>
            <div class="project-deadline">Due: ${this.formatDate(project.endDate)}</div>
          </div>
          <div class="project-team">
            <div class="team-avatars">
              ${project.teamMembers.map(id => {
                const member = this.state.teamMembers.find(m => m.id === id);
                return member ? `<div class="team-avatar" title="${member.name}">${member.avatar}</div>` : '';
              }).join('')}
            </div>
            <div class="team-count">+${project.teamMembers.length} members</div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  loadTasksSection() {
    this.loadKanbanBoard();
  }
  
  loadKanbanBoard() {
    const tasksByStatus = {
      'todo': this.state.tasks.filter(task => task.status === 'todo'),
      'in-progress': this.state.tasks.filter(task => task.status === 'in-progress'),
      'review': this.state.tasks.filter(task => task.status === 'review'),
      'done': this.state.tasks.filter(task => task.status === 'done')
    };
    
    // Update task counts
    document.getElementById('todoCount').textContent = tasksByStatus['todo'].length;
    document.getElementById('progressCount').textContent = tasksByStatus['in-progress'].length;
    document.getElementById('reviewCount').textContent = tasksByStatus['review'].length;
    document.getElementById('doneCount').textContent = tasksByStatus['done'].length;
    
    // Populate kanban columns
    Object.keys(tasksByStatus).forEach(status => {
      const container = document.getElementById(`${status === 'in-progress' ? 'progress' : status}Tasks`);
      if (container) {
        container.innerHTML = tasksByStatus[status].map(task => this.createTaskCard(task)).join('');
      }
    });
  }
  
  createTaskCard(task) {
    const project = this.getProjectById(task.projectId);
    const urgency = this.getDeadlineUrgency(task.dueDate);
    
    return `
      <div class="task-card" data-task-id="${task.id}" draggable="true">
        <div class="task-header">
          <div class="task-title">${task.title}</div>
          <div class="task-priority priority-${task.priority}"></div>
        </div>
        <div class="task-description">${task.description}</div>
        <div class="task-meta">
          <div class="task-project">${project?.title || 'No Project'}</div>
          <div class="task-assignee">
            <div class="assignee-avatar">${task.assignee?.charAt(0) || 'U'}</div>
            <span>${task.assignee || 'Unassigned'}</span>
          </div>
        </div>
        <div class="task-footer">
          <div class="task-due ${urgency}">${this.formatDate(task.dueDate)}</div>
          <div class="task-actions">
            <button onclick="window.pmSystem.editTask(${task.id})" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="window.pmSystem.startTimer(${task.id})" title="Start Timer">
              <i class="fas fa-play"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  initializeSortable() {
    // Make kanban columns sortable
    const columns = document.querySelectorAll('.column-content');
    columns.forEach(column => {
      if (window.Sortable) {
        Sortable.create(column, {
          group: 'kanban',
          animation: 150,
          ghostClass: 'task-card-ghost',
          onEnd: (evt) => {
            this.handleTaskMove(evt);
          }
        });
      }
    });
  }
  
  handleTaskMove(evt) {
    const taskId = parseInt(evt.item.dataset.taskId);
    const newStatus = evt.to.id.replace('Tasks', '').replace('progress', 'in-progress');
    
    // Update task status
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      this.logActivity('task_moved', `Task moved to ${newStatus}`, task.assigneeId, task.id, task.projectId);
      this.showToast('Success', `Task moved to ${newStatus.replace('-', ' ')}`, 'success');
    }
    
    // Update counts
    this.loadKanbanBoard();
  }
  
  loadTeamSection() {
    if (!this.teamGrid) return;
    
    this.teamGrid.innerHTML = this.state.teamMembers.map(member => `
      <div class="team-member">
        <div class="member-avatar">${member.avatar}</div>
        <div class="member-info">
          <h3>${member.name}</h3>
          <p>${member.role}</p>
          <p>${member.email}</p>
        </div>
        <div class="member-stats">
          <div class="member-stat">
            <span class="stat-value">${member.tasksAssigned}</span>
            <span class="stat-label">Active Tasks</span>
          </div>
          <div class="member-stat">
            <span class="stat-value">${member.tasksCompleted}</span>
            <span class="stat-label">Completed</span>
          </div>
          <div class="member-stat">
            <span class="stat-value">${member.efficiency}%</span>
            <span class="stat-label">Efficiency</span>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  loadTimeTrackingSection() {
    this.updateCurrentTimer();
    this.loadTimeEntries();
  }
  
  updateCurrentTimer() {
    if (this.timer.isRunning) {
      const elapsed = Date.now() - this.timer.startTime + this.timer.elapsed;
      this.currentTime.textContent = this.formatDuration(elapsed);
      
      const task = this.state.tasks.find(t => t.id === this.timer.taskId);
      this.currentTask.textContent = task ? task.title : 'Unknown Task';
      
      this.pauseTimerBtn.disabled = false;
      this.stopTimerBtn.disabled = false;
    } else {
      this.currentTime.textContent = '00:00:00';
      this.currentTask.textContent = 'No active timer';
      this.pauseTimerBtn.disabled = true;
      this.stopTimerBtn.disabled = true;
    }
  }
  
  loadTimeEntries() {
    if (!this.timeEntriesList) return;
    
    const recentEntries = this.state.timeEntries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    
    this.timeEntriesList.innerHTML = recentEntries.map(entry => `
      <div class="time-entry">
        <div class="entry-info">
          <div class="entry-task">${entry.task}</div>
          <div class="entry-project">${entry.project}</div>
          <div class="entry-description">${entry.description}</div>
        </div>
        <div class="entry-time">
          <div class="entry-duration">${entry.duration}h</div>
          <div class="entry-date">${this.formatDate(entry.date)}</div>
        </div>
      </div>
    `).join('');
  }
  
  // Timer functionality
  startTimer(taskId) {
    if (this.timer.isRunning) {
      this.showToast('Warning', 'Please stop the current timer before starting a new one', 'warning');
      return;
    }
    
    this.timer.isRunning = true;
    this.timer.startTime = Date.now();
    this.timer.elapsed = 0;
    this.timer.taskId = taskId;
    
    this.timer.interval = setInterval(() => {
      this.updateCurrentTimer();
    }, 1000);
    
    this.logActivity('timer_started', 'Started timer', this.state.user.id, taskId);
    this.showToast('Success', 'Timer started successfully', 'success');
  }
  
  pauseTimer() {
    if (!this.timer.isRunning) return;
    
    this.timer.isRunning = false;
    this.timer.elapsed += Date.now() - this.timer.startTime;
    
    if (this.timer.interval) {
      clearInterval(this.timer.interval);
    }
    
    this.showToast('Info', 'Timer paused', 'info');
  }
  
  stopTimer() {
    if (!this.timer.isRunning && this.timer.elapsed === 0) return;
    
    const totalTime = this.timer.isRunning ? 
      this.timer.elapsed + (Date.now() - this.timer.startTime) : 
      this.timer.elapsed;
    
    const hours = totalTime / (1000 * 60 * 60);
    
    // Create time entry
    const task = this.state.tasks.find(t => t.id === this.timer.taskId);
    const project = this.getProjectById(task?.projectId);
    
    const timeEntry = {
      id: this.state.timeEntries.length + 1,
      taskId: this.timer.taskId,
      task: task?.title || 'Unknown Task',
      projectId: task?.projectId,
      project: project?.title || 'Unknown Project',
      userId: this.state.user.id,
      user: this.state.user.name,
      date: new Date(),
      duration: Math.round(hours * 100) / 100,
      description: `Timer session - ${this.formatDuration(totalTime)}`
    };
    
    this.state.timeEntries.push(timeEntry);
    
    // Reset timer
    this.timer.isRunning = false;
    this.timer.elapsed = 0;
    this.timer.taskId = null;
    
    if (this.timer.interval) {
      clearInterval(this.timer.interval);
    }
    
    this.updateCurrentTimer();
    this.logActivity('timer_stopped', `Logged ${timeEntry.duration} hours`, this.state.user.id, this.timer.taskId);
    this.showToast('Success', `Time logged: ${timeEntry.duration} hours`, 'success');
    
    if (this.state.currentSection === 'time-tracking') {
      this.loadTimeEntries();
    }
  }
  
  // Utility methods
  getProjectById(id) {
    return this.state.projects.find(project => project.id === id);
  }
  
  getDeadlineUrgency(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 3) return 'warning';
    return 'normal';
  }
  
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
  
  formatDuration(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  logActivity(type, description, userId, taskId = null, projectId = null) {
    const activity = {
      id: this.state.activities.length + 1,
      type,
      title: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description,
      userId,
      user: this.state.teamMembers.find(m => m.id === userId)?.name || 'Unknown',
      taskId,
      projectId,
      timestamp: new Date()
    };
    
    this.state.activities.unshift(activity);
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
        type: 'warning',
        title: 'Deadline Approaching',
        message: 'Payment Integration task due tomorrow',
        time: '2 hours ago'
      },
      {
        type: 'success',
        title: 'Task Completed',
        message: 'User Interface Design marked as complete',
        time: '4 hours ago'
      },
      {
        type: 'info',
        title: 'New Team Member',
        message: 'John Doe joined the E-Commerce Platform project',
        time: '1 day ago'
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
      <div class="modal-overlay" onclick="window.pmSystem.closeModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="window.pmSystem.closeModal()">
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
  
  showCreateProjectModal() {
    const form = `
      <form id="createProjectForm">
        <div class="form-group">
          <label for="projectTitle">Project Title</label>
          <input type="text" id="projectTitle" name="title" required>
        </div>
        <div class="form-group">
          <label for="projectDescription">Description</label>
          <textarea id="projectDescription" name="description" rows="3"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="projectStatus">Status</label>
            <select id="projectStatus" name="status" required>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <div class="form-group">
            <label for="projectPriority">Priority</label>
            <select id="projectPriority" name="priority" required>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="projectStartDate">Start Date</label>
            <input type="date" id="projectStartDate" name="startDate" required>
          </div>
          <div class="form-group">
            <label for="projectEndDate">End Date</label>
            <input type="date" id="projectEndDate" name="endDate" required>
          </div>
        </div>
        <div class="form-group">
          <label for="projectBudget">Budget ($)</label>
          <input type="number" id="projectBudget" name="budget" min="0">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline" onclick="window.pmSystem.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Project</button>
        </div>
      </form>
    `;
    
    this.showModal('Create New Project', form);
    
    document.getElementById('createProjectForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createProject(new FormData(e.target));
    });
  }
  
  createProject(formData) {
    const newProject = {
      id: this.state.projects.length + 1,
      title: formData.get('title'),
      description: formData.get('description'),
      status: formData.get('status'),
      priority: formData.get('priority'),
      startDate: new Date(formData.get('startDate')),
      endDate: new Date(formData.get('endDate')),
      budget: parseInt(formData.get('budget')) || 0,
      progress: 0,
      teamMembers: [this.state.user.id],
      tasks: [],
      client: 'New Client'
    };
    
    this.state.projects.push(newProject);
    this.closeModal();
    this.logActivity('project_created', `Created project: ${newProject.title}`, this.state.user.id, null, newProject.id);
    this.showToast('Success', `Project "${newProject.title}" created successfully!`, 'success');
    
    if (this.state.currentSection === 'projects') {
      this.loadProjectsSection();
    }
  }
  
  showStartTimerModal() {
    const availableTasks = this.state.tasks.filter(task => task.status !== 'done');
    
    const form = `
      <form id="startTimerForm">
        <div class="form-group">
          <label for="timerTask">Select Task</label>
          <select id="timerTask" name="taskId" required>
            <option value="">Choose a task...</option>
            ${availableTasks.map(task => 
              `<option value="${task.id}">${task.title} - ${this.getProjectById(task.projectId)?.title}</option>`
            ).join('')}
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline" onclick="window.pmSystem.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Start Timer</button>
        </div>
      </form>
    `;
    
    this.showModal('Start Time Tracking', form);
    
    document.getElementById('startTimerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const taskId = parseInt(e.target.taskId.value);
      this.closeModal();
      this.startTimer(taskId);
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pmSystem = new ProjectManagementSystem();
});

// Export for global access
window.ProjectManagementSystem = ProjectManagementSystem;