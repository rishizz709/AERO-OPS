import React, { useState } from 'react';
import { useAodb } from '../context/AodbContext';
import { TurnaroundStepName } from '../types';
import {
  RotateCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Layers,
  ChevronRight,
  Plane,
  Truck,
  Users,
  ShieldCheck,
  Fuel,
  Sparkles,
  Luggage,
  CalendarCheck
} from 'lucide-react';

export const TurnaroundMonitorView: React.FC = () => {
  const { turnaroundAI101, advanceTurnaroundStep, updateFlightStatus, flights } = useAodb();
  const [selectedStep, setSelectedStep] = useState(turnaroundAI101.steps[turnaroundAI101.currentStepIndex] || turnaroundAI101.steps[0]);

  const getStepIcon = (name: TurnaroundStepName) => {
    switch (name) {
      case 'LANDED':
      case 'DEPARTED':
        return Plane;
      case 'ON STAND':
      case 'READY':
      case 'PUSHBACK':
        return Truck;
      case 'DISEMBARKATION':
      case 'BOARDING':
        return Users;
      case 'BAGGAGE UNLOAD':
        return Luggage;
      case 'CLEANING':
      case 'CATERING':
        return Sparkles;
      case 'REFUELING':
        return Fuel;
      default:
        return CalendarCheck;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 bg-gradient-to-r from-[#0C1838] via-[#12224D] to-[#0C1838] border border-cyan-500/30 rounded-2xl shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/40 rounded-xl text-cyan-400">
              <RotateCw className="w-6 h-6 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white font-display">
                  AIRCRAFT TURNAROUND MONITOR (A-CDM MILESTONES)
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                  A-CDM COLLABORATIVE ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Turnaround progress for Flight <strong className="text-cyan-300 font-mono">AI-101</strong> (Airbus A320neo VT-ABC) at Stand S05 / Gate G03
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => advanceTurnaroundStep(turnaroundAI101.currentStepIndex)}
              disabled={turnaroundAI101.currentStepIndex >= turnaroundAI101.steps.length}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-950/40 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Advance Next Milestone</span>
            </button>
          </div>
        </div>

        {/* Operational Delay Alert (Section 7) */}
        <div className="p-3 bg-amber-950/40 border border-amber-500/50 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-200">OPERATIONAL ALERT: </span>
              <span className="text-slate-200">AI-101 turnaround is {turnaroundAI101.totalDelayMinutes} minutes behind schedule due to high-loader catering delay.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-amber-300 bg-black/40 px-3 py-1.5 rounded-lg border border-amber-800/60">
            <span>Affected: <strong>Gate G03</strong></span>
            <span>•</span>
            <span><strong>Runway 09</strong></span>
            <span>•</span>
            <span><strong>Ground Team 4</strong></span>
            <span>•</span>
            <span><strong>Belt B2</strong></span>
          </div>
        </div>
      </div>

      {/* Main Turnaround Visualizer (Sections 6 & 7) */}
      <div className="p-5 bg-[#0E1A38] border border-slate-800 rounded-2xl shadow-xl space-y-6">
        {/* Progress Header */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-sans">Overall Turnaround Completion:</span>
            <span className="text-cyan-400 font-bold text-base">{turnaroundAI101.overallProgress}%</span>
          </div>
          <div className="text-slate-400">
            Current Stage: <span className="text-amber-300 font-bold">{turnaroundAI101.steps[turnaroundAI101.currentStepIndex]?.name || 'COMPLETED'}</span>
          </div>
        </div>

        {/* 11-Step Milestone Timeline */}
        <div className="relative py-4 overflow-x-auto">
          <div className="min-w-[850px] flex items-center justify-between relative">
            {/* Background connecting rail */}
            <div className="absolute left-6 right-6 top-5 h-1 bg-slate-800 -z-0" />
            <div
              className="absolute left-6 top-5 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500 -z-0 transition-all duration-700"
              style={{ width: `calc(${turnaroundAI101.overallProgress}% - 48px)` }}
            />

            {turnaroundAI101.steps.map((step, idx) => {
              const Icon = getStepIcon(step.name);
              const isCompleted = step.status === 'COMPLETED';
              const isInProgress = step.status === 'IN_PROGRESS';
              const isSelected = selectedStep.name === step.name;

              return (
                <div
                  key={step.name}
                  onClick={() => setSelectedStep(step)}
                  className="flex flex-col items-center cursor-pointer group z-10"
                >
                  {/* Step Bubble */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-lg ${
                      isCompleted
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                        : isInProgress
                        ? 'bg-amber-950 border-amber-400 text-amber-300 ring-4 ring-amber-500/20 animate-pulse'
                        : 'bg-slate-900 border-slate-700 text-slate-500 group-hover:border-slate-500'
                    } ${isSelected ? 'ring-2 ring-cyan-400 scale-110' : ''}`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>

                  {/* Step Label */}
                  <div className="mt-2 text-center">
                    <div className={`text-[10px] font-mono font-bold ${
                      isCompleted ? 'text-emerald-300' : isInProgress ? 'text-amber-300' : 'text-slate-500'
                    }`}>
                      {step.name}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">
                      {step.actualTime || step.plannedTime}
                    </div>
                    {step.delayMinutes > 0 && (
                      <div className="text-[9px] text-orange-400 font-mono">
                        +{step.delayMinutes}m
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Milestone Inspection Card */}
        {selectedStep && (
          <div className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate-400">Milestone Deep-Dive:</span>
                <span className="text-sm font-bold text-white font-mono">{selectedStep.name}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                selectedStep.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                selectedStep.status === 'IN_PROGRESS' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {selectedStep.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-[#0A1128] rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">RESPONSIBLE DEPARTMENT</span>
                <span className="font-bold text-cyan-300">{selectedStep.department}</span>
              </div>
              <div className="p-2.5 bg-[#0A1128] rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">PLANNED TIME</span>
                <span className="font-bold text-white font-mono">{selectedStep.plannedTime}</span>
              </div>
              <div className="p-2.5 bg-[#0A1128] rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">ACTUAL TIME</span>
                <span className="font-bold text-emerald-400 font-mono">{selectedStep.actualTime || 'In Progress'}</span>
              </div>
              <div className="p-2.5 bg-[#0A1128] rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">RECORDED DELAY</span>
                <span className={`font-bold font-mono ${selectedStep.delayMinutes > 0 ? 'text-orange-400' : 'text-slate-300'}`}>
                  {selectedStep.delayMinutes} Minutes
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
