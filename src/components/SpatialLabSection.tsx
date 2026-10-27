import React, { useState } from 'react';
import { SpatialViewport, ModelType } from './SpatialViewport';
import { Layers, Eye, ShieldCheck, Box, Compass, Sparkles, Terminal } from 'lucide-react';

interface SpatialLabSectionProps {
  currentModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

export function SpatialLabSection({ currentModel, onModelChange }: SpatialLabSectionProps) {
  const modelSpecs: Record<ModelType, { title: string; subtitle: string; polyCount: string; engine: string; highlights: string[] }> = {
    headset: {
      title: 'AR/VR Spatial Headset & Rig',
      subtitle: 'Simulated WebXR Display & Sensor Assembly',
      polyCount: '3,840 Tris (Optimized Procedural)',
      engine: 'Blender 4.x / WebXR / Three.js',
      highlights: [
        'Dual-camera optical pass-through layout with stereoscopic tracking positions',
        'LiDAR depth sensor housing calibrated for millimeter room scanning',
        'Ergonomic tension headband with counterbalanced weight distribution',
        'Spatial audio transducer pods positioned over acoustic ear wells',
      ],
    },
    drone: {
      title: 'AI Autonomous Observation Drone',
      subtitle: 'Quad-Rotor Airframe & Vision Gimbal',
      polyCount: '4,210 Tris (Carbon Fiber Frame)',
      engine: 'Blender 4.x / Python / OpenCV Vision',
      highlights: [
        'Diagonal carbon fiber airframe engineered for vibrational dampening',
        'High-KV brushless motor pods with contra-rotating aerodynamic prop blades',
        '2-Axis stabilized gimbal pod housing high-FPS optical sensor',
        'Central flight controller cavity with thermal dissipation vents',
      ],
    },
    office: {
      title: 'Praya Labs Office Digital Twin',
      subtitle: '1:1 Real-World Facility Architecture',
      polyCount: '6,100 Tris (Modular Architectural Shell)',
      engine: 'Blender 4.x / PBR Texture Baking',
      highlights: [
        'Faithful spatial geometry modeled from onsite dimensional blueprints (Sep 2026)',
        'Baked global illumination map preserving realistic interior daylight bounce',
        'Acoustic partition glass barriers and collaborative workstation desks',
        'Integrated spatial inspection beacons for interactive tour orientation',
      ],
    },
  };

  const spec = modelSpecs[currentModel];

  return (
    <section id="spatial-lab" className="py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900">
      {/* Section Header */}
      <div className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
          INTERACTIVE 3D COMPUTING WORKSTATION
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
          3D Spatial Lab & Digital Twin Viewer
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl">
          Interact in real-time with procedural models demonstrating spatial computing, Blender 3D asset engineering,
          and architectural digital twin workflows.
        </p>
      </div>

      {/* Main Grid: Interactive Canvas + Live Spec Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3D Viewport */}
        <div className="lg:col-span-8">
          <SpatialViewport
            initialModel={currentModel}
            onModelSelect={onModelChange}
            className="w-full h-[520px] shadow-2xl"
          />
        </div>

        {/* Right: Technical Architecture Breakdown */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <span className="text-indigo-400 font-semibold uppercase tracking-wider">ACTIVE SPECIFICATION</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{spec.polyCount}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              {spec.title}
            </h3>
            <p className="text-xs text-neutral-400 mb-5">
              {spec.subtitle}
            </p>

            {/* Pipeline Tooling */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 mb-5 text-xs">
              <div className="text-neutral-400 mb-1 font-medium">Tooling & Environment:</div>
              <div className="font-mono text-indigo-300 font-semibold">{spec.engine}</div>
            </div>

            {/* Spatial Engineering Features */}
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
              Spatial Highlights & Kinematics
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              {spec.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">›</span>
                  <span className="leading-snug">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Model Selector Pills */}
          <div className="pt-4 border-t border-neutral-800">
            <span className="block text-xs font-medium text-neutral-400 mb-2">
              Quick Switch Target:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onModelChange('headset')}
                className={`py-2 px-1 text-xs font-medium rounded-lg text-center transition-colors ${
                  currentModel === 'headset'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                VR Rig
              </button>
              <button
                type="button"
                onClick={() => onModelChange('drone')}
                className={`py-2 px-1 text-xs font-medium rounded-lg text-center transition-colors ${
                  currentModel === 'drone'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                AI Drone
              </button>
              <button
                type="button"
                onClick={() => onModelChange('office')}
                className={`py-2 px-1 text-xs font-medium rounded-lg text-center transition-colors ${
                  currentModel === 'office'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Office Twin
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
