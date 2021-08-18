line_counter = 0        # 파일의 총 줄 수를 세는 변수
data_header = []        # 데이터의 필드값을 저장하는 리스트
customer_list = []      # customer의 개별 리스트를 저장하는 리스트

with open("customers.csv") as customer_data:   
    
    while 1: 
        data = customer_data.readline()
        if not data: break
        if line_counter == 0:
            data_header = data.split(",")

        else:
            customer_list.append(data.split(","))

        line_counter += 1

print("Header:", data_header)
for i in range(0, 10):
    print("Data", i, ":", customer_list[i])
print (len(customer_list))