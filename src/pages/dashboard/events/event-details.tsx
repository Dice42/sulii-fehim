import { useState } from 'react';
import { useEventStore, Event, EventSupplier } from '@/store/event-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Plus, Calendar, DollarSign, MapPin, Users } from 'lucide-react';
import { AddEventSupplierModal } from './add-event-supplier-modal';

interface EventDetailsProps {
  eventId: string;
  onClose: () => void;
}

export function EventDetails({ eventId, onClose }: EventDetailsProps) {
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const event = useEventStore((state) =>
    state.events.find((e) => e.id === eventId)
  );
  const updateEvent = useEventStore((state) => state.updateEvent);
  const removeSupplierFromEvent = useEventStore((state) => state.removeSupplierFromEvent);
  const updateEventSupplier = useEventStore((state) => state.updateEventSupplier);

  if (!event) return null;

  const handleStatusUpdate = (supplierId: string, status: EventSupplier['status']) => {
    updateEventSupplier(eventId, supplierId, { status });
  };

  const handleRemoveSupplier = (supplierId: string) => {
    if (confirm('Are you sure you want to remove this supplier?')) {
      removeSupplierFromEvent(eventId, supplierId);
    }
  };

  const getBudgetUtilization = () => {
    return (event.totalSupplierBudget / event.budget) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl m-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{event.name}</h2>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(event.date).toLocaleDateString()}
            </div>
          </div>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Event Details</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {event.location}
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                Budget: ${event.budget.toLocaleString()}
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-gray-400" />
                Suppliers: {event.suppliers.length}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Budget Utilization</h3>
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${getBudgetUtilization()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Used: ${event.totalSupplierBudget.toLocaleString()}</span>
                <span>Total: ${event.budget.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Event Suppliers</h3>
          <Button onClick={() => setIsAddSupplierOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        <div className="space-y-4">
          {event.suppliers.map((supplier) => (
            <Card key={supplier.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold">{supplier.name}</h4>
                  <p className="text-sm text-gray-500">{supplier.specialization}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={supplier.status}
                    onChange={(e) =>
                      handleStatusUpdate(
                        supplier.id,
                        e.target.value as EventSupplier['status']
                      )
                    }
                    className="text-sm border rounded p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveSupplier(supplier.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">Contact Details</h5>
                  <div className="space-y-1 text-sm">
                    <p>Email: {supplier.email}</p>
                    <p>Phone: {supplier.phone}</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-2">Budget Details</h5>
                  <div className="space-y-1 text-sm">
                    <p>Allocated: ${supplier.allocatedBudget.toLocaleString()}</p>
                    <p>Performance: {'⭐'.repeat(supplier.performance)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View Deliverables
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AddEventSupplierModal
        isOpen={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
        eventId={eventId}
        remainingBudget={event.budget - event.totalSupplierBudget}
      />
    </div>
  );
}