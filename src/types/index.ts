export type ProcessStatus = 'waiting' | 'running' | 'completed';

export interface Process {
    id: string;
    name: string;
    arrivalTime: number;
    burstTime: number;
    remainingTime: number;
    startTime?: number;
    completionTime?: number;
    turnaroundTime?: number;
    waitingTime?: number;
    priority: number;
    queueNumber: 1 | 2 | 3;
    status: ProcessStatus;
}

export interface GanttChartItem {
    processId: string;
    processName: string;
    startTime: number;
    endTime: number;
    queueNumber: number;
}

export interface SimulationState {
    currentTime: number;
    processes: Process[];
    ganttChart: GanttChartItem[];
    isRunning: boolean;
    isCompleted: boolean;
    currentStep: number;
    lastScheduledProcessId?: string;
}

export interface QueueMetrics {
    queue: number;
    algorithm: string;
    averageTurnaroundTime: number;
    averageWaitingTime: number;
}
