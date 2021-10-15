/*eslint-disable*/
import React, {useContext, useState, lazy, Suspense} from 'react';
import logo from './logo.svg';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import './App.css';
import Data from './data.js'
// import Detail from './Detail.js'
let Detail = lazy(()=> import('./Detail.js'));
import axios from 'axios';

import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { Modal } from 'bootstrap';
import Cart from './Cart.js'

export let 재고context = React.createContext();

function App() {

  let [신발, 신발변경] = useState(Data);
  let [재고, 재고변경] = useState([10, 11, 12]);

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">쇼핑몰</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/detail">Detail</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* exact는 정확히 해당 경로에서만 출력 */}
      <Route exact path="/">
        <div className="container">
          <div className="row">
            <div className="jumbotron">
                <h1>20% Season Off</h1>
                <p>This is ~~</p>
                <p>
                  <Button variant="primary">Learn more</Button>
                </p>
            </div>
          </div>
        </div>


        <div className="container">
          <재고context.Provider value={재고}>
            <div className="row">
              {
                신발.map((a,i)=>{
                  return <신발정보 신발={신발[i]} i={i} key={i} />
                })
              }
            </div>
          </재고context.Provider>
  
          <button className="btn btn-primary" onClick={()=>{ 
            
            axios.get('https://codingapple1.github.io/shop/data2.json')
            .then((result)=>{
              
              console.log(result);
              신발변경([...신발, ...result.data]);
            })
            .catch(()=>{ 
              console.log('실패했어요') 
            });
          }}>더보기</button>
        </div>
      </Route>
          
      <Route path="/detail/:id">
        <재고context.Provider value={재고}>
          <Suspense fallback={ <div>로딩중이에요</div>}>
            <Detail 신발={신발} 재고={재고} 재고변경={재고변경}/>
          </Suspense>
        </재고context.Provider>
      </Route>

      <Route path='/cart'>
        <Cart></Cart>
      </Route>
    </div>
  );
}

function 신발정보(props){
  
  let 재고 = useContext(재고context);
  let history = useHistory();

  return(
    <div className="col-md-4" onClick={()=>{ history.push('/detail/' + props.신발.id)}}>
{/* JSX 엘리먼트 대부분의 props는 컴포넌트로 전달되지만 React에서 사용하는 두 개의 특수 props(ref 및 key)는 컴포넌트로 전달되지 않습니다.
예를 들어, 컴포넌트에서 this.props.key를 render 함수나 propTypes에서 접근하면 그 값은 undefined 입니다. 자식 컴포넌트 내에서 같은 값에
액세스하고 싶다면 다른 프로퍼티로 전달해야 합니다(예시: <ListItemWrapper key={result.id} id={result.id} />). 
불필요해 보일지 모르지만, 재조정을 위해 사용되는 속성과 앱 로직을 분리하는 것은 중요합니다. */}
    <img src={ 'https://codingapple1.github.io/shop/shoes' + (props.i+1) + '.jpg' } width="100%"/>
    <h4>{props.신발.title}</h4>
    <p>{props.신발.content} & {props.신발.price}</p>
    <Test></Test>
    </div>
  )
}

function Test(){

  let 재고 = useContext(재고context)
  return <p>{재고[0]}</p>
}

export default App;
