# sqld 공부하면서 봤던 개념 정리

## SQL 쿼리 순서 
```
SELECT 컬럼명 --------------------- (5) 
    FROM 테이블명 ------------------- (1)
WHERE 테이블 조건 --------------- (2)
GROUP BY 컬럼명 -------------------- (3)
HAVING 그룹 조건 ----------------- (4)
ORDER BY 컬럼명 -------------------- (6)
```

## 식별관계 / 비식별관계 / 외래키
```
1. 식별관계 => 외래키를 자신의 기본키로 사용
2. 비식별관계 => 외래키를 자신의 일반속성으로 사용
3. 비식별 관계이면서 외래키를 사용하지 않는 경우

1,2번 공통점 => 외래키의 삭제 또는 업데이트 발생시 참조하고 있는 테이블의 데이터를 고려해야함
3번은 고려안해도 됨 

아래는 외래키 설정시 고려해야하는 속성들
      
1) Case 1
alter table p2 add constraint fk_p2 foreign key(no) references p1(no);
alter table p3 add constraint fk_p3 foreign key(no) references p1(no);

- 부모 테이블에서 데이터 삭제시 Default로 생성되는 옵션 "NO ACTION"
- 명시적으로 프로그램에서 자식 테이블의 Row 모두 삭제하고 부모 테이블의 Row를 삭제해야됨

2) Case 2
alter table p2 add constraint fk_p2 foreign key(no) references p1(no) on delete cascade;
alter table p3 add constraint fk_p3 foreign key(no) references p1(no) on delete cascade;
- 부모 테이블에서 데이터 삭제시 자식 테이블의 Row는 자동으로 삭제됨

3) Case 3
alter table p2 add constraint fk_p2 foreign key(no) references p1(no) on delete set null;  ---- PK는 SET NULL 사용불가
alter table p3 add constraint fk_p3 foreign key(no) references p1(no) on delete set null;
- 부모 테이블에서 데이터 삭제시 자식 테이블의 Row는 자동으로 NULL로 업데이트 함
- 기본키 속성에는 위배됨.(Not Null 제약에 의해서)

* 따라서 Foreign Key 제약 조건에 의해 데이터 무결성을 유지하기 위한 방법으로
  -Foreign Key 설정시 On Delete 구문을 추가하지 않으면 Default 옵션은  "No Action"
   .명시적으로 프로그램에서 자식 테이블의 Row를 삭제한후 부모 테이블의 Row를 삭제할수 있음
  -DB에서 자동으로 데이터를 처리할 경우 기본키는 "On Delete cascade", 일반속성은 "On Delete set null" 를 사용해야 됨.
출처: https://eunbc-2020.tistory.com/160
```
## cardinality
데이터베이스에서 카디널리티는 크게 2가지 뜻으로 사용된다. 
* 먼저 관계 차수의 의미로 사용하는데, 두 엔티티간 관계에서 참여자 수를 표현하는 것이다. 이를테면 1:1, 1:N, N:M 관계의 차수를 이야기 하는 것이다.
* 두번째 의미의 카디널리티는 전체 행에 대한 특정 컬럼의 중복 수치를 나타내는 지표를 뜻한다. 중복도가 낮으면 카디널리티가 높다고 표현하고, 중복도가 높으면 카디널리티가 낮다고 한다. 예를 들면 이름을 저장하는 컬럼과 주민등록번호를 저장하는 컬럼이 있다고 가정하자. 이 때 주민등록번호는 이름에 '비해' 카디널리티가 높다고 할 수 있다. 카디널리티는 항상 상대적인 개념으로 이해하는 것이 좋다. 이러한 카디널리티의 개념은 인덱스를 걸 때 유용하게 사용된다. 카디널리티가 높은 컬럼을 우선적으로 인덱싱하여 성능을 좋게 만들 수 있다.  

---
## 계층형 질의
* START WITH절을 통해 지정된 계층구조가 전개될 시작 데이터를 파악한다.
* PRIOR 사원 = 매니저(이전 레벨의 사원값을 매니저값으로 가지고 있는, 부모->자식 순방향 전개)  
PRIOR 매니저 = 사원(이전 레벨의 매니저값을 사원값으로 가지고 있는, 자식->부모 역방향 전개)
* PRIOR은 SELECT, WHERE절에서도 사용가능하다. *그냥 PRIOR 키워드를 이전에 참조하고 있는 데이터행이라고 치환해서 생각해버리자.*
* 조건이 어느 절에 기재되어 있느냐에 따라
  * CONNECT BY 절에 작성된 조건: START WITH 절에서 필터링된 시작데이터는 결과목록에 포함되며, 이후 하위데이터도 전개되지만 조건을 충족하지 않는 하위 데이터는 결과에서 제외된다. 
  * PRIOR 조건에 추가된 조건: START WITH 절에서 필터링된 시작데이터는 결과목록에 포함되며, <u>*PRIOR조건을 모두 만족하는 경우에만 하위데이터가 전개된다*</u>. PRIOR조건을 모두 만족시키지 않는 경우 하위데이터 자체가 전개 안됨
