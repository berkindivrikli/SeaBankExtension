# SeaBank SQL Shortcuts

Custom keyboard shortcuts for SQL query execution via the Microsoft MSSQL extension. Define SQL templates, map them to `Ctrl+0` through `Ctrl+9`, and run them from a `.sql` editor using the current selection.

## Features

- Sidebar view for managing SQL shortcuts
- Ten shortcut slots: `Ctrl+0` through `Ctrl+9`
- `{selection}` placeholder support in SQL templates
- Query execution through the Microsoft MSSQL extension
- Per-user shortcut storage via VS Code global state

## Requirements

- VS Code 1.85 or newer
- [Microsoft MSSQL extension](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql)
- An active MSSQL connection in the current SQL editor

## Usage

1. Install and connect with the Microsoft MSSQL extension.
2. Open the SeaBank SQL Shortcuts view from the Activity Bar.
3. Click the add button and choose a shortcut slot.
4. Enter a SQL template. Use `{selection}` where selected text should be inserted.
5. Open a `.sql` file, select text, and press the assigned shortcut.

Example template:

```sql
SELECT TOP 100 *
FROM {selection}
```

## Example Shortcuts

| Shortcut | Query Template |
| --- | --- |
| Ctrl+1 | `SELECT TOP 100 * FROM {selection}` |
| Ctrl+2 | `SELECT COUNT(*) FROM {selection}` |
| Ctrl+3 | `SP_HELP {selection}` |
| Ctrl+4 | `SELECT * FROM {selection} WHERE 1=0` |

## Development

```bash
npm install
npm run compile
```

Press `F5` in VS Code to launch an Extension Development Host.

## Packaging

```bash
npm run compile
npx @vscode/vsce package
```

## License

MIT
