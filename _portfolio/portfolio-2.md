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

**Tools Used:** Excel, MySQL, Tableau

[Datasets Used](https://www.kaggle.com/datasets/rohiteng/amazon-sales-dataset) - link

SQL Analysis (Code) - link

Netflix Dashboard - Tableau - link

## Business Problem:

Conduct an analysis of Amazon sales data to identify demand patterns, profitability drivers, and cost inefficiencies in order to develop recommendations for increasing revenue, optimizing product assortment, and improving operational efficiency.

## How I Plan On Solving the Problem:

To extract meaningful insights from the dataset, I used SQL and Tableau for data analysis and visualization. Visual representations of the data helped identify trends, patterns, and key factors influencing sales performance and business outcomes. The most important part of the analytics process is asking the right questions of both the business and the data, as well as drawing meaningful conclusions from the insights obtained.

## Questions I Wanted To Answer From the Dataset:

1. We would like to analyze profit and sales volume across different product categories, cities, and time periods in order to identify trends, regional performance differences, and potential growth opportunities
  
Since our primary goal is to understand profitability, revenue, and operational efficiency, we first need to identify and validate the data available in the dataset. During the exploration process, I discovered a column called TotalAmount that lacked a clear description, so we verified what components were included in its calculation.
After validation, I confirmed that TotalAmount consists of:


*Unit Price × Quantity
*Minus Discount
*Plus Shipping Costs
*Plus Taxes

Therefore, revenue can be defined as:
Revenue = (Unit Price × Quantity) − Discount
