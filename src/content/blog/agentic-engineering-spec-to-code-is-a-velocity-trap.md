---
title: "Agentic Engineering: Spec-to-Code is a Velocity Trap"
date: "2026-05-03T17:35:05.000Z"
kind: post
draft: false
path: "/posts/agentic-engineering-spec-to-code-is-a-velocity-trap/"
category: "Claude Code"
tags:
  - "Claude Code"
  - "Cursor"
  - "Agentic Ai"
  - "Ai Coding Assistant"
description: "There’s a growing belief that AI has collapsed software development into a single step: write a spec and get working code. In demos, this looks like a..."
---

There’s a growing belief that AI has collapsed software development into a single step: write a spec and get working code. In demos, this looks like a breakthrough in velocity. And in the short term, it often is. But in real systems, the story is more complicated.

**Spec-to-code works until it doesn’t. And when it breaks, it breaks systemically.**

![](/images/blog/agentic-engineering-spec-to-code-is-a-velocity-trap/1-q4cqm-bwuwz8iwbunidtya-png-0e6436dd4b10.png)

The issue isn’t that AI makes mistakes. It’s that AI is forced to make decisions. Every ambiguity in a specification, every missing constraint, every undefined edge case must be resolved for code to exist. If those decisions aren’t made explicitly, they are made implicitly.

And unlike humans, AI doesn’t make these decisions occasionally. It makes them consistently and at scale. A human might make a bad assumption in one place. An AI system will propagate that assumption everywhere, instantly. That’s what turns a local issue into a system-level problem.

Modern AI systems can ask questions. But only if the workflow requires it. If you optimize purely for output, the system will optimize for completion, not correctness.

Every missing detail becomes an assumption, and every assumption becomes part of the system. Over time, those assumptions accumulate into what I think of as **contextual debt**. Technical debt is made up of known shortcuts. Design debt comes from poor structure. Contextual debt is different. It’s made up of **decisions you didn’t know you made, but now have to live with**.

For example, assume a user has a single account. That assumption quickly spreads into your schema, your authentication model, and your billing logic. By the time you revisit it, it’s no longer a small fix. It’s a system-wide change. The code may compile, run, and pass tests, but it’s built on a foundation that doesn’t match reality.

This is where spec-to-code becomes a velocity trap. It gives you speed upfront, but it pushes the cost of thinking downstream. The work of understanding hasn’t gone away. It’s just been deferred into debugging, rework, and growing system complexity. **What feels like speed at the beginning turns into drag over time.**

The middle layer that prevents this has always existed. Design docs, architecture reviews, API contracts, and planning discussions have long served this purpose. What’s changed is that AI removes the friction to execution. It makes it easy to skip that layer entirely, especially under pressure. The real failure mode is not ignorance, but bypassing discipline.

**The core question is not how fast you generate code. It’s where decisions are allowed to happen.**

In practice, that means structuring the workflow so that thinking happens before generation. A useful model is: spec, assumption extraction, clarification, plan, code, and validation. Assumption extraction is where implicit thinking becomes explicit. It means listing constraints, identifying undefined edge cases, and surfacing inferred behaviors before any code is written.

This process is not linear. Assumptions lead to questions, and questions reshape the plan. The loop may repeat several times before implementation begins. That loop is where understanding is built.

Enforcement is what makes this work. Knowing what to do isn’t enough. Under pressure, teams don’t forget. They skip. This is why these steps need to be built into the workflow itself. For example, requiring assumptions to be listed before generation or gating code generation on a reviewed plan. The key is not the exact structure, but ensuring that decisions are made explicitly before they are encoded.

Validation also matters more than ever. Not just tests, but scenario validation and real-world feedback. Tests can confirm behavior, but they don’t guarantee that the underlying assumptions were correct.

**AI accelerates execution. It does not upgrade judgment.**

Without explicit guardrails, it accelerates both progress and error equally.

This reframes what velocity actually means. **Local velocity is the speed of output. System velocity is the speed at which a system can evolve over time.** Spec-to-code optimizes for local velocity, but if assumptions are embedded too early, system velocity collapses.

Systems become harder to reason about, harder to extend, and more fragile under change. What begins as speed turns into drag.

The role of the engineer evolves accordingly. The constraint is no longer writing code. It’s shaping the system before code exists. That includes defining constraints through schemas and contracts, designing validation strategies, structuring workflows, auditing assumptions, and making explicit tradeoffs before they are encoded. **Because once decisions are encoded, they become expensive to reverse.** Engineers are no longer just building systems. They are deciding what will be hard to change later.

There are still valid counterarguments. Speed matters, especially early. Prototypes benefit from fast iteration. AI can make rewrites cheaper, and strong test suites can catch many issues. But these benefits have limits. Rewrites are cheaper until data models and integrations are involved. Tests validate behavior, not intent correctness. Speed helps early, but cost compounds non-linearly as systems grow.

The question is not whether to use spec-to-code. It’s where and how to apply it. Used well, it accelerates execution after decisions are clear. Used poorly, it accelerates confusion.

**Don’t generate code faster than you can validate assumptions, because once assumptions are encoded, they become expensive to reverse.**

That’s the difference between short-term speed and sustained velocity. And in an AI-native world, sustained velocity means systems that don’t slow down as they grow, teams that don’t drown in rework, and architectures that remain adaptable over time.
