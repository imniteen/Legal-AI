"use client";

import { FileText, Calendar, Users } from "lucide-react";
import { CitationText } from "./CitationBadge";
import type { KeyDate, KeyPerson } from "@/types";

interface CaseSynopsisProps {
  synopsis: string;
  keyDates: KeyDate[];
  keyPersons: KeyPerson[];
  onCitationClick?: (page: number) => void;
}

export default function CaseSynopsis({
  synopsis,
  keyDates,
  keyPersons,
  onCitationClick,
}: CaseSynopsisProps) {
  return (
    <div className="space-y-6">
      {/* Synopsis */}
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--primary)]" />
          <span>Case Synopsis</span>
        </div>
        <div className="card-body">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
            <CitationText text={synopsis} onCitationClick={onCitationClick} />
          </div>
        </div>
      </div>

      {/* Key Dates and Persons in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Dates */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[var(--accent)]" />
            <span>Key Dates</span>
          </div>
          <div className="card-body">
            {keyDates.length > 0 ? (
              <ul className="space-y-3">
                {keyDates.map((date, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <span className="font-semibold text-[var(--primary)] whitespace-nowrap min-w-[100px]">
                      {date.date}
                    </span>
                    <span className="text-slate-600">
                      <CitationText text={`${date.event} ${date.citation}`} onCitationClick={onCitationClick} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No key dates identified</p>
            )}
          </div>
        </div>

        {/* Key Persons */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Users className="h-5 w-5 text-[var(--info)]" />
            <span>Key Persons</span>
          </div>
          <div className="card-body">
            {keyPersons.length > 0 ? (
              <ul className="space-y-3">
                {keyPersons.map((person, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <span className="font-semibold text-slate-900">{person.name}</span>
                    <span className="text-slate-600">
                      {person.role}
                      {person.firstMention && (
                        <span className="ml-2">
                          <CitationText text={person.firstMention} onCitationClick={onCitationClick} />
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No key persons identified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
