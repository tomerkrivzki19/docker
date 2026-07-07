: פתרון פרוויקט כיתה

1 להרזות את ה-(Build stage-Multi (Image)
מדדו שוב והשוו — כמה מגה חסכתם?:
התשובה : היה לי 230 מגה-ביט לאימג ועכשייו אחרי השכתוב הוא עומד על 15 מגה-ביט

2 תלות תקינה בין קונטיינרים )Healthcheck

הוספתי את הפקודת קד הזאת לקוד docker-compose.yml :
mongo:
image: mongo:7
healthcheck:
test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
interval: 30s
timeout: 10s
retries: 3
start_period: 30s

ואת זאת :

depends_on:
mongo:
condition: service_healthy

3 להריץ כמשתמש לא-root( אבטחה(

הוספתי את הקוד הזה DOCKERFILE:

RUN chown -R node:node /app

USER node

4 הפרדת סביבות: Dev מול Prod
יצרתי טופס חדש של docker-compose.yml
הכנסתי בתוכו:

services:
app:
command: npm run dev
volumes: - .:/app - /app/node_modules
environment:
NODE_ENV: development

עשיתי את זה כדי docker-compose.override.yml = תוספות ל־Development

אחרי זה הוספתי סקריפט של
"dev": "nodemon index.js"

ב package.json

ולאחר מכן הוספתי את nodemone ל devDependencies
כדי שירוץ גם מחוץ ללוקל

הפקודות :
בסביבת Dev הרצתי:
docker compose up --build

פקודה זו ממזגת את docker-compose.yml עם docker-compose.override.yml, ולכן האפליקציה רצה עם nodemon ו-bind mount לקוד המקומי.

בסביבת Prod הרצתי:
docker compose -f docker-compose.yml up --build

פקודה זו משתמשת רק בקובץ הראשי, ולכן האפליקציה רצה בצורה נקייה עם node index.js, בלי mount ובלי dev-dependencies.

5 בונוס: Nginx כ-Proxy Reverse
Reverse Proxy הוא שרת שיושב לפני האפליקציה ומקבל את הבקשות מהמשתמשים. במקום שהמשתמש יפנה ישירות לשרת Node.js, הוא פונה ל־Nginx, ו־Nginx מעביר את הבקשה פנימה אל שירות ה־app.

כמעט כל אפליקציית production יושבת מאחורי reverse proxy כי הוא נותן שכבת ניהול, אבטחה וביצועים לפני האפליקציה עצמה.

אפליקציית Node.js לבד יודעת לטפל בבקשות HTTP, אבל Nginx מוסיף יכולות חשובות כמו:
ניהול תעבורה, Load Balancing בין כמה שרתי app, טיפול טוב יותר בקבצים סטטיים, הגבלת בקשות, SSL/HTTPS, לוגים, caching, והסתרה של השירות הפנימי מהאינטרנט.

במקרה שלנו, המשתמש ניגש ל־localhost בפורט 80, הבקשה מגיעה ל־Nginx, ו־Nginx מעביר אותה לשירות app בפורט 3000 בתוך רשת Docker.

Reverse Proxy מאפשר לנתב בקשות מבחוץ אל שירותים פנימיים, להסתיר את האפליקציה מהמשתמשים, ולספק יכולות production כמו load balancing, אבטחה, SSL ו־caching.

הפקודה להרצה
docker compose -f docker-compose.yml up --build
