import numpy as np, wave, os
from scipy.signal import lfilter
STYLE=os.environ['STYLE']; T=float(os.environ['T']); DROP=float(os.environ['DROP']); OUT=os.environ['OUT']
sr=44100; N=int(sr*T); L=np.zeros(N); R=np.zeros(N); SEED=int(os.environ.get('SEED','0')); TR=int(os.environ.get('TRASP','0'))
rng=np.random.default_rng(SEED or (11 if STYLE=='energia' else 23))
def put(sig,t,pan=0.0,g=1.0):
    i=int(round(t*sr)); n=min(len(sig),N-i)
    if n<=0 or i<0: return
    L[i:i+n]+=sig[:n]*g*(1-max(0,pan)); R[i:i+n]+=sig[:n]*g*(1+min(0,pan))
def lp(x,a): return lfilter([a],[1,-(1-a)],x)
def hp(x,a): return x-lp(x,a)
def saw(f,t): return 2*((f*t)%1)-1
def sq(f,t): return np.sign(np.sin(2*np.pi*f*t))
mf=lambda m:440*2**((m+TR-69)/12)
tt=lambda d: np.arange(int(sr*d))/sr
# intro riser into the drop + impact exactly at DROP
rt=tt(DROP); riser=hp(rng.standard_normal(len(rt)),0.2)*(rt/DROP)**2.5*0.3
sweep=np.sin(2*np.pi*np.cumsum(200+1800*(rt/DROP)**2)/sr)*(rt/DROP)**2*0.08
put(riser+sweep,0)
it=tt(1.4)
impact=np.sin(2*np.pi*(40+140*np.exp(-it*20))*it)*np.exp(-it*3.5)*0.95+hp(rng.standard_normal(len(it)),0.3)*np.exp(-it*10)*0.3
put(impact,DROP)
side=np.ones(N)
if STYLE=='energia':
    bpm=140; b=60/bpm
    kt=tt(0.35); kick=np.sin(2*np.pi*(52+150*np.exp(-kt*40))*kt)*np.exp(-kt*9)
    st=tt(0.3); sn=hp(rng.standard_normal(len(st)),0.25)*np.exp(-st*16)*0.45+np.sin(2*np.pi*190*st)*np.exp(-st*25)*0.35
    ht=tt(0.04); hat=hp(rng.standard_normal(len(ht)),0.7)*np.exp(-ht*110)*0.11
    prog=[(50,[62,65,69]),(46,[58,62,65]),(53,[57,60,65]),(48,[55,60,64])]  # Dm Bb F C
    beats=int((T-DROP)/b)+1
    for k in range(beats):
        t=DROP+k*b; bar=k//4
        put(kick,t,g=0.9)
        if k%4 in (1,3): put(sn,t)
        for q in range(4): put(hat,t+q*b/4,pan=0.3 if q%2 else -0.3,g=0.6 if q%2 else 1.0)
        if bar%4==3 and k%4==3:
            for q in range(4): put(sn*0.7,t+q*b/4)
    for bi in range(int((T-DROP)/(4*b))+1):
        root,ch=prog[bi%4]; t0=DROP+bi*4*b
        # power-saw riff: root+fifth 8ths with accent pattern
        pat=[1,0,1,1,0,1,1,0]
        for e,on in enumerate(pat):
            if not on: continue
            d=tt(b/2*0.95); f=mf(root)
            ps=(saw(f,d)+saw(f*1.5,d)+0.5*saw(f*2,d))
            ps=np.tanh(lp(ps,0.2)*2.5)*np.exp(-d*5)*0.16
            put(ps,t0+e*b/2,pan=-0.25); put(ps*0.9,t0+e*b/2+0.008,pan=0.25)
        # sub bass
        d=tt(4*b); put(np.sin(2*np.pi*mf(root-12)*d)*np.minimum(1,d*30)*np.minimum(1,(4*b-d)*20)*0.22,t0)
        # 16th arp from bar 2
        if bi>=1:
            arp=[ch[0]+12,ch[1]+12,ch[2]+12,ch[1]+12]*4
            for e,m in enumerate(arp):
                d=tt(b/4); a=lp(sq(mf(m),d),0.3)*np.exp(-d*14)*0.045
                put(a,t0+e*b/4,pan=0.4 if e%2 else -0.4)
elif STYLE=='grinta':  # half-time trap workout
    bpm=100; b=60/bpm
    kt=tt(0.9)
    def k808(f): return np.sin(2*np.pi*np.cumsum(f*(1+2*np.exp(-kt*30)))/sr)*np.exp(-kt*2.2)
    ct=tt(0.3); clap=hp(rng.standard_normal(len(ct)),0.2)*np.exp(-ct*18)*0.5
    ht=tt(0.035); hat=hp(rng.standard_normal(len(ht)),0.75)*np.exp(-ht*130)*0.12
    prog=[(52,[64,67,71]),(48,[60,64,67]),(55,[62,67,71]),(50,[62,66,69])]  # Em C G D
    bars=int((T-DROP)/(4*b))+1
    for bi in range(bars):
        root,ch=prog[bi%4]; t0=DROP+bi*4*b
        f=mf(root-24)
        for pos in (0,1.5,2.5):  # 808 pattern in beats
            put(np.tanh(k808(f)*1.8)*0.55,t0+pos*b)
        put(clap,t0+1*b); put(clap,t0+3*b)
        for e in range(8):
            roll = (bi%2==1 and e in (6,7))
            if roll:
                for q in range(3): put(hat,t0+e*b/2+q*b/6,g=0.8)
            else: put(hat,t0+e*b/2,pan=0.2 if e%2 else -0.2)
        # brass-like stabs on 1 and the "and" of 2
        for pos in (0,1.5):
            d=tt(0.35); stab=sum(saw(mf(m),d)+saw(mf(m)*1.004,d) for m in ch)
            stab=lp(stab,0.12)*np.exp(-d*6)*0.05
            put(stab,t0+pos*b,pan=-0.2); put(stab,t0+pos*b+0.01,pan=0.2)
        # dark pad
        d=tt(4*b); pad=sum(np.sin(2*np.pi*mf(m-12)*d) for m in ch)*np.minimum(1,d*2)*np.minimum(1,(4*b-d)*4)*0.03
        put(pad,t0)
        # bell melody bars 2+
        if bi>=1:
            mel=[ch[2]+12,ch[1]+12,ch[0]+12,ch[1]+12]
            for e,m in enumerate(mel):
                d=tt(0.5); bell=(np.sin(2*np.pi*mf(m)*d)+0.4*np.sin(2*np.pi*mf(m)*2.76*d))*np.exp(-d*6)*0.06
                put(bell,t0+e*b,pan=0.3)

