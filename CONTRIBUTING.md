# 📚 Commit Guidelines

To maintain a clean and consistent commit history, we follow the **Conventional Commits** standard. This helps us automate changelogs, versioning, and improve the readability of the project's history.

## 📌 Types and Emojis:

| Type         | Emoji                          | Description                                                    |
| ------------ | ------------------------------ | -------------------------------------------------------------- |
| **feat**     | ✨ (`:sparkles:`)              | A new feature is introduced.                                   |
| **fix**      | 🐛 (`:bug:`)                   | A bug has been fixed.                                          |
| **docs**     | 📚 (`:books:`)                 | Documentation has been updated.                                |
| **style**    | 🎨 (`:art:`)                   | Code style changes (formatting, spaces, etc.).                 |
| **refactor** | 🔨 (`:hammer:`)                | Refactoring code without changing functionality.               |
| **test**     | ✅ (`:white_check_mark:`)      | Adding or correcting tests.                                    |
| **perf**     | 🚀 (`:rocket:`)                | Performance improvements.                                      |
| **chore**    | 🔧 (`:wrench:`)                | Maintenance tasks (updating dependencies, scripts, etc.).      |
| **ci**       | 🤖 (`:robot:`)                 | Changes related to Continuous Integration/Continuous Delivery. |
| **build**    | 🏗 (`:building_construction:`) | Changes that affect the build system.                          |
| **revert**   | ⏪ (`:rewind:`)                | Reverts a previous commit.                                     |
| **security** | 🛡️ (`:shield:`)                | Fixes security vulnerabilities in the code.                    |

## 📌 Examples:

| Type     | Example                                                   |
| -------- | --------------------------------------------------------- |
| **feat** | `✨ feat(auth): add JWT authentication support`           |
| **fix**  | `🐛 fix(cart): fix checkout button not working on mobile` |
| **docs** | `📚 docs(readme): update installation instructions`       |

## ⚙️ How to Use

1. **Pick the right type**: Choose the correct type (e.g., `feat`, `fix`, `docs`) that represents the purpose of your commit.
2. **Add a short description**: After the type, provide a short, clear description of what the commit does. Use the imperative mood (e.g., "Add" instead of "Added").
3. **Optional body**: If needed, you can add more detailed information about the commit in the body (e.g., why a change was made or how to test it).
4. **Add emojis**: For visual clarity, use the corresponding emoji at the start of the message.
