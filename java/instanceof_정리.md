# 다형성과 instanceof 정리
서로 상속관계에 있는 클래스끼리 참조변수의 형변환이 가능하다. 자식타입에서 부모타입으로의 형변환은 기본형 데이터타입에서 큰 자료형의 형변환이 생략이 가능한 것처럼 생략가능하다. 하지만 부모타입에서 자식타입으로의 형변환은 가능하지만 생략은 불가능하다. 

형 변환이 양방향으로 자유롭지만, <u>부모타입의 인스턴스를 자손타입의 참조변수로 참조하는 것은 허용되지 않으므로 이러한 경우 형변환은 허용되지 않는다</u>. 컴파일러가 형변환의 형태만 보고 컴파일하더라도 실행 시 오류가 발생하는 것이다. 이렇게 형변환 전에 반드시 형변환이 가능한지 확인이 필요한 데 이 때 instanceof 연산자가 쓰이는 것이다. 

## 사용예시

```java
public boolean equals(Object o) {
	if(o instanceof Board) {  
		Board b = (Board) o;  
		if(id == b.id) {  
			return true;
		}
	} 
	return false;
} 
```

## 테스트

```java
class School {
    void schoolMethod() {
        System.out.println("학교");
    }
}

class Student extends School{
    void studentMethod() {
        System.out.println("학생");
    }
}

class Teacher extends School {
    void teacherMethod() {
        System.out.println("교사");
    }
}

class TestMain {
    public static void main(String[] args) {
        Student student = new Student();
        Teacher teacher = new Teacher();
        School school = new School();

        boolean a = student instanceof School;
        System.out.println(a);

        a = teacher instanceof School;
        System.out.println(a);

        a = school instanceof Student;
        System.out.println(a);

        a = school instanceof Teacher;
        System.out.println(a);

        // 컴파일러는 오류인식을 못하지만 형변환 불가
        // student = (Student) school; 
        
        // 컴파일러는 오류인식을 못하지만 형변환 불가
        // teacher = (Teacher) school; 
        
        System.out.println(school);
        System.out.println(student);
        
        // 형변환이 불가하기 때문에 오류발생
        // ((Student) school).studentMethod(); 
        
        school = student; // 자동 타입 변환
        
        // 컴파일러가 오류인식을 하고 메소드 호출 불가
        // school.studentMethod(); 
        System.out.println(school);

        a = school instanceof Student; // 거짓에서 참이 됨
        System.out.println(a);
     
        // 자식클래스의 메소드를 참조하려하므로 오류
        // school.studentMethod(); 
        
        // 오류x: 형변환 가능상태에서 명시적 형변환을 하여 호출
        ((Student) school).studentMethod(); 
        
        // 컴파일러는 오류인식을 못하지만 형변환 불가(school 
        // 인스턴스가 student를 참조하고 있으므로) 
        //((Teacher) school).teacherMethod(); 
        
        // 컴파일러가 오류인식을 하고 메소드 호출 불가
        // ((School) student).studentMethod(); 

    }
}

실행결과 
true
true
false
false
study.School@279f2327
study.Student@2ff4acd0
study.Student@2ff4acd0
true
학생
```
전제. 부모타입의 인스턴스를 자손타입의 참조변수로 참조하는 것은 허용되지 않는다. 

1. 참조변수의 형변환은 인스턴스에 아무런 영향을 주지 않는다. 형변환 연산자는 피연산자의 값을 변화시키는 것이 아니라 지정된 타입으로 형변환을 하고 그 결과를 반환하는 것 뿐이기 때문이다. 기본형이든 참조형이든 말이다. 기본형에서는 데이터 공간을 기준으로 형변환을 했다면, 참조형에서는 단지 사용가능한 멤버의 개수를 조절하는 것이다. 암시적(자동) 형변환이 사용할 멤버 변수를 제한하는 것이라면, 명시적(강제) 형변환은 제한된 멤버 변수를 다시 사용할 수 있게 만드는 것이라 볼 수 있다. 

2. 자바 컴파일러는 다형성의 실현을 위해 참조변수간 타입만 체크하고 컴파일 한다. 따라서 상속 관계에 있으면 형변환시 컴파일에서 오류가 발생하지 않는다. 하지만 JVM에서는 실제 인스턴스의 타입을 확인하고 실행되기 때문에 실행시 오류가 발생한다. 때문에 참조변수가 실제로 가르키는 인스턴스의 타입을 확인해야 한다.

3. 부모 인스턴스를 참조하고 있던 자식 인스턴스를 다시 자식 인스턴스로 강제 형변환하면 원래 자식 인스턴스의 모든 멤버들을 사용할 수 있다. → ((Student) school).studentMethod();

4. 자식 클래스에서 해당 메소드를 오버라이드하고 호출한다면 참조변수의 타입에 상관없이(=부모 타입의 참조변수를 사용하더라도) 자식 클래스의 오버라이딩 된 메소드가 호출된다. 하지만 멤버변수는 참조하고 있는 변수에 따른다. 