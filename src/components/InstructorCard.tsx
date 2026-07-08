import { Instructor } from '@/data/instructors';

interface InstructorCardProps {
  instructor: Instructor;
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm card-hover-lift group text-center">
      {/* Image */}
      <div className="relative overflow-hidden h-64 bg-slate-100">
        <img
          src={instructor.avatar}
          alt={instructor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

        {/* Specialty Badge */}
        <div className="absolute bottom-3 left-3 right-3">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
            {instructor.specialty.split(',')[0]}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-2">
        <h3 className="font-bold text-slate-900 text-base group-hover:text-primary transition duration-150">
          {instructor.name}
        </h3>
        <p className="text-xs text-primary font-semibold">{instructor.title}</p>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{instructor.bio}</p>
      </div>
    </div>
  );
}
