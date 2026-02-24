import requests
from bs4 import BeautifulSoup
import time
import csv
import json
import random

# スクレイピング対象のURL（例: 東京都のサウナ検索結果）
# 実際にはページネーションの処理などが必要です
TARGET_URL = "https://sauna-ikitai.com/search?prefecture[]=13"

def fetch_sauna_data():
    # ヘッダーを設定してブラウザからのアクセスに見せかける（重要）
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        print(f"Fetching data from: {TARGET_URL}")
        response = requests.get(TARGET_URL, headers=headers)
        response.raise_for_status() # エラーがあれば例外を発生させる

        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 施設リストを取得（クラス名はサイトの更新により変わる可能性があります）
        # ※以下は一般的な構造を想定した例です。実際のクラス名はDevToolsで確認が必要です。
        facilities = []
        
        # 検索結果の各カード要素を取得（仮のセレクタです）
        # 実際には 'div.p-saunaItem' などのクラスを探します
        sauna_items = soup.select('.p-saunaItem') 

        for item in sauna_items:
            # 施設名
            name_el = item.select_one('.p-saunaItem_name')
            name = name_el.text.strip() if name_el else "不明"

            # サ活数（「サ活」という文字を含む要素などから抽出）
            sakatsu_el = item.select_one('.p-saunaItem_sakatsu')
            sakatsu = sakatsu_el.text.strip() if sakatsu_el else "0"

            # イキタイ数
            ikitai_el = item.select_one('.p-saunaItem_ikitai')
            ikitai = ikitai_el.text.strip() if ikitai_el else "0"

            # エリア
            area_el = item.select_one('.p-saunaItem_area')
            area = area_el.text.strip() if area_el else "-"

            facilities.append({
                "name": name,
                "area": area,
                "sakatsu": sakatsu,
                "ikitai": ikitai
            })

        return facilities

    except Exception as e:
        print(f"Error: {e}")
        return []

def save_to_csv(data, filename="sauna_data.csv"):
    if not data:
        print("No data to save.")
        return

    keys = data[0].keys()
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data)
    print(f"Saved {len(data)} items to {filename}")

def save_to_json(data, filename="sauna_data.json"):
    if not data:
        return
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f"Saved {len(data)} items to {filename}")

if __name__ == "__main__":
    data = fetch_sauna_data()
    save_to_csv(data)
    save_to_json(data)
    # サーバー負荷軽減のため待機（連続アクセスする場合）
    time.sleep(random.uniform(1, 3))