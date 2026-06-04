# Script to install recommended VS Code extensions
$extensions = @(
    "aaron-bond.better-comments",
    "bradlc.vscode-tailwindcss",
    "christian-kohler.path-intellisense",
    "cweijan.dbclient-jdbc",
    "cweijan.vscode-database-client2",
    "dbaeumer.vscode-eslint",
    "dsznajder.es7-react-js-snippets",
    "rodrigovallades.es7-react-js-snippets",
    "eamodio.gitlens",
    "esbenp.prettier-vscode",
    "formulahendry.auto-rename-tag",
    "github.copilot-chat",
    "gruntfuggly.todo-tree",
    "humao.rest-client",
    "rangav.vscode-thunder-client",
    "ms-vscode.cpp-devtools",
    "ms-vscode.cpptools-extension-pack",
    "ms-vscode.cpptools-themes",
    "pkief.material-icon-theme",
    "prisma.prisma",
    "reekystive.pnpm-workspace",
    "usernamehw.errorlens"
)

Write-Host "Installing VS Code extensions..." -ForegroundColor Green

foreach ($ext in $extensions) {
    Write-Host "Installing $ext..." -ForegroundColor Yellow
    code --install-extension $ext --force
}

Write-Host "All extensions installed successfully!" -ForegroundColor Green
