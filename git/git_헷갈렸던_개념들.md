1. git commit 전까지 branch가 분기하지 않는다. 즉 develop 브랜치나 master 브랜치를 자유롭게 왔다갔다 가능하다.
2. develop 브랜치가 업데이트 되었고 이를 현재 작업중인 feature 브랜치에 바로 pull 받으면 merge가 된다. git pull = git fetch + git merge이기 때문이다. 