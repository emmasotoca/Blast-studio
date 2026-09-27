import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  ListFilter
} from 'lucide-react';
import { BlastHit, BlastProgram } from '../types/blast';
import { formatEvalue, getNcbiBitScoreColor, getNcbiUrl } from '../utils/bioUtils';

interface HitsTableProps {
  hits: BlastHit[];
  program: BlastProgram;
  selectedHitId: string | null;
  onSelectHit: (hit: BlastHit) => void;
}

type SortField = 'num' | 'accession' | 'organism' | 'bestBitScore' | 'bestEvalue' | 'bestPident' | 'totalQueryCoverage' | 'totalAlignLen';
type SortOrder = 'asc' | 'desc';

export const HitsTable: React.FC<HitsTableProps> = ({
  hits,
  program,
  selectedHitId,
  onSelectHit
}) => {
  const [sortField, setSortField] = useState<SortField>('bestBitScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'bestEvalue' ? 'asc' : 'desc');
    }
  };

  const sortedHits = useMemo(() => {
    const list = [...hits];
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB || '').toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      if (sortOrder === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });
    return list;
  }, [hits, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedHits.length / pageSize));
  const currentHits = sortedHits.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400 opacity-60" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-cyan-400" />
    ) : (
      <ArrowDown className="h-3 w-3 text-cyan-400" />
    );
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-lg shadow-black/20">
      {/* Table header & actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-cyan-400" />
          <h3 className="font-heading text-sm font-semibold text-white">
            Tableau des Alignements Significatifs
          </h3>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono text-slate-300">
            {hits.length} cibles
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Lignes par page :</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-white transition w-12"
                onClick={() => handleSort('num')}
              >
                <div className="flex items-center gap-1">
                  <span>#</span>
                  {renderSortIcon('num')}
                </div>
              </th>
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-white transition"
                onClick={() => handleSort('accession')}
              >
                <div className="flex items-center gap-1">
                  <span>Accession</span>
                  {renderSortIcon('accession')}
                </div>
              </th>
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-white transition min-w-[220px]"
                onClick={() => handleSort('organism')}
              >
                <div className="flex items-center gap-1">
                  <span>Description / Organisme</span>
                  {renderSortIcon('organism')}
                </div>
              </th>
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-white transition text-right"
                onClick={() => handleSort('bestBitScore')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Bit Score</span>
                  {renderSortIcon('bestBitScore')}
                </div>
              </th>
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-white transition text-right"
                onClick={() => handleSort('bestEvalue')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>E-value</span>
                  {renderSortIcon('bestEvalue')}
                </div>
              </th>
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-white transition text-right"
                onClick={() => handleSort('bestPident')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>% Identité</span>
                  {renderSortIcon('bestPident')}
                </div>
              </th>
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-white transition text-right"
                onClick={() => handleSort('totalQueryCoverage')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Couverture</span>
                  {renderSortIcon('totalQueryCoverage')}
                </div>
              </th>
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-white transition text-right"
                onClick={() => handleSort('totalAlignLen')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Longueur</span>
                  {renderSortIcon('totalAlignLen')}
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {currentHits.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400 font-sans">
                  Aucun hit ne correspond aux critères de filtrage actuels.
                </td>
              </tr>
            ) : (
              currentHits.map((hit) => {
                const isSelected = selectedHitId === hit.id;
                const bitScoreColor = getNcbiBitScoreColor(hit.bestBitScore);
                const ncbiLink = getNcbiUrl(hit.accession, program);

                return (
                  <tr
                    key={hit.id}
                    onClick={() => onSelectHit(hit)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? 'bg-cyan-950/40 text-white'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-slate-400 font-semibold">
                      {hit.num}
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-cyan-400 group-hover:text-cyan-300">
                      <div className="flex items-center gap-1.5">
                        <span>{hit.accession}</span>
                        <a
                          href={ncbiLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-cyan-400 transition"
                          title="Ouvrir la fiche de référence NCBI"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-sans max-w-sm">
                      <div className="font-medium text-slate-200 truncate group-hover:text-white" title={hit.title}>
                        {hit.title}
                      </div>
                      {hit.organism && (
                        <div className="text-[11px] text-slate-400 italic truncate" title={hit.organism}>
                          {hit.organism}
                        </div>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <span
                        className="inline-block rounded px-1.5 py-0.5 text-xs font-bold"
                        style={{ color: bitScoreColor }}
                      >
                        {Math.round(hit.bestBitScore)}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                      {formatEvalue(hit.bestEvalue)}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <span className={`font-semibold ${
                        hit.bestPident >= 90 ? 'text-emerald-400' :
                        hit.bestPident >= 70 ? 'text-cyan-400' :
                        hit.bestPident >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {hit.bestPident}%
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {hit.totalQueryCoverage}%
                    </td>

                    <td className="py-2.5 px-3 text-right text-slate-400">
                      {hit.totalAlignLen}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHit(hit);
                        }}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-sans font-medium transition ${
                          isSelected
                            ? 'bg-cyan-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <Eye className="h-3 w-3" />
                        <span>Voir</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="text-slate-400">
            Affichage de {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, sortedHits.length)} sur {sortedHits.length} hits
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-3 py-1 font-mono text-slate-200">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
