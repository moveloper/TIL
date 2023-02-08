## **서버 생성 후 해야할 것**

-  타임존 변경
    ```bash
    sudo rm /etc/localtime  
    sudo ln -s /usr/share/zoneinfo/Asia/Seoul /etc/localtime
    ```
-   호스트네임 변경: Amazon Linux 2에서 호스트 네임 변경하기
    ```bash
    sudo hostnamectl set-hostname 호스트 이름
    ```

-   자바 설치
    1.  설치 가능한 java 버전 확인   
    ```bash
    sudo yum list | grep jdk
    ``` 
    2. 목록에서 선택하여 java 설치 
    ```
    sudo yum install -y java-1.8.0-openjdk-devel.x86_64
    ```
    3. 설치된 java 버전 확인
    ```
    java -version
    ```
    4. java 위치 확인
    ```
    $ readlink -f /usr/bin/javac
    /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.282.b08-1.amzn2.0.1.x86_64/bin/javac
    ```
    5. /etc/profile 에 환경변수 등록
    ```
    $ sudo vim /etc/profile
    
    /etc/profile 맨 아래에 아래의 코드를 추가

    export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.282.b08-1.amzn2.0.1.x86_64
    export PATH="$PATH:$JAVA_HOME/bin"

    ```
    6. 바뀐 환경변수 적용
    ```
    source /etc/profile
    ```

- 톰캣 설치
    ```
    톰캣 관련 패키지 설치
    sudo yum install tomcat tomcat-admin-webapps tomcat-webapps tomcat-docs-webapp

    톰캣 실행
    sudo service tomcat start
    ``` 

- Maven 설치
  ```
  리포지토리에 Maven 패키지 추가
  sudo wget http://repos.fedorapeople.org/repos/dchen/apache-maven/epel-apache-maven.repo -O /etc/yum.repos.d/epel-apache-maven.repo

  패키지 버전 번호 설정  
  sudo sed -i s/\$releasever/6/g /etc/yum.repos.d/epel-apache-maven.repo
  
  설치
  sudo yum install -y apache-maven
  
  버전확인
  mvn --version
  ```