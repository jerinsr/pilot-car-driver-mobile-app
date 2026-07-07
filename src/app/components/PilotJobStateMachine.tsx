/**
 * Pilot Car Job State Machine
 * 
 * This module defines the job state transitions and validation rules
 * for the Pilot Car mobile workflow that responds to Truck Driver jurisdiction activation.
 * 
 * State Flow:
 * 1. upcoming → (Truck Driver activates jurisdiction) → awaiting-acceptance
 * 2. awaiting-acceptance → (Pilot accepts) → accepted
 * 3. accepted → (Pilot starts job) → in-progress [BILLING STARTS]
 * 4. in-progress → (Pilot completes) → completed [BILLING STOPS]
 * 
 * Critical Rules:
 * - Billing ONLY starts when pilot explicitly clicks "Start Job"
 * - Accepting a job does NOT start billing
 * - Cannot skip states
 * - Cannot start job before jurisdiction is activated by truck driver
 */

export type PilotJobState = 
  | 'upcoming'              // Job assigned but jurisdiction not yet activated by truck driver
  | 'awaiting-acceptance'   // Jurisdiction activated by truck driver, waiting for pilot to accept
  | 'accepted'              // Pilot accepted but hasn't started billing yet
  | 'in-progress'           // Job started, billing active
  | 'completed';            // Job completed, billing stopped

export type PilotJobType = 'Route Survey' | 'Convoy';

export interface JurisdictionInfo {
  state: string;
  code: string;
  activatedAt?: string;
  activatedBy?: string; // Truck driver who activated
  completedAt?: string;
}

export interface TimeTracking {
  acceptedAt?: string;      // When pilot accepted the job
  startedAt?: string;       // When billing started (Start Job clicked)
  completedAt?: string;     // When job was completed
  breaks: BreakEntry[];
  waitingTime: WaitingEntry[];
  activeBreak?: ActiveBreak | null;
  activeWaiting?: ActiveWaiting | null;
}

export interface BreakEntry {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  notes?: string;
}

export interface WaitingEntry {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  reason: string;
  notes?: string;
}

export interface ActiveBreak {
  startTime: string;
}

export interface ActiveWaiting {
  startTime: string;
  reason: string;
}

export interface PilotJob {
  // Identifiers
  id: string;
  requestId: string;
  tripId: string;
  
  // Job Information
  jobTitle: string;
  jobType: PilotJobType;
  position: 'Lead' | 'Chase' | 'Front' | 'Rear';
  
  // Route Information
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  distance: string;
  
  // Load Information
  loadType: string;
  loadSummary?: string;
  commodityType?: string;
  loadDimensions?: {
    length: string;
    width: string;
    height: string;
    weight: string;
  };
  
  // State Management
  status: PilotJobState;
  jurisdiction: JurisdictionInfo;
  
  // Time Tracking & Billing
  timeTracking?: TimeTracking;
  billingActive: boolean;
  
  // Company & Payment
  requestingCompany: string;
  assignedPay: string;
  
  // Requirements
  routeSurveyRequired?: boolean;
  routeSurveyStatus?: 'not-started' | 'in-progress' | 'completed';
  heightPoleRequired?: boolean;
  policeEscortRequired?: boolean;
  specialPermitsRequired?: boolean;
  specialInstructions?: string;
  
  // Attachments
  attachments?: {
    name: string;
    url: string;
    type: 'map' | 'permit' | 'photo';
  }[];
  
  // Metadata
  assignedDate: string;
  vehicleType?: string;
}

/**
 * State Transition Validation
 */
export class PilotJobStateValidator {
  
  /**
   * Check if job can transition to awaiting-acceptance
   * Requires: Truck driver has activated jurisdiction
   */
  static canTransitionToAwaitingAcceptance(job: PilotJob): { allowed: boolean; reason?: string } {
    if (job.status !== 'upcoming') {
      return { allowed: false, reason: 'Job must be in upcoming state' };
    }
    
    if (!job.jurisdiction.activatedAt) {
      return { allowed: false, reason: 'Jurisdiction not yet activated by truck driver' };
    }
    
    return { allowed: true };
  }
  
  /**
   * Check if pilot can accept the job
   * Requires: Job is in awaiting-acceptance state
   */
  static canAcceptJob(job: PilotJob): { allowed: boolean; reason?: string } {
    if (job.status !== 'awaiting-acceptance') {
      return { allowed: false, reason: 'Job must be awaiting acceptance' };
    }
    
    return { allowed: true };
  }
  
