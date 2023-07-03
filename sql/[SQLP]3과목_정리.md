# SQLP 3과목 SQL 고급 활용 및 튜닝 

## SQL 튜닝 프레임워크 
1. 소량데이터인가 ? 
    - 그렇다
      - 인덱스
        - 필수 조건 중 가급적 '=' 선두 
        - 테이블 엑세스 최소화 컬럼 추가
      - NL JOIN
2. 부분범위 처리 가능한가?
    - 그렇다
      - 인덱스: 소트를 생략할 수 있는 인덱스 구성
        - 필수 '=' 조건 컬럼
        - ORDER BY 컬럼
      - NL JOIN
      - 페이징 처리 
3. 그 외 상황 
    - FULL SCAN
      - 병렬처리 
      - Partition
    - HASH JOIN
    - 클러스터링
      - IOT
      - Cluster
    - Array 처리
- 파싱 부하 경감
  - 바인드 변수
  - 세션 커서 캐싱
  - 애플리케이션 커서 캐싱
- 주요 체크리스트 
  - DB함수 활용 기준
  - 페이징 처리 패턴
  - 옵션조건 처리 패턴
  - 통계정보 수집 정책

## 소트 튜닝
- SORT(ORDER BY)
  - 데이터 정렬을 위해 ORDER BY 오퍼레이션을 수행할 때 발생
  - WHERE A=값 ORDER BY B 일 때 A+B 인덱스를 사용하면 SORT ORDER BY 연산을 대체할 수 있다(A만 있거나 A와 B사이에 다른 컬럼이 있으면 대체할 수 없다)
  - 부분범위 처리일 때만 유리. 인덱스를 스캔하면서 결과집합을 끝까지 Fetch 한다면 오히려 I/O 및 리소스 사용 측면에서 손해
- SORT(GROUP BY): 
  - 소팅 알고리즘을 사용해 그룹별 집계를 수행할 때 나타난다.(GROUP BY와 ORDER BY 같이 사용시)
  - GROUP BY를 위해 전체 데이터를 정렬하지 않는다. 읽는 레코드마다 Sort 알고리즘을 이용해 값을 찾아가서 COUNT, SUM, MIN, MAX 연산을 수행한다. 따라서 결과집합 건수만큼의 Sort Area를 사용한다. 집계 대상 집합이 아무리 커도 GROUP BY 결과집합이 몇 건 되지 않으면 TEMP TABLE SPACE를 사용하지 않는다. 
  - SORT GROUP BY NO SORT: GROUP BY절에 사용된 컬럼이 선두인 결합 인덱스나 단일 컬럼 인덱스를 사용하면 별도의 정렬과정 없이 인덱스에 의해 정렬된 결과를 얻을 수 있음
- ORDER BY절에 포함되지 않는 컬럼도 SELECT절에서 사용된다면, Sort Area를 사용한다. 
- NLJ_BATCH: NL JOIN시 Single Block I/O에 의한 속도저하를 개선할 수 있음. 그러나 I/O를 순차적으로 처리하지 않아 인덱스를 이용한 정렬은 항상 보장 받을 수 없다. NO_NLJ_BATCH 힌트를 사용해 인덱스의 정렬을 보장받아 부분범위 처리를 한 SQL들에 대해 정상적인 데이터를 가져올 수 있으나, 인덱스가 UNUSEBLE 상태가 되거나 조건이 바뀌어 더 이상 인덱스를 이용한 정렬이 불가능하다면 데이터가 잘못 추출되는 현상은 여전히 발생할 수 있다. 부분범위 처리를 유도하고 싶다면 ORDER BY절을 명시하고 사용하자.
https://dataonair.or.kr/db-tech-reference/d-lounge/technical-data/?mod=document&uid=235926

## 파티셔닝 
- 파티션 푸루닝(Partition Pruning): 하드파싱이나 실행 시점에서 SQL 조건절을 분석하여 읽지 않아도 되는 파티션 세그먼트를 엑세스 대상에서 제외시키는 기능
  - PARTITION RANGE SINGLE -> 파티션 프루닝 
  - PARTITION RANGE ALL -> 파티션 프루닝 X
  - WHERE절 조건의 컬럼을 가공하거나 HASH 파티션일 경우 등치조건(=)이나 IN 조건이 아닐 때 파티션 프루닝이 발생하지 않는다