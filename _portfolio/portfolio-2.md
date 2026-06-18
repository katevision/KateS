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

[Dataset Used](https://www.kaggle.com/datasets/rohiteng/amazon-sales-dataset) 

SQL Analysis (Code) - link

Amazon Sales Dashboard - Tableau - link

## Project objective

Comprehensive analysis of Amazon sales data to deliver strategic recommendations for business growth.

**Key Focus Areas:**

**Market insights:** Identifying demand patterns and seasonality.

**Financial performance:** Uncovering profitability drivers and cost inefficiencies.

**Business impact:** Providing actionable solutions to boost revenue, optimize product assortment, and streamline operations.

## Approach

To extract meaningful insights from the dataset, I used **SQL** and **Tableau** for data analysis and visualization. Visualizing the data helped identify key trends and factors influencing sales performance. The core of my process was asking targeted business questions and converting data insights into actionable strategic conclusions.

##  Key questions answered in this project

### 1. Some data validation

#### 1.A. Revenue
  
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

**Unfortunately, due to the absence of cost of goods sold (COGS) and shipping cost data in the dataset, profit and profitability metrics cannot be reliably calculated.**

#### 1.B. Timeframe validation
Determine the exact start/end dates, total years, and monthly duration of the dataset.
This information will help us determine which additional data cuts and dimensions can be explored, such as year-over-year, seasonal, and other analytical views.

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

#### 1.C. Uniqueness of CustomerID

While exploring the dataset, I identified a potential issue with the CustomerID column: it appeared not to be unique, despite being intended as a unique identifier. I subsequently performed an analysis to test this hypothesis.


```sql
SELECT
    COUNT(*) AS total_rows,
    COUNT(DISTINCT CustomerID) AS unique_customer_ids
FROM `project-sales-dataset.sales_dataset_a.general_data`
```

<img src="{{ site.baseurl }}/images/unicness_customerid.png"> 

The analysis confirms that this field is not unique. Consequently, certain analyses cannot be performed reliably, as they depend on the availability of unique customer identifiers for accurate customer-level insights.

#### 1.D. Orders with multiple products

Another limitation of the dataset is the composition of order contents. Cross-sell analysis would ideally require examining which products are purchased together and how these patterns vary by season. To determine whether such analysis is feasible, I will first assess how many orders contain two or more products.

```sql
WITH order_items AS (
    SELECT
        OrderID,
        COUNT (DISTINCT ProductID) AS product_count
    FROM `project-sales-dataset.sales_dataset_a.general_data`
    GROUP BY OrderID)

SELECT
    COUNT (*) AS orders_with_2plus_products
FROM order_items
WHERE product_count >= 2
```

<img src="{{ site.baseurl }}/images/2plusproducts.png">

The dataset contains exclusively single-item orders, with no orders including multiple products. This significantly constrains the analytical opportunities, as use cases such as product affinity analysis, cross-sell identification, and basket composition analysis cannot be reliably performed.


### 2.  Revenue Analysis

<!--#### 2.A. Sales revenue  by product category

With nearly five years of data available, we can now analyze revenue by category to obtain an overall view of sales performance

```sql
SELECT  Category, ROUND (SUM (UnitPrice * Quantity * (1 - Discount)), 2) AS revenue
FROM `project-sales-dataset.sales_dataset_a.general_data`
GROUP BY Category
ORDER BY revenue DESC
```
<img src="{{ site.baseurl }}/images/category_sales.png">

Since the dataset contains sample data, the differences in revenue across categories are relatively minor. Using real business data, we could determine which product category contributed the most to overall sales revenue.

-->
#### 2.A. Sales revenue by category & year

Next, we will analyze category sales by individual year to better understand how sales patterns have evolved over time. This will help us identify top-performing segments, spot trends, and support more informed business decisions.

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

#### 2.B. Revenue by state & year
We could analyze the data by state across different years.

Можно увидеть, какие штаты генерируют наибольший объем продаж, а какие дают небольшой вклад.
Это помогает понять, где сосредоточена основная клиентская база.


Если смотреть по годам, можно рассчитать темпы роста.
Это может подсказать, куда направлять инвестиции, маркетинг или расширение команды.

Можно обнаружить регионы с падением выручки. (конкуренты? изменились цены? проблемы с доставкой или поддержкой локально?)


Если компания запускала инициативы в определенных регионах (новые магазины, рекламные кампании, склады), можно проверить результат.

Revenue по штатам и годам.
Growth Rate (% роста год к году).
Долю региона в общей выручке (% Share).
Количество заказов.

```sql
SELECT State, ROUND (SUM (UnitPrice * Quantity * (1 - Discount)), 2)   AS revenue 
FROM `project-sales-dataset.sales_dataset_a.general_data`
WHERE EXTRACT (YEAR FROM OrderDate) = 2020
GROUP BY State
ORDER BY revenue DESC
```

<img src="{{ site.baseurl }}/images/revenue_state.png">

Unfortunately, this would not provide additional insights in this case because the data is identical for each year. 
However, such an analysis could generally help identify differences in purchase volumes over time and compare annual purchasing patterns across states.

в идеале было бы посмотреть, чтобы понять насколько есть профит (а не только выручка)
Средний чек (AOV).
Прибыль (Profit), а не только выручку.
Выручку на одного клиента.
но мы не можем

#### 2.C. Monthly average order value trends
(не клиента, а если бы были уникальный айди могли бы посмотреть средний чек по клиентам) 
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

```sql
SELECT
  DATE_TRUNC(OrderDate, MONTH) AS month,
  ROUND (SUM (CASE WHEN OrderStatus = 'Delivered' THEN TotalAmount ELSE 0 END) -
  SUM(CASE WHEN OrderStatus = 'Returned'  THEN TotalAmount ELSE 0 END), 2) AS revenue,
  COUNT(CASE WHEN OrderStatus = 'Delivered' THEN OrderID END) AS orders,
  ROUND ((SUM(CASE WHEN OrderStatus = 'Delivered' THEN TotalAmount ELSE 0 END) -
    SUM(CASE WHEN OrderStatus = 'Returned'  THEN TotalAmount ELSE 0 END)) / 
    NULLIF(COUNT(CASE WHEN OrderStatus = 'Delivered' THEN OrderID END), 0), 2) AS aov
FROM `project-sales-dataset.sales_dataset_a.general_data`
WHERE OrderStatus IN ('Delivered', 'Returned')
GROUP BY 1
ORDER BY 1
```

### 3. Analysis of orders with multiple products

For cross-selling and upselling opportunities, it would be valuable to analyze which products are commonly purchased together to better understand category correlations and customer buying behavior.

However, in the current dataset (with test data), each order contains only a single product, which makes this type of basket analysis impossible.

Here, I check whether there are any orders containing two or more products.

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

### 4. одновременно мы можем посмотреть средний заказ по годам 
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

### 5. Annual revenue by customer

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

In this dataset, the Customer ID is not unique, which prevents us from reliably aggregating customer-level data. Since customer names may be duplicated, it is not possible to accurately distinguish between individual customers.

As a result, a traditional RFM analysis would not produce reliable or accurate insights based on the available data.

<img src="{{ site.baseurl }}/images/not_unique_id.png">

## некоторые продукты популярны только в отдельных штатах



## Suggestions for dashboards


## Insights & Conclusions

 ограничения:
 не уникальный кастомер айди 
 нет заказов с двумя товарами
тестовые данные слишком однообразны и усреднены

какие выводы мы могли бы сделать: 
- если бы были данные по себестоимости, мы могли бы посмотреть выручку и это был бы один из главных параметров рассчетов и идей
- какие катогории товаров приносят больше выручки (и является ли это трендом сквозь годы)
- какие товары с какими чаще всего берут - кросс сейлс
- если у покупателей схожий набор товаров (не в одном заказе, а на протяжении времени), то может им стоит предложить то, что брули другие, а они еще не брали (исключая корнер-кейсы типа товаров для детей и товаров для животных)
- посмотреть продажи по штатам, скидки по штатам, возможно в какие-то штатах/городах, стоит скидку уменьшить (например, потому что нам это не очень выгодно), а в других - увеличить
- нет ли аномальных трендов (например, отсутствие роста продаж )
