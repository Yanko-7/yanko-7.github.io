---
title: 网络流建模：CF321B 解题札记
pubDatetime: 2022-09-08T18:05:36+08:00
description: 一道费用流问题的建模思路，以及尚待补全的思考。
tags:
- algorithms
- network-flow
featured: false
draft: false
lang: zh-CN
---

### CF321B

一眼费用流，但是竟然不知道如何处理。难点在于无法处理满流后多于出来的左端点权值和最大。

由于无法在流的过程中判断是否满流，故分成两种情况，满流情况，和非满流情况进行建图即可。

不过这道题的精髓在于DP,大部分的网络流题目可以使用DP解决，CCPC2021威海H即为一道。

待补
