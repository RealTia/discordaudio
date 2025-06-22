# DisableAudioProcessing - Vencord Plugin

This Vencord plugin disables Discord's audio processing for a more natural microphone signal.

## Features

- **Disable Audio Processing**: Completely disables all audio processing
- **Disable Noise Suppression**: Removes automatic noise suppression
- **Disable Echo Cancellation**: Disables echo cancellation
- **Disable Automatic Gain Control**: Disables automatic volume adjustment

## Installation

1. **Install Vencord** (if not already installed):
   - Visit [Vencord.dev](https://vencord.dev) and follow the installation instructions

2. **Install Plugin**:
   - Copy the `DisableAudioProcessing.ts` file to the Vencord plugins folder:
     - **Windows**: `%APPDATA%\Vencord\userplugins\`
     - **macOS**: `~/Library/Application Support/Vencord/plugins/`
     - **Linux**: `~/.config/Vencord/plugins/`

3. **Restart Discord**:
   - Restart Discord completely so the plugin loads

## Usage

1. **Enable Plugin**:
   - Open Discord
   - Go to Settings → Vencord → Plugins
   - Enable "DisableAudioProcessing"

2. **Configure Settings**:
   - In the plugin section, you'll find various options:
     - **Disable Audio Processing**: Disables all audio processing at once
     - **Disable Noise Suppression**: Only turn off noise suppression
     - **Disable Echo Cancellation**: Only turn off echo cancellation
     - **Disable Automatic Gain Control**: Only turn off automatic volume adjustment

3. **Apply Changes**:
   - Changes are applied automatically
   - A Discord restart may be required

## Recommended Settings

For the most natural microphone signal:
- ✅ **Disable Audio Processing**: Enabled
- ✅ **Disable Noise Suppression**: Enabled
- ✅ **Disable Echo Cancellation**: Enabled
- ✅ **Disable Automatic Gain Control**: Enabled

## Notes

- **Microphone Quality**: This plugin works best with high-quality microphones
- **Environment**: In noisy environments, you may experience more background noise
- **Discord Settings**: Make sure your Discord audio settings are properly configured
- **Restart**: A Discord restart may be required for all changes to take full effect

## Troubleshooting

**Plugin not loading:**
- Check if the file is in the correct folder
- Make sure Vencord is properly installed
- Check Discord console for error messages

**Audio settings not being applied:**
- Restart Discord completely
- Check if the plugin is enabled in Vencord settings
- Test different microphone settings in Discord

**Microphone not working:**
- Temporarily disable the plugin
- Check your Discord audio settings
- Make sure the correct microphone is selected

## Technical Details

The plugin works by:
1. **MediaEngine Interaction**: Accesses Discord's internal MediaEngine
2. **Audio Constraints**: Sets WebRTC audio constraints for the microphone
3. **Discord Integration**: Overrides Discord's internal audio settings
4. **Settings Management**: Saves and restores original settings

## Support

For problems or questions:
- Check Discord console for error messages
- Make sure all dependencies are properly installed
- Test the plugin in a fresh Discord installation

## License

This plugin is open source and can be freely used and modified. 
