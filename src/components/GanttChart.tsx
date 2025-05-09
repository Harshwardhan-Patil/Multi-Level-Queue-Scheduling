import React, { useRef, useEffect } from 'react';
import { GanttChartItem } from '../types';

interface GanttChartProps {
  ganttItems: GanttChartItem[];
  currentTime: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ ganttItems, currentTime }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Queue colors
  const getQueueColor = (queueNumber: number) => {
    switch (queueNumber) {
      case 1: return { bg: 'bg-blue-500', border: 'border-blue-700', text: 'text-white' };
      case 2: return { bg: 'bg-purple-500', border: 'border-purple-700', text: 'text-white' };
      case 3: return { bg: 'bg-green-500', border: 'border-green-700', text: 'text-white' };
      default: return { bg: 'bg-gray-500', border: 'border-gray-700', text: 'text-white' };
    }
  };

  // Auto-scroll to keep current time in view
  useEffect(() => {
    if (scrollContainerRef.current && ganttItems.length > 0) {
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const clientWidth = scrollContainerRef.current.clientWidth;
      
      // Calculate position based on current time relative to total time span
      const maxTime = Math.max(...ganttItems.map(item => item.endTime));
      const scrollPosition = (currentTime / maxTime) * scrollWidth - clientWidth / 2;
      
      scrollContainerRef.current.scrollLeft = Math.max(0, scrollPosition);
    }
  }, [currentTime, ganttItems]);

  if (ganttItems.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Gantt Chart</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
          Start the simulation to see the Gantt Chart
        </div>
      </div>
    );
  }

  // Find the maximum end time for setting chart width
  const maxTime = Math.max(...ganttItems.map(item => item.endTime));
  
  // Calculate the scale - how many pixels per time unit
  const scale = 50; // 50px per time unit

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Gantt Chart</h2>
      
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto pb-4"
        style={{ overflowY: 'hidden' }}
      >
        <div className="relative" style={{ width: `${maxTime * scale + 100}px`, height: '120px' }}>
          {/* Time markers */}
          <div className="absolute left-0 right-0 bottom-0 h-6 flex">
            {Array.from({ length: maxTime + 1 }, (_, i) => (
              <div 
                key={`time-${i}`} 
                className="flex-shrink-0 border-l border-gray-300 text-xs text-gray-500"
                style={{ width: `${scale}px`, marginLeft: i === 0 ? '0' : '' }}
              >
                {i}
              </div>
            ))}
          </div>
          
          {/* Current time marker */}
          {currentTime <= maxTime && (
            <div 
              className="absolute bottom-0 top-0 border-l-2 border-red-500 z-10"
              style={{ left: `${currentTime * scale}px` }}
            >
              <div className="bg-red-500 text-white text-xs px-1 rounded-sm">
                {currentTime}
              </div>
            </div>
          )}
          
          {/* Gantt blocks */}
          <div className="absolute left-0 right-0 top-0 h-16">
            {ganttItems.map((item, index) => {
              const width = (item.endTime - item.startTime) * scale;
              const left = item.startTime * scale;
              const { bg, border, text } = getQueueColor(item.queueNumber);
              
              return (
                <div
                  key={`${item.processId}-${index}`}
                  className={`absolute ${bg} ${border} ${text} border rounded shadow-sm p-1 flex flex-col justify-center items-center overflow-hidden transition-all duration-300`}
                  style={{
                    left: `${left}px`,
                    width: `${width}px`,
                    height: '100%',
                    zIndex: 5,
                  }}
                  title={`${item.processName} (${item.startTime}-${item.endTime})`}
                >
                  <div className="font-bold text-sm">{item.processName}</div>
                  <div className="text-xs">
                    {item.startTime}-{item.endTime}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;