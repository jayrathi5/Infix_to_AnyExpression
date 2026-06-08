# Expression Converter

A clean, static website that converts **infix expressions** to **postfix** (Reverse Polish) and **prefix** (Polish) notation using a stack-based algorithm.

## ✨ Features

- Infix → Postfix conversion
- Infix → Prefix conversion
- Step-by-step trace table for both conversions
- Input validation with helpful error messages
- Copy-to-clipboard for results
- Fully responsive — works on mobile

## 🧠 Algorithm

The core logic is a faithful JavaScript translation of a stack-based Java solution:

- **Postfix**: Standard shunting-yard algorithm. Right-associative `^` is handled by using strict `>` for priority comparison.
- **Prefix**: The expression is reversed (with `(` ↔ `)` swapped), a modified postfix pass is run (using strict `>` throughout — **this is the bug-fix vs the original Java**), and the result is reversed.

## 🚀 How to Host on GitHub Pages

1. **Create a new GitHub repository** (e.g. `expression-converter`)

2. **Push these files** to the `main` (or `master`) branch:
   ```
   index.html
   style.css
   converter.js
   app.js
   README.md
   ```

3. Go to your repo → **Settings** → **Pages**

4. Under *Source*, select **Deploy from a branch**

5. Choose branch: `main` (or `master`), folder: `/ (root)`

6. Click **Save** — GitHub will give you a URL like:
   ```
   https://yourusername.github.io/expression-converter/
   ```

That's it! No build step, no dependencies, no server needed.

## 📁 File Structure

```
.
├── index.html      # Markup & layout
├── style.css       # Styling (dark terminal aesthetic)
├── converter.js    # Core algorithm (priority, postfix, prefix)
├── app.js          # UI wiring & DOM interactions
└── README.md       # This file
```

## Operator Precedence

| Operator | Precedence | Associativity |
|----------|-----------|---------------|
| `^`      | 3 (high)  | Right         |
| `* /`    | 2         | Left          |
| `+ -`    | 1 (low)   | Left          |

## Example

| Input (Infix) | Postfix | Prefix |
|---------------|---------|--------|
| `A+B*C` | `ABC*+` | `+A*BC` |
| `(A+B)*C` | `AB+C*` | `*+ABC` |
| `A^B^C` | `ABC^^` | `^^ABC` |
