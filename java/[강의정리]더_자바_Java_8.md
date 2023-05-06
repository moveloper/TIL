# 더 자바, Java 8

> 요약pdf: 구글드라이브


## 3. Java가 기본으로 제공하는 함수형 인터페이스
- java.lang.funcation 패키지: 자바에서 미리 정의해둔 자주 사용할만한 함수 인터페이스
- Lazy Evaluation 발생: 불필요한 연산을 피하기 위해 연산을 지연시켜 놓았다가 필요할 때 연산하는 방법
  - https://velog.io/@rockpago/Lazy-Evaluation (요약: 람다 표현식은 함수의 실행 결과가 아닌 함수의 동작 자체를 표현한다.따라서 람다식 자체는 연산이 아니다. 람다식이 표현하는 익명구현함수(get, apply와 같은)가 실제로 호출될 때
    비로소 함수가 동작하여 값을 연산하는 것이다.)
- Function<T, R>
  -  T 타입을 받아서 R 타입을 리턴하는 함수 인터페이스
  -  R apply(T t)
  - 함수 조합용 메소드
    - andThen
    - compose
    - 활용법: https://seeminglyjs.tistory.com/250 
- BiFunction<T, U, R>
  - 두 개의 값(T, U)를 받아서 R 타입을 리턴하는 함수 인터페이스
  -  R apply(T t, U u)
- Consumer<T>
  - T 타입을 받아서 아무값도 리턴하지 않는 함수 인터페이스
  - void accept(T t)
- Supplier<T>
  - T 타입의 값을 제공하는 함수 인터페이스
  - T get()
- Predicate<T>
  - T 타입을 받아서 boolean을 리턴하는 함수 인터페이스
  - boolean test(T t)
- UnaryOperator<T>
  - Function<T, R>의 특수한 형태로, 입력값 하나를 받아서 동일한 타입을 리턴하는 함수
인터페이스
- BinaryOperator<T>
  - BiFunction<T, U, R>의 특수한 형태로, 동일한 타입의 입렵값 두개를 받아 리턴하는 함수
인터페이스

## 4. 람다 표현식

```java 
public class Foo {

    public static void main(String[] args) {

        Foo foo = new Foo();
        foo.run();
    }

    private void run() {
        int baseNumber = 10;

        // 로컬 클래스
        class LocalClass {
            void printNumber() {
                int baseNumber = 11;
                System.out.println(baseNumber); // 11
            }
        }

        // 익명 클래스
        Consumer<Integer> integerConsumer = new Consumer<Integer>() {
            @Override
            public void accept(Integer baseNumber) { // 파라미터 baseNumber
                System.out.println(baseNumber);
            }
        };

        // 람다
        IntConsumer printInt = (i) -> {
            //int baseNumber = 11;  컴파일 에러: Variable 'baseNumber' is already defined in the scope -> 같은 스코프
            System.out.print(i + baseNumber);
        };

        // baseNumber++; // 컴파일 에러: Variable used in lambda expression should be final or effectively final
                         // -> effective final이 아니면 컴파일에서 오류를 잡아냄
        printInt.accept(10);
    }
}

```

## 5. 메소드 레퍼런스

```java
public class App {
    public static void main(String[] args) {
        // 1. 특정 객체의 인스턴스 메소드 참조
        Greeting greeting = new Greeting();
        UnaryOperator<String> hello = greeting::hello;
        System.out.println(hello.apply("gildong"));
        // 2. 스태틱 메소드 참조
        UnaryOperator<String> hi = Greeting::hi;
        System.out.println(hi.apply("gildong"));
        // 3-1. 생성자 참조
        Supplier<Greeting> newGreeting = Greeting::new; // 문자열을 받지 않는 생성자
        Greeting greeting2 = newGreeting.get();
        System.out.println("greeting2 = " + greeting2);
        // 3-2. 생성자 참조
        Function<String, Greeting> gildongGreeting = Greeting::new; // 문자열을 받는 생성자
        Greeting greeting3 = gildongGreeting.apply("gildong");
        System.out.println("greeting3 = " + greeting3);
        // 4. 임의 객체의 인스턴스 메소드 참조
        String[] names = {"keesun", "whiteship", "toby"};
        Arrays.sort(names, String::compareToIgnoreCase);
        System.out.println(Arrays.toString(names));
    }
}

public class Greeting {

    private String name = "HONG";

    public Greeting(){}

    public Greeting(String name) {
        this.name = name;
    }

    public String hello(String name) {
        return "hello " + name;
    }

    public static String hi(String name) {
        return "hi " + name;
    }

    @Override
    public String toString() {
        return "Greeting{" +
                "name='" + name + '\'' +
                '}';
    }
}



```


