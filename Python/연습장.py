def asterisk_test(x, y, *args):
  a, b, *c = args
  return x, y, a, b, c

print(asterisk_test(1,2,3,4,5,6,7,8))
