---
layout: page
title: GME — Geometric Modeling Engine
description: High-performance watertight discretization for complex B-Rep models (multi-university project)
importance: 3
category: research
related_publications: false
---

**GME** is a high-performance discretization framework for complex **B-Rep** models, developed as a multi-university project (Tsinghua, Xi'an Jiaotong, Hangzhou Dianzi, and East China Normal University). It robustly produces watertight triangle meshes and runs roughly **2.3× faster than ACIS** (a closed-source commercial kernel) on partners' test sets, and has been deployed at Hudong-Zhonghua Shipbuilding and Yunji.

- **Curvature-aware sampling.** A curvature-aware adaptive NURBS sampling algorithm produces shape-preserving meshes while satisfying a geometric-error upper bound.
- **Parameter-domain intersection.** A hybrid Newton-Raphson + bisection solver computes trimming-curve / mesh-line intersections.
- **Complex topology repair.** Handles periodic parametric surfaces, poles/singularities, discontinuous trim loops, and edge stitching to guarantee watertight output.
- **Triangulation optimization.** An Arena Allocator cuts dynamic-allocation overhead; a strategy-pattern mesh-management backend supports multi-precision output.
