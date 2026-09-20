---
title: 华东师范大学机试解题笔记
pubDatetime: 2024-01-07T15:53:52+08:00
description: 华东师范大学往年机试题的思路推导与 C++ 实现。
tags:
- algorithms
featured: false
draft: false
lang: zh-CN
---

## 求30的倍数

> ![截屏2024-01-06 14.03.27](/images/posts/7d4e4e8641a90c3c.png)

考虑被30整除的数，实际上即是以0结尾数位和为3的倍数的数。

故判断数位和和存在0即可。构造最大值按照数值个数降序排。

AC代码：

```cpp
#include <bits/stdc++.h>
using namespace std;
int book[10];
void solve(){
    int n; cin >> n;
    int sum  = 0;
    while(n){
        book[n%10]++;
        sum += n%10;
        n/=10;
    }
    if(!book[0] || sum % 3  != 0){
        cout<<-1;
        return;
    }
    for(int i = 9;i>=0;i--){
        while(book[i]){
            book[i]--;
            cout<<i;
        }
    }
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 骑车路线

> Tomislav 最近发现自己的身材完全走样了，她走楼梯都变得很累。
>
> 一天早上她起来以后，她决定恢复姣好的身材。
>
> 她最喜欢的运动是骑自行车，因此她决定在本地的小山上做一次旅行。
>
> 她骑自行车的路线可以描述为 n 个数字的数列，每个数字表示每一段路地海拔高度。
>
> Tomislav 最感兴趣的是最长的高度一直上升的子序列，她称这一段路为爬坡，Tomislav 只想考虑这段爬坡的高度差（即开始和最后的数字的差距），而不是什么路程长度。
>
> 一段爬坡路被定义为长度至少为 2 的**连续**的非下降子数列。
>
> 例如，我们考虑如下路线数列 `12 3 5 7 10 6 1 11`，这里有两个爬坡，第一个爬坡（`3 5 7 10`）的高度差是 7，第二个爬坡的高度差是 10（`1 11`）。
>
> 帮助 Tomislav 计算高度差最大的爬坡的高度差。
>
> **输入格式**
>
> 输入包含多组测试数据。
>
> 每组数据第一行包含整数 n。
>
> 第二行包含 n个整数 p1,p2,…,pn，表示路线数列。
>
> **输出格式**
>
> 每组数据输出一行结果，表示最大高度差。
>
> 如果不存在爬坡，则输出 0。
>
> **数据范围**
>
> 每个输入最多包含 100 组数据。
> 1≤N≤1000,
> 1≤pi≤1000
>
> **输入样例**：
>
> ```
> 5
> 1 2 1 4 6
> 6
> 10 8 8 6 4 3
> ```
>
> **输出样例**：
>
> ```
> 5
> 0
> ```

显然根据题目意思维护连续子非下降序列即可，可以考虑采用双指针的写法。p和i分别表示当前维护的非下降子序列的左端点后右端点，顺便用pc记录最小值。

AC代码：

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 5;
void solve(){
    int n;
    while(cin >> n){
        int p = 0, pc = 0, ans = 0;
        int last = 1001;
        for(int i = 1; i <= n; i++){ 
            int c; cin >> c;
            if(c < last){
                p = i;
                pc = c;
            }
            last = c;
            ans = max(ans, c - pc);
        }
        cout << ans << endl;
    }
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 字符串查询

> ![image-20240106151657763](/images/posts/5c448625173e2566.png)
>
> **输入样例**：
>
> ```
> kileanimal
> 2
> 2 2 7 7
> 1 4 4 7
> ```
>
> **输出样例**：
>
> ```
> DA
> NE
> ```

## 街灯

> 现在是基督降临节，有 N个位置的街道上有 M 个街灯。
>
> 每个灯的照明范围是 K。
>
> 也就是说，在第 X个位置的灯，可以照亮第 X−K 到第 X+K 个位置。
>
> 当然，街道某处可能被多个灯照亮。
>
> 所有灯位于不同的位置。
>
> 问题在于有可能这些灯没法照亮整条街道。
>
> 你的任务是，确定最少还要加多少灯，使得整条街道都被照亮。
>
> **输入格式**
>
> 输入包含多组测试数据。
>
> 每组数据第一行包含三个整数 N,M,K.
>
> 第二行包含 M个升序的整数，表示每个灯的位置。
>
> **输出格式**
>
> 每组数据输出一行，一个整数，表示答案。
>
> **数据范围**
>
> 1≤N≤1000,
> 1≤M≤N,
> 0≤K≤N,
> 输入最多包含 100组数据。
>
> **输入样例**：
>
> ```
> 5 2 2
> 1 5
> 5 1 2
> 2
> ```
>
> **输出样例**：
>
> ```
> 0
> 1
> ```

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 5;
int book[2005];
void solve(){
    int n, m, k; 
    while(cin >> n >> m >> k){
        memset(book, 0, sizeof book);
        for(int i = 1; i <= m; i++){
            int x; cin >> x;
            book[max(x - k, 0)]++;
            book[x + k + 1]--;
        }
        int cnt = 0;
        int p = 1;
        book[n + 1] = 1;
        for(int i = 1; i <= n + 1; i++){
            book[i] += book[i - 1];
            if(book[i]){
                cnt += (i - p + 2 * k) / (2 * k + 1);
                p = i + 1;
            }
        }
        cout << cnt << endl;
    }
    
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 统计卡牌的值

> 给定 n 个字符串。
>
> 每个字符串只可能包含以下字符：`0`，`1`，`2`，`3`，`4`，`5`，`6`，`7`，`8`，`9`，`J`，`Q`，`K`，`A`。
>
> 一个字符串中，每个 `J` 的价值为 11，每个 `Q` 的价值为 2，每个 `K` 的价值为 3，每个 `A` 的价值为 4，其余字符的价值均为 0。
>
> 一个字符串的价值等于其所有字符的价值之和。
>
> 请你计算并输出所有字符串的总价值。
>
> **输入格式**
>
> 第一行包含整数 n。
>
> 接下来 n行，每行包含一个字符串。
>
> **输出格式**
>
> 一个整数，表示总价值。
>
> **数据范围**
>
> 1≤n≤100
> 每个字符串的长度 [1,100]。
>
> **输入样例**：
>
> ```
> 3
> 2345
> A4J
> AA123020
> ```
>
> **输出样例**：
>
> ```
> 13
> ```

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 5;
int book[257];
void solve(){
    book['J'] = 1;
    book['Q'] = 2;
    book['K'] = 3;
    book['A'] = 4;
    int n; cin >> n;
    int cnt = 0;
    while(n--){
        string s1; cin >> s1;
        for(auto x : s1){
            cnt += book[x];
        }
    }
    
        cout<< cnt << endl;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 达到回文数

> 给定一个整数n，从右往左读得到它的反数m，请你判断n与 m 的和s是否是一个回文数。
>
> 回文数是从左往右读和从右往左读结果一样的整数。
>
> 若s不是一个回文数，则继续判断s 和它的反数的和是否是一个回文数。
>
> 重复这一过程，直至达到和为一个回文数为止。
>
> 例如，如果n 为195，则m为591，s为786；再经过以下计算786 + 687 = 1473;1473+ 3741 = 5214;5214 + 4125 = 9339。
>
> 在达到回文数9339之前总共进行了4 次加法操作。
>
> 对于 n，要求计算出达到回文数之前所进行的加法操作的最小次数和最终达到的回文数。
>
> 保证 n 本身不是一个回文数。
>
> 保证对于 n 来说一定能在1000次加法操作之前达到回文数，并且在计算过程中的和一定小于2 ×10^9。
>
> **输入格式**
>
> 一个整数 n。
>
> **输出格式**
>
> 共一行，两个整数，表示最小加法次数及最终达到的回文数。
>
> **数据范围**
>
> ```
> 1≤n≤10000
> ```
>
> **输入样例**：
>
> ```
> 195
> ```
>
> **输出样例**：
>
> ```
> 4 9339
> ```

## 安全驾驶

> 在一单行直线测试车道中有 n+1 辆自动驾驶的小车同向行驶。
>
> 初始时每辆小车有各自的出发位置和恒定速度。
>
> 这些小车按照出发位置的前后顺序，依次编号为 1∼n+1。
>
> 编号越靠前的小车，其出发位置距离终点越近。
>
> 不同小车的出发位置不同。
>
> 最后一辆小车（第 n+1 辆车）**距离终点**的距离为 d公里。
>
> 所有小车同时发车，出发后，若后面的小车追上前面的小车，则出于安全考虑必须降速到与前车相同的速度。
>
> 最后所有小车都需要驶至终点。
>
> 最后一辆小车（第 n+1辆车）不想中途降速，希望全程匀速行驶。
>
> 请计算最后一辆小车在满足条件（全程匀速且保证安全）的情况下的最大可能速度。
>
> **输入格式**
>
> 第一行包含整数 d。
>
> 第二行包含整数 n。
>
> 接下来 n行，其中第 i行包含两个整数 ki,vi，表示第 i辆车在最后一辆小车（第 n+1辆车）**前方** ki公里位置，它的速度为 vi公里/小时。
>
> **输出格式**
>
> 一行，一个实数，表示最后一辆小车（第 n+1辆车）的最大可能速度（单位：公里/小时），结果保留 6 位小数。
>
> **数据范围**
>
> ```
> 1≤d≤10^9
> 1≤n≤1000,
> 0<kn<kn−1<…<k2<k1<d
> 1≤vi≤10^9
> ```
>
> **输入样例**：
>
> ```
> 2525
> 1
> 2400 5
> ```
>
> **输出样例**：
>
> ```
> 101.000000
> ```

需要观察出一个性质，编号越小的车，即使速度比第n+1辆小，若在其达到终点前第n+1辆车没有赶上该车的话，其后那些速度比起大，能够在该车达到终点前赶上该车，也不会与第n+1辆车相遇。根据这一特点，仅需从编号从小到大考虑所有速度在以1编号为起点的非递增子序列上的车辆即可，即考虑每辆车到达终点前的时间，算出相遇的速度，然后取所有车辆得出的速度的最小值即可（感觉这道题当考研算法题很合适...

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 5;
void solve(){
    int d; cin >> d;
    int n; cin >> n;
    int lastv = 2e9;
    double ans = 3e9;
    for(int i = 1; i <= n; i++){
        int k, v; cin >> k >> v;
        if(v < lastv){
            double t = (d - k) / (1.0*v);
            ans = min(ans, v + k / t);
        }
    }
    cout<< fixed << setprecision(6) << ans << endl;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 表面积

> 给定 n个圆柱体，编号 1∼n。
>
> 其中，第 i个圆柱体的底面半径为 ri，高为 hi。
>
> 请你从中挑选 k个圆柱体，并从下到上按照底面半径从大到小、轴心对齐的方式将它们叠在一起**放在地上**（即与地面直接接触的那一面看不到），我们希望得到的物体的**可视**表面积尽可能大。
>
> **注意：** 当圆柱体的半径相同时，可以以任意顺序摆放。可以证明，不管以何种顺序摆放，最终得到的物体的表面积都相同。
>
> 请你计算可视表面积的最大可能值，为了便于计算和输出，你只需要输出这个值除以 π的结果。
>
> **输入格式**
>
> 第一行包含两个整数 n,k
>
> 接下来 n 行，每行包含两个整数 ri,hi。
>
> **输出格式**
>
> 一个整数，表示可视表面积的最大可能值除以 π 的结果。
>
> **数据范围**
>
> ```
> 1≤k≤n≤1000
> 1≤ri,hi≤106
> ```
>
> **输入样例**：
>
> ```
> 2 1
> 100 20
> 200 10
> ```
>
> **输出样例**：
>
> ```
> 44000
> ```

考虑表面积构成，上表面积仅由最底层的半径决定，为$\pi r_1^2$，侧面积为$\sum2\pi r_i\times h_i$,要求$r_i$递减。

求和表达式为$\pi r_1^2 + \sum2\pi r_i\times h_i$,显然比较难处理前面一部分，但是考虑到n只有1000，故可以枚举第一个圆柱体，后者则可以按照半径排序，维护一个贡献前K-1大，问题转换成TOPK问题。

枚举圆柱体为$O(n)$，排序以及处理TOPK的时间复杂度为$O(nlogn)$,总时间复杂度为$O(n^2logn)$

AC代码:

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 5;
#define int long long
#define pii pair<int,int>
#define ll long long
pii a[N];
void solve(){
    int k, n; cin >> n >> k;
    for(int i = 1; i <= n; i++) cin >> a[i].first >> a[i].second;
    sort(a + 1, a + 1 + n,[&](pii &v1, pii &v2){
        return v1.first > v2.first;
    });
    priority_queue<int, vector<int>, greater<int> > que;
    long long  sum  = 0;
    for(int i = 1; i <= n - k + 1; i++){
        long long tmp = a[i].first * a[i].first + 2 * a[i].first * a[i].second;
        for(int j = i + 1; j <= n; j++){
            if(que.size() < k - 1){
                que.push(2 * a[j].first * a[j].second);
            }
            else{
                if(!que.empty() && que.top() < 2 * a[j].first * a[j].second){
                    que.pop(); que.push(2 * a[j].first * a[j].second);
                }
            }
        }
        while (!que.empty()) {
            tmp += que.top(); que.pop();
        }
        sum = max(tmp, sum);
    }
    cout << sum;
}
signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 钥匙

> 经济危机席卷全球，L 国也收到冲击，大量人员失业。
>
> 然而，作为 L国的风云人物，X找到了自己的新工作。
>
> 从下周开始，X将成为一个酒店的助理锁匠，当然，他得先向部门领导展示他的开锁能力。
>
> 领导给了 X一串钥匙，这串钥匙串在一个大圆环上，每把钥匙有一个编号（1..N之一），不同钥匙的编号不同。
>
> 然后蒙上 X的眼睛并把他带到一个圆形的大房间中。
>
> 在这个房间中有 N个上锁的门，顺时针依次编号为 1..N。
>
> 这 N把钥匙，刚好每一把对应打开一扇门（钥匙编号和门编号一致就可以将门打开）。
>
> X的工作就是打开每扇门。
>
> 他因为蒙着眼睛的原因，只能从第 11扇门开始，按顺时针方向，沿着房间的墙壁移动，中途不能改变方向。
>
> 当他摸到一扇门后，他会尝试用当前钥匙串中的第一把钥匙（最左边）来打开门，如果该钥匙不能将门打开，他会将该钥匙移到另外一侧（最右边），重复这样的过程，直到找到正确的钥匙将门打开为止，门打开后他就会继续朝下一扇门移动，他的任务是将所有的门都打开。
>
> 注意，当一把钥匙将一扇门打开后，该钥匙仍然会保持在钥匙串的最左边，而不会被移到另外一侧（最右边）。
>
> 不过 X不知道的是，领导并不是测试他开锁能力，而是测试他的耐心，所以 X每开一扇门后，领导就会在后面悄悄把门再次锁上。
>
> 这样一来，X打开最后一扇门后又会回到第一扇门，然后一直重复下去。
>
> 不过 X是一个勤奋和耐心的人，他一直毫无怨言的做着这件事，不说任何抱怨的话，只是在每开一扇门后，他都会默默的统计自己已经错误了多少次。
>
> 不过慢慢时间太久他的计算能力不足，需要你来帮助他计算错误的次数。
>
> 任务：给定数字 K，请你计算从最开始到他第 K次打开一扇门为止，X一共进行了多少次错误的开门尝试？
>
> **输入格式**
>
> 第一行包含 2 个整数 N,K。
>
> 接下来 N行，其中第 i行包含一个整数 Vi，表示钥匙串中（左起）第 i把钥匙的编号。
>
> **输出格式**
>
> 一个整数，表示从最开始到他第 K次打开一扇门为止，X一共进行的错误开门尝试次数。
>
> **数据范围**
>
> ```
> 1≤N≤10^5,
> 1≤K≤10^9,
> 1≤Vi≤N。
> ```
>
> **输入样例**：
>
> ```
> 4 6
> 4
> 2
> 1
> 3
> ```
>
> **输出样例**：
>
> ```
> 13
> ```
>
> **样例解释**
>
> 开始尝试打开第 11扇门（1 号门）时，钥匙排列：`4 2 1 3`，错误尝试 2 次后门被打开，打开后钥匙排列：`1 3 4 2`。
>
> 开始尝试打开第 2 扇门（2号门）时，钥匙排列：`1 3 4 2`，错误尝试 3 次后门被打开，打开后钥匙排列：`2 1 3 4`。
>
> 开始尝试打开第 3扇门（3号门）时，钥匙排列：`2 1 3 4`，错误尝试 2 次后门被打开，打开后钥匙排列：`3 4 2 1`。
>
> 开始尝试打开第 4 扇门（4 号门）时，钥匙排列：`3 4 2 1`，错误尝试 1 次后门被打开，打开后钥匙排列：`4 2 1 3`。
>
> 开始尝试打开第 55 扇门（1 号门）时，钥匙排列：`4 2 1 3`，错误尝试 2 次后门被打开，打开后钥匙排列：`1 3 4 2`。
>
> 开始尝试打开第 6扇门（2 号门）时，钥匙排列：`1 3 4 2`，错误尝试 3 次后门被打开，打开后钥匙排列：`2 1 3 4`。
>
> 一共错误尝试 13 次。

循环节典题

找循环节可以这样考虑，将模式串的排列顺序当成一种状态，考虑到其相对位置不变，所以实际上的状态数不是$n$阶乘，而是$n$，就是以每个数字为最左钥匙时候构成的序列为一个状态。
再考虑多加一维的状态就是当前开到第几扇门，开门也是循环的，所以总状态数是$n*n$,所以要找到一种方法在$o(n)$中找到循环节。
然后考虑题目要求的是错误尝试，也就是所有$[i,j]$中|$i!=j$的状态，所以对我们有用的其实只有状态$[i,i]$，一共只有$n$种$[i,i]$,那么只需要找到一种方法$O(1)$地从$[i,i]$跳到$[i+1,i+1]$并且能计算其产生的花销就行了

```cpp
#include <bits/stdc++.h>
using namespace std;
#define endl "\n" 
#define ll long long
const int N = 4e5 + 5;
int a[N];
int pos[N];
void solve(){
    int n, k; cin >> n >> k;
    int p = 0;
    for(int i = 1; i <= n; i++) {
        cin >> a[i];
        pos[a[i]] = i;
    }
    ll cnt = pos[1] - 1;
    k--;
    vector<int>vec;
    ll sum = 0;
    for(int i = 2; i <= n; i++){
        if(pos[i] > pos[i - 1]){
            vec.push_back(pos[i] - pos[i - 1]);
        }
        else{
            vec.push_back(pos[i] + n - pos[i - 1]);
        }
        sum += vec.back();
    }
    if(pos[1] > pos[n]){
        vec.push_back(pos[1] - pos[n]);
    }
    else{
        vec.push_back(pos[1] + n - pos[n]);
    }
    sum += vec.back();
    cnt += k / n * sum;
    k %= n;
    for(auto x: vec){
        if(k > 0){
            k--;
            cnt += x;
        }
        else{
            break;
        }
    }
    cout << cnt;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 整数排序

> 给定若干个整数，请你将这些整数按照位数由大到小进行排序，如果位数相同，则按照整数本身由小到大进行排序。
>
> **输入格式**
>
> 共一行，包含若干整数。
>
> **输出格式**
>
> 共一行，输出按要求排序后的整数。
>
> **数据范围**
>
> 输入整数数量范围 $[1,10^6]$。
> 输入整数取值范围$[−10^9,10^9]$。
>
> **输入样例**1：
>
> ```
> 10 -3 1 23 89 100 9 -123
> ```
>
> **输出样例**1：
>
> ```
> -123 100 10 23 89 -3 1 9
> ```
>
> **输入样例**2：
>
> ```
> 1 -2 12
> ```
>
> **输出样例**2：
>
> ```
> 12 -2 1
> ```

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 5;
#define pii pair<int,int>
#define ll long long
vector<int>vec[10];
void solve(){
    int c;
    auto getcnt = [](int x){
        int cnt  = 0;
        if(!x)return 1;
        while(x){
            cnt++;
            x /= 10;
        }
        return cnt;
    };
    while(cin >> c){
        vec[getcnt(c)].emplace_back(c);
    }
    for(int i=9;i>=0;i--){
        sort(vec[i].begin(),vec[i].end());
        for(auto &x: vec[i]){
            cout<< x << ' ';
        }
    }
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 位运算

> 给定一个正整数 x，请你将 x 的二进制表示中第 i 位和第 j 位的值互换，并输出互换后的结果。
>
> 注意: x 的二进制表示的最右边为第 0 位。
>
> **输入格式**
>
> 共一行，包含三个整数 x,i,j。
>
> **输出格式**
>
> 一个整数，表示互换后的结果。
>
> **数据范围**
>
> ```
> 1≤x≤2^31−1
> 0≤i,j≤30。
> ```
>
> **输入样例**1：
>
> ```
> 38 2 4
> ```
>
> **输出样例**1：
>
> ```
> 50
> ```
>
> **输入样例**2：
>
> ```
> 1 0 2
> ```
>
> **输出样例**2：
>
> ```
> 4
> ```

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 5;
#define pii pair<int,int>
#define ll long long
vector<int>vec[10];
void solve(){
    int x, i, j; cin >> x >> i >> j;
    int v = x & (1<<i);
    int u = x & (1<<j);
    x ^= v;
    x ^= u;
    v = (v >> i) << j;
    u = (u >> j) << i;
    x |= v | u;
    cout<< x << endl;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 差分计数

> ![image-20240107175143563](/images/posts/94c3cf3b1485b675.png)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 5;
#define pii pair<int,int>
#define ll long long
int book [N*10];
void solve(){
    int n, x; cin >> n >> x;
    vector<int> vec;
    long long sum = 0;
    for(int i = 1; i <= n; i++){
        int c; cin >> c;
        book[2000000+c + x]++;
        vec.emplace_back(c);
    }
    for(auto x : vec){
        sum += book[2000000+ x];
    }
    cout<< sum;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    int t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 罗马数字

> ![image-20240107175339685](/images/posts/fcd371747bea0e12.png)
>
> **输入格式**
>
> 第一行包含整数 T，表示共有 T组测试数据。
>
> 每组数据占一行，包含一个整数 n。
>
> **输出格式**
>
> 每组数据输出一行结果，一个字符串，表示对应罗马数字。
>
> **数据范围**
>
> ```
> 1≤T≤1000,
> 1≤n≤1000。
> ```
>
> **输入样例**：
>
> ```
> 1
> 3
> ```
>
> **输出样例**：
>
> ```
> III
> ```

```cpp
#include <bits/stdc++.h>
using namespace std;
#define se second
#define fi first
#define endl "\n" 
#define INF 0x3f3f3f3f
#define ll long long
#define LINF 1ll << 60
#define pii pair<int, int>
#define all(x) (x).begin(), (x).end()
#define IOS ios::sync_with_stdio(false); cin.tie(0)
const int mod = 1e9 + 7;
const double PI = acos(-1.0);
const int N = 4e5 + 5;
map<int,char>mp;
string get(int x,int q){
    string s;
    if(x <= 3){
        for(int i=1;i<=x;i++)s.push_back(mp[1*q]);
    }
    //5 6 7
    if(x == 4){
        s.push_back(mp[1*q]);
        s.push_back(mp[5*q]);
    }
    if(x>=5 && x<=8){
        s.push_back(mp[5*q]);
        x-=5;
        for(int i=1;i<=x;i++)s.push_back(mp[1*q]);
    }
    if(x == 9){
        s.push_back(mp[1*q]);
        s.push_back(mp[10*q]);
    }
    return s;
}
void solve(){
    int n; cin >> n;
    int q = 1;
    vector<string>ans;
    while(n){
        if(n%10){
            ans.push_back(get(n%10,q));
        }
        n/=10;q*=10;
    }
    while(!ans.empty()){
        cout<<ans.back();
        ans.pop_back();
    }
    cout<<endl;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    mp[1]='I';mp[5]='V';mp[10]='X';
    mp[10]='X';mp[50]='L';mp[100]='C';
    mp[100]='C';mp[500]='D';mp[1000]='M';
    int t; t = 1;
    cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 乘法

> 给定一个长度为 n的整数数列 a1,a2,…,an和一个长度为 m的整数数列 b1,b2,…,bm。
>
> 利用上述两个数列构造出一个 n×m的整数矩阵 c，其中 $c_i,_j=a_i×b_j$
>
> 给定整数 k，请你计算将矩阵中所有 n×m 个元素**从大到小**排序后的第 k个元素的值。
>
> **输入格式**
>
> 第一行包含三个整数 n,m,k。
>
> 第二行包含 n个整数 a1,a2,…,an。
>
> 第三行包含 m个整数 b1,b2,…,bm。
>
> **输出格式**
>
> 一个整数，表示排序后的第 k个元素的值。
>
> **数据范围**
>
> $1≤n,m≤10^5$,
> $1≤k≤n×m$,
> $−10^6≤ai≤10^6$,
> $−10^6≤bi≤10^6$。
>
> **输入样例**：
>
> ```
> 3 3 3
> 2 3 4
> 4 5 6
> ```
>
> **输出样例**：
>
> ```
> 18
> ```

二分套二分，细节比较麻烦

```cpp
#include <bits/stdc++.h>
using namespace std;
#define endl "\n" 
#define ll long long
const int N = 1e5 + 10;
int a[N], b[N];
int n, m;
bool check(ll mid, long long  k){
    ll cnt = 0;
    for(int i = 1; i <= n; i++){
        if(a[i] == 0){
            if(mid >= 0){
                cnt += m;
            }
        }
        else{
            if(a[i] > 0){
                int l = 1,r = m;
                while(r > l){
                    int midd = (r + l + 1) >> 1;
                    if(1ll*a[i] * b[midd] <= mid){
                        l = midd;
                    }
                    else{
                        r = midd - 1;
                    }
                }
                if(1ll* a[i] * b[l] <= mid){
                    cnt += l;
                }
            }
            else{
                int l = 1, r = m;
                while(r > l){
                    int midd = (r + l) >> 1;
                    if(1ll*a[i] * b[midd] <= mid){
                        r = midd;
                    }
                    else{
                        l = midd + 1;
                    }
                }
                if(1ll* a[i] * b[l] <= mid){
                    cnt += m - l + 1;
                }
            }
        }
    }
    if(cnt >= k){
        return true;
    }
    return false;
}
void solve(){
    ll k; cin >> n >> m >> k;
    k = 1ll * n * m - k + 1;
    for(int i = 1; i <= n; i++) cin >> a[i];
    for(int i = 1; i <= m; i++) cin >> b[i];
    ll l = -1e13, r = 1e13;
    sort(b + 1, b + 1 + m);
    while(r > l){
        ll mid = r + l >> 1;
        if(check(mid, k)){
            r = mid;
        }
        else{
            l = mid + 1;
        }
    }
    cout<< l;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1; 
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

## 最小和

> ![image-20240107175822642](/images/posts/8dfdccea42bd46a0.png)

主席树维护中位数

空间给得太少了，得离散化

```cpp
#include <bits/stdc++.h>
using namespace std;
#define endl "\n" 
#define ll long long
const int N = 1e5 + 10;
int a[N];
int id;
int rt[N *22], ls[N *22], rs[N *22];
long long sum[N *22];
void pushup(int root){
    rt[root] = rt[ls[root]] + rt[rs[root]];
    sum[root] = sum[ls[root]] + sum[rs[root]];
}
int insert(int root, int st ,int ed, int pos, int val){
    ++id;
    rt[id] = rt[root];
    ls[id] = ls[root];
    rs[id] = rs[root];
    sum[id] = sum[root];
    root = id;
    if(st == ed){
        rt[root]++;
        sum[root] += val;
        return root;
    }
    int mid = st + ed >> 1;
    if(pos <= mid){
        ls[root] = insert(ls[root], st, mid,pos, val);
    }
    else{
        rs[root] = insert(rs[root], mid + 1, ed,pos, val);
    }
    pushup(root);
    return root;
}
int query1(int root1, int root2, int st, int ed, int k){
    if(st == ed){
        return st;
    }
    int mid = st + ed >> 1;
    int cnt = rt[ls[root2]] - rt[ls[root1]];
    if(k <= cnt){
        return query1(ls[root1], ls[root2], st, mid, k);
    }
    else{
        return query1(rs[root1], rs[root2], mid + 1, ed, k - cnt);
    }
}
long long query2(int root1,int root2, int st, int ed, int l, int r, int val){
    if(st >= l && ed <= r){
        return sum[root2] - sum[root1] - 1ll * (rt[root2] - rt[root1]) * val;
    }
    long long tsum = 0;
    int mid = st + ed >> 1;
    if(mid >= l){
        tsum += query2(ls[root1],ls[root2], st, mid, l, r, val);
    }
    if(mid < r){
        tsum += query2(rs[root1],rs[root2], mid + 1, ed, l, r, val);
    }
    return tsum;
}
int q[N];
int na[N];
int mp[N];
void solve(){
    int n; cin >> n;
    vector<int>vec;
    for(int i = 1; i <= n; i++){
        cin >> a[i];
        vec.emplace_back(a[i]);
    }
    sort(vec.begin(),vec.end());
    vec.erase(unique(vec.begin(),vec.end()),vec.end());
    for(int i = 1; i <= n; i++){
        na[i] = lower_bound(vec.begin(), vec.end(),a[i]) - vec.begin() + 1;
        mp[na[i]] = a[i];
    }
    for(int i = 1; i <= n; i++){
        q[i] = insert(q[i - 1], 1, n,na[i] ,a[i]);
    }
    int t; cin >> t;
    for(int i = 1; i <= t; i++){
        int l, r; cin >> l >> r;
        int num = query1(q[l - 1], q[r], 1, n, (r - l + 2) / 2);
        long long suml = query2(q[l - 1], q[r], 1, n, 1, num , mp[num]);   
        long long sumr = query2(q[l - 1], q[r], 1, n, num, n, mp[num]);
        cout<< sumr - suml<< endl;
    }
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t = 1; 
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```
