---
trigger: always_on
---

# AI Coding Rules

````markdown
# AI Coding Rules

These rules define how the AI should generate, modify, and review code in this repository.  
The AI must strictly follow these guidelines whenever suggesting or writing code.

---

## 1. Documentation First

Before implementing or modifying any authentication-related functionality:

- The AI MUST review the official **Better Auth documentation**.
- Any authentication implementation must follow the official patterns described in Better Auth docs.
- Do not invent custom authentication flows if Better Auth provides a standard solution.
- If unsure, prefer documented examples over custom implementations.

Priority:
1. Better Auth official documentation
2. Existing project authentication patterns
3. Minimal custom logic

---

## 2. Code Readability (Highest Priority)

All generated code must prioritize **clarity and maintainability over clever syntax**.

Guidelines:

- Prefer **simple, explicit code** instead of compact or clever syntax.
- Avoid complex one-liners.
- Avoid unnecessary abstractions.
- Use descriptive variable and function names.
- Write code that a **junior developer with minimal experience can understand**.

Preferred:

```ts
const user = await getUserById(userId);

if (!user) {
  throw new Error("User not found");
}
````

Avoid:

```ts
const user = await getUserById(userId) ?? err("User not found");
```

General rules:

* Use clear control flow
* Use meaningful names
* Add comments when logic is not obvious
* Avoid obscure language features

---

## 3. Performance Optimization

Generated code must be **highly performant and efficient**.

Rules:

* Do not introduce unnecessary loops or computations.
* Avoid redundant database calls.
* Avoid unnecessary re-renders or recalculations.
* Prefer efficient data structures.
* Cache values when appropriate.
* Avoid code that increases server load without clear benefit.

Examples:

Good:

* Batch database queries
* Reuse computed values
* Efficient algorithms

Bad:

* Multiple identical queries
* Unnecessary API calls
* Inefficient nested loops

---

## 4. Security Requirements

All generated code must follow **secure coding practices**.

Requirements:

* Prevent data leaks.
* Never expose sensitive information.
* Sanitize and validate user input.
* Follow secure authentication practices.
* Avoid insecure patterns.

Security guidelines:

* No hardcoded secrets
* Use environment variables for credentials
* Validate all inputs
* Prevent injection vulnerabilities
* Use secure authentication flows

If there is any security risk:

* The AI must warn and propose a safer solution.

---

## 5. General Code Standards

The AI must always:

* Write **clean, structured, maintainable code**
* Follow the project's existing style conventions
* Keep functions small and focused
* Avoid unnecessary complexity
* Prefer reliability over clever tricks

When modifying existing code:

* Respect the current architecture
* Avoid unnecessary refactoring
* Do not break existing functionality

---

## Summary

All AI-generated code must be:

* **Readable**
* **Secure**
* **Performant**
* **Based on Better Auth documentation when authentication is involved**

If a suggestion violates any rule above, the AI must revise the solution.
