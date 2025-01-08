const { execSync } = require('child_process');
const path = require('path');

const REQUIRED_PYTHON_VERSION = '3.9.6';

function checkPythonVersion() {
  try {
    const stdout = execSync('python3 --version').toString().trim();
    const installedVersion = stdout.split(' ')[1];

    if (installedVersion !== REQUIRED_PYTHON_VERSION) {
      console.error(`Error: Python ${REQUIRED_PYTHON_VERSION} is required. Installed version is ${installedVersion}.`);
      process.exit(1);
    } else {
      console.log(`Python ${REQUIRED_PYTHON_VERSION} is installed.`);
    }
  } catch (error) {
    console.error('Error: Python is not installed or not added to PATH.');
    process.exit(1);
  }
}

function configureBackend() {
  const backendPath = path.join(__dirname, 'backend');

  try {
    checkPythonVersion();

    execSync(`
      cd ${backendPath} &&
      if [ ! -d "venv" ]; then
        echo "Creating virtual environment...";
        python3 -m venv venv;
      fi &&
      echo "Activating virtual environment...";
      source venv/bin/activate &&
      echo "Upgrading pip...";
      pip install --upgrade pip &&
      echo "Installing dependencies...";
      pip install -r requirements.txt
    `, { stdio: 'inherit', shell: '/bin/bash' });

    console.log('Setup complete. Virtual environment is active.');
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

configureBackend();
