<div align="center">

  <h1>🌐 ACM NeurOnyx Website</h1>
  <p><strong>Official Website for the ACM NeurOnyx Student Chapter - AIKTC</strong></p>

  <p>
    <a href="https://github.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" /></a>
    <a href="https://aiktc.ac.in"><img src="https://img.shields.io/badge/Campus-AIKTC-0052cc.svg?style=flat-square" alt="AIKTC" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Chapter-ACM-ff6b6b.svg?style=flat-square" alt="ACM Chapter" /></a>
    <a href="#"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License" /></a>
  </p>

</div>

---

## 📌 Overview

This repository contains the source code for the **ACM NeurOnyx** official website at **Anjuman-I-Islam's Kalsekar Technical Campus (AIKTC)**.

All technical team members contribute by creating individual feature branches and submitting **Pull Requests (PRs)** to `main`.

---

## 🚀 Quick Setup

### 1. Configure Git (One-time)

```bash
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
```

### 2. Clone Repository

```bash
git clone https://github.com/rayyantausalkar/NeurOnyx-Club-Website-2026-27.git
cd NeurOnyx-Club-Website-2026-27
```

---

## 🌿 Branching Policy

> **Note:** Never commit directly to `main`. Always create a branch for your task.

| Branch Format         | Purpose                  | Example                       |
| :-------------------- | :----------------------- | :---------------------------- |
| `feat/<name>-<task>`  | New component or feature | `feat/rohit-events-page`      |
| `fix/<name>-<issue>`  | Bug fix                  | `fix/sarah-nav-mobile`        |
| `style/<name>-<task>` | UI/CSS enhancements      | `style/alex-hero-darkmode`    |
| `docs/<name>-<task>`  | Documentation updates    | `docs/ali-contributing-guide` |

---

## 🔄 Contribution Workflow

```
1. Sync main  ──>  2. Create branch  ──>  3. Code & commit  ──>  4. Push & PR
```

### 1. Update your local `main`

```bash
git checkout main
git pull origin main
```

### 2. Create and switch to your feature branch

```bash
git checkout -b feat/yourname-feature-name
```

### 3. Make changes, stage & commit

```bash
# Check modified files
git status

# Stage changes
git add .

# Commit with a descriptive message
git commit -m "feat(events): add upcoming workshops carousel"
```

### 4. Push to GitHub

```bash
# First push for a new branch
git push -u origin feat/yourname-feature-name
```

### 5. Open a Pull Request (PR)

1. Go to GitHub and click **Compare & pull request**.
2. Set base to `main` and compare to your branch.
3. Add a short description (and UI screenshots if applicable).
4. Submit the PR for review.

### 6. Once PR is merged (Cleanup)

```bash
git checkout main
git pull origin main
git branch -d feat/yourname-feature-name
```

---

## 💬 Commit Format

We follow standard conventional commits:

```
<type>(<scope>): <short description>
```

- `feat(events): add registration modal`
- `fix(navbar): resolve hamburger toggle on mobile`
- `style(footer): adjust padding and social icons`
- `docs(readme): update setup commands`

---

## 🧰 Quick Git Reference

| Task                   | Command                            |
| :--------------------- | :--------------------------------- |
| Check status           | `git status`                       |
| Create & switch branch | `git checkout -b <branch-name>`    |
| Switch branch          | `git checkout <branch-name>`       |
| Pull latest `main`     | `git pull origin main`             |
| Stage all changes      | `git add .`                        |
| Commit changes         | `git commit -m "<message>"`        |
| Push branch            | `git push -u origin <branch-name>` |
| Discard local changes  | `git restore .`                    |

---

## ❓ Common FAQs

**Q: How do I resolve merge conflicts?**

```bash
git checkout feat/your-branch
git pull origin main
# Open VS Code, select incoming/current changes in conflicting files, then:
git add .
git commit -m "chore: resolve merge conflicts with main"
git push
```

**Q: I coded on `main` before creating a branch!**

```bash
# If uncommitted, simply run:
git checkout -b feat/yourname-feature-name
```

---

<div align="center">
  <sub>ACM NeurOnyx Chapter • Anjuman-I-Islam's Kalsekar Technical Campus (AIKTC)</sub>
</div>
