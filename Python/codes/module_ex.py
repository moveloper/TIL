import urllib.request
response = urllib.request.urlopen("https://www.naver.com")
print(response.read())