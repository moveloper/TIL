# JSON과_순환참조문제
## 발생조건: 양방향 매핑된 엔티티를 json 형태로 반환할 때 발생  
JPA는 디폴트로 맵핑된 데이터에 대해 FetchType.LAZY (게으른 불러오기)를 사용

예를 들어, User라는 Entity와 Account라는 Entity가 서로 양방향 참조 (1:N)를 하고 있다고 해보자.   
```java
public class User {
    @Id
    private long user_id;

    .. 생략

    @OneToMany(mappedBy = "user")
    private List<Account> accounts;
}
```
```java
public class Account {
    @Id
    private long id;

    .. 생략

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
``` 
Controller를 통해 Account Entity를 Response로 내보내고 브라우저에 json 형태로 뿌려주기 위해서는 Account entity가 참조하고 있는 User entity도 함께 불러오게 된다. 그런데, 여기서 문제가 발생한다. User entity는 다시 Account entity를 참조하기 때문에 또 Account entity를 불러오는 것이다. Repository에서는 Account entity 한개를 return 했지만 Controller를 통해 Response 되어 json으로 표시될 때는 이렇게 두 개의 entity가 계속해서 서로를 불러오면서 페이지 가득 똑같은 데이터가 중복되어 노출된 것이다.

## 해결 방법

해결 방법에는 여러가지가 있다.

​

1. @JsonIgnore : 이 어노테이션을 붙이면 json 데이터에 해당 프로퍼티는 null로 들어가게 된다. 즉, 데이터에 아예 포함이 안되게 된다.

2. @JsonManagedReference와 @JsonBackReference : 이 두개의 어노테이션이야말로 순환참조를 방어하기 위한 Annotation이다. 부모 클래스 (User entity)에 @JsonManagedReference를, 자식 클래스측(Account entity)에 @JsonBackReference 어노테이션을 추가해주면 된다.

3. DTO 사용 : 위와 같은 상황이 발생하게 된 주 원인은 '양방향 맵핑'이기도 하지만, 더 정확하게는 entity 자체를 response로 리턴한데에 있다. entity 자체를 return 하지 말고, dto 객체를 만들어 필요한 데이터만 옮겨담아 client로 리턴하면 순환참조와 관련된 문제는 애초에 방어할수 있다.

4. 맵핑 재설정 : 사람마다 다르지만 양방향 맵핑이 꼭 필요한지 다시 한번 생각해볼 필요가 있다. 만약 양쪽에서 접근 할 필요가 없다면 단방향 맵핑을 하면 자연스레 순환참조가 해결된다.   

출처: https://m.blog.naver.com/writer0713/221587351970