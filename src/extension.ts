import * as vscode from 'vscode';
import { ShortcutManager } from './shortcutManager';
import { ShortcutTreeProvider } from './shortcutTreeProvider';
import { QueryExecutor } from './queryExecutor';

export function activate(context: vscode.ExtensionContext) {
    const shortcutManager = new ShortcutManager(context);
    const queryExecutor = new QueryExecutor();
    const treeProvider = new ShortcutTreeProvider(shortcutManager);

    const treeView = vscode.window.createTreeView('seabankShortcutsList', {
        treeDataProvider: treeProvider,
    });
    context.subscriptions.push(treeView);

    // Add shortcut command
    context.subscriptions.push(
        vscode.commands.registerCommand('seabank.addShortcut', async () => {
            const slotKeys = ['ctrl+0','ctrl+1','ctrl+2','ctrl+3','ctrl+4','ctrl+5','ctrl+6','ctrl+7','ctrl+8','ctrl+9'];
            const existing = shortcutManager.getAll();
            const usedSlots = new Set(existing.map(s => s.keybinding));
            const available = slotKeys.filter(k => !usedSlots.has(k));

            if (available.length === 0) {
                vscode.window.showWarningMessage('All 10 shortcut slots are in use. Delete one first.');
                return;
            }

            const keybinding = await vscode.window.showQuickPick(available, {
                placeHolder: 'Select key combination for this shortcut'
            });
            if (!keybinding) { return; }

            const query = await vscode.window.showInputBox({
                prompt: 'Enter SQL query template. Use {selection} where selected text should be inserted.',
                placeHolder: 'SELECT TOP 10 * FROM {selection}',
                value: 'SELECT TOP 10 * FROM {selection}'
            });
            if (!query) { return; }

            const label = await vscode.window.showInputBox({
                prompt: 'Enter a label/name for this shortcut (optional)',
                placeHolder: 'Top 10 rows'
            });

            shortcutManager.add({ keybinding, query, label: label || query });
            treeProvider.refresh();
            vscode.window.showInformationMessage(`Shortcut ${keybinding} added!`);
        })
    );

    // Edit shortcut command
    context.subscriptions.push(
        vscode.commands.registerCommand('seabank.editShortcut', async (item) => {
            let keybinding: string | undefined = item?.keybinding;

            if (!keybinding) {
                const all = shortcutManager.getAll();
                if (all.length === 0) {
                    vscode.window.showInformationMessage('No shortcuts defined yet.');
                    return;
                }

                const picked = await vscode.window.showQuickPick(
                    all.map(s => `${s.keybinding.toUpperCase()} — ${s.label}`),
                    { placeHolder: 'Select a shortcut to edit' }
                );
                keybinding = picked ? picked.split(' — ')[0].toLowerCase() : undefined;
            }

            if (!keybinding) { return; }
            const shortcut = shortcutManager.getByKeybinding(keybinding);
            if (!shortcut) { return; }

            const query = await vscode.window.showInputBox({
                prompt: 'Edit SQL query template. Use {selection} for selected text.',
                value: shortcut.query
            });
            if (!query) { return; }

            const label = await vscode.window.showInputBox({
                prompt: 'Edit label',
                value: shortcut.label
            });

            shortcutManager.update(shortcut.keybinding, { query, label: label || query });
            treeProvider.refresh();
        })
    );

    // Delete shortcut command
    context.subscriptions.push(
        vscode.commands.registerCommand('seabank.deleteShortcut', async (item) => {
            let keybinding: string | undefined = item?.keybinding;

            if (!keybinding) {
                const all = shortcutManager.getAll();
                if (all.length === 0) {
                    vscode.window.showInformationMessage('No shortcuts defined yet.');
                    return;
                }

                const picked = await vscode.window.showQuickPick(
                    all.map(s => `${s.keybinding.toUpperCase()} — ${s.label}`),
                    { placeHolder: 'Select a shortcut to delete' }
                );
                keybinding = picked ? picked.split(' — ')[0].toLowerCase() : undefined;
            }

            if (!keybinding) { return; }
            const confirm = await vscode.window.showWarningMessage(
                `Delete shortcut ${keybinding}?`, { modal: true }, 'Delete'
            );
            if (confirm === 'Delete') {
                shortcutManager.remove(keybinding);
                treeProvider.refresh();
            }
        })
    );

    // Register the 10 shortcut slot commands (ctrl+0 through ctrl+9)
    for (let i = 0; i <= 9; i++) {
        context.subscriptions.push(
            vscode.commands.registerCommand(`seabank.runShortcut${i}`, async () => {
                const keybinding = `ctrl+${i}`;
                const shortcut = shortcutManager.getByKeybinding(keybinding);
                if (!shortcut) {
                    vscode.window.showInformationMessage(`No SQL shortcut assigned to ${keybinding}. Open the SQL Shortcuts panel to add one.`);
                    return;
                }

                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showWarningMessage('No active editor.');
                    return;
                }

                const selection = editor.document.getText(editor.selection);
                const finalQuery = shortcut.query.replace(/\{selection\}/g, selection);

                await queryExecutor.execute(finalQuery);
            })
        );
    }

    vscode.window.showInformationMessage('SeaBank SQL Shortcuts activated!');
}

export function deactivate() {}
