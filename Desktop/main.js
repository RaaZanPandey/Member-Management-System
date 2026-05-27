const { app, BrowserWindow } = require("electron");
const { execFile } = require("child_process");
const path = require("path");
const http = require("http");
const fs = require("fs");

let win;
let phpProcess;

function waitForLaravel(retries, callback) {
    http.get("http://127.0.0.1:8000", (res) => {
        console.log("Laravel is ready!");
        callback();
    }).on("error", () => {
        if (retries === 0) {
            console.error("Laravel failed to start");
            win.loadURL(`data:text/html,
                <html>
                <body style="background:#1e293b;color:white;font-family:sans-serif;
                             display:flex;align-items:center;justify-content:center;
                             height:100vh;margin:0;flex-direction:column;gap:16px">
                    <h2 style="color:red">Failed to start server</h2>
                    <p>Please restart the application</p>
                </body>
                </html>
            `);
            return;
        }
        console.log(`Waiting for Laravel... (${retries} retries left)`);
        setTimeout(() => waitForLaravel(retries - 1, callback), 1000);
    });
}

function createWindow() {
    win.loadURL("http://127.0.0.1:8000");
}

app.whenReady().then(() => {

    //  Paths 
    const isPackaged  = app.isPackaged;
    const basePath    = isPackaged
        ? path.join(process.resourcesPath, "resources")
        : path.join(__dirname, "resources");

    const phpPath     = path.join(basePath, "php", "php.exe");
    const backendPath = path.join(basePath, "PNSB");

    //  Debug 
    console.log("Is Packaged:", isPackaged);
    console.log("Base Path:", basePath);
    console.log("PHP Path:", phpPath);
    console.log("Backend Path:", backendPath);
    console.log("PHP exists:", fs.existsSync(phpPath));
    console.log("Backend exists:", fs.existsSync(backendPath));

    //  Loading Window 
    win = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
    });

    win.loadURL(`data:text/html,
        <html>
        <body style="background:#1e293b;color:white;font-family:sans-serif;
                     display:flex;align-items:center;justify-content:center;
                     height:100vh;margin:0;flex-direction:column;gap:16px">
            <h2>Starting Society Management...</h2>
            <p style="color:#94a3b8">Please wait...</p>
        </body>
        </html>
    `);

    //  Check Files Exist 
    if (!fs.existsSync(phpPath)) {
        win.loadURL(`data:text/html,
            <h1 style="color:red;font-family:sans-serif">
                ERROR: php.exe not found at ${phpPath}
            </h1>
        `);
        return;
    }

    if (!fs.existsSync(backendPath)) {
        win.loadURL(`data:text/html,
            <h1 style="color:red;font-family:sans-serif">
                ERROR: PNSB folder not found at ${backendPath}
            </h1>
        `);
        return;
    }

    //  Start Laravel 
    phpProcess = execFile(
        phpPath,
        ["artisan", "serve", "--host=127.0.0.1", "--port=8000"],
        { cwd: backendPath },
        (error) => {
            if (error) console.error("Laravel error:", error.message);
        }
    );

    phpProcess.stdout?.on("data", (d) => console.log("Laravel:", d));
    phpProcess.stderr?.on("data", (d) => console.error("Laravel Error:", d));

    //  Wait then load app 
    waitForLaravel(30, createWindow);
});

app.on("window-all-closed", () => {
    if (phpProcess) phpProcess.kill();
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (win === null) {
        win = new BrowserWindow({ width: 1400, height: 900 });
        waitForLaravel(30, createWindow);
    }
});

process.on("exit", () => {
    if (phpProcess) phpProcess.kill();
});