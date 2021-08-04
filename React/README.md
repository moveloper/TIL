# 리액트 찍먹하기

* 리액트 왜 하지?
  * app같은 Web을 만들기 위해서. 다른 페이지로 새로고침 안하고 넘어간다거나 댓글을 쓰면 새로고침 없이 등록되는 것처럼 모바일 앱 같은 느낌을 주기 위해서(빠른 화면전환). 
  * 클라이언트 사이드 랜더링(CSR) 방식을 사용
  * 이번에 스프링 프로젝트하면서 AJAX랑 HTML을 덕지덕지 붙여가면서 구현한 것들은 SSR(서버 사이드 랜더링)의 단점을 보완하고자 했던 것이었다. 하지만 리액트는 이를 훠얼씬 간결하게 만든다..

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
* state나 props는 React에서 데이터를 다룰 때 사용하는 개념이다. 
* state가 수정이 되면 리액트는 state가 포함된 HTML을 자동으로 랜더링 해준다. 자주 변하는 데이터들을 저장하는데 유용하다.
* state 만들 땐 state를 필요로하는 컴포넌트들 중 가장 최상위 컴포넌트에 보관해서 props로 넘겨주는 것이 데이터를 역방향으로 전달시키는 문제보다 훨씬 쉽다.
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


## 여러페이지를 만들고 싶으면 라우터

* `npm install react-router-dom`으로 라우터 라이브러리 설치한다. 
* `import { BrowserRouter } from 'react-router-dom';` 으로 import하고 index.js의 `<App/>` 컴포넌트를 감싼다. `<HashRouter>`를 사용할 수도 있는데 이러면 사이트 방문시 URL 뒤에 /#/이 붙은채로 시작한다. 
* `App.js`에서도 마찬가지로 import 해온다. `import { Route } from 'react-router-dom';` 

* 원하는 곳에 `<Route></Route>`태그를 작성한다. 
     
      <Route path="/"> 
        HTML 내용
      </Route>
      <Route path="/detail">
        HTML 내용
      </Route>

      // 위 코드는 '/detail' 에 '/'경로도 포함되어 '/detail' 경로로 접속해도 '/' 경로의 내용도 보여준다. 이걸 방지하기 위해서는
      <Route exact path="/"> 
        HTML 내용
      </Route>  

      // 이렇게도 라우터 사용이 가능 
      <Route path="/" component={컴포넌트} ></Route> 
      <Route path="/"> <컴포넌트/> </Route> 

      // :id 자리에 아무 문자나 입력하면 Detail 컴포넌트를 보여주라는 뜻
      <Route path="/detail/:id">
      <Detail shoes={shoes}/>
      </Route>

* Link 태그로 감싸면 페이지 이동을 할 수 있게 만드는데 `<a>` 태그와 유사하다  
      
        <Nav.Link> <Link to="/">Home</Link> </Nav.Link>
        <Nav.Link> <Link to="/detail">Detail</Link> </Nav.Link>

* useHistory() 훅(Hook)을 이용해서 페이지를 이동하기 위해선 먼저 `import { useHistory } from 'react-router-dom';`로 import한다. 그 다음 컴포넌트 안에 `let history = useHistory();` 와 같은 식으로 객체에 저장하는데 이 객체에는 페이지의 이동 내역과 유용한 함수들이 내장되어 있다. 뒤로가기 버튼 같은 것을 눌렀을 때 history에 저장된 `goBack()` 함수를 실행시켜 페이지 이동을 할 수 있다. 

* `/detail/:id` 와 같은 경로로 들어오는 컴포넌트에서 :id 자리에 있는 값을 사용하고 싶으면 `useParams()`라는 훅을 사용하면 된다.  
  
## 스타일 변경

* css 작업을 할 때 항상 마주쳤던 문제는 class 만들어 놓은걸 까먹거나 협업시 중복되는 경우들도 있었고, 너무 길어서 관리하기 힘든 경우도 많다. 이를 해결하기 위한 여러 방법들이 있는데 그 중 하나는 'styled-components' 라이브러리를 이용해 컴포넌트를 만들 때 바로 스타일을 입혀서 컴포넌트로 만드는 것이다. 방식은 아래와 같다. 
  
        let 박스 = styled.div`
          padding : 20px;
        `;

        // 같은 컴포넌트여도 다른 색을 적용할 수 있다. 
        let 제목 = styled.h4`
          font-size : 25px;
          color : ${ props => props.색상 };
        `;

