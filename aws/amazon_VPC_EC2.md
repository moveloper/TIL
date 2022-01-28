# Amazon VPC
사용자가 정의한 가상 네트워크로 AWS 리소스를 시작할 수 있다. 이 가상 네트워크는 AWS의 확장 가능한 인프라를 사용한다는 이점과 함께 고객의 자체 데이터 센터에서 운영하는 기존 네트워크와 매우 유사하다.

* Virtual Private Cloud(VPC) : 사용자의 AWS 계정 전용 가상 네트워크. 전체 네트워크 주소 범위는 172.31.0.0/16 (리전 단위)

* 서브넷: 각각의 AZ에 1개씩 네트워크 주소가 할당된 VPC의 IP 주소 범위
172.31.0.0/20, 172.31.16.0/20, 172.31.32.0/20 172.31.48.0/20(AZ단위)

* 라우팅 테이블: 네트워크 트래픽을 전달할 위치를 결정하는 데 사용되는 라우팅이라는 규칙 집합. 172.31.0.0/16 (서브넷 단위)

* 인터넷 게이트웨이: VPC의 리소스와 인터넷 간의 통신을 활성화하기 위해 VPC에 연결하는 게이트웨이. 라우팅 테이블에 할당된다. (VPC 단위)

* Network ACL: Inbound(내부로의 통신), Outobound(외부로의 통신)를 기반으로 모든 통신을 허가한다. (서브넷 단위)

* Security Group: Inbound(내부로의 통신)는 모든 통신을 거부한다. outbound(외부로의 통신)은 모든 통신을 허가한다. 

* Region
   - ap-northeast-2 서울리전
   - ap-northeast-2a 가용영역a (1개 이상의 데이터센터)
   - ap-northeast-2b 가용영역b
   - ap-northeast-2c 가용영역c
   - ap-northeast-2d 가용영역d

## VPC를 활용하여 EC2 설정 
![](../assets/aws/서브넷자동할당IP설정.PNG)
![](../assets/aws/인스턴스세부정보.PNG)
![](../assets/aws/사용자설정.PNG)

* 사용자 데이터 부분에 인스턴스가 생성될 때 실행시킬 명령어를 입력할 수 있다. 루트 권한으로 실행되기 때문에 sudo와 같은 명령어가 필요없다. 
```sh
#!/bin/bash
amazon-linux-extras install docker -y
systemctl enable --now docker 
curl https://raw.githubusercontent.com/docker/docker-ce/master/components/cli/contrib/completion/bash/docker -o /etc/bash_completion.d/docker.sh
docker run -d -p 80:80 --name web02 koentc010/test_build:v2.0
usermod -a -G docker ec2-user
``` 

![](../assets/aws/DNS원리.PNG)
* Route53 호스팅 영역에서 도메인 이름(ex. star.com)에 대한 네임서버 주소를 부여받고, A유형 레코드(IPv4주소 라우팅, www.star.com ->1.2.3.4 /web.star.com -> 5.6.7.8 등...), CNAME(www.star.com -> web.star.com)과 같이 등록하면 해당 도메인을 호스팅할 수 있게 된다. 이러한 과정이 DNS 레코드 관리이다.

## 3대 스토리지 서비스 
1. 블록 스토리지: EBS
2. 파일 스토리지: EFS
    - 네트워크 공유폴더(Linux NFS)
3. 객체 스토리지: S3
     - 외부로 링크를 생성(https 등)한다는 특징 

* 볼륨을 생성한 후에는 동일한 가용 영역에 있는 인스턴스에만 볼륨을 연결할 수 있다.

```sh
sudo file -s /dev/xvdf
sudo mkfs -t xfs /dev/xvdf # 포맷 
lsblk
#NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
#xvda    202:0    0   8G  0 disk
#└─xvda1 202:1    0   8G  0 part /
#xvdf    202:80   0   8G  0 disk
sudo mkdir /data
sudo mount /dev/xvdf /data # 마운트
lsblk
#NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
#xvda    202:0    0   8G  0 disk
#└─xvda1 202:1    0   8G  0 part /
#xvdf    202:80   0   8G  0 disk /data

docker save -o test_build.tar koentc010/test_build:v1.0
sudo mv test_build.tar /data
unmount /data # 마운트 해제
```

## EBS Snpashot 
EBS 볼륨의 특정 시점 스냅샷을 생성하여 새 볼륨이나 데이터 백업의 기준으로 사용할 수 있다. 볼륨의 스냅샷이 주기적으로 생성되는 경우 스냅샷은 증분식이어서 새 스냅샷은 마지막 스냅샷 이후 변경된 블록만 저장한다. 연결되어 사용 중인 볼륨의 스냅샷도 만들 수 있다. 하지만 스냅샷 명령을 실행할 때 Amazon EBS 볼륨에 기록된 데이터만 캡처한다. 이 때 애플리케이션이나 운영 체제에 의해 캐시된 데이터가 제외될 수 있다. 

* 볼륨의 가용 영역이 달라서 마운트가 안될 때, 스냅샷으로 볼륨을 만들어 다른 가용 영역에서 사용할 수 있도록 활용 가능 

![](../assets/aws/스냅샷활용.PNG)