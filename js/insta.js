$(document).ready(function(){

instaDom();      // Dom 호출
instaCallData(); // 인스타 데이터 Ajax로 가져오기 (리스트 먼저 뿌려줌)


  //리스트 클릭시 팝업 노출(s)
  $(document).on('click','.list_insta li',function(){
    var txt = $(this).find('p').text();            //인스타 게시글 텍스트 담기.
    $insta_pop.empty();                           // 클릭시 레이어팝업 비워줌
    
    // http 문장만 뽑기 이벤트 실행
    var httpSlice = new Array();                  //최종적으로 http 문장만 담기는 곳.
    httpSlice = httpLinkSplitEvent(txt);
  //  httpSliceTxtView(httpSlice);                  //http 문장만 뽑아서 뿌려주기
      
    // 인스타 게시글
    var txtEnterLine = instaTxtSplitEnter(txt); // 텍스트 개행문자 행렬로 구분
  //  instaTxtView(txtEnterLine);                 //p태그에 각자 담아 뿌려줌.

  instaTxtResultView(httpSlice,txtEnterLine);
    //클릭시 팝업 열기
    $layer_pop.addClass('on');
  }); //리스트 클릭시 팝업 노출(e)

  //팝업 닫기
  $layer_pop.on('click',function(e){
    var target = $(e.target);
    if(target.is('section')){
      $layer_pop.removeClass('on');
    }
  });

  $layer_btn_close.on('click',function(e){
    $layer_pop.removeClass('on');
  });


  $('.more').on('click',function(){
    //인스타 전체 데이터 수(totalLength) > 불러올 수(count)
    if(totalLength > count){
      size += cntNum;  // 불러올 시작 순서
      count += cntNum; // 8개씩 추가
      instaCallList(size,count);
    }
  });



});



var $list_insta;
var $layer_pop,$insta_pop;
var count,size,totalLength,cntNum;
var token;
var txtHttps,txtHttp,enterStr;


//dom초기화
function instaDom(){
  $list_insta = $('.list_insta');
  $layer_pop = $('.layer_pop');
  $insta_pop = $('.insta_pop');
  $layer_btn_close = $('.layer_btn_close');

  txtHttps = "https://";
  txtHttp = "http://";
  enterStr = '\n';   //엔터(개행문자) 정규식
  size = 0;
  count = 0;
  cntNum = 8; // 숫자 8
}
//인스타그램 AJAX
function instaCallData(){
  token = "YOUR TOKEN";
  size = 0;
  count = 8;
  instaCallList(size,count);
}

function instaCallList(size,count){
  $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: "https://graph.instagram.com/me/media?access_token=" + token + "&fields=id,caption,media_type,media_url,thumbnail_url,permalink",
      success: function(response) {
        //데이터 유형보기   
        //console.log(response);
           

          totalLength = response.data.length; //인스타 전체 데이터 수 

          if(totalLength < cntNum){ // 인스타 데이터가 8개 미만 더보기 안보임
            $('.more').hide();
          }else if(count >= totalLength){ //데이터를 다 불러오면 더보기 안보임
            $('.more').hide();
          }
          
          if (response.data != undefined && response.data.length > 0) {
              //console.log(size , count);
              for(size ; size < count; size++){
                  if(response.data[size]){
                      var item = response.data[size];
                      var image_url = "";
                      
                      if(item.media_type === "VIDEO"){
                          image_url = item.thumbnail_url;
                      }else{
                          image_url = item.media_url;							
                      }

                    
                      $list_insta.append(
                        $('<li>').append(
                          $('<a>').attr({'class':'open_layer'}).attr({'target':'_blank','title':'_TIMESTAMP_NOW인스타열림'}).append(
                            $('<img>').attr({
                              'src':image_url,
                              'class':'thumnail'
                            })
                          ).append(
                            $('<div>').addClass('insta_txt').append(
                              $('<p>').text(item.caption)
                            )
                          )
                        )
                      ) //데이터 불러와서 셋팅(최신 데이터순으로 보임)
                  }  

                  
              }
              // $list_insta.after(
              //   $('<a>').attr('title','더보기').text('더보기').addClass('more')
              // )

          }else{
              // if api error
              console.log('데이터를 불러올 수가 없습니다 ㅠㅠ');
          }

      },
      error :function(){
        console.log('데이터를 불러올 수가 없습니다 ㅠㅠ');
      }
      
  });
}


