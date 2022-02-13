# Spring Data JPA

## 1. 연관관계 
* 연관관계에 있는 엔티티는 jpql로 join문을 작성하지 않아도 연관관계에 있는 엔티티의 정보들을 알아서 출력해준다. JPA는 @ManyToOne과 같은 연관관계를 설정하는 어노테이션에서 FetchType.Lazy, FetchType.Eager과 같은 설정을 통해서 데이터베이스의 JOIN과 같은 기능을 구현한다. 즉시 로딩과 지연 로딩과 관련된 자세한 내용은 https://ict-nroo.tistory.com/132  

## 2. 페이징과 정렬
기초 이론: https://wonit.tistory.com/483
JPA + JSP 페이징 게시판: https://amongthestar.tistory.com/173

```
Page 클래스가 제공하는 인터페이스

int getNumber();                     //현재 페이지
int getSize();                            //페이지 크기
int getTotalPages();                 //전체 페이지 수
int getNumberOfElements();   //현재 페이지에 나올 데이터 수
long getTotalElements();         //전체 데이터 수
boolean hasPreviousPage();    //이전 페이지 여부
boolean isFirstPage();              //현재 페이지가 첫 페이지 인지 여부
boolean hasNextPage();           //다음 페이지 여부
boolean isLastPage();               //현재 페이지가 마지막 페이지 인지 여부
Pageable nextPageable();         //다음 페이지 객체, 다음 페이지가 없으면 null
Pageable previousPageable();   //다음 페이지 객체, 이전 페이지가 없으면 null
List<T> getContent();               //조회된 데이터
boolean hasContent();              //조회된 데이터 존재 여부
Sort getSort();                           //정렬정보
```
