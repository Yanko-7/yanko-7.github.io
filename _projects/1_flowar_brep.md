---
layout: page
title: FlowAR-BRep
description: Single-stage autoregressive generation of CAD B-Rep with Flow Matching (accepted at SIGGRAPH Asia 2026)
img: assets/img/flowar-brep.png
importance: 1
category: research
related_publications: true
---

![FlowAR-BRep framework and generated CAD models]({{ '/assets/img/flowar-brep.png' | relative_url }})

**FlowAR-BRep** is a single-stage generative framework for CAD **Boundary Representation (B-Rep)** that jointly models discrete topology and continuous parametric geometry inside a single Transformer backbone {% cite qi2026flowarbrep %}.

- **Unified-modality architecture & native continuous modeling.** Following the Transfusion paradigm, discrete topology and continuous geometry are encoded into one interleaved sequence. Instead of lossy VQ-VAE discretization, a Flow-Matching (x-prediction) head generates parametric geometry directly, while a classification head predicts topology tokens — enabling end-to-end cross-modal training and autoregressive generation in one model.
- **Constrained decoding & long-sequence optimization.** A finite-state machine combined with graphics validation enables backtracking and resampling to guarantee validity. Sequence Packing with variable-length attention handles the dataset's long-tail distribution and substantially improves training efficiency on 4× RTX 5090.
- **Multimodal generalization & SOTA.** Supports point-cloud / image / text-conditioned generation. Unconditional generation reaches state-of-the-art on public benchmarks with markedly higher validity and roughly **2.8× inference speedup**.
