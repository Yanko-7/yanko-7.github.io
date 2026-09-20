---
title: 神经网络训练笔记
pubDatetime: 2024-01-26T00:00:00+08:00
description: 关于权重衰减、Dropout 和梯度稳定性的学习记录。
tags:
- machine-learning
featured: true
draft: false
lang: zh-CN
---

### 估计模型容量

一般来说是可以通过一个模型的参数个数来估计容量
假如特征个数为$n$，则容量为$n+1$，多1是偏置值
假如多加一层隐藏层，设隐藏层有$m$个节点，输出层有$k$个节点。则容量为$(d+1)m+(m+1)k$。类似于图的边数
![image-20240120005140546](/images/posts/dd28dc7192574a4e.png)

### K折交叉验证的目的

- 确定超参数。可以对每个超参数都跑一次K折交叉验证，选取最优的一个超参数。（即平均差最小
- 可以把K折交叉验证的K个模型全拿下来，真正做预测的时候，把测速数据集放到每个模型预测一次。

### 权重衰退

如何处理过拟合的情况（即模型过于复杂，直接记住了训练集。如何控制模型的复杂程度，是一个问题。
有L2正则化
$$
L(\mathbf{w}, b) + \frac{\lambda}{2} \|\mathbf{w}\|^2,
$$
其中$\lambda$为非负超参数
可得梯度下降公式
$$
\begin{aligned}
\mathbf{w} & \leftarrow \left(1- \eta\lambda \right) \mathbf{w} - \frac{\eta}{|\mathcal{B}|} \sum_{i \in \mathcal{B}} \mathbf{x}^{(i)} \left(\mathbf{w}^\top \mathbf{x}^{(i)} + b - y^{(i)}\right).
\end{aligned}
$$
其中$\eta\lambda$取值一般乘积小于1

### 丢弃法（Drop Out）

可以降低模型复杂度
即对变量$x$加入噪音
更一般的
$$
\begin{split}\begin{aligned}
x' =
\begin{cases}
    0 & \text{ 概率为 } p \\
    \frac{x}{1-p} & \text{ 其他情况}
\end{cases}
\end{aligned}\end{split}
$$
根据此公式对每个元素$x$进行扰动，而最终总期望不变。其中$p$为超参数
一般作用在隐藏层
![../_images/dropout2.svg](/images/posts/01b064a0bb909e9f.svg)


### 模型训练的稳定性

明显的，当层数过高时，链式求导的乘积将会变得非常巨大/非常小。这将导致模型非常不稳定。
如何将梯度值处在合理的范围内？
- ResNet 将乘法变成加法
- LSTM
- 梯度归一化
-  合理的权重初始化和激活函数
### Feature Normalization

将特征值正则化，均值为0，标准差为1. 可以Changing Landscape更加有规则。
![image.png](/images/posts/d257954d2fb897ca.png)
当数据输入非常大的时候，不适合所有数据都正则化。所以一般考虑一个Batch。
![image.png](/images/posts/72b58da6e3d43ccf.png)
而testing的时候该怎么办？没有batch，所以单个样本没法计算均值和标准差。
![image.png](/images/posts/b59e1ddf82b1a765.png)
只需要在train时候维护一个均值的均值以及标准差的均值即可。
至于为什么Batch Normalizaiton有效，只能说是偶然![image.png](/images/posts/b51bfc39710bcfaa.png)
