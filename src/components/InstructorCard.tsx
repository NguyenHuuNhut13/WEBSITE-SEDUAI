import { Instructor } from '@/data/instructors';
import { Sparkles } from 'lucide-react';

interface InstructorCardProps {
  instructor: Instructor;
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover-lift-glow glow-border card-shine flex flex-col justify-between items-center text-center group h-full relative overflow-hidden">
      <div className="space-y-4 flex flex-col items-center">
        {/* Rounded Square Avatar with hover scale */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border-2 border-primary/20 group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300 shadow-md">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="space-y-1">
          <h3 className="font-extrabold text-slate-900 text-base group-hover:text-primary transition duration-150">
            {instructor.name}
          </h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-[10px] font-extrabold uppercase tracking-wider">
            {instructor.title}
          </span>
        </div>

        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
          {instructor.bio}
        </p>
      </div>

      {/* Specialty badge tag at the bottom */}
      <div className="pt-4 mt-4 border-t border-slate-100 w-full text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        {instructor.specialty.split(',')[0]}
      </div>
    </div>
  );
}
