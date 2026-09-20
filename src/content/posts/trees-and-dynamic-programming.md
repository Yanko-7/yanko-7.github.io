---
title: 树上倍增与动态规划：解题笔记
pubDatetime: 2022-09-11T20:05:36+08:00
description: 树的直径、倍增、单调队列优化与多项式 DP 的解题记录。
tags:
- algorithms
- dynamic-programming
featured: false
draft: false
lang: zh-CN
---

### abc267F
> 给定一颗树，给q个询问，每次询问两个参数u,k，要求输出任意一个到u点，树上距离为k的点。

任意两点间的距离公式为$dep[u]+dep[v]-dep[lca(u,v)]$,不如显然一端点为u,不如直接考虑从u开始向上或者向下。意味着要求最好找一条从u开始最长的路径到叶子节点。也就是说要对每一个询问的点都要找一条从u开始最长的路径，且要输出距离为k的点。

有一个结论，从任意点开始的最长路径，必定有最后的连续一段会在直径上，且必定会以直径一端为终点（如果有相同长度，优先选择直径的情况下）

所以对于这道题而已，只需要找到树的直径，然后正反做树上倍增即可找到长度为k的地方。



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
const int mod = 998244353;
const double PI = acos(-1.0);
const int N=200005;
const double eps=1e-7;
vector<int>vec[N];
int dep[N],dep1[N];
void dfs1(int u,int fa){
    dep[u]=dep[fa]+1;
    for(auto x:vec[u]){
        if(x==fa)continue;
        dfs1(x,u);
    }
}
int fat[N][22];
int fat1[N][22];
void dfs2(int u,int fa){
    dep[u]=dep[fa]+1;fat[u][0]=fa;
    for(int i=1;i<=20;i++){
        fat[u][i]=fat[fat[u][i-1]][i-1];
    }
    for(auto x:vec[u]){
        if(x==fa)continue;
        dfs2(x,u);
    }
}
void dfs3(int u,int fa){
    dep1[u]=dep1[fa]+1;fat1[u][0]=fa;
    for(int i=1;i<=20;i++){
        fat1[u][i]=fat1[fat1[u][i-1]][i-1];
    }
    for(auto x:vec[u]){
        if(x==fa)continue;
        dfs3(x,u);
    }
}
void solve(){
    int n;cin>>n;
    for(int i=1;i<n;i++){
        int u,v;cin>>u>>v;
        vec[u].push_back(v);
        vec[v].push_back(u);
    }
    dfs1(1,0);
    int rt1=max_element(dep+1,dep+1+n)-dep;
    memset(dep,0,sizeof dep);
    dfs2(rt1,0);
    int rt2=max_element(dep+1,dep+1+n)-dep;
    dfs3(rt2,0);
    int q;cin>>q;
    while(q--){
        int u,k;cin>>u>>k;
        if(k>=dep[u]&&k>=dep1[u]){
            cout<<-1<<endl;
        }
        else{
            if(k<=dep[u]-1){
                for(int i=20;i>=0;i--){
                    if((k>>i)&1){
                        u=fat[u][i];       
                    }
                }
            }
            else{
                for(int i=20;i>=0;i--){
                    if((k>>i)&1){
                        u=fat1[u][i];
                    }
                }
            }
            cout<<u<<endl;
        }
    }
}
int main(){
    IOS;
    int t = 1;
    while(t--){
        solve();
    }
    return 0;
}
```



### abc267 EX

> 进阶版硬币方案
>
> 给n个数，和一个定值m,每个数值域1～10,要求选出奇数个数且总和为m，求总方案数

根据题意有方程$dp[i][j][op]$为考虑前i个数情况下，总和为j,选择数在模2意义下为op的方案数。

转移方程为
$$
dp[i][j][op]=dp[i-1][j-a[i]][!op]+dp[i-1][j][op]
$$
适用多项式优化的dp转移在元素的选取顺序上是无关的，所以只需要考虑是怎么合并两个方案数的就可以。

设$f(x)$为选取奇数个的多项式,$g(x)$为选取偶数个的多项式，那么

$f'(z)=f(x)g(y)+f(y)g(x)$,

$g'(z)=g(x)g(y)+f(x)f(y)$

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
const int mod = 998244353;
const double PI = acos(-1.0);
using LL = long long;
using PII = std::pair<int, int>;
constexpr int P(998244353), G(3), L(1 << 20), L2(1e7 + 5);
inline void inc(int &x, int y) {
	x += y;
	if (x >= P) x -= P;
}
inline void dec(int &x, int y) {
	x -= y;
	if (x < 0) x += P;
}
inline int modd(LL x) { return x % P; }
int fpow(int x, int k = P - 2) {
	int r = 1;
	for (; k; k >>= 1, x = 1LL * x * x % P) {
		if (k & 1) r = 1LL * r * x % P;
	}
	return r;
}
int w[L], fac[L2], ifac[L2], _ = [] {
	w[L / 2] = 1;
	for (int i = L / 2 + 1, x = fpow(G, (P - 1) / L); i < L; i++) w[i] = 1LL * w[i - 1] * x % P;
	for (int i = L / 2 - 1; i >= 0; i--) w[i] = w[i << 1];

	fac[0] = 1;
	for (int i = 1; i < L2; i++) fac[i] = 1LL * fac[i - 1] * i % P;
	ifac[L2 - 1] = fpow(fac[L2 - 1]);
	for (int i = L2 - 1; i; i--) {
	ifac[i - 1] = 1LL * ifac[i] * i % P;
	}
	return 0;
}();
void dft(int *a, int n) {
	assert((n & n - 1) == 0);
	for (int k = n >> 1; k; k >>= 1) {
		for (int i = 0; i < n; i += k << 1) {
			for (int j = 0; j < k; j++) {
				int &x = a[i + j], y = a[i + j + k];
				a[i + j + k] = 1LL * (x - y + P) * w[k + j] % P;
				inc(x, y);
			}
		}
	}
}
void idft(int *a, int n) {
	assert((n & n - 1) == 0);
	for (int k = 1; k < n; k <<= 1) {
		for (int i = 0; i < n; i += k << 1) {
			for (int j = 0; j < k; j++) {
				int x = a[i + j], y = 1LL * a[i + j + k] * w[k + j] % P;
				a[i + j + k] = x - y < 0 ? x - y + P : x - y;
				inc(a[i + j], y);
			}
		}
	}
	for (int i = 0, inv = P - (P - 1) / n; i < n; i++)
		a[i] = 1LL * a[i] * inv % P;
	std::reverse(a + 1, a + n);
}
inline int norm(int n) { return 1 << std::__lg(n * 2 - 1); }
struct Poly : public std::vector<int> {
#define T (*this)
	using std::vector<int>::vector;
	void append(const Poly &r) {
		insert(end(), r.begin(), r.end());
	}
	int len() const { return size(); }
	Poly operator-() const {
		Poly r(T);
		for (auto &x : r) x = x ? P - x : 0;
		return r;
	}
	Poly &operator+=(const Poly &r) {
		if (r.len() > len()) resize(r.len());
		for (int i = 0; i < r.len(); i++) inc(T[i], r[i]);
		return T;
	}
	Poly &operator-=(const Poly &r) {
		if (r.len() > len()) resize(r.len());
		for (int i = 0; i < r.len(); i++) dec(T[i], r[i]);
		return T;
	}
	Poly &operator^=(const Poly &r) {
		if (r.len() < len()) resize(r.len());
		for (int i = 0; i < len(); i++) T[i] = 1LL * T[i] * r[i] % P;
		return T;
	}
	Poly &operator*=(int r) {
		for (int &x : T) x = 1LL * x * r % P;
		return T;
	}

	Poly operator+(const Poly &r) const { return Poly(T) += r; }
	Poly operator-(const Poly &r) const { return Poly(T) -= r; }
	Poly operator^(const Poly &r) const { return Poly(T) ^= r; }
	Poly operator*(int r) const { return Poly(T) *= r; }

	Poly &operator<<=(int k) { return insert(begin(), k, 0), T; }
	Poly operator<<(int r) const { return Poly(T) <<= r; }
	Poly operator>>(int r) const { return r >= len() ? Poly() : Poly(begin() + r, end()); }
	Poly &operator>>=(int r) { return T = T >> r; }

	Poly pre(int k) const { return k < len() ? Poly(begin(), begin() + k) : T; }
	friend void dft(Poly &a) { dft(a.data(), a.len()); }
	friend void idft(Poly &a) { idft(a.data(), a.len()); }
	friend Poly conv(const Poly &a, const Poly &b, int n) {
		Poly p(a), q;
		p.resize(n), dft(p);
		p ^= &a == &b ? p : (q = b, q.resize(n), dft(q), q);
		idft(p);
		return p;
	}
	friend Poly operator*(const Poly &a, const Poly &b) {
		int len = a.len() + b.len() - 1;
		if (a.len() <= 16 || b.len() <= 16) {
			Poly c(len);
			for (int i = 0; i < a.len(); i++)
				for (int j = 0; j < b.len(); j++)
					c[i + j] = (c[i + j] + 1LL * a[i] * b[j]) % P;
			return c;
		}
		return conv(a, b, norm(len)).pre(len);
	}

	Poly rev() const { return Poly(rbegin(), rend()); }
	Poly mulT(Poly b) { return T * b.rev() >> b.len() - 1; }

#undef T
};
int aa[200005];
void get(int l,int r,Poly &a,Poly &b){
    Poly tmp1,tmp2,tmp3,tmp4;
     if(l==r){
        tmp1.resize(1);
        tmp1[0]=1;
        tmp2.resize(aa[l]+1);
        tmp2[aa[l]]=1;
        a=tmp1,b=tmp2;
        return;
    }
    int mid=l+r>>1;
    get(l,mid,tmp1,tmp2);
    get(mid+1,r,tmp3,tmp4);
    a=tmp1*tmp3+tmp2*tmp4;
    b=tmp2*tmp3+tmp1*tmp4;
    return;
}

void solve(){
    Poly a1,b1;
    int n,m;cin>>n>>m;
    for(int i=1;i<=n;i++){
        cin>>aa[i];
    }
    get(1,n,a1,b1);
    b1.resize(m+1);
    cout<<b1[m];
}
int main(){
    IOS;
    int t = 1;
    while(t--){
        solve();
    }
    return 0;
}
```

