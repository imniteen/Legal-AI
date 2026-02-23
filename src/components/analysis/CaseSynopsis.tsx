"use client";

import { FileText, Calendar, Users, Sparkles } from "lucide-react";
import { CitationText } from "./CitationBadge";
import CollapsibleSection from "./CollapsibleSection";
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
    <div className="space-y-4">
      {/* Synopsis */}
      <CollapsibleSection
        header={
          <div className="px-5 py-4 flex items-center gap-3 bg-gradient-to-r from-slate-50 to-white">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--primary)] to-indigo-600 flex items-center justify-center shadow-sm">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Case Synopsis</h3>
              <p className="text-xs text-slate-500">AI-generated summary with citations</p>
            </div>
            <Sparkles className="h-4 w-4 text-amber-500 ml-auto" />
          </div>
        }
      >
        <div className="border-t border-slate-100 p-5">
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
            <CitationText text={synopsis} onCitationClick={onCitationClick} />
          </div>
        </div>
      </CollapsibleSection>

      {/* Key Dates and Persons in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Dates */}
        <CollapsibleSection
          header={
            <div className="px-5 py-4 flex items-center gap-3 bg-gradient-to-r from-amber-50 to-white">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Key Dates</h3>
                <p className="text-xs text-slate-500">{keyDates.length} dates identified</p>
              </div>
            </div>
          }
        >
          <div className="border-t border-slate-100 p-5">
            {keyDates.length > 0 ? (
              <ul className="space-y-3">
                {keyDates.map((date, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md whitespace-nowrap text-xs">
                      {date.date}
                    </span>
                    <span className="text-slate-600 flex-1">
                      <CitationText text={`${date.event} ${date.citation}`} onCitationClick={onCitationClick} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 italic text-center py-4">No key dates identified</p>
            )}
          </div>
        </CollapsibleSection>

        {/* Key Persons */}
        <CollapsibleSection
          header={
            <div className="px-5 py-4 flex items-center gap-3 bg-gradient-to-r from-blue-50 to-white">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Key Persons</h3>
                <p className="text-xs text-slate-500">{keyPersons.length} persons identified</p>
              </div>
            </div>
          }
        >
          <div className="border-t border-slate-100 p-5">
            {keyPersons.length > 0 ? (
              <ul className="space-y-3">
                {keyPersons.map((person, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-slate-600">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-slate-900">{person.name}</span>
                      <span className="text-slate-500 ml-2">{person.role}</span>
                      {person.firstMention && (
                        <div className="mt-1">
                          <CitationText text={person.firstMention} onCitationClick={onCitationClick} />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 italic text-center py-4">No key persons identified</p>
            )}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
