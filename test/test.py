import requests
import urllib.parse
import html

def search_naver_kin(keyword, display=100):
    # 발급받은 ID와 Secret 입력
    client_id = "AXQCbpWsl_FlBIBh9S6O"
    client_secret = "B5WN6u2J4O"
    
    # 한글 검색어를 URL 인코딩
    enc_text = urllib.parse.quote(keyword)
    
    # 지식iN 검색 API 엔드포인트 (JSON 응답, 정확도순 정렬, 최대 100개)
    url = f"https://openapi.naver.com/v1/search/kin.json?query={enc_text}&display={display}&sort=sim"
    
    # 네이버 API 필수 헤더 설정
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"'{keyword}' 검색 결과 총 {data['total']}건 중 {len(data['items'])}건 출력:\n")
        
        for i, item in enumerate(data['items'], 1):
            # 네이버 API는 검색어에 <b> 태그를 붙여서 반환하므로 제거 및 HTML 엔티티 변환
            title = html.unescape(item['title'].replace('<b>', '').replace('</b>', ''))
            description = html.unescape(item['description'].replace('<b>', '').replace('</b>', ''))
            link = item['link']
            
            print(f"[{i}] 제목: {title}")
            print(f"    요약: {description}")
            print(f"    링크: {link}")
            print("-" * 60)
    else:
        print(f"API 호출 에러 발생: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    # 사람들이 필요로 하는 서비스나 앱을 찾기 위한 예시 검색어
    search_keyword = "앱 만들어주세요" 
    search_naver_kin(search_keyword)
