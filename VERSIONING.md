# Architecture of Versioning & Enterprise Release Cycle

The **moz-utils** ecosystem rejects chaotic semantic versioning. It adheres to an immutable **numerical dogma** (Base 10) combined with an **Enterprise Release Cycle** (Stable/LTS/EOL) to ensure absolute predictability and commercial-grade stability.

---

## 1. The Base 10 Dogma

All versions follow the anatomy: `X.Y.Z` (Major.Minor.Patch).

The sacred limit of any decimal place (Y or Z) is **9**.

* **Patch Evolution (Z):** Whenever the Patch reaches 10 (e.g., from `0.1.9` needing a fix), the Minor (Y) increments by `+1` and the Patch unconditionally resets to `0` (becoming `0.2.0`).
* **Minor Evolution (Y):** Whenever the Minor reaches 10 (e.g., from `0.9.x`), the Major (X) increments by `+1` and the Minor unconditionally resets to `0` (becoming `1.0.0`).

## 2. Absolute Package Parity

There is no module independence in versioning. **Every supported stack** (`ts`, `php`, `python`, `kotlin`, `dart`) **shares the exact same version simultaneously**. 
If a bug is patched in Python, bumping the version from `0.3.3` to `0.3.4`, all other stacks automatically sync to `0.3.4` in the same release. This ensures a developer writing in Dart has the exact same mathematical guarantees as a developer writing in Node.js.

*(Note: The Website has its own independent deployment timeline, but its releases contribute to the global repository version).*

---

## 3. Enterprise Release Cycle (Stable, LTS, EOL)

To support corporate environments and critical infrastructure (e.g., banking gateways, telecom routing), the release cycle is divided into three strict phases:

### 🟢 Stable (Active Release)
The current, cutting-edge version of the project.
* Receives all new features, geographical data updates, and bug fixes.
* Deployed directly from the `devlab` branch into `main`.

### 🟡 LTS (Long Term Support)
When the Stable version makes a significant architectural leap (e.g., `0.3.x` to `0.4.0`), the old line becomes an **LTS** version.
* **Duration:** An LTS version is supported for a minimum of **3 to 6 months**.
* **Capacity:** The ecosystem supports a maximum of **2 simultaneous LTS versions**.
* **Scope:** LTS versions receive **NO new features**. They only receive critical security patches and hotfixes via dedicated Git branches (e.g., `lts-v0.2`).
* **The 5% Warning Rule:** When the oldest active LTS version enters the final **5%** of its defined lifespan, a critical deprecation warning is triggered across the ecosystem, instructing developers to migrate to the next LTS or Stable version.

### 🔴 EOL (End of Life)
Once the LTS lifespan expires, or when a 3rd LTS is pushed (breaching the maximum limit of 2), the oldest LTS transitions to End of Life.
* **Scope:** No updates, no security patches, and no technical support. Unsafe for production use.

---

### Example Workflow
1. **0.4.x** is the `Stable` version.
2. **0.3.x** is the primary `LTS` version (receiving backported security fixes).
3. **0.2.x** is the secondary `LTS` version (in its final 5% lifespan, triggering warnings).
4. **0.1.x** is `EOL` (obsolete).