## 6. 인터페이스 기본 메소드와 스태틱 메소드

기본 메소드 (Default Methods)
- 인터페이스에 메소드 선언이 아니라 구현체를 제공하는 방법
- 해당 인터페이스를 구현한 클래스를 깨트리지 않고 새 기능을 추가할 수 있다.
- 기본 메소드는 구현체가 모르게 추가된 기능으로 그만큼 리스크가 있다.
  - 컴파일 에러는 아니지만 구현체에 따라 런타임 에러가 발생할 수 있다.
  - 반드시 문서화 할 것. (@implSpec 자바독 태그 사용)
- Object가 제공하는 기능 (equals, hasCode)는 기본 메소드로 제공할 수 없다.
  - 구현체가 재정의해야 한다.
- 본인이 수정할 수 있는 인터페이스에만 기본 메소드를 제공할 수 있다.
- 인터페이스를 상속받는 인터페이스에서 다시 추상 메소드로 변경할 수 있다.
- 인터페이스 구현체가 재정의 할 수도 있다

스태틱 메소드
- 해당 타입 관련 헬터 또는 유틸리티 메소드를 제공할 때 인터페이스에 스태틱 메소드를
제공할 수 있다.


## 8.  Stream 소개

```java
public class App {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("keesun");
        names.add("whiteship");
        names.add("toby");
        names.add("foo");

        // 스트림은 데이터를 담고 있는 저장소가 아니며, 처리하는 데이터 소스를 변경하지 않는다.
        // 또한 스트림으로 처리하는 데이터는 오직 한번만 처리한다.
        
        // 중개 오퍼레이션은 근본적으로 lazy하다. 아래 코드는 출력을 하지 않는다.
        // 종료 오퍼레이션이 오기 전까지 처리하지 않는다.
        Stream<String> stringStream = names.stream()
                .map((s) -> {
                    System.out.println(s);
                    return s.toUpperCase();
                });

        // 손쉽게 병렬처리를 할 수 있다
        List<String> collect = names.parallelStream().map((s) -> {
            System.out.println(s + " " + Thread.currentThread().getName());
            return s.toUpperCase();
        }).collect(Collectors.toList());

        collect.forEach(System.out::println);
        /* 결과 (그냥 stream()은 전부 main)
            foo ForkJoinPool.commonPool-worker-19
            keesun ForkJoinPool.commonPool-worker-23
            whiteship ForkJoinPool.commonPool-worker-5
            toby main
            KEESUN
            WHITESHIP
            TOBY
            FOO
         */
    }
}

```