  /**
   * Check if pilot can start the job (start billing)
   * Requires: Job is accepted, not already in progress
   */
  static canStartJob(job: PilotJob): { allowed: boolean; reason?: string } {
    if (job.status !== 'accepted') {
      return { allowed: false, reason: 'Job must be accepted before starting' };
    }
    
    if (!job.timeTracking?.acceptedAt) {
      return { allowed: false, reason: 'Job must be accepted first' };
    }
    
    if (job.billingActive) {
      return { allowed: false, reason: 'Billing already active' };
    }
    
    return { allowed: true };
  }
  
  /**
   * Check if pilot can complete the job (stop billing)
   * Requires: Job is in progress
   */
  static canCompleteJob(job: PilotJob): { allowed: boolean; reason?: string } {
    if (job.status !== 'in-progress') {
      return { allowed: false, reason: 'Job must be in progress to complete' };
    }
    
    if (!job.timeTracking?.startedAt) {
      return { allowed: false, reason: 'Job has no start time' };
    }
    
    // Check for active break or waiting time
    if (job.timeTracking.activeBreak) {
      return { allowed: false, reason: 'Must end active break before completing job' };
    }
    
    if (job.timeTracking.activeWaiting) {
      return { allowed: false, reason: 'Must end active waiting time before completing job' };
    }
    
    return { allowed: true };
  }
  
  /**
   * Check if pilot can add waiting time
   * Requires: Job is in progress
   */
  static canAddWaitingTime(job: PilotJob): { allowed: boolean; reason?: string } {
    if (job.status !== 'in-progress') {
      return { allowed: false, reason: 'Job must be in progress to log waiting time' };
    }
    
    if (!job.billingActive) {
      return { allowed: false, reason: 'Billing must be active to log waiting time' };
    }
    
    return { allowed: true };
  }
  
  /**
   * Check if pilot can add break
   * Requires: Job is in progress (optional, configurable per company policy)
   */
  static canAddBreak(job: PilotJob): { allowed: boolean; reason?: string } {
    if (job.status !== 'in-progress') {
      return { allowed: false, reason: 'Job must be in progress to take a break' };
    }
    
    return { allowed: true };
  }
  
  /**
   * Force complete job if truck driver completes jurisdiction first
   */
  static shouldForceComplete(job: PilotJob, jurisdictionCompletedByDriver: boolean): boolean {
    return jurisdictionCompletedByDriver && 
           (job.status === 'in-progress' || job.status === 'accepted');
  }
}

/**
 * State Transition Actions
 */
export class PilotJobStateActions {
  
  /**
   * Transition job to awaiting-acceptance when truck driver activates jurisdiction
   */
  static notifyJurisdictionActivated(
    job: PilotJob, 
    activatedBy: string, 
    activatedAt: string
  ): PilotJob {
    return {
      ...job,
      status: 'awaiting-acceptance',
      jurisdiction: {
        ...job.jurisdiction,
        activatedAt,
        activatedBy
      }
    };
  }
  
  /**
   * Accept job (does NOT start billing)
   */
  static acceptJob(job: PilotJob, acceptedAt: string): PilotJob {
    return {
      ...job,
      status: 'accepted',
      timeTracking: {
        ...job.timeTracking,
        acceptedAt,
        breaks: job.timeTracking?.breaks || [],
        waitingTime: job.timeTracking?.waitingTime || []
      },
      billingActive: false // Explicitly set to false
    };
  }
  
  /**
   * Start job (START BILLING)
   */
  static startJob(job: PilotJob, startedAt: string): PilotJob {
    return {
      ...job,
      status: 'in-progress',
      timeTracking: {
        ...job.timeTracking!,
        startedAt
      },
      billingActive: true // START BILLING
    };
  }
  
  /**
   * Complete job (STOP BILLING)
   */
  static completeJob(job: PilotJob, completedAt: string): PilotJob {
    return {
      ...job,
      status: 'completed',
      timeTracking: {
        ...job.timeTracking!,
        completedAt
      },
      billingActive: false, // STOP BILLING
      jurisdiction: {
        ...job.jurisdiction,
        completedAt
      }
    };
  }
  
  /**
   * Force complete job when truck driver completes jurisdiction first
   */
  static forceCompleteJob(job: PilotJob, completedAt: string): PilotJob {
    return {
      ...job,
      status: 'completed',
      timeTracking: {
        ...job.timeTracking!,
        completedAt,
        // Close any active breaks or waiting time
        activeBreak: null,
        activeWaiting: null
      },
      billingActive: false,
      jurisdiction: {
        ...job.jurisdiction,
        completedAt
      }
    };
  }
  
