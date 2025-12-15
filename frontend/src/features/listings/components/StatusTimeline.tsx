import {Package, Users, Truck, PartyPopper, Check} from "lucide-react";
import {cn} from "@/shared/lib/utils";
import {ListingStatus} from "@/shared/types";
import {useTranslation} from "react-i18next";

interface StatusTimelineProps {
  status: ListingStatus;
  pendingRequests: number;
  className?: string;
}

const steps = [
  {id: "created", translationKey: "created", icon: Package},
  {id: "requests", translationKey: "requests", icon: Users},
  {id: "claimed", translationKey: "claimed", icon: Truck},
  {id: "completed", translationKey: "complete", icon: PartyPopper},
];

function getActiveStep(status: ListingStatus, pendingRequests: number): number {
  if (status === "completed") return 4;
  if (status === "claimed") return 3;
  if (pendingRequests > 0) return 2;
  return 1;
}

export const StatusTimeline = ({status, pendingRequests, className}: StatusTimelineProps) => {
  const {t} = useTranslation();
  const activeStep = getActiveStep(status, pendingRequests);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200" />

        {/* Filled progress line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-green-600 transition-all duration-500"
          style={{width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`}}
        />

        {/* Step dots */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < activeStep;
          const isCurrent = stepNumber === activeStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted && "bg-green-600 text-white",
                  isCurrent && "bg-green-600 text-white ring-4 ring-green-100",
                  !isCompleted && !isCurrent && "bg-gray-200 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-[10px] lg:text-xs font-medium transition-colors",
                  isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                )}
              >
                {t(`myListingsPage.timeline.${step.translationKey}`)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};