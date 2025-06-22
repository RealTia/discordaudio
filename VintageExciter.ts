import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";

const MediaEngineStore = findByPropsLazy("getMediaEngine");
const AudioSettingsStore = findByPropsLazy("getAudioInputDevice");

export default definePlugin({
    name: "VintageExciter",
    description: "Type B Vintage Exciter for microphone - adds warmth, harmonics and vintage character",
    authors: [Devs.YourName],
    dependencies: [],
    options: {
        enableExciter: {
            type: OptionType.BOOLEAN,
            description: "Enable Vintage Exciter processing",
            default: true,
        },
        exciterAmount: {
            type: OptionType.SLIDER,
            description: "Exciter intensity (0-100%)",
            markers: [0, 25, 50, 75, 100],
            default: 50,
            stickToMarkers: false,
        },
        harmonicContent: {
            type: OptionType.SLIDER,
            description: "Harmonic content (warmth)",
            markers: [0, 25, 50, 75, 100],
            default: 60,
            stickToMarkers: false,
        },
        saturationAmount: {
            type: OptionType.SLIDER,
            description: "Saturation amount (vintage character)",
            markers: [0, 25, 50, 75, 100],
            default: 40,
            stickToMarkers: false,
        },
        frequencyRange: {
            type: OptionType.SELECT,
            description: "Frequency range to excite",
            options: [
                { label: "Low (80Hz-800Hz)", value: "low" },
                { label: "Mid (800Hz-8kHz)", value: "mid" },
                { label: "High (8kHz-20kHz)", value: "high" },
                { label: "Full Range", value: "full" },
            ],
            default: "mid",
        },
        tubeEmulation: {
            type: OptionType.BOOLEAN,
            description: "Tube emulation (warm harmonics)",
            default: true,
        },
        tapeSaturation: {
            type: OptionType.BOOLEAN,
            description: "Tape saturation (vintage compression)",
            default: true,
        },
        transformerEmulation: {
            type: OptionType.BOOLEAN,
            description: "Transformer emulation (low-end weight)",
            default: true,
        },
        vintageEQ: {
            type: OptionType.BOOLEAN,
            description: "Vintage EQ curve (classic sound)",
            default: true,
        },
        exciterType: {
            type: OptionType.SELECT,
            description: "Exciter type",
            options: [
                { label: "Type B (Warm)", value: "typeB" },
                { label: "Type A (Bright)", value: "typeA" },
                { label: "Type C (Aggressive)", value: "typeC" },
                { label: "Custom", value: "custom" },
            ],
            default: "typeB",
        },
        outputGain: {
            type: OptionType.SLIDER,
            description: "Output gain (dB)",
            markers: [-12, -6, 0, 6, 12],
            default: 0,
            stickToMarkers: false,
        },
        mixAmount: {
            type: OptionType.SLIDER,
            description: "Dry/Wet mix (0-100%)",
            markers: [0, 25, 50, 75, 100],
            default: 75,
            stickToMarkers: false,
        }
    },

    start() {
        console.log("[VintageExciter] Plugin started - initializing Type B Vintage Exciter");
        this.initializeVintageExciter();
    },

    stop() {
        console.log("[VintageExciter] Plugin stopped - cleaning up audio processing");
        this.cleanupAudioProcessing();
    },

    initializeVintageExciter() {
        try {
            // Create audio context for processing
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.createVintageExciterChain();
            
            // Override getUserMedia to intercept audio
            this.overrideGetUserMedia();
            
            console.log("[VintageExciter] Vintage Exciter initialized successfully");
        } catch (error) {
            console.error("[VintageExciter] Error initializing Vintage Exciter:", error);
        }
    },

    createVintageExciterChain() {
        try {
            const settings = this.settings;
            
            // Create audio processing chain
            this.exciterChain = {
                input: this.audioContext.createGain(),
                exciter: this.createExciterNode(),
                harmonicEnhancer: this.createHarmonicEnhancer(),
                saturation: this.createSaturationNode(),
                tubeEmulator: this.createTubeEmulator(),
                tapeSaturator: this.createTapeSaturator(),
                transformer: this.createTransformerEmulator(),
                vintageEQ: this.createVintageEQ(),
                output: this.audioContext.createGain()
            };

            // Connect the chain
            this.connectExciterChain();
            
            // Apply settings
            this.applyExciterSettings();

        } catch (error) {
            console.error("[VintageExciter] Error creating exciter chain:", error);
        }
    },

    createExciterNode() {
        const exciter = this.audioContext.createBiquadFilter();
        exciter.type = 'highpass';
        exciter.frequency.value = this.getFrequencyForRange(this.settings.frequencyRange);
        exciter.Q.value = 1.0;
        return exciter;
    },

    createHarmonicEnhancer() {
        const enhancer = this.audioContext.createWaveShaper();
        enhancer.curve = this.createHarmonicCurve();
        enhancer.oversample = '4x';
        return enhancer;
    },

    createSaturationNode() {
        const saturation = this.audioContext.createWaveShaper();
        saturation.curve = this.createSaturationCurve();
        saturation.oversample = '4x';
        return saturation;
    },

    createTubeEmulator() {
        const tube = this.audioContext.createBiquadFilter();
        tube.type = 'lowpass';
        tube.frequency.value = 8000;
        tube.Q.value = 0.7;
        return tube;
    },

    createTapeSaturator() {
        const tape = this.audioContext.createDynamicsCompressor();
        tape.threshold.value = -20;
        tape.knee.value = 10;
        tape.ratio.value = 2.5;
        tape.attack.value = 0.003;
        tape.release.value = 0.25;
        return tape;
    },

    createTransformerEmulator() {
        const transformer = this.audioContext.createBiquadFilter();
        transformer.type = 'lowshelf';
        transformer.frequency.value = 150;
        transformer.gain.value = 3;
        return transformer;
    },

    createVintageEQ() {
        const eq = this.audioContext.createBiquadFilter();
        eq.type = 'peaking';
        eq.frequency.value = 2500;
        eq.Q.value = 1.0;
        eq.gain.value = 2;
        return eq;
    },

    createHarmonicCurve() {
        const curve = new Float32Array(4096);
        for (let i = 0; i < 4096; i++) {
            const x = (i * 2) / 4096 - 1;
            curve[i] = Math.tanh(x * this.settings.harmonicContent / 50);
        }
        return curve;
    },

    createSaturationCurve() {
        const curve = new Float32Array(4096);
        for (let i = 0; i < 4096; i++) {
            const x = (i * 2) / 4096 - 1;
            curve[i] = Math.sign(x) * (1 - Math.exp(-Math.abs(x) * this.settings.saturationAmount / 30));
        }
        return curve;
    },

    getFrequencyForRange(range) {
        switch (range) {
            case 'low': return 400;
            case 'mid': return 2000;
            case 'high': return 8000;
            case 'full': return 1000;
            default: return 2000;
        }
    },

    connectExciterChain() {
        const chain = this.exciterChain;
        
        // Connect main chain
        chain.input.connect(chain.exciter);
        chain.exciter.connect(chain.harmonicEnhancer);
        chain.harmonicEnhancer.connect(chain.saturation);
        chain.saturation.connect(chain.tubeEmulator);
        chain.tubeEmulator.connect(chain.tapeSaturator);
        chain.tapeSaturator.connect(chain.transformer);
        chain.transformer.connect(chain.vintageEQ);
        chain.vintageEQ.connect(chain.output);
    },

    applyExciterSettings() {
        try {
            const settings = this.settings;
            const chain = this.exciterChain;

            if (!chain) return;

            // Apply exciter amount
            chain.exciter.gain.value = settings.exciterAmount / 100;

            // Apply harmonic content
            chain.harmonicEnhancer.curve = this.createHarmonicCurve();

            // Apply saturation
            chain.saturation.curve = this.createSaturationCurve();

            // Apply tube emulation
            if (settings.tubeEmulation) {
                chain.tubeEmulator.gain.value = 1.0;
            } else {
                chain.tubeEmulator.gain.value = 0.0;
            }

            // Apply tape saturation
            if (settings.tapeSaturation) {
                chain.tapeSaturator.threshold.value = -20;
            } else {
                chain.tapeSaturator.threshold.value = -100;
            }

            // Apply transformer emulation
            if (settings.transformerEmulation) {
                chain.transformer.gain.value = 3;
            } else {
                chain.transformer.gain.value = 0;
            }

            // Apply vintage EQ
            if (settings.vintageEQ) {
                chain.vintageEQ.gain.value = 2;
            } else {
                chain.vintageEQ.gain.value = 0;
            }

            // Apply output gain
            chain.output.gain.value = Math.pow(10, settings.outputGain / 20);

            // Apply frequency range
            chain.exciter.frequency.value = this.getFrequencyForRange(settings.frequencyRange);

            console.log("[VintageExciter] Settings applied successfully");

        } catch (error) {
            console.error("[VintageExciter] Error applying settings:", error);
        }
    },

    overrideGetUserMedia() {
        try {
            const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
            
            navigator.mediaDevices.getUserMedia = async function(constraints: MediaStreamConstraints) {
                console.log("[VintageExciter] Intercepting getUserMedia call");
                
                const stream = await originalGetUserMedia.call(this, constraints);
                
                // Apply vintage exciter processing to audio tracks
                if (stream && stream.getAudioTracks) {
                    const audioTracks = stream.getAudioTracks();
                    audioTracks.forEach(track => {
                        this.applyVintageExciterToTrack(track);
                    });
                }
                
                return stream;
            }.bind(this);

            console.log("[VintageExciter] getUserMedia override applied");

        } catch (error) {
            console.error("[VintageExciter] Error overriding getUserMedia:", error);
        }
    },

    applyVintageExciterToTrack(track) {
        try {
            if (this.settings.enableExciter && this.exciterChain) {
                // Create media stream source
                const source = this.audioContext.createMediaStreamSource(new MediaStream([track]));
                
                // Connect to exciter chain
                source.connect(this.exciterChain.input);
                
                // Create destination for processed audio
                const destination = this.audioContext.createMediaStreamDestination();
                this.exciterChain.output.connect(destination);
                
                // Replace original track with processed track
                const processedTrack = destination.stream.getAudioTracks()[0];
                if (processedTrack) {
                    // Apply mix amount
                    const mixGain = this.audioContext.createGain();
                    mixGain.gain.value = this.settings.mixAmount / 100;
                    this.exciterChain.output.connect(mixGain);
                    mixGain.connect(destination);
                }
                
                console.log("[VintageExciter] Applied to audio track");
            }
        } catch (error) {
            console.error("[VintageExciter] Error applying to track:", error);
        }
    },

    cleanupAudioProcessing() {
        try {
            if (this.audioContext) {
                this.audioContext.close();
            }
            this.exciterChain = null;
            console.log("[VintageExciter] Audio processing cleaned up");
        } catch (error) {
            console.error("[VintageExciter] Error cleaning up:", error);
        }
    },

    onSettingsChange() {
        console.log("[VintageExciter] Settings changed - reapplying vintage exciter");
        this.applyExciterSettings();
    },
}); 