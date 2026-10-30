import numpy as np, wave
sr=44100; bpm=128; b=60/bpm; T=float(__import__('os').environ.get('T','31.6')); N=int(sr*T)
L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(3)
def put(sig,t,pan=0.0,g=1.0):
    i=int(t*sr); n=min(len(sig),N-i)
    if n<=0 or i<0: return
    L[i:i+n]+=sig[:n]*g*(1-max(0,pan)); R[i:i+n]+=sig[:n]*g*(1+min(0,pan))
def lp(x,a):  # one-pole lowpass, a in (0,1)
    y=np.zeros_like(x); acc=0.0
    for k in range(len(x)): acc+=a*(x[k]-acc); y[k]=acc
    return y
def saw(f,t): return 2*((f*t)%1)-1
start=float(__import__("os").environ.get("DROP","1.33"))  # beat drop when first scene appears
# --- intro riser (noise sweep) + impact
rt=np.arange(int(sr*start))/sr
riser=rng.standard_normal(len(rt))*(rt/start)**2*0.25
riser=lp(riser,0.05)+lp(riser,0.3)*0.4
put(riser,0)
it=np.arange(int(sr*1.2))/sr
impact=np.sin(2*np.pi*(45+120*np.exp(-it*18))*it)*np.exp(-it*4)*0.9+rng.standard_normal(len(it))*np.exp(-it*14)*0.25
put(impact,start)
# --- drums
kt=np.arange(int(sr*0.4))/sr
kick=np.sin(2*np.pi*(48+160*np.exp(-kt*35))*kt)*np.exp(-kt*7)
kick+=0.25*np.sin(2*np.pi*3000*kt)*np.exp(-kt*400)
ct=np.arange(int(sr*0.25))/sr
clapn=rng.standard_normal(len(ct))
clap=(clapn-lp(clapn,0.08))*np.exp(-ct*22)*0.35
ht=np.arange(int(sr*0.05))/sr
hn=rng.standard_normal(len(ht)); hat=(hn-lp(hn,0.6))*np.exp(-ht*90)*0.12
ot=np.arange(int(sr*0.22))/sr
on=rng.standard_normal(len(ot)); ohat=(on-lp(on,0.5))*np.exp(-ot*14)*0.13
beats=int((T-start)/b)
env_side=np.ones(N)  # sidechain envelope
for k in range(beats):
    t=start+k*b
    bar=k//4
    put(kick,t,g=0.95)
    i=int(t*sr); n=min(int(sr*b),N-i)
    if n>0:
        st=np.arange(n)/sr; env_side[i:i+n]=np.minimum(env_side[i:i+n],0.25+0.75*np.minimum(1,st/(b*0.6)))
    if k%2==1: put(clap,t,g=1.0)
    put(ohat,t+b/2,pan=0.2)
    for q in (0.25,0.75): put(hat,t+b*q,pan=-0.25,g=0.8)
    # fill at end of every 8 bars
    if bar%8==7 and k%4==3:
        for q in range(4): put(clap*0.6,t+b*q/4)
# --- harmony: Am F C G (uplifting), bars of 4 beats
prog=[(57,[57,60,64]),(53,[53,57,60]),(48,[52,55,60]),(55,[55,59,62])]
mf=lambda m:440*2**((m-69)/12)
bars=int((T-start)/(4*b))+1
for bi in range(bars):
    root,ch=prog[bi%4]; t0=start+bi*4*b
    seg=np.arange(int(sr*4*b))/sr
    # supersaw pad
    pad=np.zeros(len(seg))
    for m in ch:
        for det in (-0.12,0,0.12):
            pad+=saw(mf(m+12)*(1+det/100*5),seg)
    pad=lp(pad,0.06)*0.022*np.minimum(1,seg*8)
    put(pad,t0,pan=-0.3); put(pad,t0+0.012,pan=0.3)
    # bass 8ths
    for e in range(8):
        bt=np.arange(int(sr*b/2*0.9))/sr
        f=mf(root-12)
        bs=lp(saw(f,bt)+0.5*np.sin(2*np.pi*f*bt),0.12)*np.exp(-bt*4)*0.28
        put(bs,t0+e*b/2)
    # pluck arpeggio from bar 2 on
    if bi>=2:
        notes=[ch[0]+12,ch[1]+12,ch[2]+12,ch[1]+12,ch[0]+24,ch[2]+12,ch[1]+12,ch[2]+12]
        for e,m in enumerate(notes*2):
            pt=np.arange(int(sr*0.25))/sr
            pl=lp(saw(mf(m),pt)*np.exp(-pt*16),0.25)*0.07
            put(pl,t0+e*b/4,pan=0.35 if e%2 else -0.35)
# apply sidechain to everything after drop except drums? approximate: apply to whole mix gently
side=0.55+0.45*env_side
L*=side; R*=side
# master
fade=int(sr*2.0)
for ch_ in (L,R): ch_[-fade:]*=np.linspace(1,0,fade)
m=max(np.max(np.abs(L)),np.max(np.abs(R)))
L=np.tanh(L/m*1.6)/np.tanh(1.6)*0.89; R=np.tanh(R/m*1.6)/np.tanh(1.6)*0.89
st=np.empty(2*N,dtype=np.int16); st[0::2]=(L*32767).astype(np.int16); st[1::2]=(R*32767).astype(np.int16)
with wave.open(__import__("os").environ.get("OUT","reel/musica2.wav"),'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(st.tobytes())
print('ok')
