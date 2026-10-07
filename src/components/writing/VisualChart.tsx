import React from 'react';
import { WritingTask } from '../../types';
import { BarChart3, LineChart, PieChart, Table2, GitBranch, MapPin } from 'lucide-react';

interface VisualChartProps {
  task: WritingTask;
  className?: string;
}

export const VisualChart: React.FC<VisualChartProps> = ({ task, className = '' }) => {
  const chartData = task.visualChartData;

  const renderChartIcon = () => {
    switch (task.visualChartType) {
      case 'bar':
        return <BarChart3 className="w-4 h-4 text-red-500" />;
      case 'line':
        return <LineChart className="w-4 h-4 text-red-500" />;
      case 'pie':
        return <PieChart className="w-4 h-4 text-red-500" />;
      case 'table':
        return <Table2 className="w-4 h-4 text-red-500" />;
      case 'process':
        return <GitBranch className="w-4 h-4 text-red-500" />;
      case 'map':
        return <MapPin className="w-4 h-4 text-red-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-5 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {renderChartIcon()}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {task.subType} Diagram Reference
          </span>
        </div>
        <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded-full">
          Academic Task 1 Visual
        </span>
      </div>

      {/* Dynamic SVG / Graphical Representation */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 sm:p-6 border border-slate-100 dark:border-slate-800/80">
        <h4 className="text-sm font-bold text-center text-slate-900 dark:text-white mb-4">
          {task.title}
        </h4>

        {/* Bar Chart rendering */}
        {task.visualChartType === 'bar' && chartData && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4 pt-4 pb-2 border-b border-slate-200 dark:border-slate-700">
              {chartData.labels.map((year, idx) => (
                <div key={year} className="space-y-2">
                  <div className="text-center font-bold text-xs text-slate-700 dark:text-slate-300">
                    {year}
                  </div>
                  <div className="flex items-end justify-center gap-1.5 h-32 bg-white dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    {chartData.series.map((s) => {
                      const val = s.values[idx];
                      const heightPercent = Math.min(100, Math.max(15, (val / 5000) * 100));
                      return (
                        <div
                          key={s.name}
                          className="flex flex-col items-center flex-1 h-full justify-end group relative"
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10">
                            {s.name}: {val} TWh
                          </div>
                          <div
                            className="w-full rounded-t-sm transition-all duration-300"
                            style={{
                              height: `${heightPercent}%`,
                              backgroundColor: s.color || '#EF4444',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {chartData.series.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="w-3 h-3 rounded-xs shrink-0"
                    style={{ backgroundColor: s.color || '#EF4444' }}
                  />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Line graph rendering */}
        {task.visualChartType === 'line' && (
          <div className="space-y-4">
            <svg viewBox="0 0 400 180" className="w-full h-44 overflow-visible">
              {/* Gridlines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="100" x2="380" y2="100" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="140" x2="380" y2="140" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="30" y="24" textAnchor="end" className="text-[10px] fill-slate-400">80Mt</text>
              <text x="30" y="64" textAnchor="end" className="text-[10px] fill-slate-400">50Mt</text>
              <text x="30" y="104" textAnchor="end" className="text-[10px] fill-slate-400">20Mt</text>
              <text x="30" y="144" textAnchor="end" className="text-[10px] fill-slate-400">0Mt</text>

              {/* X Axis Labels */}
              <text x="50" y="158" className="text-[10px] fill-slate-400">1990</text>
              <text x="150" y="158" className="text-[10px] fill-slate-400">2000</text>
              <text x="260" y="158" className="text-[10px] fill-slate-400">2010</text>
              <text x="360" y="158" className="text-[10px] fill-slate-400">2020</text>

              {/* Passenger Cars (Red) */}
              <polyline
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
                points="50,26 150,22 260,38 360,62"
              />
              <circle cx="50" cy="26" r="4" fill="#EF4444" />
              <circle cx="150" cy="22" r="4" fill="#EF4444" />
              <circle cx="260" cy="38" r="4" fill="#EF4444" />
              <circle cx="360" cy="62" r="4" fill="#EF4444" />

              {/* Commercial Trucks (Orange) */}
              <polyline
                fill="none"
                stroke="#F97316"
                strokeWidth="2.5"
                points="50,102 150,96 260,94 360,99"
              />
              <circle cx="50" cy="102" r="3.5" fill="#F97316" />
              <circle cx="150" cy="96" r="3.5" fill="#F97316" />
              <circle cx="260" cy="94" r="3.5" fill="#F97316" />
              <circle cx="360" cy="99" r="3.5" fill="#F97316" />

              {/* Aviation (Cyan) */}
              <polyline
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
                points="50,122 150,111 260,106 360,123"
              />
              <circle cx="50" cy="122" r="3.5" fill="#06B6D4" />
              <circle cx="150" cy="111" r="3.5" fill="#06B6D4" />
              <circle cx="260" cy="106" r="3.5" fill="#06B6D4" />
              <circle cx="360" cy="123" r="3.5" fill="#06B6D4" />
            </svg>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-red-500 rounded" /> Passenger Cars</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-orange-500 rounded" /> Commercial Trucks</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-cyan-500 rounded" /> Aviation</span>
            </div>
          </div>
        )}

        {/* Process Diagram / Flow */}
        {(task.visualChartType === 'process' || task.subType.toLowerCase().includes('process')) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-red-600 block mb-1">STAGE 1</span>
              <h5 className="text-xs font-semibold">Leaf Plucking</h5>
              <p className="text-[10px] text-slate-500 mt-1">Manual harvest of top two tender leaves</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-red-600 block mb-1">STAGE 2</span>
              <h5 className="text-xs font-semibold">Withering & Rolling</h5>
              <p className="text-[10px] text-slate-500 mt-1">Air blast reduces moisture; rollers bruise cells</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-red-600 block mb-1">STAGE 3</span>
              <h5 className="text-xs font-semibold">Enzymatic Oxidation</h5>
              <p className="text-[10px] text-slate-500 mt-1">Controlled humidity turns leaves copper-brown</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-red-600 block mb-1">STAGE 4</span>
              <h5 className="text-xs font-semibold">Firing & Grading</h5>
              <p className="text-[10px] text-slate-500 mt-1">Hot air oven drying & optical sorting into boxes</p>
            </div>
          </div>
        )}

        {/* Default or Map or Table preview */}
        {task.visualChartType !== 'bar' &&
          task.visualChartType !== 'line' &&
          task.visualChartType !== 'process' && (
            <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Detailed quantitative infographic representation provided for {task.subType}.
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Review data columns and trends described above in the prompt description.
              </p>
            </div>
          )}

        {chartData?.notes && (
          <p className="text-[11px] italic text-slate-500 dark:text-slate-400 mt-3 text-center">
            Note: {chartData.notes}
          </p>
        )}
      </div>
    </div>
  );
};
