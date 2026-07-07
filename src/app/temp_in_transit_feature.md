# In-Transit Trip Dashboard Feature

## Overview
Added a prominent "In Transit Trip" card at the top of the dashboard to help users quickly see and navigate to their active trip. When clicked, it opens the detailed trip view page showing comprehensive trip information including tracking, permits, driver details, and more.

## Components Created/Modified

### 1. InTransitTripCard.tsx (New Component)
**Location:** `/components/InTransitTripCard.tsx`

**Features:**
- Gradient blue background for visual prominence
- Active status badge (green)
- Route visualization with origin/destination
- Current location tracking
- Progress bar showing trip completion percentage
- ETA to next stop
- Driver and pilot car assignments
- "View Details" button for navigation

**Props:**
```typescript
interface InTransitTripCardProps {
  trip: {
    requestId: string;
    origin: string;
    destination: string;
    driver: string;
    tracking?: {
      status: string;
      currentLocation: string;
      nextStop: string;
      eta: string;
      progress: number;
      distanceRemaining: string;
    };
    pilotCarAssignments?: {
      leadPilot?: string;
      chasePilot?: string;
    };
  };
  onViewDetails: () => void;
}
```

### 2. DashboardOverview.tsx (Updated)
**Location:** `/components/DashboardOverview.tsx`

**Changes:**
- Imported InTransitTripCard component
- Added mock in-transit trip data (display data)
- Added full trip data structure matching the Permit interface for navigation
- Positioned InTransitTripCard at the top of the dashboard (first element after header)
- Wired up navigation to 'view-permit-request' screen with complete trip data as parameter
- Conditional rendering - only shows the card when `fullTripData.status === 'In Transit'`
- Updated `onNavigate` prop type to accept optional data parameter

## Navigation Flow

1. **Dashboard Display:**
   - Shows InTransitTripCard with summary information (trip ID, route, current location, progress)
   
2. **Click "View Details" Button:**
   - Triggers `onNavigate('view-permit-request', fullTripData)`
   - Passes complete trip/permit data including all states, tracking, driver, truck, trailer, and load details
   
3. **ViewPermitRequest Component:**
   - Receives the full trip data as `permit` prop
   - Displays comprehensive trip details with tabs for:
     - Live Tracking (with map)
     - Trip Details (driver, truck, trailer, load)
     - Permits (all state permits)
     - Pilot Car Jobs
     - Time Tracking
     - Route Survey
     - Documents
   
4. **Back Navigation:**
   - User can navigate back to dashboard using the back button in ViewPermitRequest

## Data Structure

### Display Data (for card)
```typescript
const inTransitTrip = {
  requestId: 'REQ-1001',
  origin: 'New York, NY',
  destination: 'Miami, FL',
  driver: 'John Doe',
  tracking: {
    status: 'In Transit',
    currentLocation: 'Richmond, VA (I-95 South)',
    nextStop: 'Florence, SC',
    eta: '5h 30m',
    progress: 35,
    distanceRemaining: '450 miles',
    speed: '62 mph'
  },
  pilotCarAssignments: {
    leadPilot: 'John Smith',
    chasePilot: 'Alice Johnson'
  }
};
```

### Full Trip Data (for navigation)
Complete Permit structure matching ManageTrips interface including:
- Basic info (id, requestId, permitNumber, dates)
- All state permits array
- Truck details
- Trailer details
- Driver details
- Load details
- Route details
- Tracking details with live location
- Pilot car assignments

## Visual Features

### Color Scheme
- **Background:** Gradient from blue-50 to blue-100/50
- **Border:** blue-200
- **Icon Background:** blue-600
- **Status Badge:** green-500 (Active)
- **Progress Bar:** blue-600 indicator on blue-100 background

### Layout Structure
```
┌─────────────────────────────────────────┐
│ [Icon] Trip in Transit    [View Details]│
│        REQ-1001                          │
├─────────────────────────────────────────┤
│ From: New York, NY                      │
│ To: Miami, FL                           │
├─────────────────────────────────────────┤
│ Current: Richmond, VA    ETA: 5h 30m    │
│ Progress: 35% • 450 miles remaining     │
│ ████████░░░░░░░░░░░░░░░░░                │
├─────────────────────────────────────────┤
│ Driver: John Doe                        │
│ Pilot Cars: John Smith, Alice Johnson   │
└─────────────────────────────────────────┘
```

## Data Flow

1. **Dashboard loads** → Checks for in-transit trips
2. **Mock data** → Currently uses hardcoded trip data (REQ-1001)
3. **User clicks "View Details"** → Navigates to 'view-permit-request' screen
4. **Future enhancement** → Can fetch real-time data from API

## Integration Points

### Current Implementation
- Mock data in DashboardOverview component
- Navigation to 'view-permit-request' screen
- Compatible with existing trip data structure from ManageTrips

### Future Enhancements
- Fetch real in-transit trips from API
- Real-time location updates
- Multiple in-transit trips support
- Direct navigation to specific trip details
- Live ETA calculations
- Map integration

## Mobile Responsive
- Card adapts to mobile screen sizes
- Information stacks appropriately
- Touch-friendly "View Details" button
- Truncates long location names

## Accessibility
- Semantic HTML structure
- Icon + text labels
- Sufficient color contrast
- Keyboard navigation support via Button component

## Usage Example

```tsx
<InTransitTripCard 
  trip={{
    requestId: 'REQ-1001',
    origin: 'New York, NY',
    destination: 'Miami, FL',
    driver: 'John Doe',
    tracking: {
      status: 'In Transit',
      currentLocation: 'Richmond, VA (I-95 South)',
      nextStop: 'Florence, SC',
      eta: '5h 30m',
      progress: 35,
      distanceRemaining: '450 miles',
      speed: '62 mph'
    },
    pilotCarAssignments: {
      leadPilot: 'John Smith',
      chasePilot: 'Alice Johnson'
    }
  }}
  onViewDetails={() => navigate('trip-details')}
/>
```