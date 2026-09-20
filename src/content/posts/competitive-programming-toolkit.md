---
title: 竞赛算法模板集
pubDatetime: 2022-04-08T18:05:36+08:00
description: 竞赛时积累的 C++ 算法实现，涵盖网络流、图论、数论和数据结构。
tags:
- algorithms
- cpp
featured: false
draft: false
lang: zh-CN
---

### Dinic网络流最大流

```cpp
const int N=400005;
#define INF 0x3f3f3f3f
struct Edge{
    int to,w,nex;
}e[N];
int idx=1,sta,endd;
int head[N],dis[N];
void add(int u,int v,int w){
    idx++;e[idx]={v,w,head[u]};
    head[u]=idx;
    idx++;e[idx]={u,0,head[v]};
    head[v]=idx;
    return;
}
bool bfs(){//深度标记
    memset(dis,-1,sizeof dis);
    queue<int>que;
    que.push(sta);dis[sta]=1;//源点开始
    while(!que.empty()){
        int u=que.front();que.pop();
        for(int i=head[u];i;i=e[i].nex){
            int v=e[i].to;
            if(e[i].w&&dis[v]==-1){
                dis[v]=dis[u]+1;
                que.push(v);
                if(v==endd)return true;
            }
        }
    }
    return false;
}
int dfs(int u,int flow){
    if(u==endd)return flow;//如果达到汇点
    int res=flow;//暂时记录到该节点的流是多少
    for(int i=head[u];i;i=e[i].nex){
        int v=e[i].to;
        if(dis[v]==dis[u]+1&&e[i].w){//如果可以往该边流
            int temp=dfs(v,min(res,e[i].w));
            if(!temp)dis[v]=-1;//如果通过这条边可以流到汇点
            res-=temp;//减去最大流量
            e[i].w-=temp;
            e[i^1].w+=temp;//反边增流
            if(!res)break;//如果该节点还有流可以流出，那么可以继续找增广路
        }
    }
    return flow-res;//返回该节点有flow流量时，流出的最大流是多少
}
int dinic(){
    int ans=0,temp=0;
    while(bfs()){
        while(temp=dfs(sta,INF))ans+=temp;
    }
    return ans;
}
```

### 组合数

```cpp
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
int C(int x,int y){//从x中取y个
    return 1ll*fac[x]*ifac[x-y]%mod*ifac[y]%mod;
}
```

### KMP（string版本，从0开始）

```cpp
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
```

#### 失配树

​	即每个下标i以$next[i]$为父节点建立的一颗树。 向上跳就是跳最长最长前后缀的节点



### 序列自动机

#### 	字符串序列自动机

```cpp
int nex[N][27];
char s1[N];
int book[27];
void build(){
    int n=strlen(s1+1);
    for(int i=n;i>=1;i--){
        for(int j=0;j<26;j++){
            nex[i][j]=book[j];
        }
        book[s1[i]-'a']=i;
    }
}	
```

序列自动机实际上就是字符集较小的一张DAG有向无环图

**用法**：

- **判断是否是原字符串的子序列**

  构造出了next后，从根跑一遍就好了。

- **求子序列个数**

  从根开始跑，由于是DAG图，所以记忆化搜索dp即可。

- **求两串的公共子序列个数**

  只能n方跑，跟上面是一样的，两个串分别建自动机，开二维记忆化即可。

- **求字符串的回文子序列个数**

  原串和反串都建一遍自动机，相当于两个同时从左端点和右端点开始跑，同样得开二维记忆化，n方。

- **求一个A,B的最长公共子序列S，使得C是S的子序列**

  同样是记忆化搜索,DFS(x,y,z),表示匹配到C的z位

#### 	真序列自动机

​	当字符集很大时候，可以是数字，到1e5。这个时候由于i与i+1之间其实只有一个数的差距，符合主席树的性质，所以只需要主席树倒着一个一个插数即可。 或许可以和线段树合并结合出题？

### 三分

```cpp
//浮点数
while(fabs(r-l)>=eps){
    double lmid=l+(r-l)/3;
    double rmid=r-(r-l)/3;
    if(check(lmid)<=check(rmid)){
        l=lmid;
    }
    else{
        r=rmid;
    }
}
//整数
/*
在用三分板子找极大/小值的时候，左右端点(l,r)的取值不能为极大/小值，否则板子返回的不是正确答案，为避免此情况，可令左右端点各往外扩充一步(l=1 -> l=0,r=n -> r=n+1,check(0)和check(n+1)返回inf或-inf)
*/

// 求凹函数的极小值
int tri_search(int l,int r){
	int f1,f2;
	while(r - l > 5) {
	    int lp = l + (r - l) / 3;
	    int rp = r - (r - l) / 3;
	    f1 = check(lp),f2 = check(rp);
	    if(f1 <= f2) 
			r = rp - 1;
	    else 
			l = lp + 1;
	}
	int res = check(l);
    for(int i = l + 1;i <= r; ++i){
        res = min(res,check(i));
    }
	return res;
```



### 欧拉筛

```cpp
int idx;
int prime[100005];
bool vis[1000005];
void pre_euler(int n){
    for(int i=2;i<=n;i++){
        if(!vis[i]){
            prime[idx++]=i;
        }
        for(int j=0;j<idx&&i*prime[j]<=n;j++){
            vis[prime[j]*i]=1;
            if(i%prime[j]==0)break;//一个合数或者质数只被最小质因数筛
        }
    }
}
```



### 树上倍增&&LCA

```cpp
int dep[N],fat[N][21];
void dfs(int u,int fa){
	dep[u]=dep[fa]+1;fat[u][0]=fa;
	for(int i=1;i<=20;i++)fat[u][i]=fat[fat[u][i-1]][i-1];
	for(auto x:vec[u]){
		if(x==fa)continue;
		dfs(x,u);
	}
}
int lca(int x,int y){
	if(dep[x]<dep[y])swap(x,y);
	for(int d=dep[x]-dep[y],i=0;d;d>>=1,i++){
		if(d&1){
			x=fat[x][i];
		}
	}
	for(int i=20;i>=0;i--){
		if(fat[x][i]!=fat[y][i]){
			x=fat[x][i];y=fat[y][i];
		}
	}
	return x==y ? x:fat[x][0];
}
```



### tarjan缩点

```cpp
vector<int>vec[N];
int dpn[N],low[N],instack[N],idx,cnt;
stack<int>sta;
int belong[N];
void tarjan(int u){
    low[u]=dpn[u]=++idx;//进入该点，记录dfs序
    instack[u]=1;sta.push(u);//进入栈中
    for(auto x:vec[u]){
        if(!dpn[x]){
            tarjan(x);
            low[u]=min(low[u],low[x]);//看子节点是否已经能够缩点
        }
        else if(instack[x]){
            low[u]=min(low[u],dpn[x]);//如果已经在栈中，判断一下是否能更藻回溯
        }
    }
    if(low[u]==dpn[u]){//到达环的节点时将能够缩成一点的点全都变成一个点
        int temp;cnt++;
        do{
            temp=sta.top();sta.pop();
            instack[temp]=0;belong[temp]=cnt;//说明cnt代表这些temp节点，这里可进行加边加值等操作
        }while(temp!=u);
    }
    return;
}
```

### AC自动机

```cpp
int nex[N][27];int cnt[N];
int fail[N];int idx;
void insert(string s1){
    int u=0;
    for(auto x:s1){
        if(!nex[u][x-'a'])nex[u][x-'a']=++idx;
        u=nex[u][x-'a'];
    }
    cnt[u]=1;
}
void build_fail(){
    queue<int>que;
    for(int i=0;i<26;i++){
        if(nex[0][i]){
            que.push(nex[0][i]);
        }
    }
    while(!que.empty()){
        int u=que.front();que.pop();
        for(int i=0;i<26;i++){
            if(nex[u][i]){
                fail[nex[u][i]]=nex[fail[u]][i];
                //cnt[nex[u][i]]|=cnt[nex[fail[u]][i]];//fail链上存在一个点被感染则这个点被感染
                que.push(nex[u][i]);
            }
            else{
                nex[u][i]=nex[fail[u]][i];
            }
        }
    }
}
int querry(string s1,int k){
    int u=0;
    int res=0;
    for(int i=0;i<s1.size();i++){
        u=nex[u][s1[i]-'a'];//定位后缀
        for(int j=u;j;j=fail[j]){//对每个字符进行转移，直到遇到已经访问过的或者到根节点
            if(cnt[j]){//一直跳fail，如果遇到有值说明有字符串以此为结尾
            num[cnt[j]]++;//该模式串val++
            }
        }
    }
    for(int i=1;i<=k;i++){
        res=max(res,num[i]);//找匹配最多的模式串
    }
    return res;
}
```

### 线段树乘加

```cpp
struct node{
    int ls,rs;
}nd[N];
int tree[N];
int lzj[N];
int lzc[N];
int a[N];
void pushup(int x){
    tree[x]=tree[x*2]+tree[x*2+1];
    return;
}
void build(int root,int st,int ed){
    lzc[root]=1;
    if(st==ed){
        tree[root]=a[st];
        return;
    }
    int mid=(st+ed)/2;
    build(root*2,st,mid);
    build(root*2+1,mid+1,ed);
    pushup(root);
    return;
}
void pushdown(int root,int st,int ed){
    int mid=(st+ed)/2;
    tree[root*2]=tree[root*2]*lzc[root]+lzj[root]*(mid-st+1);
    tree[root*2+1]=tree[root*2+1]*lzc[root]+lzj[root]*(ed-mid);
    lzj[root*2]*=lzc[root];
    lzj[root*2]+=lzj[root];
    lzj[root*2+1]*=lzc[root];
    lzj[root*2+1]+=lzj[root];
    lzc[root*2]*=lzc[root];
    lzc[root*2+1]*=lzc[root];
    lzc[root]=1;
    lzj[root]=0;
    return;
}
void change(int root,int st,int ed,int l,int r,int k,int op){
    if(st>=l&&ed<=r){
        if(op==1){
            lzj[root]+=k;
            tree[root]+=k*(ed-st+1);
        }
        else{
            lzj[root]*=k;
            lzc[root]*=k;
            tree[root]*=k;
        }
        return;
    }
    int mid=(st+ed)/2;
    pushdown(root,st,ed);
    if(mid>=l){
        change(root*2,st,mid,l,r,k,op);
    }
    if(mid<r){
        change(root*2+1,mid+1,ed,l,r,k,op);
    }
    pushup(root);
    return;
}
int querry(int root,int st,int ed,int l,int r){
    if(l<=st&&r>=ed)return tree[root];
    int ans=0;int mid=(st+ed)/2;
    pushdown(root,st,ed);
    if(l<=mid){
        ans+=querry(root*2,st,mid,l,r);
    }
    if(mid<r){
        ans+=querry(root*2+1,mid+1,ed,l,r);
    }
    return ans;
}
```

### 主席树 dfs序树上区间操作（统计区间内的值有多少个）

```cpp
#include <bits/stdc++.h>
using namespace std;
#define ll long long
#define INF 0x3f3f3f3f
#define ting getchar();getchar()
#define N 1000005
struct node{
    int val;int ls;int rs;
}nd[N*20];
int idx;
int xulie[20*N];
vector<int>vec[20*N];
int insert(int root,int st,int ed,int k){//建树相当于一个一个插入
    int now=++idx;nd[now]=nd[root];nd[now].val++;//动态开点
    int mid=(st+ed)/2;
    if(st==ed){
        return now;
    }
    if(k<=mid){
        nd[now].ls=insert(nd[now].ls,st,mid,k);
    }
    else{
        nd[now].rs=insert(nd[now].rs,mid+1,ed,k);
    }
    return now;
}
int querry(int l,int r,int st,int ed,int l1,int r1){//由于主席树性质，两个树相减即是区间相减
    int mid=(st+ed)/2;
    if(st>=l1&&ed<=r1)return nd[r].val-nd[l].val;
    if(ed<l1||st>r1)return 0;
    return 		querry(nd[l].ls,nd[r].ls,st,mid,l1,r1)+querry(nd[l].rs,nd[r].rs,mid+1,ed,l1,r1);
}
int in[20*N];
int out[20*N];
int root[20*N];
int idx1;
void dfs(int u,int fu){
    xulie[++idx1]=u;
    in[u]=idx1;
    for(auto x:vec[u]){
        if(x!=fu){
            dfs(x,u);
        }
    }
    out[u]=idx1;
    return;
}
int fat[N][31];
int val[20*N];
void dfs1(int u,int fu){
    fat[u][0]=fu;
    for(int i=1;i<=20;i++){
        fat[u][i]=fat[fat[u][i-1]][i-1];
    }
    for(auto v:vec[u]){
        if(v!=fu){
            dfs1(v,u);
        }
    }
    return;
}
int main(){
    ios::sync_with_stdio(false);
    int n;cin>>n;
    for(int i=1;i<n;i++){
        int u,v;cin>>u>>v;
        vec[u].push_back(v);
        vec[v].push_back(u);
    }
    int maxn=-1;
    for(int i=1;i<=n;i++){
        cin>>val[i];
    }
    dfs(1,-1);
    for(int i=1;i<=idx1;i++){
        root[i]=insert(root[i-1],1,1e9,val[xulie[i]]);
    }
    dfs1(1,0);
    int q;cin>>q;
    val[0]=1e9+7;
    while(q--){
        int x,l,r;cin>>x>>l>>r;
        for(int i=20;i>=0;i--){
            if(val[fat[x][i]]<=r)x=fat[x][i];
        }
        if(val[x]>r||val[x]<l){
            cout<<0<<endl;
            continue;
        }
        int ans=querry(root[in[x]-1],root[out[x]],1,1e9,l,r);
        cout<<ans<<endl;
    }
    return 0;
}
```

