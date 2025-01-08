const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

function addToPathUnix(pythonPath) {
  // Determine the shell configuration based on the user's shell
  const shellConfig = path.join(os.homedir(), process.env.SHELL.includes('zsh') ? '.zshrc' : '.bashrc');
  // Ensure the path separator is consistent with the operating system.
  const exportCommand = `export PATH=$PATH${path.delimiter}${pythonPath}\n`;

  // If the Python path is not in the PATH, append it to the shell configuration file
  // Otherwise, log that the Python path is already in the PATH
  if (!process.env.PATH.split(path.delimiter).includes(pythonPath)) {
    try {
      require('fs').appendFileSync(shellConfig, exportCommand);
      console.log(`Added ${pythonPath} to PATH in ${shellConfig}.`);
    } catch (error) {
      console.error(`Failed to add ${pythonPath} to PATH in ${shellConfig}:`, error);
    }
  } else {
    console.log(`${pythonPath} is already in the PATH.`);
  }
}

function addToPathWindows(pythonPath) {
  const setxCommand = `setx PATH "%PATH%;${pythonPath}"`;
  // Handle case-insensitive file systems
  const normalizedPythonPath = path.normalize(pythonPath).toLowerCase();
  // Normalize the PATH environment variable to compare with the provided Python path
  const normalizedPaths = process.env.PATH.split(path.delimiter).map(p => path.normalize(p).toLowerCase());

  // Check if the provided Python path is already in the PATH
  // If not, add it to the PATH using setx command
  if (!normalizedPaths.includes(normalizedPythonPath)) {
    try {
      execSync(setxCommand, { stdio: 'inherit' });
      console.log(`Added ${pythonPath} to system PATH.`);
    } catch (error) {
      console.error(`Failed to add ${pythonPath} to system PATH:`, error);
    }
  } else {
    console.log(`${pythonPath} is already in the PATH.`);
  }
}

function configurePath() {
  const defaultPythonPaths = [
    '/usr/local/bin',
    '/opt/homebrew/bin',
    '/usr/local/python3/bin'
  ];

  // Use the provided Python path or the default path
  const pythonPath = process.env.PYTHON_PATH || defaultPythonPaths.find(p => require('fs').existsSync(p)) || '/usr/local/bin';

  if (os.platform() === 'win32') {
    addToPathWindows(pythonPath);
  } else {
    addToPathUnix(pythonPath);
  }
}

configurePath();
