'use client'

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { saveOnboarding } from './actions';

export function Wizard({ userId }: { userId: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goal: 'lose',
    sex: 'female',
    age: '30',
    weight: '70',
    height: '170',
    target_weight: '65',
    activity_level: 'light',
    dietary_tags: [] as string[],
  });

  const updateData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    await saveOnboarding(formData);
  };

  return (
    <Card className="flex flex-col gap-6 w-full flex-1 justify-between">
      <div className="flex-1">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-heading text-xl font-bold mb-4">What's your primary goal?</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: 'lose', label: 'Lose Weight', desc: 'Burn fat and get leaner' },
                { id: 'maintain', label: 'Maintain Weight', desc: 'Stay at my current weight' },
                { id: 'gain', label: 'Gain Muscle', desc: 'Build muscle mass' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => updateData({ goal: opt.id })}
                  className={`p-4 rounded-[16px] border-[1.5px] text-left transition-all ${formData.goal === opt.id ? 'border-[var(--color-primary)] bg-[rgba(34,160,107,0.05)]' : 'border-[var(--color-outline-variant)]'}`}
                >
                  <div className="font-bold text-[var(--color-on-surface)]">{opt.label}</div>
                  <div className="text-sm text-[var(--color-on-surface-variant)]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-heading text-xl font-bold mb-4">Your Body Profile</h2>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <label className="flex-1 p-3 border-[1.5px] border-[var(--color-outline-variant)] rounded-[12px] flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="sex" checked={formData.sex === 'female'} onChange={() => updateData({ sex: 'female' })} />
                  Female
                </label>
                <label className="flex-1 p-3 border-[1.5px] border-[var(--color-outline-variant)] rounded-[12px] flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="sex" checked={formData.sex === 'male'} onChange={() => updateData({ sex: 'male' })} />
                  Male
                </label>
              </div>
              <Input label="Age (years)" type="number" value={formData.age} onChange={e => updateData({ age: e.target.value })} />
              <div className="flex gap-4">
                <Input label="Height (cm)" type="number" value={formData.height} onChange={e => updateData({ height: e.target.value })} />
                <Input label="Current Weight (kg)" type="number" value={formData.weight} onChange={e => updateData({ weight: e.target.value })} />
              </div>
              {formData.goal !== 'maintain' && (
                <Input label="Target Weight (kg)" type="number" value={formData.target_weight} onChange={e => updateData({ target_weight: e.target.value })} />
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-heading text-xl font-bold mb-4">Activity Level</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
                { id: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                { id: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                { id: 'active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => updateData({ activity_level: opt.id })}
                  className={`p-4 rounded-[16px] border-[1.5px] text-left transition-all ${formData.activity_level === opt.id ? 'border-[var(--color-primary)] bg-[rgba(34,160,107,0.05)]' : 'border-[var(--color-outline-variant)]'}`}
                >
                  <div className="font-bold text-[var(--color-on-surface)]">{opt.label}</div>
                  <div className="text-sm text-[var(--color-on-surface-variant)]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-[var(--color-outline-variant)]">
        {step > 1 && (
          <Button variant="secondary" onClick={handleBack} className="flex-1">Back</Button>
        )}
        {step < 3 ? (
          <Button onClick={handleNext} className="flex-[2]">Next</Button>
        ) : (
          <Button onClick={handleSubmit} className="flex-[2]" disabled={loading}>
            {loading ? 'Creating Plan...' : 'Finish Setup'}
          </Button>
        )}
      </div>
    </Card>
  );
}
