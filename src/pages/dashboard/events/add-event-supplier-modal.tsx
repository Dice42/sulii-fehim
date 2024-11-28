import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEventStore } from '@/store/event-store';

interface AddEventSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  remainingBudget: number;
}

export function AddEventSupplierModal({
  isOpen,
  onClose,
  eventId,
  remainingBudget,
}: AddEventSupplierModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    allocatedBudget: '',
  });

  const addSupplierToEvent = useEventStore((state) => state.addSupplierToEvent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allocatedBudget = parseFloat(formData.allocatedBudget);

    if (allocatedBudget > remainingBudget) {
      alert('Allocated budget exceeds remaining budget');
      return;
    }

    addSupplierToEvent(eventId, {
      ...formData,
      id: Math.random().toString(36).slice(2),
      allocatedBudget,
      status: 'pending',
      performance: 5,
      rating: 5,
      deliverables: [],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Event Supplier</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Specialization
            </label>
            <Input
              value={formData.specialization}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Allocated Budget (Remaining: ${remainingBudget.toLocaleString()})
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.allocatedBudget}
              onChange={(e) =>
                setFormData({ ...formData, allocatedBudget: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Supplier</Button>
          </div>
        </form>
      </div>
    </div>
  );
}