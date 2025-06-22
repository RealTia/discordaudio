# DisableAudioProcessing - Vencord Plugin

Dieses Vencord Plugin deaktiviert Discord's Audio Processing für ein natürlicheres Mikrofon-Signal.

## Features

- **Audio Processing deaktivieren**: Komplett deaktiviert alle Audio-Verarbeitung
- **Rauschunterdrückung deaktivieren**: Entfernt die automatische Rauschunterdrückung
- **Echo-Unterdrückung deaktivieren**: Deaktiviert die Echo-Unterdrückung
- **Automatische Verstärkungsregelung deaktivieren**: Deaktiviert die automatische Lautstärkeanpassung

## Installation

1. **Vencord installieren** (falls noch nicht geschehen):
   - Besuche [Vencord.dev](https://vencord.dev) und folge den Installationsanweisungen

2. **Plugin installieren**:
   - Kopiere die Datei `DisableAudioProcessing.ts` in den Vencord plugins Ordner:
     - **Windows**: `%APPDATA%\Vencord\plugins\`
     - **macOS**: `~/Library/Application Support/Vencord/plugins/`
     - **Linux**: `~/.config/Vencord/plugins/`

3. **Discord neustarten**:
   - Starte Discord vollständig neu, damit das Plugin geladen wird

## Verwendung

1. **Plugin aktivieren**:
   - Öffne Discord
   - Gehe zu Einstellungen → Vencord → Plugins
   - Aktiviere "DisableAudioProcessing"

2. **Einstellungen konfigurieren**:
   - Im Plugin-Bereich findest du verschiedene Optionen:
     - **Audio Processing deaktivieren**: Deaktiviert alle Audio-Verarbeitung auf einmal
     - **Rauschunterdrückung deaktivieren**: Nur die Rauschunterdrückung ausschalten
     - **Echo-Unterdrückung deaktivieren**: Nur die Echo-Unterdrückung ausschalten
     - **Automatische Verstärkungsregelung deaktivieren**: Nur die automatische Lautstärkeanpassung ausschalten

3. **Änderungen anwenden**:
   - Änderungen werden automatisch angewendet
   - Ein Neustart von Discord kann erforderlich sein

## Empfohlene Einstellungen

Für das natürlichste Mikrofon-Signal:
- ✅ **Audio Processing deaktivieren**: Aktiviert
- ✅ **Rauschunterdrückung deaktivieren**: Aktiviert
- ✅ **Echo-Unterdrückung deaktivieren**: Aktiviert
- ✅ **Automatische Verstärkungsregelung deaktivieren**: Aktiviert

## Hinweise

- **Mikrofon-Qualität**: Dieses Plugin funktioniert am besten mit hochwertigen Mikrofonen
- **Umgebung**: In lauten Umgebungen kann es zu mehr Hintergrundgeräuschen kommen
- **Discord-Einstellungen**: Stelle sicher, dass deine Discord Audio-Einstellungen korrekt konfiguriert sind
- **Neustart**: Ein Neustart von Discord kann erforderlich sein, damit alle Änderungen vollständig wirksam werden

## Troubleshooting

**Plugin wird nicht geladen:**
- Überprüfe, ob die Datei im richtigen Ordner liegt
- Stelle sicher, dass Vencord korrekt installiert ist
- Überprüfe die Discord-Konsole auf Fehlermeldungen

**Audio-Einstellungen werden nicht angewendet:**
- Starte Discord vollständig neu
- Überprüfe, ob das Plugin in den Vencord-Einstellungen aktiviert ist
- Teste verschiedene Mikrofon-Einstellungen in Discord

**Mikrofon funktioniert nicht mehr:**
- Deaktiviere das Plugin temporär
- Überprüfe deine Discord Audio-Einstellungen
- Stelle sicher, dass das richtige Mikrofon ausgewählt ist

## Technische Details

Das Plugin arbeitet durch:
1. **MediaEngine-Interaktion**: Greift auf Discord's interne MediaEngine zu
2. **Audio-Constraints**: Setzt WebRTC Audio-Constraints für das Mikrofon
3. **Discord-Integration**: Überschreibt Discord's interne Audio-Einstellungen
4. **Einstellungsverwaltung**: Speichert und stellt ursprüngliche Einstellungen wieder her

## Support

Bei Problemen oder Fragen:
- Überprüfe die Discord-Konsole auf Fehlermeldungen
- Stelle sicher, dass alle Abhängigkeiten korrekt installiert sind
- Teste das Plugin in einer neuen Discord-Installation

## Lizenz

Dieses Plugin ist Open Source und kann frei verwendet und modifiziert werden. 