---
title: 用 Hugo 在 Linux / macOS 上搭建博客
pubDatetime: 2023-02-14T02:14:07+08:00
description: 从命令行工具开始，在 Linux / macOS 和服务器上搭建 Hugo 博客。
tags:
- web
featured: false
draft: true
lang: zh-CN
---

首先我们需要安装Hugo.

hugo是一个由Go语言编写的静态网站程序.

这里的静态网站的意思一般是指html格式的文件.

基于unix系统万物皆文件的思想,我们使用浏览器打开的网站其实也是一个文件,只不过我们通过网络以及传输协议可以远程获取到文件到本地电脑,再经过浏览器对文件的翻译,就变成了一个可读性更高的网站了.

## 本地环境下搭建本地博客:

Hugo官方推荐Mac采用Homebrew进行安装

Mac在终端中输入`brew install hugo`

安装完成后,可以在终端中输入 `hugo version`来判断是否安装成功.

![image-20230214023156012](/images/posts/48151650688bb54b.png)

此为Linux界面.与Mac差不多.

首先需要介绍一些常用的shell命令(shell命令可以理解为在终端上的一些特别指令)

- `ls` 全称“list directory contents”,用于显示当前目录下的内容

  ![原文配图](/images/posts/1f45db9ff0e85bda.png)

  像我这样,蓝色的为文件夹,白色的为文件.实际上文件夹也视为文件,这里不深入了解.

- `cd` 全称“change directory”,用于改变当前目录.可以是相对路径也可以是绝对路径.

  - 相对路径为 `cd xxx/xxx`,比如我要进入当前目录下Documents文件夹,则为`cd Documents`,如果要在当前目录下直接进入Documents文件夹下的另一个文件夹的话只需要加‘/’即可.比如我要进入Documents文件夹下的cmu15-445文件夹,则为`cd Documents/cmu15-445`.![image-20230214024720758](/images/posts/a221ad6b5f5b3811.png)
  - 绝对路径为 `cd /xxx/xxx`,区别在于开始于‘/’,比较少用,这里不讲.
  - 实用技巧:在终端中,两个点‘..’,代表的是上一级菜单.所以想要返回上一级只需要`cd ..`即可.![image-20230214025041601](/images/posts/58fb1b46ecadc50c.png)

该教程因个人原因暂停更新。
