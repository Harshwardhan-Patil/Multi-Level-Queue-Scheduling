import React from 'react';
import { Process } from '../types';

interface QueueVisualizationProps {
  processes: Process[];
  currentTime: number;
}

const QueueVisualization: React.FC<QueueVisualizationProps> = ({ processes, currentTime }) => {
  // Filter processes that have arrived but are not completed
  const getQueueProcesses = (queueNum: number) => {
    return processes.filter(
      p => p.queueNumber === queueNum && 
      p.arrivalTime <= currentTime && 
      p.status !== 'completed'
    );
  };

  const queue1Processes = getQueueProcesses(1);
  const queue2Processes = getQueueProcesses(2);
  const queue3Processes = getQueueProcesses(3);

  const renderQueue = (queueNum: number, queueProcesses: Process[], algorithm: string, bgColor: string) => {
    return (
      <div className={`${bgColor} shadow-md rounded-lg p-4 flex-1`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Queue {queueNum}</h3>
          <span className="text-xs font-medium px-2 py-1 bg-white bg-opacity-30 rounded">
            {algorithm}
          </span>
        </div>
        
        {queueProcesses.length === 0 ? (
          <div className="text-center py-6 text-sm text-white text-opacity-70">
            No processes in queue
          </div>
        ) : (
          <div className="space-y-2">
            {queueProcesses.map(process => (
              <div 
                key={process.id}
                className={`p-3 rounded-md bg-white bg-opacity-20 transition-all duration-300 ${
                  process.status === 'running' ? 'transform scale-105 border-2 border-white' : ''
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{process.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white bg-opacity-30">
                    {process.status === 'running' ? 'Running' : 'Waiting'}
                  </span>
                </div>
                <div className="text-xs mt-1 flex justify-between">
                  <span>Burst: {process.burstTime}</span>
                  <span>Remaining: {process.remainingTime}</span>
                </div>
                {queueNum === 2 && (
                  <div className="text-xs mt-1">
                    Priority: {process.priority}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Queue Status (Current Time: {currentTime})</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {renderQueue(1, queue1Processes, "Round Robin (TQ=3)", "bg-blue-600 text-white")}
        {renderQueue(2, queue2Processes, "Priority Scheduling", "bg-purple-600 text-white")}
        {renderQueue(3, queue3Processes, "First-Come-First-Serve", "bg-green-600 text-white")}
      </div>
    </div>
  );
};

export default QueueVisualization;