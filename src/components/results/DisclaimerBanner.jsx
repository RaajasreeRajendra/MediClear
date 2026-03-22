import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
      <ShieldAlert className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-yellow-700">Medical Disclaimer</p>
        <p className="text-xs text-yellow-600/80 mt-1">
          This simplified explanation is for educational purposes only and does not replace professional medical advice. 
          Always consult your healthcare provider for proper diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}