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

Netflix Dashboard - Tableau - link

## Project Objective:

Comprehensive analysis of Amazon sales data to deliver strategic recommendations for business growth.

**Key Focus Areas:**

**Market Insights:** Identifying demand patterns and seasonality.

**Financial Performance:** Uncovering profitability drivers and cost inefficiencies.

**Business Impact:** Providing actionable Solutions to boost revenue, optimize product assortment, and streamline operations.

## Approach:

To extract meaningful insights from the dataset, I used **SQL** and **Tableau** for data analysis and visualization. Visualizing the data helped identify key trends and factors influencing sales performance. The core of my process was asking targeted business questions and converting data insights into actionable strategic conclusions.

##  Key Questions Answered in This Project:

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
  ROUND((UnitPrice * Quantity * (1 - Discount)+ ShippingCost + Tax), 2) AS calc_base_ship_tax
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
  MIN(OrderDate) AS first_purchase_date,
  MAX(OrderDate) AS last_purchase_date,
  DATE_DIFF(MAX(OrderDate), MIN(OrderDate), DAY) AS total_days,
  ROUND(DATE_DIFF(MAX(OrderDate), MIN(OrderDate), DAY) / 365.25, 2) AS accurate_years,
  ROUND(DATE_DIFF(MAX(OrderDate), MIN(OrderDate), DAY) / 30.4375, 2) AS accurate_months
FROM `project-sales-dataset.sales_dataset_a.general_data`
```

<img src="{{ site.baseurl }}/images/check_years_month_date.png">

### 2. We review sales revenue by category to identify top-performing segments, spot trends, and optimize business decisions.

```sql
SELECT 
  EXTRACT(YEAR FROM OrderDate) AS year,
  Category,
  ROUND(SUM(UnitPrice * Quantity * (1 - Discount)), 2) AS revenue
FROM `project-sales-dataset.sales_dataset_a.general_data` 
GROUP BY year, Category
ORDER BY Category, year ASC
```
We look at revenue trends by year. We can also focus on specific periods and compare the same periods across years.

<img src="{{ site.baseurl }}/images/revenue category year.png">

### 3. продажи по категориям
вывод: видимо в силу того, что это тестовые данные, здесь нет отличия по категориям практически, отличаются незначительно

```sql
SELECT  Category, ROUND(SUM(UnitPrice * Quantity * (1 - Discount)), 2) AS revenue
FROM `project-sales-dataset.sales_dataset_a.general_data`
GROUP BY Category
ORDER BY revenue DESC
```
<img src="{{ site.baseurl }}/images/category_sales.png">

### 4. считаем ревенью по категориям и по годам

```sql
SELECT
 EXTRACT(YEAR FROM OrderDate) AS year,
 Category,
 ROUND(SUM(UnitPrice * Quantity * (1 - Discount)), 2) AS revenue
FROM `project-sales-dataset.sales_dataset_a.general_data`
GROUP BY year, Category
ORDER BY year, revenue DESC
```

<img src="{{ site.baseurl }}/images/revenue_category_year.png">

### 5. смотрим ревенью по штатам
можем посмотрет по штатам в разрезе разных годов
но к сожалению, нам это не даст ничего так как данные одинаковые за каждый год но в целом это могло бы нам помочь понять отличия в объеме покупок за год в каждом штате

```sql
SELECT State, ROUND(SUM(UnitPrice * Quantity * (1 - Discount)), 2)   AS revenue 
FROM `project-sales-dataset.sales_dataset_a.general_data`
WHERE EXTRACT(YEAR FROM OrderDate) = 2020
GROUP BY State
ORDER BY revenue DESC
```

<img src="{{ site.baseurl }}/images/revenue_state.png">

### 6. средний чек заказа (не клиента, а если бы были уникальный айди могли бы посмотреть средний чек по клиентам) по месяцам
 в нашем случае опять же чеки почти не отличаются, то есть отличаются незначительно, но допустим, что это значительные отличия, совместно с другой аналитикой, мы можем это использовать для принятия решений

например почему у нас нет скачка перед рождеством, днем матери, черной пятницей и так дале, значит наши клиенты несут деньги куда-то еще

```sql
SELECT
 DATE_TRUNC(OrderDate, MONTH) AS month,
 ROUND(AVG(order_total), 2) AS avg_order_monthly
FROM (
 SELECT
   OrderID,
   OrderDate,
   SUM(UnitPrice * Quantity * (1 - Discount)) AS order_total
 FROM `project-sales-dataset.sales_dataset_a.general_data`
 GROUP BY OrderID, OrderDate
) temp_table
GROUP BY month
ORDER BY month
```

<img src="{{ site.baseurl }}/images/avg_order.png">

<img src="{{ site.baseurl }}/images/avg_order_by_month.png">

