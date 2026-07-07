import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Home, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

interface AppSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (screen: string) => void;
}

export default function AppSidebar({ open, onOpenChange, onNavigate }: AppSidebarProps) {
  const handleNavigate = (screen: string) => {
    onNavigate(screen);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 bg-[#f6f6f6]" aria-describedby={undefined}>
        <SheetHeader className="p-6 bg-white border-b border-gray-100">
          <SheetTitle className="text-left text-xl font-bold flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#0066cc] flex items-center justify-center text-white text-lg">
              JD
            </div>
            <div className="flex flex-col">
              <span>John Davis</span>
              <span className="text-xs font-normal text-gray-500">Driver Account</span>
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigation menu for accessing dashboard, profile, and account settings
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col py-4">
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</p>
          </div>
          
          <Button variant="ghost" className="justify-start px-6 py-3 h-auto text-base font-medium text-gray-700 hover:text-[#0066cc] hover:bg-blue-50" onClick={() => handleNavigate('dashboard')}>
            <LayoutDashboard className="mr-3 w-5 h-5" />
            Dashboard
          </Button>
          
          <Button variant="ghost" className="justify-start px-6 py-3 h-auto text-base font-medium text-gray-700 hover:text-[#0066cc] hover:bg-blue-50" onClick={() => handleNavigate('overview')}>
            <User className="mr-3 w-5 h-5" />
            Profile
          </Button>

          <div className="px-4 mt-6 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account</p>
          </div>

          <Button variant="ghost" className="justify-start px-6 py-3 h-auto text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => {}}>
            <LogOut className="mr-3 w-5 h-5" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}