elif STYLE=='epica':  # cinematico sportivo: tamburi, archi pulsanti, 90 bpm
    bpm=90; b=60/bpm
    tt_=tt(0.6)
    def tom(f): return np.sin(2*np.pi*np.cumsum(f*(1+1.5*np.exp(-tt_*25)))/sr)*np.exp(-tt_*5)
    st=tt(0.4); snare=hp(rng.standard_normal(len(st)),0.15)*np.exp(-st*10)*0.5
    prog=[(45,[57,60,64]),(41,[53,57,60]),(48,[55,60,64]),(43,[55,59,62])]  # Am F C G
    bars=int((T-DROP)/(4*b))+1
    for bi in range(bars):
        root,ch=prog[bi%4]; t0=DROP+bi*4*b
        for pos,f,g in ((0,70,1.0),(0.75,90,0.6),(1.5,70,0.8),(2,110,0.7),(2.5,90,0.6),(3,70,0.9),(3.5,130,0.6)):
            put(np.tanh(tom(f)*1.5)*0.5*g,t0+pos*b,pan=(f-100)/200)
        put(snare,t0+2*b)
        for e in range(16):  # archi in sedicesimi
            d=tt(b/4*0.9); m=ch[e%3]
            s_=lp(saw(mf(m),d)+saw(mf(m)*1.003,d),0.15)*np.minimum(1,d*80)*np.exp(-d*3)*0.035
            put(s_,t0+e*b/4,pan=0.35 if e%2 else -0.35)
        d=tt(4*b); put(np.sin(2*np.pi*mf(root-12)*d)*np.minimum(1,d*4)*np.minimum(1,(4*b-d)*4)*0.25,t0)
        if bi>=1:
            d=tt(4*b); brass=sum(lp(saw(mf(m+12),d),0.05) for m in ch)*np.minimum(1,d*1.5)*np.minimum(1,(4*b-d)*3)*0.02
            put(brass,t0)
elif STYLE=='ritmo':  # funk/disco da allenamento, 115 bpm
    bpm=115; b=60/bpm
    kt=tt(0.3); kick=np.sin(2*np.pi*(55+120*np.exp(-kt*35))*kt)*np.exp(-kt*10)
    ct=tt(0.25); clap=hp(rng.standard_normal(len(ct)),0.2)*np.exp(-ct*20)*0.4
    ht=tt(0.12); ohat=hp(rng.standard_normal(len(ht)),0.6)*np.exp(-ht*25)*0.12
    prog=[(52,[64,67,71,74]),(57,[64,69,72,76]),(50,[62,66,69,72]),(55,[62,67,71,74])]  # Em7 Am7 D7 G
    beats=int((T-DROP)/b)+1
    for k in range(beats):
        t=DROP+k*b
        put(kick,t,g=0.9)
        if k%2==1: put(clap,t)
        put(ohat,t+b/2,pan=0.25)
    for bi in range(int((T-DROP)/(4*b))+1):
        root,ch=prog[bi%4]; t0=DROP+bi*4*b
        line=[0,0,12,0,7,0,10,12]  # basso funky in ottavi
        for e,iv in enumerate(line):
            d=tt(b/2*0.8); f=mf(root-12+iv)
            put(lp(sq(f,d),0.2)*np.exp(-d*6)*0.22,t0+e*b/2)
        for pos in (0.5,1.5,2.5,3.25):  # accordi di piano elettrico sul levare
            d=tt(0.3); ep=sum(np.sin(2*np.pi*mf(m)*d)+0.3*np.sin(2*np.pi*2*mf(m)*d) for m in ch)*np.exp(-d*9)*0.04
            put(ep,t0+pos*b,pan=-0.2)
        if bi>=1:
            for e in range(8):
                d=tt(b/2*0.7); m=ch[(e*3)%4]+12
                put(lp(saw(mf(m),d),0.3)*np.exp(-d*10)*0.04,t0+e*b/2,pan=0.3)
# master
fade=int(sr*2.0)
for c in (L,R): c[-fade:]*=np.linspace(1,0,fade)
m=max(np.abs(L).max(),np.abs(R).max())
L=np.tanh(L/m*1.7)/np.tanh(1.7)*0.89; R=np.tanh(R/m*1.7)/np.tanh(1.7)*0.89
s=np.empty(2*N,np.int16); s[0::2]=(L*32767).astype(np.int16); s[1::2]=(R*32767).astype(np.int16)
with wave.open(OUT,'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(s.tobytes())
print('ok',STYLE)
