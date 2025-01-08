const { execSync } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

// Manage the inclusion of Python paths across different operating systems

// Determine the appropriate shell configuration file based on the user's current shell
function getShellConfigFile() {
  // Check if a custom shell configuration file is set
  // Allow users to specify a custom shell configuration file using the SHELL_CONFIG environment variable
  const customShellConfig = process.env.SHELL_CONFIG;
  if (customShellConfig) {
    return customShellConfig;
  }
  // Accommodate various shell configurations
  const shell = process.env.SHELL || '';
  if (shell.includes('zsh')) {
    return '.zshrc';
  } else if (shell.includes('bash')) {
    return '.bashrc';
  } else if (shell.includes('fish')) {
    return '.config/fish/config.fish';
  } else {
    return '.profile';
  }
}

// Appends the specified Python path to the user's shell config if not already present
function addToPathUnix(pythonPath) {
  // Determine the shell configuration based on the user's shell
  const shellConfig = path.join(os.homedir(), getShellConfigFile());
  // Construct export command for Unix-based systems (Linux, macOS)
  const exportCommand = `export PATH=$PATH:${pythonPath}\n`;

  // Check if the pythonPath directory exists
  if (!fs.existsSync(pythonPath)) {
    console.error(`Error: The directory ${pythonPath} does not exist.`);
    throw new Error(`Error: The directory ${pythonPath} does not exist.`);
  }

  // If the Python path is not in the PATH, append it to the shell configuration file
  // Otherwise, log that the Python path is already in the PATH
  if (!process.env.PATH.split(':').includes(pythonPath)) {
    try {
      // Check if the shell configuration file is writable
      fs.accessSync(shellConfig, fs.constants.W_OK);
    } catch (error) {
      console.error(`Shell configuration file ${shellConfig} is not writable:`, error);
      return;
    }

    try {
      // Append the export command to the shell configuration file
      fs.appendFileSync(shellConfig, exportCommand);
      console.log(`Added ${pythonPath} to PATH in ${shellConfig}.`);
    } catch (error) {
      console.error(`Failed to add ${pythonPath} to PATH in ${shellConfig}:`, error);
    }
  } else {
    console.log(`${pythonPath} is already in the PATH.`);
  }
}

// Utilizes setx command to add the specified Python path to the system's environment variables
function addToPathWindows(pythonPath) {
  // Construct setx command for Windows systems
  const setxCommand = `setx PATH "%PATH%;${pythonPath}"`;
  // Handle case-insensitive file systems
  const normalizedPythonPath = path.normalize(pythonPath).toLowerCase();
  // Normalize the PATH environment variable to compare with the provided Python path
  const normalizedPaths = process.env.PATH.split(path.delimiter).map(p => path.normalize(p).toLowerCase());

  // Check if the provided Python path is already in the PATH
  // If not, add it to the PATH using setx command
  if (!normalizedPaths.includes(normalizedPythonPath)) {
    try {
      // Check if the new PATH length exceeds the maximum allowed length
      const newPathLength = process.env.PATH.length + pythonPath.length + 1; // +1 for the delimiter
      if (newPathLength > 2047) {
        console.error('Error: Adding this path would exceed the maximum PATH length.');
        return;
      }

      execSync(setxCommand, { stdio: 'inherit' });
      console.log(`Added ${pythonPath} to system PATH. Please restart your shell.`);
    } catch (error) {
      console.error(`Failed to add ${pythonPath} to system PATH:`, error);
    }
  } else {
    console.log(`${pythonPath} is already in the PATH.`);
  }
}

// Determines the appropriate Python path to add to the system's PATH
function configurePath() {
  const defaultPythonPaths = [
    '/usr/local/bin',
    '/opt/homebrew/bin',
    '/usr/local/python3/bin'
  ];

  // Check if the PYTHON_PATH environment variable is set
  const pythonPath = process.env.PYTHON_PATH || defaultPythonPaths.find(p => fs.existsSync(p));
      // '/usr/local/bin';

   if (!pythonPath) {
    console.error('Please set the PYTHON_PATH environment variable to the directory containing your Python installation.');
    throw new Error('Error: No valid Python path found. Please set the PYTHON_PATH environment variable explicitly.');
  }

   console.log(`Using Python path: ${pythonPath}`);

  if (os.platform() === 'win32') {
    addToPathWindows(pythonPath);
  } else {
    addToPathUnix(pythonPath);
  }
}

configurePath();
