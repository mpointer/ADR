import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Check } from 'lucide-react';

export function TourOverlay({ isOpen, onClose, steps, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !steps[currentStep]) return;

        const step = steps[currentStep];

        // If step has an action (e.g., change view), execute it
        if (step.action) {
            step.action();
        }

        // Wait for DOM update then find element
        const timer = setTimeout(() => {
            const element = document.querySelector(step.selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                setPosition({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                });
            } else {
                // Fallback to center if element not found
                setPosition(null);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [currentStep, isOpen, steps]);

    if (!isOpen) return null;

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
            onClose();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Backdrop with hole */}
            <div className="absolute inset-0 bg-black/50 transition-all duration-500" style={{
                clipPath: position
                    ? `polygon(0% 0%, 0% 100%, ${position.left}px 100%, ${position.left}px ${position.top}px, ${position.left + position.width}px ${position.top}px, ${position.left + position.width}px ${position.top + position.height}px, ${position.left}px ${position.top + position.height}px, ${position.left}px 100%, 100% 100%, 100% 0%)`
                    : 'none'
            }}></div>

            {/* Spotlight Border */}
            {position && (
                <div
                    className="absolute border-2 border-cyan-400 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-500"
                    style={{
                        top: position.top - 4,
                        left: position.left - 4,
                        width: position.width + 8,
                        height: position.height + 8,
                    }}
                />
            )}

            {/* Tooltip Card */}
            <div
                className="absolute pointer-events-auto transition-all duration-500"
                style={{
                    top: position ? position.top + position.height + 20 : '50%',
                    left: position ? position.left : '50%',
                    transform: position ? 'none' : 'translate(-50%, -50%)',
                    maxWidth: '400px'
                }}
            >
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <X size={16} />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        {step.description}
                    </p>

                    <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-cyan-500' : 'w-1.5 bg-gray-200 dark:bg-neutral-700'}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
                        >
                            {isLastStep ? 'Finish Tour' : 'Next'}
                            {isLastStep ? <Check size={16} /> : <ArrowRight size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