**关于二分图性质**

**最大独立集 =n-2*最大匹配+最大匹配=n-最大匹配**

**最小边覆盖=n-2*最大匹配（匹配外的独立集所需要的边数）+最大匹配（最大匹配所需要的边数）=n-最大匹配**

**最小点覆盖=最大匹配**

**最小路径覆盖数=原图节点数-二分图最大匹配（即为没有匹配的点数） 需拆点成二分图**



### ST表（区间最大值）

```cpp
int a[N];
int dp[N][21];
void init(int n){
    for(int i=1;i<=n;i++)dp[i][0]=a[i];
    for(int j=1;(1<<j)<=n;j++){
        for(int i=1;i+(1<<j)-1<=n;i++){
            dp[i][j]=max(dp[i][j-1],dp[i+(1<<j-1)][j-1]);
        }
    }
}
int rmq(int l,int r){
    int k=31-__builtin_clz(r-l+1);
    return max(dp[l][k],dp[r-(1<<k)+1][k]);
}
```



### 矩阵快速幂

```cpp
#define ll long long
const int mod=1e9+7;
int maxm;
struct Mat{
    long long c[105][105];
}a1,a2;
Mat operator *(Mat &a,Mat &b){
    Mat temp;
    for(int i=1;i<=maxm;i++){
        for(int j=1;j<=maxm;j++){
            temp.c[i][j]=0;
            for(int k=1;k<=maxm;k++){
                temp.c[i][j]+=a.c[i][k]*b.c[k][j];
                temp.c[i][j]%=mod;
            }
        }
    }
    return temp;
}
Mat qim(ll x,Mat &base){//记得返回的是一个矩阵，要存起来的
    Mat temp;
    memset(temp.c,0,sizeof temp.c);
    for(int i=1;i<=maxm;i++){
        temp.c[i][i]=1;
    }
    while(x){
        if(x&1){
            temp=temp*base;
        }
        base=base*base;
        x/=2;
    }
    return temp;
}
```



### 最小费用流

```cpp
struct MAXflow{
	struct Edge{
	    int to,w,cost,nex;
	}e[N];
	int idx=1;
	int sta,endd;
	int maxflow,mincost;
	int head[N];int dis[N];bool vis[N];int pre[N];int flow[N];
	void add(int u,int v,int w,int cost){
	    idx++;e[idx]={v,w,cost,head[u]};
	    head[u]=idx;
	    idx++;e[idx]={u,0,-cost,head[v]};
	    head[v]=idx;
	    return;
	}
	bool spfa(int op){//op==1为最小费用最大流，==0为最大费用最小流
		if(op==1){
			memset(dis,0x3f,sizeof dis);//一遍spfa n遍松弛还能判断负环
		}
		else{
			memset(dis,-0x3f,sizeof dis);
		}
	    queue<int>que;que.push(sta);
	    dis[sta]=0;flow[sta]=INF;vis[sta]=1;//初始化起点，flow记录流量
	    while(!que.empty()){
	        int u=que.front();que.pop();vis[u]=0;//表示已经用过了，以后遇到还能再更新
	        for(int i=head[u];i;i=e[i].nex){
	            int v=e[i].to;
	            if(e[i].w&&((op==1&&dis[v]>dis[u]+e[i].cost)||(op==0&&dis[v]<dis[u]+e[i].cost))){//如果有流量，并且更短路，有增广路
	                dis[v]=dis[u]+e[i].cost;
	                pre[v]=i;
	                flow[v]=min(e[i].w,flow[u]);//记录流量
	                if(!vis[v]){//如果已经在队列了就没必要加入
	                    que.push(v);vis[v]=1;
	                }
	            }
	        }
	    }
	    return op? dis[endd]!=INF:dis[endd]!=-1044266559;
	}
	void mcmf(){
	    maxflow+=flow[endd];//总流量加上一次增广的流量
	    mincost+=flow[endd]*dis[endd];//最小费用
	    int u=endd;
	    while(u!=sta){//没有采用在dfs时候去减流量，而是用pre直接while往上手动去减
	        e[pre[u]].w-=flow[endd];
	        e[pre[u]^1].w+=flow[endd];
	        u=e[pre[u]^1].to;
	    }
	}
}M1;
while(M1.spfa()){
    mcmf();
}
```

### 高斯消元

1. #### 行列式计算

   ```cpp
   const double EPS = 1E-9;
   int n;
   vector<vector<double> > a(n, vector<double>(n));
   
   double det = 1;
   for (int i = 0; i < n; ++i) {
     int k = i;
     for (int j = i + 1; j < n; ++j)
       if (abs(a[j][i]) > abs(a[k][i])) k = j;
     if (abs(a[k][i]) < EPS) {
       det = 0;
       break;
     }
     swap(a[i], a[k]);
     if (i != k) det = -det;
     det *= a[i][i];
     for (int j = i + 1; j < n; ++j) a[i][j] /= a[i][i];
     for (int j = 0; j < n; ++j)
       if (j != i && abs(a[j][i]) > EPS)
         for (int k = i + 1; k < n; ++k) a[j][k] -= a[i][k] * a[j][i];
   }
   
   cout << det;
   ```

2. ### 线性方程组解

   ```cpp
   int gauss()
   {
       int c, r;// c 代表 列 col ， r 代表 行 row
       for (c = 0, r = 0; c < n; c ++ )
       {
           int t = r;// 先找到当前这一列，绝对值最大的一个数字所在的行号
           for (int i = r; i < n; i ++ )
               if (fabs(a[i][c]) > fabs(a[t][c]))
                   t = i;
   
           if (fabs(a[t][c]) < eps) continue;// 如果当前这一列的最大数都是 0 ，那么所有数都是 0，就没必要去算了，因为它的约束方程，可能在上面几行
   
           for (int i = c; i < n + 1; i ++ ) swap(a[t][i], a[r][i]);//// 把当前这一行，换到最上面（不是第一行，是第 r 行）去
           for (int i = n; i >= c; i -- ) a[r][i] /= a[r][c];// 把当前这一行的第一个数，变成 1， 方程两边同时除以 第一个数，必须要到着算，不然第一个数直接变1，系数就被篡改，后面的数字没法算
           for (int i = r + 1; i < n; i ++ )// 把当前列下面的所有数，全部消成 0
               if (fabs(a[i][c]) > eps)// 如果非0 再操作，已经是 0就没必要操作了
                   for (int j = n; j >= c; j -- )// 从后往前，当前行的每个数字，都减去对应列 * 行首非0的数字，这样就能保证第一个数字是 a[i][0] -= 1*a[i][0];
                       a[i][j] -= a[r][j] * a[i][c];
   
           r ++ ;// 这一行的工作做完，换下一行
       }
   
       if (r < n)// 说明剩下方程的个数是小于 n 的，说明不是唯一解，判断是无解还是无穷多解
       {// 因为已经是阶梯型，所以 r ~ n-1 的值应该都为 0
           for (int i = r; i < n; i ++ )// 
               if (fabs(a[i][n]) > eps)// a[i][n] 代表 b_i ,即 左边=0，右边=b_i,0 != b_i, 所以无解。
                   return 2;
           return 1;// 否则， 0 = 0，就是r ~ n-1的方程都是多余方程
       }
       // 唯一解 ↓，从下往上回代，得到方程的解
       for (int i = n - 1; i >= 0; i -- )
           for (int j = i + 1; j < n; j ++ )
               a[i][n] -= a[j][n] * a[i][j];//因为只要得到解，所以只用对 b_i 进行操作，中间的值，可以不用操作，因为不用输出
   
       return 0;
   }
   ```

### 数位DP

先放一道题

> 科协里最近很流行数字游戏。
>
> 某人命名了一种不降数，这种数字必须满足从左到右各位数字呈非下降关系，如 123123，446446。
>
> 现在大家决定玩一个游戏，指定一个整数闭区间 [a,b][a,b]，问这个区间内有多少个不降数。

AC代码：

```cpp
int a[105];int idx;
int dp[32][10];//从低位往高位考虑，到第i位时符合题意的个数
int k;
int b;
int dfs(int pos,int last,bool limit){
    if(!pos)return 1;
    if(!limit&&dp[pos][last]!=-1)return dp[pos][last];
    int up=limit? a[pos]:9;
    int res=0;
    for(int i=0;i<=up;i++){
        if(i<last)continue;
        res+=dfs(pos-1,i,limit&&i==a[pos]);
    }
    if(!limit)dp[pos][last]=res;
    return res;
}
int solve(int x){
    idx=0;
    memset(dp,-1,sizeof dp);
    while(x){
        a[++idx]=x%10;x/=10;
    }
    return dfs(idx,0,1);
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int k,b;
    while(cin>>k>>b){
        cout<<solve(b)-solve(k-1)<<endl;
    }

    return 0;
}
```

用记忆化搜索很容易实现，但是对状态的定义非常模糊。

故采用统一思想，$dp[pos][st]$一般表示为从低位到高位考虑，没有限制的符合题目意思的数字的个数。这样子的话$dp[pos-1][st]$实际上可以独立出来符合题意，只是位数还没有达到。仔细思考，最底层的状态，也就是位数为1的时候其实仅仅一个数就可以符合题意了，只是要判断有没有上界，而dp里存的刚好又是没有限制的个数，所以完全符合。而增加位数实际上只是从$dp[pos-1]$转移到$dp[pos]$也就是说，过程是自底向上的，pos状态的结果由底层状态决定，而与pos+1无关。而同一个pos但多个不一样的st可能指向同一个$[pos-1][st]$，通过记忆化就可以实现剪枝。

另一种

> 由于科协里最近真的很流行数字游戏。
>
> 某人又命名了一种取模数，这种数字必须满足各位数字之和 mod N 为 0。
>
> 现在大家又要玩游戏了，指定一个整数闭区间 [a.b][a.b]，问这个区间内有多少个取模数。

如果还按照上一题的思路来思考状态方程会出现一些问题，比如余数只和前面存过哪些数有关，底层状态不清楚等。而在这里更像是搜索题，只是记录了搜索状态，相同的搜索状态就不用搜了一样。遍历过程近似成DAG。 

