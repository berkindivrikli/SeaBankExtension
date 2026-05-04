"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortcutManager = void 0;
class ShortcutManager {
    constructor(context) {
        this.context = context;
        this.shortcuts = [];
        this.load();
    }
    load() {
        this.shortcuts = this.context.globalState.get(ShortcutManager.STORAGE_KEY) || [];
    }
    save() {
        this.context.globalState.update(ShortcutManager.STORAGE_KEY, this.shortcuts);
    }
    getAll() {
        return [...this.shortcuts];
    }
    getByKeybinding(keybinding) {
        return this.shortcuts.find(s => s.keybinding === keybinding);
    }
    add(shortcut) {
        // Remove existing with same keybinding
        this.shortcuts = this.shortcuts.filter(s => s.keybinding !== shortcut.keybinding);
        this.shortcuts.push(shortcut);
        this.shortcuts.sort((a, b) => a.keybinding.localeCompare(b.keybinding));
        this.save();
    }
    update(keybinding, updates) {
        const idx = this.shortcuts.findIndex(s => s.keybinding === keybinding);
        if (idx >= 0) {
            this.shortcuts[idx] = { ...this.shortcuts[idx], ...updates };
            this.save();
        }
    }
    remove(keybinding) {
        this.shortcuts = this.shortcuts.filter(s => s.keybinding !== keybinding);
        this.save();
    }
}
exports.ShortcutManager = ShortcutManager;
ShortcutManager.STORAGE_KEY = 'seabank.shortcuts';
//# sourceMappingURL=shortcutManager.js.map