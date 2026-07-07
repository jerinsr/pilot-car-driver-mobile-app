import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface ReportIncidentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportIncidentDrawer({ isOpen, onClose }: ReportIncidentDrawerProps) {
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    // Logic to submit incident
    console.log("Submitting incident", { incidentType, description });
    onClose();
    // Reset form
    setIncidentType("");
    setDescription("");
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent aria-describedby={undefined}>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Report Incident</DrawerTitle>
            <DrawerDescription>
              Provide details about the incident to alert the team.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Incident Type</Label>
              <Input 
                id="type" 
                placeholder="e.g. Breakdown, Accident" 
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe what happened..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSubmit} className="w-full bg-[#f89823] text-black hover:bg-[#e08820]">Submit Report</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