* CSS를 프로그래밍 언어처럼 작성할 수 있는 **SASS** 를 이용할 수 도 있다. SASS에서는 변수, 함수, 반복문, 연산자를 사용가능하다. 파일명은 .scss로 작성하고 라이브러리 활용해 css로 컴파일 해야한다. 

        // nesting 문법
        div.container {
          h4 {
            color : blue;
          }
          p {
            color : green;
          }
        }

        // @extend 문법
        .my-alert {
          background : #eeeeee;
          padding : 15px;
          border-radius : 5px;
          max-width : 500px;
          width : 100%;
          margin : auto;
        }
        .my-alert2 {
          @extend .my-alert;
          background : yellow;
        }

        // 이 외에  @mixin / @include 등 수많은 활용법이 있으니 필요할 때마다 구글 활용하자

## Lifecycle Hook / useEffect 
* 컴포넌트는 생명주기가 있다. 생성이 되고 삭제되고 관련된 state가 변경되어 재랜더링이 될 수도 있다. Lifecycle Hook을 사용하면 이 생명주기동안 참견할 수 있다는 것이다. 가장 유명한 훅인`componentDidMount(){}`은 컴포넌트 첫 등장 후 실행할 코드를 의미하고 `componentWillUnmount(){}`는 다른 페이지로 넘어가는 등 컴포넌트가 사라지기 전 실행할 코드이다. 
* 요즘은 `useEffect()`를 사용하는데 그냥 function 컴포넌트 안에 넣어서 사용하면 된다. ()안에는 **콜백함수**를 집어넣고 콜백함수 안에는 컴포넌트가 첫 등장하고나서 실행하고 싶은 코드를 적으면 된다. 
* `useEffect()`의 실행조건은 
  * 컴포넌트가 첫 등장해서 로딩이 끝난 후
  * 컴포넌트가 재랜더링 되고 난 후  
* 컴포넌트가 사라질 때 코드를 실행하고 싶으면? `useEffect()` 안에 return문을 사용
* 여러 개를 사용하면 순차적으로 코드가 실행된다 
* 업데이트 시 재랜더링 되는 것을 막고 싶으면 `useEffect()` 끝에 빈 대괄호를 넣어준다. 원래 대괄호 안에는 **state**를 넣어줄 수 있는데 뜻은 대괄호 안의 state가 변경될 때만 업데이트 해달라는 뜻이다. 근데 비어두게 되면 변경될 때 바꿀 것이 없기 때문에 업데이트 될 때 절대 바뀌지 않게된다. 
    
        useEffect(()=>{
          let 타이머 = setTimeout(()=>{ alert변경(false) }, 2000);
        }, []);

## Ajax랑 사용
* 리액트의 axios나 자바스크립트의 fetch()를 주로 사용한다. 
        
      axios.get('URL 주소')
      .then(()=>{ 요청성공시실행할코드 })
      .catch(()=>{ 요청실패시실행할코드 })

> 여기서부터는 SHOP 프로젝트의 App.js, Detail.js, Cart.js 코드들을 보면서 복습하기   

## Context API
* 코드 참조
* 1)`React.createContext()`로 범위 생성하고, 2)`<범위> value={값}></범위>`로 전송을 원하는 컴포넌트를 감싸고, 3) state 사용을 원하는 컴포넌트는 useContext(범위)를 이용하면 된다

## 리덕스는 왜쓰지? 

1. props 전송 없이도 모든 컴포넌트들이 state를 사용할 수 있게 만들어준다.

2. 데이터를 수정하고 싶을 때는  
    1) state 데이터의 수정 방법을 index.js에다가 미리 정의해놓고(reducer)
    2) index.js의 reducer 함수 안에서 수정방법을 정의해놓고 수정함  
    > 한마디로 state 관리가 용이해지는 것이다 

3. `props.dispatch(데이터)`와 같은 방법으로 리덕스로 데이터 실어 보내서 reducer 안에서 요청을 처리할 때 사용할 수 있다. 
