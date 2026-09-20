---
title: Modern C++ 学习笔记
pubDatetime: 2023-02-23T15:53:52+08:00
description: 从 nullptr、constexpr 到类型推导、智能指针与移动语义，记录现代 C++ 中值得反复理解的细节。
tags:
- cpp
featured: true
draft: false
lang: zh-CN
---

> 记录不熟悉的地方

## nullptr

nullptr应该替代Null。

某些编译器会把NULL定义为0或者空函数指针。

在C++中会出现问题。

比如`void foo(char*);`和`void foo(int);`

存在foo(NULL)调用的是foo(int)而不是foo(char *).因为C++不允许void *隐式转换,故将被定义为0.

nullptr用于区分空指针和0.实际上其指向一个空对象.

## constexpr (常量表达式)

常量和常量表达式最明显的区别

```cpp
const int len_1 = 2;
char arr[len_1];//非法
char arr_1[2];//合法
```

C++ 标准中数组的长度必须是一个常量表达式.len_1是const 常数，而不是一个常量表达式.

**C++11 提供了 constexpr** 让用户显式的声明函数或对象构造函数在编译期会成为常量表达式.(即编译时即可确定的值)

故constexpr具有更强语意义.

## C++17支持if和switch中定义变量(加分号)

## 初始化列表

为了使对象能像数组,POD一样可以用{}初始化.

```cpp
#include <initializer_list>
class MagicFoo {
public:
std::vector<int> vec;
MagicFoo(std::initializer_list<int> list) {
    for (std::initializer_list<int>::iterator it = list.begin();
    it != list.end(); ++it)
    vec.push_back(*it);
    }
};
MagicFoo magicFoo = {1, 2, 3, 4, 5};
```

list的位置即可被{xxx}替代.

用作一般函数也是可以的.

## 结构化绑定

是tuple支持多种类型多个元素的元组.

但C++11的std::tuple非常难用.取元素需要用tie.

**C++17可以使用auto直接获取**.

`auto [x,y,z] = tuple;`

## 类型推导

register已经被弃用.

`decltype`可以返回类型.比如`decltype(x+y) z;`

判断两个变量类型是否相同时候用`std::is_same<T,U>`

auto不能作函数形参推导(显然)

**尾返回类型**

```cpp
auto add2(T x, U y) -> decltype(x+y){
	return x + y;
}
```

auto将返回类型后置

C++14还支持

```cpp
template<typename T, typename U>
auto add3(T x, U y){
	return x + y;
}
```

## decltype(auto)

**C++14提供的复杂用法**.

一般用于参数/转发函数的推导.

```cpp
std::string lookup1();
std::string& lookup2();
decltype(auto) look_up_a_string_1() {
	return lookup1();
}
decltype(auto) look_up_a_string_2() {
	return lookup2();
}
```

## 控制流

c++17引入constexpr到if语句中,使得在编译时候就可以完成分支判断.

```cpp
template<typename T>
auto print_type_info(const T& t) {
    if constexpr (std::is_integral<T>::value) {
        return t + 1;
    } else {
        return t + 0.001;
    }
}
int main() {
	std::cout << print_type_info(5) << std::endl;
	std::cout << print_type_info(3.14) << std::endl;
}
```

编译后得到

```cpp
int print_type_info(const int& t) {
	return t + 1;
}
double print_type_info(const double& t) {
	return t + 0.001;
}
```

## 区间for迭代

例如`for(xxx : xx)` `for(auto v : vec)`

## 模板

在C++11中,可以指定模板默认类型.这样在使用模板函数时候就不要指出类型了.

```cpp
template<typename T = int, typename U = int>
auto add(T x, U y) -> decltype(x+y) {
	return x+y;
}
// Call add function
auto ret = add(1,3);// == auto ret = add<int, int>(1,3); 
```

## 递归模板函数

感觉上非常麻烦,也不太懂.

需要多写一个终止函数.

```cpp
template<typename T0>
void printf1(T0 value) {
	std::cout << value << std::endl;
}
template<typename T, typename... Ts>
void printf1(T value, Ts... args) {
	std::cout << value << std::endl;
printf1(args...);
}
```

## 变参模板展开

**C++17**提供.可以直接在一个函数中写完.

```cpp
template<typename T0, typename... T>
void printf2(T0 t0, T... t) {
	std::cout << t0 << std::endl;
	if constexpr (sizeof...(t) > 0) printf2(t...);
}
```

## 面向对象

### 委托构造

**C++11引入**.

### 继承构造

使用关键词using.

```cpp
class Base {
    public:
    int value1;
    int value2;
    Base() {
    }
};
class Subclass : public Base {
public:
    using Base::Base; // 继承构造
};
```

## Lambda 表达式捕获

**C++14**支持表达式捕获.

```cpp
auto important = std::make_unique<int>(1);
auto add = [v1 = 1, v2 = std::move(important)](int x, int y) -> int {
	return x+y+v1+(*v2);
};
```

## Lambda泛型

**C++14**支持关键字泛型 不加尾置返回类型.

```cpp
auto add = [](auto x, auto y) {
	return x+y;
};
```

## 函数包装器

std::function(函数的容器)

