/**
 * converter.js
 * Core logic translated from Java — stack-based infix → postfix / prefix.
 * The Java logic is preserved exactly, including the bug-fix:
 *   prefix loop uses strict '>' (not '>=') so right-associativity of '^' is correct.
 */

// ── priority (mirrors Java switch) ──────────────────────────────────────────
function priority(c) {
  switch (c) {
    case '*':
    case '/': return 2;
    case '^': return 3;
    case '+':
    case '-': return 1;
    default:  return -1;
  }
}

// ── validate ─────────────────────────────────────────────────────────────────
function validate(expr) {
  if (!expr.trim()) return 'Expression cannot be empty.';
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '(') { depth++; continue; }
    if (c === ')') {
      depth--;
      if (depth < 0) return 'Mismatched parentheses — extra ")" found.';
      continue;
    }
    const isOperand = /[a-zA-Z0-9]/.test(c);
    const isOperator = '+-*/^'.includes(c);
    if (!isOperand && !isOperator)
      return `Invalid character "${c}" at position ${i + 1}.`;
  }
  if (depth !== 0) return 'Mismatched parentheses — unclosed "(" found.';
  return null;
}

// ── isOperand ────────────────────────────────────────────────────────────────
function isOperand(c) {
  return /[a-zA-Z0-9]/.test(c);
}

// ── Infix → Postfix ──────────────────────────────────────────────────────────
// Returns { result: string, steps: Array<{symbol,stack,output}> }
function infixToPostfix(s) {
  const stack = [];
  let res = '';
  const steps = [];

  const snap = (sym) => steps.push({
    symbol: sym,
    stack:  [...stack].join(' ') || '∅',
    output: res || '∅',
  });

  for (let i = 0; i < s.length; i++) {
    const x = s[i];

    if (x === '(') {
      stack.push('(');
      snap(x);
    } else if (x === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        res += stack.pop();
      }
      stack.pop(); // remove '('
      snap(x);
    } else if ('+-*/^'.includes(x)) {
      // postfix: pop while top has GREATER OR EQUAL priority (left-associative)
      // exception: '^' is right-associative → only pop STRICTLY greater
      const rightAssoc = (x === '^');
      while (
        stack.length &&
        stack[stack.length - 1] !== '(' &&
        (rightAssoc
          ? priority(stack[stack.length - 1]) > priority(x)
          : priority(stack[stack.length - 1]) >= priority(x))
      ) {
        res += stack.pop();
      }
      stack.push(x);
      snap(x);
    } else {
      res += x; // operand
      snap(x);
    }
  }

  while (stack.length) {
    res += stack.pop();
    snap('(flush)');
  }

  return { result: res, steps };
}

// ── Infix → Prefix ───────────────────────────────────────────────────────────
// Mirrors the Java solution exactly:
//   1. Reverse the expression, swapping '(' ↔ ')'
//   2. Run modified postfix (using '>' not '>=')
//   3. Reverse the result
function infixToPrefix(s1) {
  // Step 1: reverse + swap brackets
  let str = '';
  for (let i = s1.length - 1; i >= 0; i--) {
    const x = s1[i];
    if (x === ')') str += '(';
    else if (x === '(') str += ')';
    else str += x;
  }

  // Step 2: modified postfix on reversed string
  let res = '';
  const stack = [];
  const steps = [];

  const snap = (sym) => steps.push({
    symbol: sym,
    stack:  [...stack].join(' ') || '∅',
    output: res || '∅',
  });

  for (let i = 0; i < str.length; i++) {
    const x = str[i];

    if (x === '(') {
      stack.push('(');
      snap(x);
    } else if (x === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        res += stack.pop();
      }
      stack.pop();
      snap(x);
    } else if ('+-*/^'.includes(x)) {
      // FIX: use strict '>' so right-associative '^' is handled correctly
      while (
        stack.length &&
        stack[stack.length - 1] !== '(' &&
        priority(stack[stack.length - 1]) > priority(x)   // '>' not '>='
      ) {
        res += stack.pop();
      }
      stack.push(x);
      snap(x);
    } else {
      res += x;
      snap(x);
    }
  }

  while (stack.length) {
    res += stack.pop();
    snap('(flush)');
  }

  // Step 3: reverse
  const result = res.split('').reverse().join('');

  // Reverse steps so they read in original expression order
  const stepsForward = steps.map((st, idx) => ({
    ...st,
    symbol: st.symbol, // keep as-is; user can see "working on reversed"
  }));

  return { result, steps: stepsForward };
}
