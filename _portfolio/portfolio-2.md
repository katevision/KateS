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
Revenue = Unit Price × Quantity × (1 − Discount)

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

The analysis confirms that this field is not unique.
As a result, a traditional RFM analysis would not produce reliable or accurate insights based on the available data.
Consequently, certain analyses cannot be performed reliably, as they depend on the availability of unique customer identifiers for accurate customer-level insights.

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

#### 2.A. Sales revenue  by product category

With nearly five years of data available, we can now analyze revenue by category to obtain an overall view of sales performance

```sql
SELECT  Category, ROUND (SUM (UnitPrice * Quantity * (1 - Discount)), 2) AS revenue
FROM `project-sales-dataset.sales_dataset_a.general_data`
GROUP BY Category
ORDER BY revenue DESC
```
<img src="{{ site.baseurl }}/images/category_sales.png">

Since the dataset contains sample data, the differences in revenue across categories are relatively minor. Using real business data, we could determine which product category contributed the most to overall sales revenue.


#### 2.B. Sales revenue by category & year

We can make  we will analyze category sales by individual year to better understand how sales patterns have evolved over time. This will help us identify top-performing segments, spot trends, and support more informed business decisions.

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

#### 2.C. Revenue by state & year
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

#### 2.D. Monthly average order value trends
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

To provide a more detailed view of category performance, I analyzed revenue, order volume, and average order value by year, along with their year-over-year growth rates. This approach makes it possible to assess not only overall growth trends but also the factors driving those changes.


<details markdown="1">
  <summary> <strong>View SQL</strong> </summary>

```sql
WITH yearly_metrics AS (
    SELECT
        EXTRACT(YEAR FROM OrderDate) AS year,
        Category,

        -- Revenue
        ROUND(SUM(UnitPrice * Quantity * (1 - Discount)), 2) AS revenue,

        -- Orders
        COUNT(DISTINCT OrderID) AS orders_count,

        -- Average Order Value
        ROUND (SUM (UnitPrice * Quantity * (1 - Discount))
            / COUNT(DISTINCT OrderID), 2 ) AS avg_order_value

    FROM `project-sales-dataset.sales_dataset_a.general_data`
    GROUP BY 1, 2)

SELECT
    year,
    Category,

    revenue,

    ROUND( 100 * (
            revenue
            - LAG(revenue) OVER (
                PARTITION BY Category
                ORDER BY year)
        )
        / NULLIF (LAG (revenue) OVER (PARTITION BY Category
                ORDER BY year ), 0 ), 2) AS revenue_growth_pct,

    orders_count,

    ROUND( 100 * (
            orders_count
            - LAG(orders_count) OVER (
                PARTITION BY Category
                ORDER BY year))
        / NULLIF(
            LAG(orders_count) OVER (
                PARTITION BY Category
                ORDER BY year), 0), 2) AS orders_growth_pct,

    avg_order_value,

    ROUND(
        100 * (avg_order_value
            - LAG(avg_order_value) OVER (
                PARTITION BY Category
                ORDER BY year) )
        / NULLIF(
            LAG(avg_order_value) OVER (
                PARTITION BY Category
                ORDER BY year), 0), 2) AS aov_growth_pct

FROM yearly_metrics
ORDER BY Category, year
```
</details>


<img src="{{ site.baseurl }}/images/all metrics by year.png">

To gain a more detailed understanding of performance trends, I extended the analysis to the monthly level, examining the same metrics across individual months rather than annual periods.

<img src="{{ site.baseurl }}/images/all_metrics_by_month.png">

<a href="/KateS/images/all_metrics_by_month.png" class="my-popup"> 
  <img src="/KateS/images/all_metrics_by_month.png" alt="monthly">
</a>

### 3. Regional Analysis

#### 3.A. Revenue by state 

Identify top-performing states and assess their contribution to overall revenue, based on the latest available 12 months of data.

