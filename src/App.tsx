import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Process, QueueMetrics } from './types';
import useSimulation from './hooks/useSimulation';
import { calculateQueueMetrics } from './utils/simulationEngine';

// Components
import ProcessForm from './components/ProcessForm';
import ProcessTable from './components/ProcessTable';
import QueueVisualization from './components/QueueVisualization';
import GanttChart from './components/GanttChart';
import PlaybackControls from './components/PlaybackControls';
import ResultsTable from './components/ResultsTable';

function App() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const {
    simulationState,
    resetSimulation,
    stepForward,
    stepBackward,
    undo,
    redo,
    autoPlay,
    toggleAutoPlay,
    canUndo,
    canRedo,
  } = useSimulation(processes);

  // Process management
  const addProcess = useCallback((process: Process) => {
    setProcesses(prevProcesses => {
      const newProcesses = [...prevProcesses, {
        ...process,
        id: uuidv4(),
        remainingTime: process.burstTime,
        status: 'waiting',
      }];
      resetSimulation(newProcesses);
      return newProcesses;
    });
  }, [resetSimulation]);

  const removeProcess = useCallback((id: string) => {
    setProcesses(prevProcesses => {
      // Only allow removing processes that haven't started yet
      const process = prevProcesses.find(p => p.id === id);
      if (process && process.status !== 'waiting') return prevProcesses;
      
      const newProcesses = prevProcesses.filter(p => p.id !== id);
      resetSimulation(newProcesses);
      return newProcesses;
    });
  }, [resetSimulation]);

  const handleResetSimulation = useCallback(() => {
    resetSimulation(processes);
  }, [processes, resetSimulation]);

  // Calculate metrics for the results table
  const queueMetrics: QueueMetrics[] = calculateQueueMetrics(simulationState.processes);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Multilevel Queue CPU Scheduling Simulation
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Visualize how different CPU scheduling algorithms function across multiple queues
          </p>
        </header>

        <main>
          {/* Process Input Form */}
          <ProcessForm addProcess={addProcess} />
          
          {/* Process Table */}
          <ProcessTable 
            processes={simulationState.processes} 
            removeProcess={removeProcess} 
          />
          
          {/* Simulation Controls */}
          <PlaybackControls
            isRunning={simulationState.currentStep > 0}
            isCompleted={simulationState.isCompleted}
            autoPlay={autoPlay}
            toggleAutoPlay={toggleAutoPlay}
            stepForward={stepForward}
            stepBackward={stepBackward}
            resetSimulation={handleResetSimulation}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            hasProcesses={processes.length > 0}
          />
          
          {/* Queue Visualization */}
          {simulationState.currentStep > 0 && (
            <QueueVisualization
              processes={simulationState.processes}
              currentTime={simulationState.currentTime}
            />
          )}
          
          {/* Gantt Chart */}
          <GanttChart 
            ganttItems={simulationState.ganttChart} 
            currentTime={simulationState.currentTime} 
          />
          
          {/* Results Table */}
          {simulationState.currentStep > 0 && (
            <ResultsTable 
              processes={simulationState.processes}
              queueMetrics={queueMetrics}
              isCompleted={simulationState.isCompleted}
            />
          )}
        </main>

        <footer className="text-center text-gray-500 text-sm mt-8 mb-4">
          <p>Multilevel Queue CPU Scheduling Simulation | {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;