# 리액트 찍먹하기

* 리액트 왜 하지?
  * Web app을 만들기 위해서. 다른 페이지로 새로고침 안하고 넘어가거나 글을 쓰는 등의 행위 등이 모바일 앱 같은 느낌을 준다.
  * 이번에 스프링 프로젝트하면서 AJAX랑 HTML을 덕지덕지 붙여가면서 구현한 것들을 리액트는 이를 훠얼씬 간결하게 만든다..

* 리액트 프로젝트 생성
  * node.js를 설치하고 터미널에 프로젝트 디렉토리를 만든 후 다음 명령어를 적으면 리액트 프로젝트를 쉽고 빠르게 설치할 수 있다. 
    
    ```
    npx create-react-app blog
    ```
  * 내가 짠 코드를 브라우저에서 미리보기
    ```
    npm start 
    ```
* 리액트에서는 HTML 대신 JSX라는 문법을 사용한다
  * `document.getElementById().innerHTML = 데이터` 이런 방식으로 데이터를 넣었던 것을 중괄호 `<div>{ data }</div>` 이런 식으로 데이터 바인딩이 가능해진다. `<div className={data}></div>` 처럼 HTML 속성들에도 바인딩이 가능하다. 
  * HTML에 스타일 넣기
    ```
    <div style={{color:'black', fontSize: '30px'}}>글씨</div>
    ```
    {속성명: '속성값'} 으로 넣고 속성명에는 대쉬를 쓸 수 없어 카멜케이스 방식으로 적어야 한다. 
    
## State, map, props, component 관련 코드 복기
* state가 수정이 되면 리액트는 state가 포함된 HTML을 자동으로 랜더링 해준다. 자주 변하는 데이터들을 저장하는데 유용하다.
* 컴포넌트는 긴 HTML을 한 단어로 치환해서 넣을 수 있는 문법이다. 사용 방법은 함수를 하나 만들어서 return 값 안에 HTML을 담은 다음에 또 다른 컴포넌트에 집어 넣으면 된다. 보통 영어 대문자로 시작하며 return 안에 평행한 여러개의 태그를 쓸 수 없다. 쓰려면 div나 <></>로 묶어야 한다.
* 자식 컴포넌트가 부모 컴포넌트 안에 있던 state를 쓰고 싶은 때는 props문법을 사용하여 state를 전송하고 `{props.state이름}` 식으로 쓰면 된다.
 ```js
/* eslint-disable */   // 터미널 창에서 Warning 노출 X
//useState를 사용하기 위해 import를 해야한다. 
import React, {useState} from 'react'; 
import logo from './logo.svg';
import './App.css';
import { map } from 'bluebird';
import { set } from 'harmony-reflect';

function App() {

  let posts = '강남 고기 맛집';
  // useState() 함수는 state를 하나 만들어준다. 디스트럭처링 문법을 이용하는데 디스트럭처링 문법은 구조화된 배열 또는 객체를 비구조화해서 1개 이상의 변수에 개별적으로 할당하는 것을 말한다. 순서에 의미가 있고 개수는 일치하지 않아도 상관 없다. 아래에서 글제목변경, 좋아요수변경 등은 각각 글제목, 좋아요수의 데이터를 변경시킬 함수가 들어있다. 
  // 글제목변경, 좋아요수변경과 같은 함수는 매개변수로 받는 데이터로 완전히 대체해주다. state = 값 이런 식으로 조작하면 안되기 때문에 state 변경함수를 꼭 사용해야 된다. 
  let [글제목, 글제목변경] = useState(['남자 코트 추천', '강남 우동 맛집', '올림픽 재밌어요']);
  let [좋아요수, 좋아요수변경] = useState(0);
  let [누른제목, 누른제목변경] = useState(0);

  let [모달, 모달변경] = useState(false);

  let [입력값, 입력값변경] = useState('');
  
  function 제목바꾸기(){
  // 완전히 개별 복사본을 만들어서(deep copy) 개별 복사본의 값을 변경해야 한다. 그냥 var newArray = 글제목;으로 하면 참조형 데이터는 복사가 아닌 같은 값을 공유하게 되는 것을 의미한다. 따라서 아래 행은 결국 글제목 = '여자코트 추천'과 같은 의미가 되고 state = 값이기 때문에 오류가 발생한다. ...은 spread 연산자인데 중괄호나 대괄호를 벗겨달라는 의미이다. 글제목의 데이터들의 괄호를 벗기고 다시 입혀서 deep copy를 할 때 많이 사용한다.   
    var newArray = [...글제목];
    newArray[0] = '여자코트 추천';
    글제목변경(newArray);
  }
  
  // return 안에 있는 html들을 리턴한다.
  return (
    <div className="App">
      <div className="black-nav">
          개발 Blog
      </div>

      // Click이 대문자이고, 중괄호를 사용하며 코드가 아니라 함수를 적는다. function(){실행할 코드} 혹은 ()=>{} 과 같은 콜백 함수를 넣는 것도 가능하다.  
      <button onClick={ 제목바꾸기 }>버튼</button>
     
      { 
        // 반복문을 사용하려면 array자료형의 내장 함수인 map함수를 사용해야 한다. 중괄호 안에서는 변수, 함수만 가능하므로 for문은 불가능하기 때문이다. 
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
        // onChange는 input에 뭔가 입력할 때마다 특정 함수를 동작시킬 때 사용한다. 
      <input onChange={ (e)=>{입력값변경(e.target.value)}}/>
      <button onClick={()=>{ 
        var arrayCopy = [...글제목];
        arrayCopy.unshift(입력값);
        글제목변경(arrayCopy);
      }}>저장</button>
    </div>

      <button onClick={()=>{모달변경(!모달)}}>버튼</button>
    { // 리액트 중괄호 내에서는 if 문을 사용할 수 없기 때문에 대용으로 삼항 연산자를 사용한다. 
      모달 === true
      // 부모 컴포넌트 안에 존재하는 자식컴포넌트에 `<자식컴포넌트 전송할이름={state명}>`으로 props를 전달한다. 
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

    // 옛날 문법(클래스 형식)
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

    ```