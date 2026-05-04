import * as vscode from 'vscode';

export interface SqlShortcut {
    keybinding: string;   // e.g. "ctrl+3"
    query: string;        // e.g. "SELECT TOP 10 * FROM {selection}"
    label: string;        // display name
}

export class ShortcutManager {
    private static readonly STORAGE_KEY = 'seabank.shortcuts';
    private shortcuts: SqlShortcut[] = [];

    constructor(private context: vscode.ExtensionContext) {
        this.load();
    }

    private load() {
        this.shortcuts = this.context.globalState.get<SqlShortcut[]>(ShortcutManager.STORAGE_KEY) || [];
    }

    private save() {
        this.context.globalState.update(ShortcutManager.STORAGE_KEY, this.shortcuts);
    }

    getAll(): SqlShortcut[] {
        return [...this.shortcuts];
    }

    getByKeybinding(keybinding: string): SqlShortcut | undefined {
        return this.shortcuts.find(s => s.keybinding === keybinding);
    }

    add(shortcut: SqlShortcut) {
        // Remove existing with same keybinding
        this.shortcuts = this.shortcuts.filter(s => s.keybinding !== shortcut.keybinding);
        this.shortcuts.push(shortcut);
        this.shortcuts.sort((a, b) => a.keybinding.localeCompare(b.keybinding));
        this.save();
    }

    update(keybinding: string, updates: Partial<SqlShortcut>) {
        const idx = this.shortcuts.findIndex(s => s.keybinding === keybinding);
        if (idx >= 0) {
            this.shortcuts[idx] = { ...this.shortcuts[idx], ...updates };
            this.save();
        }
    }

    remove(keybinding: string) {
        this.shortcuts = this.shortcuts.filter(s => s.keybinding !== keybinding);
        this.save();
    }
}
