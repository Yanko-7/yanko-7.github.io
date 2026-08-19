---
layout: page
title: GME — Geometric Modeling Engine
description: High-performance watertight discretization for complex B-Rep models (multi-university project)
img: assets/img/nanotess/industrial-vehicle-render.png
importance: 3
category: research
related_publications: false
---

**GME** is a high-performance discretization framework for complex **B-Rep** models, developed as a multi-university project (Tsinghua, Xi'an Jiaotong, Hangzhou Dianzi, and East China Normal University). It robustly produces watertight triangle meshes and runs roughly **2.3× faster than ACIS** (a closed-source commercial kernel) on partners' test sets, and has been deployed at Hudong-Zhonghua Shipbuilding and Yunji.

- **Curvature-aware sampling.** A curvature-aware adaptive NURBS sampling algorithm produces shape-preserving meshes while satisfying a geometric-error upper bound.
- **Parameter-domain intersection.** A hybrid Newton-Raphson + bisection solver computes trimming-curve / mesh-line intersections.
- **Complex topology repair.** Handles periodic parametric surfaces, poles/singularities, discontinuous trim loops, and edge stitching to guarantee watertight output.
- **Triangulation optimization.** An Arena Allocator cuts dynamic-allocation overhead; a strategy-pattern mesh-management backend supports multi-precision output.

## Visual examples

Examples of triangle-mesh output, mesh inspection, and rendered complex CAD models:

<div style="display: flex; flex-wrap: wrap; gap: 1rem">
  <figure style="flex: 1 1 300px; margin: 0">
    <img
      src="{{ '/assets/img/nanotess/iron-man-render.png' | relative_url }}"
      alt="Rendered Iron Man CAD model"
      style="width: 100%; height: 280px; object-fit: contain"
      loading="lazy"
    >
    <figcaption style="text-align: center">Rendered CAD model</figcaption>
  </figure>
  <figure style="flex: 1 1 300px; margin: 0">
    <img
      src="{{ '/assets/img/nanotess/iron-man-mesh.png' | relative_url }}"
      alt="Triangulated mesh of the Iron Man CAD model"
      style="width: 100%; height: 280px; object-fit: contain"
      loading="lazy"
    >
    <figcaption style="text-align: center">Triangle-mesh output</figcaption>
  </figure>
  <figure style="flex: 1 1 300px; margin: 0">
    <img
      src="{{ '/assets/img/nanotess/stanford-bunny-mesh.png' | relative_url }}"
      alt="Triangulated Stanford Bunny model"
      style="width: 100%; height: 280px; object-fit: contain"
      loading="lazy"
    >
    <figcaption style="text-align: center">Stanford Bunny mesh</figcaption>
  </figure>
  <figure style="flex: 1 1 300px; margin: 0">
    <img
      src="{{ '/assets/img/nanotess/mesh-inspection.png' | relative_url }}"
      alt="CAD surface mesh inspection interface"
      style="width: 100%; height: 280px; object-fit: contain"
      loading="lazy"
    >
    <figcaption style="text-align: center">Surface-mesh inspection</figcaption>
  </figure>
  <figure style="flex: 1 1 300px; margin: 0">
    <img
      src="{{ '/assets/img/nanotess/industrial-vehicle-render.png' | relative_url }}"
      alt="Rendered complex tracked industrial vehicle CAD model"
      style="width: 100%; height: 280px; object-fit: contain"
      loading="lazy"
    >
    <figcaption style="text-align: center">Complex industrial model</figcaption>
  </figure>
  <figure style="flex: 1 1 300px; margin: 0">
    <img
      src="{{ '/assets/img/nanotess/ship-render.png' | relative_url }}"
      alt="Rendered ship CAD model"
      style="width: 100%; height: 280px; object-fit: contain"
      loading="lazy"
    >
    <figcaption style="text-align: center">Ship model</figcaption>
  </figure>
</div>
