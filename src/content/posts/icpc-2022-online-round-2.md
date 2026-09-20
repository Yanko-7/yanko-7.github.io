---
title: ICPC 2022 网络赛补题：排列计数与树形 DP
pubDatetime: 2022-09-29T19:48:36+08:00
description: 2022 年 ICPC 第二场网络赛的赛后分析、错误复盘与实现。
tags:
- algorithms
- icpc
featured: false
draft: false
lang: zh-CN
---

## **G Good Permutation**

> 定义一个好区间为区间的最大值-最小值等于区间长度-1.
>
> 给定排列长度n,和m个区间。
>
> 要求m个区间都为好区间的前提下，求这样的排列有多少个。
>
> 区间之间不相交，可以包含。包含的区间端点可以相交。

假如可以更早开到这道题该多好，很快就想到了解法，但是最后一小时由于双开A和G,导致两道题都没来得及调出来。

实际上不需要组合数。单纯的树形dp。用单调栈建立好层次树之后，考虑将子区间的长度变成绑定成1即可。

最后一分钟才写完过样例，最后还是没过。赛后发现竟然是长度为1的区间没有特判。哭死～

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e6 + 10;
#define ll long long
#define fi first
#define se second
#define pii pair<int,int>
ll ifac[N],fac[N];
const int mod=1e9+7;
int qsm(int a,int b){
    int res=1;
    while(b){
        if(b&1){
            res=1ll*res*a%mod;
        }
        a=1ll*a*a%mod;
        b>>=1;
    }
    return res;
}
void init(int n){
    fac[0]=ifac[0]=1;
    for(int i=1;i<=n;i++){
        fac[i]=fac[i-1]*i%mod;
    }
    ifac[n]=qsm(fac[n],mod-2)%mod;
    for(int i=n-1;i>=1;i--){
        ifac[i]=ifac[i+1]*(i+1)%mod;
    }
}
int C(ll x,ll y){
    return fac[x]*ifac[y]%mod*ifac[x-y]%mod;
}
pii a[N];
vector<int>vec[N];
int len[N];
struct node{
    int pos;
    int id;
    int op;
}b[2*N];
ll ans[N];
void dfs(int u){
    int t=len[u];ans[u]=1;
    for(auto x:vec[u]){
        dfs(x);
        ans[u]*=ans[x];ans[u]%=mod;
        t-=len[x]-1;
    }
    ans[u]*=fac[t];ans[u]%=mod;
    
    //cout<<u<<' '<<len[u]<<' '<<ans[u]<<endl;
    return;
}
void solve(){
    int n,m;cin>>n>>m;
    for(int i=1;i<=m;i++){
        cin>>a[i].fi>>a[i].se;
    }
    m++;
    a[m].fi=1,a[m].se=n;
    sort(a+1,a+1+m,[&](pii t1,pii t2){
        if(t1.fi==t2.fi)return t1.se>t2.se;
        return t1.fi<t2.fi;
    });
    int idx=0;
    for(int i=1;i<=m;i++){
        len[i]=a[i].se-a[i].fi+1;
        b[++idx].pos=a[i].fi;b[idx].id=i;
        b[idx].op=1;
        b[++idx].pos=a[i].se;b[idx].id=i;
        b[idx].op=2;
    }
    sort(b+1,b+1+idx,[&](node t1,node t2){
        if(t1.pos==t2.pos){
            if(t1.op!=t2.op){
                return t1.op<t2.op;
            }
            else{
                if(t1.op==1){
                    return t1.id<t2.id;
                }
                else{
                    return t1.id>t2.id;
                }
            }
        }
        return t1.pos<t2.pos;
    });
    stack<int>sta;
    int last=0;
    for(int i=1;i<=idx;i++){
        if(b[i].op==1){
            if(sta.empty()==1){
                sta.push(b[i].id);
            }
            else{
                vec[sta.top()].push_back(b[i].id);
                sta.push(b[i].id);
            }
        }
        else{
            sta.pop();
        }
    }
    dfs(1);
    cout<<ans[1];
}
int main() {
    init(1000005);
    ios::sync_with_stdio(false), cin.tie(nullptr);
    solve();
    return 0;
}
```

## **L Quadruple**

> 给定一个字符串，给q个区间，以该区间为子字符串中，构成的“ICPC”子序列有多个。

题目都没看，补题的时候一眼4颗主席树。依稀记得群友好像说过线段树好像会寄。所以肯定存在O（n）算法。

考虑容斥。

设$dp[i]$为i下标前的icpc字符串个数。

那么$dp[r]-dp[l-1]$那么就只剩下完全包含在[l,r]里的icpc字符串和横跨l的icpc字符串。

考虑如何消去横跨l的字符串。

显然将横跨的字符串分成两个区间考虑，枚举两个区间的类型，即考虑[1,l]中i/ic/icp的序列个数

和[l+1,r]中cpc/pc/c的个数。

1. i
2. c
3. ic
4. icp
5. cp
6. cpc
7. p

和原问题非常相似，就是一个子问题。故递归解决。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e6 + 10;
#define ll long long
#define fi first
#define se second
#define pii pair<int,int>
ll dp[N][10];
unordered_map<string,int>mp;
const int mod=998244353;
int l1[5][105],r1[5][105];
int siz[105];
int get(int l,int r,string ned){
    if(ned.size()==1){
        return mp[ned];
    }
    int id=mp[ned];
    int len=ned.size();
    siz[id]=len;
    for(int i=1;i<len;i++){
        l1[i][id]=get(1,l-1,ned.substr(0,i));
        r1[i][id]=get(l,r,ned.substr(0+i,len-i));
      }
    return id;
}
int get1(int l,int r,int id){
    if(l==1){
        return dp[r][id];
    }
    ll ans=(dp[r][id]-dp[l-1][id]+mod)%mod;
    int len=siz[id];
    for(int i=1;i<len;i++){
        ans=(ans+mod-(1ll*get1(1,l-1,l1[i][id])*get1(l,r,r1[i][id]))%mod)%mod;
    }
    return ans;
}
char s1[2000005];
int u[2000005],v[2000005];
void solve(){
    mp["i"]=1;
    mp["c"]=2;
    mp["ic"]=3;
    mp["icp"]=4;
    mp["cp"]=5;
    mp["cpc"]=6;
    mp["p"]=7;
    mp["pc"]=8;
    mp["icpc"]=9;
    int n,q;cin>>n>>q;
    cin>>s1+1;
    for(int i=1;i<=n;i++){
        if(s1[i]=='I'){
            dp[i][1]++;
        }
        else if(s1[i]=='C'){
            dp[i][2]++;dp[i][3]+=dp[i-1][1];
            dp[i][6]+=dp[i-1][5];
            dp[i][8]+=dp[i-1][7];
            dp[i][9]+=dp[i-1][4];
        }
        else if(s1[i]=='P'){
            dp[i][7]++;dp[i][4]+=dp[i-1][3];
            dp[i][5]+=dp[i-1][2];
        }
        for(int j=1;j<=9;j++)dp[i][j]=(dp[i][j]+dp[i-1][j])%mod;
    }
    int x,a,b,p;cin>>x>>a>>b>>p;
    ll ans=0;
    for(int i=1;i<=q;i++){
        x=(1ll*a*x+b)%p;u[i]=x%n;
    }
    for(int i=1;i<=q;i++){
        x=(1ll*a*x+b)%p;v[i]=x%n;
    }
    int now=get(1,4,"icpc");
    for(int i=1;i<=q;i++){
        int l=min(u[i]+1,v[i]+1),r=max(u[i]+1,v[i]+1);
        if(r-l+1<4)continue;
        int tmp=get1(min(u[i]+1,v[i]+1),max(u[i]+1,v[i]+1),now);
        //cout<<l<<' '<<r<<' '<<tmp<<endl;
        ans=(ans+tmp)%mod;
    }
    cout<<ans;
}
int main() {
    ios::sync_with_stdio(false), cin.tie(nullptr);
    solve();
    return 0;
}

```

代码写得可以说是非常丑了。

**K Black and White Painting**

这题做不出来，是因为为不知道perimeter这个单词是指周长。

以为是面积，所以觉得是个求面积并的难题。结果是个周长。那么每个方块维护8个方向上的长度即可。

难度在于单个考虑每个单元，难点在于求两个交叉弧长（$1/3\pi$）。
