// simulationEngine.ts
import { Process, GanttChartItem, SimulationState, QueueMetrics } from '../types';
import { roundRobin, priorityScheduling, fcfs } from './schedulingAlgorithms';

export const initializeSimulation = (processes: Process[]): SimulationState => {
  return {
    currentTime: 0,
    processes: processes.map(p => ({
      ...p,
      remainingTime: p.burstTime,
      status: 'waiting',
    })),
    ganttChart: [],
    isRunning: false,
    isCompleted: false,
    currentStep: 0,
    lastScheduledProcessId: undefined,
  };
};

export const runSimulationStep = (state: SimulationState): SimulationState => {
  if (state.isCompleted) return state;

  const { currentTime, processes, ganttChart } = state;

  if (processes.every(p => p.status === 'completed')) {
    return {
      ...state,
      isCompleted: true,
      isRunning: false,
    };
  }

  const updatedProcesses = [...processes];
  let newCurrentTime = currentTime;
  let newGanttItem: GanttChartItem | null = null;
  let newLastScheduledProcessId = state.lastScheduledProcessId;

  const hasArrived = updatedProcesses.some(p => p.arrivalTime <= currentTime && p.status !== 'completed');

  if (!hasArrived) {
    const nextArrival = Math.min(...updatedProcesses.filter(p => p.status !== 'completed').map(p => p.arrivalTime));
    newCurrentTime = nextArrival;
  } else {
    const q1 = updatedProcesses.filter(p => p.queueNumber === 1 && p.status !== 'completed' && p.arrivalTime <= newCurrentTime);
    if (q1.length > 0) {
      const [proc, time, item, lastId] = roundRobin(q1, newCurrentTime, state.lastScheduledProcessId);
      if (proc && item) {
        updatedProcesses[updatedProcesses.findIndex(p => p.id === proc.id)] = proc;
        newCurrentTime = time;
        newGanttItem = item;
        newLastScheduledProcessId = lastId;
      }
    } else {
      const q2 = updatedProcesses.filter(p => p.queueNumber === 2 && p.status !== 'completed' && p.arrivalTime <= newCurrentTime);
      if (q2.length > 0) {
        const [proc, time, item] = priorityScheduling(q2, newCurrentTime);
        if (proc && item) {
          updatedProcesses[updatedProcesses.findIndex(p => p.id === proc.id)] = proc;
          newCurrentTime = time;
          newGanttItem = item;
        }
      } else {
        const q3 = updatedProcesses.filter(p => p.queueNumber === 3 && p.status !== 'completed' && p.arrivalTime <= newCurrentTime);
        if (q3.length > 0) {
          const [proc, time, item] = fcfs(q3, newCurrentTime);
          if (proc && item) {
            updatedProcesses[updatedProcesses.findIndex(p => p.id === proc.id)] = proc;
            newCurrentTime = time;
            newGanttItem = item;
          }
        }
      }
    }
  }

  const newGanttChart = newGanttItem ? [...ganttChart, newGanttItem] : ganttChart;

  return {
    ...state,
    currentTime: newCurrentTime,
    processes: updatedProcesses,
    ganttChart: newGanttChart,
    currentStep: state.currentStep + 1,
    lastScheduledProcessId: newLastScheduledProcessId,
  };
};

// export const calculateMetrics = (processes: Process[]): QueueMetrics[] => {
//   const groupByQueue = (num: 1 | 2 | 3) =>
//     processes.filter(p => p.queueNumber === num && p.completionTime !== undefined);

//   const avg = (arr: Process[]) => {
//     const tt = arr.reduce((s, p) => s + (p.turnaroundTime || 0), 0) / arr.length || 0;
//     const wt = arr.reduce((s, p) => s + (p.waitingTime || 0), 0) / arr.length || 0;
//     return { tt, wt };
//   };

//   return [
//     { queue: 1, algorithm: 'Round Robin (TQ=3)', ...avg(groupByQueue(1)) },
//     { queue: 2, algorithm: 'Priority Scheduling', ...avg(groupByQueue(2)) },
//     { queue: 3, algorithm: 'First-Come-First-Serve', ...avg(groupByQueue(3)) },
//   ];
// };


// export function calculateQueueMetrics(processes: Process[]): QueueMetrics[] {
//   const queueMap = new Map<number, Process[]>();

//   for (const process of processes) {
//     if (process.completionTime === undefined) continue;

//     if (!queueMap.has(process.queueNumber)) {
//       queueMap.set(process.queueNumber, []);
//     }
//     queueMap.get(process.queueNumber)!.push(process);
//   }

//   const metrics: QueueMetrics[] = [];
//   for (const [queueNumber, processes] of queueMap.entries()) {
//     const totalTurnaround = processes.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);
//     const totalWaiting = processes.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
//     const count = processes.length;

//     metrics.push({
//       queue: queueNumber,
//       algorithm: getAlgorithmName(queueNumber),
//       averageTurnaroundTime: totalTurnaround / count,
//       averageWaitingTime: totalWaiting / count,
//     });
//   }

//   return metrics;
// }

// function getAlgorithmName(queue: number): string {
//   switch (queue) {
//     case 1: return 'Round Robin (TQ=3)';
//     case 2: return 'Priority Scheduling';
//     case 3: return 'First-Come-First-Serve';
//     default: return 'Unknown';
//   }
// }


export function calculateQueueMetrics(processes: Process[]): QueueMetrics[] {
  // Helper to filter processes by queue number
  const groupByQueue = (queueNumber: number): Process[] =>
    processes.filter(p => p.queueNumber === queueNumber && p.turnaroundTime !== undefined && p.waitingTime !== undefined);

  // Helper to calculate average turnaround and waiting times
  const avg = (queueProcesses: Process[]): { averageTurnaroundTime: number; averageWaitingTime: number } => {
    if (queueProcesses.length === 0) {
      return { averageTurnaroundTime: 0, averageWaitingTime: 0 };
    }

    const totalTurnaround = queueProcesses.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);
    const totalWaiting = queueProcesses.reduce((sum, p) => sum + (p.waitingTime || 0), 0);

    return {
      averageTurnaroundTime: totalTurnaround / queueProcesses.length,
      averageWaitingTime: totalWaiting / queueProcesses.length,
    };
  };

  // Final return in expected format
  return [
    { queue: 1, algorithm: 'Round Robin (TQ=3)', ...avg(groupByQueue(1)) },
    { queue: 2, algorithm: 'Priority Scheduling', ...avg(groupByQueue(2)) },
    { queue: 3, algorithm: 'First-Come-First-Serve', ...avg(groupByQueue(3)) },
  ];
}