## Stream API 
```java

public class App {

    private static class OnlineClass{
        private Integer id;
        private String title;
        private boolean closed;

        public OnlineClass(Integer id, String title, boolean closed) {
            this.id = id;
            this.title = title;
            this.closed = closed;
        }

        public Integer getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public boolean isClosed() {
            return closed;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public void setClosed(boolean closed) {
            this.closed = closed;
        }
    }

    public static void main(String[] args) {
       List<OnlineClass> springClasses = new ArrayList<>();
       springClasses.add(new OnlineClass(1, "spring boot", true));
       springClasses.add(new OnlineClass(2, "spring data jpa", true));
       springClasses.add(new OnlineClass(3, "spring mvc", false));
       springClasses.add(new OnlineClass(4, "spring core", false));
       springClasses.add(new OnlineClass(5, "rest api development", false));

        System.out.println("spring으로 시작하는 수업");
        springClasses.stream()
                .filter(oc -> oc.getTitle().startsWith("spring"))
                .forEach(oc -> System.out.println(oc.getId()));

        System.out.println("close 되지 않은 수업");
        springClasses.stream()
                .filter(Predicate.not(OnlineClass::isClosed))
                .forEach(oc -> System.out.println(oc.getId()));

        System.out.println("수업 이름만 모아서 스트림 만들기");
        springClasses.stream()
                .map(oc -> oc.getTitle())
                .forEach(System.out::println); 

        List<OnlineClass> javaClasses = new ArrayList<>();
        javaClasses.add(new OnlineClass(6, "The Java, Test", true));
        javaClasses.add(new OnlineClass(7, "The Java, Code manipulation", true));
        javaClasses.add(new OnlineClass(8, "The Java, 8 to 11", false));

        List<List<OnlineClass>> keesunEvents = new ArrayList<>();
        keesunEvents.add(springClasses);
        keesunEvents.add(javaClasses);

        System.out.println("두 수업 목록에 들어잇는 모든 수업 아이디 출력"); 
        keesunEvents.stream()
                .flatMap(Collection::stream) // flatMap(3차원배열의 스트림) -> 결과: 2차원 배열
                .forEach(oc -> System.out.println(oc.getId())); // 1, 2, 3, 4, 5, 6, 7, 8

        System.out.println("10부터 1씩 증가하는 무제한 스트림 중에서 앞에 10개 빼고 최대 10개 까지만"); 
        Stream.iterate(10, i -> i + 1)
                .skip(10)
                .limit(10)
                .forEach(System.out::println); // 20, 21, ..., 29

        System.out.println("자바 수업 중에 Test가 들어있는 수업이 있는지 확인");
        boolean test = javaClasses.stream()
                .allMatch(oc -> oc.getTitle().contains("Test"));
        System.out.println(test); // false

        System.out.println("스프링 수업 중에 제목에 spring이 들어간 제목만 모아서 List로 만들기");
        List<String> spring = springClasses.stream()
                .filter(oc -> oc.getTitle().contains("spring"))
                .map(OnlineClass::getTitle)
                .collect(Collectors.toList());
        spring.forEach(System.out::println); // spring boot, spring data jpa, spring mvc, spring core
    }
}

```

## Optional 

```java
public class App {
    private static class OnlineClass{
        // 위 Stream API에서 사용한 것과 동일한 클래스이고, 아래의 필드와 getter, setter만 추가되었다. 
        public Progress progress;
        
//        public Progress getProgress() {
//            // 1. 예외를 던진다
//            if (this.progress == null) {
//                throw new IllegalStateException();
//            }
//            // 2. 그냥 null을 리턴한다. 클라이언트 코드에서 null 체크를 한다.
//            return progress;
//        }

        public Optional<Progress> getProgress() {
            return Optional.ofNullable(progress); //
        }

        public void setProgress(Progress progress) {
            this.progress = progress;
        }
    }

    private static class Progress {
        private Duration studyDuration;
        private boolean finished;

        public Duration getStudyDuration() {
            return studyDuration;
        }

        public void setStudyDuration(Duration studyDuration) {
            this.studyDuration = studyDuration;
        }
    }

    public static void main(String[] args) {
        List<OnlineClass> springClasses = new ArrayList<>();
        springClasses.add(new OnlineClass(1, "spring boot", true));
        springClasses.add(new OnlineClass(2, "spring data jpa", true));
        springClasses.add(new OnlineClass(3, "spring mvc", false));
        springClasses.add(new OnlineClass(4, "spring core", false));
        springClasses.add(new OnlineClass(5, "rest api development", false));

        // Optional: 오직 값 한 개가 들어있을 수도 없을 수도 있는 컨네이너.
        // 사용이유: 메소드에서 작업 중 특별한 상황에서 값을 제대로 리턴할 수 없는 경우 선택할 수 있는 방법
        // -> 예외를 던지면 비용이 높아지고, null을 리턴하면 해당 코드를 사용하는 클라이언트 코드가 주의해야 한다
        // -> Optional을 리턴함으로써 클라이언트에게 명시적으로 빈 값이 있을 수도 있다는 것을 알려주고,
        // 빈 값인 경우에 대한 처리를 강제하는 효과가 있다.
        OnlineClass spring_boot = new OnlineClass(1, "spring boot", true);
        Duration studyDuration = spring_boot.getProgress().get().getStudyDuration(); // 'Optional.get()' without 'isPresent()' check 경고발생

        // 리턴값으로만 쓰기를 권장. 아래와 같은 사용은 피하는게 좋음
        // 1) 메소드 매개변수 타입 -> 가독성이 떨어짐. Optional 타입을 매개변수로 사용하면 메소드가 어떤 값을 필요로 하는지 명확하지 않아진다.
        // 또한 Null 포인터 예외가 발생할 수 있다. Optional 타입을 매개변수로 사용하면 해당 매개변수가 null 값을 가질 수 있기 때문에 이를 검사하지 않으면 NullPointerException이 발생할 수 있다.
        // 따라서, 가능하면 Optional 타입 대신에 @Nullable 어노테이션 또는 다른 방법을 사용하여 메소드 매개변수가 null 값을 가질 수 있음을 명시하는 것이 좋다.
        // 또는 메소드가 null 값을 허용하지 않도록 설계하는 것이 더 바람직할 수 있다.
        // 2) 맵의 키 타입 -> 맵의 key는 null일 수 없는데, Optional 타입으로 null을 반환할 수 있다? 작성하면 안되는 코드
        // 3) 인스턴스 필드 타입 -> 좋지 않은 설계. 상속(Inheritance) 또는 위임(Delegation)으로 사용

        // Optional.of(10)처럼 primitive 타입을 사용할 수 있지만, boxing과 unboxing으로 인해 성능에 좋지 않다.
        // OptionalInt.of(10)과 같이 primitive 타입용 Optional을 사용하자
        
        // Optional을 리턴하는 메소드에서 null을 리턴하지 말자. 사용자는 Optional이 제공하는 메소드를 사용해서 빈 값인지 아닌지를 판단하려고 하는데
        // null을 리턴한다? NullPointerException 발생! null이 아니라 Optional.empty()를 리턴해야 사용자가 올바르게 사용할 수 있다.
        Optional<Progress> progress = spring_boot.getProgress();
        progress.ifPresent(p -> System.out.println(p.getStudyDuration()));

        // Collection, Map, Stream, Array 등은 이미 null 값을 가질 수 있는 데이터 타입으로 설계되어 있기 때문에
        // Optional로 감싸는 것이 권장되지 않는다.
    }
}
```

