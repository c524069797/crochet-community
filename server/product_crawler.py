#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
产品封面图爬虫
使用Unsplash API获取产品图片
"""

import sqlite3
import requests
import time
import os
from urllib.parse import quote

# 数据库路径
DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'crochet.db')

# Unsplash API
UNSPLASH_ACCESS_KEY = 'demo'  # 使用demo模式

def get_image_from_unsplash(keyword, category):
    """
    使用Picsum Photos获取占位图
    """
    try:
        # 根据产品ID生成不同的图片
        # 使用Picsum Photos API
        import hashlib
        # 使用关键词生成一个数字ID
        hash_id = int(hashlib.md5(keyword.encode()).hexdigest()[:8], 16) % 1000

        url = f'https://picsum.photos/seed/{hash_id}/400/400'

        return url
    except Exception as e:
        print(f'  获取图片失败: {e}')
        return None

def update_product_images():
    """
    更新产品表中的图片URL
    """
    print('=== 开始更新产品封面图 ===\n')

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 获取所有产品
    cursor.execute('SELECT id, name, category FROM products')
    products = cursor.fetchall()

    print(f'找到 {len(products)} 个需要更新的产品\n')

    updated = 0
    for product_id, name, category in products:
        print(f'处理: {name}')

        # 获取图片
        image_url = get_image_from_unsplash(name, category)

        if image_url:
            # 更新数据库
            cursor.execute('UPDATE products SET image_url = ? WHERE id = ?', (image_url, product_id))
            print(f'  ✓ 已更新图片: {image_url}')
            updated += 1
        else:
            print(f'  ✗ 未找到图片')

        # 延时避免请求过快
        time.sleep(0.5)
        print()

    conn.commit()
    conn.close()

    print(f'=== 完成！共更新 {updated}/{len(products)} 个产品封面图 ===')

if __name__ == '__main__':
    update_product_images()
