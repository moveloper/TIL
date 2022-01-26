# 오라클 SYS, SYSTEM, SYSDBA, SYSOPER 

## 계정 

### SYS

 Oracle DB 관리자로 Super user이다. Oracle 시스템의 기반이 되는 Data dictionary 소유자이며 DB 생성과 삭제도 가능하다.

 사실 계정이라기 보단 Oracle 시스템의 총 관리자라고 보는게 맞고 아래서 설명할 SYSDBA 권한을 갖는다.

 

### SYSTEM

 SYS와 유사한 권한을 가지고 있지만 DB 생성과 삭제는 불가능하다. 운영을 위한 권한을 갖는다 보면 된다. 아래서 설명할 SYSOPER의 권한을 갖는다.

 

 얼핏보면 SYS와 SYSTEM 계정이 별차이가 없는 것 아닌가 싶을 수도 있지만 SYS는 Oracle 시스템을 유지, 관리, 생성하기 위한 모든 권한을 갖는 계정이고, SYSTEM은 생성된 DB를 운영, 관리하기 위한 관리자 계정이라고 보면 된다.

 

## 권한

### SYSOPER

 데이터베이스를 운영 관리하기 위한 권한으로 SYSTEM 계정이 갖는다. 아래 권한 외에 데이터베이스 자체를 생성 삭제하거나, 다른 유저 소유의 데이터에는 접근할 수 없다.

 - 인스턴스와 데이터베이스에 대한 startup, mount, open shutdown, dismount, close 권한

 - 데이터베이스 백업, 로그파일을 이용한 복구 등에 대한  database backup, archive log, recover 권한

 

### SYSDBA

  SYSOPER의 권한 뿐 아니라 데이터베이스 생성과 삭제, Oracle 시스템에서 모든 권한을 갖는다. SYS 계정이 갖는 권한.