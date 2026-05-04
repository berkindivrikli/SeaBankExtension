import * as vscode from 'vscode';
import { ShortcutManager, SqlShortcut } from './shortcutManager';

export class ShortcutTreeItem extends vscode.TreeItem {
    public readonly keybinding: string;

    constructor(public readonly shortcut: SqlShortcut) {
        super(shortcut.label || shortcut.query, vscode.TreeItemCollapsibleState.None);
        this.keybinding = shortcut.keybinding;
        this.description = shortcut.keybinding.toUpperCase();
        this.tooltip = `${shortcut.keybinding.toUpperCase()}\n${shortcut.query}`;
        this.contextValue = 'shortcutItem';
    }
}

export class ShortcutTreeProvider implements vscode.TreeDataProvider<ShortcutTreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<ShortcutTreeItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private shortcutManager: ShortcutManager) {}

    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: ShortcutTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ShortcutTreeItem): ShortcutTreeItem[] {
        if (element) {
            return [];
        }

        const shortcuts = this.shortcutManager.getAll();
        return shortcuts.map(s => new ShortcutTreeItem(s));
    }
}
