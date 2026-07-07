import { useState } from 'react';
import ProfileOverview from './components/ProfileOverview';
import SecurityAccount from './components/SecurityAccount';
import AppPreferences from './components/AppPreferences';
import Support from './components/Support';
import ResetPassword from './components/ResetPassword';
import TwoFactorAuth from './components/TwoFactorAuth';
import HelpCenter from './components/HelpCenter';
import ContactSupport from './components/ContactSupport';
import NotificationHistory from './components/NotificationHistory';
import Notifications from './components/Notifications';
import DashboardOverview from './components/DashboardOverview';
import AppSidebar from './components/AppSidebar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './components/ui/alert-dialog';
import { Home, Briefcase, ClipboardList, Navigation, UserCircle } from 'lucide-react';
import PilotCarJobBoard from './components/PilotCarJobBoard';
import ActiveJobScreen from './components/ActiveJobScreen';
import { ActiveTimerIndicator, TimerState } from './components/ActiveTimerIndicator';
import { AssignedJob } from './components/AssignedJobCard';
import { ProfileScreen } from './components/ProfileScreen';
import { PersonalInformation } from './components/PersonalInformation';
import { SecurityPrivacy } from './components/SecurityPrivacy';
import { CertificationsPage } from './components/CertificationsPage';
import { DocumentsPage } from './components/DocumentsPage';
import { PerformancePage } from './components/PerformancePage';
import { HelpCenterPage } from './components/HelpCenterPage';
import { ContactSupportPage } from './components/ContactSupportPage';

type Screen = 'overview' | 'security' | 'preferences' | 'support' | 'reset-password' | '2fa' | 'help-center' | 'contact-support' | 'notifications' | 'dashboard' | 'browse-jobs' | 'my-jobs' | 'active-job' | 'profile' | 'personal-info' | 'security-privacy' | 'certifications' | 'documents' | 'performance' | 'help-center-page' | 'contact-support-page';