```sql
WITH state_sales AS (
  SELECT
    State,
    COUNT(DISTINCT OrderID) AS Orders,
    SUM(Quantity) AS Units_Sold,
    SUM(
      UnitPrice * Quantity * (1 - COALESCE(Discount, 0))
    ) AS Revenue
  FROM `project-sales-dataset.sales_dataset_a.general_data`
  WHERE OrderDate >= '2024-01-01'
    AND OrderDate < '2025-01-01'
  GROUP BY State
)
```

<img src="{{ site.baseurl }}/images/Revenue_state_orders_units.png">

 One important note: the dataset contains data for only 13 states, so the analysis reflects performance within this subset rather than across all U.S. states.


#### 3.B. Discount Analysis by state 

These metrics help assess the effectiveness and cost of discounting strategies across states:

Average Discount (%) — shows how aggressively discounts are being used in each market.
Discount as % of Revenue — quantifies how much revenue is being sacrificed to drive sales, highlighting the true financial impact of promotions.
Orders with Discount (%) — indicates the dependence on discounts to generate demand and close sales.

We are trying to investigate: Are discounts driving sustainable sales growth, or are certain states relying too heavily on promotions at the expense of revenue and profitability?
A more detailed analysis may require the data to be broken down by quarter or by month.

<details markdown="1">
  <summary> <strong>View SQL</strong> </summary>

```sql
WITH state_metrics AS (
  SELECT
    State,

    AVG(Discount) * 100 AS Average_Discount_Pct,

    SUM(UnitPrice * Quantity * Discount) AS Discount_Amount,

    SUM(UnitPrice * Quantity * (1 - Discount)) AS Revenue,

    COUNT(DISTINCT CASE
      WHEN Discount > 0 THEN OrderID
    END) AS Discounted_Orders,

    COUNT(DISTINCT OrderID) AS Total_Orders

  FROM `project-sales-dataset.sales_dataset_a.general_data`
  WHERE OrderDate >= '2024-01-01'
    AND OrderDate < '2025-01-01'
  GROUP BY State
)

SELECT
  State,

  ROUND(Average_Discount_Pct, 2) AS Average_Discount_Pct,

  ROUND(
    100 * Discount_Amount /
    NULLIF(Revenue, 0),
    2
  ) AS Discount_as_Pct_of_Revenue,

  ROUND(
    100 * Discounted_Orders /
    NULLIF(Total_Orders, 0),
    2
  ) AS Pct_Orders_With_Discount

FROM state_metrics
ORDER BY Revenue DESC
```
</details>


<img src="{{ site.baseurl }}/images/discounts_state.png">



#### 3.C. Top categories by state 

This analysis helps identify key category demand drivers across states, reveal regional differences in customer preferences, support localized assortment and marketing strategies, and highlight potential over-reliance on a single category within a state.

For a more detailed understanding of each region, we can also perform this analysis separately for each state.


<details markdown="1">
  <summary> <strong>View SQL</strong> </summary>
  
```sql
WITH category_state AS (
  SELECT
    State,
    Category,
    SUM(UnitPrice * Quantity * (1 - COALESCE(Discount, 0))) AS Revenue,
    SUM(Quantity) AS Units_Sold
  FROM `project-sales-dataset.sales_dataset_a.general_data`
  WHERE OrderDate >= '2024-01-01'
    AND OrderDate < '2025-01-01'
  GROUP BY State, Category
),

ranked AS (
  SELECT
    State,
    Category,
    Revenue,
    Units_Sold,
    RANK() OVER (
      PARTITION BY State
      ORDER BY Revenue DESC
    ) AS rn
  FROM category_state
)

SELECT
  State,
  Category,
  ROUND(Revenue, 2) AS Revenue,
  Units_Sold
FROM ranked
WHERE rn = 1
ORDER BY Revenue DESC
```
</details>


<img src="{{ site.baseurl }}/images/top_category_state.png">


#### 3.D. Gross Sales, Discount Amount, Net Revenue, and Shipping Costs by state and year

I analyzed Gross Sales, Discount Amount, Net Revenue, and Shipping Costs by state and year to evaluate the impact of discounting and logistics expenses on sales performance.

<details markdown="1">
  <summary> <strong>View SQL</strong> </summary>
  
