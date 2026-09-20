---
title: 组合计数与差分：解题笔记
pubDatetime: 2022-09-09T18:05:36+08:00
description: 围绕组合计数、分类讨论和差分的赛后推导与代码。
tags:
- algorithms
featured: false
draft: false
lang: zh-CN
---

### CF1725 C

> 给一个圆，以及圆上的n个点，以及点与点之间的距离。给m个颜色，要求给n个点涂色，并且有一个限制：颜色相同的三个颜色不能构成直角三角形

组合计数题

先考虑正反，反着做好像也挺困难的，放弃。

正着做。

首先对计数进行分类，这样不需要容斥进行讨论。根据直径进行分类。

显然直径两点的颜色相同个数/不同个数可以将整个计数问题划分完全。

如果需要是需要进行枚举的组合计数题（即范围在1e5 到1e6的题）一般就是通过枚举划分来计数的。

设枚举有i个相同颜色的直径，那么有cnt-i个不同颜色的直径,这里cnt为总直径对数。

${cnt\choose i}$为选i个直径颜色相同，${m\choose i}$为选出来的颜色，（当然这里还要重排），那么剩下的所有点颜色都不能与这i种颜相同。

如何保证剩下cnt-i个直径颜色不同？ ${m-i\choose2}2$为一个直径的方案，剩余的cnt-i个直径方案则为$(2{m-i\choose2})^{cnt-i}$。剩下的其余点颜色则可以从剩余的颜色里面随便选，则为$(m-i)^{n-2cnt}$

则总公式为
$$sum=\sum_i{cnt\choose i}i!{m\choose i}(2{m-i\choose2})^{cnt-i}(m-i)^{n-2cnt}$$

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
const int N =3e5+10;
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
int C(int x,int y){//从x中取y个
    return 1ll*fac[x]*ifac[x-y]%mod*ifac[y]%mod;
}
int a[N];
void solve(){
    int n,m;cin>>n>>m;
    ll sum=0;
    for(int i=1;i<=n;i++){
        cin>>a[i];
        sum+=a[i];
    }
    ll tsum=0;
    int cnt=0;
    int l=1,r=0;
    while(r<=n-1){
        if(tsum*2<sum){
            r++;
            tsum+=a[r];
        }
        if(r>n-1)break;
        if(tsum*2==sum){
            cnt++;
        }
        if(tsum*2>=sum){
            tsum-=a[l];
            l++;
        }
    }
    ll sum1=0;
    for(int i=0;i<=min(cnt,m);i++){
        sum1=(sum1+1ll*C(cnt,i)*fac[i]%mod*C(m,i)%mod*qsm(1ll*C(m-i,2)*2%mod,cnt-i)%mod*qsm(m-i,n-cnt*2)%mod)%mod;
    }
    cout<<sum1;
}
int main(){
    IOS;
    init(300005);
    int t = 1;
    while(t--){
        solve();
    }
    return 0;
}
```

乐，模数没改，wa13。

### CF1725 L

好题

>  给你一个数组，然后每一次操作可以
>
> 1. Ai−1:=Ai−1+Ai
> 2. Ai+1:=Ai+1+Ai
> 3. Ai:=−Ai
>
> 然后要求最少操作数使所以元素大于等于0.

解法类似与2022年一场牛客赛，由于前缀和与原数组存在一一对应关系，故如果可以确定前缀和数组便可以确定原数组，故可以直接在前缀和上进行操作。

这道题我只想了差分，但是没发现什么神奇的性质，真的没想到是用前缀和。

这道题转成前缀和后，原操作就变成了将前n-1个的前缀和中任意两个相邻元素进行交换，然后使得数组非下降序。

显然就是冒泡计数，lowbit求个逆序数即可。

像这类题与牛客那题类似，

大概就是给你一些操作，要求将原数组变成目标数组。

但可以发现原数组难以操作，或者很难发现什么性质，然后需要采用比如差分，前缀和等思想，使得其在等价于原数组的条件下用新性质进行操作，进而发现规律。

要求转换后的数组依旧能有一一对应关系，比较经典的有前缀异或，然后进行区间异或操作。

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
const int N =3e5+10;
int a[N];
ll sum[N];
int tree[N];
int n;
int lowbit(int x){return x&(-x);}; 
void add(int x,int c){
    for(;x<=n;x+=lowbit(x)){
        tree[x]+=c;
    }
}
int query(int x){
    int res=0;
    for(;x;x-=lowbit(x)){
        res+=tree[x];
    }
    return res;
}
void solve(){
    cin>>n;    
    vector<ll>b;
    for(int i=1;i<=n;i++){
        cin>>a[i];
        sum[i]=sum[i-1]+a[i];
        b.push_back(sum[i]);
    }
    sort(all(b));
    b.erase(unique(all(b)),b.end());
    ll cnt=0;
    for(int i=n;i>=1;i--){
        int p=lower_bound(all(b),sum[i])-b.begin()+1;
        add(p,1);
        cnt+=query(p-1);
    }
    if(*max_element(all(b))!=sum[n]||*min_element(all(b))<0){
        cout<<-1;
    }
    else{
        cout<<cnt;
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