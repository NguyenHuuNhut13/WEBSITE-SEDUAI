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
    'Khai giảng': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Workshop: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Thi thử': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Sự kiện': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover-lift-glow card-shine glow-border flex flex-col justify-between group h-full relative overflow-hidden">
      <div className="space-y-4">
        {/* Card Header: Category & Date */}
        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
              categoryColors[event.category] || 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {event.category}
          </span>
          
          {/* Minimalist Date badge */}
          <span className="text-[10px] font-extrabold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150 uppercase tracking-widest flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {day} {month}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-primary transition duration-150 line-clamp-2">
          {event.title}
        </h3>
      </div>

      {/* Meta tags at the bottom */}
      <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-semibold">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" /> {event.time}
        </span>
        <span className="flex items-center gap-1.5 truncate max-w-[180px]">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {event.location}
        </span>
      </div>
    </div>
  );
}
