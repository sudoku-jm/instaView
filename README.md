# instagram 연동 

netlify : https://keen-engelbart-e062a7.netlify.app/


#### 인스타그램 연동, 더보기 기능 만들기
- 최근 게시물 우선 불러오기
- 더보기(more)누르면 8개씩 불러오기
- 사진 클릭시 인스타그램 내용 텍스트 팝업으로 보기
- 인스타그램 내부 http , https로 시작하는 링크 태그로 따로 나누기
- 텍스트 

#### 인스타토큰 넣는 곳
```
function instaCallData(){  
  token = "YOUR TOKEN"; // 여기!  
  size = 0;  
  count = 8;  
  instaCallList(size,count);  
}

```
