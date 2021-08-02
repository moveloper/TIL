/*eslint-disable*/

import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom'
import styled from 'styled-components';
import './Detail.scss'
import {재고context} from './App.js';
import { Nav } from 'react-bootstrap';
import {CSSTransition} from 'react-transition-group';

let 박스 = styled.div`
    padding: 20px;
`;

// 자바스크립트에서 백틱(``) 안에 ${}를 사용하면 {}안에서 변수를 사용할 수 있다
let 제목 = styled.h4`
    font-size: 25px;
    color: ${ props => props.색상 }
`;

  function Detail(props){

    let [alert, alert변경]  = useState(true);
    let [inputData, inputData변경] = useState('');
    let 재고 = useContext(재고context);

    let [누른탭, 누른탭변경] = useState(0);
    let [스위치, 스위치변경] = useState(false);

    useEffect(()=>{
        let 타이머 = setTimeout(()=>{
            alert변경(false)    
        }, 2000)
        console.log("안녕");
        return ()=>{ clearTimeout(타이머)}
    },[alert, inputData]);

  
    let { id } = useParams();
    let history = useHistory();
    /* find는 Array 안에서 원하는 자료를 찾고 싶을 때 사용한다. 
       find()는 array뒤에 붙일 수 있고, 안에 콜백함수가 들어가는데 
       이 때 파라미터는 array안에 있는 각각의 데이터를 의미한다. 
       return은 조건식의 true false 값을 return하는 것이 아니라
       이 조건을 만족하는 데이터를 리턴하는 것이다. 
    */
    let 찾은상품 = props.신발.find(function(상품){
        return 상품.id == id
    });

    return(
      <div className="container">
          <박스>
            <제목 className="red">상세페이지</제목>
          </박스>
        {inputData}
        <input onChange={(e)=>{ inputData변경(e.target.value)}}/>

          {
            alert === true 
            ?  (<div className='my-alert2'>
                  <p>재고가 얼마 남지 않았습니다.</p>
                </div>)
            : null
          }
    
        <div className="row">
            <div className="col-md-6">
            <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="100%" />
            </div>
            <div className="col-md-6 mt-4">
            <h4 className="pt-5">{찾은상품.title}</h4>
            <p>{찾은상품.content}</p>
            <p>{찾은상품.price}</p>

            <Info 재고={props.재고}></Info>

            <button className="btn btn-danger" onClick={()=>{ props.재고변경([9, 11, 12])}}>주문하기</button> 
            <button className="btn btn-danger" onClick={()=>{ 
                history.goBack();  
            }}>뒤로가기</button> 
            </div>
        </div>
        
        <Nav className="mt-5" variant="tabs" defaultActiveKey ="link-0">
            <Nav.Item>
                <Nav.Link eventKey='link-0' onClick={()=>{ 스위치변경(false); 누른탭변경(0)}}>Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1" onClick={()=>{ 스위치변경(false); 누른탭변경(1)}}>Option 2</Nav.Link>
            </Nav.Item>
        </Nav>
        <CSSTransition in={스위치} classNames="wow" timeout={500}>
            <TabContent 누른탭={누른탭} 스위치변경={스위치변경}></TabContent>
        </CSSTransition>

    </div>   
    )
  }

    function TabContent(props){

        useEffect(()=>{
            props.스위치변경(true);
        })
        
        if(props.누른탭 === 0){
            return <div>0번째 내용입니다</div>
        } else if(props.누른탭 === 1){
            return <div>1번째 내용입니다</div>
        } else if(props.누른탭 === 2){
            return <div>2번째 내용입니다</div>
        }
    }
    
    function Info(props){
        return (
            <p>재고: { props.재고[0] } </p>
        )
    }
  

export default Detail;