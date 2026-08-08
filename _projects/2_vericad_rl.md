---
layout: page
title: VeriCAD-RL
description: Verifiable reinforcement-learning fine-tuning for multi-view image-to-CAD program generation
importance: 2
category: research
related_publications: false
---

**VeriCAD-RL** improves multi-view **image-to-CAD** program synthesis through verifiable reinforcement learning.

- Starting from a Qwen3-VL-2B-Instruct model instruction-tuned on the Image-to-CadQuery dataset, it applies **GRPO** post-training via the **ms-swift** framework to improve the executability and geometric consistency of generated parametric modeling programs.
- A **CadQuery** verifier drives the reward function using program execution results, modeling-kernel validity checks, voxelized **IoU**, and point-cloud **Chamfer Distance**.
- On the test set, success rate rose from **80.14% → 88.75%**, Mean IoU from **0.521 → 0.628**, and Median IoU from **0.585 → 0.735**.
