---
title: 动态规划专题：从状态定义到转移
pubDatetime: 2023-02-28T02:14:07+08:00
description: SCAU 春季 ACM 专题训练：背包问题与动态规划的状态设计。
tags:
- algorithms
- dynamic-programming
featured: false
draft: false
lang: zh-CN
---

## [A (01背包)](https://www.luogu.com.cn/problem/P8742)

砝码可放左边可放右边,故这个问题可以转变成可加可减,问有多少种大于等于0的重量.

注意到N个砝码总重重量不会超过1e5,并且只有最多100个砝码.

我们可以很容易地想到一个100*1e5的状态方程.

$dp[i][j]$表示为考虑完前i个砝码,能否称出j重量.

显然,假如前i-1个砝码能称出j,那么i个肯定能称出j.(不放第i个)

另外有两种决策,放左边/放右边,即+还是-.

故我们可以得到状态转移方程

$$
dp[i][j]=dp[i-1][j]|dp[i-1][j-W[i]]|dp[i-1][j+W[i]]
$$

|运算表示其中存在即可以,当然具体的实现不能直接这么一条式子,我们需要处理重量小于0的情况.

当然如果注意到$j-W[i]$如果为负数,其实只需要取abs即可.

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;
bool dp[105][2*N];
int w[105];
void solve(){
    int n; cin >> n;
    for(int i = 1; i <= n; i++){
        cin >> w [i];
    }
    dp[0][0] = 1;
    for(int i = 1; i <= n; i++){
        for(int j = 0; j <= N - 5; j++){
            dp[i][j] = dp[i - 1][j] | dp[i - 1][j + w[i]] | dp[i - 1][abs(j - w[i])];
        }
    }
    int cnt = 0;
    for(int i = 1; i <= N - 5; i++){
        cnt += dp[n][i];
    }
    cout<< cnt << endl;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
```

---

## [B(线性DP)](https://codeforces.com/problemset/problem/455/A)

> 给出一个n元素序列.可以做操作.
>
> 一个操作可以选一个元素$a_k$然后删掉,所有值等于$a_k+1/a_k-1$的也要被删去.然后这一步所得分数为$a_k$.
>
> 问最大得分是多少.

考虑一个元素的决策,删与不删所带来的影响.

i元素删了,显然i-1元素就要被删,那么i-2是不受影响的.同理i+2也是.答案可以从i-2转移.但这样考虑前考虑后的做法有后效性(删去后,对i+1的转移产生影响),故考虑增加一个维度来删除后效性.

设$dp[i][op]$表示考虑完前i个数,并且第i个删/不删时的最大贡献. op为0表示不删,op为1表示删.

故有

$$
dp[i][1]=max(dp[i-1][0]+i*book[i],dp[i-1][1]);
$$

$$
dp[i][0]=max(dp[i-1][1],dp[i-1][0]);
$$

第一条式子意思为第i个删时候,从i-1不删加上删i的贡献(因为i-1不删,所以i-1没贡献)以及i-1先删,i元素在i-1删的时候就被删除了两种状态转移而来.

```cpp
#include<bits/stdc++.h>
using namespace std;
#define se second
#define fi first
#define LINF 0x3f3f3f3f3f3f3f3f
#define INF 0x3f3f3f3f
#define ll long long
#define pii pair<ll,ll>
const int mod = 998244353;
const int N = 2000005;
#define INF 0x3f3f3f3f
int book[N];
ll dp[N][2];
void solve() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        int k;
        cin >> k;
        book[k]++;
    }
    ll maxn = 0;
    for (int i = 1; i <= 100000; i++) {
        if (book[i]) {
            dp[i][1] = max(dp[i - 1][0] + 1ll * i * book[i], dp[i - 1][1]);
            dp[i][0] = max(dp[i - 1][1], dp[i - 1][0]);
        } else {
            dp[i][0] = max(dp[i - 1][1], dp[i - 1][0]);
        }
        maxn = max({maxn, dp[i][0], dp[i][1]});
    }
    cout << maxn;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
    return 0;
}
```

---

## [C(期望DP)](https://www.luogu.com.cn/problem/P8774)

> 有一只甲壳虫想要爬上一颗高度为 n 的树，它一开始位于树根, 高度为 0，当它尝试从高度 i-1 爬到高度为 i 的位置时有 $P_i$ 的概率会掉回树根, 求它从树根爬到树顶时, 经过的时间的期望值是多少。

设$DP[i]$为位于i高度到树顶的时间期望.

$$
DP[i] = 1+DP[i+1]*(1-P_{i+1})+DP[0]*P_{i+1}
$$

按照题目就是这个方程的意思.

一看是三个未知数.

尝试从树顶向下推

$$
DP[n-1] = 1+DP[n]*(1-P_{n})+DP[0]*P_{n}==DP[n-1] = 1+DP[0]*P_{n}
$$

$$
DP[n-2] = 1+DP[n-1]*(1-P_{n-1})+DP[0]*P_{n-1}
$$

直到

$$
DP[0] = 1+DP[1]*(1-P_{1})+DP[0]*P_{1}
$$

公式为$DP[i]=1+DP[i+1]*(1-P_{i+1})+DP[0]*P_{i+1}\ \ (1)$

观察可得

为$DP[i] = c_i+ DP[n]*x_i + DP[0]*y_i$形式

DP[n]为0.则为$DP[i] = c_i + DP[0]*y_i\ \ (2)$

根据(2)式带入(1)式

i为n-1时,$c_i=1,y_i=P_{n}$

i为n-2时,$c_i=1+1-P_{n-1},y_i=P_{n}+P_{n-1}-P_{n}*P_{n-1},$

i为n-3时,$c_i=1+c_{i+1}-c_{i+1}*P_{n-2},y_i=P_{n-2}+y_{i+1}-y_{i+1}*P_{n-2}$

类似的我们可以得到关于c和y的递推式

$c_i=1+c_{i+1}-c_{i+1}*P_{i+1},y_i=P_{i+1}+y_{i+1}-y_{i+1}*P_{i+1}$

当i为0的时候,

$DP[0]=c_0 + DP[0]*y_0 == DP[0] = \frac{c_0}{1-y_0}$

```cpp
#include<bits/stdc++.h>
using namespace std;
#define se second
#define fi first
#define LINF 0x3f3f3f3f3f3f3f3f
#define INF 0x3f3f3f3f
#define ll long long
#define pii pair<ll,ll>
const int mod = 998244353;
const int N = 2000005;
#define INF 0x3f3f3f3f
int xx[N],yy[N];
int qsm(int a,int b){
    int res = 1;
    while(b){
        if(b & 1){
            res = 1ll * res * a %mod;
        }
        a = 1ll * a * a % mod;
        b >>= 1;
    }
    return res;
}
void solve() {
    int n; cin >> n;
    for(int i = 1; i <= n; i++){
        cin >> xx[i] >> yy[i];
    }
    int c = 0, y = 0;
    for(int i = n - 1; i >= 0; i --){
        int p = 1ll * xx[i + 1] * qsm(yy[i + 1], mod - 2) % mod;
        c = (1 + c) % mod - 1ll * c * p % mod; y = (p + y) % mod - 1ll * y * p % mod;
        c = (c + mod) % mod; y = (y + mod) % mod;
        if(i == 0){
            cout<< 1ll * c * qsm((1 - y + mod) % mod, mod -2) % mod;
            break;
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    solve();
    return 0;
}
```

---

## [D(DP入门)](https://codeforces.com/problemset/problem/1285/B)

> 要求是否能找到一个最大子段和大于总和,且不能是全选.

做法就是最普通的DP最大子段和.还有些特殊情况考虑.

```cpp
#include<iostream>
#include<queue>
#include<vector>
#include<stack>
#include<set>
#include<cstring>
#include<map>
#include<algorithm>
#include<cmath>
using namespace std;
#define INF 0x3f3f3f3f
#define ll long long
#define fi first 
#define se second
#define pii pair<int,int>
const int N=500005;
const int mod=1e9+7;
ll dp[N];
ll a[N];
ll sum[N];
void solve(){
	int n;cin>>n;
	ll maxn=-INF;
	for(int i=1;i<=n;i++){
		cin>>a[i];sum[i]=sum[i-1]+a[i];
		dp[i]=max(1ll*a[i],dp[i-1]+a[i]);
		if(dp[i]>maxn){
			maxn=dp[i];
		}
	}
	bool flag=false;
	for(int i=1;i<n;i++){
		if(sum[i]==0)flag=true;
	}
	for(int i=n;i>1;i--){
		if(sum[n]-sum[i-1]==0){
			flag=true;
		}
	}
	if(maxn==sum[n]){
		if(flag){
			cout<<"NO"<<"\n";
		}
		else{
			cout<<"YES"<<"\n";
		}
	}
	else{
		cout<<"NO"<<"\n";
	}
}
int main(){
	ios::sync_with_stdio(false);
	cin.tie(0);
	int t;cin>>t;
	while(t--){
		solve();
	}
	return 0;
}
```

---

## [E(完全背包)](https://codeforces.com/problemset/problem/189/A)

> 四个物品,每个物品都可以无限拿,背包大小为n,问最多多少个物品.

参考代码：[vic_cgh](https://vjudge.net/user/vic_cgh) 的 [CodeForces 189A 题解](https://vjudge.net/problem/CodeForces-189A)。

```cpp
# include <iostream>
# include <algorithm>
# include <cstdio>
# include <cstring>
# include <cmath>
# include <map>
# include <iomanip>
# include <queue>
# define LL long long
# define is(a) (a>='0' && a <= '9')
# define imax(a , b) ( (a) > (b) ? (a) : (b) )
# define imin(a , b) ( (a) < (b) ? (a) : (b) )
using namespace std;
const int N = 1e5 + 5;
int n,T,f[N] ,ans,a[N];
int main()
{
	std::ios::sync_with_stdio(0);
	cin.tie(0) , cout.tie(0);
	int T;
	cin>>n;
	for (int i = 1; i <= 3; ++i) cin>>a[i];
	for (int i = 1; i <= n; ++i) f[i] = -1;
	f[0] = 0;
	for (int i = 1; i <= 3; ++i)
		for (int j = a[i]; j <= n; ++j)
			{
				if (f[j - a[i]] >= 0) f[j] = imax(f[j] ,f[j - a[i]] + 1);
				ans = imax(ans , f[n]);
			}
	cout<<ans;
	return 0;
}
```

---

## [F(计数DP)](https://codeforces.com/contest/559/problem/C)

非常经典的一道计数DP题.

首先有个基础的认识.在方格中,从左上角(0,0)到(x,y)只能向下和向右走,共有$C^x_{y+x}$种方案.

设$DP[i]$表示从左上不碰到黑色格到第i个位置的方案总数.

所以我们根据x为第一关键字,y为第二关键字进行排序,这样可以保证顺序处理的时候,位于要处理的点的左上方的所有点都已经被处理过了.

然后考虑如何计数的问题.

只需要将计数根据某个特征进行分类统计即可.

在这道题中,可以根据第一次碰到黑格的位置进行分类.反方向思考.利用容斥原理.

即对于每个黑格(x,y)我们计算从左上(0,0)不碰到其他黑色格然后到(x,y)的方案总数,即在(x,y)这个点才第一次碰到黑格.然后再乘上从(x,y)到要计算的位置的(x1,y1)上的所有行走方案.

那么就可以计算出第一次在(x,y)碰到黑色格,然后走到(x1,y1)的所有方案.

求和所有左上角所有的黑色格的贡献.即可以求出碰到过黑色格但走到(x1,y1)的方案数.再用总方案数减去,即可求出没有碰到过黑色格的方案数.

```cpp
#include<bits/stdc++.h>
using namespace std;
#define se second
#define fi first
#define endl "\n"
#define INF 0x3f3f3f3f
#define ll long long
#define LINF 1ll<<60
#define pii pair<ll,int>
#define all(x) (x).begin(),(x).end()
#define IOS ios::sync_with_stdio(false); cin.tie(0)
const int mod = 1e9+7;
const double PI = acos(-1.0);
const int N =2e5+10;
int fac[N],ifac[N];
int qsm(int a,int b){
    int res=1;
    for(;b;b>>=1){
        if(b&1)res=1ll*res*a%mod;
        a=1ll*a*a%mod;
    }
    return res;
}
void init(int n){
    fac[0]=ifac[0]=1;
    for(int i=1;i<=n;i++)fac[i]=1ll*fac[i-1]*i%mod;
    ifac[n]=qsm(fac[n],mod-2);
    for(int i=n-1;i>=1;i--)ifac[i]=1ll*ifac[i+1]*(i+1)%mod;
}
int C(int x,int y){
    return 1ll*fac[x]*ifac[x-y]%mod*ifac[y]%mod;
}
pii a[N];
int f[N];
void solve(){
    int h,w,n;cin>>h>>w>>n;
    for(int i=1;i<=n;i++){
        cin>>a[i].fi>>a[i].se;
    }
    n++;a[n].fi=h,a[n].se=w;
    sort(a+1,a+1+n,[&](pii a1,pii b1){
        if(a1.fi==b1.fi)return a1.se<b1.se;
        return a1.fi<b1.fi;       
    });
    for(int i=1;i<=n;i++){
        f[i]=C(a[i].fi+a[i].se-2,a[i].fi-1);
        for(int j=1;j<i;j++){
            if(a[i].se>=a[j].se){
                f[i]=(f[i]-1ll*f[j]*C(a[i].fi-a[j].fi+a[i].se-a[j].se,a[i].se-a[j].se)%mod+mod)%mod;
            }
        }
    }
    cout<<f[n]<<endl;
}
int main(){
    IOS;
    int t = 1;
    init(200005);
    while(t--){
        solve();
    }
    return 0;
}
```

---

## [G(树上背包)](https://codeforces.com/problemset/problem/815/C)

一般来说,我们可以用维度信息来表达能否达到某种条件.

比如$DP[i]$可以表示成i价格所能购买的最多商品个数.或者$DP[i][j]$表示i价格能否买到j个商品.但实际上像第二个bool类型的DP方程,如果不是要求每个都要求出来而是求最大的时候.可以反着设计方程,这样一般可以有时间上的优化.

比如这道题,$DP[i][j]$表示考虑i为根的子树,当买j个商品时候的最小代价是多少.

为了消除是否使用了优惠卷后的后效性,我们还需要增加一维.

$DP[i][j][op]$表示考虑i为根的子树,并且第i个商品是否使用了消费卷,当买j个商品时候的最小代价是多少.

此处转移跟B题类似.

此外还需要注意上下界的优化,以此保证时间复杂度为O($n^2$);

以下代码

```cpp
#include<bits/stdc++.h>
using namespace std;
#define se second
#define fi first
#define LINF 0x3f3f3f3f3f3f3f3f
#define endl "\n"
#define INF 0x3f3f3f3f
#define pii pair<int,int>
#define ll long long
const int mod=998244353;
#define N 5005
#define IOS ios::sync_with_stdio(false); cin.tie(0)
char s1[N];
ll dp[5005][5005][2];
int val[N],dis[N];
vector<int>vec[N];
int siz[N];
ll tmp[N][2];
void dfs(int u,int fa){
    siz[u]=1;dp[u][0][0]=0;dp[u][1][1]=val[u]-dis[u];
    dp[u][1][0]=val[u];
    for(auto x:vec[u]){
        dfs(x,u);
        for(int i=0;i<=siz[u]+siz[x];i++){
            tmp[i][0]=tmp[i][1]=INF;
        }
        for(int i=0;i<=siz[u];i++){
            for(int j=0;j<=siz[x];j++){
                tmp[i+j][1]=min({tmp[i+j][1],dp[x][j][0]+dp[u][i][1],dp[x][j][1]+dp[u][i][1]});
                tmp[i+j][0]=min({tmp[i+j][0],dp[x][j][0]+dp[u][i][0]});
            }
        }
        siz[u]+=siz[x];
        for(int i=0;i<=siz[u];i++){
            dp[u][i][1]=tmp[i][1];
            dp[u][i][0]=tmp[i][0];
        }
    }
}
void solve(){
    int n,b;cin>>n>>b;
    memset(dp,INF,sizeof dp);
    for(int i=1;i<=n;i++){
        cin>>val[i]>>dis[i];
        if(i!=1){
            int c;cin>>c;vec[c].push_back(i);
        }
    }
    dfs(1,0);
    int p=0;
    for(int i=0;i<=n;i++){
        if(b>=dp[1][i][0]||b>=dp[1][i][1]){
            p=i;
        }
    }
    cout<<p;
}
signed main(){
    IOS;
    int t=1;
    //cin>>t;
    while(t--){
        solve();
    }
    return 0;
}
```

---

## [H(线性DP)](https://codeforces.com/problemset/problem/1005/D)

> 切割字符串,使得能被3整除的段数最多.

考虑被3整除的性质,即和%3 == 0.

根据余数的性质,可以划分三种状态.

即设$DP[i][j]$为考虑完前i个数,且最后一段以第i个数结束,且最后一段数和%3的余数为j的最多段数.

考虑一个数的决策.

1. 与前面一段数合并.
2. 自己作为一个新段

特殊处理0.

转移看代码吧

```cpp
#include<bits/stdc++.h>
#include <cstdio>
#include <cstring>
using namespace std;
const int N = 3e5 + 5;
int dp[N][3];
char s[N];
void solve(){
    cin >> s + 1;
    int n = strlen(s + 1);
    for(int i = 0; i <= n; i++){
        for(int j = 0; j<= 2; j++){
            dp[i][j] = - 0x3f3f3f3f;
        }
    }
    dp[0][0] = 0;
    for(int i = 1; i <= n; i++){
        if(s[i]=='0'){
            for(int j = 0; j<= 2; j++){
                dp[i][0] = max(dp[i-1][j],dp[i][0]);
            }
            dp[i][0] ++ ;
            continue;
        }
        for(int j = 0; j<= 2; j++){
            dp[i][(j + s[i]-'0') % 3] = max(dp[i-1][j] + ((j + s[i]-'0') % 3 == 0), dp[i][(j + s[i]-'0') % 3]);
            dp[i][(s[i]-'0') % 3] = max(dp[i-1][j] + ((s[i]-'0') % 3 == 0), dp[i][(s[i]-'0') % 3]);
        }
    }
    int ans = -1;
    for(int i = 0; i <= 2; i++)ans = max(ans, dp[n][i]);
    cout<< ans;
}
int main(){
    solve();
    return 0;
}
```

---

## [I（计数 DP？不是）](https://atcoder.jp/contests/abc266/tasks/abc266_g?lang=en)

这不是DP啊,其实这是道数学题.

> 求符合要求的字符串个数，对 998244353 取余。
>
> 满足要求的字符串 _s_ 具备以下特性：
>
> 1. _s_ 由 `r`、`g`、`b` 构成。
> 2. _s_ 中有 _R_ 个 `r`，_G_ 个 `g`，_B_ 个 `b`，_k_ 个 `rg`。

钦定rg出现了至少k次的方案数设为$f(k)$.先考虑在k个rg中插入剩下的r,g,b.


![image-20230227150558238](/images/posts/37deb64f1567e9fe.png)


与插板法不同的地方在于,头和尾都有插板.

设剩下的r,g,b的个数为y.

先不考虑插入的是什么字符,暂且认为插入的是空字符.

假设有k个rg要被插入插板.

那么相当于是满足下列等式的方案数.

$$
x_1+x_2+x_3+\dots+x_{k+1} = y \ \ (x_i>=0)
$$

这就是经典的非负整数和,插板法可得方案数为$C_{k+y}^{y}$.

在题目中,设字符串长度为len.则为$C_{k+1+len-2\times k-1}^{k+1-1}=C_{len-k}^{k}$

插好空字符后,即需要分配r,g,b到空字符中,相当于全排列后对三种类型进行消序.

即$\frac{(len-k)!}{b!(r-k)!(g-k)!}$

得

$$
f(k) = C_{len-k}^k\frac{(len-2\times k)!}{b!(r-k)!(g-k)!}
$$

有二项式反演

$$
f(x) = \sum^{limit}_{i=x}C_i^x g(i) ⇔ g(x)=\sum^{limit}_{i=x}(-1)^{i-n}C_i^x f(i)
$$

其中$g(x)$表示为恰好k次的方案数.

可以得到

$$
g(x)=\sum^{limit}_{i=x}(-1)^{i-n}C_i^x C_{len-i}^i\frac{(len-2\times i)!}{b!(r-i)!(g-i)!}
$$

带入k即是答案.

```cpp
#include<bits/stdc++.h>
using namespace std;
#define se second
#define fi first
#define endl "\n"
#define INF 0x3f3f3f3f
#define ll long long
#define LINF 1ll<<60
#define pii pair<int,int>
#define IOS ios::sync_with_stdio(false); cin.tie(0)
const int mod = 998244353;
const double PI = acos(-1.0);
const int N = 5000005;
const double eps = 1e-7;
ll invf[N], f[N];
ll qpow(ll x, ll y) {
    ll res = 1;
    ll base = x % mod;
    while (y) {
        if (y & 1) res = res * base % mod;
        base = base * base % mod;
        y >>= 1;
    }
    return res % mod;
}

void init(int n)//组合的上限
{
    f[0] = invf[0] = 1;
    for (int i = 1; i <= n; i++) f[i] = f[i - 1] * i % mod;
    invf[n] = qpow(f[n], mod - 2) % mod;
    for (int i = n - 1; i >= 1; i--) invf[i] = invf[i + 1] * (i + 1) % mod;
}

int C(ll x, ll y) //组合数C x个中取y个
{
    return f[x] * invf[y] % mod * invf[x - y] % mod;
}

void solve() {
    int r, g, b, k;
    cin >> r >> g >> b >> k;
    int len = b + g + r;
    int maxn = min(len / 2, min(r, g));
    ll sum = 0;
    //cout<<maxn<<endl;
    for (int i = k; i <= maxn; i++) {
        ll fz1 = f[len - 2 * i];
        ll fm1 = 1ll * f[b] * f[r - i] % mod * f[g - i] % mod;
        ll op = 1;
        fm1 = qpow(fm1, mod - 2);
        if ((i - k) % 2)op = -op;
        sum = (sum + 1ll * op * ((C(i, k) * fz1 % mod * fm1 % mod * C(len - i, i) % mod) % mod) + mod) % mod;
    }
    cout << sum << endl;
}

int main() {
    IOS;
    init(5000005);
    int t = 1;
    //cin >> t;
    while (t--) {
        solve();
    }
    return 0;
}
```

---

## [J(DP)](https://codeforces.com/problemset/problem/13/C)

看到范围是5000.可以考虑$n^2$的DP.

首先需要知道一个结论,即最小代价的序列的最后一个数必然是原序列中的其中一个数.

根据这个性质,将a排序后生成b

可以得到DP方程

$DP[i][j]$表示为序列前i个,经过操作后最大的数为b的第j个的最少代价.

$DP[i][j]= min_1^j(DP[i-1][k]+abs(a[i]-b[j]))$

即,前i-1个最大数为b[k]的代价(b[k]是小于<=b[j]的)加上让最后一个数a[i]变成b[j]的代价.

```cpp
#include<bits/stdc++.h>
using namespace std;
#define se second
#define fi first
#define endl "\n"
#define INF 0x3f3f3f3f
#define ll long long
#define LINF 1ll<<60
#define pii pair<int,int>
#define IOS ios::sync_with_stdio(false); cin.tie(0)
const int mod = 998244353;
const double PI = acos(-1.0);
const int N = 100005;
const double eps = 1e-7;
int a[N], b[N];
ll dp[2][5005];
void solve() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++)cin >> a[i], b[i] = a[i];
    sort(b + 1, b + 1 + n);
    for (int i = 1; i <= n; i++) {
        ll minn = LINF;
        int now = i & 1;
        for (int j = 1; j <= n; j++) {
            minn = min(minn, dp[now ^ 1][j]);
            dp[now][j] = minn + abs(a[i] - b[j]);
        }
    }
    ll ans = LINF;
    for (int i = 1; i <= n; i++) {
        ans = min(ans, dp[n & 1][i]);
    }
    cout << ans;
}

