import React from 'react';
import { Process, QueueMetrics } from '../types';

interface ResultsTableProps {
  processes: Process[];
  queueMetrics: QueueMetrics[];
  isCompleted: boolean;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ 
  processes, 
  queueMetrics,
  isCompleted 
}) => {
  // Filter out processes that haven't completed yet
  const completedProcesses = processes.filter(p => p.completionTime !== undefined);
  
  if (completedProcesses.length === 0) {
    return null;
  }

  // Calculate overall averages
  const overallTurnaroundTime = completedProcesses.reduce(
    (sum, p) => sum + (p.turnaroundTime || 0), 
    0
  ) / completedProcesses.length;
  
  const overallWaitingTime = completedProcesses.reduce(
    (sum, p) => sum + (p.waitingTime || 0), 
    0
  ) / completedProcesses.length;

  // Format decimal numbers
  const formatTime = (time: number | undefined) => {
    if (time === undefined) return '-';
    return time.toFixed(2);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Simulation Results
        {!isCompleted && <span className="text-xs text-gray-500 ml-2">(In Progress)</span>}
      </h2>
      
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Process
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Queue
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrival Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Burst Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turnaround Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waiting Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {completedProcesses.map((process) => (
              <tr key={process.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{process.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${process.queueNumber === 1 ? 'bg-blue-100 text-blue-800' : 
                      process.queueNumber === 2 ? 'bg-purple-100 text-purple-800' : 
                      'bg-green-100 text-green-800'}`}>
                    Queue {process.queueNumber}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{process.arrivalTime}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{process.burstTime}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{process.completionTime}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatTime(process.turnaroundTime)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatTime(process.waitingTime)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Queue Metrics Summary */}
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Queue Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {queueMetrics.map((metric) => (
          <div 
            key={`queue-${metric.queue}`}
            className={`p-4 rounded-lg ${
              metric.queue === 1 ? 'bg-blue-50 border border-blue-200' : 
              metric.queue === 2 ? 'bg-purple-50 border border-purple-200' : 
              'bg-green-50 border border-green-200'
            }`}
          >
            <h4 className="font-medium text-gray-800">Queue {metric.queue}</h4>
            <div className="text-sm text-gray-600 mb-1">{metric.algorithm}</div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between">
                <span className="text-sm">Avg. Turnaround Time:</span>
                <span className="text-sm font-medium">
                  {formatTime(metric.averageTurnaroundTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. Waiting Time:</span>
                <span className="text-sm font-medium">
                  {formatTime(metric.averageWaitingTime)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Overall Summary */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Overall Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Average Turnaround Time:</span>
            <span className="font-semibold text-xl text-indigo-600">{formatTime(overallTurnaroundTime)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Average Waiting Time:</span>
            <span className="font-semibold text-xl text-indigo-600">{formatTime(overallWaitingTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;