// 인스타 게시글 가져오기
function instaTxtSplitEnter(txt){
  var txtEnterLine = txt;
  txtEnterLine = txt.split(enterStr);            // 엔터 줄바꿈
  return txtEnterLine;
}

function instaTxtView(txtEnterLine){
  for(var i = 0; i<txtEnterLine.length;i++){     
    $insta_pop.append(
      $('<p>').text(txtEnterLine[i])
    )
  }
}

// http 문장만 뽑기 이벤트 실행
function httpLinkSplitEvent(txt){

  //텍스트 띄어쓰기 , 줄바꿈 행렬담을 곳.
  var txtArray = new Array();                   
  var txtArray2 = new Array();     
  var httpSlice = new Array();             
  var arrayCnt=0;
 
  // 1. 띄어쓰기 잘라서 담기
  txtArray = txt.split(" ");                    // 띄어쓰기 잘라서 txtArray에 담음
 
  // 2. 띄어쓰기 문장 중에 http~ 문장 찾기
   // 3. http로 시작하는 문장 txtArray2에 담음
   for(var i =0;i<txtArray.length;i++){
     if(txtArray[i].indexOf(txtHttps) != -1 || txtArray[i].indexOf(txtHttp) != -1){
       //console.log('http:// ~ , https://~ 찾음');
       txtArray2[arrayCnt] = txtArray[i];       
       arrayCnt++;
     }else{
       //console.log('없음');
     }
   }
       
 
   //console.log(txtArray2);
   // 4. txtArray2에서 http://~로 시작하는 부분부터 줄바꿈(개행문자)까지 문자열 추출하여 httpSlice에 담음
   for(var i =0;i<txtArray2.length;i++){
     httpSlice[i] = txtArray2[i].substring(0,txtArray2[i].indexOf(enterStr));
   }
    
  return httpSlice;
 
 }

 // http 문장만 뿌려줌.
 function httpSliceTxtView(httpSlice){
    //console.log(httpSlice);
   // 5. 인스타 게시글에 http://링크 갯수만큼 링크<a>태그를 달아준다.
   if(httpSlice.length>0){
    for(var i = 0; i<httpSlice.length;i++){
      $insta_pop.append(
        $('<span>').text('링크이동').addClass('linkText'),
        $('<a>').append('<a>').attr('href',httpSlice[i]).attr('target','_blank').addClass('moveLink').text(httpSlice[i])
        )//append
      }
    }
 }

 function instaTxtResultView(httpSlice,txtEnterLine){
  var httpTxt;
  var findLineNum;
  var replaceTxt;
  var resultTxt;

  for(var i = 0;i < txtEnterLine.length; i++){
    for(var j = 0;j < httpSlice.length;j++){
      findLineNum = txtEnterLine[i].indexOf(httpSlice[j]); // http 경우 비교 .
        if(findLineNum>0){
          httpTxt = txtEnterLine[i].substring(findLineNum); // findLineNum번째 부터 마지막까지 추출

          replaceTxt = '<a href="'+httpTxt+'" title="새창열림" target="_blank">'+httpTxt+'</a>'; //변경 될 문장

        }
      }
      
    //httpTxt  => replaceTxt 로 변경
    resultTxt = txtEnterLine[i].replace(httpTxt,replaceTxt); //httpTxt텍스트 발견시 교체.
    $insta_pop.append(
      $('<p>').html(resultTxt)
    )
  }

 }