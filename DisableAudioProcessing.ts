
/*
* Vencord, a Discord client mod
* Copyright (c) 2025 Vendicated and contributors*
* SPDX-License-Identifier: GPL-3.0-or-later
*/

// @ts-ignore - Vencord-specific imports
import { Devs } from "@utils/constants";
// @ts-ignore - Vencord-specific imports
import definePlugin, { OptionType } from "@utils/types";
// @ts-ignore - Vencord-specific imports
import { findByPropsLazy } from "@webpack";

const MediaEngineStore = findByPropsLazy("getMediaEngine");
const AudioSettingsStore = findByPropsLazy("getAudioInputDevice");

export default definePlugin({
    name: "DisableAudioProcessing",
    description: "Completely disables Discord's audio processing for 192kHz/24bit audio support",
    authors: [Devs.YourName],
    dependencies: [],
    options: {
        disableAllProcessing: {
            type: OptionType.BOOLEAN,
            description: "Disable ALL audio processing (recommended)",
            default: true,
        },
        forceHighQuality: {
            type: OptionType.BOOLEAN,
            description: "Force 192kHz/24bit audio quality",
            default: true,
        },
        disableNoiseSuppression: {
            type: OptionType.BOOLEAN,
            description: "Disable noise suppression",
            default: true,
        },
        disableEchoCancellation: {
            type: OptionType.BOOLEAN,
            description: "Disable echo cancellation",
            default: true,
        },
        disableAutomaticGainControl: {
            type: OptionType.BOOLEAN,
            description: "Disable automatic gain control",
            default: true,
        },
        disableHighPassFilter: {
            type: OptionType.BOOLEAN,
            description: "Disable high-pass filter",
            default: true,
        }
    },

    start() {
        console.log("[DisableAudioProcessing] Plugin started - applying full audio processing disable");
        this.applyCompleteAudioDisable();
    },

    stop() {
        console.log("[DisableAudioProcessing] Plugin stopped - restoring original settings");
        this.restoreOriginalSettings();
    },

    applyCompleteAudioDisable() {
        try {
            // Get current settings
            const settings = this.settings;
            
            // Create high-quality audio constraints
            const highQualityConstraints = {
                // Disable all processing
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                highPassFilter: false,
                
                // Force high quality audio
                sampleRate: 192000,
                sampleSize: 24,
                channelCount: 2,
                
                // Additional quality settings
                latency: 0,
                volume: 1.0,
                googEchoCancellation: false,
                googAutoGainControl: false,
                googNoiseSuppression: false,
                googHighpassFilter: false,
                googTypingNoiseDetection: false,
                googAudioMirroring: false,
                googAudioProcessing: false
            };

            // Apply constraints based on settings
            if (settings.disableAllProcessing) {
                // Apply all disables
                this.applyAudioConstraints(highQualityConstraints);
            } else {
                // Apply selective disables
                const selectiveConstraints = {
                    echoCancellation: !settings.disableEchoCancellation,
                    noiseSuppression: !settings.disableNoiseSuppression,
                    autoGainControl: !settings.disableAutomaticGainControl,
                    highPassFilter: !settings.disableHighPassFilter,
                };
                
                if (settings.forceHighQuality) {
                    Object.assign(selectiveConstraints, {
                        sampleRate: 192000,
                        sampleSize: 24,
                        channelCount: 2
                    });
                }
                
                this.applyAudioConstraints(selectiveConstraints);
            }

            // Override Discord's internal audio processing
            this.overrideDiscordAudioProcessing();
            
            // Override getUserMedia for complete control
            this.overrideGetUserMedia();

        } catch (error) {
            console.error("[DisableAudioProcessing] Error applying complete audio disable:", error);
        }
    },

    applyAudioConstraints(constraints) {
        try {
            // Store original settings for restoration
            if (!this.originalSettings) {
                this.originalSettings = { ...constraints };
            }

            // Apply to MediaEngine if available
            const mediaEngine = MediaEngineStore?.getMediaEngine?.();
            if (mediaEngine) {
                if (mediaEngine.setAudioConstraints) {
                    mediaEngine.setAudioConstraints(constraints);
                } else if (mediaEngine.updateAudioConstraints) {
                    mediaEngine.updateAudioConstraints(constraints);
                } else if (mediaEngine.setMediaConstraints) {
                    mediaEngine.setMediaConstraints({ audio: constraints });
                }
                console.log("[DisableAudioProcessing] Applied constraints to MediaEngine");
            }

            // Apply to Discord's audio settings
            const audioSettings = AudioSettingsStore;
            if (audioSettings) {
                if (audioSettings.setAudioInputDevice) {
                    const currentDevice = audioSettings.getAudioInputDevice?.();
                    if (currentDevice) {
                        audioSettings.setAudioInputDevice(currentDevice, constraints);
                        console.log("[DisableAudioProcessing] Applied constraints to Discord audio settings");
                    }
                }
            }

        } catch (error) {
            console.error("[DisableAudioProcessing] Error applying audio constraints:", error);
        }
    },

    overrideDiscordAudioProcessing() {
        try {
            // Find and override Discord's audio processing modules
            const audioModules = findByPropsLazy("setAudioProcessingEnabled", "setNoiseSuppression", "setEchoCancellation");
            
            if (audioModules) {
                // Disable all audio processing
                if (audioModules.setAudioProcessingEnabled) {
                    audioModules.setAudioProcessingEnabled(false);
                }
                if (audioModules.setNoiseSuppression) {
                    audioModules.setNoiseSuppression(false);
                }
                if (audioModules.setEchoCancellation) {
                    audioModules.setEchoCancellation(false);
                }
                if (audioModules.setAutomaticGainControl) {
                    audioModules.setAutomaticGainControl(false);
                }
                console.log("[DisableAudioProcessing] Overrode Discord audio processing modules");
            }

        } catch (error) {
            console.error("[DisableAudioProcessing] Error overriding Discord audio processing:", error);
        }
    },

    overrideGetUserMedia() {
        try {
            const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
            
            navigator.mediaDevices.getUserMedia = async function(constraints: MediaStreamConstraints) {
                console.log("[DisableAudioProcessing] Intercepting getUserMedia call");
                
                if (constraints.audio) {
                    // Force high-quality audio settings
                    const highQualityAudio = {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false,
                        highPassFilter: false,
                        sampleRate: 192000,
                        sampleSize: 24,
                        channelCount: 2,
                        googEchoCancellation: false,
                        googAutoGainControl: false,
                        googNoiseSuppression: false,
                        googHighpassFilter: false,
                        googTypingNoiseDetection: false,
                        googAudioMirroring: false,
                        googAudioProcessing: false
                    };

                    if (typeof constraints.audio === 'object') {
                        constraints.audio = { ...constraints.audio, ...highQualityAudio };
                    } else {
                        constraints.audio = highQualityAudio;
                    }
                }
                
                console.log("[DisableAudioProcessing] Modified getUserMedia constraints:", constraints);
                return originalGetUserMedia.call(this, constraints);
            };

            console.log("[DisableAudioProcessing] getUserMedia override applied");

        } catch (error) {
            console.error("[DisableAudioProcessing] Error overriding getUserMedia:", error);
        }
    },

    restoreOriginalSettings() {
        if (!this.originalSettings) return;

        try {
            const mediaEngine = MediaEngineStore?.getMediaEngine?.();
            if (mediaEngine) {
                this.applyAudioConstraints(this.originalSettings);
            }
        } catch (error) {
            console.error("[DisableAudioProcessing] Error restoring original settings:", error);
        }
    },

    onSettingsChange() {
        console.log("[DisableAudioProcessing] Settings changed - reapplying audio disable");
        this.applyCompleteAudioDisable();
    },
}); 