```cpp
int foo(int para){
    return para;
}
std::function<int(int)> func = foo;
std::cout << func(1);
```

### std::bind 和std::placeholder

std::bind用于绑定函数调用的参数. std::placeholder用于占位.通过这个函数，我们可以将部分调用参数提前绑定到函数身上成为一个新的对象，然后在参数齐全后，完成调用

```cpp
int foo(int a, int b, int c){}
auto bindfoo = std::bind(foo,1,std::placeholder::_2,3);
bindfoo(2);
```

## 引用

左值:赋值符号左边的值.表达式赋值后依然存在的持久对象.

右值:右边的值,表达式结束后就不存在的临时对象.

纯右值:纯粹的字面量,匿名的临时对象,运算表达式产生的临时变量,非引用的返回临时变量.Lambda属于纯右值.

将亡值:C++11为引入右值引用提出的概念. 即将被销毁但是能被移动的值.

常量左值引用能够延长临时变量的生命周期

右值引用延长临时对象生命周期

非常量引用能够修改临时变量

```cpp
const std::string& lv2 = lv1 + lv1; // 合法, 常量左值引用能够延长临时变量的生命周期
// lv2 += "Test"; // 非法, 常量引用无法被修改
std::string&& rv2 = lv1 + lv2; // 合法, 右值引用延长临时对象生命周期
rv2 += "Test"; // 合法, 非常量引用能够修改临时变量
```

```cpp
// int &a = std::move(1); // 不合法，非常量左引用无法引用右值
const int &b = std::move(1); // 合法, 常量左引用允许引用右值
```

故左引用可以绑定,但实际上不允许修改临时变量.

原因如下:

```cpp
void increase(int & v) {
	v++;
}
void foo() {
    double s = 1;
    increase(s);
}
```

是为了防止修改临时值.

## 完美转发

一个声明的右值引用其实是一个左值.进行参数转发的时候就比较麻烦.

传统C++是不允许对引用再引用的.右值引用出现放宽了这一要求.

### 引用坍缩规则

进行类型推导.

比如函数形参类型为T&&.实参为左引用.则为T&&&.推导为左引用.

所以无论模板参数是什么类型的引用，当且仅当实参类型为右引用时，模板参数才能被推导为右引用类型。这才使得v作为左值的成功传递。

完美转发就是基于上述规律产生的。所谓完美转发，就是为了让我们在传递参数的时候，保持原来 的参数类型（左引用保持左引用，右引用保持右引用）。

无论如何,std::move总是会接受一个左值.故当传入一个右值时候会多进行一次类型转换成左值,再转成右值.只有std::forward没有任何多余的拷贝,完美转发了函数实参给内部调用函数.

`std::forward<T> xxx;`

## 容器

std::array的优势:

- 相比于vector,vector无法自动释放删除的内存,需要手动.
- 相比于传统数组,array的写法更加现代.

std::forward_list 为单向链表

## 为什么set用std::lower_bound会更慢

传统C++中的有序容器有std::map/std::set.内部通过红黑树实现.迭代器为双向迭代器.虽然迭代器排布上元素是有序的,但与vector和array等不同的是,vector和array是随机访问迭代器.

在lower_bound的实现上有一个函数为advance(iterator &it,Distance n).用于让it向前或向后移动n个步长.对于随机迭代器来说其花销为常数.但对于双向迭代器而言则相当于执行n次++或者-.花销为O(n).

故对于std::map/std::set等不支持随机访问迭代器的.使用std::lower_bound,由于其迭代器在排列上元素是有序的,故可以保证其答案的正确性,但其算法却使得其时间复杂度为O(logn+n).故应该使用其内部的lower_bound.

## map容器

unorder_map / map的初始化可以采用pair的形式.

```cpp
std::unordered_map<int, std::string> u = {
    {1, "1"},
    {3, "3"},
    {2, "2"}
};
```

## 元组

核心三函数

1. std::make_tuple: 构造元组
2. std::get: 获得元组某个位置的值
3. std::tie: 元组拆包

```cpp
auto x = std::make_tuple(1.7, 2, "asfaf"); //自动类型推导
//auto x = tuple<double, int, string>(1.7, 2, "asfaf");
std::cout<<std::get<0>(x);
double x1; int x2; string x3;
std::tie(x1,x2,x3) = x;
```

C++17支持`auto [x, y, z] = x;`

合并两个tuple,`std::tuple_cat(one,two);`

## std::variant

上面的std::get等都是只支持编译期间,而不支持运行期(即动态类型)

`std::variant<>` **（C++ 17 引入）**

可以保存任意类型的**一个**值或者空值.

不可存放引用,数组,void.

```cpp
std::variant<int,double,std::string>v;
v = 2;
std::cout<<v.index()<<std::endl;//0
v = 2.4;
std::cout<<v.index()<<std::endl;//1
```

另外可通过`std::get<index/类型>`获取元素.

`holds_alternative<类型>(xxx)`检查variant当前是否持有某个特定类型.

## RAII与引用计数

### std::shared_ptr

get()可以获取原始指针,用这样不会让引用计数增加.

注意事项:**用另一`shared_ptr`所占有的底层指针创建新的`shared_ptr`导致未定义行为**
