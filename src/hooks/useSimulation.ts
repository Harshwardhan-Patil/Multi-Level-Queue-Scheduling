import { useState, useEffect, useCallback, useRef } from 'react';
import { Process, SimulationState } from '../types';
import { initializeSimulation, runSimulationStep } from '../utils/simulationEngine';

const useSimulation = (initialProcesses: Process[] = []) => {
  const [simulationState, setSimulationState] = useState<SimulationState>(() => 
    initializeSimulation(initialProcesses)
  );
  const [history, setHistory] = useState<SimulationState[]>([]);
  const [future, setFuture] = useState<SimulationState[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Reset simulation with new processes
  const resetSimulation = useCallback((processes: Process[]) => {
    const initialState = initializeSimulation(processes);
    setSimulationState(initialState);
    setHistory([]);
    setFuture([]);
    setAutoPlay(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);
  
  // Step forward in simulation
  const stepForward = useCallback(() => {
    if (simulationState.isCompleted) return;
    
    setHistory(prev => [...prev, simulationState]);
    const nextState = runSimulationStep({ ...simulationState });
    setSimulationState(nextState);
    setFuture([]); // Clear future states when stepping forward
  }, [simulationState]);
  
  // Step backward in simulation
  const stepBackward = useCallback(() => {
    if (history.length === 0) return;
    
    const previousState = history[history.length - 1];
    setFuture(prev => [simulationState, ...prev]);
    setHistory(prev => prev.slice(0, -1));
    setSimulationState(previousState);
  }, [history, simulationState]);
  
  // Undo last action
  const undo = useCallback(() => {
    if (history.length === 0) return;
    stepBackward();
  }, [stepBackward]);
  
  // Redo last undone action
  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    const nextState = future[0];
    setHistory(prev => [...prev, simulationState]);
    setFuture(prev => prev.slice(1));
    setSimulationState(nextState);
  }, [future, simulationState]);
  
  // Toggle auto-play
  const toggleAutoPlay = useCallback(() => {
    setAutoPlay(prev => !prev);
  }, []);
  
  // Handle auto-play effect
  useEffect(() => {
    if (autoPlay && !simulationState.isCompleted) {
      autoPlayRef.current = setInterval(() => {
        setSimulationState(prev => {
          if (prev.isCompleted) {
            setAutoPlay(false);
            return prev;
          }
          setHistory(currentHistory => [...currentHistory, prev]);
          const nextState = runSimulationStep({ ...prev });
          return nextState;
        });
      }, 1000);
    } else if (!autoPlay && autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [autoPlay, simulationState.isCompleted]);
  
  return {
    simulationState,
    resetSimulation,
    stepForward,
    stepBackward,
    undo,
    redo,
    autoPlay,
    toggleAutoPlay,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
  };
};

export default useSimulation;