# Dogmatic Decimal Versioning Law (Base 10)

The **moz-utils** ecosystem strictly rejects elastic traditional semantic versioning. Instead, it adheres to an immutable **numerical dogma** based strictly on Base 10 mathematics to ensure absolute predictability and elegant progression.

## 1. Official Format
All versions strictly follow the anatomy: `X.Y.Z` (Major.Minor.Patch)

## 2. Increment Dogma (The Rule of 9)
The sacred limit of any decimal place (Y or Z) is **9**.

* **Patch Evolution (Z):** Whenever the Patch reaches the value 10 (e.g., from `0.1.9` needing one more fix), the Minor (Y) is automatically incremented by `+1` and the Patch must unconditionally reset to `0` (becoming `0.2.0`).
* **Minor Evolution (Y):** Whenever the Minor reaches the value 10 (e.g., from `0.9.x`), the Major (X) is incremented by `+1` and the Minor must unconditionally reset to `0` (becoming `1.0.0`).

## 3. Module Independence
There is no monosyllabic global version that dictates every package simultaneously. Each supported stack and library (`ts`, `php`, `python`, `kotlin`, `dart`, `website`) possesses its own **independent version timeline**. They evolve at their own independent pace, depending on the ecosystem's specific fixes and needs.

## 4. The Global Main Gear
The Global versioning (which governs the GitHub Releases and the main Changelog) acts as the **"Main Gear"**.

1. Whenever there is an official release cycle (whether it includes updates to just one stack or multiple stacks simultaneously), the Global version advances exactly **+1 Patch**, strictly respecting the Base 10 dogma.
2. If the combined stack changes justify a heavier leap (e.g., major architectural rewrites), the Global version can step up by +1 Minor (resetting the Patch to 0), following the exact same Base 10 rules.

*Example:* 
- Stack `ts` advances from `0.3.1` to `0.3.2`.
- Stack `php` remains at `0.1.5`.
- The Global Version encapsulates this release and advances from `0.4.0` to `0.4.1`.
