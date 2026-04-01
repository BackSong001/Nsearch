import urllib.request
import urllib.parse
import json

def search_naver_kin():
    # 1. 사용자로부터 검색어 입력 받기
    search_keyword = input("원하시는 검색어를 입력하세요: ")

    # 애플리케이션 등록 시 발급받은 정보 입력
    client_id = "AXQCbpWsl_FlBIBh9S6O" 
    client_secret = "B5WN6u2J4O" 

    # 2. 입력받은 검색어를 URL 인코딩하여 쿼리에 결합
    enc_text = urllib.parse.quote(search_keyword)
    
    # 지식iN 검색 API 엔드포인트 (가져올 개수를 display 파라미터로 조절)
    url = f"https://openapi.naver.com/v1/search/kin?query={enc_text}&display=5"

    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id", client_id)
    request.add_header("X-Naver-Client-Secret", client_secret)

    try:
        response = urllib.request.urlopen(request)
        rescode = response.getcode()

        if rescode == 200:
            response_body = response.read()
            # JSON 데이터를 파이썬 딕셔너리로 변환
            data = json.loads(response_body.decode('utf-8'))
            
            print("\n검색 결과:")
            for idx, item in enumerate(data['items'], start=1):
                print("-" * 60)
                # API는 검색된 단어를 <b> 태그로 감싸서 반환하므로 이를 제거
                title = item['title'].replace('<b>', '').replace('</b>', '')
                description = item['description'].replace('<b>', '').replace('</b>', '')
                link = item['link']
                
                print(f"[{idx}] 제목: {title}")
                print(f"    요약: {description}")
                print(f"    링크: {link}")
            print("-" * 60)
        else:
            print("Error Code:" + str(rescode))
            
    except Exception as e:
        print(f"요청 중 오류가 발생했습니다: {e}")

# 함수 실행
if __name__ == "__main__":
    search_naver_kin()