  /**
   * Start waiting time
   */
  static startWaitingTime(job: PilotJob, reason: string, startTime: string): PilotJob {
    return {
      ...job,
      timeTracking: {
        ...job.timeTracking!,
        activeWaiting: { startTime, reason }
      }
    };
  }
  
  /**
   * End waiting time
   */
  static endWaitingTime(job: PilotJob, endTime: string, notes?: string): PilotJob {
    if (!job.timeTracking?.activeWaiting) return job;
    
    const startTime = new Date(job.timeTracking.activeWaiting.startTime);
    const end = new Date(endTime);
    const duration = Math.floor((end.getTime() - startTime.getTime()) / (1000 * 60));
    
    const waitingEntry: WaitingEntry = {
      id: `wait-${Date.now()}`,
      startTime: job.timeTracking.activeWaiting.startTime,
      endTime,
      duration,
      reason: job.timeTracking.activeWaiting.reason,
      notes
    };
    
    return {
      ...job,
      timeTracking: {
        ...job.timeTracking,
        activeWaiting: null,
        waitingTime: [...job.timeTracking.waitingTime, waitingEntry]
      }
    };
  }
  
  /**
   * Start break
   */
  static startBreak(job: PilotJob, startTime: string): PilotJob {
    return {
      ...job,
      timeTracking: {
        ...job.timeTracking!,
        activeBreak: { startTime }
      }
    };
  }
  
  /**
   * End break
   */
  static endBreak(job: PilotJob, endTime: string, notes?: string): PilotJob {
    if (!job.timeTracking?.activeBreak) return job;
    
    const startTime = new Date(job.timeTracking.activeBreak.startTime);
    const end = new Date(endTime);
    const duration = Math.floor((end.getTime() - startTime.getTime()) / (1000 * 60));
    
    const breakEntry: BreakEntry = {
      id: `break-${Date.now()}`,
      startTime: job.timeTracking.activeBreak.startTime,
      endTime,
      duration,
      notes
    };
    
    return {
      ...job,
      timeTracking: {
        ...job.timeTracking,
        activeBreak: null,
        breaks: [...job.timeTracking.breaks, breakEntry]
      }
    };
  }
}

/**
 * Notification Messages
 */
export class PilotJobNotifications {
  
  static jurisdictionActivated(jurisdiction: string): string {
    return `Jurisdiction ${jurisdiction} is now active. Please begin escort.`;
  }
  
  static jurisdictionCompletedByDriver(jurisdiction: string): string {
    return `Jurisdiction ${jurisdiction} completed by truck driver.`;
  }
  
  static tripCancelled(tripId: string): string {
    return `Trip ${tripId} has been cancelled.`;
  }
}

/**
 * Calculate elapsed time for active jobs
 */
export function calculateElapsedTime(startTime: string): string {
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate total billable time (excluding breaks if configured)
 */
export function calculateBillableTime(job: PilotJob, includeBreaks: boolean = false): number {
  if (!job.timeTracking?.startedAt || !job.timeTracking?.completedAt) {
    return 0;
  }
  
  const start = new Date(job.timeTracking.startedAt);
  const end = new Date(job.timeTracking.completedAt);
  let totalMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  
  // Subtract break time if not included in billing
  if (!includeBreaks) {
    const breakTime = job.timeTracking.breaks.reduce((sum, b) => sum + b.duration, 0);
    totalMinutes -= breakTime;
  }
  
  return totalMinutes;
}

/**
 * Get status display information
 */
export function getStatusDisplay(status: PilotJobState): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  switch (status) {
    case 'upcoming':
      return {
        label: 'Upcoming',
        color: 'text-[#1E88E5]',
        bgColor: 'bg-[#E3F2FD]',
        borderColor: 'border-[#BBDEFB]'
      };
    case 'awaiting-acceptance':
      return {
        label: 'Awaiting Acceptance',
        color: 'text-[#6A1B9A]',
        bgColor: 'bg-[#F3E5F5]',
        borderColor: 'border-[#E1BEE7]'
      };
    case 'accepted':
      return {
        label: 'Accepted',
        color: 'text-[#6A1B9A]',
        bgColor: 'bg-[#F3E5F5]',
        borderColor: 'border-[#E1BEE7]'
      };
    case 'in-progress':
      return {
        label: 'In Progress',
        color: 'text-[#C2410C]',
        bgColor: 'bg-[#FFF3E0]',
        borderColor: 'border-[#FFE0B2]'
      };
    case 'completed':
      return {
        label: 'Completed',
        color: 'text-[#2E7D32]',
        bgColor: 'bg-[#E8F5E9]',
        borderColor: 'border-[#C8E6C9]'
      };
  }
}