* WHERE절에 작성된 조건: 계층구조를 모두 전개한 후 조건을 충족하는 데이터만 결과목록에 출력된다.
 
reference)  
https://blog.naver.com/PostList.naver?blogId=su12192000&categoryNo=0&from=postList

---

## WITH절 
WITH절은 복잡한 SQL에서 동일 블록에 대해 반복적으로 SQL문을 사용하는 경우 그 블록에 이름을 부여하여 재사용 할 수 있게 함으로서 쿼리 성능을 높일 수 있는데 WITH절을 이용하여 미리 이름을 부여해서 Query Block을 만들 수 있다. 자주 실행되는 경우 한번만 Parsing되고 Plan 계획이 수립되므로 쿼리의 성능향상에 도움이 된다.
```sql
WITH EXAMPLE AS
(
 SELECT 'WITH절' AS STR1
 FROM DUAL
)

SELECT * FROM EXAMPLE
```
---
## VIEW의 특징
하나 또는 그 이상의 테이블을 서로 연산하여 만들어진 가상(논리)의 테이블. 실제로 데이터를 가진 테이블이 아니라, SQL 쿼리 정보를 가지고 있는 형태
 * ~~뷰가 정의된 기본 테이블이 변경 되면, 뷰도 자동적으로 변경된다.~~ -> 참조해야 하는 테이블의 구조, 컬럼 등이 변경되면 뷰가 실행이 안됨
 * 외부 스키마는 뷰와 기본 테이블 정의로 구성된다.
 * 뷰에 대한 검색은 기본 테이블과 거의 동일하지만 삽입, 삭제, 갱신은 제약을 받게 된다. 
 * 보안측면에서 뷰를 활용할 수 있다.
 * 한 번 정의한 뷰는 변경할 수 없으며, 삭제한 후에 다시 생성해야 한다.
---
## GROUPING SETS 함수와 ROLLUP, CUBE
> GROUPING SETS과 GRUOPING 함수에 대해 정리가 깔끔하게 잘되어 있다: https://gent.tistory.com/279

오라클에서 소계, 합계, 총계의 쿼리(SQL)를 작성할 때는 ROLLUP을 많이 사용한다. ROLLUP의 경우 나열된 컬럼의 단계별로 소계, 합계를 자동으로 집계를 한다. 그에 반해 GROUPING SETS는 여러 그룹핑 쿼리를 UNION ALL 한 것과 같은 결과를 만들 수 있어 조금 더 유연하게 소계, 합계를 집계할 수 있다.

composite column 문의 경우|  group by 문의 경우 
---|---
group by grouping sets(a,b,c)| group by a union all group by b union all group by c 
group by grouping sets(a,b,(b,c))|  group by a union all group by b union all group by b,c 
group by grouping sets((a,b,c)) | group by a,b,c
group by grouping sets(a,(b),()) | group by a union all group by b union all group by ()
group by grouping sets(a,rollup(b,c)) | group by a union all group by rollup(b,c)
group by rollup(a,b,c) | group by (a,b,c) union all group by (a,b) union all group by (a) union all group by () 
group by cube(a,b,c) | group by (a,b,c) union all group by (a,b) union all group by (a,c) union all group by (b,c) union all group by (a) union all group by (b) union all group by (c) union allgroup by ()
---

* GROUPING 함수는 해당 컬럼의 값이 NULL이면 1, 값이 있으면 0을 리턴 한다.

## 랜덤 액세스 메모리
컴퓨터에서 랜덤 액세스 메모리(영어: Random Access Memory, Rapid Access Memory, <u>임의 접근</u> 기억 장치) 즉 램(RAM)은 임의의 영역에 접근하여 읽고 쓰기가 가능한 주기억 장치다. 반도체 회로로 구성되어 있으며 휘발성 메모리다. 흔히 RAM을 ‘읽고 쓸 수 있는 메모리’라는 뜻으로 알고 있는데, 이것은 오해다. RAM은 어느 위치에 저장된 데이터든지 접근(읽기 및 쓰기)하는 데 동일한 시간이 걸리는 메모리이기에 ‘랜덤(Random, 무작위)’이라는 명칭이 주어진다. 반면 하드 디스크, 플로피 디스크 등의 자기 디스크나 자기 테이프는 저장된 위치에 따라 접근하는 데 걸리는 시간이 다르다. 인덱스의 랜덤 액세스 개념을 무작위가 아닌 임의 접근 개념으로 이해하자. 

## pivot과 unpivot
> https://wookoa.tistory.com/240