```sql
WITH state_year_sales AS (
    SELECT
        EXTRACT(YEAR FROM OrderDate) AS year,
        State AS state,

        -- Sales before discounts
        SUM(
            UnitPrice * Quantity
        ) AS gross_sales,

        -- Discount amount in currency
        SUM(
            UnitPrice * Quantity * COALESCE(Discount, 0)
        ) AS discount_amount,

        -- Total shipping costs
        SUM(
            COALESCE(ShippingCost, 0)
        ) AS shipping_cost

    FROM `project-sales-dataset.sales_dataset_a.general_data`
    GROUP BY
        year,
        state
)

SELECT
    year,
    state,

    ROUND(gross_sales, 2) AS gross_sales,

    ROUND(discount_amount, 2) AS discount_amount,

    ROUND(
        gross_sales - discount_amount,
        2
    ) AS revenue,

    ROUND(shipping_cost, 2) AS shipping_cost

FROM state_year_sales
ORDER BY
    state,
    year
```
</details>

<img src="{{ site.baseurl }}/images/state_year_revenue _discount_shipping.png">


более глубокое погружение в каждый штат и его аналитику - отдельной сложенной вкладкой




### 4. Analysis of products

#### 4.A. Identify top-performing, growing, and declining products to support portfolio optimization 

Evaluate product performance over time by measuring sales volume, revenue contribution, and year-over-year growth to identify top-performing products, emerging growth opportunities, and declining items that may require portfolio optimization.

This analysis helps answer the following business questions.
Which products:
- generate the largest share of revenue?
- have the highest sales volume?
- are experiencing the strongest year-over-year growth?
- are showing declining demand?
How much does each product contribute to total company revenue?
Which products should be prioritized for growth, and which should be reviewed or phased out of the portfolio?

<details markdown="1">
  <summary> <strong>View SQL</strong> </summary>
  
```sql
WITH product_sales AS (
    SELECT
        EXTRACT(YEAR FROM OrderDate) AS sales_year,
        ProductID,
        ProductName,
        Category,
        Brand,

        SUM(
            UnitPrice * Quantity * (1 - COALESCE(Discount, 0))
        ) AS revenue,

        COUNT(DISTINCT OrderID) AS orders,

        SUM(Quantity) AS units_sold

    FROM `project-sales-dataset.sales_dataset_a.general_data` 

    GROUP BY
        sales_year,
        ProductID,
        ProductName,
        Category,
        Brand
),

product_growth AS (
    SELECT
        sales_year,
        ProductID,
        ProductName,
        Category,
        Brand,
        revenue,
        orders,
        units_sold,

        revenue
            / SUM(revenue) OVER (PARTITION BY sales_year)
            * 100 AS revenue_share_pct,

        LAG(revenue) OVER (
            PARTITION BY ProductID
            ORDER BY sales_year
        ) AS previous_revenue,

        LAG(orders) OVER (
            PARTITION BY ProductID
            ORDER BY sales_year
        ) AS previous_orders

    FROM product_sales
)

SELECT
    sales_year,
    ProductID,
    ProductName,
    Category,
    Brand,

    ROUND(revenue, 2) AS revenue,

    orders,

    units_sold,

    ROUND(revenue_share_pct, 2) AS revenue_share_pct,

    ROUND(
        (revenue - previous_revenue)
        / NULLIF(previous_revenue, 0) * 100,
        2
    ) AS revenue_growth_yoy,

    ROUND(
        (orders - previous_orders)
        / NULLIF(previous_orders, 0) * 100,
        2
    ) AS order_growth_yoy

FROM product_growth

ORDER BY
    sales_year,
    revenue DESC
```
</details>

<img src="{{ site.baseurl }}/images/overall_analitycs_products.png">

-------------------------------------------------------------------------------------------

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

<!-- Лайтбокс -->
<a href="/KateS/images/all_metrics_by_month.png" class="my-lightbox">
  <img src="/KateS/images/all_metrics_by_month.png" alt="monthly">
</a>

<div id="lightbox" onclick="this.style.display='none'" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center;">
  <img id="lightbox-img" src="" onclick="event.stopPropagation()" style="max-width:90%; max-height:90vh; object-fit:contain;">
</div>
