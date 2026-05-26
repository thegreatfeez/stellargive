# Security Policy & Audit Guide

This document outlines the security mitigations, threat models, assumptions, and pre-audit checklists for the `stellarGive` smart contract.

## 1. Security Mitigations Table

| Vulnerability | Mitigation | Location |
| :--- | :--- | :--- |
| **Reentrancy** | Implement `enter_lock` and `exit_lock` guards on all state-mutating functions to prevent nested contract call exploits within the same execution context. | [lib.rs:L204](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L204), [lib.rs:L244](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L244) (in `donate`); [lib.rs:L270](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L270), [lib.rs:L292](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L292) (in `claim_funds`) |
| **Integer Overflow** | Enforce safe arithmetic utilizing `checked_add` and `checked_sub` for all operations altering campaign funding amounts and identifiers. | [lib.rs:L162](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L162) (incrementing next ID), [lib.rs:L221-222](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L221-222) (adding donation amounts) |
| **Unauthorized Access** | Mandate strict address verification and require cryptographically valid signatures by enforcing `require_auth()` on admin, creator, and beneficiary endpoints. | [lib.rs:L148](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L148) (creator), [lib.rs:L199](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L199) (donor), [lib.rs:L259](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L259) (claim caller) |
| **Storage Exhaustion** | Avoid unbounded collections and full loops by storing and accessing campaign entities individually via unique, direct persistent keys (`campaign_key(id)`). | [lib.rs:L59](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L59), [lib.rs:L74-85](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L74-L85) (individual getter/setter logic), [lib.rs:L177](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L177), [lib.rs:L206](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L206), [lib.rs:L249](file:///home/jhay/Desktop/stellargive/contracts/stellar-give/src/lib.rs#L249) |

## 2. Known Limitations & Assumptions

* **Token Contract Validation**: Token verification is limited to verifying interface compliance (e.g. calling `decimals()` via SEP-41). The contract does not verify the economic invariants, internal logic, or solvency of the target token contract.
* **Campaign Descriptions**: The contract stores campaign details (such as titles/strings) as-is and does not perform XSS payload stripping or content sanitization. Sanitization relies entirely on the frontend application layers prior to rendering.
* **Standards & Runtime Assumed Compliance**: The security model assumes full compliance of referenced tokens with the Stellar Asset Contract (SAC) standard, and relies on the underlying invariants and safety guarantees provided by the Soroban virtual machine runtime.

## 3. Pre-Audit Checklist

- [ ] Test coverage >90% (verify via `cargo tarpaulin`)
- [ ] `cargo clippy -- -D warnings` passes with zero output
- [ ] Manual review log signed by 2 core maintainers

## 4. Workflow & Maintenance Notes

* **Branching**: All security updates, checklist revisions, and mitigation document adjustments must be proposed on a dedicated branch using:
  ```bash
  git checkout -b docs/security-audit-checklist
  ```
* **README Integration**: Ensure this file is explicitly linked under the `Security` section of the main project [README.md](file:///home/jhay/Desktop/stellargive/README.md#L89).
* **Update Policy**: This document must be revised and updated after every external security audit cycle or any major architectural modification to the smart contract.
* **Validation Protocol**: Use this checklist to audit and vet all incoming feature PRs. Merges must be blocked if any proposed state-changing actions or modifications lack corresponding, documented mitigations.
