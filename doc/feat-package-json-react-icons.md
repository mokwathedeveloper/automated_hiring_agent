### Problem Description
The `react-icons` library was installed to provide professional and responsive icons across the UI, but the dependency update in `package.json` and `package-lock.json` was not yet committed.

### Root Cause
`react-icons` was installed via `npm install`, which modifies `package.json` and `package-lock.json`, but these changes were not tracked in version control.

### Solution
Committed the updated `package.json` and `package-lock.json` files to reflect the addition of the `react-icons` dependency, ensuring proper project setup and reproducibility.

### Commit Ref
`024597ae`