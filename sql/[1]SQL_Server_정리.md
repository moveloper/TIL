# SQL Server 정리

## Batch란 
* 동시에 컴파일되는 하나 이상의 T-SQL문
    * 로컬변수 등은 동일 B atch 내에서만 참조 가능
    * 동일 Batch에서 변경된 개체는 비 인식
    * 컴파일 오류시 Batch 취소
    * 런타임 오류시: 대부분은 실행중단, 제약 조건 위반 등 일부는 현재 문만 취소, 나머지 실행
    * 예) SSMS 쿼리 실행, 저장 프로시저, 기타

## GO란
출처: https://docs.microsoft.com/ko-kr/sql/t-sql/language-elements/sql-server-utilities-statements-go?view=sql-server-ver15
* SQL Server에서는 sqlcmd 및 osql 유틸리티와 SQL Server Management Studio 코드 편집기에서 인식되는 Transact-SQL 문이 아닌 명령. 이러한 명령을 사용하면 일괄 처리 및 스크립트를 쉽게 읽고 실행할 수 있다.
```sql
USE AdventureWorks2012;  
GO  
DECLARE @MyMsg VARCHAR(50)  
SELECT @MyMsg = 'Hello, World.'  
GO -- @MyMsg is not valid after this GO ends the batch.  
  
-- Yields an error because @MyMsg not declared in this batch.  
PRINT @MyMsg  
GO  
  
SELECT @@VERSION;  
-- Yields an error: Must be EXEC sp_who if not first statement in   
-- batch.  
sp_who  
GO  
```
* 다음 예에서는 일괄 처리를 두 개 만듭니다. 첫 번째 일괄 처리에는 데이터베이스 컨텍스트를 설정하는 USE AdventureWorks2012 문만 있습니다. 나머지 문에는 지역 변수를 사용합니다. 따라서 모든 지역 변수 선언을 단일 일괄 처리로 그룹화해야 합니다. 변수를 참조하는 마지막 문 다음까지 GO 명령을 사용하지 않으면 됩니다.
```sql
USE AdventureWorks2012;  
GO  
DECLARE @NmbrPeople INT  
SELECT @NmbrPeople = COUNT(*)  
FROM Person.Person;  
PRINT 'The number of people as of ' +  
      CAST(GETDATE() AS CHAR(20)) + ' is ' +  
      CAST(@NmbrPeople AS CHAR(10));  
GO  
```
* 다음 예에서는 일괄 처리에서 문을 두 번 실행합니다.
```sql
SELECT DB_NAME();  
SELECT USER_NAME();  
GO 2  
```
