"""Praamix page version of a day's caption: page voice, credits Prashant.
Usage: python page_caption.py <day>   (run with PYTHONIOENCODING=utf-8)"""
import re, sys
d = int(sys.argv[1])
s = open(f'posts/day-{d:02d}.md', encoding='utf8').read()
m = re.search(r'```\n(.*?)```', s, re.S)
t = (m.group(1) if m else re.sub(r'^# .*\n+', '', s)).strip()
t = t.replace('Tell me why', 'Tell us why')
t = re.sub(r'^Day 1 of 30\..*$', 'Day 1 of 30. Every day this month, our founder Prashant Gupta explains one game-dev concept, animated.', t, flags=re.M)
t = re.sub(r'^Day (\d+) of 30\.$', r'Day \1 of 30 · Game Dev in 30 Days, a daily series by our founder Prashant Gupta.', t, flags=re.M)
print(t)
