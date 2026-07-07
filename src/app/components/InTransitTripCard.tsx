import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Navigation, MapPin, Clock, ArrowRight, Truck, Users } from 'lucide-react';

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

export default function InTransitTripCard({
  trip,
  onViewDetails
}: InTransitTripCardProps) {
  // Pilot car drivers don't need to see this - they see their active jobs in the Job Board
  return null;
}