[P2602 [ZJOI2010\]数字计数 - 洛谷 | 计算机科学教育新生态 (luogu.com.cn)](https://www.luogu.com.cn/problem/P2602)

> 给定两个正整数 *a* 和 *b*，求在 [a,b][*a*,*b*] 中的所有整数中，每个数码(digit)各出现了多少次。

这道题跟上面几道题都不一样，这个是统计的每个数的数码，也就是说底层返回值不再是1，也就是说计数的不是数的个数，而是每个数中中某些数要多次计数。

还是一样的道理，不要用dp的思想去做，需要用搜索的思想去做，一开始从暴力搜索开始，每层9个决策，到最底层返回结果。

AC代码:

```cpp
#define pii pair<int,int>
const double PI=acos(-1);
const int mod=998244353;
int a[105];int idx;
//从低位往高位考虑，到第i位时符合题意的个数
ll dp[15][15];
ll dfs(int pos,bool limit,int sum,int nd,bool lean){
    if(pos==0)return sum;
    if(!lean&&!limit&&dp[pos][sum]!=-1)return dp[pos][sum];
    int up=(limit? a[pos]:9);
    ll res=0;
    for(int i=0;i<=up;i++){
        if(!nd){
            res+=dfs(pos-1,limit&&i==a[pos],sum+(!lean&&i==nd),nd,lean&&i==0);
        }
        else{
            res+=dfs(pos-1,limit&&i==a[pos],sum+(i==nd),nd,lean&&i==0);
        }
    }
    if(!limit&&!lean)dp[pos][sum]=res;
    return res;
}
ll solve(ll x,int nd){
    idx=0;
    memset(dp,-1,sizeof dp);
    while(x){
        a[++idx]=x%10;x/=10;
    }
    return dfs(idx,1,0,nd,1);
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    ll a,b;cin>>a>>b;
    for(int i=0;i<=9;i++){
        cout<<solve(b,i)-solve(a-1,i)<<' ';
    }
    return 0;
}
```

### 区间DP

---

对于某个状态而言，其状态转移不是由某一个特定状态得来，而是某几个区间得来。

一般由内区间向两边进行扩增，即大区间包涵小区间

[P2858 [USACO06FEB\]Treats for the Cows G/S - 洛谷 | 计算机科学教育新生态 (luogu.com.cn)](https://www.luogu.com.cn/problem/P2858)

对于这道题

如果设$dp[i][j]$表示为售卖i到j份零食所获得最大收益的话，那么

如果转移方程为

$$dp[i][j]=max(a[i]*(j-i)+dp[i+1][j],a[j]*(j-i)+dp[i][j-1])$$

那么就产生了限制，限制为a[i]或者a[j]为最后一天购买的，仔细思考，如果产生最优条件时，i或者j必然有一个会是最后一个购买的吗？ 显然不成立，但是思考可以发现，a[i]或者a[j]必然是有一个是在第一天就会购买的，那么

可以得出状态转移方程

$$dp[i][j]=max(a[i]+dp[i+1][j]+sum[i]-sum[j],a[j]+dp[i][j-1]+sum[i-1]-sum[j-1])$$

其中

$sum[i]-sum[j]$为前缀和，即枚举的区间产生的代价。

---

那么下一道类似的

[P3205 [HNOI2010\]合唱队 - 洛谷 | 计算机科学教育新生态 (luogu.com.cn)](https://www.luogu.com.cn/problem/P3205)

设$dp[i][j]$为i到j理想队列所产生的初始队列数，考虑左边或右边多加一个理想数，对于原来的初始队列来说，现加入的这一个理想数的位置只与上一个理想队列的最左边或者最右边有关，仔细想想，因为多加的一位数必然是最后一个加到左边或者右边，则现考虑多加的理想数的位置是取决于上个理想队列多加的那个理想数的位置的。

但显然，现状态取决于上个状态最后一个数的位置，所以需要多加一层状态即$dp[i][j][k]$为i到j理想队列所产生的初始队列数，k==0是表示该状态最后一个数为第一个，1为最后一个。

那么所得转移方程为

```cpp
if(a[i]<a[i+1]){
    dp[i][j][0]+=dp[i+1][j][0];
}
if(a[i]<a[j]){
    dp[i][j][0]+=dp[i+1][j][1];
}
if(a[j]>a[j-1]){
    dp[i][j][1]+=dp[i][j-1][1];
}
if(a[j]>a[i]){
    dp[i][j][1]+=dp[i][j-1][0];
}
```

像这类两边取数放数的区间dp，考虑状态转移时就考虑两边界第一次放或取与其他区间的关系就行。

---

[P1220 关路灯 - 洛谷 | 计算机科学教育新生态 (luogu.com.cn)](https://www.luogu.com.cn/problem/P1220)

这道题通过分析可以很容易的发现其状态方程和两边的端点有关，然后继续分析，我首先得到的状态方程是这样的

$$dp[i][j][0]=min(dp[i+1][j][0]+(a[i+1]-a[i])*val[i],dp[i+1][j][1]+(a[j]-a[i])*val[i])$$

$$dp[i][j][1]=min(dp[i][j-1][0]+(a[j]-a[j-1])*val[j],dp[i][j-1][0]+(a[j]-a[i])*val[j])$$

$dp[i][j][0]$表示关闭从i到j的路灯最后走到最左边的最小花销。

但实际这是错误的，因为这样子考虑子问题并不是局部最优，我们没有考虑到还没有关闭的灯的花销。

所以实际应该是

$$dp[i][j][0]=min(dp[i+1][j][0]+(a[i+1]-a[i])*sum(),dp[i+1][j][1]+(a[j]-a[i])*sum())$$

其中的$sum()=(sum[n]-sum[j]+sum[i])$

显然$a1+b1*c$ 与 $a2+b2*c$的比较关系有可能是会因为c的改动而产生变化的。所以这里的扩张区间的代价不应该只是子区间内的开销，而应该是整个区间的开销。

合并区间加判断且不一定成功的区间DP





### 线段树乘加改+数和+平方数和+次方数和

```cpp
#define ll long long
#define INF 0x3f3f3f3f
#define N 100005
#define pii pair<int,int>
const double PI=acos(-1);
const int mod=10007;
int a[N];
struct Segtree{
    ll tree[N<<2][3];//分别是1次方和2次方和3次方和
    ll lzx[N<<2];//lazy乘
    ll lzj[N<<2];//lazy加
    ll lzc[N<<2];//lazy改
    void init(int n){
        memset(tree,0,sizeof tree);
        for(int i=1;i<=4*n;i++){
            lzx[i]=1;
            lzj[i]=0;
            lzc[i]=-1;
        }
    }
    void modd(int root){//有模的时候处理
        tree[root][0]%=mod;
        tree[root][1]%=mod;
        tree[root][2]%=mod;
        lzx[root]%=mod;
        lzj[root]%=mod;
        if(lzc[root]!=-1)lzc[root]%=mod;
    }
    void pushup(int root){
        tree[root][0]=tree[root<<1][0]+tree[root<<1|1][0];
        tree[root][1]=tree[root<<1][1]+tree[root<<1|1][1];
        tree[root][2]=tree[root<<1][2]+tree[root<<1|1][2];
        modd(root);
        return;
    }
    void pushdown(int root,int st,int ed){
        int mid=st+ed>>1;
        if(lzc[root]!=-1){//如果改位置有改标记，则可以直接下放，并且清楚其他标记
            ll c=lzc[root];
            tree[root<<1][2]=(mid-st+1)*c*c*c;
            tree[root<<1][1]=(mid-st+1)*c*c;
            tree[root<<1][0]=(mid-st+1)*c;
            lzc[root<<1]=c;
            lzj[root<<1]=0;
            lzx[root<<1]=1;
            tree[root<<1|1][2]=(ed-mid)*c*c*c;
            tree[root<<1|1][1]=(ed-mid)*c*c;
            tree[root<<1|1][0]=(ed-mid)*c;
            lzc[root<<1|1]=c;
            lzj[root<<1|1]=0;
            lzx[root<<1|1]=1;
            lzc[root]=-1;
            modd(root<<1);
            modd(root<<1|1);
        }
        if(lzx[root]!=1){//先乘再加
            ll c=lzx[root];
            tree[root<<1][2]*=c*c*c;
            tree[root<<1][1]*=c*c;
            tree[root<<1][0]*=c;
            lzj[root<<1]*=c;
            lzx[root<<1]*=c;
            tree[root<<1|1][2]*=c*c*c;
            tree[root<<1|1][1]*=c*c;
            tree[root<<1|1][0]*=c;
            lzj[root<<1|1]*=c;
            lzx[root<<1|1]*=c;
            lzx[root]=1;
            modd(root<<1);
            modd(root<<1|1);
        }
        if(lzj[root]){
            ll c=lzj[root];
            tree[root<<1][2]+=(mid-st+1)*c*c*c+3*c*c*tree[root<<1][0]+3*c*tree[root<<1][1];
            tree[root<<1][1]+=(mid-st+1)*c*c+2*tree[root<<1][0]*c;
            tree[root<<1][0]+=(mid-st+1)*c;
            lzj[root<<1]+=c;
            tree[root<<1|1][2]+=(ed-mid)*c*c*c+3*c*c*tree[root<<1|1][0]+3*c*tree[root<<1|1][1];
            tree[root<<1|1][1]+=(ed-mid)*c*c+2*tree[root<<1|1][0]*c;
            tree[root<<1|1][0]+=(ed-mid)*c;
            lzj[root<<1|1]+=c;
            lzj[root]=0;
            modd(root<<1);
            modd(root<<1|1);
        }
    }
    void build(int root,int st,int ed){
        if(st==ed){
            tree[root][0]=a[st];
            tree[root][1]=a[st]*a[st];
            tree[root][2]=a[st]*a[st]*a[st];
            modd(root);
            return;
        }
        int mid=st+ed>>1;
        build(root<<1,st,mid);
        build(root<<1|1,mid+1,ed);
        pushup(root);
        return;
    }
    void modify(int root,int l,int r,int st,int ed,int op,ll c){
        if(st>=l&&ed<=r){
            if(op==1){
                tree[root][2]+=(ed-st+1)*c*c*c+3*c*c*tree[root][0]+3*c*tree[root][1];
                tree[root][1]+=(ed-st+1)*c*c+2*tree[root][0]*c;
                tree[root][0]+=(ed-st+1)*c;
                lzj[root]+=c;
            }
            else if(op==2){
                tree[root][2]*=c*c*c;
                tree[root][1]*=c*c;
                tree[root][0]*=c;
                lzj[root]*=c;//把之前加的都乘上才能实现先乘再加
                lzx[root]*=c;
            }
            else{
                tree[root][2]=(ed-st+1)*c*c*c;
                tree[root][1]=(ed-st+1)*c*c;
                tree[root][0]=(ed-st+1)*c;
                lzc[root]=c;//全改，标记就可以清
                lzx[root]=1;
                lzj[root]=0;
            }
            modd(root);
            return;
        }
        pushdown(root,st,ed);
        int mid=st+ed>>1;
        if(mid>=l)modify(root<<1,l,r,st,mid,op,c);
        if(mid<r)modify(root<<1|1,l,r,mid+1,ed,op,c);
        pushup(root);
        return;
    }
    ll querry(int root,int l,int r,int st,int ed,int op){
        if(st>=l&&ed<=r){
            return tree[root][op];
        }
        int mid=st+ed>>1;
        pushdown(root,st,ed);
        ll ans=0;
        if(mid>=l){
            ans+=querry(root<<1,l,r,st,mid,op);ans%=mod;
        }
        if(mid<r){
            ans+=querry(root<<1|1,l,r,mid+1,ed,op);ans%=mod;
        }
        return ans;
    }
}T1;
void solve(){
    int n,m;
    while(cin>>n>>m){
        if(n+m==0)break;
        T1.init(n);
        T1.build(1,1,100000);
        while(m--){
            int op,x,y,c;cin>>op>>x>>y>>c;
            if(op<=3){
                T1.modify(1,x,y,1,100000,op,c);
            }
            else{
                cout<<T1.querry(1,x,y,1,100000,c-1)%mod<<endl;
            }
        }
    }
}
int main(){
    solve();
    return 0;
}
```



### 次小生成树

#### 求解方法

- 求出无向图的最小生成树 ，设其权值和为 
- 遍历每条未被选中的边 ，找到 中 到 路径上边权最大的一条边 ，则在 中以 替换 ，可得一棵权值和为 的生成树 .
- 对所有替换得到的答案 取最小值即可

如何求 路径上的边权最大值呢？

我们可以使用倍增来维护，预处理出每个节点的 级祖先及到达其 级祖先路径上最大的边权，这样在倍增求 LCA 的过程中可以直接求得。

##### 当要求严格次小的时候：

因为最小生成树保证生成树中 到 路径上的边权最大值一定 **不大于** 其他从 到 路径的边权最大值。换言之，当我们用于替换的边的权值与原生成树中被替换边的权值相等时，得到的次小生成树是非严格的。

解决的办法很自然：我们维护到 级祖先路径上的最大边权的同时维护 **严格次大边权**，当用于替换的边的权值与原生成树中路径最大边权相等时，我们用严格次大值来替换即可。

这个过程可以用倍增求解。

```cpp
#define N 5005
#define ll long long
int pa[N][32];
int dep[N];
int cost[N][32];
struct node{
    int to;
    int w;
};
vector<node>vec[N];
void dfs(int u,int fa){//倍增处理
    pa[u][0]=fa;dep[u]=dep[fa]+1;
    for(int i=1;i<31;i++){
        pa[u][i]=pa[pa[u][i-1]][i-1];
        cost[u][i]=max(cost[u][i-1],cost[pa[u][i-1]][i-1]);
    }
    for(int i=0;i<vec[u].size();i++){
        if(vec[u][i].to==fa)continue;
        cost[vec[u][i].to][0]=vec[u][i].w;
        dfs(vec[u][i].to,u);
    }
    return;
}
int lca(int u,int v){//最小公共祖先
    if(dep[u]<dep[v])swap(u,v);//u是更深的那个
    int t=dep[u]-dep[v];
    int maxn=-1;
    for(int i=0;t;i++,t>>=1){//跳到同等高度
        if(t&1){
            maxn=max(maxn,cost[u][i]);
            u=pa[u][i];
        }
    }
    for(int i=30;i>=0;i--){//到同样高度时候一起跳
        int uu=pa[u][i],vv=pa[v][i];
        if(uu!=vv){//如果跳的高度还没有共同祖先说明可以跳
            maxn=max(maxn,cost[u][i]);
            maxn=max(maxn,cost[v][i]);
            u=uu;v=vv;
        }
    }
    if(u==v){//如果本来就已经到达祖先
        return maxn;
    }
    else{//位于祖先的子节点
        maxn=max(maxn,cost[u][0]);
        maxn=max(maxn,cost[v][0]);
        return maxn;
    }
}
struct edge{
    int from,to,w;
}ed[N];
int idx=0;
int fa[N];
int n,m;
bool book[N];
bool cmp(edge a,edge b){
    return a.w<b.w;
}
void init(int n){
    idx=0;
    memset(book,0,sizeof(book));
    for(int i=1;i<=n;i++)vec[i].clear();
}
int find(int x){
    return x==fa[x]? x:fa[x]=find(fa[x]);
}
void kelus(){
    int sum=0;
    sort(ed+1,ed+1+idx,cmp);
    for(int i=1;i<=n;i++){
        fa[i]=i;
    }
    for(int i=1;i<=m;i++){
        int x=find(ed[i].to),y=find(ed[i].from);
        if(x!=y){
            vec[ed[i].to].push_back({ed[i].from,ed[i].w});
            vec[ed[i].from].push_back({ed[i].to,ed[i].w});
            sum+=ed[i].w;
            fa[x]=y;

        }
        else{
            book[i]=1;
        }
    }
    dfs(1,0);
    bool flag=false;
    for(int i=1;i<=m;i++){
        if(book[i]){
            if(ed[i].w==lca(ed[i].to,ed[i].from))flag=true;
        }
    }
    if(flag){
        cout<<"Not Unique!"<<"\n";
    }
    else{
        cout<<sum<<"\n";
    }
}
void solve(){
    cin>>n>>m;
    init(n);
    for(int i=1;i<=m;i++){
        int u,v,w;cin>>u>>v>>w;
        idx++;ed[idx].from=u;ed[idx].to=v;ed[idx].w=w;
    }
    kelus();
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

### 无向图割点

```cpp
#define N 200005
vector<int>vec[N];
int dpn[N];
int low[N];
int idx=0;
bool book[N];
void tarjan(int u,int fa){
    dpn[u]=++idx;
    low[u]=dpn[u];
    int cd=0;
    for(auto v:vec[u]){
        if(!dpn[v]){
            tarjan(v,fa);
            low[u]=min(low[u],low[v]);
            if(low[v]>=dpn[u]&&u!=fa){
                book[u]=1;
            }
            if(u==fa){
                cd++;
            }
        }
        low[u]=min(low[u],dpn[v]);
    }
    if(cd>=2&&u==fa){//特判根节点
        book[u]=1;
    }
    return;
}
```

#### 点双连通：删掉一个点之后，图仍联通

点双连通分量的求法与边双连通分量的求法不一样。
割点可以包含在点双里。

点双连通分量的求法：

- 若某个点为“孤立点”，这个点肯定是点双。

- 其他的点双连通分量大小至少为2个点。
  具体求法，还是看看我上一篇博客的tarjan强连通分量（链接前面已经给了）

与强联通分量类似，用一个栈来维护：

- 如果这个点第一次被访问时，把该节点进栈；

- 当割点判定法则中的条件 dfn[x]<=low[y]时，无论x是否为根，都要：

  1. 从栈顶不断弹出节点，直至节点y被弹出

  2. 刚才弹出的所有节点与节点x一起构成一个v-DCC。

     ```cpp
     #define N 200005
     vector<int>vec[N];
     int dpn[N];
     int low[N];
     int idx=0;
     bool book[N];
     satck<int>sta;
     vector<int>dcc[N];
     int cnt=0;
     void tarjan(int u,int fa){//注意fa一定从0开始
         dpn[u]=++idx;
         low[u]=dpn[u];
         int kid=0;
         sta.push(u);
         for(auto v:vec[u]){
             if(!dpn[v]){
                 kid++;
                 tarjan(v,x);
                 low[u]=min(low[u],low[v]);
                 if(low[v]>=dpn[u]){//割点可以在分量中，所以不用!=fa
                     book[u]=1;cnt++;
                     dcc[cnt].push_back(u);
                     while(sta.top()!=u){//同一个节点可能出现在两个不同的点双中
                         dcc[cnt].push_back(sta.top());sta.pop();
                     }//不用弹出u
                 }
             }
             else if(dpn[u]>dpn[v]&&v!=fa){
             	low[u]=min(low[u],dpn[v]);
             }
         }
         if(fa==0&&kid==1){//根节点只有一个子节点的时候,不是割点。
             book[x]=0;
         }
         if(fa==0&&kid==0){//只有根节点一个节点时候
             cnt++;
             dcc[cnt].push_back(u);
         }
         return;
     }
     ```


### 无向图割边

```cpp
int low[MAXN], dfn[MAXN], iscut[MAXN], dfs_clock;
bool isbridge[MAXN];
vector<int> G[MAXN];
int cnt_bridge;
int father[MAXN];
void tarjan(int u, int fa) {
  father[u] = fa;
  low[u] = dfn[u] = ++dfs_clock;
  for (int i = 0; i < G[u].size(); i++) {
    int v = G[u][i];
    if (!dfn[v]) {
      tarjan(v, u);
      low[u] = min(low[u], low[v]);
      if (low[v] > dfn[u]) {
        isbridge[v] = true;
        ++cnt_bridge;
      }
    } else if (dfn[v] < dfn[u] && v != fa) {
      low[u] = min(low[u], dfn[v]);
    }
  }
}//当 isbridge[x] 为真时，(father[x],x) 为一条割边。
```

#### 边双连通：删掉一条边之后，图仍联通

算法：只需求出无向图中所有的割边，把割边都删除后，无向图会分成若干个连通块，每一个连通块就是一个“边双连通分量”。
具体实现：一般先用Tarjan算法求出所有的桥，然后再对整个无向图执行一次dfs遍历（遍历的过程不访问割边），划分出每个连通块即可。

### FFT

```cpp
const double PI=acos(-1.0);
struct Complex{
    double x,y;
    Complex(double _x=0.0,double _y=0.0){x=_x,y=_y;}
    Complex operator -(const Complex &b)const{
        return Complex (x-b.x,y-b.y);
    }
    Complex operator +(const Complex &b)const{
        return Complex (x+b.x,y+b.y);
    }
    Complex operator *(const Complex &b)const{
        return Complex (x*b.x-y*b.y,x*b.y+y*b.x);
    }
};
void change(Complex y[],int len){
    for(int i=1,j=len/2;i<len-1;i++){
        if(i<j)swap(y[i],y[j]);
        int k=len/2;
        while(j>=k)j-=k,k/=2;
        if(j<k)j+=k;    
    }
}   
void fft(Complex y[],int len,int op){//op==1 DFT系数转点值，==-1，IDFT，点值转系数
    change(y,len);
    for(int h=2;h<=len;h<<=1){
        Complex wn(cos(-op*2*PI/h),sin(-op*2*PI/h));
        for(int j=0;j<len;j+=h){
            Complex w(1,0);
            for(int k=j;k<j+h/2;k++){
                Complex u=y[k];
                Complex t=w*y[k+h/2];
                y[k]=u+t,y[k+h/2]=u-t;
                w=w*wn;
            }
        }
    }
    if(op==-1){
        for(int i=0;i<len;i++)y[i].x/=len;
    }
}
Complex x1[N],x2[N];
void conv(Complex y1[],Complex y2[],int len){//需要len为2的幂
    fft(y1,len,1);fft(y2,len,1);
    for(int i=0;i<len;i++){
        y1[i]=y1[i]*y2[i];
    }
    fft(y1,len,-1);
}
```

### 2-SAT

> 题面：有 n 对夫妻被邀请参加一个聚会，因为场地的问题，每对夫妻中只有1人可以列席。在2n个人中，某些人之间有着很大的矛盾（当然夫妻之间是没有矛盾的），有矛盾的2个人是不会同时出现在聚会上的。有没有可能会有n个人同时列席？

这是一道多校题，裸的 2-SAT 判断是否有方案，按照我们上面的分析，如果a1中的丈夫和a2中的妻子不合，我们就把a1中的丈夫和a2中的丈夫连边，把a2中的妻子和a1中的妻子连边，然后缩点染色判断即可。

### 树上差分

### 边差分

$d_s=d_s+1$             $d_t=d_t+1$            $d_{lca}=d_{lca}-2$

![算法示意图](/images/posts/5e07040aef438955.svg)

### 点差分

$d_s=d_s+1$             $d_t=d_t+1$            $d_{lca}=d_{lca}-1$            $d_{f(lca)}=d_{f(lca)}-1$

![算法示意图](/images/posts/830f771ecb7cfd3b.svg)

### 费用流模板

```cpp
struct MAXflow{
	struct Edge{
	    int to,w,cost,nex;
	}e[N];
	int idx=1;
	int sta,endd;
	int maxflow,mincost;
	int head[N];int dis[N];bool vis[N];int pre[N];int flow[N];
	void add(int u,int v,int w,int cost){
	    idx++;e[idx]={v,w,cost,head[u]};
	    head[u]=idx;
	    idx++;e[idx]={u,0,-cost,head[v]};
	    head[v]=idx;
	    return;
	}
	bool spfa(int op){//op==1为最小费用最大流，==0为最大费用最小流
		if(op==1){
			memset(dis,0x3f,sizeof dis);//一遍spfa n遍松弛还能判断负环
		}
		else{
			memset(dis,-0x3f,sizeof dis);
		}
	    queue<int>que;que.push(sta);
	    dis[sta]=0;flow[sta]=INF;vis[sta]=1;//初始化起点，flow记录流量
	    while(!que.empty()){
	        int u=que.front();que.pop();vis[u]=0;//表示已经用过了，以后遇到还能再更新
	        for(int i=head[u];i;i=e[i].nex){
	            int v=e[i].to;
	            if(e[i].w&&((op==1&&dis[v]>dis[u]+e[i].cost)||(op==0&&dis[v]<dis[u]+e[i].cost))){//如果有流量，并且更短路，有增广路
	                dis[v]=dis[u]+e[i].cost;
	                pre[v]=i;
	                flow[v]=min(e[i].w,flow[u]);//记录流量
	                if(!vis[v]){//如果已经在队列了就没必要加入
	                    que.push(v);vis[v]=1;
	                }
	            }
	        }
	    }
	    return op? dis[endd]!=INF:dis[endd]!=-1044266559;
	}
	void mcmf(){
	    maxflow+=flow[endd];//总流量加上一次增广的流量
	    mincost+=flow[endd]*dis[endd];//最小费用
	    int u=endd;
	    while(u!=sta){//没有采用在dfs时候去减流量，而是用pre直接while往上手动去减
	        e[pre[u]].w-=flow[endd];
	        e[pre[u]^1].w+=flow[endd];
	        u=e[pre[u]^1].to;
	    }
	}
}M1;
while(M1.spfa()){
    mcmf();
}
```

### 种类并查集

[P2024 [NOI2001\] 食物链 - 洛谷 | 计算机科学教育新生态 (luogu.com.cn)](https://www.luogu.com.cn/problem/P2024)

AC代码：

```cpp
#include<iostream>
#include<algorithm>
#include<vector>
using namespace std;
#define N 2000005
vector<int>vec[N];
vector<int>ans;
int fa[N];//与x相连的是与x同类的，与x+n相连的是x的猎物，与x+2n连的是x的天敌，是关系之间的连接
int find(int x){
    return x==fa[x]? x:fa[x]=find(fa[x]);
}
void merge(int x,int y){
    x=find(x);y=find(y);
    fa[x]=y;
}
void solve(){
    int n,k;cin>>n>>k;
    for(int i=1;i<3*n;i++)fa[i]=i;
    int cnt=0;
    for(int i=1;i<=k;i++){
        int op,x,y;cin>>op>>x>>y;
        if(x>n||y>n){
            cnt++;continue;
        }
        if(op==2&&x==y){
            cnt++;continue;
        }
        if(op==1){
            if(find(x+n)==find(y)||find(x+2*n)==find(y)){
                cnt++;
                continue;
            }
            merge(x,y);
            merge(x+n,y+n);//y+n与x相连，说明与y相连的y的猎物也是x的猎物
            merge(x+2*n,y+2*n);//同上
        }
        else{
            if(find(x)==find(y)||find(x+2*n)==find(y)){
                cnt++;
                continue;
            }
            merge(x+2*n,y+n);//x吃y，y的猎物吃x，也就说y的猎物是x的天敌
            merge(x+n,y);
            merge(y+2*n,x);
        }
    }
    cout<<cnt;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
    return 0;
}
```



### 对SG函数的证明的解读



SG函数之所以采用mex运算的原因在于其运算法则完全符合所有公平组合游戏的规则。

即

- 定理 1：没有后继状态的状态是必败状态。
- 定理 2：一个状态是必胜状态当且仅当存在至少一个必败状态为它的后继状态。
- 定理 3：一个状态是必败状态当且仅当它的所有后继状态均为必胜状态。

那么通过mex运算来映射其推理是极其合理的。

通过mex运算，引入了SG函数一说。

通过研究最简单的一个棋子游戏，给定一个有向无环图和一个起始顶点上的一枚棋子，两名选手交替的将这枚棋子沿有向边进行移动，无法移动者判负。这个游戏可以认为是所有Impartial Combinatorial Games的抽象模型。也就是说，任何一个ICG都可以通过把每个局面看成一个顶点，对每个局面和它的子局面连一条有向边来抽象成这个“有向图游戏”。

那么对于由多个SG函数组成的游戏，则可以看作是由多个棋子组成的一个游戏，每个棋子形成一个局面。

> 可以很容易的发现，自己很容易弄混在ICG中的状态和游戏局面的概念。下面提供一道好题加以理解。

[894. 拆分-Nim游戏 - AcWing题库](https://www.acwing.com/problem/content/896/)

```cpp
#define N 305
int a[N];
int n;
int SG[N];
bool vis[N];
void getSG(){
    for(int i=1;i<=100;i++){//枚举每个i
        memset(vis,0,sizeof vis);//对子状态的标记清零
        for(int j=0;j<i;j++){
            for(int k=0;k<=j;k++){
                vis[SG[j]^SG[k]]=1;
            }
        }
        for(int j=0;j<=300;j++){//mex运算
            if(!vis[j]){
                SG[i]=j;
                break;
            }
        }
    }
}
int main(){
    cin>>n;
    for(int i=1;i<=n;i++){
        cin>>a[i];
    }
    getSG();
    int res=0;
    for(int i=1;i<=n;i++){
        res^=SG[a[i]];
    }
    puts(res? "Yes":"No");
    return 0;
}
```

可以发现在求SG时候，不仅枚举了i，还枚举了j和k，j和k代表的是选取i然后新加入的两个规模更小的石子，或者说新加入的两个更小规模的游戏局面。根据题意，可以理解到，i的最优策略与其加入哪两个游戏局面是有关的。

所以可以理解成枚举的一对i，j构成一个新的状态，而i和j分别为两个不同的游戏局面，也就是说，游戏局面i可以转移的状态有i-1个，然后这i-1个状态每个都对应着一对与其他状态不同的(i，k），也就是说一个状态对应着两个游戏局面，而i游戏局面可以转移到这i-1个状态，每个状态则可以看成由（i，k）两个游戏局面的和，即状态的SG值$=SG(i)\;XOR\; SG(k)$,而游戏局面i由于可以对i-1个状态选择一个进行转移，则是运用mex运算。

当然，实际上游戏局面i也算是一种状态，那么根据以上规律，可以发现，当一种状态可以多种状态其中之一转移得来，则是做mex运算，若是由多种状态共同决定则做异或运算。

### 博弈结论

#### 翻硬币游戏

**问题：**一般的翻硬币游戏规则如下：

- nn枚硬币排成一排，有的正面朝上，有的反面朝上，从左到右依次编号。
- 游戏者根据某些约束翻硬币(如：每次只能翻1或2枚，或者每次只能翻动连续的几枚)，但他所翻动的硬币中，最右边的那个必须是从正面翻到反面
- 无法操作者输
  **结论：**局面的SG值为局面中每个正面朝上的棋子单一存在时的SG值的异或和。
  ![image_1d1cvbn5km571j5gsjhimu1vmvp.png-102.4kB](/images/posts/53e4ce9a69fe73b9.png)
  ΔΔ在某种意义上，它的决策与Nim游戏完全等价。

#### 无向图删边游戏

##### 树的删边游戏

**问题：**有如下规则：

- 给出一个有nn个节点的有根树。
- 游戏者轮流从树中删去边，删去一条边后，不与根节点相连的部分将被移走。
- 无法操作者输
  **结论：**叶子节点的SG值为0，中间节点的SG值为它所有子节点的SG值加1后的异或和。

##### 无向图删边游戏

- 一个无向联通图，有一个点作为图的根
- 游戏者轮流从图中删去边，删去一条边后，不与根相连的部分将被移走。
- 无法操作者输

#### Fusion Principle定理

> 对无向图做如下改动：将图中任意一个偶环缩成一个新点，任意一个奇环缩成一个新点加一个新边；所有连到原先环上的边全部与新点相连，这样的改动不会影响图的SG值。

因此可以将任意无向图改成树形结构。

#### NimK游戏

**问题：**nn堆石子轮流取，每次可以任选mm堆取任意个，无法操作者输，求是否先手必胜。
**结论：**在二进制意义上，如果每一位的11的个数都是m+1m+1的倍数，那么先手必输。Nim游戏可以看做m=1m=1的NimK游戏。因为异或就相当于把每一位11的个数加起来对22取模.

#### 斐波那契博弈

**问题：**有一堆n个石子，2人轮流取，先取者可以取走任意多个，但不能全取完，以后每人取的石子数不能超过上个人的2倍，无法操作者输。
**结论：**先手必败当且仅当石子数为斐波那契数

#### 二分图博弈

> 给出一张**二分图**和**起始点** ![[公式]](https://www.zhihu.com/equation?tex=H) ，A和B轮流操作，每次只能选与上个被选择的点（第一回合则是点 ![[公式]](https://www.zhihu.com/equation?tex=H) )**相邻**的点，且不能选择**已选择过**的点，**无法选点**的人输掉。一个经典的二分图博弈模型是在国际象棋棋盘上，双方轮流移动一个士兵，不能走已经走过的格子，问谁先无路可走。

这类模型其实很好处理。考虑二分图的**最大匹配**，如果最大匹配**一定**包含 ![[公式]](https://www.zhihu.com/equation?tex=H) ，那么先手必胜，否则先手必败。

**问题：**基于以下几点：
1，共2人参与。
2，博弈状态(对应节点)可分为两类，任意合法转移都是在两类状态之间转移，而不能在任意一类状态内部转移。
3，不可以转移到已访问状态
4，无法转移者输
**解法：**
观察题目的特殊性，我们发现，将每个状态看做一个点，那么这些点和合法转移会构成一个二分图。
将S集合视作轮到先手决策的点，T集合则代表轮到后手决策的点。
我们先跑一遍二分图匹配，对于任意一点x，有2种情况：
1，不属于最大匹配(非匹配点)
　　走一步后必然会走到一个匹配点，否则如果遇到一个非匹配点就会形成一条增广路，那么就不符合最大匹配的前提。而走到一个匹配点后，对方可以不断沿着匹配边走，最后必然会停留在S集合，也就是先手必输。因为如果停留在T集合，依然相当于找到了一条增广路，不符合前提。
2，属于最大匹配
　　根据1中的描述可知，这个点先手必胜。
**其他：**

> 如果一个点xx,在某种情况下不属于最大匹配，那么不管它怎么走，走到的目标节点一定会在某种情况下属于最大匹配，因此如果从点xx开始会导致先手必败。反之，如果一个点xx在任意情况下都属于最大匹配(即为最大匹配的必须点)，则先手必胜。

**如何检验？**
1，最暴力的方法：把xx从原图中删去，再跑最大匹配，如果跑出的最大匹配大小不变，则说明是非必须点。
2，稍微巧妙一点的方法：考虑一个xx是必须点，相当于没有点可以取代xx，因此我们从xx开始遍历，看是否可以找到一个同侧的未匹配点，如果可以找到，则说明xx为非必须点。
即我们在用匹配点来寻找是否有点可以替换掉它。因此我们可以在n+mn+m的时间内判断出一个点是否为必须点。

将这个做法进行推广，我们可以得到一个判断二分图中有没有xx是非必须点的方法：
从每个未匹配点xx开始遍历，将经过的同侧点打上标记，最后检验是否有匹配点被打上标记，有则图中至少有一个非必须点，因此如果后手可以选择开始的位置，那么先手必败。

具体实现可以根据数据范围选用**[匈牙利算法](https://zhuanlan.zhihu.com/p/122375531)**或**[Dinic](https://zhuanlan.zhihu.com/p/122375531)**。需要注意的是，如果采用Dinic，不要根据有没有 ![[公式]](https://www.zhihu.com/equation?tex=H) 点建两次图。而是在建图时把涉及 ![[公式]](https://www.zhihu.com/equation?tex=H) 点的边存下来，跑完第一次Dinic后再建这些边，第二次Dinic看有没有增加流量

### 换根DP rerooting技巧，即转移根节点。

https://codeforces.com/problemset/problem/1324/F

首先先dp计算一个根节点自顶向下的结果，可以保证这个点的答案是正确的。然后转移根节点，那么显然一个根节点的其他子树对后转移的代价没有影响，所以其结果就是

$ dpv=dpv−max(0,dpto) $   $ dpto=dpto+max(0,dpv)$



### DFS序建可持续化线段树

```cpp
struct node{
    int val;int ls;int rs;
}nd[N*20];
int idx;
int xulie[20*N];
vector<int>vec[20*N];
int insert(int root,int st,int ed,int k){
    int now=++idx;nd[now]=nd[root];nd[now].val++;
    int mid=(st+ed)/2;
    if(st==ed){
        return now;
    }
    if(k<=mid){
        nd[now].ls=insert(nd[now].ls,st,mid,k);
    }
    else{
        nd[now].rs=insert(nd[now].rs,mid+1,ed,k);
    }
    return now;
}
int querry(int l,int r,int st,int ed,int l1,int r1){
    //l版本树，r版本树，[st,ed]表示管理范围。[l1,r1]为查询范围
    int mid=(st+ed)/2;
    if(st>=l1&&ed<=r1)return nd[r].val-nd[l].val;
    if(ed<l1||st>r1)return 0;
    return querry(nd[l].ls,nd[r].ls,st,mid,l1,r1)+querry(nd[l].rs,nd[r].rs,mid+1,ed,l1,r1);
}
int in[20*N];
int out[20*N];
int root[20*N];
int idx1;
void dfs(int u,int fu){
    xulie[++idx1]=u;
    in[u]=idx1;
    for(auto x:vec[u]){
        if(x!=fu){
            dfs(x,u);
        }
    }
    out[u]=idx1;
    return;
}
int fat[N][31];
int val[20*N];
void dfs1(int u,int fu){
    fat[u][0]=fu;
    for(int i=1;i<=20;i++){
        fat[u][i]=fat[fat[u][i-1]][i-1];
    }
    for(auto v:vec[u]){
        if(v!=fu){
            dfs1(v,u);
        }
    }
    return;
}
int main(){
    ios::sync_with_stdio(false);
    int n;cin>>n;
    for(int i=1;i<n;i++){
        int u,v;cin>>u>>v;
        vec[u].push_back(v);
        vec[v].push_back(u);
    }
    int maxn=-1;
    for(int i=1;i<=n;i++){
        cin>>val[i];
    }
    dfs(1,-1);
    for(int i=1;i<=idx1;i++){
        root[i]=insert(root[i-1],1,1e9,val[xulie[i]]);
    }
    dfs1(1,0);
    int q;cin>>q;
    val[0]=1e9+7;
    while(q--){
        int x,l,r;cin>>x>>l>>r;
        for(int i=20;i>=0;i--){
            if(val[fat[x][i]]<=r)x=fat[x][i];
        }
        if(val[x]>r||val[x]<l){
            cout<<0<<endl;
            continue;
        }
        int ans=querry(root[in[x]-1],root[out[x]],1,1e9,l,r);
        cout<<ans<<endl;
    }
    return 0;
}
```



### 带修莫队

```cpp
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
#define ll long long
#define pii pair<ll,ll>
#define fi first
#define se second
//#pragma GCC optimize(2)
//#define int long long
const int N=1000005;
const int mod=1e9+7;
int a[N],b[N];
int unit;
int book[N];
struct qy{
	int l,r,t,p;
	bool operator <(const qy b) const{
		if(l/unit!=b.l/unit)return l/unit<b.l/unit;
		if(r/unit!=b.r/unit)return r/unit<b.r/unit;
		return t<b.t; 
	}
}q[N];
int ans[N];
int cnt;
int last[N];
int M[N][3];
void add(int pos){
	if(!book[b[pos]])cnt++;
	book[b[pos]]++;
}
void del(int pos){
	book[b[pos]]--;
	if(!book[b[pos]])cnt--;
}
void solve(){
	int n,m;cin>>n>>m;
	for(int i=1;i<=n;i++){
		cin>>a[i];b[i]=a[i];
	}

	int idx=0,idx1=0;
	for(int i=1;i<=m;i++){
		char op;cin>>op;
		if(op=='Q'){
			idx1++;
			cin>>q[idx1].l>>q[idx1].r;
			q[idx1].p=idx1;
			q[idx1].t=idx;
		}
		if(op=='R'){
			idx++;
			int p,c;cin>>p>>c;
			M[idx][0]=p;M[idx][1]=a[p];M[idx][2]=a[p]=c;
		}
	}
	unit=pow(n,2.0/3.0);
	sort(q+1,q+1+idx1);
	int l=1,r=0,t=0;//l为删1~l-1的数，r为加1~r的数
	for(int i=1;i<=idx1;i++){
		while(r<q[i].r)add(++r);
		while(l>q[i].l)add(--l);
		while(l<q[i].l)del(l++);
		while(r>q[i].r)del(r--);
		for(int j=t;j>=q[i].t+1;j--){
			if(M[j][0]<=r&&M[j][0]>=l){
				book[M[j][2]]--;if(!book[M[j][2]])cnt--;
				if(!book[M[j][1]])cnt++;
				book[M[j][1]]++;
			}
			b[M[j][0]]=M[j][1];
		}
		for(int j=t+1;j<=q[i].t;j++){
			if(M[j][0]<=r&&M[j][0]>=l){
				book[M[j][1]]--;if(!book[M[j][1]])cnt--;
				if(!book[M[j][2]])cnt++;
				book[M[j][2]]++;
			}
			b[M[j][0]]=M[j][2];
		}
		ans[q[i].p]=cnt;
		t=q[i].t;
	}
	for(int i=1;i<=idx1;i++){
		cout<<ans[i]<<"\n";
	}
}
int main(){
	std::ios::sync_with_stdio(false);
	std::cin.tie(nullptr);
		solve();
	return 0;
}
```

### 普通莫队

```cpp
#pragma GCC optimize(2) //02优化
int unit;//块的大小 为n/sqrt(m)
struct qy{//询问排序
	int l,r,id;
	bool operator <(const qy b) const{
		if((l-1)/unit!=(b.l-1)/unit)return (l-1)/unit<(b.l-1)/unit;
		if(((l-1)/unit)&1){
			return r<b.r;
		}
		return r>b.r;
	}
}q[N];

void add(int pos){//移动操作
	if(!book[a[pos]])cnt++;
	book[a[pos]]++;
}
void del(int pos){
	book[a[pos]]--;
	if(!book[a[pos]])cnt--;
}

while(r<q[i].r)add(++r);//先扩大，边界，再缩小，防止出现l>r+1 然后出现负数情况，set减不了
while(l>q[i].l)add(--l);//l为减了1~l-1的数，r为加上1~r的数
while(l<q[i].l)del(l++);
while(r>q[i].r)del(r--);
```

### 树链剖分

```cpp
int a[N],idx=0;
vector<int>vec[N];
int dep[N],ord[N],in[N],out[N],son[N],siz[N],top[N];
int n;
void dfs(int u,int fa){
	dep[u]=dep[fa]+1;fat[u]=fa;siz[u]=1;
	for(auto x:vec[u]){
		if(x==fa)continue;
		dfs(x,u);
		siz[u]+=siz[x];
		if(!son[u]||siz[son[u]]<siz[x])son[u]=x;
	}
}
void dfs2(int u,int fa,int p){
	in[u]=++idx;ord[idx]=u;top[u]=p;
	if(son[u])dfs2(son[u],u,p);
	for(auto x:vec[u]){
		if(x==fa||x==son[u])continue;
		dfs2(x,u,x);
	}
	out[u]=idx;
}
ll tree[N],lazy[N];
void pushup(int root){

}
void build(int root,int st,int ed){
	if(st==ed){
		
		return;
	}
	int mid=st+ed>>1;
	build(root<<1,st,mid);
	build(root<<1|1,mid+1,ed);
	pushup(root);
}
void pushdown(int root,int st,int ed){
	int mid=st+ed>>1;
	if(lazy[root]){

	}
}
void modify(int root,int st,int ed,int l,int r,int x){
	if(l<=st&&ed<=r){

		return;
	}
	pushdown(root,st,ed);
	int mid=st+ed>>1;
	if(mid>=l){
		modify(root<<1,st,mid,l,r,x);
	}
	if(mid<r){
		modify(root<<1|1,mid+1,ed,l,r,x);
	}
	pushup(root);
}
ll query(int root,int st,int ed,int l,int r){
	if(st>=l&&ed<=r){
		return tree[root];
	}
	pushdown(root,st,ed);
	int mid=st+ed>>1;
	ll ans=0;
	if(mid>=l){
		 //query(root<<1,st,mid,l,r);
	}
	if(mid<r){
		//query(root<<1|1,mid+1,ed,l,r);
	}
	pushup(root);
	return ans;
}
void add(int u,int v,int x){
	while(top[u]!=top[v]){
		if(dep[top[u]]<dep[top[v]])swap(u,v);
		modify(1,1,n,in[top[u]],in[u],x);
		u=fat[top[u]];
	}
	if(dep[u]<dep[v])swap(u,v);
	modify(1,1,n,in[v],in[u],x);
}
ll querty1(int u,int v){
	ll res=0;
	while(top[u]!=top[v]){
		if(dep[top[u]]<dep[top[v]])swap(u,v);
		res+=query(1,1,n,in[top[u]],in[u]);
		u=fat[top[u]];
	}
	if(dep[u]<dep[v])swap(u,v);
	res+=query(1,1,n,in[v],in[u]);
	return res;
}
```

### 单源最短路（djj）

```cpp
struct edge{
	int to,w;
};
int dis[N];
vector<edge>vec[N];
void djj(int s){
	priority_queue<pii,vector<pii>,greater<pii> >que;
	memset(dis,0x3f,sizeof dis);
	dis[s]=0;
	que.push({0,s});
	while(!que.empty()){
		int u=que.top().se;que.pop();
		if(vis[u])continue;
		vis[u]=1;
		for(auto x:vec[u]){
			if(dis[x.to]>dis[u]+x.w){
				dis[x.to]=dis[u]+x.w;
				que.push({dis[x.to],x.to});
			}
		}
	}
}
```

### 回滚莫队

个人认为，回滚莫队与普通莫队最大的区别就在于对左右端点是否在同一块内的讨论。

普通莫队对于左端点可以随意放置，因为在其while循环可以先进行右端点的扩大，进而可以防止产生因为临时的左端点大于右端点导致用set无法删除的这些情况。但对于回滚莫队来说，由于每一次左端点都要从所在块的右端点向左进行add，也就导致必然会先出现左端点大于右端点的情况，而解决方法便是选择直接暴力扫描即可。时间复杂度$O(n\sqrt{n})$。而左端点换块之后之所以r也要变成块的右端点是因为下一个块的所有r又重新排序从小到大，所以有可能出现r减少的情况。

因此我们可以得出回滚莫队的写法

1. 询问区间排序 注意 不能奇偶排序 因为左端点换块时，右端点必须重新来，否则可能会出现减的情况
2. 检测是否换块
3. 如果换块了，将莫队左端点变成新块右端点+1，莫队右端点变成新块右端点。
4. 没有换块则可以不用处理右端点，直接处理左端点。
5. 如果莫队左右端点在同块，直接暴力。并且莫队端点可以不用处理，和上次一样即可。
6. 如果不在同一块，则左端点向左扩展，得到到后再回滚到块的右端点。

### 珂朵莉树

```cpp
set<node>sett;sett.insert({1,n,1});
	auto split=[&](int x){//核心 将包含x的区间分成l~x-1和x~r并且返回x~r迭代器
		auto it=--sett.upper_bound({x,0,0});
		if(it->l==x)return it;
		int l=it->l,r=it->r,c=it->c;
		sett.erase(it);sett.insert({l,x-1,c});
		return sett.insert({x,r,c}).first;
	};
	//
	auto rt=split(r+1),lt=split(l);//本质上是将值相同的连续段分块
	for(;lt!=rt;lt++){//对每块处理
		
	}
	lt=split(l);
	sett.erase(lt,rt);//左闭右开区间删除   删除所有块
	sett.insert({l,r,c});//添加一个块
```

### 精确覆盖（舞蹈链）

```cpp
int L[N],R[N],U[N],D[N],col[N],row[N];
int first[505],siz[1005];
int idx;
int maxn;
struct DLX{
	void build(int n,int m){//先构建一行列标
		for(int i=0;i<=m;i++){
			L[i]=i-1;R[i]=i+1;U[i]=D[i]=i;
		}
		L[0]=m;R[m]=0;idx=m;
		memset(first,0,sizeof first);
		memset(siz,0,sizeof siz);
	}
	void insert(int r,int c){//插入一个元素，在第i行第c列
		idx++;
		row[idx]=r;col[idx]=c;siz[c]++;
		U[D[c]]=idx;D[idx]=D[c];D[c]=idx;U[idx]=c;//处理列链表
		if(first[r]==0){
			first[r]=L[idx]=R[idx]=idx;//新建行链表
		}
		else{	
			L[idx]=first[r];R[idx]=R[first[r]];L[R[first[r]]]=idx;R[first[r]]=idx;//处理行链表
		}
	}
	void remove(int c){//删除第c列
		R[L[c]]=R[c];L[R[c]]=L[c];
		for(int i=D[c];i!=c;i=D[i]){
			for(int j=R[i];j!=i;j=R[j]){
				U[D[j]]=U[j];D[U[j]]=D[j];siz[col[j]]--;
			}
		}
	}
	void recover(int c){//回复第c列
		for(int i=U[c];i!=c;i=U[i]){
			for(int j=L[i];j!=i;j=L[j]){
				D[U[j]]=j;U[D[j]]=j;siz[col[j]]++;
			}
		}
		R[L[c]]=L[R[c]]=c;
	}
	void dance(int d){//递归解
		if(d>=maxn)return;
		if(!R[0]){//得到解
			/*
			得到解后要做的操作
			*/
            if(d<maxn)maxn=d;
			return;
		}
		int c=R[0];
		for(int i=R[0];i!=0;i=R[i]){
			if(siz[i]<siz[c])c=i;
		}
		remove(c);
		for(int i=D[c];i!=c;i=D[i]){
			/*
			选择一个决策，产生的操作
			sta[d]=row[i];
			*/
			for(int j=R[i];j!=i;j=R[j]) remove(col[j]);
			dance(d+1);
			for(int j=L[i];j!=i;j=L[j]) recover(col[j]);
		}
		recover(c);
	}
}dlx;
```

### 重复覆盖

```cpp
int L[N],R[N],U[N],D[N],col[N],row[N];
int first[505],siz[1005],vis[1005];
int idx;
int maxn;
struct DLX{
	void build(int n,int m){//先构建一行列标
		for(int i=0;i<=m;i++){
			L[i]=i-1;R[i]=i+1;U[i]=D[i]=i;
		}
		L[0]=m;R[m]=0;idx=m;
		memset(first,0,sizeof first);
		memset(siz,0,sizeof siz);
	}
	void insert(int r,int c){//插入一个元素，在第i行第c列
		idx++;
		row[idx]=r;col[idx]=c;siz[c]++;
		U[D[c]]=idx;D[idx]=D[c];D[c]=idx;U[idx]=c;//处理列链表
		if(!first[r]){
			first[r]=L[idx]=R[idx]=idx;//新建行链表
		}
		else{	
			L[idx]=first[r];R[idx]=R[first[r]];L[R[first[r]]]=idx;R[first[r]]=idx;//处理行链表
		}
	}
	void remove(int c){//删除第c列
		//R[L[c]]=R[c];L[R[c]]=L[c];
		for(int i=D[c];i!=c;i=D[i]){//在重复覆盖中c并不是列标，需要空出来用于后面行循环
			L[R[i]]=L[i];R[L[i]]=R[i];siz[col[i]]--;
		}
	}
	void recover(int c){//回复第c列
		for(int i=U[c];i!=c;i=U[i]){
			R[L[i]]=L[R[i]]=i;siz[col[i]]++;
		}
		//R[L[c]]=L[R[c]]=c;
	}
	int h(){
		int res=0;
		memset(vis,0,sizeof vis);
		for(int i=R[0];i!=0;i=R[i]){
			if(vis[i])continue;
			res++;
			for(int j=D[i];j!=i;j=D[j]){
				for(int k=R[j];k!=j;k=R[k]){
					vis[col[k]]=1;
				}
			}
		}
		return res;
	}
	void dance(int d){//递归解
		if(d+h()>=maxn){
			return;
		}
		if(!R[0]){//得到解
			/*
			得到解后要做的操作
			*/
            if(d<maxn)maxn=d;
			return;
		}
		int c=R[0];
		for(int i=R[0];i!=0;i=R[i]){
			if(siz[i]<siz[c])c=i;
		}
		for(int i=D[c];i!=c;i=D[i]){
			/*
			选择一个决策，产生的操作
			sta[d]=row[i];
			*/
			remove(i);//删除i所在的列，但i的左右不能删用于下面循环
			for(int j=R[i];j!=i;j=R[j])remove(j);
			dance(d+1);
			for(int j=L[i];j!=i;j=L[j])recover(j);
			recover(i);
		}
	}
}dlx;
```

### CDQ分治

```cpp
struct node{
	int a,b,c;
	int id;int cnt;
}nd[N],nd2[N];
int idx=0;
node temp1[N],temp2[N];
int ans[N];
bool cmp(node &a,node &b){
	return a.b<b.b;
}
void CDQ(int l,int r){
	if(l>=r)return;
	int mid=l+r>>1;
	for(int i=l;i<=mid;i++){//左边
		temp1[i-l+1]=nd2[i];	
	}
	for(int i=mid+1;i<=r;i++){//右边
		temp2[i-mid]=nd2[i];
	}
	sort(temp1+1,temp1+mid-l+1+1,cmp);
	sort(temp2+1,temp2+r-mid+1,cmp);
	int p1=1,p2=1;
	while(r1<=r-mid){//双指针处理跨mid的计数
		while(p1<=mid-l+1&&temp1[p1].b<=temp2[p2].b){
			add(temp1[p1].c);p1++;
		}
		ans[temp2[p2].id]+=querry(temp2[p2].c);
		p2++;
	}
	for(int i=1;i<p1;i++){//取消掉双指针的操作
		tree[i]=0;	
	}
	CDQ(l,mid);CDQ(mid+1,r);
}
```

### 单源最短路(DJJ)

```cpp
struct edge{
	int to,w;
};
int dis[N];
vector<edge>vec[N];
void djj(int s){
	priority_queue<pii,vector<pii>,greater<pii> >que;
	memset(dis,0x3f,sizeof dis);
	dis[s]=0;
	que.push({0,s});
	while(!que.empty()){
		int u=que.top().se;que.pop();
		if(vis[u])continue;
		vis[u]=1;
		for(auto x:vec[u]){
			if(dis[x.to]>dis[u]+x.w){
				dis[x.to]=dis[u]+x.w;
				que.push({dis[x.to],x.to});
			}
		}
	}
}
```

### SAM map模板

```cpp
map<int,int>nex[N];
int link[N],len[N];
int siz[N];
int idx=1;
int last=1;
void sam_extend(int c){
	int cur=++idx;siz[cur]=1;
	len[cur]=len[last]+1;//增加一个新状态，长度为上一个+1
	int p=last;
	while(p&&!nex[p].count(c)){//向上遍历所有后缀链接，判断转移当前点
		nex[p][c]=cur;//如果没有c可以转移，那么p状态所有子串+c构成的子串加入到cur中
		p=link[p];
	}
	if(!p){//如果直到根都没有，直接link根
		link[cur]=1;
	}
	else{//遇到已经存在可以转移c的状态，说明p的所有子串+c构成的串的位置的集合!=cur的位置集合，那么考虑下面两种情况
		int q=nex[p][c];
		if(len[p]+1==len[q]){//如果q最长子串是由p+c构成的，那么cur可以直接link到q点，否则不满足link上所有子串是cur的子串这个条件
			link[cur]=q;
		}
		else{//如果不满足link条件，考虑将link分成两部分
			int clone=++idx;//克隆一份
			len[clone]=len[p]+1;//长度为p+1，保证cur能link上
			nex[clone]=nex[q];//子串一样能+c转移
			link[clone]=link[q];//原q的所有子串位置相同，那么link也应该相同
			while(p&&nex[p][c]==q){//将所有转移转到新的clone上
				nex[p][c]=clone;
				p=link[p];
			}
			link[cur]=link[q]=clone;
		}
	}
	last=cur;
}
```

### SAM 普通版

```cpp
int nex[N][27],link[N],len[N];//nex为转移，link为parent树，从根节点到cur链接成的parent树，是cur最长串的所有后缀。link越往上跳，当前字符串的后缀就越短，位置集合也就变大，也只有集合增加才能link上。
int siz[N];
int idx=1;//根节点为1，AC自动机的是0，不一样
int last=1;
void sam_extend(int c){
	int cur=++idx;//siz[cur]=1;
	len[cur]=len[last]+1;//增加一个新状态，长度为上一个+1
	int p=last;
	while(p&&!nex[p][c]){//向上遍历所有后缀链接，判断转移当前点
		nex[p][c]=cur;//如果没有c可以转移，那么p状态所有子串+c构成的子串加入到cur中
		p=link[p];
	}
	if(!p){//如果直到根都没有，直接link根
		link[cur]=1;
	}
	else{//遇到已经存在可以转移c的状态，说明p的所有子串+c构成的串的位置的集合!=cur的位置集合，那么考虑下面两种情况
		int q=nex[p][c];
		if(len[p]+1==len[q]){//如果q最长子串是由p+c构成的，那么cur可以直接link到q点，否则不满足link上所有子串是cur的子串这个条件
			link[cur]=q;
		}
		else{//如果不满足link条件，考虑将link分成两部分
			int clone=++idx;//克隆一份
			len[clone]=len[p]+1;//长度为p+1，保证cur能link上
			memcpy(nex[clone],nex[q],sizeof nex[q]);//子串一样能+c转移
			link[clone]=link[q];//原q的所有子串位置相同，那么link也应该相同，在没有添加c字符时候，clone和q的所有子串的出现的位置都是相同的，故当然可以link相同的，如果动态更新本质不同串时，由于更新q点时候已经将所有子串算了进去。此时算是将子串集合分成两部分，所以ans没必要重新统计
			while(p&&nex[p][c]==q){//将所有转移转到新的clone上
				nex[p][c]=clone;
				p=link[p];
			}
			link[cur]=link[q]=clone;
		}
	}
	last=cur;
}
```

### 广义SAM模板

```cpp
const int N=2000005;
int tree[N][27];
int fa[N];
char ch[N];
int id1=1;
void insert(string s){
	int u=1;
	for(auto x:s){
		if(!tree[u][x-'a'])tree[u][x-'a']=++id1,fa[id1]=u,ch[id1]=x-'a';
		u=tree[u][x-'a']; 
	}
}
struct GSAM{
	int nex[N][27],link[N],len[N];
	int siz[N],pos[N];//pos为trie树上对应节点所对应在SAM上的节点编号
	int idx=1;//在GSAM中SAM为tree上的fa节点
	int sam_extend(int c,int last){
		int cur=++idx;int p=last;
		len[cur]=len[last]+1;
		while(p&&!nex[p][c]){
			nex[p][c]=cur;
			p=link[p];
		}
		if(!p){
			link[cur]=1;
		}
		else{
			int q=nex[p][c];
			if(len[p]+1==len[q])link[cur]=q;
			else{
				int clone=++idx;
				len[clone]=len[p]+1;
				memcpy(nex[clone],nex[q],sizeof nex[q]);
				link[clone]=link[q];
				while(p&&nex[p][c]==q){
					nex[p][c]=clone;
					p=link[p];
				}
				link[cur]=link[q]=clone;
			}
		}
		return cur;
	}
	void build(){
		queue<int>que;
		for(int i=0;i<26;i++){
			if(tree[1][i])que.push(tree[1][i]);
		}
		pos[1]=1;
		while(!que.empty()){
			int u=que.front();que.pop();
			pos[u]=sam_extend(ch[u],pos[fa[u]]);//以trie树上的父亲节点为last
			for(int i=0;i<26;i++){
				if(tree[u][i])que.push(tree[u][i]);
			}
		}
	}
	ll getans(){//求本质不同串
		ll ans=0;
		for(int i=2;i<=idx;i++){
			ans=ans+len[i]-len[link[i]];
		}
		return ans;
	}
	void rdix_sort(){//基数排序求出现次数,从最长节点开始向上link传值
		int bask[N];int q[N];//q[i]表示排第i个的是第几个节点
		for(int i=1;i<=idx;i++)bask[len[i]]++;//最长就idx
		for(int i=1;i<=idx;i++)bask[i]+=bask[i-1];
		for(int i=1;i<=idx;i++)q[bask[len[i]]--]=i;
		for(int i=idx;i>=1;i--){
			siz[link[q[i]]]+=siz[q[i]];
		}
	}
}M1;
```

### 线性基

- 线性基内的不同组合异或处的数一定不同（但不说明一定异或得到的数一定在原集合内）
- 线性基的元素能相互异或得到原集合的元素的所有相互异或得到的值。（或得到任何一个值）
- 线性基是最小集合
- 线性基无法异或为0
- 线性基种每个元素最高位互不相同
- 每个线性基的元素被插入时的状态，一定是经过前面元素异或得到的，也就是说每个线性基元素都可以通过原集合异或得到

- 查询原集合内任意几个元素 xor 的最大值，就可以用线性基解决。
- 将线性基从高位向低位扫，若 xor 上当前扫到的 答案变大，就把答案异或上 。
- 为什么能行呢？因为从高往低位扫，若当前扫到第 位，意味着可以保证答案的第 位为 1，且后面没有机会改变第 位。
- 查询原集合内任意几个元素 xor 的最小值，就是线性基集合所有元素中最小的那个。
- 查询某个数是否能被异或出来，类似于插入，如果最后插入的数 被异或成了 0，则能被异或出来。

```cpp
inline void insert(long long x) {
  for (int i = 55; i + 1; i--) {
    if (!(x >> i))  // x的第i位是0
      continue;
    if (!p[i]) {
      p[i] = x;
      break;
    }
    x ^= p[i];
  }
}
```

### NTT

```cpp

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
```

### **建模技巧**：割断S-T通路的最小代价。

###### 1.**强制同属：x向y连容量为inf的有向边，表示节点x在S时节点y也必须在S，节点y在T时节点x也必须在T**。

那么如果节点x和节点y必须在同一侧，x向y连容量为inf的双向边。

需要时强制不同属，其中一个反过来就是强制同属了。

例题：Path

###### 2.强制同割：割断边x时，边y也必须割断。

利用强制同属的技巧，强制同割无非是x在S时y也必须在S，x'在T时y'也必须在T。

故x一侧向y一侧连容量为inf的有向边，y另一侧向x另一侧连容量为inf的有向边。

含义是割断x后还可以通过y到T，也就强制y必须割。

这种用法不止强制，可以给边加某个容量就可以代表不同割的代价了。（inf就是承受不起不同割的代价）

###### 3.**集合选一：集合点权体现为边权，连在一条链上**，最小割就是答案。

例题：切糕

###### 4.选择节点集合：**每个点向S和T连边，在S割表示选，在T割表示不选**。

最大权闭合子图就是一个例子，先默认正权全选，然后割在S说明选，割在T说明不选，这样代价就可以变正。

例题：NOI2006最大获利

###### 5.处理负权边：不能直接所有边加权，否则会破坏大小关系，只能从建图的角度考虑不影响决策的代价（比如所有点等）。

### **【二分图】**

###### **一个无向图是二分图的充要条件是不存在奇环。**

常用技巧：棋盘图**黑白染色**形成二分图&&网格**x-y**形成二分图。

S向左侧xi连边，右侧yi向T连边，边权全部为1。

###### 1.最大匹配=最大流

每一条流量为1的增广路对应一条匹配边，最大流就是最大匹配

###### 2.**最小覆盖集=最小割**

最小覆盖集是选择最少的点使每条边至少有一个端点被选中，即S-T的所有通路必须割断——最小割

###### 3.**最大独立集=总点数-最小覆盖集**

最大独立集和最小覆盖集互为补集，因为只要不选最小覆盖集的所有点，每条边就至少有一个点不被选中，即最大独立集。

同理，最大点权独立集=总权值-最小点权覆盖集。

###### 4.**最小路径覆盖**：在DAG找尽量少的路径，使每个节点恰好在一条路径上(点不相交)。

做法：将每个点x拆成x和x'分别放到二分图两部，如果u到v有一条边，则连边u,v`，然后二分图最大匹配。

初始未匹配ans=n即每个点单独为一条路径，匹配一条说明连了两点，ans-1，所以最终ans=N-最大匹配。

原理是在最小路径覆盖中，每个点都有一个后继节点，没有后继节点的节点就是链结尾，数量就是链数。

值得一提的是[BZOJ1143](http://www.cnblogs.com/onioncyc/p/7351220.html)中要求最小链覆盖，只要floyd传递闭包处理出可达信息之后，就是最小路径覆盖了。

###### 5.**二分图最大权匹配**：要求完美匹配就跑最小费用最大流，不要求完美匹配就跑最小费用流。

### **【最大权闭合子图】**

参考：[hiho 第119周 最大权闭合子图](http://www.cnblogs.com/TreeDream/p/5942354.html)

问题：给定带点权DAG，求最大点权和闭合子图。（闭合子图是原图的一个点集V，满足V中节点的后续节点也在V中）。

1.S向所有正权点连边，所有负权点向T连边，0不管，流量均为绝对值。保留原边，流量为正无穷。

2.对于正权点x，割掉与S的连边表示舍弃S，离开闭合子图。对于负权点y，割掉与T的连边表示舍弃T，加入闭合子图。

3.初始所有正权点都属于闭合子图，所有负权点都不属于闭合子图。对于每条S-T增广路代表原图一条起点为正权点终点为负权点的有向链，要么把负权点加入闭合子图，要么把正权点离开闭合子图。

最终，**最大权闭合子图=所有正权点之和-最小割**。

### DFS找环

- 此方法不适用一个节点有两个入点以上的图
- 首先一遍DFS，顺便标记vis，如果遇到已经被标记了的还不是fa节点，那么就出现环了。此时记录下来这个环两个端点。只需要再从一个端点开始DFS，用一个栈存下路径的点或者边就行。
- 或者不用DFS，可以采用并查集的形式来找环，也同样能找到两个点。
- 必须找到成环的两个点，从一个点开始跑。

### 欧拉回路

判断欧拉路：

1. 有两个奇数度的节点，为欧拉通路。那么路的两端必为两节点。
2. 全部节点为偶数度，那么必存在欧拉回路。那么起点为最小节点。

### DFS法（可以得到点集）

```cpp
#include<iostream>
#include<cstring>
#include<algorithm>
#include<vector>
using namespace std;
int mapp[505][505];
int m;
int du[505];
vector<int>vec;
void dfs(int x){
    for(int i=1;i<=501;i++){
        if(mapp[x][i]>0){
            mapp[x][i]--;
            mapp[i][x]--;
            dfs(i);
        }
    }
    vec.push_back(x);//放后面
}
int main(){
    cin>>m;
    int min1=501,min2=501;
    for(int i=1;i<=m;i++){
        int u,v;cin>>u>>v;
        mapp[u][v]++;
        mapp[v][u]++;
        du[u]++;
        du[v]++;
        min1=min(min1,min(u,v));
    }
    int cnt=0;
    for(int i=1;i<=501;i++){
        if(du[i]%2){
            cnt++;
            min2=min(min2,i);
        }
    }
    if(cnt==2){//欧拉通路
        dfs(min2);
    }
    else if(cnt==0){
        dfs(min1);
    }
    reverse(vec.begin(),vec.end());
    for(auto x:vec){
        cout<<x<<endl;
    }
    return 0;
}
```

### 套圈法（可以得到边集，点集）

```cpp
const int MAXV = 100 + 7;
const int MAXE = 100 * 100 + 7;
int head[MAXV];
int V, E;
typedef struct EdgeNode
{
    int to;
    int w;
    int next;
}edgeNode;
edgeNode Edges[MAXE];

bool visit[2 * MAXE];
stack<int> stv;
queue<int> quv;//点集
queue<int> que;//边集

void EulerDFS(int now)
{
    stv.push(now);//每访问一个点，就把该点压入栈
    for(int k = head[now]; k != -1; k = Edges[k].next)
    {
        if(!visit[k])
        {
            visit[k] = true;            //有向图每条边保存了两次，也要标记两次
            if(k & 1)
                visit[k + 1] = true;
            else
                visit[k - 1] = true;
            EulerDFS(Edges[k].to);
            que.push(k);//回溯时记录边
        }
    }
    quv.push(stv.top());//记录点
    stv.pop();
}

int main()
{
    scanf("%d%d", &V, &E);
    memset(head, -1, sizeof(head));
    for(int i = 1; i <= E; i++)
    {
        int u, v, w;
        scanf("%d%d%d", &u, &v, &w);
        Edges[2 * i - 1].to = v;                //双向储存边
        Edges[2 * i - 1].w = w;
        Edges[2 * i - 1].next = head[u];
        head[u] = 2 * i - 1;
        Edges[2 * i].to = u;
        Edges[2 * i].w = w;
        Edges[2 * i].next = head[v];
        head[v] = 2 * i;
    }
    memset(visit, false, sizeof(visit));
    EulerDFS(1);
    return 0;
}
```

### FFT/NTT分治

```cpp
void cdq(int l,int r){
    if(l==r)return;
    int mid=l+r>>1;
    cdq(l,mid);
    int len1=r-l+1;
    int len=1;
    while(len<len1)len<<=1;
    for(int i=0;i<len;i++)x1[i]=x2[i]=0;
    for(int i=l;i<=mid;i++)x1[i-l]=1ll*inv[i]*ans[i]%mod;
    for(int i=1;i<r-l+1;i++)x2[i]=a[i];
    ntt(x1,len,1);
    ntt(x2,len,1);
    for(int i=0;i<len;i++){
        x1[i]=1ll*x1[i]*x2[i]%mod;
    }
    ntt(x1,len,-1);
    for(int i=mid+1;i<=r;i++){
        ans[i]=(ans[i]+1ll*b[i-1]*x1[i-l]%mod)%mod;
    }
    cdq(mid+1,r);
}
```

### 树状数组套权值线段树

```cpp 
const int N=100005;
const int mod=1e9+7;
struct tree{
    int ls,rs,cnt;
}tr[N<<9];
int idx,n;
int idx1,idx2=0;
int fenwick[N];
int a[N];
int lowbit(int x){
    return x&(-x);
}
int temp[2][35];
//带修区间第k大
void insert(int &root,int st,int ed,int x,int c){
    if(!root)root=++idx;
    tr[root].cnt+=c;
    if(st==ed)return;
    int mid=st+ed>>1;
    if(x<=mid)insert(tr[root].ls,st,mid,x,c);
    else insert(tr[root].rs,mid+1,ed,x,c);
}
void add(int x,int val,int c){
    for(;x<=n;x+=lowbit(x)){
        insert(fenwick[x],1,1000000000,val,c);
    }
}
int query(int st,int ed,int k){
    if(st==ed)return st;
    int mid=st+ed>>1;
    int sum=0;
    for(int i=1;i<=idx1;i++)sum+=tr[tr[temp[0][i]].ls].cnt;
    for(int i=1;i<=idx2;i++)sum-=tr[tr[temp[1][i]].ls].cnt;
        //cout<<st<<' '<<ed<<' '<<sum<<endl;
    if(k<=sum){
        for(int i=1;i<=idx1;i++)temp[0][i]=tr[temp[0][i]].ls;
        for(int i=1;i<=idx2;i++)temp[1][i]=tr[temp[1][i]].ls;   
        return query(st,mid,k);
    }
    else{
        for(int i=1;i<=idx1;i++)temp[0][i]=tr[temp[0][i]].rs;
        for(int i=1;i<=idx2;i++)temp[1][i]=tr[temp[1][i]].rs;   
        return query(mid+1,ed,k-sum);
    }
}
int query1(int l,int r,int k){
    idx1=idx2=0;
    for(int i=r;i;i-=lowbit(i)){
        temp[0][++idx1]=fenwick[i];
    }
    for(int i=l-1;i;i-=lowbit(i)){
        temp[1][++idx2]=fenwick[i];
    }
    return query(1,1000000000,k);
}
```



### 虚树（关键点建树，树的缩点）

```cpp
int b[N];
int sta[N];
void build(int len){//实质是维护树的最右链，不断旋转
	sort(b+1,b+1+len,[&](int a,int b){
		return id[a]<id[b];
	});
	int top=1;sta[top]=1;g[1].clear();
	// 1 号节点入栈，清空 1 号节点对应的邻接表，设置邻接表边数为 1
	for(int i=1;i<=len;i++){
		if(b[i]!=1){
			// 如果 1 号节点是关键节点就不要重复添加
			int fa=lca(b[i],sta[top]);// 计算当前节点与栈顶节点的 LCA
			if(fa!=sta[top]){
				// 如果 LCA 和栈顶元素不同，则说明当前节点不再当前栈所存的链上
				while(id[fa]<id[sta[top-1]]){
					 // 当次大节点的 Dfs 序大于 LCA 的 Dfs 序
					g[sta[top-1]].push_back(sta[top]);top--;
					// 把与当前节点所在的链不重合的链连接掉并且弹出
				}
				if(id[fa]!=id[sta[top-1]]){
					// 如果 LCA 不等于次大节点（这里的大于其实和不等于没有区别）
					g[fa].clear();g[fa].push_back(sta[top]);sta[top]=fa;
					// 说明 LCA 是第一次入栈，清空其邻接表，连边后弹出栈顶元素，并将 LCA
				}
				else{
					//cout<<fa<<' '<<sta[top]<<endl;
					g[fa].push_back(sta[top--]);
					// 说明 LCA 就是次大节点，直接弹出栈顶元素
				}
			}
			g[b[i]].clear();sta[++top]=b[i];
			// 当前节点必然是第一次入栈，清空邻接表并入栈
		}
	}
	for(int i=1;i<top;i++){
		g[sta[i]].push_back(sta[i+1]); // 剩余的最后一条链连接一下
	}
	return;
}
```

### 数论分块

```cpp
long long H(int n) {
  long long res = 0;  // 储存结果
  int l = 1, r;       // 块左端点与右端点
  while (l <= n) {
    r = n / (n / l);  // 计算当前块的右端点
    res += (r - l + 1) * 1LL *
           (n / l);  // 累加这一块的贡献到结果中。乘上 1LL 防止溢出
    l = r + 1;  // 左端点移到下一块
  }
  return res;
}
```

求含有 $a1/i,a2/i,a3/i...$的和式时，数论分块右端点的表达式从一维的 $n/i$变为$min_{j=1}^{n}(a_j/i)$ ，即对于每一个块的右端点取最小（最接近左端点）的那个作为整体的右端点。可以借助下图理解：

![算法示意图](/images/posts/3e13b5eaba014935.svg)

一般我们用的较多的是二维形式，此时可将代码中 `r = n / (n / i)` 替换成 `r = min(n / (n / i), m / (m / i))`。

### 三分

```cpp
while (r - l > eps) {
  mid = (lmid + rmid) / 2;
  lmid = mid - eps;
  rmid = mid + eps;
  if (f(lmid) < f(rmid))
    r = mid;
  else
    l = mid;
}
```

### 树上启发式合并

```cpp
int ord[N],in[N],out[N],siz[N],big[N],dep[N];
int ans[N];
int maxn=0;
vector<int>vec[N];
void add(int u,int fa){
}
void del(int u){
}
void dfs(int u,int fa){
    in[u]=++idx;ord[idx]=u;siz[u]=1;
    dep[u]=dep[fa]+1;
    for(auto x:vec[u]){
        if(x==fa)continue;
        dfs(x,u);
        siz[u]+=siz[x];
        if(!big[u]||siz[x]>siz[big[u]])big[u]=x;
    }
    out[u]=idx;
}
void dfs1(int u,int fa,int op){
    for(auto x:vec[u]){
        if(x==fa||x==big[u])continue;
        dfs1(x,u,0);
    }
    if(big[u])dfs1(big[u],u,1);
    for(auto x:vec[u]){
        if(x==fa||x==big[u])continue;
        for(int i=in[x];i<=out[x];i++){
            add(ord[i]);
        }
    }
    add(u,u);
    ans[u]=maxn;
    if(op==0){
        for(int i=in[u];i<=out[u];i++){
            del(ord[i]);
        }
        maxn=0;
    }
}
```