### P4550 收集邮票

> 有n种邮票，每次会随机买一种，概率平均，第i次买的代价是i,求收集到所有种类的期望代价。

与概率DP模板不同，代价不是固定的而是随着购买次数增加。

转换一下题意，可以变成，每次买的邮票花费都是1,但是每买一次，就会给后面买邮票的花费+1.

那么这道题需求两个期望。

期望次数，期望代价

设$num[i]$为收集到i种邮票后，收集完所有邮票的期望购买次数。

设$cost[i]$为收集到i种邮票后，收集完所有邮票的期望代价。

那么num很简单求，
$$
cost[i]=\frac{i}{n}(1+cost[i]+num[i])+\frac{n-i}{n}(1+cost[i+1]+num[i+1]);
$$
其中+1是邮票原本的代价，而num[i]则是将后面给所有邮票增加的花费在这里一起算好。

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
double num[N];
double cost[N];
void solve(){
    int n;cin>>n;
    for(int i=n-1;i>=0;i--){
        num[i]=num[i+1]+n*1.0/(n-i);
    }
    for(int i=n-1;i>=0;i--){
        cost[i]=n*1.0/(n-i)+i*1.0/(n-i)*num[i]+cost[i+1]+num[i+1];
    }
    cout<<fixed<<setprecision(2)<<cost[0]<<endl;
}
int main(){
    IOS;
    int t = 1;
    while(t--){
        solve();
    }
    return 0;
}
```

### P4316 绿豆蛙的归宿

> 有向无环图，每次随机选一条边走，求起点到终点的路径长度期望。

板子题
$$
dp[u]=\sum_{v}\frac{1}{dep[u]}*(1+dp[v])
$$

### CF372C

虽然一眼单调队列优化DP,但是这类题写得比较少，写起来非常困难。

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
ll dp[2][150005];
array<int,3>ar[305];
void solve(){
    ll n,m,d;cin>>n>>m>>d;
    for(int i=1;i<=m;i++){
        cin>>ar[i][0]>>ar[i][1]>>ar[i][2];
    }
    sort(ar+1,ar+1+m,[&](array<int,3>a1 ,array<int,3>b1){
        return a1[2]<b1[2];
    });
    for(int i = 1 ;i <= m; i++){
        deque<int>que;
        int now=i&1;
        ll limit=1ll*d*abs(ar[i][2]-ar[i-1][2]);
        for(int j = 1;j < min(1+limit,n); j++){
            while(!que.empty()&&dp[now^1][que.back()]<=dp[now^1][j])que.pop_back();
            que.push_back(j);
        }
        for(int j=1;j<=n;j++){
            while(!que.empty()&&j-limit>que.front()){
                que.pop_front();
            }
            while(!que.empty()&&dp[now^1][que.back()]<=dp[now^1][min(j+limit,n)])que.pop_back();
            que.push_back(min(j+limit,n));
            dp[now][j]=dp[now^1][que.front()]+ar[i][1]-abs(ar[i][0]-j);
        }
    }
    ll maxn=-LINF;
    for(int i = 1;i <= n;i++){
        maxn=max(maxn,dp[m&1][i]);
    }
    cout<<maxn;
}
int main(){
    IOS;
    int t = 1;
    while(t--){
        solve();
    }
    return 0;
}
```

