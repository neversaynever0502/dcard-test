### 線上網址
https://dcard-test.neversaynever.work/

### 架構

使用express來當我們的後端框架，使用redis來當我們的暫存資料庫

在測試中使用mocha套件

伺服器架在aws ec2上面，使用nginx和let's enscript去做https和轉址

### 為何選用redis

redis適合存放cache資料，且速度快（key-value-pair結構）

而我們此架構中，使用者連線資料並不需要永久保存

可使用redis中自動expire time（TTL)，來刪除不需要的資料

因此我們選用redis當我們的資料庫。

### 事前準備
##### 1.產生.env檔

複製.env.example檔案，並改名成.env

在裡面填上redis的連線資料（附在文件中）

##### 2.安裝套件

npm install
npm i -g mocha

##### 3.啟動服務

npm start

##### 4.跑測試

開另外一個終端機

mocha

### 示意圖
![alt](https://github.com/neversaynever0502/dcard-test/blob/master/demo/demo1.png)
![alt](https://github.com/neversaynever0502/dcard-test/blob/master/demo/demo2.png)
![alt](https://github.com/neversaynever0502/dcard-test/blob/master/demo/demo3.png)