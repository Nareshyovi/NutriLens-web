'use client'

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Camera, Search, Type, ScanBarcode } from 'lucide-react';
import { analyzeMeal } from '../actions';

type Tab = 'describe' | 'photo' | 'search' | 'barcode';

export default function AddMealClient({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('describe');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Server action call
      const response = await analyzeMeal(description);
      if (response.error) throw new Error(response.error);
      setResult(response.data);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex bg-[var(--color-surface-container)] rounded-[16px] p-1 shadow-sm">
        <button onClick={() => setActiveTab('describe')} className={`flex-1 flex justify-center items-center py-3 rounded-[12px] font-bold text-sm transition-colors ${activeTab === 'describe' ? 'bg-[var(--color-surface-container-lowest)] shadow text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>
          <Type size={18} className="mr-2" /> Describe
        </button>
        <button onClick={() => setActiveTab('photo')} className={`flex-1 flex justify-center items-center py-3 rounded-[12px] font-bold text-sm transition-colors ${activeTab === 'photo' ? 'bg-[var(--color-surface-container-lowest)] shadow text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>
          <Camera size={18} className="mr-2" /> Photo
        </button>
        <button onClick={() => setActiveTab('search')} className={`flex-1 flex justify-center items-center py-3 rounded-[12px] font-bold text-sm transition-colors ${activeTab === 'search' ? 'bg-[var(--color-surface-container-lowest)] shadow text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>
          <Search size={18} className="mr-2" /> Search
        </button>
        <button onClick={() => setActiveTab('barcode')} className={`flex-1 flex justify-center items-center py-3 rounded-[12px] font-bold text-sm transition-colors ${activeTab === 'barcode' ? 'bg-[var(--color-surface-container-lowest)] shadow text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>
          <ScanBarcode size={18} className="mr-2" /> Scan
        </button>
      </div>

      {activeTab === 'describe' && (
        <Card className="flex flex-col gap-4 p-5 animate-in fade-in slide-in-from-bottom-2">
          {!result && !loading && (
            <>
              <h3 className="font-bold text-lg">Describe your meal</h3>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. A bowl of oatmeal with a sliced banana and a tablespoon of peanut butter"
                className="bg-[var(--color-surface)] min-h-[120px] rounded-[16px] border-[1.5px] border-[var(--color-outline-variant)] p-4 text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-[3px] focus:ring-[rgba(34,160,107,0.15)] resize-none"
              />
              <Button onClick={handleAnalyze} disabled={!description.trim()}>Analyze Meal</Button>
            </>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-[var(--color-primary)] animate-pulse">NutriLens AI is analyzing...</p>
            </div>
          )}

          {error && (
            <div className="bg-[var(--color-error-container)] text-[var(--color-error)] p-4 rounded-xl text-sm font-bold">
              {error}
              <Button variant="secondary" onClick={() => setError(null)} className="mt-4 w-full">Try Again</Button>
            </div>
          )}

          {result && !loading && (
            <div className="flex flex-col gap-4">
              <div className="bg-[rgba(34,160,107,0.1)] p-4 rounded-xl">
                <h3 className="font-bold text-[var(--color-primary)] mb-2">Analysis Complete</h3>
                <p className="text-sm font-bold">Total: {result.total_kcal} kcal</p>
                <div className="flex gap-4 text-xs mt-2 text-[var(--color-on-surface-variant)]">
                  <span>P: {result.total_protein}g</span>
                  <span>C: {result.total_carbs}g</span>
                  <span>F: {result.total_fat}g</span>
                </div>
              </div>
              <Button onClick={() => setResult(null)}>Log Meal</Button>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'photo' && (
        <Card className="flex flex-col gap-4 p-5 animate-in fade-in slide-in-from-bottom-2 items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-[rgba(34,160,107,0.1)] rounded-full flex items-center justify-center text-[var(--color-primary)] mb-2">
            <Camera size={32} />
          </div>
          <p className="font-bold">Upload or take a photo</p>
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-4">Supported formats: JPG, PNG, WebP</p>
          <Button variant="secondary">Select Image</Button>
        </Card>
      )}

      {activeTab === 'search' && (
        <Card className="flex flex-col gap-4 p-5 animate-in fade-in slide-in-from-bottom-2">
          <Input placeholder="Search foods..." icon={<Search size={18} />} />
          <div className="text-center py-12 text-[var(--color-outline)] text-sm">
            Search our verified database
          </div>
        </Card>
      )}

      {activeTab === 'barcode' && (
        <Card className="flex flex-col gap-4 p-5 animate-in fade-in slide-in-from-bottom-2 items-center justify-center min-h-[300px]">
          <ScanBarcode size={48} className="text-[var(--color-outline)] mb-4" />
          <p className="font-bold">Barcode Scanner (Coming Soon)</p>
          <p className="text-sm text-[var(--color-on-surface-variant)] text-center">
            This feature requires native device capabilities or a supported browser API.
          </p>
        </Card>
      )}
    </div>
  );
}
