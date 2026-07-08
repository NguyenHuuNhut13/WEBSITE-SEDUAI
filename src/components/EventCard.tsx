import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { Event } from '@/data/events';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('vi-VN', { month: 'short' });

  const categoryColors: Record<string, string> = {
    'Khai giảng': 'bg-primary text-white',
    Workshop: 'bg-emerald-500 text-white',
    'Thi thử': 'bg-amber-500 text-white',
    'Sự kiện': 'bg-purple-500 text-white',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm card-hover-lift flex flex-col h-full group">
      <div className="flex items-stretch">
        {/* Date Badge */}
        <div className="w-24 flex-shrink-0 bg-primary flex flex-col items-center justify-center text-white py-6">
          <span className="text-3xl font-extrabold leading-none">{day}</span>
          <span className="text-xs font-semibold uppercase tracking-wider mt-1">{month}</span>
        </div>

        {/* Content */}
        <div className="flex-grow p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                categoryColors[event.category] || 'bg-slate-200 text-slate-600'
              }`}
            >
              {event.category}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-primary transition duration-150 line-clamp-2">
            {event.title}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {event.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
