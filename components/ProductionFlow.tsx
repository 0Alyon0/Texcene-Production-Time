
import React from 'react';
import { MachineWorkload } from '../types';

interface MachineCardProps {
  name: string;
  workload?: number; // in minutes
  capacity?: number; // in meters
  isHighlighted?: boolean;
}

// Conversion factor based on "Media metri giorno: 120.000" from the flowchart.
// Assuming a 16-hour (960 minutes) workday (2 shifts).
// 120,000 meters / 960 minutes = 125 meters per minute.
const METERS_PER_MINUTE = 125;


const getBarColor = (utilization: number): string => {
    if (utilization === 0) return 'bg-slate-300'; // Neutral for idle
    if (utilization > 95) return 'bg-red-500'; 
    if (utilization > 75) return 'bg-orange-500';
    return 'bg-green-500';
};

const MachineCard: React.FC<MachineCardProps> = ({ name, workload = 0, capacity = 0, isHighlighted = false }) => {
    const workloadInMeters = workload * METERS_PER_MINUTE;
    const utilization = capacity > 0 ? Math.min((workloadInMeters / capacity) * 100, 100) : 0;
    const barColor = getBarColor(utilization);

    return (
        <div className={`bg-white p-3 rounded-md shadow-sm border ${isHighlighted ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'} flex-grow min-w-[220px]`}>
            <h4 className="text-sm font-bold text-slate-700 truncate">{name}</h4>
            <div className="mt-2">
                <p className="text-xs text-slate-500">
                    Workload: <span className="font-semibold text-slate-800">{workload.toLocaleString()} min</span> 
                </p>
                <div className="mt-1.5 w-full bg-slate-200 rounded-full h-2.5" title={`${utilization.toFixed(0)}% Utilized`}>
                    <div 
                        className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${utilization}%` }}
                        role="progressbar"
                        aria-valuenow={utilization}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${name} utilization`}
                    ></div>
                </div>
                 <div className="flex justify-between items-baseline mt-1">
                    <p className="text-xs font-medium" style={{color: barColor.replace('bg-','').replace('-500','').replace('slate-300', 'gray')}}>
                        {workload > 0 ? `${utilization.toFixed(0)}% Utilized` : 'Idle'}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                        {workloadInMeters.toLocaleString()} / {capacity.toLocaleString()} m
                    </p>
                 </div>
            </div>
        </div>
    );
};


const FlowArrow: React.FC<{direction?: 'down' | 'right'}> = ({direction = 'down'}) => {
    if (direction === 'right') {
         return <div className="flex-shrink-0 w-8 h-full flex items-center justify-center text-slate-400">&rarr;</div>
    }
    return <div className="w-full h-8 flex items-center justify-center text-slate-400">&darr;</div>;
}

export const ProductionFlow: React.FC<{ data: MachineWorkload[] }> = ({ data }) => {
    const workloadMap = new Map(data.map(item => [item.name, item]));

    const getMachineData = (name: string) => {
        const machineData = workloadMap.get(name);
        return {
            name,
            workload: machineData?.workload || 0,
            capacity: machineData?.capacity || 0,
        };
    }
    
    const highlightedMachines = ["Ram", "Ram Finissaggio", "Asciugamento per finissaggio"];

    return (
        <div className="bg-slate-50 p-4 sm:p-6 rounded-lg shadow-inner border border-slate-200">
            <div className="mb-6 text-center">
                 <h3 className="text-xl font-semibold text-slate-700">Production Line Flow & Workload</h3>
                 <p className="text-slate-500">Overview of current workload compared to weekly capacity in meters.</p>
            </div>
           
            <div className="flex flex-col items-center w-full">
                {/* Initial Stages */}
                <MachineCard {...getMachineData("Magazzino Merce a Disporre")} />
                <FlowArrow />
                <MachineCard {...getMachineData("Arrotolatura")} />
                <FlowArrow />
                <MachineCard {...getMachineData("Bruciapelo")} />
                <FlowArrow />
                <MachineCard {...getMachineData("Stoccaggio per maturazione")} />
                <FlowArrow />
                <MachineCard {...getMachineData("Candeggio Naturale / Lavaggio")} />
                <FlowArrow />

                {/* Branching Point */}
                <div className="w-full flex flex-col md:flex-row justify-center items-start gap-4">
                    {/* Left Branch */}
                    <div className="flex flex-col items-center flex-1 w-full md:w-auto">
                        <MachineCard {...getMachineData("Bianco ottico")} />
                        <FlowArrow />
                        <MachineCard {...getMachineData("Ram")} isHighlighted={true}/>
                        <FlowArrow />
                        <MachineCard {...getMachineData("Garze")} />
                    </div>
                    {/* Right Branch - Main Flow */}
                    <div className="flex flex-col items-center flex-1 w-full md:w-auto">
                        <MachineCard {...getMachineData("Tintoria Foulard")} />
                        <FlowArrow />
                        <MachineCard {...getMachineData("Stoccaggio")} />
                        <FlowArrow />
                        <MachineCard {...getMachineData("Lavaggio")} />
                    </div>
                </div>

                <FlowArrow />
                {/* Merging Point */}
                <MachineCard {...getMachineData("Asciugamento per finissaggio")} isHighlighted={true}/>
                <FlowArrow />
                <MachineCard {...getMachineData("Garzatrice")} />
                <FlowArrow />
                <MachineCard {...getMachineData("Ram Finissaggio")} isHighlighted={true}/>
                <FlowArrow />

                {/* Final Parallel Stages */}
                <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-4">
                    <MachineCard {...getMachineData("Calandra")} />
                    <MachineCard {...getMachineData("Falda")} />
                </div>
                
                <FlowArrow />
                <MachineCard {...getMachineData("Specola/Piegatrice/Conf Pez.")} />
                <FlowArrow />
                <MachineCard {...getMachineData("Spedizione")} />
            </div>
        </div>
    );
};