## Optional API

```java
public class App {
    public static void main(String[] args) {
        List<OnlineClass> springClasses = new ArrayList<>();
        springClasses.add(new OnlineClass(1, "spring boot", true));
        springClasses.add(new OnlineClass(5, "rest api development", false));

        // Optional 만들기
        Optional<Object> o = Optional.of("TEST"); // of(null)은 null 매개변수 사용시 NPE 발생
        Optional<Object> o1 = Optional.ofNullable(null); // ofNullable(null)은 null 매개변수 허용
        Optional<Object> empty = Optional.empty();
        System.out.println(o1); // Optional.empty
        System.out.println(empty); // Optional.empty

        Optional<OnlineClass> spring = springClasses.stream()
                .filter(oc -> oc.getTitle().startsWith("spring"))
                .findFirst();

        Optional<OnlineClass> jpa = springClasses.stream()
                .filter(oc -> oc.getTitle().startsWith("jpa"))
                .findFirst();
        // Optional에 값이 있는지 없는지 확인하기: isPresent(), isEmpty() (java11부터)
        boolean present = spring.isPresent();

        OnlineClass onlineClass = spring.get();
        System.out.println(onlineClass.getTitle());

        // 비어있는 Optional에서 꺼내려고하면? NoSuchElementException 발생
        // OnlineClass onlineClass2 = jpa.get();
        // System.out.println(onlineClass2.getTitle());

        // Optional에 값이 있는 경우 그 값을 가지고 ~ 하라
        spring.ifPresent(oc -> System.out.println(oc.getTitle()));

        // Optional에 값이 있으면 가져오고, 없으면 Optional이 감싸고 있는 타입의 인스턴스를 리턴하라
        OnlineClass onlineClass1 = jpa.orElse(createNewClass());
        System.out.println(onlineClass1.getTitle());  // New Class
        OnlineClass onlineClassNull = jpa.orElse(null);
        System.out.println(onlineClassNull); // null

        // 위에 orElse는 인스턴스가 비었든 아니든 createNewClass() 코드를 실행해버린다.
        // orElseGet는 아래와 같은 함수인데
        // public T orElseGet(Supplier<? extends T> supplier) {
        //    return value != null ? value : supplier.get();
        // }
        // value가 null일 때 비로소 supplier.get()을 호출하여 연산을 실행하므로
        // 즉 람다의 lazy 동작방식으로인해 createNewClass() 코드를 실행하지 않게된다.
        OnlineClass onlineClass2 = spring.orElseGet(App::createNewClass);

        // Optional에 값이 있으면 가져오고, 없으면 에러를 던져라
        // OnlineClass onlineClass3 = jpa.orElseThrow(IllegalStateException::new);

        // Optional이 비어있지 않다는 가정, 비어있으면 의미없음
        Optional optional = spring.filter(oc -> !oc.isClosed());
        System.out.println(optional.isEmpty()); // true

        // Optional에 들어있는 값 변환하기
        System.out.println(spring.get().getClass());  // OnlineClass
        Optional<Integer> integer = spring.map(OnlineClass::getId);
        System.out.println(integer.get()); // 1

        // Optional에 들어있는 값을 Optional로 변환하면 복잡해지는데, flatMap을 사용하면 편리하다
        Optional<Optional<Progress>> progress = spring.map(OnlineClass::getProgress);
        Optional<Progress> progress1 = progress.orElse(Optional.empty());

        Optional<Progress> progress2 = spring.flatMap(OnlineClass::getProgress);

    }

    private static OnlineClass createNewClass(){
        return new OnlineClass(10, "New Class", false);
    }
}
```


