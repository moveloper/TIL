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