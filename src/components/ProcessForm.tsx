import React, { useState } from 'react';
import { Process } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ProcessFormProps {
  addProcess: (process: Process) => void;
}

const ProcessForm: React.FC<ProcessFormProps> = ({ addProcess }) => {
  const [processName, setProcessName] = useState('');
  const [arrivalTime, setArrivalTime] = useState('0');
  const [burstTime, setBurstTime] = useState('1');
  const [priority, setPriority] = useState('1');
  const [queueNumber, setQueueNumber] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!processName.trim()) {
      setError('Process name is required');
      return;
    }
    
    if (parseInt(burstTime) <= 0) {
      setError('Burst time must be greater than 0');
      return;
    }

    if (parseInt(arrivalTime) < 0) {
      setError('Arrival time cannot be negative');
      return;
    }
    
    // Create new process
    const newProcess: Process = {
      id: uuidv4(),
      name: processName,
      arrivalTime: parseInt(arrivalTime),
      burstTime: parseInt(burstTime),
      priority: parseInt(priority),
      queueNumber,
      remainingTime: parseInt(burstTime),
      status: 'waiting',
    };
    
    // Add process
    addProcess(newProcess);
    
    // Reset form
    setProcessName('');
    setArrivalTime('0');
    setBurstTime('1');
    setPriority('1');
    setQueueNumber(1);
    setError('');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Process</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="processName">
            Process Name
          </label>
          <input
            id="processName"
            type="text"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., P1"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="arrivalTime">
            Arrival Time
          </label>
          <input
            id="arrivalTime"
            type="number"
            min="0"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="burstTime">
            Burst Time
          </label>
          <input
            id="burstTime"
            type="number"
            min="1"
            value={burstTime}
            onChange={(e) => setBurstTime(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="priority">
            Priority (Lower = Higher)
          </label>
          <input
            id="priority"
            type="number"
            min="1"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Queue Number
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                id="queue1"
                type="radio"
                checked={queueNumber === 1}
                onChange={() => setQueueNumber(1)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="queue1" className="ml-2 block text-sm text-gray-700">
                Queue 1 (Round Robin)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="queue2"
                type="radio"
                checked={queueNumber === 2}
                onChange={() => setQueueNumber(2)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="queue2" className="ml-2 block text-sm text-gray-700">
                Queue 2 (Priority)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="queue3"
                type="radio"
                checked={queueNumber === 3}
                onChange={() => setQueueNumber(3)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <label htmlFor="queue3" className="ml-2 block text-sm text-gray-700">
                Queue 3 (FCFS)
              </label>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
          >
            Add Process
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessForm;