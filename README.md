[![npm version](https://img.shields.io/npm/v/@codeswriter/netrc-rw.svg)](https://www.npmjs.com/package/@codeswriter/netrc-rw)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Description
A type-safe ES6 module to read, write, and manipulate your `.netrc` file with full TypeScript support.

## ✨ Features

- **🔒 Type Safety**: Full TypeScript definitions for all operations
- **📁 Zero Dependencies**: Lightweight and self-contained

## 📦 Installation

```bash
npm install @codeswriter/netrc-rw
```

## 📖 Usage Examples

### Usage
```typescript
import { NetRC } from "@codeswriter/netrc";

const netrc = new NetRC()

# read
const pass = netrc.host('domain.com').password

# edit
netrc.host('domain.com').password = "passw0rd"
netrc.write()

# add new
netrc.addHost('api.domain.com').password = "otherPassw0rd"
netrc.write()
```
## 🔧 API Reference

### Machine Properties

Each `Machine` object has these typed properties:

- `login: string` - The username/login
- `password: string` - The password
- `account?: string` - Optional account name

## 📁 File Location

By default, the library uses the standard `.netrc` file location:
- **Unix/Linux/macOS**: `~/.netrc`
- **Windows**: `%HOME%/_netrc`

You can specify a custom file path:

```typescript
// Use custom netrc file location
const customNetRC = new NetRC('/path/to/custom/netrc/file');
const machine = customNetRC.host('example.com');
```

## 🧪 Testing

```bash
# Run tests
npm test

```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project is a TypeScript evolution of the original **[netrc-rw](https://github.com/treygriffith/netrc-rw)** library created by **Trey Griffith**. It maintains full API compatibility while adding type safety and modern development practices.

Special thanks to Trey Griffith for creating the original netrc-rw library that served as the foundation for this project.

---
