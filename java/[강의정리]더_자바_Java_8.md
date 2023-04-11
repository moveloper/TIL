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