写起来果然很恶心。

由于这道题的区间大于i,网上的题解大多是分成前部分和后部分，正反分别做一次单调队列。

但自己的写法好像也没啥问题，先将第一次的范围处理出来，之后每次只需要处理一个值。好理解一点。

由于deque太慢，所以后面将采用数组实现双端队列。

### P3572 [POI2014]PTA-Little Bird

还是单调队列优化.

改成数组形式，好看很多

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
#define all(x) (x).begin(),(x).end()
#define IOS ios::sync_with_stdio(false); cin.tie(0)
const int mod = 998244353;
const double PI = acos(-1.0);
const int N =1e6+10;
int a[N];
int dp[N];//dp[i] = dp[k]+a[k] > a[i]
int que[N];
void solve(){
    int n;cin >> n;
    for(int i = 1; i <= n; i++){
        cin >> a[i];
    }
    int q;cin >> q;
    while(q--){
        int d;cin >> d;
        int l = 1,r = 1;
        dp[1] = 0;que[1] = 1;
        for(int i = 2; i <= n; i++){
            while(r >= l and que[l] + d < i){
                l++;
            }
            dp[i] = dp[que[l]] + (a[que[l]] <= a[i]);
            while(r >= l and (dp[i] < dp[que[r]] || (dp[i] == dp[que[r]] and a[i] >= a[que[r]]))){
                r--;
            }
            que[++r] = i;
        }
        cout << dp[n] << endl;
    }
}

int main(){
    IOS;
    int t = 1;
    //cin >> t;
    while(t--){
        solve();
    }
    return 0;
}
```

### P1973 [NOI2011] NOI 嘉年华

一个小问题，如何用dp维护两集合差值最小。