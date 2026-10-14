import sys,collections,json,re,os
sys.stdout.reconfigure(encoding='utf-8')
D=sys.argv[1]
def load(p):
    el=collections.defaultdict(set); name={}; par=collections.defaultdict(set)
    for l in list(open(f'{D}/{p}_element_parts.txt',encoding='utf8'))[1:]:
        c,n,f=l.rstrip('\n').split('\t'); el[c].add(f); name[c]=n
    for l in list(open(f'{D}/{p}_inclusion_relation_list.txt',encoding='utf8'))[1:]:
        a,an,b,bn=l.rstrip('\n').split('\t'); par[b].add(a); name[a]=an; name[b]=bn
    return el,name,par
E={}
for p in ('isa','partof'):
    E[p]=load(p)
# element -> own concept: smallest concept containing it with exactly 1 element
own={}; 
for p in ('isa','partof'):
    el,name,par=E[p]
    for c,s in el.items():
        if len(s)==1:
            f=next(iter(s)); own.setdefault(f,(c,name[c]))
def anc(p,c):
    el,name,par=E[p]; seen=set(); st=[c]
    while st:
        x=st.pop()
        for y in par[x]:
            if y not in seen: seen.add(y); st.append(y)
    return {name[x] for x in seen}
files=sorted(os.listdir(f'{D}/isa/isa_BP3D_4.0_obj_99'))
out=[]
for fn in files:
    f=fn[:-4]
    c,n=own.get(f,(None,None))
    if not c:
        # header concept
        h=open(f'{D}/isa/isa_BP3D_4.0_obj_99/{fn}',encoding='utf8',errors='ignore').read(800)
        m=re.search(r'Concept ID : (\S+)',h); c=m.group(1) if m else '?'
        n=E['isa'][1].get(c) or E['partof'][1].get(c) or '?'
    A=anc('isa',c)|anc('partof',c)|{n}
    s=' | '.join(sorted(A)).lower()
    out.append(dict(file=f,fma=c,name=n,anc=s))
json.dump(out,open(sys.argv[2],'w',encoding='utf8'))
print(len(out), sum(1 for o in out if o['name']=='?'))
