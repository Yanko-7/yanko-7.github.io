---
title: "About me"
description: "Yongkang Qi (漆永康): geometric modeling, generative CAD, and efficient inference."
---

I'm **Yongkang Qi (漆永康)**, also known as **Yanko**. I'm a master's student at **East China Normal University**, working at the intersection of computer graphics, generative modeling, and inference systems.

I like problems where mathematical structure meets implementation: a mesh that must be watertight, a generated CAD model that must be valid, or a model that needs to run efficiently. My earlier background in competitive programming still shapes how I approach them—understand the constraints, make the structure explicit, then build.

[GitHub](https://github.com/Yanko-7) · [Email](mailto:yanko_77@outlook.com) · [Download CV](/assets/pdf/cv.pdf)

## Geometry

**GME · Geometric Modeling Engine** · June 2024–present

I work on discretizing complex CAD boundary representations (B-Rep) into watertight triangle meshes. This includes curvature-aware sampling of NURBS surfaces, robust intersections in parameter space, and topology repair around periodic surfaces, singularities, and trim loops.

The implementation combines Newton–Raphson and bisection methods for intersection solving, with an arena allocator and a configurable mesh backend. In our partners' test sets, the framework runs approximately **2.3× faster than ACIS**. GME is a collaboration involving Tsinghua, XJTU, HDU, and ECNU, with deployments at Hudong-Zhonghua Shipbuilding and Yunji.

## Generative CAD

**FlowAR-BRep** · SIGGRAPH Asia 2026, accepted

A single-stage generative framework that models discrete topology and continuous parametric geometry in one Transformer. It interleaves topology tokens with geometry, combining classification and flow matching without a lossy VQ-VAE intermediate representation.

My work covers constrained decoding with geometric validity checks, backtracking and resampling, and sequence packing for efficient training. The framework supports point-cloud, image, and text conditioning; our experiments show improved validity and approximately **2.8× faster inference**.

**VeriCAD-RL** · April–May 2026

Verifiable reinforcement learning for multi-view image-to-CAD program generation. I fine-tuned Qwen3-VL-2B-Instruct with GRPO and built a CadQuery verifier using program execution, kernel validity checks, voxel IoU, and Chamfer distance as reward signals.

On our test set, execution success increased from **80.14% to 88.75%**, mean IoU from **0.521 to 0.628**, and median IoU from **0.585 to 0.735**.

## Systems

At **InfiScale**, I'm part of the **sglang-jax** team, focusing on vision-language model support. I'm interested in the practical work between a model definition and efficient execution: implementation, profiling, and inference optimization.

## Experience

**InfiScale · sglang-jax** · Shanghai · 2026–present  
Vision-language model support and inference engineering.

**Kuaishou · Kling AI · Strategy Algorithm Intern** · Beijing · June–September 2025  
Built multilingual prompt tooling and a Gradio evaluation platform, integrated a Qwen2.5-VL content-tagging pipeline for homepage recommendations, and deployed an asynchronous distributed matting service with approximately 4× per-video speedup.

**ZWSOFT · C++ R&D Intern** · Guangzhou · April–June 2023  
Developed an interactive Dear ImGui interface for the Overdrive geometric modeling kernel and a static-analysis tool for converting source comments to Doxygen format.

## Education

**East China Normal University** · September 2024–June 2027 (expected)  
Master's in Computer Technology, School of Computer Science and Technology.

**South China Agricultural University** · September 2020–June 2024  
Bachelor of Engineering in Software Engineering.

## Tools & background

I primarily work with **C++, Python, PyTorch, and JAX**, and also explore Rust, Haskell, and TypeScript.

Before focusing on graphics and machine learning, I spent much of my undergraduate time on competitive programming: **CCPC silver (2021)**, **Guangdong Collegiate Programming Contest silver (2022)**, **ICPC bronze (2022)**, and **Baidu Star national top 400 (2022)**.

This site is my working notebook: algorithms, languages, systems, and things I want to understand more deeply. The older Chinese notes capture how I thought through problems at the time.