int main() {
    IOS;
    int t = 1;
    //cin >> t;
    while (t--) {
        solve();
    }
    return 0;
}
```

---

## [K(计数DP)](https://atcoder.jp/contests/abc262/tasks/abc262_d)

注意到小数不符合,当且仅当总和是数量的倍数,且数量很少的条件.我们其实就可以知道了,这是一个余数DP.

$dp[i][j][k][z]$表示为考虑前i个数,选取了j个数的条件下,%k的余数为z的方案数.

然后转移就只有两种决策,即选和不选,01背包问题.

以下代码采用刷表法.

```cpp
#include<bits/stdc++.h>

using namespace std;
#define se second
#define fi first
#define LINF 0x3f3f3f3f3f3f3f3f
#define endl "\n"
#define INF 0x3f3f3f3f
#define pii pair<int,int>
#define ll long long
const int mod = 998244353;
#define N 500005
#define IOS ios::sync_with_stdio(false); cin.tie(0)
int dp[105][105][105][105];
int a[N];
void solve() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++)cin >> a[i];
    for (int i = 1; i <= n; i++) {
        dp[0][0][i][0] = 1;
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j <= i; j++) {
            for (int k = 1; k <= n; k++) {
                for (int z = 0; z < k; z++) {
                    dp[i + 1][j + 1][k][(z + a[i + 1]) % k] += dp[i][j][k][z];
                    dp[i + 1][j + 1][k][(z + a[i + 1]) % k] %= mod;
                    dp[i + 1][j][k][z] += dp[i][j][k][z];
                    dp[i + 1][j][k][z] %= mod;
                }
            }
        }
    }
    ll sum = 0;
    for (int i = 1; i <= n; i++) {
        sum = (sum + dp[n][i][i][0]) % mod;
    }
    cout << sum;
}

