# Procedure to install and run the Code

### Clone the repo
```bash
git clone https://github.com/Akilan1999/Centralized_IOE.git
```
Navigate to the directory
```bash
cd Centralized_IOE/
```
### Add you sql username and password

Navigate to config/database.js
```javascript
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'ADD YOUR USERNAME', //DB username
  password: 'ADD YOUR PASSWORD', //DB password
  database: 'shared_electricity'
});
```

### Adding the sql database to your localhost

1. Login to SQL
```bash
mysql -u root -p
```
2. Import shared_electricity.sql
```sql
mysql> source \shared_electricity.sql;
```

3. Basic insert statements which are nessary
```sql
mysql>insert into users values(0,'<your name>','<your username>','<your password>');
```
