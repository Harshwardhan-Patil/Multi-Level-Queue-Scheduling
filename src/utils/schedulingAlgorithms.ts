import { Process, GanttChartItem, SimulationState, QueueMetrics } from '../types';

// schedulingAlgorithms.ts
const TIME_QUANTUM = 3;

export const roundRobin = (
  processes: Process[],
  currentTime: number,
  lastScheduledProcessId?: string
): [Process | null, number, GanttChartItem | null, string?] => {
  if (processes.length === 0) return [null, currentTime, null];

  const availableProcesses = processes
    .filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0)
    .sort((a, b) => a.arrivalTime - b.arrivalTime);

  if (lastScheduledProcessId) {
    const lastIndex = availableProcesses.findIndex(p => p.id === lastScheduledProcessId);
    if (lastIndex >= 0) {
      availableProcesses.push(...availableProcesses.splice(0, lastIndex + 1));
    }
  }

  if (availableProcesses.length === 0) return [null, currentTime, null];

  const selectedProcess = availableProcesses[0];
  const timeSlice = Math.min(TIME_QUANTUM, selectedProcess.remainingTime);

  const updatedProcess: Process = {
    ...selectedProcess,
    startTime: selectedProcess.startTime ?? currentTime,
    remainingTime: selectedProcess.remainingTime - timeSlice,
    status: selectedProcess.remainingTime <= timeSlice ? 'completed' : 'running',
  };

  if (updatedProcess.remainingTime === 0) {
    updatedProcess.completionTime = currentTime + timeSlice;
    updatedProcess.turnaroundTime = updatedProcess.completionTime - updatedProcess.arrivalTime;
    updatedProcess.waitingTime = updatedProcess.turnaroundTime - updatedProcess.burstTime;
  }

  const ganttItem: GanttChartItem = {
    processId: selectedProcess.id,
    processName: selectedProcess.name,
    startTime: currentTime,
    endTime: currentTime + timeSlice,
    queueNumber: selectedProcess.queueNumber,
  };

  return [updatedProcess, currentTime + timeSlice, ganttItem, selectedProcess.id];
};

export const priorityScheduling = (
  processes: Process[],
  currentTime: number
): [Process | null, number, GanttChartItem | null] => {
  if (processes.length === 0) return [null, currentTime, null];

  const availableProcesses = processes
    .filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0)
    .sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);

  const selectedProcess = availableProcesses[0];
  const timeSlice = selectedProcess.remainingTime;

  const updatedProcess: Process = {
    ...selectedProcess,
    startTime: selectedProcess.startTime ?? currentTime,
    remainingTime: 0,
    status: 'completed',
    completionTime: currentTime + timeSlice,
  };

  updatedProcess.turnaroundTime = updatedProcess.completionTime - updatedProcess.arrivalTime;
  updatedProcess.waitingTime = updatedProcess.turnaroundTime - updatedProcess.burstTime;

  const ganttItem: GanttChartItem = {
    processId: selectedProcess.id,
    processName: selectedProcess.name,
    startTime: currentTime,
    endTime: currentTime + timeSlice,
    queueNumber: selectedProcess.queueNumber,
  };

  return [updatedProcess, currentTime + timeSlice, ganttItem];
};

export const fcfs = (
  processes: Process[],
  currentTime: number
): [Process | null, number, GanttChartItem | null] => {
  if (processes.length === 0) return [null, currentTime, null];

  const availableProcesses = processes
    .filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0)
    .sort((a, b) => a.arrivalTime - b.arrivalTime);

  const selectedProcess = availableProcesses[0];
  const timeSlice = selectedProcess.remainingTime;

  const updatedProcess: Process = {
    ...selectedProcess,
    startTime: selectedProcess.startTime ?? currentTime,
    remainingTime: 0,
    status: 'completed',
    completionTime: currentTime + timeSlice,
  };

  updatedProcess.turnaroundTime = updatedProcess.completionTime - updatedProcess.arrivalTime;
  updatedProcess.waitingTime = updatedProcess.turnaroundTime - updatedProcess.burstTime;

  const ganttItem: GanttChartItem = {
    processId: selectedProcess.id,
    processName: selectedProcess.name,
    startTime: currentTime,
    endTime: currentTime + timeSlice,
    queueNumber: selectedProcess.queueNumber,
  };

  return [updatedProcess, currentTime + timeSlice, ganttItem];
};