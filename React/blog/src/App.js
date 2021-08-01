/* eslint-disable */
import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { map } from 'bluebird';

function App() {

let posts = '강남 고기 맛집';
let [글제목, 글제목변경] = useState(['남자 코트 추천', '강남 우동 맛집', '올림픽 재밌어요']);
let [좋아요수, 좋아요수변경] = useState(0);

let [모달, 모달변경] = useState(false);

function 제목바꾸기(){
  var newArray = [...글제목];
  newArray[0] = '여자코트 추천';
  글제목변경(newArray);
}

  return (
    <div className="App">
      <div className="black-nav">
          개발 Blog
      </div>
      <button onClick={ 제목바꾸기 }>버튼</button>
      <div className="list">
        <h3>{ 글제목[0] } <span onClick={()=>{ 좋아요수변경(좋아요수 + 1)}}>🧡</span>{좋아요수}</h3>
        <p>2월 17일 발행</p>
        <hr/>
      </div>
      <div className="list">
        <h3>{ 글제목[1] }</h3>
        <p>2월 17일 발행</p>
        <hr/>
      </div>
      <div className="list">
        <h3>{ 글제목[2] }</h3>
        <p>2월 17일 발행</p>
        <hr/>
      </div>
      
      { 
        글제목.map((글)=>{
          return(    
            <div className="list">
              <h3>{ 글 } <span onClick={()=>{ 좋아요수변경(좋아요수 + 1)}}>🧡</span>{좋아요수}</h3>
              <p>2월 17일 발행</p>
              <hr/>
            </div>
          )
        })
      }

      <button onClick={()=>{모달변경(!모달)}}>버튼</button>
    { 
      모달 === true
      ? <Modal/>
      : null
    }
    </div>
  );
}

// 컴포넌트 
function Modal(){
  return(
    <div className="modal">
      <h2>제목</h2>
      <p>날짜</p>
      <p>상세내용</p>
    </div>
  )
}

export default App;
