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

<img src='/images/total_amount_check.png'>

 During the exploration process, I discovered a column called TotalAmount that lacked a clear description, so we verified what components were included in its calculation.
After validation, I confirmed that TotalAmount consists of:

* Unit Price × Quantity
* Minus Discount
* Plus Shipping Costs
* Plus Taxes

Therefore, revenue can be defined as:
Revenue = (Unit Price × Quantity) − Discount

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

<img src='/images/revenue category year.png'>


