import sys,re
d=int(sys.argv[1]); s=open(f'day-{d:02d}.md',encoding='utf8').read()
m=re.search(r'```\n(.*?)```',s,re.S)
t=m.group(1) if m else re.sub(r'^# .*\n+','',s)
print(t.strip())
