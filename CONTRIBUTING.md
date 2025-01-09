# Contributing to ThriftHub

Thank you for considering contributing to our project! This monorepo contains a Python Django backend and a React Native frontend. To ensure a smooth collaboration, please follow these guidelines.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Development Workflow](#development-workflow)
  - [Preferred Package Manager](#preferred-package-manager)
  - [Monorepo Structure](#monorepo-structure)
  - [Setting Up the Environments](#setting-up-the-environments)
  - [Running Tests](#running-tests)
- [Style Guides](#style-guides)
  - [Python Style Guide](#python-style-guide)
  - [JavaScript/TypeScript Style Guide](#javascripttypescript-style-guide)
  - [Commit Messages](#commit-messages)
- [License](#license)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the expectations for all contributors.

## Getting Started

1. **Fork the Repository**: Click the "Fork" button at the top right of this page to create a copy of this repository under your GitHub account.

2. **Clone Your Fork**: Clone your forked repository to your local machine. Replace `<your-username>` with your GitHub username.

   ```bash
   git clone git@github.com:<your-username>/thrifthub.git
   cd thrifthub
   ```

3. **Set Upstream Remote**: Add the original repository as a remote to keep your fork synchronized.

   ```bash
   git remote add upstream git@github.com:israelias/thrifthub.git
   ```

## How to Contribute

### Reporting Bugs

If you encounter a bug, please report it by [opening an issue](https://github.com/israelias/thrifthub/issues/new) and include:

- A clear and descriptive title.
- Steps to reproduce the issue.
- Expected and actual behavior.
- Screenshots or code snippets, if applicable.
- Information about your environment (e.g., OS, Python/Django version, Node.js version).

### Suggesting Enhancements

To suggest an enhancement, please [open an issue](https://github.com/israelias/thrifthub/issues/new) and provide:

- A clear and descriptive title.
- A detailed description of the proposed enhancement.
- Rationale for why this enhancement would be beneficial.
- Any relevant examples, screenshots, or code snippets.

### Submitting Pull Requests

Before submitting a pull request (PR):

1. **Discuss Changes**: It's recommended to [open an issue](https://github.com/israelias/thrifthub/issues/new) to discuss your proposed changes before working on them.

2. **Branch Naming**: Create a new branch for your work. Use descriptive names, such as `feature/add-authentication` or `bugfix/fix-login-error`.

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Changes**: Make atomic commits with clear messages. Follow the [commit message guidelines](#commit-messages).

4. **Push to Fork**: Push your branch to your forked repository.

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**: Navigate to the original repository and [open a pull request](https://github.com/israelias/thrifthub/compare). Provide a clear description of your changes and reference any related issues.

## Development Workflow

### Preferred Package Manager

Please use Yarn as the preferred package manager for this project.

### Monorepo Structure

This project uses a monorepo structure with separate `frontend` and `backend` directories. Please familiarize yourself with the directory structure before contributing and ensure you are working within the correct directory for your changes.

### Setting Up the Environments

**Backend (Django)**

- Ensure you have Python 3.9.6 installed. (as of the last update to this file)
- Create a `.env` file in the `backend` directory following the `.env.example` template.
- Create a virtual environment and activate it.

  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows: env\Scripts\activate
  ```

- Install dependencies.

  ```bash
  pip install -r backend/requirements.txt
  ```

- Apply migrations and start the development server.

  ```bash
  python backend/manage.py migrate
  python backend/manage.py runserver
  ```

**Frontend (TypeScript React Native)**

- Ensure you have Node.js and yarn installed.
- Node at frontend is at `>=14.0.0 <15.0.0` (as of the last update to this file)
- Yarn at frontend is at `>=1.22.0 <2.0.0` (as of the last update to this file)
- Navigate to the frontend directory and install dependencies.

  ```bash
  cd frontend
  yarn install
  ```

- Start the development server.

  ```bash
  yarn start
  ```

### Running Tests

**Backend Tests**

- To run Django tests:

  ```bash
  python backend/manage.py test
  ```

**Frontend Tests**

- To run React Native tests:

  ```bash
  yarn test
  ```

## Style Guides

### Python Style Guide

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) and the [Django Coding Style](https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/) 
for Python code.
- Use type annotations where appropriate.
- Ensure code passes linting checks with `black`.

  ```bash
  black backend/
  ```

### JavaScript/TypeScript Style Guide

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
- Use [Prettier](https://prettier.io/) for code formatting.
- Ensure code passes linting checks.

  ```bash
  yarn run lint
  ```

### Commit Messages

Write clear and concise commit messages. Use the imperative mood in the subject line (e.g., "Fix bug" instead of "Fixed bug").

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

