import requests

STRAPI_URL = "http://api.lussogroupgeo.com/api/tables"
STRAPI_TOKEN = "41b2899de5746454bbda6e629d631eb6d98671b212b5305dedab73dde9ee9d5a9ea693f33111f7c4a54d73c4e922841ba9cf151536d8021077dcfc183d1346c1bc4f6efa7cd0f052582911427e230141921adeb85f831e20fbc4cc1efe6494a05db021da3cb2ab08ad6d2ab011082dda345b3636fff48249044ff526ccabf903"

headers = {"Authorization": f"Bearer {STRAPI_TOKEN}"}
res = requests.get(STRAPI_URL, headers=headers, params={"pagination[pageSize]": 100})
for item in res.json()["data"]:
    del_res = requests.delete(f"{STRAPI_URL}/{item['id']}", headers=headers)
    print(f"Deleted id {item['id']}: {del_res.status_code}") 