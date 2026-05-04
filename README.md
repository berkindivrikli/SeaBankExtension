# SeaBank SQL Shortcuts

Custom keyboard shortcuts for SQL query execution via MSSQL — just like SSMS but in VS Code!

## Features

- **Sidebar Panel**: Click the SQL Shortcuts icon in the activity bar to see all your shortcuts
- **Add Shortcuts**: Map `Ctrl+0` through `Ctrl+9` to any SQL query template
- **Selection Substitution**: Use `{selection}` in your query — it gets replaced with whatever text you've selected
- **MSSQL Integration**: Results appear in the MSSQL results panel, same as running a normal query

## How to Use

1. Install the [MSSQL extension](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql) and connect to your database
2. Click the **SQL Shortcuts** icon in the sidebar (activity bar)
3. Click the **+** button to add a new shortcut
4. Pick a key combination (e.g. `ctrl+3`)
5. Enter your SQL template, using `{selection}` where the selected text should go:
   ```
   SELECT TOP 10 * FROM {selection}
   ```
6. Open a `.sql` file, select a table name, press `Ctrl+3` → results appear!

## Shortcut Slots

The extension provides 10 shortcut slots: `Ctrl+0` through `Ctrl+9`. These keybindings are only active when you're editing a SQL file.

## Examples

| Shortcut | Query Template |
|----------|---------------|
| Ctrl+1 | `SELECT TOP 100 * FROM {selection}` |
| Ctrl+2 | `SELECT COUNT(*) FROM {selection}` |
| Ctrl+3 | `SP_HELP {selection}` |
| Ctrl+4 | `SELECT * FROM {selection} WHERE 1=0` |

## Requirements

- VS Code 1.85+
- [MSSQL Extension](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql) installed and connected

## Building & Publishing

```bash
npm install
npm run compile

# Package as .vsix
npx @vscode/vsce package

# Publish to marketplace
npx @vscode/vsce publish
```

## Development

1. `npm install`
2. `npm run compile`
3. Press `F5` to launch Extension Development Host
4. Open a `.sql` file and test your shortcuts

## License

MIT
