@Bean의 경우 개발자가 컨트롤이 불가능한 외부 라이브러리들을 Bean으로 등록하고 싶은 경우에 사용한다.
```java
public class RedisConfig {

    private @Value("${spring.redis.host}") String redisHost;
    private @Value("${spring.redis.port}") int redisPort;
    private @Value("${spring.redis.password}") String password;

    @Bean
    public JedisPoolConfig jedisPoolConfig() {
        JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
        jedisPoolConfig.setMaxTotal(30);
        jedisPoolConfig.setTestOnBorrow(true);
        jedisPoolConfig.setTestOnReturn(true);
        return jedisPoolConfig;
    }

    @Bean
    public JedisConnectionFactory redisConnectionFactory() {
        JedisConnectionFactory jedisConnectionFactory = new JedisConnectionFactory(jedisPoolConfig());
        jedisConnectionFactory.setHostName(redisHost);
        jedisConnectionFactory.setPort(redisPort);
        jedisConnectionFactory.setPassword(password);
        jedisConnectionFactory.setUsePool(true);
        return  jedisConnectionFactory;
    }

    @Bean
    public RedisTemplate<String , Object> redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        template.setStringSerializer(new StringRedisSerializer());
        template.setEnableDefaultSerializer(false);
        template.setEnableTransactionSupport(true);
        return template;
    }

}
```

(예를 들면 Redis와 연동하기위해 RedisConfig 클래스에 @Component를 선언할수는 없으니 RedisTemplate의 인스턴스를 생성하는 redisTemplate메소드를 만들고 해당 메소드에 @Bean을 선언하여 Bean으로 등록한다.)

반대로 개발자가 직접 컨트롤이 가능한 Class들의 경우엔 @Component를 사용한다.

```java
@Component
@Aspect
public class CheckSessionValid {

    @Autowired
    private SessionTokenRedisRepository sessionTokenRedisRepository;

    @Pointcut("execution(public * com.finder.genie_ai.controller.ShopController(..)) && args(token)")
    public void controllerClassMethods(String token) {}

    //Todo search @AspectJ
    @Before("controllerClassMethods(token)")
    public void checkSessionValid(String token) {
        if (!sessionTokenRedisRepository.isSessionValid(token)) {
            throw new UnauthorizedException();
        }
    }

}
```

그럼 개발자가 생성한 클래스에 @Bean은 선언이 가능할까?

정답은 No 이다.

@Bean과 @Component는 각자 선언할 수 있는 타입이 정해져있어 해당 용도외에는 컴파일 에러를 발생시킨다.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Component {

   /**
    * The value may indicate a suggestion for a logical component name,
    * to be turned into a Spring bean in case of an autodetected component.
    * @return the suggested component name, if any (or empty String otherwise)
    */
   String value() default "";

}
```

(@Target이 TYPE로 지정되어 Class위에서만 선언될수 있음을 알수 있다.)

```java
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Bean {

   /**
    * Alias for {@link #name}.
    * <p>Intended to be used when no other attributes are needed, for example:
    * {@code @Bean("customBeanName")}.
    * @since 4.3.3
    * @see #name
    */
   @AliasFor("name")
   String[] value() default {};

   /**
```
(@Target이 METHOD로 지정되어 있지만, TYPE은 없다)

출처: https://effectivesquid.tistory.com/entry/Bean-%EA%B3%BC-Component%EC%9D%98-%EC%B0%A8%EC%9D%B4

---

## @Bean이 등록되는 순서와 의존성 주입
스프링은 빈이 등록되는 순서와는 상관없이 의존성 주입을 할 수 있다. 스프링은 의존성 주입(Dependency Injection)을 수행하기 위해 빈을 생성하고 초기화하는 단계에서 의존하는 다른 빈을 찾아서 주입한다.   

의존성 주입은 빈 객체들 간의 관계를 구성하는 작업으로, 스프링 컨테이너가 빈을 생성하고 관리하는 시점에 수행된다. 스프링 컨테이너는 설정 정보를 분석하여 빈들 간의 의존성을 파악하고, 필요한 의존성을 자동으로 주입해준다.   

따라서, 빈이 등록되는 순서는 의존성 주입에 영향을 미치지 않는다. 스프링은 등록된 빈들을 분석하면서 의존성 주입할 대상 빈을 찾아서 주입해주므로, 의존성을 가진 빈이 먼저 등록되지 않더라도 의존성 주입은 정상적으로 이루어진다.

이러한 유연성과 독립성은 스프링의 핵심 기능 중 하나이며, 객체 간의 결합도를 낮추고 유지 보수성을 향상시키는 데 도움을 준다.

``` java 
@Configuration
public class AppConfig {

    @Bean
    public Test2 test2() {
        return new Test2();
    }

    @Bean
    public Test test(Test2 test2) {
        // Test 빈 내에서 Test2 빈 사용 가능
    }
}

```