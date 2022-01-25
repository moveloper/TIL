# 개발 DB 생성
먼저 AWS에서 EC2 인스턴스를 생성한 후에 도커로 오라클을 설치해서 사용하는 방식을 택했다.
EC2 생성: https://zzang9ha.tistory.com/329?category=954133

```sh
[ec2-user@ip-172-31-11-12 ~]$ sudo rm /etc/localtime
[ec2-user@ip-172-31-11-12 ~]$ sudo ln -s /usr/share/zoneinfo/Asia/Seoul /etc/localtime
[ec2-user@ip-172-31-11-12 ~]$ sudo yum install docker
[ec2-user@ip-172-31-11-12 ~]$ sudo usermod -aG docker ec2-user
[ec2-user@ip-172-31-11-12 ~]$ sudo systemctl start docker
[ec2-user@ip-172-31-11-12 ~]$ sudo docker run -d --name oracle11g -p 1521:1521 jaspeen/oracle-xe-11g
[ec2-user@ip-172-31-11-12 ~]$ sudo docker exec -it oracle11g bash
```
### 유저생성/권한부여 
sqlplus 로그인  
sys as sysdba / oracle    
system / oracle  
create user homerun identified by homerun;   
grant connect, resource to homerun;   

### dbeaver에서 system 관련 스키마가 안보일 경우  
Connection right-click -> Connection view... -> Show system objects