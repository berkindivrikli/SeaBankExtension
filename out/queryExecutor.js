"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryExecutor = void 0;
const vscode = __importStar(require("vscode"));
class QueryExecutor {
    /**
     * Executes a SQL query using the MSSQL extension.
     * Runs the query invisibly using the current editor's connection
     * and displays results in the standard MSSQL results panel.
     */
    async execute(query) {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active SQL editor. Open a .sql file connected to a database first.');
                return;
            }
            // Use mssql.runQueryString which executes a query string directly
            // using the connection of the current active editor — no new tab needed
            try {
                await vscode.commands.executeCommand('mssql.runQueryString', query);
                return;
            }
            catch {
                // mssql.runQueryString may not exist in all versions
            }
            // Fallback: temporarily replace selection, run, then restore
            // Save original content and selection
            const originalSelection = editor.selection;
            const originalText = editor.document.getText(originalSelection);
            const hasSelection = !originalSelection.isEmpty;
            // If there's a selection, we'll use an approach that inserts a temp query
            // at the end of the document, selects it, runs it, then removes it
            const doc = editor.document;
            const lastLine = doc.lineAt(doc.lineCount - 1);
            const endPos = lastLine.range.end;
            const separator = '\n-- [SeaBank Shortcut Query]\n';
            const tempText = separator + query + '\n';
            // Insert temp query at end of document
            const inserted = await editor.edit(editBuilder => {
                editBuilder.insert(endPos, tempText);
            });
            if (!inserted) {
                vscode.window.showErrorMessage('SeaBank: Could not insert query into document.');
                return;
            }
            // Select only the inserted query (not the separator comment)
            const queryStartLine = doc.lineCount - query.split('\n').length - 1;
            const queryEndLine = doc.lineCount - 2; // before trailing newline
            const queryStartPos = new vscode.Position(queryStartLine, 0);
            const queryEndPos = new vscode.Position(queryEndLine, doc.lineAt(queryEndLine).text.length);
            editor.selection = new vscode.Selection(queryStartPos, queryEndPos);
            // Small delay then execute
            await new Promise(resolve => { globalThis.setTimeout(resolve, 200); });
            try {
                await vscode.commands.executeCommand('mssql.runQuery');
            }
            catch {
                vscode.window.showErrorMessage('Could not execute query. Make sure MSSQL extension is installed and you are connected to a database.');
            }
            // Wait for results to start loading, then clean up the temp query
            await new Promise(resolve => { globalThis.setTimeout(resolve, 500); });
            // Remove the inserted temp text
            const fullInsertStart = endPos;
            const fullInsertEnd = new vscode.Position(doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
            await editor.edit(editBuilder => {
                editBuilder.delete(new vscode.Range(fullInsertStart, fullInsertEnd));
            });
            // Restore original selection
            if (hasSelection) {
                editor.selection = originalSelection;
            }
            else {
                const cursorPos = originalSelection.active;
                editor.selection = new vscode.Selection(cursorPos, cursorPos);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`SeaBank SQL Shortcuts: ${error.message || error}`);
        }
    }
}
exports.QueryExecutor = QueryExecutor;
//# sourceMappingURL=queryExecutor.js.map