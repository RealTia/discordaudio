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

export default definePlugin({
    name: "DisableAudioProcessing",
    description: "Disables Discord's new audio processing for a more natural microphone signal",
    authors: [Devs.definiert],
    dependencies: [],
    options: {
        disableAudioProcessing: {
            type: OptionType.BOOLEAN,
            description: "Disable audio processing",
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
        }
    },

    start() {
        this.applyAudioSettings();
    },

    stop() {
        // Restore default settings
        this.restoreDefaultSettings();
    },

    applyAudioSettings() {
        try {
            const mediaEngine = MediaEngineStore?.getMediaEngine?.();
            if (!mediaEngine) {
                console.warn("[DisableAudioProcessing] MediaEngine not found");
                return;
            }

            // Get current settings
            const settings = this.settings;

            // Create audio constraints based on plugin settings
            const audioConstraints: MediaTrackConstraints = {
                echoCancellation: !settings.disableEchoCancellation,
                noiseSuppression: !settings.disableNoiseSuppression,
                autoGainControl: !settings.disableAutomaticGainControl,
            };

            // If audio processing should be completely disabled
            if (settings.disableAudioProcessing) {
                audioConstraints.echoCancellation = false;
                audioConstraints.noiseSuppression = false;
                audioConstraints.autoGainControl = false;
            }

            // Save original settings for restoration
            if (!this.originalSettings) {
                this.originalSettings = {
                    echoCancellation: audioConstraints.echoCancellation,
                    noiseSuppression: audioConstraints.noiseSuppression,
                    autoGainControl: audioConstraints.autoGainControl,
                };
            }

            // Apply new settings
            this.updateMediaEngineSettings(mediaEngine, audioConstraints);

        } catch (error) {
            console.error("[DisableAudioProcessing] Error applying audio settings:", error);
        }
    },

    updateMediaEngineSettings(mediaEngine: any, constraints: MediaTrackConstraints) {
        try {
            // Try different methods to update settings
            if (mediaEngine.setAudioConstraints) {
                mediaEngine.setAudioConstraints(constraints);
            } else if (mediaEngine.updateAudioConstraints) {
                mediaEngine.updateAudioConstraints(constraints);
            } else if (mediaEngine.setMediaConstraints) {
                mediaEngine.setMediaConstraints({ audio: constraints });
            }

            // Also update Discord's internal audio settings
            this.updateDiscordAudioSettings(constraints);

        } catch (error) {
            console.error("[DisableAudioProcessing] Error updating MediaEngine:", error);
        }
    },

    updateDiscordAudioSettings(constraints: MediaTrackConstraints) {
        try {
            // Find Discord's audio settings
            const audioSettings = findByPropsLazy("getAudioInputDevice");
            if (audioSettings) {
                // Try to override Discord's audio settings
                if (audioSettings.setAudioInputDevice) {
                    // Get current audio device
                    const currentDevice = audioSettings.getAudioInputDevice?.();
                    if (currentDevice) {
                        // Set device with new constraints
                        audioSettings.setAudioInputDevice(currentDevice, constraints);
                    }
                }
            }
        } catch (error) {
            console.error("[DisableAudioProcessing] Error updating Discord audio settings:", error);
        }
    },

    restoreDefaultSettings() {
        if (!this.originalSettings) return;

        try {
            const mediaEngine = MediaEngineStore?.getMediaEngine?.();
            if (mediaEngine) {
                this.updateMediaEngineSettings(mediaEngine, this.originalSettings);
            }
        } catch (error) {
            console.error("[DisableAudioProcessing] Error restoring default settings:", error);
        }
    },

    onSettingsChange() {
        // Apply new settings when plugin settings change
        this.applyAudioSettings();
    },
}); 
