import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password?: string;
}

export function PasswordStrengthMeter({ password = '' }: PasswordStrengthMeterProps) {
  const criteria = [
    { label: '8+ characters', isValid: password.length >= 8 },
    { label: 'Uppercase', isValid: /[A-Z]/.test(password) },
    { label: 'Lowercase', isValid: /[a-z]/.test(password) },
    { label: 'Number', isValid: /[0-9]/.test(password) },
    { label: 'Special character', isValid: /[^A-Za-z0-9]/.test(password) },
  ];

  const strength = criteria.filter((c) => c.isValid).length;
  const progressPercent = (strength / criteria.length) * 100;

  let progressColor = 'bg-slate-200';
  if (strength > 0 && strength < 3) progressColor = 'bg-red-500';
  else if (strength >= 3 && strength < 5) progressColor = 'bg-yellow-500';
  else if (strength === 5) progressColor = 'bg-emerald-500';

  return (
    <div className="space-y-3 mt-2">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${progressColor}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Criteria list */}
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
        {criteria.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-1.5 ${item.isValid ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            {item.isValid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
