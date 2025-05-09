import React from 'react';
import { Process } from '../types';
import { Trash } from 'lucide-react';

interface ProcessTableProps {
  processes: Process[];
  removeProcess: (id: string) => void;
}

const ProcessTable: React.FC<ProcessTableProps> = ({ processes, removeProcess }) => {
  if (processes.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Process Queue</h2>
        <p className="text-gray-500 text-center py-4">No processes added yet</p>
      </div>
    );
  }

  // Sort processes by arrival time, then by queue number
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return a.queueNumber - b.queueNumber;
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Process Queue</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Process
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Arrival Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Burst Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Queue
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedProcesses.map((process) => (
            <tr key={process.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{process.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{process.arrivalTime}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{process.burstTime}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{process.priority}</div>
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
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${process.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 
                    process.status === 'running' ? 'bg-indigo-100 text-indigo-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {process.status.charAt(0).toUpperCase() + process.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => removeProcess(process.id)}
                  className="text-red-600 hover:text-red-900"
                  disabled={process.status !== 'waiting'}
                >
                  <Trash size={18} className={process.status !== 'waiting' ? 'opacity-30' : ''} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessTable;