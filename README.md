# Phase Manager App

A modular React Native application for managing multiple phases and sections with role-based access control, task management, and progress tracking.

## Overview

Phase Manager is a comprehensive project management system built with React Native and Expo, inspired by enterprise-level management systems. It provides role-based dashboards, phase organization, task tracking, and progress monitoring.

## Architecture

### Core Structure

```
src/
├── context/               # Global state management
│   ├── AuthContext.js    # User authentication & roles
│   └── AppDataContext.js # App data & phases management
├── screens/              # UI screens
│   ├── LoginScreen.js
│   ├── DashboardScreen.js
│   ├── PlanningScreen.js
│   ├── ExecutionScreen.js
│   ├── MonitoringScreen.js
│   ├── PhaseDetailScreen.js
│   └── TaskDetailScreen.js
├── services/             # Business logic & data
│   └── dataRepository.js # AsyncStorage CRUD operations
├── data/                 # Data models & seeding
│   └── seedData.js      # Initial data seed
└── navigation/          # Navigation configuration
    └── RootNavigator.js # Tab & stack navigation
```

## Key Features

### 1. **Role-Based Access Control**

Four user roles with different permissions:

- **Administrator**: Full access to all phases and sections
- **Manager**: Access to Planning, Execution, and Monitoring phases
- **Coordinator**: Access to Execution and Monitoring phases only
- **Viewer**: Read-only access to Monitoring phase

### 2. **Phase Organization**

Phases are organized into three main sections:

- **Planning Phase**: Define objectives, scope, and resources
- **Execution Phase**: Implement and deliver projects
- **Monitoring Phase**: Track progress and evaluate results

Each phase contains:
- Status (active, pending, completed)
- Progress percentage
- Task list
- Owner information
- Timeline (start/end dates)

### 3. **Task Management**

Tasks within phases provide:
- Task title and description
- Priority levels (low, medium, high)
- Assignment tracking
- Status management (pending, in_progress, completed)
- Due dates
- Audit trail (created/updated timestamps)

### 4. **Dashboard Overview**

The main dashboard provides:
- Total phases and tasks count
- Overall progress percentage
- Active phase count
- Quick access to all phases
- Role-specific filtering

### 5. **Data Persistence**

All data persists using AsyncStorage:
- Single normalized data store
- Automatic initialization on first launch
- CRUD operations through data repository
- No backend required (frontend demo)

## Usage

### Installation

```bash
npm install
# or
npm ci
```

### Running the App

```bash
# Development mode with Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Build for web
npm run web
```

### Navigation Structure

```
RootNavigator
├── LoginScreen (Auth)
└── AppNavigator (Authenticated)
    ├── Dashboard
    │   ├── DashboardScreen
    │   ├── PhaseDetailScreen
    │   └── TaskDetailScreen
    ├── Planning
    │   ├── PlanningScreen
    │   ├── PhaseDetailScreen
    │   └── TaskDetailScreen
    ├── Execution
    │   ├── ExecutionScreen
    │   ├── PhaseDetailScreen
    │   └── TaskDetailScreen
    └── Monitoring
        ├── MonitoringScreen
        ├── PhaseDetailScreen
        └── TaskDetailScreen
```

## Context & Hooks

### AuthContext

Manages user authentication and roles:

```javascript
const { user, role, login, logout, isAuthenticated } = useAuth();
```

**Methods:**
- `login(userId, userRole, userData)` - Authenticate user
- `logout()` - Clear authentication
- `isAuthenticated` - Check auth status

### AppDataContext

Manages all application data:

```javascript
const { appData, loading, addPhase, updatePhase, deletePhase } = useAppData();
```

**Methods:**
- `addPhase(phaseData)` - Create new phase
- `updatePhase(phaseId, updates)` - Update phase
- `deletePhase(phaseId)` - Delete phase

## Data Repository API

The `dataRepository.js` service provides:

### Initialization
- `initializeAppData()` - Initialize app on first launch

### Data Operations
- `loadAppData()` - Load from AsyncStorage
- `saveAppData(data)` - Save to AsyncStorage
- `clearAppData()` - Clear all data

### Query Functions
- `getPhasesByRole(appData, userRole)` - Filter phases by role
- `getTasksByPhase(appData, phaseId)` - Get all tasks in phase

### Phase Operations
- `addTaskToPhase(appData, phaseId, taskData)` - Add task
- `updateTaskStatus(appData, phaseId, taskId, status)` - Update task

## Seed Data

Initial app data includes:

### Phases (4 total)
1. **Planning Phase** (65% progress) - 2 tasks
2. **Execution Phase** (45% progress) - 2 tasks
3. **Testing Phase** (0% progress) - 1 task
4. **Deployment Phase** (0% progress) - 0 tasks

### Sections (3 total)
- Planning
- Execution
- Monitoring

## Styling

The app uses consistent color scheme and typography:

- **Primary Colors**:
  - Planning: #3B82F6 (Blue)
  - Execution: #10B981 (Green)
  - Monitoring: #F59E0B (Amber)
  - Admin: #1F2937 (Dark)

- **Semantic Colors**:
  - Success: #DCFCE7 (Light Green)
  - Warning: #FEF3C7 (Light Amber)
  - Info: #DBEAFE (Light Blue)
  - Error: #FEE2E2 (Light Red)

## State Management Flow

```
User Login
    ↓
AuthContext sets role
    ↓
AppDataContext loads data
    ↓
RoleBasedFiltering applied
    ↓
Screen renders role-specific content
```

## Future Enhancements

- Backend API integration
- Real authentication
- Real-time collaboration
- Calendar integration
- File attachments
- Comments and discussions
- Notification system
- Analytics & reporting

## Demo Credentials

For demo purposes, use any email:
- Email: `user@example.com`
- Role: Select from dropdown (admin, manager, coordinator, viewer)

## Dependencies

- **React Native** 0.76.5
- **Expo** 52.0.0
- **React Navigation** 6.x
- **AsyncStorage** 1.23.1

## License

Proprietary - All rights reserved
