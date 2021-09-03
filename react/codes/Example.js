/* eslint-disable */
import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { map } from 'bluebird';
import { set } from 'harmony-reflect';

function App() {

  let posts = '강남 고기 맛집';
  let [글제목, 글제목변경] = useState(['남자 코트 추천', '강남 우동 맛집', '올림픽 재밌어요']);
  let [좋아요수, 좋아요수변경] = useState(0);
  let [누른제목, 누른제목변경] = useState(0);

  let [모달, 모달변경] = useState(false);

  let [입력값, 입력값변경] = useState('');

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
     
      { 
        글제목.map((글, i)=>{
          return(    
            <div className="list" key={i}>
              <h3 onClick={()=>{누른제목변경(i)}}>{ 글 } <span onClick={()=>{ 좋아요수변경(좋아요수 + 1)}}>🧡</span>{좋아요수}</h3>
              <p>2월 17일 발행</p>
              <hr/>
            </div>
          )
        })
      }
    <div className="publish">
      <input onChange={ (e)=>{입력값변경(e.target.value)}}/>
      <button onClick={()=>{ 
        var arrayCopy = [...글제목];
        arrayCopy.unshift(입력값);
        글제목변경(arrayCopy);
      }}>저장</button>
    </div>

      <button onClick={()=>{모달변경(!모달)}}>버튼</button>
    { 
      모달 === true
      ? <Modal 글제목={글제목} 누른제목={누른제목}></Modal>
      : null
    }
    <Profile/>
    </div>
  );
}

// 컴포넌트 
function Modal(props){
  return(
    <div className="modal">
      <h2>{props.글제목[props.누른제목]}</h2>
      <p>날짜</p>
      <p>상세내용</p>
    </div>
  )
}

// 옛날 문법
class Profile extends React.Component{
  constructor(){
    super();
    this.state = { name : 'Kim', age : 30}
  }
  
  changeName(){
    this.setState({name: 'Park'})
  }
  render(){
    return(
      <div>
        <h3>프로필입니다</h3>
        <p> 저는 { this.state.name } 입니다. </p>
        <button onClick={this.changeName.bind(this)}>버튼</button>
      </div>
      
    )
  }
}

export default App;
