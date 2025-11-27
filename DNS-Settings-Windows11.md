# تغيير إعدادات DNS على Windows 11 لاستخدام DNS عام

اتبع الخطوات التالية لتغيير إعدادات DNS الخاصة بك إلى DNS عام مثل Google (8.8.8.8) و Cloudflare (1.1.1.1):

1. اضغط على مفتاح Windows + I لفتح إعدادات النظام (Settings).
2. في الجانب الأيسر، اختر "Network & internet" (الشبكة والإنترنت).
3. انقر على "Advanced network settings" (إعدادات الشبكة المتقدمة).
4. انقر على "More network adapter options" (خيارات محول الشبكة الإضافية). ستفتح نافذة Network Connections.
5. حدد اتصال الشبكة النشط (عادةً Ethernet أو Wi-Fi) ثم انقر بزر الماوس الأيمن واختر "Properties" (خصائص).
6. في تبويب "Networking"، قم بالتمرير واختر "Internet Protocol Version 4 (TCP/IPv4)" ثم انقر على زر "Properties" (خصائص).
7. في النافذة الجديدة، اختر "Use the following DNS server addresses:" (استخدم عناوين خادم DNS التالية).
8. في خانة Preferred DNS Server اكتب: 8.8.8.8
9. في خانة Alternate DNS Server اكتب: 1.1.1.1
10. اضغط على "OK" لحفظ الإعدادات.
11. أغلق النوافذ وأعد تشغيل الجهاز أو افصل وأعد توصيل الاتصال بالشبكة.
12. افتح نافذة الطرفية (Terminal) واكتب الأمر التالي لاختبار إعدادات DNS الجديدة:
```
nslookup cluster0.mongodb.net
```
يجب أن ترى عنوان IP يعيد تشغيل اسم النطاق بنجاح.

إذا كنت بحاجة إلى أي مساعدة إضافية في هذه الخطوات، أخبرني.