int main() {
    IOS;
    int t = 1;
    while (t--) {
        solve();
    }
    return 0;
}
```

---

## [L(单调队列优化DP)](http://poj.org/problem?id=1821)

从数据范围上看,是个$n\times k$的DP.

设出方程$DP[i][j]$表示前i个人,安排前j个任务下的最大贡献.

根据题意可以得到转移方程

$$
DP[i][j]= max_{k}(DP[i-1][k]+(j-k+1)\times B[i])
$$

其中这条转移需要j在一定范围内才能进行,且k随着j的范围进行改变

其中$0<=j-C[i]<=A[i],j-C[i]<=k<=j$

其他情况下,$DP[i][j]=DP[i-1][j]$

如果按照上面的方程直接转移,时间复杂度达到$O(n^2k)$没法通过这道题,考虑优化区间max.

移项可得

$$
DP[i][j]=(j+1)\times B[i]+max_{k}(DP[i-1][k]-k\times B[i])
$$

当然我们可以在i层算每个j的时候加上B[j],然后树状数组/线段树等带log的做法查询区间的最值.但本题只给了一秒,所以需要O(1)的转移.

每一层的i的区间长度是固定的,j的决策范围为连续一段的最大值,且区间长度固定,故采用单调队列优化即可.

参考代码：vic_cgh 的 POJ-1821 题解（提交 #40536581）。

```cpp
# include <iostream>
# include <algorithm>
# include <cstdio>
# include <cstring>
# include <cmath>
# include <map>
# include <iomanip>
# include <queue>
# define LL long long
# define is(a) (a>='0' && a <= '9')
# define imax(a , b) ( (a) > (b) ? (a) : (b) )
# define imin(a , b) ( (a) < (b) ? (a) : (b) )
using namespace std;
const int N = 2e4 + 5 , M = 1e2 + 5 ;
int n,m,q[N],f[M][N];
struct tag
{
	int a ,b ,c;
}a[M];
bool cmp(tag a, tag b) { return a.c < b.c; }
int cl(int i ,int j)
{
	return f[i - 1][j] - a[i].b * j;
}
int main()
{
	std::ios::sync_with_stdio(0);
	cin.tie(0) , cout.tie(0);
	
	cin>>n>>m;
	for (int i = 1; i <= m; ++i) cin>>a[i].a>>a[i].b>>a[i].c;
	sort(a + 1 , a + 1 + m , cmp);
	
	for (int i = 1; i <= m; ++i)
	{
		int l = 1 , r = 0;
		for (int j = imax(0 , a[i].c - a[i].a); j <= a[i].c - 1; ++j)
		{
			while (l <= r && cl(i , q[r]) <= cl(i , j))  --r;
			q[++r] = j;
		}
		
		for (int j = 1; j <= n; ++j)
		{
			f[i][j] = imax(f[i][j - 1] , f[i - 1][j]);
			
			if (j >= a[i].c)
			{
				while (l <= r && q[l] + a[i].a < j ) ++l;
				
				if (l <= r) f[i][j] = imax(f[i][j] , cl(i , q[l]) + j * a[i].b);
			}
		}
	}
	cout<<f[m][n];
	return 0;
}
```

---

## [M(线性DP)](https://codeforces.com/contest/1296/problem/E2)

从前往后考虑问题的话,设出$DP[i]$考虑前i个元素,第i个元素所需的最少颜色数.

那么其实只需要在拿到一个新的元素的时候进行决策是否要增加一种颜色即可.

考虑第i个字符x,显然如果前面存在字符x且最少需要的颜色数为z,那么x的最少需要的颜色数也至少为z.

假如存在j(j<i)字符为y,且y>x,则x的最少需要颜色数需要大于y的最少需要颜色数(只考虑i位置和j位置).

原因:y最少颜色数为n的话,那么在y前面至少存在n-1个大于y的不同字符(即说明使用了n-1种颜色也无法与前面某个大于y的字符进行换位,说明这个大于y的字符在y的前面出现了至少n-1次,且有n-1种颜色)

根据这一性质,维护两个数组,分别为当前每个字符所需的最少颜色数,以及答案数组即可.

```cpp
#include<iostream>
#include<vector>
#include<cstring>
#include<stack>
#include<cmath>
#include<algorithm>
#include<map>
#include<queue>
#include<set>
using namespace std;
#define ll long long
#define LINF 0x3f3f3f3f3f3f3f3f
#define INF 0x3f3f3f3f
#define N 500005
#define pii pair<int,int>
const int mod=1e9+7;
int dp[N];
char s[N];
int maxdp[N];
void solve(){
	int n;cin>>n;
	cin>>s+1;
	int maxn=0;
	for(int i=1;i<=n;i++){
		for(int j=0;j<26;j++){
			if(s[i]-'a'<j){
				dp[i]=max(dp[i],maxdp[j]+1);
			}
		}
		if(!dp[i])dp[i]=1;
		maxn=max(maxn,dp[i]);
		maxdp[s[i]-'a']=max(maxdp[s[i]-'a'],dp[i]);
	}
	cout<<maxn<<"\n";
	for(int i=1;i<=n;i++){
		cout<<dp[i]<<' ';
	}
}
int main(){
	//ios::sync_with_stdio(false);
	//cin.tie(nullptr);
		solve();
	return 0;
}
```
