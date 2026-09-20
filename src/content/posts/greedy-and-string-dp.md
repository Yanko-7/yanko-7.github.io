---
title: 贪心与字符串 DP：解题笔记
pubDatetime: 2022-09-14T11:05:36+08:00
description: 从贪心状态分析到 KMP 与动态规划的结合。
tags:
- algorithms
- dynamic-programming
featured: false
draft: false
lang: zh-CN
---

## CF353D

这是道很简单的题目，但是我就是不会...😣

最初的想法是倒着DP,但是无法处理新加入M对旧状态的转移。

结果是正着贪心考虑，某位F以及其与上一位F的关系，如果如果两位置之间没有M,那么在时间上相对位置上都是同时在罚坐的，如果有M，那么后一位可以通过1s的时间追上，如果追上又变成罚坐状态的话，那么时间上与前一位是相同的，故只需要考虑最后一次同时罚坐到最终位置的时间这一段就好。设上一个F答案为ans,这一位$ans=max(ans+1,cnt)$;cnt为前面M的个数。

## CF494B

像这样两个1e5长度的字符串，但是DP方程却是1D1D的确实该好好练一练，否则根本做不出来（说的就是9.11网络赛 「DP字符串适配问题」）

不过这道题偏简单，通过KMP预处理，把匹配问题转变成点选取问题，然后就可以A了。

$dp[i]=\sum_{j=1}^{last-1} dp1[j]$ $dp1[i]=dp[i]+dp1[i-1]$

需要处理两个DP式子，计数按最后一段结尾处位置分类。

```cpp
#include <bits/stdc++.h>
using namespace std;
#define se second
#define fi first
//#define endl "\n"
#define INF 0x3f3f3f3f
#define ll long long
#define LINF 1ll << 60
#define pii pair<int, int>
#define all(x) (x).begin(), (x).end()
#define IOS ios::sync_with_stdio(false);cin.tie(0)
const int mod = 1000000007;
const double PI = acos(-1.0);
const int N = 3e5 + 10;
vector<int>getnext(string s){
    int len = s.length();
    vector<int>nex(len);
    for(int i = 1;i < len;i++){
        int p = nex[i - 1];
        while(p&&s[p] != s[i]){
            p = nex[p-1];
        }
        nex[i] = p + (s[p] == s[i]? 1 : 0);
    }
    return nex;
}
int book[N];
ll dp[N];
ll dp1[N];
ll sum[N];
void solve(){
    string s1;cin>>s1;
    string s2;cin>>s2;
    int len1=s1.length();
    int len2=s2.length();
    vector<int>nex=getnext(s2);
    int p=0;
    for(int i=0;i<len1;i++){
        while(p&&s1[i]!=s2[p]){
            p=nex[p-1];
        }
        if(s1[i]==s2[p])p++;
        if(p==len2){
            book[i+1]=1;
            p=nex[p-1];
        }
    }
    int last=0;
    dp1[0]=1;
    for(int i=1;i<=len1;i++){
        if(book[i])last=i;
        if(last-1>=0){
            dp[i]=sum[last-len2]+1;
            dp[i]%=mod;
        }
        dp1[i]=(dp[i]+dp1[i-1])%mod;
        sum[i]=(sum[i-1]+dp1[i])%mod;
    }
    cout<<(dp1[len1]-1+mod)%mod<<endl;
}
int main()
{
    int t = 1;
     //cin >> t;
     while(t--){
        solve();
     }
    return 0;
}
```
