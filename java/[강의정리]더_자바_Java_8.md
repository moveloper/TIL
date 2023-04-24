# 더 자바, Java 8

> 요약pdf: 구글드라이브


## 3. Java가 기본으로 제공하는 함수형 인터페이스
- java.lang.funcation 패키지: 자바에서 미리 정의해둔 자주 사용할만한 함수 인터페이스
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
                .flatMap(Collection::stream)
                .forEach(oc -> System.out.println(oc.getId()));

        System.out.println("10부터 1씩 증가하는 무제한 스트림 중에서 앞에 10개 빼고 최대 10개 까지만");
        Stream.iterate(10, i -> i + 1)
                .skip(10)
                .limit(10)
                .forEach(System.out::println);

        System.out.println("자바 수업 중에 Test가 들어있는 수업이 있는지 확인");
        boolean test = javaClasses.stream()
                .allMatch(oc -> oc.getTitle().contains("Test"));
        System.out.println(test);

        System.out.println("스프링 수업 중에 제목에 spring이 들어간 제목만 모아서 List로 만들기");
        List<String> spring = springClasses.stream()
                .filter(oc -> oc.getTitle().contains("spring"))
                .map(OnlineClass::getTitle)
                .collect(Collectors.toList());
        spring.forEach(System.out::println);
    }
}

```