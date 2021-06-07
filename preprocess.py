f1 = open("Input/input.txt", 'r')

str1 = f1.read()

f1.close()

from hanspell import spell_checker

res = spell_checker.check(str1)

res_str = str(res)

str2 = res_str[res_str.find("checked='")+9 : res_str.find("', errors=")]

f2 = open("Input/input.txt", 'w')

f2.write(str2)

f2.close()
