// Vencord Plugin für Audio Processing Deaktivierung
// Diese Datei sollte in den Vencord plugins Ordner kopiert werden

// @ts-ignore - Vencord-spezifische Imports
import { Devs } from "@utils/constants";
// @ts-ignore - Vencord-spezifische Imports
import definePlugin, { OptionType } from "@utils/types";
// @ts-ignore - Vencord-spezifische Imports
import { findByPropsLazy } from "@webpack";

const MediaEngineStore = findByPropsLazy("getMediaEngine");

export default definePlugin({
    name: "DisableAudioProcessing",
    description: "Deaktiviert das neue Audio Processing für ein natürlicheres Mikrofon-Signal",
    authors: [Devs.YourName],
    dependencies: [],
    options: {
        disableAudioProcessing: {
            type: OptionType.BOOLEAN,
            description: "Audio Processing deaktivieren",
            default: true,
        },
        disableNoiseSuppression: {
            type: OptionType.BOOLEAN,
            description: "Rauschunterdrückung deaktivieren",
            default: true,
        },
        disableEchoCancellation: {
            type: OptionType.BOOLEAN,
            description: "Echo-Unterdrückung deaktivieren",
            default: true,
        },
        disableAutomaticGainControl: {
            type: OptionType.BOOLEAN,
            description: "Automatische Verstärkungsregelung deaktivieren",
            default: true,
        }
    },

    start() {
        this.applyAudioSettings();
    },

    stop() {
        // Stelle Standard-Einstellungen wieder her
        this.restoreDefaultSettings();
    },

    applyAudioSettings() {
        try {
            const mediaEngine = MediaEngineStore?.getMediaEngine?.();
            if (!mediaEngine) {
                console.warn("[DisableAudioProcessing] MediaEngine nicht gefunden");
                return;
            }

            // Hole aktuelle Einstellungen
            const settings = this.settings;

            // Erstelle Audio-Constraints basierend auf Plugin-Einstellungen
            const audioConstraints: MediaTrackConstraints = {
                echoCancellation: !settings.disableEchoCancellation,
                noiseSuppression: !settings.disableNoiseSuppression,
                autoGainControl: !settings.disableAutomaticGainControl,
            };

            // Wenn Audio Processing komplett deaktiviert werden soll
            if (settings.disableAudioProcessing) {
                audioConstraints.echoCancellation = false;
                audioConstraints.noiseSuppression = false;
                audioConstraints.autoGainControl = false;
            }

            // Speichere ursprüngliche Einstellungen für Wiederherstellung
            if (!this.originalSettings) {
                this.originalSettings = {
                    echoCancellation: audioConstraints.echoCancellation,
                    noiseSuppression: audioConstraints.noiseSuppression,
                    autoGainControl: audioConstraints.autoGainControl,
                };
            }

            // Wende neue Einstellungen an
            this.updateMediaEngineSettings(mediaEngine, audioConstraints);

        } catch (error) {
            console.error("[DisableAudioProcessing] Fehler beim Anwenden der Audio-Einstellungen:", error);
        }
    },

    updateMediaEngineSettings(mediaEngine: any, constraints: MediaTrackConstraints) {
        try {
            // Versuche verschiedene Methoden, um die Einstellungen zu aktualisieren
            if (mediaEngine.setAudioConstraints) {
                mediaEngine.setAudioConstraints(constraints);
            } else if (mediaEngine.updateAudioConstraints) {
                mediaEngine.updateAudioConstraints(constraints);
            } else if (mediaEngine.setMediaConstraints) {
                mediaEngine.setMediaConstraints({ audio: constraints });
            }

            // Aktualisiere auch Discord's interne Audio-Einstellungen
            this.updateDiscordAudioSettings(constraints);

        } catch (error) {
            console.error("[DisableAudioProcessing] Fehler beim Aktualisieren der MediaEngine:", error);
        }
    },

    updateDiscordAudioSettings(constraints: MediaTrackConstraints) {
        try {
            // Finde Discord's Audio-Einstellungen
            const audioSettings = findByPropsLazy("getAudioInputDevice");
            if (audioSettings) {
                // Versuche Discord's Audio-Einstellungen zu überschreiben
                if (audioSettings.setAudioInputDevice) {
                    // Hole aktuelles Audio-Device
                    const currentDevice = audioSettings.getAudioInputDevice?.();
                    if (currentDevice) {
                        // Setze Device mit neuen Constraints neu
                        audioSettings.setAudioInputDevice(currentDevice, constraints);
                    }
                }
            }
        } catch (error) {
            console.error("[DisableAudioProcessing] Fehler beim Aktualisieren der Discord Audio-Einstellungen:", error);
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
            console.error("[DisableAudioProcessing] Fehler beim Wiederherstellen der Standard-Einstellungen:", error);
        }
    },

    onSettingsChange() {
        // Wende neue Einstellungen an, wenn sich die Plugin-Einstellungen ändern
        this.applyAudioSettings();
    },
}); 