## Date와 Time API

```java
public class App {
    /*
    그전까지 사용하던 java.util.Date 클래스는 mutable 하기 때문에 thead safe하지 않다.
    클래스 이름이 명확하지 않다. Date인데 시간까지 다룬다.
    버그 발생할 여지가 많다. (타입 안정성이 없고, 월이 0부터 시작한다거나..)
    * */
    public static void main(String[] args) throws InterruptedException {
        // 기계용 시간
        Instant instant = Instant.now();
        System.out.println(instant); // 기준시 UTC, GMT
        System.out.println(instant.atZone(ZoneId.of("UTC"))); // 기준시 UTC, GMT

        ZoneId zone = ZoneId.systemDefault();
        System.out.println("zone = " + zone); // Asia/Seoul

        ZonedDateTime zonedDateTime = instant.atZone(zone);
        System.out.println("zonedDateTime = " + zonedDateTime); // 2023-05-06T10:53:29.925536+09:00[Asia/Seoul]

        // 인류용 시간
        LocalDateTime now = LocalDateTime.now(); // 현재 시스템 Zone에 해당하는(로컬) 일시를 리턴한다. app이 미국에서 배포된다면 해당 서버의 Zone인 미국시간으로 찍힘
        System.out.println(now);
        LocalDateTime day = LocalDateTime.of(2023, Month.MAY, 6, 0, 0, 0); // 특정 일시
        ZonedDateTime laDateTime = ZonedDateTime.of(2023, 5, 6, 0, 0, 0, 0, ZoneId.of("America/Los_Angeles")); // 특정 Zone의 특정 일시
        System.out.println("laDateTime = " + laDateTime);

        // 기간을 표현하는 방법 (기계)
        Duration betweenMachineTime = Duration.between(Instant.now(), Instant.now().plus(100, ChronoUnit.DAYS));
        System.out.println("betweenMachineTime.toHours() = " + betweenMachineTime.toHours()); // 2400 (100 * 24hours)
        System.out.println(betweenMachineTime.getSeconds()); // 8640000 (100 * 24 * 60 * 60)

        // 기간을 표현하는 방법 (인류)
        LocalDate today = LocalDate.now(); // 2023-05-06
        LocalDate birthday = LocalDate.of(2023, Month.JULY, 15); // 2023-07-15
        Period between = Period.between(today, birthday);
        // between = P2M9D/ between.getDays() = 9 -> 월과 년도를 고려하지 않고 일 단위 차이만 반환한다
        System.out.println("between = " + between + "/ between.getDays() = " + between.getDays()); 
        // 아래는 기간을 반환한다.
        long daysBetween = ChronoUnit.DAYS.between(today, birthday);
        System.out.println("daysBetween = " + daysBetween);

        // 파싱 또는 포매팅
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        System.out.println(now.format(formatter)); // 05/06/2023
        LocalDate parse = LocalDate.parse("05/06/2023", formatter);
        System.out.println(parse); // 2023-05-06

        // 레거시 API 지원
        Date date = new Date();
        Instant ins = date.toInstant();
        Date newDate = date.from(instant);

        GregorianCalendar gregorianCalendar = new GregorianCalendar();
        ZonedDateTime dateTime = gregorianCalendar.toInstant().atZone(ZoneId.systemDefault()); // java8 to regacy
        GregorianCalendar from = GregorianCalendar.from(dateTime); // regacy to java8

        ZoneId zoneId = TimeZone.getTimeZone("PST").toZoneId(); // java8 to regacy
        TimeZone timeZone = TimeZone.getTimeZone(zoneId); // regacy to java8
    }
}
```