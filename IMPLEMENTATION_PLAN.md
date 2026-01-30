# GHARI: Collaborative Timetable Scheduling App
## Technical Design & Architecture Document

### Phase 1: Product Definition

**Overview**
GHARI is a productivity-first collaborative scheduling application designed with a Korean minimal aesthetic. It merges the traditional timetable with a circular "Sectograph" visualization to provide a more intuitive grasp of time distribution.

**Target Users**
- **Students**: Managing individual study blocks and group project timings.
- **Teams**: Synchronizing availability across timezones for focus sessions.
- **Families**: Coordinating shared chores and events.

**MVP Features**
- Firebase Auth (Google + Email).
- Personal & Shared Timetables.
- Real-time Firestore sync.
- 24-hour Sectograph visualization.
- Task management (CRUD).

**Advanced Features**
- Pomodoro Focus Timer with integrated task linking.
- Productivity Analytics (Heatmaps & Trends).
- Live "Presence" indicators for shared timetables.
- AI-based friction detection (overlapping schedules).

---

### Phase 2: Feature Breakdown & Modules

- **Auth Module**: Handles session persistence and user profiling.
- **Timetable Engine**: The logic layer that sorts tasks by time and handles conflict detection.
- **Sectograph Visualization**: SVG-based dynamic rendering of the 24-hour cycle.
- **Collaboration Logic**: Permission-based (Owner/Editor/Viewer) real-time data streaming.
- **Pomodoro Timer**: Background-ready focus engine with session logging.
- **Notification Service**: Local reminders for upcoming tasks + FCM for shared updates.

---

### Phase 3: UI/UX System (Korean Minimal Aesthetic)

**Design Tokens**
- **Colors (Pastel Palette)**:
  - Background: `#FCFBF7` (Soft Cream)
  - Primary: `#B8C5E1` (Muted Periwinkle)
  - Secondary: `#FFD6BA` (Creamy Peach)
  - Accent: `#C9E4DE` (Mint Foam)
  - Text: `#333333` (Soft Charcoal)
- **Typography**: Inter (Body), Outfit (Headings).
- **Glassmorphism**: 15% opacity backgrounds with `BlurView` for cards.

**Screen Wireframe Concepts**
1. **Home (Sectograph)**: Large circular center, task list below, active Pomodoro pill at the top.
2. **Timetable View**: Weekly grid with vertical scrolling, drag-to-reschedule.
3. **Collaboration Hub**: List of shared timetables with "Who's focusing now" indicators.
4. **Analytics**: Minimalist line graphs and a "Focus Garden" heatmap.

---

### Phase 4: Technical Architecture

#### Frontend (Expo React Native)
- **Navigation**: Expo Router (File-based).
- **State Management**: `zustand` for lightweight global state (Auth, Theme).
- **Animations**: `react-native-reanimated` for smooth arc transitions.
- **SVG**: `react-native-svg` + `d3-shape`.

#### Backend (Firebase)
- **Firestore**: Real-time database.
- **Cloud Functions**: Auto-cleanup of expired sessions, daily recap emails.
- **FCM**: Push notifications for "Task starting in 5 mins".

---

### Phase 5: Database Schema (Firestore)

```typescript
// collections/users/{userId}
{
  uid: string;
  email: string;
  name: string;
  avatar: string;
  settings: {
    theme: 'light' | 'dark';
    pomodoro: { focus: 25, break: 5 };
  }
}

// collections/timetables/{timetableId}
{
  name: string;
  ownerId: string;
  members: { [userId: string]: 'owner' | 'editor' | 'viewer' };
  createdAt: timestamp;
  colorScheme: string[];
}

// collections/timetables/{timetableId}/tasks/{taskId}
{
  title: string;
  description: string;
  startTime: timestamp; // ISO or Firestore Timestamp
  endTime: timestamp;
  category: 'work' | 'study' | 'rest' | 'custom';
  status: 'pending' | 'completed';
  assignedTo: string[];
}

// collections/analytics/{userId}
{
  dailyFocusMinutes: { [date: string]: number };
  categoryDistribution: { [category: string]: number };
}
```

---

### Phase 6: Sectograph Engine Logic

**Coordinate System**
- Circle center: `(cx, cy)`
- Radius: `R`
- Hour to Angle: One hour = `360 / 24 = 15 degrees`.
- Start Angle for Task: `(hour * 15) - 90` (Offset to start at top).

**Interaction**
- **Gesture Handler**: Detect tap location -> convert `(x, y)` to angle -> find corresponding task in the task array.

---

### Phase 7: Real-time Collaboration Logic

- **Firestore Listeners**: `onSnapshot` on the specific `timetableId` tasks sub-collection.
- **Conflict Resolution**: "Last write wins" for basic MVP; operational transforms or locking for advanced.
- **Presence**: Update `lastActive` in `timetables/{id}/members/{uid}` every 30s.

---

### Phase 8: Optimization & Scalability

- **Memoization**: `React.memo` for individual Sectograph segments.
- **Batch Updates**: Use `writeBatch` for bulk task movements.
- **Indexing**: Composite indexes in Firestore for `startTime` and `timetableId`.
- **Lazy Loading**: Only load tasks for the current visible 48-hour window.

---

### Phase 9: Folder Structure

```
/
├── app/                  # Expo Router screens
├── src/
│   ├── components/
│   │   ├── sectograph/   # SVG & Arc components
│   │   ├── common/       # Buttons, Cards (Korean Aesthetic)
│   │   └── pomodoro/
│   ├── hooks/            # useFirestore, useTimer, useCollaboration
│   ├── services/         # firebase.js, notification.js
│   ├── store/            # zustand state
│   ├── utils/            # time-math, sectograph-calc
│   └── constants/        # theme, dummyData
├── functions/            # Firebase Cloud Functions
└── assets/               # Fonts (Outfit/Inter), Icons
```
