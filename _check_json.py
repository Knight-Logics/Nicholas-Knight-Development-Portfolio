import json
for fn in ['knightlogics.json','gallagher.json','knightlogics-rerun.json']:
    try:
        data = json.load(open(r'E:\KnightLogics-Growth-System\MainSite\\'+fn, encoding='utf-8'))
        print(fn, list(data.keys())[:3], data.get('requestedUrl','N/A'))
    except Exception as e:
        print(fn, str(e)[:80])
