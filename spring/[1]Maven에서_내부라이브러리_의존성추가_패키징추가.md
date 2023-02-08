# Project에 local jar를 dependency 거는 법
## 1. pom.xml 에 project.lib.path 추가

```
<properties>
   <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
   <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
   <project.lib.path>${project.basedir}/src/main/webapp/WEB-INF/lib</project.lib.path>
</properties>
2. 추가하고자 하는 dependency 추가

<dependency>
    <groupId>com.galaxia</groupId>
    <artifactId>billgateAPI</artifactId>
    <version>1.0</version>
    <scope>system</scope>
    <systemPath>${project.lib.path}/billgateAPI.jar</systemPath>
</dependency>
```
* groupId, artifactId, version은 원하는 대로, scope, systemPath만 잘 확인해준다.

 
## 2. Project에 local jar를 packaging 하는 법
- pom.xml war plugin에 다음을 추가
```
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-war-plugin</artifactId>

    <configuration>
        <webResources>
            <resource>
                <!-- 로컬 lib파일 경로 -->
                <directory>${project.basedir}/local-repo</directory>
                <includes>
                    <include>추가할라이브러리.jar</include>
                    ...
                    ...
                </includes>
                <targetPath>WEB-INF/lib</targetPath>
            </resource>
        </webResources>
    </configuration>
</plugin>
```