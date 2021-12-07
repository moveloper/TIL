# System.out.print와 write의 사용
System.out은 PrintStream의 객체이고, PrintStream 클래스에는 출력을 위한 메소드가
print류와 write류의 형태로 정의되어 제공한다.  
보통 print류의 메소드는 문자(열)을 출력하는 용도이고, write 메소드는 바이너리 데이터를 쓰기 위해 사용한다.

```java
import java.io.IOException;

public class PrintAndWrite {
	public static void main(String[] args) throws IOException {
		System.out.println("aaaa");
		System.out.write(97);
		System.out.write('\n');
		/* write(int값)함수 내부에 개행이 존재해야 flush되어 출력된다.
		 * if ((b == '\n') && autoFlush)
               out.flush();
         */
		
		byte[] b = "abcdefg\n".getBytes();
		byte[] c = {97, 98, 99, 100, 101, 102, 103, '\n'};
		System.out.println(b);
		System.out.write(b);
		System.out.write(c);
		// 파일 형태였으면 줄이 바뀔때마다 개행문자가 항상 존재하기 때문에 자동으로 flush가 발동된다.
		System.out.write(new byte[]{77, 78, 79});
	}
}


// 결과
aaaa
a
[B@156643d4
abcdefg
abcdefg
MNO
```