function BottomNav({ currentScreen, onNavigate, hasActiveJob }: { currentScreen: Screen, onNavigate: (screen: Screen) => void, hasActiveJob: boolean }) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home', screen: 'dashboard' as Screen },
    { id: 'myjobs' as const, icon: ClipboardList, label: 'My Jobs', screen: 'my-jobs' as Screen },
    ...(hasActiveJob ? [{ id: 'active' as const, icon: Navigation, label: 'Active Job', screen: 'active-job' as Screen }] : []),
  ];

  return (
    <div className="bg-white border-t border-gray-200 flex items-center justify-around px-4 w-full z-30 max-w-[450px] mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.screen;
        const isActiveJob = item.id === 'active';
        
        return (
          <button
            key={item.id}
            className={`relative flex flex-col items-center gap-2 py-3 transition-colors duration-200 ${
              isActive 
                ? isActiveJob ? 'text-[#f89823]' : 'text-[#155DFC]'
                : isActiveJob ? 'text-[#f89823]/70' : 'text-[#99A1AF] hover:text-gray-700'
            }`}
            onClick={() => onNavigate(item.screen)}
          >
            {isActive && (
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${isActiveJob ? 'bg-[#f89823]' : 'bg-[#155DFC]'}`} />
            )}
            <div className="relative">
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2]' : 'stroke-[1.5]'}`} />
              {isActiveJob && !isActive && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#f89823] rounded-full animate-pulse" />
              )}
            </div>
            <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('my-jobs');
  const [selectedPermit, setSelectedPermit] = useState<any>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // User role - set to 'pilot-car-driver' for pilot car driver view
  const [userRole] = useState<'dispatcher' | 'pilot-car-driver'>('pilot-car-driver');
  
  // Global timer state for break/waiting time
  const [activeTimer, setActiveTimer] = useState<TimerState | null>(null);
  
  // Active job state for the dedicated Active Job screen
  const [activeJob, setActiveJob] = useState<AssignedJob | null>(null);

  const handleNavigate = (screen: string, params?: any) => {
    if (params) {
      setSelectedPermit(params);
    }
    setCurrentScreen(screen as Screen);
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(false);
  };
  
  const handleStopTimer = () => {
    setActiveTimer(null);
  };
  
  const handleTimerClick = () => {
    if (activeJob) {
      setCurrentScreen('active-job');
    } else {
      setCurrentScreen('my-jobs');
    }
  };

  // Called when a job transitions to in-progress (Start Job)
  const handleJobStarted = (job: AssignedJob) => {
    setActiveJob(job);
    setCurrentScreen('active-job');
  };

  // Called when active job is updated (break/waiting time added)
  const handleActiveJobUpdate = (job: AssignedJob) => {
    setActiveJob(job);
  };

  // Called when active job is completed
  const handleActiveJobComplete = (job: AssignedJob) => {
    setActiveJob(null);
    setActiveTimer(null);
    setCurrentScreen('my-jobs');
  };

  // Define screens where footer should be hidden
  const hideFooterScreens: Screen[] = [
    'active-job', 
    'reset-password', 
    '2fa', 
    'help-center', 
    'contact-support', 
    'notifications', 
    'overview', 
    'security', 
    'preferences', 
    'support', 
    'profile',
    'personal-info',
    'security-privacy',
    'certifications',
    'documents',
    'performance',
    'help-center-page',
    'contact-support-page'
  ];
  const showFooter = !hideFooterScreens.includes(currentScreen);

  return (
    <div className="bg-background flex flex-col items-center relative h-[100dvh] max-w-[450px] mx-auto">
      {/* Global Timer Indicator */}
      <ActiveTimerIndicator 
        timerState={activeTimer}
        onStop={handleStopTimer}
        onClick={handleTimerClick}
      />
      
      <div className="flex-1 flex flex-col w-full overflow-y-auto">
        {currentScreen === 'dashboard' && (
          <DashboardOverview 
            onToggleSidebar={() => setIsSidebarOpen(true)} 
            onNavigate={handleNavigate}
            hasActiveJob={!!activeJob}
          />
        )}
        
        {currentScreen === 'browse-jobs' && (
          <PilotCarJobBoard 
            activeTimer={activeTimer}
            onStartTimer={setActiveTimer}
            onStopTimer={handleStopTimer}
            initialViewMode="marketplace"
            onJobStarted={handleJobStarted}
            onProfileClick={() => setCurrentScreen('profile')}
          />
        )}
        
        {currentScreen === 'my-jobs' && (
          <PilotCarJobBoard 
            activeTimer={activeTimer}
            onStartTimer={setActiveTimer}
            onStopTimer={handleStopTimer}
            initialViewMode="assigned"
            onJobStarted={handleJobStarted}
            initialJobId={selectedPermit?.openJobId || "PC-010"}
            onProfileClick={() => setCurrentScreen('profile')}
          />
        )}
        
        {currentScreen === 'active-job' && (
          <ActiveJobScreen
            job={activeJob!}
            onBack={() => setCurrentScreen('my-jobs')}
            onJobComplete={handleActiveJobComplete}
            onJobUpdate={handleActiveJobUpdate}
            activeTimer={activeTimer}
            onStartTimer={setActiveTimer}
            onStopTimer={handleStopTimer}
          />
        )}

        {currentScreen === 'overview' && <ProfileOverview onNavigate={setCurrentScreen} onToggleSidebar={() => setIsSidebarOpen(true)} />}
        {currentScreen === 'security' && (
          <SecurityAccount 
            onNavigate={setCurrentScreen}
            onLogout={() => setShowLogoutDialog(true)}
            onDeleteAccount={() => setShowDeleteDialog(true)}
          />
        )}
        {currentScreen === 'preferences' && <AppPreferences onNavigate={setCurrentScreen} />}
        {currentScreen === 'support' && <Support onNavigate={setCurrentScreen} />}
        {currentScreen === 'reset-password' && <ResetPassword onNavigate={setCurrentScreen} />}
        {currentScreen === '2fa' && <TwoFactorAuth onNavigate={setCurrentScreen} />}
        {currentScreen === 'help-center' && <HelpCenter onNavigate={setCurrentScreen} />}
        {currentScreen === 'contact-support' && <ContactSupport onNavigate={setCurrentScreen} />}
        {currentScreen === 'notifications' && <Notifications onNavigate={setCurrentScreen} />}
        {currentScreen === 'profile' && (
          <ProfileScreen 
            onClose={() => setCurrentScreen('my-jobs')}
            onLogout={() => {
              setShowLogoutDialog(true);
            }}
            onNavigate={(page) => {
              // Map action strings to screen types
              if (page === 'personal-info') setCurrentScreen('personal-info');
              else if (page === 'security') setCurrentScreen('security-privacy');
              else if (page === 'certifications') setCurrentScreen('certifications');
              else if (page === 'documents') setCurrentScreen('documents');
              else if (page === 'performance') setCurrentScreen('performance');
              else if (page === 'help') setCurrentScreen('help-center-page');
              else if (page === 'support') setCurrentScreen('contact-support-page');
              else if (page === 'notifications') setCurrentScreen('notifications');
            }}
          />
        )}
        {currentScreen === 'personal-info' && <PersonalInformation onBack={() => setCurrentScreen('profile')} />}
        {currentScreen === 'security-privacy' && <SecurityPrivacy onBack={() => setCurrentScreen('profile')} />}
        {currentScreen === 'certifications' && <CertificationsPage onBack={() => setCurrentScreen('profile')} />}
        {currentScreen === 'documents' && <DocumentsPage onBack={() => setCurrentScreen('profile')} />}
        {currentScreen === 'performance' && <PerformancePage onBack={() => setCurrentScreen('profile')} />}
        {currentScreen === 'help-center-page' && <HelpCenterPage onBack={() => setCurrentScreen('profile')} />}
        {currentScreen === 'contact-support-page' && <ContactSupportPage onBack={() => setCurrentScreen('profile')} />}
      </div>

      {showFooter && <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} hasActiveJob={!!activeJob} />}
      
      <AppSidebar 
        open={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen} 
        onNavigate={setCurrentScreen} 
      />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout from your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-[#f89823] text-[#1a1a1a] hover:bg-[#e08820]">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              <br /><br />
              <span className="text-[#d45153]">Note: Account deletion is restricted for company-invited users.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-[#d45153] text-white hover:bg-[#c04145]">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}