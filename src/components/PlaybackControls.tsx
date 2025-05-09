import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, Undo, Redo } from 'lucide-react';

interface PlaybackControlsProps {
  isRunning: boolean;
  isCompleted: boolean;
  autoPlay: boolean;
  toggleAutoPlay: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetSimulation: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasProcesses: boolean;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isRunning,
  isCompleted,
  autoPlay,
  toggleAutoPlay,
  stepForward,
  stepBackward,
  resetSimulation,
  undo,
  redo,
  canUndo,
  canRedo,
  hasProcesses,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Simulation Controls</h2>
      
      <div className="flex flex-wrap justify-center gap-4">
        {/* History Controls */}
        <div className="flex space-x-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`flex items-center justify-center p-2 rounded-md ${
              canUndo 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            } transition-colors duration-200`}
            title="Undo"
          >
            <Undo size={20} />
          </button>
          
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`flex items-center justify-center p-2 rounded-md ${
              canRedo 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            } transition-colors duration-200`}
            title="Redo"
          >
            <Redo size={20} />
          </button>
        </div>
        
        {/* Playback Controls */}
        <div className="flex space-x-2">
          <button
            onClick={stepBackward}
            disabled={!isRunning || !canUndo}
            className={`flex items-center justify-center p-2 rounded-md ${
              isRunning && canUndo 
                ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            } transition-colors duration-200`}
            title="Previous Step"
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={toggleAutoPlay}
            disabled={isCompleted || !hasProcesses}
            className={`flex items-center justify-center p-3 rounded-md ${
              isCompleted || !hasProcesses
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : autoPlay
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
            } transition-colors duration-200`}
            title={autoPlay ? 'Pause' : 'Play'}
          >
            {autoPlay ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={stepForward}
            disabled={isCompleted || autoPlay || !hasProcesses}
            className={`flex items-center justify-center p-2 rounded-md ${
              isCompleted || autoPlay || !hasProcesses
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
            } transition-colors duration-200`}
            title="Next Step"
          >
            <SkipForward size={20} />
          </button>
        </div>
        
        {/* Reset Button */}
        <button
          onClick={resetSimulation}
          disabled={!hasProcesses}
          className={`flex items-center justify-center px-4 py-2 rounded-md space-x-2 ${
            !hasProcesses
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          } transition-colors duration-200`}
          title="Reset Simulation"
        >
          <RefreshCw size={20} />
          <span>Reset</span>
        </button>
      </div>
      
      {/* Status Message */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {isCompleted ? (
          <span className="text-green-600 font-medium">Simulation completed! You can reset to start again.</span>
        ) : autoPlay ? (
          <span className="text-indigo-600 font-medium">Simulation running automatically...</span>
        ) : !hasProcesses ? (
          <span>Add processes to start the simulation</span>
        ) : isRunning ? (
          <span>Click Next or Play to continue the simulation</span>
        ) : (
          <span>Click Play to start the simulation</span>
        )}
      </div>
    </div>
  );
};

export default PlaybackControls;