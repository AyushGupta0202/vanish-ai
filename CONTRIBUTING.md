# Contributing to Vanish AI

First off, thank you for considering contributing to Vanish AI! It's people like you that make Vanish AI such a great tool.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Python/Node versions)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear title and description**
- **Motivation** - Why is this feature needed?
- **Proposed solution** - How should it work?
- **Alternatives considered**
- **Additional context**

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the Python and TypeScript styleguides
- Include thoughtfully-worded, well-structured tests
- Document new code based on the Documentation Styleguide
- End all files with a newline

## Development Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/ayushgupta0202/vanish-ai.git
   cd vanish-ai
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Run Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Coding Standards

### Python (Backend)

- Follow [PEP 8](https://pep8.org/) style guide
- Use type hints where possible
- Maximum line length: 127 characters
- Use descriptive variable and function names
- Add docstrings for all functions and classes

```python
def process_image(image: Image.Image, mask: Image.Image) -> Image.Image:
    """
    Process an image with the given mask using AI inpainting.
    
    Args:
        image: Input image to process
        mask: Binary mask indicating areas to inpaint
        
    Returns:
        Processed image with inpainted regions
    """
    # Implementation
```

### TypeScript/React (Frontend)

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use functional components with hooks
- Use TypeScript for type safety
- Use meaningful component and variable names
- Add JSDoc comments for complex functions

```typescript
/**
 * Processes the uploaded image with the current mask.
 * @param image - Base64 encoded image data
 * @param mask - Base64 encoded mask data
 * @returns Promise resolving to processed image data
 */
const processImage = async (image: string, mask: string): Promise<string> => {
  // Implementation
};
```

### Git Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

**Examples:**
```
feat: Add hand tool for canvas panning
fix: Resolve image upload timeout issue
docs: Update API documentation
refactor: Optimize image processing pipeline
```

## Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Add/update code comments
   - Update CHANGELOG.md

2. **Update Tests**
   - Add tests for new functionality
   - Ensure all tests pass
   - Update test coverage if needed

3. **Check CI**
   - Ensure all CI checks pass
   - Fix any linting errors
   - Resolve merge conflicts

4. **Submit PR**
   - Use a clear, descriptive title
   - Fill out the PR template completely
   - Link related issues
   - Request review from maintainers

5. **Address Feedback**
   - Respond to all comments
   - Make requested changes
   - Keep the PR updated with main branch

## Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Documentation

- Update README.md for user-facing changes
- Add docstrings/comments for complex logic
- Update API documentation if endpoints change
- Keep CHANGELOG.md updated

## Questions?

Feel free to open an issue for any questions or concerns. We're here to help!

---

Thank you for contributing to Vanish AI! 🎉

