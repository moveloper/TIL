## 연관관계 설정 후 UPDATE할 때 발생한 문제
```java
@Getter
@Setter
@ToString
@Entity
@Table(name="EMPLOYEE")
public class EmployeeVO {
	@Id
	private int empNo;
	private String empName;
	private String empGender;
	private String empPhone;

	@ManyToOne
	@JoinColumn(name="DEPT_NO")
	private DepartmentVO dept;
}

@Getter
@Setter
@ToString
@Entity
@Table(name="DEPARTMENT")
public class DepartmentVO {
	@Id @GeneratedValue
	private int deptNo;
	private String deptName;
	private int deptHead;
}

```
* 상황: 두 엔티티 사이에 외래키로 연관관계를 설정해준 후에 save()로 update를 하려고 했다. EMPLOYEE의 dept_no와 DEPARTMENT의 dept_no로 연관관계를 맺었는데, save()메서드로 EMPLOYEE 엔티티의 dept_no를 변경하려고 하자 DEPARTMENT의 식별자가 바뀌었다는 메시지와 함께 오류가 발생하였다. 
* 원인: 기본키인 dept_no가 바뀌면 jpa가 오류를 낸다.(일반 데이터베이스에서는 unique한 값으로 primary key를 수정할 수 있지만 그래선 안되고 이를 JPA는 철저히 지키는 모양인가보다. 또한 일반 데이터베이스에서는 참조무결성을 해치지 않는 선에서 EMPLOYEE 테이블에서의 외래키인 dept_no를 수정해도 OK인데, jpa는 객체로 엔티티를 관리해서 이 또한 오류를 유발하는 것 같다.)
* 식별관계/비식별관계에서의 오류라고 생각했는데 아닌 것 같다. 덕분에 공부한 내용 정리
	
	1. 외래키 전제조건: 일반 데이터베이스에서 외래 키 테이블(EMPLOYEE)이 참조하는 테이블(DEPARTMENT)의 열은 반드시 primary key 이거나 unique 제약조건이 설정되어 있어야한다.
	2. 식별관계: 외래키를 기본키로 사용하는 관계    
	비식별관계: 외래키를 기본키로 사용하지않고 일반 속성으로 취급하는 관계
	https://multifrontgarden.tistory.com/181
	3. 마지막으로 데이터베이스를 설계할 때 외래키의 값이 변하지 않으면 식별관계로, 변할 가능성이 있다면 비식별관계 맺어주도록 하자. (비식별관계가 대세)