---
title: "Portfolio item number 2"
excerpt: "Short description of portfolio item number 2 <br/><img src='/images/500x300.png'>"
collection: portfolio
layout: single
---

<style>
.page__content p {
  text-align: justify;
}
</style>

{% include toc %}

**Tools Used:** Excel, MySQL, BigQuery (Google), Tableau

[Datasets Used](https://www.kaggle.com/datasets/rohiteng/amazon-sales-dataset) 

SQL Analysis (Code) - link

Amazon Sales Dashboard - Tableau - link

## Project Objective

Comprehensive analysis of Amazon sales data to deliver strategic recommendations for business growth.

**Key Focus Areas:**

**Market Insights:** Identifying demand patterns and seasonality.

**Financial Performance:** Uncovering profitability drivers and cost inefficiencies.

**Business Impact:** Providing actionable Solutions to boost revenue, optimize product assortment, and streamline operations.

## Approach

To extract meaningful insights from the dataset, I used **SQL** and **Tableau** for data analysis and visualization. Visualizing the data helped identify key trends and factors influencing sales performance. The core of my process was asking targeted business questions and converting data insights into actionable strategic conclusions.

##  Key Questions Answered in This Project

### 1. We would like to analyze profit and sales volume across different product categories, cities, and time periods in order to identify trends, regional performance differences, and potential growth opportunities.
  
Since our primary goal is to understand profitability, revenue, and operational efficiency, we first need to identify and validate the data available in the dataset.

During the exploration process, I discovered a column called TotalAmount that lacked a clear description, so we verified what components were included in its calculation.

```sql
SELECT 
  UnitPrice,
  Quantity,
  Discount,
  Tax,
  ShippingCost,
  TotalAmount,
  ROUND ((UnitPrice * Quantity * (1 - Discount)+ ShippingCost + Tax), 2) AS calc_base_ship_tax
FROM `project-sales-dataset.sales_dataset_a.general_data`
LIMIT 10
```

<img src="{{ site.baseurl }}/images/totalamountcheck.png">

After validation, I confirmed that TotalAmount consists of:

* Unit Price × Quantity
* Minus Discount
* Plus Shipping Costs
* Plus Taxes

Therefore, revenue can be defined as:
Revenue = (Unit Price × Quantity) − Discount

**Timeframe Validation:** Determine the exact start/end dates, total years, and monthly duration of the dataset

```sql
SELECT
  MIN (OrderDate) AS first_purchase_date,
  MAX (OrderDate) AS last_purchase_date,
  DATE_DIFF (MAX (OrderDate), MIN (OrderDate), DAY) AS total_days,
  ROUND (DATE_DIFF (MAX (OrderDate), MIN (OrderDate), DAY) / 365.25, 2) AS accurate_years,
  ROUND (DATE_DIFF (MAX (OrderDate), MIN (OrderDate), DAY) / 30.4375, 2) AS accurate_months
FROM `project-sales-dataset.sales_dataset_a.general_data`
```

<img src="{{ site.baseurl }}/images/check_years_month_date.png">

### 2.  Sales by Category

With nearly five years of data available, we can now analyze revenue by category to obtain an overall view of sales performance

```sql
SELECT  Category, ROUND (SUM (UnitPrice * Quantity * (1 - Discount)), 2) AS revenue
FROM `project-sales-dataset.sales_dataset_a.general_data`
GROUP BY Category
ORDER BY revenue DESC
```
<img src="{{ site.baseurl }}/images/category_sales.png">

Since the dataset contains sample data, the differences in revenue across categories are relatively minor. Using real business data, we could determine which product category contributed the most to overall sales revenue.

### 3. Sales revenue by category & year

We review  Sales revenue by category to identify top-performing segments, spot trends, and optimize business decisions.

```sql
SELECT 
  EXTRACT (YEAR FROM OrderDate) AS year,
  Category,
  ROUND (SUM (UnitPrice * Quantity * (1 - Discount)), 2) AS revenue
FROM `project-sales-dataset.sales_dataset_a.general_data` 
GROUP BY year, Category
ORDER BY Category, year ASC
```
We look at revenue trends by year. We can also focus on specific periods and compare the same periods across years.

<img src="{{ site.baseurl }}/images/revenue category year.png">

### 4. считаем ревенью по категориям и по годам

```sql
SELECT
 EXTRACT (YEAR FROM OrderDate) AS year,
 Category,
 ROUND (SUM (UnitPrice * Quantity * (1 - Discount)), 2) AS revenue
FROM `project-sales-dataset.sales_dataset_a.general_data`
GROUP BY year, Category
ORDER BY year, revenue DESC
```

<img src="{{ site.baseurl }}/images/revenue_category_year.png">

### 5. смотрим ревенью по штатам
можем посмотрет по штатам в разрезе разных годов
но к сожалению, нам это не даст ничего так как данные одинаковые за каждый год но в целом это могло бы нам помочь понять отличия в объеме покупок за год в каждом штате

```sql
SELECT State, ROUND (SUM (UnitPrice * Quantity * (1 - Discount)), 2)   AS revenue 
FROM `project-sales-dataset.sales_dataset_a.general_data`
WHERE EXTRACT (YEAR FROM OrderDate) = 2020
GROUP BY State
ORDER BY revenue DESC
```

<img src="{{ site.baseurl }}/images/revenue_state.png">

### 6. средний чек заказа (не клиента, а если бы были уникальный айди могли бы посмотреть средний чек по клиентам) по месяцам
 в нашем случае опять же чеки почти не отличаются, то есть отличаются незначительно, но допустим, что это значительные отличия, совместно с другой аналитикой, мы можем это использовать для принятия решений

например почему у нас нет скачка перед рождеством, днем матери, черной пятницей и так дале, значит наши клиенты несут деньги куда-то еще

```sql
SELECT
 DATE_TRUNC (OrderDate, MONTH) AS month,
 ROUND (AVG (order_total), 2) AS avg_order_monthly
FROM (
 SELECT
   OrderID,
   OrderDate,
   SUM (UnitPrice * Quantity * (1 - Discount)) AS order_total
 FROM `project-sales-dataset.sales_dataset_a.general_data`
 GROUP BY OrderID, OrderDate
) temp_table
GROUP BY month
ORDER BY month
```



<img src="{{ site.baseurl }}/images/avg_order.png">

<img src="{{ site.baseurl }}/images/avg_order_by_month.png">



### 7. проверка на наличие заказов с двумя товарами

для того, чтобы делать кросс-сейлс и апсейлс, мы могли бы проанализировать какие товары чаще всего покупают вместе, чтобы понять категории и зависимости

но в данном датасете все заказы содержат только 1 товар

```sql
SELECT  OrderID,
   COUNT (DISTINCT ProductID) AS unique_products
FROM `project-sales-dataset.sales_dataset_a.general_data`
GROUP BY OrderID
HAVING COUNT (DISTINCT ProductID) > 1
```

<img src="{{ site.baseurl }}/images/check_2items_order.png">

 вот так мы могли бы проверить встречаются ли пары товаров в заказах

 здесь происходит дублирование таблицы и  составление уникальных пар (дубликаты сокращаются)

```sql
SELECT
   a.ProductName AS product_1,
   b.ProductName AS product_2,
   COUNT (*) AS pair_frequency,
   ROUND (SUM ((a.UnitPrice * a.Quantity * (1 - a.Discount)) +
       (b.UnitPrice * b.Quantity * (1 - b.Discount))), 2) AS pair_revenue
FROM `project-sales-dataset.sales_dataset_a.general_data` a
JOIN `project-sales-dataset.sales_dataset_a.general_data` b
   ON a.OrderID = b.OrderID
   AND a.ProductID < b.ProductID
GROUP BY product_1, product_2
ORDER BY pair_frequency DESC
```

### 8. одновременно мы можем посмотреть средний заказ по годам 
сделать какие-то выводы из этого и при необходимости 
углубиться в среднюю стоимость заказа по месяцам или каким-то еще периодам

```sql
SELECT
   EXTRACT (YEAR FROM OrderDate) AS year,
   ROUND (AVG(order_total), 2) AS avg_order_value
FROM (
   SELECT
       OrderID,
       OrderDate,
       SUM (UnitPrice * Quantity * (1 - Discount)) AS order_total
   FROM `project-sales-dataset.sales_dataset_a.general_data`
   GROUP BY OrderID, OrderDate
) temp_table
GROUP BY year
ORDER BY year
```

<img src="{{ site.baseurl }}/images/avg_order_year.png">

### 9. смотрим за каждый год какой у нас ревенью по каждому клиенту 

но наверное лучше ха каздый год отдельно посмотреть

```sql
SELECT
   CustomerID, CustomerName,
   EXTRACT (YEAR FROM OrderDate) AS year,
   ROUND (SUM (UnitPrice * Quantity * (1 - Discount)), 2) AS revenue_per_year
FROM `project-sales-dataset.sales_dataset_a.general_data`
GROUP BY CustomerID, CustomerName, year
ORDER BY CustomerID, year
```


здесь мы выяснили, чтто кастомер айди не уникальный (а должен был бы быть)
это плохо, тк мы не можем агрегировать данные нормально, тк имена клиентов могут быть идентичные , а вот айдишник должен бы бы отличатся и быть уникальным
если Customer ID не уникален или ненадёжен, то классический RFM-анализ будет некорректным или сильно ограниченным.


<img src="{{ site.baseurl }}/images/not_unique_id.png">

